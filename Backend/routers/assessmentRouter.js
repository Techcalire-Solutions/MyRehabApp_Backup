const express = require('express');
const router =express.Router();
const Assessment = require('../models/assessment');
const AssessmentMaster = require('../models/assessmentMaster');
const authToken = require('../routers/verifyToken');
const Client = require('../models/client');
const Slot = require('../models/slot');
const Session = require('../models/session')

router.post('/addassessment', authToken, async(req,res)=>{
    try {

        const {slotName, clientName, therapistName, assessmentDate} = req.body;
        
        const assessment = new Assessment({
            slotName : slotName,
            clientName : clientName,
            therapistName : therapistName,
            assessmentDate :  assessmentDate,
            // remarks: req.body.remarks,
            // endDate: req.body.endDate
        })

        const clientSession = await Session.find({ clientName: clientName, date: assessmentDate})
     
        if(clientSession.length != 0){
            for(let i = 0; i < clientSession.length; i++){
                const clientSlot = await Slot.findById(clientSession[i].slotName)
              
                const newSlot = await Slot.findById(slotName)
            
                if(clientSlot.startTime === newSlot.startTime){
                
                    return res.status(400).send({ message: "Client is already scheduled a session for the same time"})
                }
            }
            
        }

        const clientAssessment = await Assessment.find({ clientName: clientName, assessmentDate: assessmentDate})
     
        if(clientAssessment.length != 0){
            for(let i = 0; i < clientAssessment.length; i++){
               
                const clientSlot = await Slot.findById(clientAssessment[i].slotName)
             
                const newSlot = await Slot.findById(slotName)
              
                if(clientSlot.startTime === newSlot.startTime){
                    return res.status(400).send({ message: "Client is already scheduled an assessment for the same time"})
                }
            }
            
        }
        
        const slotSession = await Session.find({ slotName: slotName, date: assessmentDate}) 
        if(slotSession.length != 0){
            return res.status(400).send({ message: "Selected slot is occupied for the same date"})
        }

        const slotAssessment = await Assessment.find({ slotName: slotName, assessmentDate: assessmentDate}) 
        if(slotAssessment.length != 0){
            return res.status(400).send({ message: "Selected slot is occupied for the same date"})
        }
        
        await assessment.save()
        
        const client = await Client.findByIdAndUpdate(assessment.clientName)
        client.status = 'AS'
        await client.save()

        res.send(assessment)
    } catch (error) {
        res.send(error)
    }
})

router.get('/assessment', authToken, async (req, res) => {
    try {
        let limit ;
        let offset;
    

        if(req.query.pageSize && req.query.page){
            limit = req.query.pageSize;
            offset = (req.query.page - 1)* req.query.pageSize;
        }

        const result = await Assessment.find().skip(offset).limit(limit).sort({ assessmentDate: -1 })
                .populate({
                  path: 'therapistName',
                  populate: {
                    path: 'therapyCategory',
                  },
                })
                .populate('slotName')
                .populate({
                  path: 'clientName',
                });
          
        
        let count  = await Assessment.countDocuments()


        if(req.query.page && req.query.pageSize){
            const response = {
                count : count,
                items : result
             
            }
            res.json(response)
          
        }
        else{
            res.json(result)
        }
        
    } catch (error) {
        res.send(error.message)
        
    }
});

  
  

router.patch('/assessment/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id
        const { slotName, clientName, therapistName, assessmentDate} = req.body

        const assessment = await Assessment.findByIdAndUpdate(id)
        assessment.slotName = slotName,
        assessment.clientName  = clientName,
        assessment.therapistName = therapistName
        assessment.assessmentDate = assessmentDate

        const clientSession = await Session.find({ clientName: clientName, date: assessmentDate, _id: { $ne: id }})
        if(clientSession.length != 0){
            for(let i = 0; i < clientSession.length; i++){
                const clientSlot = await Slot.findById(clientSession[i].slotName)
                const newSlot = await Slot.findById(slotName)
                if(clientSlot.startTime === newSlot.startTime){
                    return res.status(400).send({ message: "Client is already scheduled a session for the same time"})
                }
            }
            
        }

        const clientAssessment = await Assessment.find({ clientName: clientName, assessmentDate: assessmentDate, _id: { $ne: id }})
        if(clientAssessment.length != 0){
            for(let i = 0; i < clientAssessment.length; i++){
                const clientSlot = await Slot.findById(clientAssessment[i].slotName)
                const newSlot = await Slot.findById(slotName)
                if(clientSlot.startTime === newSlot.startTime){
                    return res.status(400).send({ message: "Client is already scheduled an assessment for the same time"})
                }
            }
            
        }
        
        const slotSession = await Session.find({ slotName: slotName, date: assessmentDate, _id: { $ne: id }}) 
        if(slotSession.length != 0){
            return res.status(400).send({ message: "Selected slot is occupied for the same date"})
        }

        const slotAssessment = await Assessment.find({ slotName: slotName, assessmentDate: assessmentDate, _id: { $ne: id }}) 
        if(slotAssessment.length != 0){
            return res.status(400).send({ message: "Selected slot is occupied for the same date"})
        }


        await assessment.save()
        res.send(assessment)
        
    } catch (error) {
        res.send(error)
    }    
})

router.delete('/assessment/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id;

        const sessionMaster = await AssessmentMaster.findOne({assessment_id : id})
        if(sessionMaster){
            return res.status(400).send({message: 'There is a session master exists in this assessment session'})
        }
        const assessment = await Assessment.deleteOne({_id:req.params.id})
        res.send(assessment)
    } catch (error) {
        res.send(error)
    }
})

router.get('/assessment/:id', authToken, async(req,res)=>{
    try {
        const assessment = await Assessment.findOne({_id:req.params.id}).populate('clientName slotName therapistName')
        res.send(assessment)
        
    } catch (error) {
        res.send(error)
    }
})

router.get('/assessmentbyclient/:id', authToken, async(req,res)=>{
    try {
        const assessment = await Assessment.find({clientName: req.params.id})
        .sort({ assessmentDate: -1 })
        .populate('clientName slotName therapistName')
        res.send(assessment)
        
    } catch (error) {
        res.send(error)
    }
})

router.patch('/assessmentstatusupdate/:id',async(req,res)=>{
    try {
        const assessment = await Assessment.findOne({_id:req.params.id})
        assessment.remarks = req.body.remarks
        assessment.endDate = req.body.endDate
        assessment.status = req.body.status
        await assessment.save()

        res.send(assessment)       
    } catch (error) {
        res.send(error)       
    }
})

module.exports = router