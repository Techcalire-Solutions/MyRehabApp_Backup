const express = require('express');
const router =express.Router();
const StSkill = require('../models/stSkill');
const authToken = require('../routers/verifyToken');

router.post('/addstskill', authToken,async(req,res)=>{
    try {
        const stSkill = new StSkill({
            skill :req.body.skill,
            status : req.body.status,
            sessionId : req.body.sessionId
        })
        await stSkill.save()
        res.send(stSkill)       
    } catch (error) {
       return  res.send(error)       
    }
})

router.patch('/stskillupdate/:id', authToken,async(req,res)=>{
    try {
        const stSkill = await StSkill.findOne({_id:req.params.id}).sort({_id: -1})
        stSkill.status = req.body.status
        await stSkill.save()
        res.send(stSkill)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/stskill', authToken, async(req,res)=>{
    try {
        const stSkill = await StSkill.find({}).populate('sessionId')
        res.send(stSkill)       
    } catch (error) {
      res.send(error)
    }
})

router.get('/filterstskill/:id', authToken,async(req,res)=>{
    try {
        const stSkill = await StSkill.find({sessionId: req.params.id, status: false}).populate('sessionId status')
        res.send(stSkill)       
    } catch (error) {
      res.send(error)
    }
})

router.get('/stskill/:id', authToken, async(req,res)=>{
    try {
        const stSkill = await StSkill.find({sessionId: req.params.id}).populate('sessionId status')
        res.send(stSkill)       
    } catch (error) {
      res.send(error)
    }
})

router.patch('/stskill/:id', authToken,async(req,res)=>{
    try{
        const stSkill = await StSkill.findByIdAndUpdate(req.params.id)

        stSkill.skill = req.body.skill,
        // stSkill.expectPeriod = req.body.expectPeriod   
        stSkill.status = req.body.status
                 
        await stSkill.save();
        res.send(stSkill);       
    }
    catch(error){
        res.send(error)
    }
})


router.delete('/stskill/:id', authToken, async(req,res)=>{
    const result = await StSkill.deleteOne({_id:req.params.id})
    res.send(result)
})


module.exports = router