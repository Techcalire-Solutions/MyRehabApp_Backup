const mongoose = require('mongoose');

const pendingFeesSchema = new mongoose.Schema({
    sessionMasterId: {type : mongoose.Schema.Types.ObjectId, ref : 'SessionMaster', required: false},
    lmcId: {type : mongoose.Schema.Types.ObjectId, ref: 'Lmc', required: false},
    groupMasterId: {type : mongoose.Schema.Types.ObjectId, ref : 'GroupMaster', required: false},
    pendingAmount: {type : Number, required: true},
    type: {type : String},
    clientId: {type : mongoose.Schema.Types.ObjectId, ref: 'client', required: false}
})

module.exports = mongoose.model('PendingFees', pendingFeesSchema)