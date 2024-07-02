const express = require('express');
const router = express.Router();
const StSessionData = require('../models/stSessionData')
const authToken = require('../routers/verifyToken');
const SessionMaster = require('../models/session_mater');
const Session = require('../models/session');
const Slot = require('../models/slot');
router.post('/stsessiondata', authToken, async(req,res)=>{
    try {

        const stSessionData = new StSessionData({
            date:req.body.date,
            updatedDate: req.body.updatedDate,
            session_master_id:req.body.session_master_id,
            preLinguistic: req.body.preLinguistic,
            linguistic: req.body.linguistic,
            communication:req.body.communication,
            cognition:req.body.cognition,
            play:req.body.play,
            articulation:req.body.articulation,
            oroMotor:req.body.oroMotor,
            fluency:req.body.fluency,
            voice:req.body.voice,        
        })

        const sessionMaster =  await SessionMaster.findById(req.body.session_master_id)
     
        let sessionId = sessionMaster.session_id;
     
        const session = await Session.findById(sessionId);
     
        let slotId= session.slotName
   
        let slot = await Slot.findById(slotId)
 
        slot.slotStatus= true;
    
        await slot.save()
       


        await stSessionData.save()

        res.send(stSessionData)

    } catch (error) {
        res.send(error)
    }
})


router.get('/stsessiondata', authToken,async(req,res)=>{
    try {
        const stSessionData = await StSessionData.find({}).sort({date: -1})
        .populate('session_master_id')
        res.send(stSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/stsession/:id', authToken,async(req,res)=>{
    try {
        const stSessionData = await StSessionData.findOne({session_master_id:req.params.id}).populate('session_master_id')
        res.send(stSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/stsessiondata/:id', authToken,async(req,res)=>{
    try {
        const stSessionData = await StSessionData.findOne({_id:req.params.id})
        res.send(stSessionData)       
    } catch (error) {
        res.send(error)       
    }
})

router.patch('/stsessiondata/:id', authToken, async(req,res)=>{
    try {
        const stSessionData = await StSessionData.findByIdAndUpdate(req.params.id)
            stSessionData.updatedDate = req.body.updatedDate
            stSessionData.preLinguistic = req.body.preLinguistic,
            stSessionData.linguistic = req.body.linguistic,
            stSessionData.communication = req.body.communication,
            stSessionData.cognition = req.body.cognition,
            stSessionData.play = req.body.play,
            stSessionData.articulation = req.body.articulation,
            stSessionData.oroMotor = req.body.oroMotor,
            stSessionData.fluency = req.body.fluency,
            stSessionData.voice = req.body.voice,

        await stSessionData.save()
        res.send(stSessionData)
    } catch (error) {
        res.send(error)
    }
})

module.exports = router