const mongoose = require('mongoose')

const therapistLeaveSchema = new mongoose.Schema({
  leaveType: { type: String },
  reason: { type: String },
  fromDate: { type: Date },
  toDate: { type: Date },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String },
  compensation: [{
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "client" },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
    date: { type: Date }
  }]
});

const therapistLeaveModel = mongoose.model('TherapistLeave',therapistLeaveSchema)

module.exports = therapistLeaveModel