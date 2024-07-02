const mongoose = require('mongoose')

const celebrationSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        birthDate :{type:Date,required:true},     
        joiningDate :{type:Date,required:true},
    }
)



const celebrationModel = mongoose.model('Celebration',celebrationSchema)

module.exports = celebrationModel