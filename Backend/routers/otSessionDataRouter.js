const express = require('express');
const router = express.Router();
const OtSessionData = require('../models/otSessionData')
const authToken = require('../routers/verifyToken');
const SessionMaster = require('../models/session_mater');
const Session = require('../models/session');
const Slot = require('../models/slot');
router.post('/otsessiondata', authToken, async(req,res)=>{
    try {
        const otSessionData = new OtSessionData({
            date:req.body.date,
            updatedDate: req.body.updatedDate,
            session_master_id:req.body.session_master_id,
            sensoryModulation: req.body.sensoryModulation,
            proprioceptiveDiscrimination: req.body.proprioceptiveDiscrimination,
            vestibularDiscrimination:req.body.vestibularDiscrimination,
            tactileDiscrimination:req.body.tactileDiscrimination,
            visual:req.body.visual,
            postural:req.body.postural,
            bilateralIntegration:req.body.bilateralIntegration,
            praxis:req.body.praxis,
            grossMotor:req.body.grossMotor,
            fineMotor:req.body.fineMotor,
            auditoryAndLanguage:req.body.auditoryAndLanguage,
            adl:req.body.adl,
            emotional:req.body.emotional
        })
        const sessionMaster =  await SessionMaster.findById(req.body.session_master_id)
    
        let sessionId = sessionMaster.session_id;
    
        const session = await Session.findById(sessionId);
   
        let slotId= session.slotName
      
        let slot = await Slot.findById(slotId)
      
        slot.slotStatus= true;
     
        await slot.save()
       


        await otSessionData.save()
        res.send(otSessionData)
    } catch (error) {
        res.send(error)
    }
})

router.get('/otsessiondata', authToken,async(req,res)=>{
    try {
        const otSessionData = await OtSessionData.find({}).sort({date: -1})
        .populate('session_master_id')
        res.send(otSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/otsession/:id', authToken,async(req,res)=>{
    try {
        const otSessionData = await OtSessionData.findOne({session_master_id:req.params.id}).populate('session_master_id')
        res.send(otSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/otsessiondata/:id', authToken,async(req,res)=>{
    try {
        const otSessionData = await OtSessionData.findOne({_id:req.params.id})
        res.send(otSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.patch('/otsessiondata/:id', authToken, async(req,res)=>{
    try {
        const otSessionData = await OtSessionData.findByIdAndUpdate(req.params.id)
            otSessionData.updatedDate = req.body.updatedDate
            otSessionData.sensoryModulation = req.body.sensoryModulation,
            otSessionData.proprioceptiveDiscrimination = req.body.proprioceptiveDiscrimination,
            otSessionData.vestibularDiscrimination = req.body.vestibularDiscrimination,
            otSessionData.tactileDiscrimination = req.body.tactileDiscrimination,
            otSessionData.visual = req.body.visual,
            otSessionData.postural = req.body.postural,
            otSessionData.bilateralIntegration = req.body.bilateralIntegration,
            otSessionData.praxis = req.body.praxis,
            otSessionData.grossMotor = req.body.grossMotor,
            otSessionData.fineMotor = req.body.fineMotor,
            otSessionData.auditoryAndLanguage = req.body.auditoryAndLanguage,
            otSessionData.adl = req.body.adl,
            otSessionData.emotional = req.body.emotional

        await otSessionData.save()
        res.send(otSessionData)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router