const express = require("express")
const router=express.Router();
const BtAssessment = require('../models/btAssessmentForm')
const authToken = require('../routers/verifyToken');
const AssessmentMaster = require('../models/assessmentMaster');
const Assessment = require('../models/assessment');
const Slot  = require('../models/slot');


router.post('/btassessmentform', authToken,async(req,res)=>{
    try {
        const { date,updatedDate,assessmentMasterId, kco,informants,presentingConcerns,
            personalHistory, gadgetExposure, seizure ,  drugUsage,therapyHistory,   familyHistory,developmentalMilestones, occupationalHistory,
            schoolHistory,behaviouralConcerns,physicalAppearance,activityLevel, attentionConcentration, emotionalRegulation,
            attachment,vsms,ddst,sfbt,gdt, bkt,mchat,vanderbelt,  dpcl,nimhans,testFindings,impression,actionPlanforFuture}=req.body
        
        
            const btAssessmentForm = new BtAssessment({   date,updatedDate,assessmentMasterId,kco,informants,presentingConcerns,
            personalHistory,gadgetExposure,  seizure ,  drugUsage,therapyHistory,   familyHistory,developmentalMilestones, occupationalHistory,
            schoolHistory,behaviouralConcerns,physicalAppearance,activityLevel, attentionConcentration, emotionalRegulation,
            attachment,vsms,ddst,sfbt,gdt, bkt,mchat,vanderbelt,  dpcl,nimhans,testFindings,impression,actionPlanforFuture
        })
      

        const assessmentMaster =  await AssessmentMaster.findById(req.body.assessmentMasterId)
        let assessmentId = assessmentMaster.assessment_id;
        const assessment = await Assessment.findById(assessmentId);
        let slotId= assessment.slotName
        const slot = await Slot.findById(slotId)
        slot.slotStatus= true;
        await slot.save()


        await btAssessmentForm.save()
        res.send(btAssessmentForm)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/btassessmentform', authToken, async(req,res)=>{
    try {
        const btAssessmentForm = await BtAssessment.find({}).sort({date: -1})
        .populate({
            path: 'assessmentMasterId',
            populate: {
                path: 'assessment_id',
                populate: {
                    path: 'therapistName',
                    populate: {
                        path: 'therapyCategory',
                    }
                },
                populate: {
                    path: 'clientName',
                },
                populate: {
                    path: 'slotName',
                }
            }
          })
        res.send(btAssessmentForm)

        
    } catch (error) {
        res.send(error)
        
    }
})


router.get('/btassessment/:id', authToken, async(req,res)=>{
    try {
        const btAssessmentForm = await BtAssessment.findOne({assessmentMasterId:req.params.id}).populate('assessmentMasterId')
        res.send(btAssessmentForm)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/btassessmentform/:id', authToken, async(req,res)=>{
    try {
        const btAssessmentForm = await BtAssessment.findOne({_id:req.params.id})
        res.send(btAssessmentForm)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.patch('/btassessmentform/:id', authToken, async(req,res)=>{
    try {

        const btAssessmentForm = await BtAssessment.findByIdAndUpdate(req.params.id)
        btAssessmentForm.date= req.body.date
        btAssessmentForm.updatedDate=req.body.updatedDate
        btAssessmentForm.kco= req.body.kco
        btAssessmentForm.informants= req.body.informants
        btAssessmentForm.presentingConcerns= req.body.presentingConcerns
        btAssessmentForm.personalHistory= req.body.personalHistory
        btAssessmentForm.seizure= req.body.seizure
        btAssessmentForm.drugUsage= req.body.drugUsage
        btAssessmentForm.therapyHistory= req.body.therapyHistory
        btAssessmentForm.familyHistory=req.body.familyHistory
        btAssessmentForm.developmentalMilestones=req.body.developmentalMilestones
        btAssessmentForm.occupationalHistory=req.body.occupationalHistory
        btAssessmentForm.schoolHistory=req.body.schoolHistory
        btAssessmentForm.behaviouralConcerns=req.body.behaviouralConcerns
        btAssessmentForm.physicalAppearance=req.body.physicalAppearance
        btAssessmentForm.activityLevel=req.body.activityLevel
        btAssessmentForm.attentionConcentration=req.body.attentionConcentration
        btAssessmentForm.emotionalRegulation=req.body.emotionalRegulation
        btAssessmentForm.attachment=req.body.attachment
        btAssessmentForm.vsms=req.body.vsms
        btAssessmentForm.ddst=req.body.ddst
        btAssessmentForm.sfbt=req.body.sfbt
        btAssessmentForm.gdt=req.body.gdt
        btAssessmentForm.bkt=req.body.bkt
        btAssessmentForm.mchat=req.body.mchat
        btAssessmentForm.vanderbelt=req.body.vanderbelt
        btAssessmentForm.dpcl=req.body.dpcl
        btAssessmentForm.nimhans=req.body.nimhans
        btAssessmentForm.testFindings=req.body.testFindings
        btAssessmentForm.impression=req.body.impression     

        await btAssessmentForm.save()
        res.send(btAssessmentForm)
        
    } catch (error) {
        res.send(error)
        
    }
})

module.exports = router