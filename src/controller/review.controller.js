const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const users = require('../model/users');
const uploadmodel = require('../model/upload');
const {apiResponse} = require('../response');
const StatusCodes = require('http-status-codes');
const {assignReviewer} = require('../service/upload.service');
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const { findOne } = require('../model/users');

const reviewDoc = async (req, res)=>{
    let {action} = req.query;
    try {
        let getreviewId = await users.findOne({id:req.id}).select('_id');
        let getReviewList = await uploadmodel.find({reviewerId: getreviewId, status: action || 'unapproved'}).select('id filename filepath status createdAt').sort({createdAt: -1});
        apiResponse(req,res, getReviewList,StatusCodes.OK); 
    } catch (err) {
        apiResponse(req,res, err,StatusCodes.BAD_REQUEST); 
    }
}

const download = async (req,res)=>{
    let {file} = req?.query; 
    try {
        console.log({id:req.id});
        let getreviewId = await users.findOne({id:req.id}).select('_id');
        // let getreviewId = await users.findOne({id:1052}).select('_id');
        const getfilepath = await uploadmodel.findOne({reviewerId: getreviewId}).select('filepath filename');
        console.log(getfilepath);
        res.download(__dirname+`/upload/${getfilepath.filename}`);
        //  apiResponse(req,res, 'Download success fully'); 
        // res.send();
        
    }catch (err) {
        apiResponse(req,res, err,StatusCodes?.BAD_REQUEST); 
    }
}


module.exports = {  
      reviewDoc,
      download
}