const StatusCodes = require('http-status-codes');

const apiResponse = async (req,res, result, status = StatusCodes.OK)=>{
    res.status(status).json({result});
    return
}

module.exports = {
    apiResponse
};