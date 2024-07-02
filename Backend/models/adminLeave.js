const mongoose = require('mongoose')

const adminLeaveSchema = new mongoose.Schema({
  leaveType: { type: String },
  reason: { type: String },
  fromDate: { type: Date },
  toDate: { type: Date },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String },
});

const adminLeaveModel = mongoose.model('AdminLeave',adminLeaveSchema)

module.exports = adminLeaveModel