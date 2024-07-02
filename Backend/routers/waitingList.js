const express = require('express');
const router = express.Router();
const authToken = require('../routers/verifyToken');

const WaitingList = require('../models/waitingList');

router.post('/', authToken,async(req,res)=>{
    try {
        const {clientId, sessionId, assessmentId, date = new Date()} = req.body;
        if(sessionId){
            const wl = await WaitingList.findOne({sessionId: sessionId})
            if(wl != null){
                return res.status(400).send({message:"Already added"});
            }
        }
        if(assessmentId){
            const wl = await WaitingList.findOne({assessmentId: assessmentId})
            if(wl != null){
                return res.status(400).send({message:"Already added"});
            }
        }


        const waitinglist = new WaitingList({
            clientId: clientId,
            sessionId: sessionId,
            date: date,
            assessmentId: assessmentId
        })
        await waitinglist.save()

        res.send(waitinglist)
    } catch (error) {
        res.send(error)        
    }
})

router.get('/', authToken,async(req,res)=>{
    try {
        const waitinglist = await WaitingList.find()
        res.send(waitinglist)       
    } catch (error) {
      res.send(error)
    }
})

router.get('/bysession/:id', authToken,async(req,res)=>{
    try {
        const waitinglist = await WaitingList.findOne({sessionId: req.params.id})
        res.send(waitinglist)       
    } catch (error) {
      res.send(error)
    }
})

router.get('/byassessment/:id', authToken,async(req,res)=>{
    try {
        const waitinglist = await WaitingList.findOne({assessmentId: req.params.id})
        res.send(waitinglist)       
    } catch (error) {
      res.send(error)
    }
})

router.delete('/bysession/:id', async(req,res)=>{
    try {
        const id = req.params.id;

        const result = await WaitingList.deleteOne({sessionId: id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
    
})

router.delete('/byassessment/:id', async(req,res)=>{
    try {
        const id = req.params.id;

        const result = await WaitingList.deleteOne({assessmentId: id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
    
})

module.exports = router;