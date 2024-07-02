const express = require('express');
const router = express.Router();
const SeAssessmentForm = require('../models/seAssessmentForm')
const authToken = require('../routers/verifyToken');
const AssessmentMaster = require('../models/assessmentMaster');
const Assessment = require('../models/assessment');
const Slot  = require('../models/slot');
router.post('/seassessmentform', authToken, async(req,res)=>{
    try {
        const seAssessmentform = new SeAssessmentForm({
            date:req.body.date,
            updatedDate: req.body.updatedDate,
            assessmentMasterId:req.body.assessmentMasterId,
            informant : req.body.informant,
            strengthChild : req.body.strengthChild,
            parentalConcern : req.body.parentalConcern,
            fuctionalAreas : req.body.fuctionalAreas,
            specificEducationalAreas : req.body.specificEducationalAreas,
            provisonalDiadnosis : req.body.provisonalDiadnosis,
            environmentalStreams : req.body.environmentalStreams,
            environmentalBarriers : req.body.environmentalBarriers
        })


        const assessmentMaster =  await AssessmentMaster.findById(req.body.assessmentMasterId)
        let assessmentId = assessmentMaster.assessment_id;
        const assessment = await Assessment.findById(assessmentId);
        let slotId= assessment.slotName
        const slot = await Slot.findById(slotId)
        slot.slotStatus= true;
        await slot.save()


        await seAssessmentform.save()
        res.send(seAssessmentform)
    } catch (error) {
        res.send(error)
    }
})

router.get('/seassessmentform', authToken,async(req,res)=>{
    try {
        const seAssessmentform = await SeAssessmentForm.find({}).sort({date: -1})
        .populate('assessmentMasterId')
        res.send(seAssessmentform)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/seassessment/:id', authToken,async(req,res)=>{
    try {
        const seAssessmentform = await SeAssessmentForm.findOne({assessmentMasterId:req.params.id}).populate('assessmentMasterId')
        res.send(seAssessmentform)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/seassessmentform/:id', authToken,async(req,res)=>{
    try {
        const seAssessmentform = await SeAssessmentForm.findOne({_id:req.params.id})
        res.send(seAssessmentform)       
    } catch (error) {
        res.send(error)       
    }
})

router.patch('/seassessmentform/:id', authToken, async(req,res)=>{
    try {
        const seAssessmentform = await SeAssessmentForm.findByIdAndUpdate(req.params.id)
        seAssessmentform.updatedDate = req.body.updatedDate
        seAssessmentform.informant = req.body.informant,
        seAssessmentform.strengthChild = req.body.strengthChild,
        seAssessmentform.parentalConcern = req.body.parentalConcern,
        seAssessmentform.fuctionalAreas = req.body.fuctionalAreas,
        seAssessmentform.specificEducationalAreas = req.body.specificEducationalAreas,
        seAssessmentform.provisonalDiadnosis = req.body.provisonalDiadnosis,
        seAssessmentform.environmentalStreams = req.body.environmentalStreams,
        seAssessmentform.environmentalBarriers = req.body.environmentalBarriers
        
        await seAssessmentform.save()
        res.send(seAssessmentform)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router