const mongoose = require('mongoose')

const groupFeeMasterSchema = new mongoose.Schema(
    {
        groupMasterId:{type:mongoose.Schema.Types.ObjectId, ref:'GroupMaster'},
        // sessionType:{type:String, required:true},
        amountToBeCollected: {type: Number},
        collectedAmount:{type:Number, required:true},
        dateAndTime:{type:Date, default:Date.now()},
        recievedBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
        paymentMode:{type:String, required:true},
        remarks:{type: String},
        clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'client'},
        paymentDate:{type:Date, default:Date.now()},
        // outStanding:{type: Number, default: 0},
        // cloudinary_id : {type:String},
        // file_url : {type:String}
    }
)


const groupFeeMasterModel = mongoose.model('GroupFeeMaster',groupFeeMasterSchema)

module.exports = groupFeeMasterModel