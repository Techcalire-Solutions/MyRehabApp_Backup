const mongoose = require('mongoose')

const seGoalSchema = new mongoose.Schema(
    {
        goal :{type:String},
        expectPeriod : {type:String},
        status : {type:Boolean, default: false},
        sessionId : {type:mongoose.Schema.Types.ObjectId, ref:'Session'}
    }
)


const seGoalModel = mongoose.model('SeGoal',seGoalSchema)

module.exports = seGoalModel