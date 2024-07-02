const mongoose = require('mongoose')

const groupSessionSchema = new mongoose.Schema(
    {
       slotName:{type:mongoose.Schema.Types.ObjectId,ref:'Slot'},
       clientName:[{
            clientId: {type:mongoose.Schema.Types.ObjectId,ref:'client'}
        }],
       therapistName:[{
            therapistId: {type:mongoose.Schema.Types.ObjectId,ref:'User'}
        }],
        status:{type: Boolean, default:false}
    }
)

const groupSessionModel = mongoose.model('GroupSession',groupSessionSchema)

module.exports = groupSessionModel