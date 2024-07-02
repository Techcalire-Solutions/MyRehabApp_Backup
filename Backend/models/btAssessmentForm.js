const mongoose = require("mongoose")


const btAssessmentSchema = new mongoose.Schema({

    date:{type:Date, default:Date.now()},
    updatedDate:{type:Date, default:Date.now()},
    assessmentMasterId:{type:mongoose.Schema.Types.ObjectId,ref:'AssessmentMaster'},
   kco: {type :String},
   informants: {type :String},
   presentingConcerns: {type :String},
   personalHistory: {type :String},
   gadgetExposure:{type:String},
   seizure: {type :String},
   drugUsage: {type :String},
   therapyHistory: {type :String},
   familyHistory:{type :String},
   developmentalMilestones: {type :String},
   occupationalHistory: {type :String},
   schoolHistory: {type :String},
   behaviouralConcerns: {type :String},
   physicalAppearance:{type :String},
   activityLevel: {type :String},
   attentionConcentration: {type :String},
   emotionalRegulation: {type :String},
   attachment:{type :String},
   vsms: {type:Boolean, default: false},
   ddst:{type :Boolean, default :false},
   sfbt: {type :Boolean, default :false},
   gdt:{type :Boolean, default :false},
   bkt: {type :Boolean, default :false},
   mchat: {type :Boolean, default :false},
   vanderbelt: {type :Boolean, default :false},
   dpcl:{type :Boolean, default :false},
   nimhans: {type :Boolean, default :false},
   testFindings:{type :String},
   impression: {type: String},
   actionPlanforFuture:{type :String}



})

const btAssessmentModel = mongoose.model('BtAssessment',btAssessmentSchema)

module.exports = btAssessmentModel