const mongoose = require('mongoose')

const waitinglistSchema = new mongoose.Schema(
    {
       clientId:{type:mongoose.Schema.Types.ObjectId,ref:'client'},
       sessionId:{type:mongoose.Schema.Types.ObjectId,ref:'Session', required:false},
       assessmentId: {type:mongoose.Schema.Types.ObjectId,ref:'Assessment', required:false},
       date : {type : Date},
    }
)

const waitinglistModel = mongoose.model('WaitingList',waitinglistSchema)

module.exports = waitinglistModel