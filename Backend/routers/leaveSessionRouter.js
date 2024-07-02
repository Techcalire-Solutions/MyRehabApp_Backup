const express = require('express');
const router =express.Router();
const LeaveSession = require('../models/leaveSession');
const SessionMaster = require('../models/session_mater');
const AssessmentMaster = require('../models/assessmentMaster');
const authToken = require('../routers/verifyToken');
const Leave = require('../models/leave');

router.post('/leavesession', authToken,async(req,res)=>{
    try {
        const existSession = await LeaveSession.findOne({slotName: req.body.slotName, assessmentDate: req.body.assessmentDate})

        if(existSession) {
            return res.status(400).send({message: 'Slot already alloted for this date'})
        }
        
        const leaveSession = new LeaveSession({
            leaveId : req.body.leaveId,
            slotName : req.body.slotName,
            clientName : req.body.clientName,
            therapistName : req.body.therapistName,
            assessmentDate :  req.body.assessmentDate,
            sessionType : req.body.sessionType,
            status : req.body.status
        })

        try {
            const result = await Leave.updateOne(
                { _id: req.body.leaveId,'slots.slotId': req.body.slotName },
                { $set: { 'slots.$.status': true } }
            );
        } catch (error) {
            console.error('Error updating leave slot status:', error);
        }

        await leaveSession.save()
        res.send(leaveSession)
    } catch (error) {
        res.send(error)
    }
})

router.get('/leavesession', authToken,async(req,res)=>{
    try {
        const leaveSession = await LeaveSession.find({}).populate({
            path: 'therapistName',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName').populate({
            path: 'clientName'
        }).sort({assessmentDate: -1})
        res.send(leaveSession)        
    } catch (error) {
        res.send(error)        
    }
})

router.get('/leavesession/:id', authToken,async(req,res)=>{
    try {
        const leaveSession = await LeaveSession.findOne({_id: req.params.id}).populate({
            path: 'therapistName',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName clientName')
        res.send(leaveSession)        
    } catch (error) {
        res.send(error)        
    }
})

router.get('/leavesessionbylmc/:id', authToken, async(req,res)=>{
    try {
        const leaveSession = await LeaveSession.find({leaveId: req.params.id}).populate({
            path: 'therapistName',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName clientName').sort({assessmentDate: -1})
        res.send(leaveSession)        
    } catch (error) {
        res.send(error)        
    }
})

router.get('/leavesessionbyslot/:id', authToken,async(req,res)=>{
    try {
        const leaveSession = await LeaveSession.findOne({slotName: req.params.id}).populate({
            path: 'therapistName',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName clientName').sort({assessmentDate: -1})
        res.send(leaveSession)        
    } catch (error) {
        res.send(error)        
    }
})

router.patch('/leavesession/:id', authToken, async(req,res)=>{
    try {
        const result = await LeaveSession.findByIdAndUpdate(req.params.id)
        result.slotName = req.body.slotName,
        result.clientName  = req.body.clientName,
        result.therapistName = req.body.therapistName,
        result.assessmentDate  = req.body.assessmentDate,
        result.sessionType = req.body.sessionType

        await result.save()
        res.send(result)
        
    } catch (error) {
        res.send(error)
    }    
})

router.delete('/leavesession/:id', authToken, async(req,res)=>{
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
            const comp = await LeaveSession.findOne({_id:req.params.id})
            const update = await Leave.updateOne(
                { 'slots.slotId': comp.slotName },
                { $set: { 'slots.$.status': false } }
            );
        } catch (error) {
            console.error('Error updating leave slot status:', error);
        }
        const result = await LeaveSession.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

router.patch('/leavesessionstatus/:id', authToken , async(req,res)=>{
    try {
        const result = await LeaveSession.findByIdAndUpdate(req.params.id)
        result.status = req.body.status

        await result.save()
        res.send(result)
        
    } catch (error) {
        res.send(error)
    }    
})

// router.get('/assessment/:id',async(req,res)=>{
//     try {
//         const result = await LeaveSession.findOne({_id:req.params.id}).populate('clientName')
//         res.send(result)
        
//     } catch (error) {
//         res.send(error)
//     }
// })


module.exports = router