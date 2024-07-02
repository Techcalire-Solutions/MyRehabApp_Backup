const mongoose = require('mongoose')
const groupMaster = new mongoose.Schema(
    {   
        date: {type: Date, default:Date.now},
        session_id: {type: mongoose.Schema.Types.ObjectId, ref:'GroupSession'},  
        clientName:[{
            clientId: {type:mongoose.Schema.Types.ObjectId,ref:'client'},
            concession: { type: Number},
            sessionFee: {type: Number},
            feeStatus: {type: Boolean},
        }],
        therapistName:[{
            therapistId: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
            amountToInara : {type: Number},
            amountToTherapist : {type: Number}
        }],
    }
)

const groupMasterModel = mongoose.model('GroupMaster',groupMaster)
module.exports = groupMasterModel