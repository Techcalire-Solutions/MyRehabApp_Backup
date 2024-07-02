const express = require('express')
const router = express.Router()
const Concession = require('../models/concession')
const authToken = require('../routers/verifyToken');
const SessionMaster = require('../models/session_mater');

router.post('/concession', authToken, async(req,res)=>{
    const{clientId, concessionAmount, referredBy, date = Date.now()} = req.body
    try {
        const clientExist = await Concession.findOne({clientId : clientId})
        if(clientExist){
            return res.status(400).send({message: "Concession is already applied to the selected client"})
        }

        const concession = new Concession({
            clientId : clientId,
            concessionAmount : concessionAmount,
            referredBy : referredBy,
            date : date
        })
        await concession.save()
        res.send(concession)
        
    } catch (error) {
       res.send(error) 
    }
})

router.get('/concession', authToken, async(req,res)=>{
    try {
        const concession = await Concession.find({}).sort({date: -1})
        .populate('clientId referredBy')

        res.send(concession)
    } catch (error) {
       res.send(error.message) 
    }
})

router.patch('/concession/:id', authToken,async(req,res)=>{
    try{
        const concession = await Concession.findByIdAndUpdate(req.params.id)
        concession.clientId = req.body.clientId,
        concession.concessionAmount = req.body.concessionAmount   
            
        await concession.save();
        res.send(concession);       
    }
    catch(error){
        res.send(error)
    }
})


router.delete('/concession/:id', authToken, async(req,res)=>{
    try {
        const concession = await Concession.deleteOne({_id:req.params.id})
        res.send(concession)
    } catch (error) {
        res.send(error)
    }
   
})

// -------------------------------------------------------------
router.get('/concessioncount', authToken, async(req,res)=>{
    try {
        const concession = await SessionMaster.aggregate([{
            $group: {
            _id: '$concession'
          }
        }])

        res.send(concession)
    } catch (error) {
       res.send(error.message) 
    }
})

module.exports = router