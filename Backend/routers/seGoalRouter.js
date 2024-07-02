const express = require('express');
const router =express.Router();
const SeGoal = require('../models/seGoal');
const authToken = require('../routers/verifyToken');

router.post('/addsegoal', authToken, async(req,res)=>{
    try {
        const seGoal = new SeGoal({
            goal :req.body.goal,
            expectPeriod : req.body.expectPeriod,
            status : req.body.status,
            sessionId : req.body.sessionId
        })
        await seGoal.save()
        
        res.send(seGoal)       
    } catch (error) {
       return  res.send(error)       
    }
})

router.patch('/segoalupdate/:id', authToken, async(req,res)=>{
    try {
        const seGoal = await SeGoal.findOne({_id:req.params.id})
        seGoal.status = req.body.status

        await seGoal.save()

        res.send(seGoal)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/segoal', authToken, async(req,res)=>{
    try {
        const seGoal = await SeGoal.find({}).populate('sessionId').sort({_id: -1})
        res.send(seGoal)       
    } catch (error) {
      res.send(error)
    }
})

router.get('/segoal/:id', authToken, async(req,res)=>{
    try {
        const seGoal = await SeGoal.find({sessionId: req.params.id}).populate('sessionId status')
        res.send(seGoal)       
    } catch (error) {
      res.send(error)
    }
})

router.get('/filtersegoal/:id', authToken, async(req,res)=>{
    try {
        const seGoal = await SeGoal.find({sessionId: req.params.id, status: false}).populate('sessionId status')
        res.send(seGoal)       
    } catch (error) {
      res.send(error)
    }
})

router.patch('/segoal/:id', authToken,async(req,res)=>{
    try{
        const seGoal = await SeGoal.findByIdAndUpdate(req.params.id)

        seGoal.goal = req.body.goal,
        seGoal.expectPeriod = req.body.expectPeriod   
        seGoal.status = req.body.status
                 
        await seGoal.save();
        res.send(seGoal);       
    }
    catch(error){
        res.send(error)
    }
})


router.delete('/segoal/:id', authToken, async(req,res)=>{
    try {
        const result = await SeGoal.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        
    }
    
})


module.exports = router