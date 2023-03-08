const StatusCodes = require('http-status-codes');
const uploadmodel = require('../model/upload');
const users = require('../model/users');
const {apiResponse} = require('../response');

const assignReviewer = async (req,res,filepath,filename)=>{
    try{
        let reviewerId= await users.findOne({role: 'reviewer', status: 'active'}).select('_id count').sort({count: 1})
        const save = await new uploadmodel({
            filename: filename,
            filepath: filepath,
            id: Math.floor(1000 + Math.random() * 9000),
            reviewerId: reviewerId._id,
        }).save();
        await users.findOneAndUpdate({_id:reviewerId._id}, {$set:{count:reviewerId.count +1}});
        let fetch = await uploadmodel.findOne({_id: save._id}).select('_id filename filepath reviewerId').populate('reviewerId','name id');      
        return fetch.reviewerId.name;
    }catch(err){
        apiResponse(req,res, err,StatusCodes.BAD_REQUEST);
    }
}

module.exports = {
    assignReviewer
}