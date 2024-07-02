const express = require('express');
const router =express.Router();
const Leave = require('../models/leave');
const Slot = require('../models/slot');
const authToken = require('../routers/verifyToken');
const LeaveSession = require('../models/leaveSession');

router.post('/leave', authToken, async(req,res)=>{
    try {

        const{clientId, fromDate, toDate, slots, status, reason} = req.body;

        const leave = new Leave({clientId, fromDate, toDate, slots, status, reason})
        
        await leave.save()
        res.send(leave)       
    } catch (error) {
        return res.send(error)
        
    }
})


router.get('/leave', authToken, async(req,res)=>{
    try {
        const leave = await Leave.find({}).populate('clientId').sort({toDate: -1})
        .populate({
            path:  'slots.slotId',
            populate:{
                path: 'therapyCategory'
            }
        })
        res.send(leave)       
    } catch (error) {
        res.send(error)
        
    }
 })

 router.get('/leave/:id', authToken, async(req,res)=>{
    try {
        const leave = await Leave.findById({_id: req.params.id}).populate('clientId')
        .populate({
            path:  'slots.slotId',
            populate:{
                path: 'therapyCategory'
            }
        })
        res.send(leave)       
    } catch (error) {
        res.send(error)
        
    }
 })


 router.patch('/leave/:id', authToken, async(req,res)=>{
    try{
        const leave = await Leave.findByIdAndUpdate(req.params.id)
        leave.clientId = req.body.clientId,
        leave.fromDate = req.body.fromDate,
        leave.toDate = req.body.toDate,
        leave.slots = req.body.slots,
        leave.reason = req.body.reason

        await leave.save();
        res.send(leave);       
    }
    catch(error){
        res.send(error)
    }
})

router.patch('/clientleavestatusupdate/:id', authToken, async(req,res)=>{
    try {
          const master = await Leave.findById(req.params.id)
          master.status = req.body.status
          await master.save()
  
          res.send(master)
    } catch (error) {
      res.send(error)
    }
})


router.delete('/leave/:id', authToken, async(req,res)=>{
    try {
        const leaveSession = await LeaveSession.findOne({leaveId : req.params.id})
        if(leaveSession){
            return  res.status(400).send({message: 'There is a session assigned in this leave slot, first delete correspondind sessions assigned'})
        }
        const result = await Leave.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    } 
})



module.exports = router