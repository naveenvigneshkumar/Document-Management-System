const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const users = require('../model/users');
const uploadmodel = require('../model/upload');
const {apiResponse} = require('../response');
const StatusCodes = require('http-status-codes');
const {assignReviewer} = require('../service/upload.service');
const path = require('path');               
const fs = require('fs-extra');             
const {adminEmail} = require('../../config')

const register = async(req, res)=>{
    let {name,password, email} = req.body
    try{	 	
		var hashPassword = await bcrypt.hash(password, 10);
        let status = (email == adminEmail) ?'active':'deactive';
        let role = (email == adminEmail) ?'admin':'guest';
		const save = await new users({
			name: name,
			id: Math.floor(1000 + Math.random() * 9000),
			email : email,
			password: hashPassword,
            status: status,
            role: role,
		}).save();
        apiResponse(req,res,"Register Successfully", StatusCodes.CREATED);        
	}catch(err){
        apiResponse(req,res,{error:true, message: err},StatusCodes.INTERNAL_SERVER_ERROR); 
	}
}

const login = async (req,res)=>{
    let {email, password} = req.body
    try{
        var checkUser= await users.findOne({email: email, status:'active'});        
        if(!checkUser ||!checkUser.email){
            apiResponse(req, res, {error:true,message:'user not found'},StatusCodes.NOT_FOUND);
			
            return;
		}
		var check_password= await bcrypt.compare(password , checkUser.password)
		if(!check_password){
            apiResponse(req,res,{error:true,message:'Incorrect password'}, StatusCodes.BAD_REQUEST);
			
            return;
		}

		let token = await jwt.sign({id:checkUser.id,email:checkUser.email,role:checkUser.role}, process.env.JWT,{ expiresIn: '1h' });
        
        apiResponse(req,res,{token},StatusCodes.OK); 
        return;
    }catch(err){
        console.log(err);
        apiResponse(req,res, err.message || err ,StatusCodes.INTERNAL_SERVER_ERROR); 
    }
}

const uploadFile = async (req,res)=>{
    const uploadPath = path.join(__dirname, 'upload/');

    try{
        req.pipe(req.busboy); 
        req.busboy.on('file', (fieldname, file, filename) => {
            let newFileName= Date.now()+'_'+filename.filename;
            console.log(`Upload of '${newFileName}' started`);
            const fstream = fs.createWriteStream(path.join(uploadPath, newFileName));
            file.pipe(fstream);
            fstream.on('close', async () => {
                console.log(`Upload of '${newFileName}' finished`);
                const assignReview=await assignReviewer( req,res,path.join(uploadPath, newFileName),newFileName , req.id);  
                console.log(assignReview);
                if(assignReview){
                    apiResponse(req,res, `Your File name '${newFileName}' is Uploaded and assigned to ${assignReview}`,StatusCodes.OK);
                } 
            });
             
        });
        
    }catch(err){
        apiResponse(req,res, err,StatusCodes.BAD_REQUEST);
    }
}

const getdoclist = async (req,res)=>{
    let { status} = req.query;
    try{
        let getListDoc= await uploadmodel.find({guestId: req.id, status: status || 'unapproved'}).select('id filename reviewerId status createdAt ').populate('reviewerId','name id');
        
        if(getListDoc.length == 0){
            apiResponse(req,res, 'No record',StatusCodes.BAD_GATEWAY);    
            return;
        }
        apiResponse(req,res, getListDoc);    
    }catch(err){
        apiResponse(req, res,err, StatusCodes.BAD_REQUEST);
    }
}

const getDoc = async (req,res)=>{
    let { file} = req.query;
    if(!file){
        apiResponse(req, res,"File Id is required", StatusCodes.BAD_REQUEST);
        return;
    }
    try{
        let getDoc= await uploadmodel.findOne({guestId: req.id, id:file }).select('id filename reviewerId status createdAt ').populate('reviewerId','name id');
        apiResponse(req,res, getDoc);    
    }catch(err){
        apiResponse(req, res,err, StatusCodes.BAD_REQUEST);
    }
}

module.exports = {
    register,
    login,
    uploadFile,
    getdoclist,
    getDoc,
}