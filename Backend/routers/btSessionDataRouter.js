const express = require('express');
const router =express.Router();
const BtSessionData = require('../models/btSessionData');
const authToken = require('../routers/verifyToken');
const SessionMaster = require('../models/session_mater');
const Session = require('../models/session');
const Slot = require('../models/slot');

router.post('/btsessiondata', authToken, async(req,res)=>{
    try {
        const btSessionData = new BtSessionData({
            date:req.body.date,
            updatedDate: req.body.updatedDate,
            session_master_id:req.body.session_master_id,
            sitting : req.body.sitting,
            remarksSitting : req.body.remarksSitting,
            eyeContact : req.body.eyeContact,
            remarksEyeContact : req.body.remarksEyeContact,
            attention : req.body.attention,
            remarksAttention : req.body.remarksAttention,
            mood : req.body.mood,
            remarksMood : req.body.remarksMood,
            activities : req.body.activities,
            remarksActivities : req.body.remarksActivities,
            comprehensionInstructions : req.body.comprehensionInstructions,
            remarksComprehensionInstructions : req.body.remarksComprehensionInstructions,
            responseInstructions : req.body.responseInstructions,
            remarksResponseInstructions : req.body.remarksResponseInstructions,
            waiting : req.body.waiting,
            remarksWaiting : req.body.remarksWaiting,
            compliance : req.body.compliance,
            remarksCompliance : req.body.remarksCompliance,
            behaviour : req.body.behaviour,
            remarksBehaviour : req.body.remarksBehaviour,
            communication : req.body.communication,
            remarksCommunication : req.body.remarksCommunication,
          
            throwThings : req.body.throwThings,
            remarksThrowThings : req.body.remarksThrowThings,
            tearsThings : req.body.tearsThings,
            remarksTearsThings : req.body.remarksTearsThings,
            angryProne : req.body.angryProne,
            remarksAngryProne : req.body.remarksAngryProne,
            selfInjurious : req.body.selfInjurious,
            remarksSelfInjurious : req.body.remarksSelfInjurious,
            repetitive : req.body.repetitive,
            remarksRepetitive : req.body.remarksRepetitive,
            tantrums : req.body.tantrums,
            remarksTantrums : req.body.remarksTantrums,
            climbsFurniture : req.body.climbsFurniture,
            remarksClimbsFurniture : req.body.remarksClimbsFurniture,
            disruptiveBehaviour : req.body.disruptiveBehaviour,
            remarksDisruptiveBehaviour : req.body.remarksDisruptiveBehaviour
            
        })
        const sessionMaster =  await SessionMaster.findById(req.body.session_master_id)
      
        let sessionId = sessionMaster.session_id;
    
        const session = await Session.findById(sessionId);
     
        let slotId= session.slotName
       
        let slot = await Slot.findById(slotId)
     
        slot.slotStatus= true;
    
        await slot.save()
      


        await btSessionData.save()
        
        res.send(btSessionData)    
           
    } catch (error) {
       return  res.send(error)       
    }
})

router.get('/btsessiondata', authToken, async(req,res)=>{
    try {
        const btSessionData = await BtSessionData.find({}).sort({date: -1})
        .populate('session_master_id')
        res.send(btSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/btsession/:id', authToken, async(req,res)=>{
    try {
        const btSessionData = await BtSessionData.findOne({session_master_id:req.params.id}).populate('session_master_id')
        res.send(btSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/btsessiondata/:id', authToken, async(req,res)=>{
    try {
        const btSessionData = await BtSessionData.findOne({_id:req.params.id})
        res.send(btSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.patch('/btsessiondata/:id', authToken, async(req,res)=>{
    try {
        const btSessionData = await BtSessionData.findByIdAndUpdate(req.params.id)
            //otSessionData.date = req.body.date,
            //otSessionData.session_master_id = req.body.session_master_id,
            btSessionData.updatedDate = req.body.updatedDate
            btSessionData.sitting = req.body.sitting,
            btSessionData.remarksSitting = req.body.remarksSitting,
            btSessionData.eyeContact = req.body.eyeContact,
            btSessionData.remarksEyeContact = req.body.remarksEyeContact,
            btSessionData.attention = req.body.attention,
            btSessionData.remarksAttention = req.body.remarksAttention,
            btSessionData.mood = req.body.mood,
            btSessionData.remarksMood = req.body.remarksMood,
            btSessionData.activities = req.body.activities,
            btSessionData.remarksActivities = req.body.remarksActivities,
            btSessionData.comprehensionInstructions = req.body.comprehensionInstructions,
            btSessionData.remarksComprehensionInstructions = req.body.remarksComprehensionInstructions,
            btSessionData.responseInstructions = req.body.responseInstructions            
            btSessionData.remarksResponseInstructions = req.body.remarksResponseInstructions
            btSessionData.waiting = req.body.waiting,
            btSessionData.remarksSitting = req.body.remarksSitting,
            btSessionData.remarksWaiting = req.body.remarksWaiting,
            btSessionData.compliance = req.body.compliance,
            btSessionData.remarksCompliance = req.body.remarksCompliance,
            btSessionData.behaviour = req.body.behaviour,
            btSessionData.remarksBehaviour = req.body.remarksBehaviour,
            btSessionData.communication = req.body.communication,
            btSessionData.remarksCommunication = req.body.remarksCommunication,

            btSessionData.throwThings = req.body.throwThings,
            btSessionData.remarksThrowThings = req.body.remarksThrowThings,
            btSessionData.tearsThings = req.body.tearsThings,
            btSessionData.remarksTearsThings = req.body.remarksTearsThings
            btSessionData.angryProne = req.body.angryProne
            btSessionData.remarksAngryProne = req.body.remarksAngryProne,
            btSessionData.selfInjurious = req.body.selfInjurious,
            btSessionData.remarksSelfInjurious = req.body.remarksSelfInjurious,
            btSessionData.repetitive = req.body.repetitive,
            btSessionData.remarksRepetitive = req.body.remarksRepetitive,
            btSessionData.tantrums = req.body.tantrums,
            btSessionData.remarksTantrums = req.body.remarksTantrums,
            btSessionData.climbsFurniture = req.body.climbsFurniture,
            btSessionData.remarksClimbsFurniture = req.body.remarksClimbsFurniture,
            btSessionData.disruptiveBehaviour = req.body.disruptiveBehaviour,
            btSessionData.remarksDisruptiveBehaviour = req.body.remarksDisruptiveBehaviour,
           
        await btSessionData.save()
        res.send(btSessionData)
    } catch (error) {
        res.send(error)
    }
})
module.exports = router