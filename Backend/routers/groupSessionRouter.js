const express = require('express');
const router =express.Router();
const Session = require('../models/groupSession')
const GroupMaster = require('../models/groupMaster');
const authToken = require('../routers/verifyToken');


router.post('/groupsession', authToken ,async(req,res)=>{
    try {
        const session = new Session({
            slotName:req.body.slotName,
            clientName:req.body.clientName,
            therapistName:req.body.therapistName,
            status: req.body.status
        })
        await session.save()
        res.send(session)
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/groupsession', authToken,async(req,res)=>{
    try {
        //const session = await Session.find({}).populate('therapistName slotName clientName')

        const session = await Session.find({}).sort('slotName').populate({
            path: 'therapistName.therapistId',
            populate: {
                path: 'therapyCategory'
            }        
        }).populate('slotName').populate('clientName.clientId')

        res.send(session)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/groupsession/:id', authToken, async(req,res)=>{
    try {
        const session = await Session.findOne({_id: req.params.id}).populate({
            path: 'therapistName.therapistId',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName').populate('clientName.clientId')
        res.send(session)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.patch('/groupsession/client/:id', authToken, async(req,res)=>{
    try {
        const session = await Session.findByIdAndUpdate(req.params.id)
        session.clientName  = req.body.clientName

        await session.save()
        res.send(session)
        
    } catch (error) {
        res.send(error)
    }    
})

router.patch('/groupsession/therapist/:id', authToken, async(req,res)=>{
    try {
        const session = await Session.findByIdAndUpdate(req.params.id)
        session.therapistName  = req.body.therapistName

        await session.save()
        res.send(session)
        
    } catch (error) {
        res.send(error)
    }    
})

router.delete('/groupsession/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id;

        const sessionMaster = await GroupMaster.findOne({session_id : id})
        if(sessionMaster){
            return res.status(400).send({message: 'There is a session master exists in this session'})
        }
        const session = await Session.deleteOne({_id:req.params.id})
        res.send(session)
    } catch (error) {
        res.send(error)
    }
})

router.get('/session/:id', authToken,async(req,res)=>{
    try {
        const session = await Session.findOne({_id:req.params.id})
        res.send(session)
        
    } catch (error) {
        res.send(error)
    }
})

router.patch('/statusupdate/:id', authToken,async(req,res)=>{
    try {
        const session = await Session.findOne({_id:req.params.id})
        session.remarks = req.body.remarks
        session.endDate = req.body.endDate
        session.status = req.body.status
        await session.save()

        res.send(session)       
    } catch (error) {
        res.send(error)       
    }
})


module.exports = router;