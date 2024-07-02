import { AssessmentMaster } from "./assessmentMaster";

export interface BtAssessmentForm{
    _id:String,
    date:Date,
    updatedDate:Date,
    assessmentMasterId:AssessmentMaster,
    kco:String,
    informants:String,
    presentingConcerns:String,
    personalHistory:String,
    gadgetExposure:String,
    seizure:String,
    drugUsage:String,
    therapyHistory:String,
    familyHistory:String,
    developmentalMilestones:String,
    occupationalHistory:String,
    schoolHistory:String,
    behaviouralConcerns:String,
    physicalAppearance:String,
    activityLevel:String,
    attentionConcentration:String,
    emotionalRegulation:String,
    attachment:String,
    vsms:Boolean,
    ddst:Boolean,
    sfbt:Boolean,
    gdt:Boolean,
    bkt:Boolean,
    mchat:Boolean,
    vanderbelt:Boolean,
    dpcl:Boolean,
    nimhans:Boolean,
    testFindings:String,
    impression:String,
    actionPlanforFuture:String



}
