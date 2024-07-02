const express = require('express');
const router =express.Router();
const Session = require('../models/session')
const SessionMaster = require('../models/session_mater');
const authToken = require('../routers/verifyToken');
const Assessment = require('../models/assessment');
const Slot = require('../models/slot');


router.post('/addsession', authToken,async(req,res)=>{
    try {
        const { slotName, clientName, therapistName, date } = req.body;

        const session = new Session({
            slotName: slotName,
            clientName: clientName,
            therapistName: therapistName,
            date: date
        })
   
        const clientSession = await Session.find({ clientName: clientName, date: date})
        if(clientSession.length != 0){
            for(let i = 0; i < clientSession.length; i++){
                const clientSlot = await Slot.findById(clientSession[i].slotName)
                const newSlot = await Slot.findById(slotName)
                if(clientSlot.startTime === newSlot.startTime){
                    return res.status(400).send({ message: "Client is already scheduled a session for the same time"})
                }
            }
            
        }

        const clientAssessment = await Assessment.find({ clientName: clientName, assessmentDate: date})
        if(clientAssessment.length != 0){
            for(let i = 0; i < clientAssessment.length; i++){
                const clientSlot = await Slot.findById(clientAssessment[i].slotName)
                const newSlot = await Slot.findById(slotName)
                if(clientSlot.startTime === newSlot.startTime){
                    return res.status(400).send({ message: "Client is already scheduled an assessment for the same time"})
                }
            }
            
        }
        
        const slotSession = await Session.find({ slotName: slotName, date: date}) 
        if(slotSession.length != 0){
            return res.status(400).send({ message: "Selected slot is occupied for the same date"})
        }

        const slotAssessment = await Assessment.find({ slotName: slotName, assessmentDate: date}) 
        if(slotAssessment.length != 0){
            return res.status(400).send({ message: "Selected slot is occupied for the same date"})
        }
        
        await session.save()
        res.send(session)
    } catch (error) {
        res.send(error)        
    }
})

router.get('/session', authToken, async (req, res) => {
    try {
        try {
            let limit;
            let offset;


            if (req.query.pageSize && req.query.page) {
                limit = req.query.pageSize;
                offset = (req.query.page - 1) * req.query.pageSize;
            }

            const result = await Session.find().skip(offset).limit(limit).sort({ date: -1 })
                .populate({
                    path: 'therapistName',
                    populate: {
                        path: 'therapyCategory'
                    }
                }).populate('slotName').populate('clientName')


            let count = await Session.countDocuments()


            if (req.query.page && req.query.pageSize) {
                const response = {
                    count: count,
                    items: result

                }
                res.json(response)

            }
            else {
                res.json(result)
            }

        } catch (error) {
            res.send(error.message)

        }

        // const session = await Session.find({}).populate({
        //     path: 'therapistName',
        //     populate: {
        //     path: 'therapyCategory'
        //     }        
        // }).populate('slotName').populate('clientName').sort('slotName')

        // res.send(session)

    } catch (error) {
        res.send(error)

    }
})

router.get('/session/:id', authToken,async(req,res)=>{
    try {
        const session = await Session.findOne({_id: req.params.id}).populate('therapistName slotName clientName').sort('slotName')
        res.send(session)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/sessionbyclient/:id', authToken, async(req,res)=>{
    try {
        const session = await Session.find({clientName: req.params.id}).populate({
            path: 'therapistName',
            populate: {
            path: 'therapyCategory'
            }        
        }).populate('slotName').populate('clientName').sort('slotName')
        res.send(session)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.patch('/session/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id
        const { slotName, clientName, therapistName, date} = req.body

        const session = await Session.findByIdAndUpdate(id)
        session.slotName = slotName,
        session.clientName  = clientName,
        session.therapistName = therapistName
        session.date = date

        const clientSession = await Session.find({ clientName: clientName, date: date, _id: { $ne: id }})
        if(clientSession.length != 0){
            for(let i = 0; i < clientSession.length; i++){
                const clientSlot = await Slot.findById(clientSession[i].slotName)
                const newSlot = await Slot.findById(slotName)
                if(clientSlot.startTime === newSlot.startTime){
                    return res.status(400).send({ message: "Client is already scheduled a session for the same time"})
                }
            }
            
        }

        const clientAssessment = await Assessment.find({ clientName: clientName, assessmentDate: date, _id: { $ne: id }})
        if(clientAssessment.length != 0){
            for(let i = 0; i < clientAssessment.length; i++){
                const clientSlot = await Slot.findById(clientAssessment[i].slotName)
                const newSlot = await Slot.findById(slotName)
                if(clientSlot.startTime === newSlot.startTime){
                    return res.status(400).send({ message: "Client is already scheduled an assessment for the same time"})
                }
            }
            
        }
        
        const slotSession = await Session.find({ slotName: slotName, date: date, _id: { $ne: id }}) 
        if(slotSession.length != 0){
            return res.status(400).send({ message: "Selected slot is occupied for the same date"})
        }

        const slotAssessment = await Assessment.find({ slotName: slotName, assessmentDate: date, _id: { $ne: id }}) 
        if(slotAssessment.length != 0){
            return res.status(400).send({ message: "Selected slot is occupied for the same date"})
        }

        await session.save()
        res.send(session)
        
    } catch (error) {
        res.send(error)
    }    
})

router.delete('/session/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id;

        const sessionMaster = await SessionMaster.findOne({session_id : id})
        if(sessionMaster){
            return res.status(400).send({message: 'There is a completed session exists'})
        }
        const session = await Session.findOne({_id:req.params.id})

        const slot = await Slot.findByIdAndUpdate(session.slotName)
        slot.slotStatus = true
        await slot.save()

        const sessionD = await Session.deleteOne({_id:req.params.id})
        res.send(sessionD)
    } catch (error) {
        res.send(error)
    }
})

router.patch('/su/:id', authToken,async(req,res)=>{
    try {
        const session = await Session.findById(req.params.id)
        session.remarks = req.body.remarks
        session.endDate = req.body.endDate
        session.status = req.body.status
        await session.save()

        res.send(session)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/session/slotstatus', authToken,async(req,res)=>{
    try {
        const session = await Session.find({}).populate('slotName')
        // if(session.slotName.slotStatus === true){
        // }

        res.send(session)       
    } catch (error) {
        res.send(error)       
    }
})


module.exports = router;