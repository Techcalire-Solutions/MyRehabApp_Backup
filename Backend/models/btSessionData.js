const mongoose = require('mongoose')

const btSessionSchema = new mongoose.Schema(
    {
        date:{type:Date, default:Date.now()},
        updatedDate:{type:Date, default:Date.now()},
        session_master_id:{type:mongoose.Schema.Types.ObjectId,ref:'SessionMaster'},
        sitting : {type:String},
        remarksSitting : {type:String},
        eyeContact : {type:String},
        remarksEyeContact : {type:String},
        attention : {type:String},
        remarksAttention : {type:String},
        mood : {type:String},
        remarksMood : {type:String},
        activities : {type:String},
        remarksActivities : {type:String},
        comprehensionInstructions : {type:String},
        remarksComprehensionInstructions : {type:String},
        responseInstructions : {type:String},
        remarksResponseInstructions : {type:String},
        waiting : {type:String},
        remarksWaiting : {type:String},
        compliance : {type:String},
        remarksCompliance : {type:String},
        behaviour : {type:String},
        remarksBehaviour : {type:String},
        communication : {type:String},
        remarksCommunication : {type:String},
      
        throwThings : {type:String},
        remarksThrowThings : {type:String},
        tearsThings : {type:String},
        remarksTearsThings : {type:String},
        angryProne : {type:String},
        remarksAngryProne : {type:String},
        selfInjurious : {type:String},
        remarksSelfInjurious : {type:String},
        repetitive : {type:String},
        remarksRepetitive : {type:String},
        tantrums : {type:String},
        remarksTantrums : {type:String},
        climbsFurniture : {type:String},
        remarksClimbsFurniture : {type:String},
        disruptiveBehaviour : {type:String},
        remarksDisruptiveBehaviour : {type:String}
    }
)


const btSessionModel = mongoose.model('BtSession',btSessionSchema)

module.exports = btSessionModel