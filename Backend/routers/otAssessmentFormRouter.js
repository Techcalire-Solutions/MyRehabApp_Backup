const express = require('express');
const router = express.Router();
const OtAssessmentForm = require('../models/otAssessmentForm')
const authToken = require('../routers/verifyToken');
const AssessmentMaster = require('../models/assessmentMaster');
const Assessment = require('../models/assessment');
const Slot  = require('../models/slot');
router.post('/otassessmentform', authToken, async(req,res)=>{
    try {
        const otAssessmentForm = new OtAssessmentForm({
            date:req.body.date,
            updatedDate: req.body.updatedDate,
            assessmentMasterId:req.body.assessmentMasterId,
            medicalDiagnosis: req.body.medicalDiagnosis,
            generalAppearence: req.body.generalAppearence,
            onObservation: req.body.onObservation,
            performanceAreas: req.body.performanceAreas,
            performanceComponents: req.body.performanceComponents,
            remarks: req.body.remarks
        })
        const assessmentMaster =  await AssessmentMaster.findById(req.body.assessmentMasterId)
        let assessmentId = assessmentMaster.assessment_id;
        const assessment = await Assessment.findById(assessmentId);
        let slotId= assessment.slotName
        const slot = await Slot.findById(slotId)
        slot.slotStatus= true;
        await slot.save()

        await otAssessmentForm.save()
        res.send(otAssessmentForm)
    } catch (error) {
        res.send(error)
    }
})

router.get('/otassessmentform', authToken,async(req,res)=>{
    try {
        const otAssessmentForm = await OtAssessmentForm.find({}).sort({date: -1})
        .populate('assessmentMasterId')
        res.send(otAssessmentForm)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/otassessment/:id', authToken,async(req,res)=>{
    try {
        const otAssessmentForm = await OtAssessmentForm.findOne({assessmentMasterId:req.params.id}).populate('assessmentMasterId')
        res.send(otAssessmentForm)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/otassessmentform/:id', authToken,async(req,res)=>{
    try {
        const otAssessmentForm = await OtAssessmentForm.findOne({_id:req.params.id})
        res.send(otAssessmentForm)       
    } catch (error) {
        res.send(error)       
    }
})

router.patch('/otassessmentform/:id', authToken, async(req,res)=>{
    try {
        const otAssessmentForm = await OtAssessmentForm.findByIdAndUpdate(req.params.id)
        otAssessmentForm.updatedDate = req.body.updatedDate
        otAssessmentForm.medicalDiagnosis = req.body.medicalDiagnosis,
        otAssessmentForm.generalAppearence = req.body.generalAppearence,
        otAssessmentForm.onObservation = req.body.onObservation,
        otAssessmentForm.performanceAreas = req.body.performanceAreas,
        otAssessmentForm.performanceComponents = req.body.performanceComponents,
        otAssessmentForm.remarks = req.body.remarks
        
        await otAssessmentForm.save()
        res.send(otAssessmentForm)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router