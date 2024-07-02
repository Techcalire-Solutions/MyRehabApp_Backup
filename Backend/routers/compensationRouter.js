const express = require('express');
const router =express.Router();
const CompensationSession = require('../models/compensationSession');
const SessionMaster = require('../models/session_mater');
const AssessmentMaster = require('../models/assessmentMaster');
const authToken = require('../routers/verifyToken');
const Leave = require('../models/leave');

router.post('/compensationsession', authToken,async(req,res)=>{
    try {
        const {therapistLeaveId, slotName, clientName, therapistName, date, sessionType, status, slotStatus, leaveId} = req.body;
        const existSession = await CompensationSession.findOne({slotName: slotName, date: date})

        if(existSession) {
            return res.status(400).send({message: 'Slot already alloted for this date'})
        }
        if(!slotStatus){
            try {
                const result = await Leave.updateOne(
                    { _id: leaveId,'slots.slotId': slotName },
                    { $set: { 'slots.$.status': true } }
                );
            } catch (error) {
                console.error('Error updating leave slot status:', error);
            }
        }

        const compensationSession = new CompensationSession({
            therapistLeaveId : therapistLeaveId,
            slotName : slotName,
            clientName : clientName,
            therapistName : therapistName,
            date :  date,
            sessionType : sessionType,
            status : status
        })
        await compensationSession.save()
        res.send(compensationSession)
    } catch (error) {
        res.send(error)
    }
})

router.get('/compensationsession', authToken, async(req,res)=>{
    try {
        const compensationSession = await CompensationSession.find({}).sort({date: -1})
        .populate({
            path: 'therapistName',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName').populate({
            path: 'clientName'
        }).sort({date: -1})
        res.send(compensationSession)        
    } catch (error) {
        res.send(error)        
    }
})

router.get('/compensationsession/:id', authToken,async(req,res)=>{
    try {
        const compensationSession = await CompensationSession.findOne({_id: req.params.id}).populate({
            path: 'therapistName',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName clientName therapistLeaveId').sort({date: -1})
        res.send(compensationSession)        
    } catch (error) {
        res.send(error)        
    }
})

router.get('/compensationsessionbyslot/:id', authToken,async(req,res)=>{
    try {
        const compensationSession = await CompensationSession.findOne({slotName: req.params.id}).populate({
            path: 'therapistName',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName clientName').sort({date: -1})
        res.send(compensationSession)        
    } catch (error) {
        res.send(error)        
    }
})

router.patch('/compensationsession/:id', authToken, async(req,res)=>{
    try {
        const result = await CompensationSession.findByIdAndUpdate(req.params.id)
        result.date  = req.body.date,
        result.startTime = req.body.startTime,
        result.endTime = req.body.endTime

        await result.save()
        res.send(result)
        
    } catch (error) {
        res.send(error)
    }    
})

router.delete('/compensationsession/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id;
        const assessmentMaster = await AssessmentMaster.findOne({leave_session_id : id})
        if(assessmentMaster){
            return res.status(400).send({message: 'There is a session master exists in this leave session'})
        }

        const sessionMasterLeave = await SessionMaster.findOne({leave_session_id : id})
        if(sessionMasterLeave){
            return res.status(400).send({message: 'There is a session master exists in this leave session'})
        }
        try {
            const comp = await CompensationSession.findOne({_id:req.params.id})
            const update = await Leave.updateOne(
                { 'slots.slotId': comp.slotName },
                { $set: { 'slots.$.status': false } }
            );
        } catch (error) {
            console.error('Error updating leave slot status:', error);
        }
        const result = await CompensationSession.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

router.patch('/compensationsessionstatus/:id', authToken , async(req,res)=>{
    try {
        const result = await CompensationSession.findByIdAndUpdate(req.params.id)
        result.status = req.body.status

        await result.save()
        res.send(result)
        
    } catch (error) {
        res.send(error)
    }    
})

// router.get('/assessment/:id',async(req,res)=>{
//     try {
//         const result = await CompensationSession.findOne({_id:req.params.id}).populate('clientName')
//         res.send(result)
        
//     } catch (error) {
//         res.send(error)
//     }
// })


module.exports = router