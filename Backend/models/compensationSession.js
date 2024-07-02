const mongoose = require('mongoose');

const compensationSessionSchema = new mongoose.Schema(
    { 
        therapistLeaveId: { type: mongoose.Schema.Types.ObjectId, ref: 'TherapistLeave'},
        slotName:{type:mongoose.Schema.Types.ObjectId,ref:'Slot'},
        clientName:{type:mongoose.Schema.Types.ObjectId,ref:'client'},
        date: {type: Date, required: true},
        therapistName:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        sessionType : {type: String, required: true},
        status : {type: Boolean, default: false}
    }
)

const compensationSessionModel = mongoose.model('CompensationSession',compensationSessionSchema)

module.exports = compensationSessionModel