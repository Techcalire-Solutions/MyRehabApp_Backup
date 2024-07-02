const mongoose = require('mongoose')



const slotSchema = new mongoose.Schema(
    {
        roomName :{type:mongoose.Schema.Types.ObjectId, ref:'User'},
        slotName:{type:String,required:true},
        startTime :{type:String,required:true},
        endTime :{type:String,required:true},
        therapyCategory:{type:mongoose.Types.ObjectId, ref:'Category'},
        weekDay:{type:String,required:true},
        onCall: {type: Boolean, default: false}
    }
)


const slotModel = mongoose.model('Slot',slotSchema)

module.exports = slotModel