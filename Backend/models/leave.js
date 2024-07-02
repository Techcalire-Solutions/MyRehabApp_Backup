const mongoose = require('mongoose')

const leaveSchema = new mongoose.Schema(
    {
        clientId : {type: mongoose.Schema.Types.ObjectId, ref:'client'},
        fromDate : {type: Date, required: true},
        toDate : {type: Date, required: true},
        status : {type: String, default: 'Accepted'},
        reason : {type: String, default: 'OnLeave'},
        slots : [{
            slotId : {type: mongoose.Schema.Types.ObjectId, ref: 'Slot'},
            status: {type: Boolean, default: false},
        }]
    }
)


const leaveModel = mongoose.model('Leave', leaveSchema)

module.exports = leaveModel