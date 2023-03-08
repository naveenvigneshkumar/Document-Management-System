const mongoose = require("mongoose");

const uploadSchema= mongoose.Schema({
    id: {type: String, required: true, unique:true}, 
    filename:{type: String, required: true },    
    filepath: { type:String, required:true },
    reviewerId: {type: mongoose.Schema.Types.ObjectId, ref:"users"},
    status: { type: String, enum: ['approved','unapproved'],default:'unapproved'},
},{
    timestamps: true
});

module.exports = mongoose.model('uploadmodel',uploadSchema);