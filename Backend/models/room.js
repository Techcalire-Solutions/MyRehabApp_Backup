const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
    {
        roomName :{type:String,required:true},     
    }
)



const roomModel = mongoose.model('Room',roomSchema)

module.exports = roomModel