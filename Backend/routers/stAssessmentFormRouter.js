const express = require('express');
const router = express.Router();
const StAssessment = require('../models/stAssessmentForm')
const authToken = require('../routers/verifyToken');
const AssessmentMaster = require('../models/assessmentMaster');
const Assessment = require('../models/assessment');
const Slot = require('../models/slot');
router.post('/stassessmentform', authToken, async (req, res) => {
    try {
        const { date, updatedDate, assessmentMasterId, childStrength, parentConcern, babbling,babblingRemarks, firstWord,firstWordRemarks, twoWord,twoWordRemarks, regression,regressionRemarks, impressionSpeech, neckControl,neckControlRemarks, sitting,sittingRemarks,
            walking,walkingRemarks, impressionMotor, structureLip, FunctionLip, structureTounge, functionTounge, structureTeeth, functionTeeth,
            structureAlveolus, functionAlveolus, structurePalate, functionPalate, structureUvula, functionUvula, structureMandible,
            functionMandible, sucking, swallowing, biting, chewing, blowing, drooling, otherConsultation, eyeContact, attentionConcentration,
            sittingTolerance, speechSkills, fluencyProfile, speechRate, effort, prosody, speechRating, stimulability, phonologyProfile,
            pitch, loudness, quality, resonance, languageProfile, comprehension, receptionMode, expression, expressionMode, parentChildIntraction,
            semanticRelation, attribution, action, locativeAction, existence, nonExistence, denial, rejection, recurrence, possession, playSkills,
            greetingSkill, requesting, turnSkill, topicInitiation, topicMaintenance, topicTermination, socialSmile, reciprocalSmile, jointAttention,
            minglingPeers, temperTantrums, selfBehaviour, hyperActivity, selfHelp, toiletIndication, hungerIndication, bladderControl, parentChildIntractionBehaviour,
            matching, association, sequencing, categorization, logicalReasoning, problemSolving, memory, hearing, vision, testAdminstered,
            impression, admissionAge, academicBreakdown, communicateParticipation, provisionalDiagnosis, familyStrength, familyBarriers,
            counselling, goalsExplained, recommendation, overall } = req.body

        const stAssessmentForm = new StAssessment({
            date, updatedDate, assessmentMasterId, childStrength, parentConcern,  babbling,babblingRemarks, firstWord,firstWordRemarks, twoWord,twoWordRemarks, regression,regressionRemarks, impressionSpeech, neckControl,neckControlRemarks, sitting,sittingRemarks,
            walking,walkingRemarks, impressionMotor, structureLip, FunctionLip, structureTounge, functionTounge, structureTeeth, functionTeeth,
            structureAlveolus, functionAlveolus, structurePalate, functionPalate, structureUvula, functionUvula, structureMandible,
            functionMandible, sucking, swallowing, biting, chewing, blowing, drooling, otherConsultation, eyeContact, attentionConcentration,
            sittingTolerance, speechSkills, fluencyProfile, speechRate, effort, prosody, speechRating, stimulability, phonologyProfile,
            pitch, loudness, quality, resonance, languageProfile, comprehension, receptionMode, expression, expressionMode, parentChildIntraction,
            semanticRelation, attribution, action, locativeAction, existence, nonExistence, denial, rejection, recurrence, possession, playSkills,
            greetingSkill, requesting, turnSkill, topicInitiation, topicMaintenance, topicTermination, socialSmile, reciprocalSmile, jointAttention,
            minglingPeers, temperTantrums, selfBehaviour, hyperActivity, selfHelp, toiletIndication, hungerIndication, bladderControl, parentChildIntractionBehaviour,
            matching, association, sequencing, categorization, logicalReasoning, problemSolving, memory, hearing, vision, testAdminstered,
            impression, admissionAge, academicBreakdown, communicateParticipation, provisionalDiagnosis, familyStrength, familyBarriers,
            counselling, goalsExplained, recommendation, overall
        })

        const assessmentMaster = await AssessmentMaster.findById(req.body.assessmentMasterId)
        let assessmentId = assessmentMaster.assessment_id;
        const assessment = await Assessment.findById(assessmentId);
        let slotId = assessment.slotName
        const slot = await Slot.findById(slotId)
        slot.slotStatus = true;
        await slot.save()
        await stAssessmentForm.save()

        res.send(stAssessmentForm)

    } catch (error) {
        res.send(error)
    }
})


