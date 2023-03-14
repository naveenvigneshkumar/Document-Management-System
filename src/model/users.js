const mongoose = require("mongoose");

const usersSchema= mongoose.Schema({
    name:{type: String, required: true ,trim: true },
    id: {type: String, required: true, unique:true}, 
    email: { type:String, required:true, unique:true },
    role: {type:String, required:true, default: 'guest'},
	password: { type: String, required: true ,  min: 8},
    count: {type: Number, default:0},
    status: { type: String, enum: ['active','deactive'],default:'deactive'},
},{
    timestamps: true
});

module.exports = mongoose.model('users',usersSchema);