
const express = require('express');
const router =express.Router();
const Slot = require('../models/slot');
const Session = require('../models/session');
const Assessment = require('../models/assessment');
const authToken = require('../routers/verifyToken');
const Client = require('../models/client');

router.post('/addslot', authToken, async(req,res)=>{
    const {roomName, slotName, startTime, endTime, weekDay, therapyCategory, slotStatus, onCall} = req.body
    try {
        const slotN = await Slot.findOne({slotName : slotName})
        if (slotN){
            return res.status(400).send({message: 'Slot name already exists'})
        }
    } catch (error) {
        res.send(error)
    }

    if(req.body.therapyCategory == ""){
        return res.status(400).send({message: 'Category not added'})
    }

    try {
        const slot = new Slot({         
            roomName: roomName,
            slotName: slotName,
            startTime: startTime,
            endTime : endTime,
            weekDay: weekDay,
            therapyCategory: therapyCategory,
            onCall : onCall
        })
        await slot.save()
        
        res.send(slot)        
    } catch (error) {
        res.send(error)        
    }
})

router.get('/slot', authToken,async(req,res)=>{
    try {
        let limit ;
        let offset;
    
        if(req.query.pageSize && req.query.page){
            limit = req.query.pageSize;
            offset = (req.query.page - 1)* req.query.pageSize;
        }

        const slot = await Slot.find({}).skip(offset).limit(limit)
        .populate('roomName therapyCategory').sort({ weekDay: 1, startTime: 1, 'roomName.roomName': 1 });

        let count  = await Slot.countDocuments()

        if(req.query.page && req.query.pageSize){
            const response = {
                count : count,
                items : slot
             
            }
            res.json(response)
          
        }
        else{
            res.json(slot)
        }       
    } catch (error) {
        res.send(error)     
    }
})

router.get('/filteredslot', authToken,async(req,res)=>{
    try {
        const slot = await Slot.find({slotStatus : true}).populate('roomName therapyCategory').sort('weekDay startTime roomName.roomName')

        res.send(slot)       
    } catch (error) {
        res.send(error)     
    }
})

router.get('/therapistslot', authToken,async(req,res)=>{
    try {
        let therapist = req.body.therapist
        
        const slot = await Slot.find({slotStatus : true}).populate('roomName therapyCategory').sort('weekDay startTime roomName.roomName')

        res.send(slot)       
    } catch (error) {
        res.send(error)     
    }
})

router.get('/slot/:id', authToken, async(req, res)=>{
    try {
        const slot = await Slot.findById(req.params.id).populate('roomName therapyCategory')

        res.send(slot)
    } catch (error) {
        res.send(error) 
    }
})

router.patch('/slotupdate/:id', authToken,async(req,res)=>{
    try {
        const slot = await Slot.findOne({_id:req.params.id})
        slot.slotStatus = req.body.slotStatus
        await slot.save()

        res.send(slot)       
    } catch (error) {
        res.send(error)       
    }
})

router.get('/endsession/:id', authToken,async(req,res)=>{
    try {
          const session = await Session.find({clientName:req.params.id});
          for(let i = 0; i < session.length; i++) {
            session[i].status = true;
            session[i].remarks = req.body.remarks
            session[i].endDate = Date.now()

            session[i].save()

            const slot = await Slot.findOne({_id: session[i].slotName})
            slot.slotStatus = true

            await slot.save()
          } 
          res.send(session)     
    } catch (error) {
        res.send(error)       
    }

    try {
        const client = await Client.findById(req.params.id)
        client.status = 'DS'

        await client.save()
  } catch (error) {
        res.send(error)
  }
})

router.patch('/slot/:id', authToken, async(req,res)=>{
    try {
       
    } catch (error) {
        res.send(error)
    }

    try {
     
        const slot = await Slot.findByIdAndUpdate(req.params.id)
            slot.roomName = req.body.roomName,
            slot.slotName=req.body.slotName,
            slot.startTime=req.body.startTime,
            slot.endTime =req.body.endTime,
            slot.weekDay=req.body.weekDay,
            slot.therapyCategory=req.body.therapyCategory,
            slot.slotStatus=req.body.slotStatus,
            slot.onCall=req.body.onCall

        await slot.save()

        res.send(slot)
    } catch (error) {
        res.send(error)
    }
})

router.delete('/slot/:id', authToken, async(req,res)=>{

    const id = req.params.id;

        const session = await Session.findOne({slotName : id})
        if(session){
            return res.status(400).send({message: 'There is a session exists in this slot, please remove session before delete slot'})
        }

        const assessment = await Assessment.findOne({slotName : id})
        if(assessment){
            return res.status(400).send({message: 'There is a assessment session exists in this slot, please remove assessment session before delete slot'})
        }

    const slot = await Slot.deleteOne({_id:req.params.id});

    res.send(slot);
})

module.exports = router