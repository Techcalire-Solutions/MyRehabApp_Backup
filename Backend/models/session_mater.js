const mongoose = require('mongoose')
const sessionMaster = new mongoose.Schema(
    {     
        date: {type: Date},
        session_id: {type: mongoose.Schema.Types.ObjectId, ref:'Session', required: false},
        leave_session_id: {type: mongoose.Schema.Types.ObjectId, ref:'LeaveSession', required: false},
        compensation_session_id : {type: mongoose.Schema.Types.ObjectId, ref: 'CompensationSession', required: false},
        therapistName: {type: String},
        sessionFee: {type: Number},
        feeStatus: {type: Boolean},
        concession: {type: Number},
        sessionStatus: {type: String},
        category : {type: String},
        amountToInara : {type: Number},
        amountToTherapist : {type: Number},
        therapistId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }
)

const sessionMasterModel = mongoose.model('SessionMaster',sessionMaster)
module.exports = sessionMasterModel