router.get('/stassessmentform', authToken, async (req, res) => {
    try {
        const stAssessmentForm = await StAssessment.find({}).sort({ date: -1 })
            .populate('assessmentMasterId')
        res.send(stAssessmentForm)
    } catch (error) {
        res.send(error)
    }
})

router.get('/stsession/:id', authToken, async (req, res) => {
    try {
        const stAssessmentForm = await StAssessment.findOne({ session_master_id: req.params.id }).populate('session_master_id')
        res.send(stAssessmentForm)
    } catch (error) {
        res.send(error)
    }
})

router.get('/stassessmentform/:id', authToken, async (req, res) => {
    try {
        const stAssessmentForm = await StAssessment.findOne({ _id: req.params.id })
        res.send(stAssessmentForm)
    } catch (error) {
        res.send(error)
    }
})

router.patch('/stassessmentform/:id', authToken, async (req, res) => {
    try {
        const stAssessmentForm = await StAssessment.findByIdAndUpdate(req.params.id)
        stAssessmentForm.updatedDate = req.body.updatedDate
        stAssessmentForm.childStrength = req.body.childStrength,
            stAssessmentForm.parentConcern = req.body.parentConcern,
            stAssessmentForm.babbling = req.body.babbling,
            stAssessmentForm.babblingRemarks = req.body.babblingRemarks,
            stAssessmentForm.firstWord = req.body.firstWord,
            stAssessmentForm.firstWordRemarks = req.body.firstWordRemarks,
            stAssessmentForm.twoWord = req.body.twoWord,
            stAssessmentForm.twoWordRemarks = req.body.twoWordRemarks,
            stAssessmentForm.regression = req.body.regression,
            stAssessmentForm.regressionRemarks = req.body.regressionRemarks,
            stAssessmentForm.impressionSpeech = req.body.impressionSpeech,
            stAssessmentForm.sitting = req.body.sitting,
            stAssessmentForm.sittingRemarks = req.body.sittingRemarks,
            stAssessmentForm.walking = req.body.walking,
            stAssessmentForm.neckControl = req.body.neckControl,
            stAssessmentForm.neckControlRemarks = req.body.neckControlRemarks,
            stAssessmentForm.walkingRemarks = req.body.walkingRemarks,
            stAssessmentForm.impressionMotor = req.body.impressionMotor
        stAssessmentForm.structureLip = req.body.structureLip,
            stAssessmentForm.FunctionLip = req.body.FunctionLip,
            stAssessmentForm.structureTounge = req.body.structureTounge,
            stAssessmentForm.functionTounge = req.body.functionTounge,
            stAssessmentForm.structureTeeth = req.body.structureTeeth,
            stAssessmentForm.functionTeeth = req.body.functionTeeth,
            stAssessmentForm.structureAlveolus = req.body.structureAlveolus,
            stAssessmentForm.functionAlveolus = req.body.functionAlveolus,
            stAssessmentForm.structurePalate = req.body.structurePalate,
            stAssessmentForm.functionPalate = req.body.functionPalate
        stAssessmentForm.structureUvula = req.body.structureUvula,
            stAssessmentForm.functionUvula = req.body.functionUvula,
            stAssessmentForm.structureMandible = req.body.structureMandible,
            stAssessmentForm.functionMandible = req.body.functionMandible,
            stAssessmentForm.sucking = req.body.sucking,
            stAssessmentForm.swallowing = req.body.swallowing,
            stAssessmentForm.biting = req.body.biting,
            stAssessmentForm.chewing = req.body.chewing,
            stAssessmentForm.blowing = req.body.blowing,
            stAssessmentForm.drooling = req.body.drooling
        stAssessmentForm.otherConsultation = req.body.otherConsultation,
            stAssessmentForm.eyeContact = req.body.eyeContact,
            stAssessmentForm.attentionConcentration = req.body.attentionConcentration,
            stAssessmentForm.sittingTolerance = req.body.sittingTolerance,
            stAssessmentForm.speechSkills = req.body.speechSkills,
            stAssessmentForm.fluencyProfile = req.body.fluencyProfile,
            stAssessmentForm.speechRate = req.body.speechRate,
            stAssessmentForm.effort = req.body.effort,
            stAssessmentForm.prosody = req.body.prosody,
            stAssessmentForm.speechRating = req.body.speechRating
        stAssessmentForm.stimulability = req.body.stimulability,
            stAssessmentForm.phonologyProfile = req.body.phonologyProfile,
            stAssessmentForm.pitch = req.body.pitch,
            stAssessmentForm.loudness = req.body.loudness,
            stAssessmentForm.quality = req.body.quality,
            stAssessmentForm.resonance = req.body.resonance,
            stAssessmentForm.languageProfile = req.body.languageProfile,
            stAssessmentForm.comprehension = req.body.comprehension,
            stAssessmentForm.receptionMode = req.body.receptionMode,
            stAssessmentForm.expression = req.body.expression
        stAssessmentForm.expressionMode = req.body.expressionMode,
            stAssessmentForm.parentChildIntraction = req.body.parentChildIntraction,
            stAssessmentForm.semanticRelation = req.body.semanticRelation,
            stAssessmentForm.attribution = req.body.attribution,
            stAssessmentForm.action = req.body.action,
            stAssessmentForm.locativeAction = req.body.locativeAction,
            stAssessmentForm.existence = req.body.existence,
            stAssessmentForm.nonExistence = req.body.nonExistence,
            stAssessmentForm.denial = req.body.denial,
            stAssessmentForm.rejection = req.body.rejection
        stAssessmentForm.recurrence = req.body.recurrence,
            stAssessmentForm.possession = req.body.possession,
            stAssessmentForm.playSkills = req.body.playSkills,
            stAssessmentForm.greetingSkill = req.body.greetingSkill,
            stAssessmentForm.requesting = req.body.requesting,
            stAssessmentForm.turnSkill = req.body.turnSkill,
            stAssessmentForm.topicInitiation = req.body.topicInitiation,
            stAssessmentForm.topicMaintenance = req.body.topicMaintenance,
            stAssessmentForm.topicTermination = req.body.topicTermination,
            stAssessmentForm.socialSmile = req.body.socialSmile
        stAssessmentForm.reciprocalSmile = req.body.reciprocalSmile,
            stAssessmentForm.jointAttention = req.body.jointAttention,
            stAssessmentForm.minglingPeers = req.body.minglingPeers,
            stAssessmentForm.temperTantrums = req.body.temperTantrums,
            stAssessmentForm.selfBehaviour = req.body.selfBehaviour,
            stAssessmentForm.hyperActivity = req.body.hyperActivity,
            stAssessmentForm.selfHelp = req.body.selfHelp,
            stAssessmentForm.toiletIndication = req.body.toiletIndication,
            stAssessmentForm.hungerIndication = req.body.hungerIndication,
            stAssessmentForm.bladderControl = req.body.bladderControl,
            stAssessmentForm.parentChildIntractionBehaviour = req.body.parentChildIntractionBehaviour,
            stAssessmentForm.matching = req.body.matching
        stAssessmentForm.association = req.body.association,
            stAssessmentForm.sequencing = req.body.sequencing,
            stAssessmentForm.categorization = req.body.categorization,
            stAssessmentForm.logicalReasoning = req.body.logicalReasoning,
            stAssessmentForm.problemSolving = req.body.problemSolving,
            stAssessmentForm.memory = req.body.memory,
            stAssessmentForm.hearing = req.body.hearing,
            stAssessmentForm.vision = req.body.vision,
            stAssessmentForm.testAdminstered = req.body.testAdminstered,
            stAssessmentForm.impression = req.body.impression
            stAssessmentForm.admissionAge = req.body.admissionAge,
            stAssessmentForm.academicBreakdown = req.body.academicBreakdown,
            stAssessmentForm.communicateParticipation = req.body.communicateParticipation,
            stAssessmentForm.provisionalDiagnosis = req.body.provisionalDiagnosis,
            stAssessmentForm.familyStrength = req.body.familyStrength,
            stAssessmentForm.familyBarriers = req.body.familyBarriers,
            stAssessmentForm.counselling = req.body.counselling,
            stAssessmentForm.goalsExplained = req.body.goalsExplained,
            stAssessmentForm.recommendation = req.body.recommendation,
            stAssessmentForm.overall = req.body.overall,

            await stAssessmentForm.save()
        res.send(stAssessmentForm)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router