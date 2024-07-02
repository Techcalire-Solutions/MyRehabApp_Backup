const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
    {
       slotName:{type:mongoose.Schema.Types.ObjectId,ref:'Slot'},
       clientName:{type:mongoose.Schema.Types.ObjectId,ref:'client'},
       therapistName:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
       status : {type : Boolean, default : false},
    //    remarks : {type : String},
       date : {type : Date},
       fees : {type : Number},
       discount : {type : Number}
    }
)

const sessionModel = mongoose.model('Session',sessionSchema)

module.exports = sessionModel