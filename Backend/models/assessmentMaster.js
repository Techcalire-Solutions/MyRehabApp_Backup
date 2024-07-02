const mongoose = require('mongoose')
const assessmentMaster = new mongoose.Schema(
    {     
        date:{type:Date,default:Date.now},
        assessment_id :{type:mongoose.Schema.Types.ObjectId, ref:'Assessment', required: false},
        leave_session_id : {type:mongoose.Schema.Types.ObjectId, ref:'LeaveSession', required: false},
        compensation_assessment_id : {type:mongoose.Schema.Types.ObjectId, ref:'CompensationSession', required: false},
        therapistName :{type :String},
        assessmentFee:{type:Number},
        feeStatus:{type:Boolean},
        sessionStatus: {type: String, default: "Assessment", required: true},
        category: {type:String},
        therapistId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
        amountToInara : {type: Number},
        amountToTherapist : {type: Number}
    }
)

const assessmentMasterModel = mongoose.model('AssessmentMaster',assessmentMaster)
module.exports = assessmentMasterModel