const mongoose = require('mongoose')

const lmcSchema = new mongoose.Schema(
    {
        clientId : {type: mongoose.Schema.Types.ObjectId, ref:'client'},
        date : {type: Date, required: true},
        slots : [{
            slotId : {type: mongoose.Schema.Types.ObjectId, ref: 'Slot'},
            therapistId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            amountToTherapist:{type:Number},
            amountToInara:{type:Number},
            status: {type: Boolean, default: false},
            feeStatus: {type: Boolean, required: true, default: false},
        }],
        sessionStatus : {type: String, required: true},
        sessionFee: {type: Number, required: true},
        // session_id: {type: mongoose.Schema.Types.ObjectId, ref:'Session'},
        concession : {type: Number, required: true},         
    }
)


const lmcModel = mongoose.model('Lmc', lmcSchema)

module.exports = lmcModel