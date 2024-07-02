const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type:String,required:true,min:6,max:255},
    email:{type:String,required:true,min:6,max:255},
    password:{type:String,required:true,min:6,max:1024},
    date:{type:Date,default:Date.now()},
    role:{type:String,required:true,min:6,max:255},
    therapyCategory:{type:mongoose.Schema.Types.ObjectId, ref:'Category'},
    companyId: {type:mongoose.Schema.Types.ObjectId, ref:'Company'},
    sharePercentage:{type:Number},
    isSalaried:{type:Boolean},
    md: {type : Boolean, default: false},
    qualifications: [{
        qualification: {type:String}
    }],
    experiences: [{
        experience: {type:String}
    }],
    idProof: {type: String},
    cloudinary_id : {type:String},
    file_url : {type:String},
    qualification_id : {type:String},
    qualification_file : {type:String},
    idProof_id : {type:String},
    idProof_file : {type:String},
    experience_id : {type:String},
    experience_file : {type:String}, 
})


const userModel = mongoose.model('User',userSchema)

module.exports = userModel


