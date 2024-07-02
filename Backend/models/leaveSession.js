const mongoose = require('mongoose');

const leaveSessionSchema = new mongoose.Schema(
    { 
        leaveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Leave'},
        slotName:{type:mongoose.Schema.Types.ObjectId,ref:'Slot'},
        clientName:{type:mongoose.Schema.Types.ObjectId,ref:'client'},
        assessmentDate: {type: Date, required: true},
        therapistName:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        sessionType : {type: String, required: true},
        status : {type: Boolean, default: false}
    }
)

const leaveSesssionModel = mongoose.model('LeaveSession',leaveSessionSchema)

module.exports = leaveSesssionModel