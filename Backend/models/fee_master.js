const mongoose = require('mongoose')

const feeMasterSchema = new mongoose.Schema(
    {
        sessionMasterId:{type:mongoose.Schema.Types.ObjectId, ref:'SessionMaster', required: false},
        lmcId: {type:mongoose.Schema.Types.ObjectId, ref:'Lmc', required: false},
        groupMasterId: {type:mongoose.Schema.Types.ObjectId, ref:'GroupMaster', required: false},
        sessionType:{type:String, required:true},
        amountToBeCollected:{type: Number},
        collectedAmount:{type:Number, required:true},
        dateAndTime:{type:Date},
        paymentDate:{type:Date},
        recievedBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
        paymentMode:{type:String, required:true},
        remarks:{type: String},
        cloudinary_id : {type:String},
        file_url : {type:String},
        collectedTo : {type: String},
        arrayId : {type:String}  
    }
)


const feeMasterModel = mongoose.model('FeeMaster',feeMasterSchema)

module.exports = feeMasterModel