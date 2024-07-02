const express = require('express');
const router =express.Router();
const Room = require('../models/room');
const Slot = require('../models/slot');
const authToken = require('../routers/verifyToken');


router.post('/addroom', authToken, async(req,res)=>{
    try {
        const room = new Room({
            roomName :req.body.roomName
        })
        await room.save()
        res.send(room)       
    } catch (error) {
        return res.send(error)
        
    }
})


 router.get('/room', authToken,async(req,res)=>{
    try {
        const room = await Room.find({
            order: [['_id', 'DESC']],
        })
        res.send(room)       
    } catch (error) {
        res.send(error)
        
    }
 })


 router.patch('/room/:id', authToken, async(req,res)=>{
    try{
        const room = await Room.findByIdAndUpdate(req.params.id)
        room.roomName = req.body.roomName       
        await room.save();
        res.send(room);       
    }
    catch(error){
        res.send(error)
    }
})


router.delete('/room/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id;

        const slot = await Slot.findOne({roomName : id})
        if(slot){
            return res.status(400).send({message: 'There is a slot exists in this room, please remove slot before delete room'})
        }
        const result = await Room.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
    
})



module.exports = router