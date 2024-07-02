const express = require('express');
const router =express.Router();
const Lmc = require('../models/lmc');
const Slot = require('../models/slot');
const authToken = require('../routers/verifyToken');
const FeeMaster = require('../models/fee_master')
const Session = require('../models/session')
const Fees = require('../models/fees')


router.post('/lmc', authToken, async(req,res)=>{
    const fees = await Fees.find({})
    const lmcFee = fees[0].lmc
    const{clientId, date, slots, sessionStatus, sessionFee, session_id, concession} = req.body;
    
    try {
        const dataRestructre = async (slots)=>{
          
            for (i=0;i<slots.length; i++){
            const session = await Session.findOne({slotName:slots[i].slotId})
             slots[i].therapistId = session.therapistName.toString()
             
             if(slots[i].amountToInara == false){
                slots[i].amountToTherapist = lmcFee;
                slots[i].amountToInara = 0;
             } 
             else if(slots[i].amountToInara == true){
                slots[i].amountToTherapist = 0;
                slots[i].amountToInara = lmcFee;
             }

            }
            return slots
        
        }
        let newSlot = await dataRestructre(slots);
    
       try {
       const leave = new Lmc({clientId, date, slots:newSlot, sessionStatus, sessionFee, concession})
        
       await leave.save()
       res.send(leave) 
       } catch (error) {
            res.send(error)
        }    
    }catch (error) {
        res.send(error)
    }  
})

router.get('/lmcSalary',authToken,async(req,res)=>{

    try {
        const lmcSalary = await Lmc.aggregate([
            {$unwind:{path:"$slots"}}
        ])
        res.send(lmcSalary)
    } catch (error) {
        console.log(error)
    }
    


})


 router.get('/lmc', authToken, async(req,res)=>{
    try {
        const leave = await Lmc.find({}).sort({date: -1}).populate('clientId')
        .populate({
            path:  'slots.slotId',
            populate:{
                path: 'therapyCategory'
            }
        }).populate({
            path:  'slots.therapistId'
        })
        res.send(leave)       
    } catch (error) {
        res.send(error)
        
    }
 })

 router.get('/lmc/:id', authToken, async(req,res)=>{
    try {
        const leave = await Lmc.findOne({_id: req.params.id}).populate('clientId')
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

 router.patch('/lmcstatusupdate/:id', authToken, async(req,res)=>{
  try {
        const res = await Lmc.findByIdAndUpdate(req.params.id)
        res.feeStatus = req.body.feeStatus
        await res.save()

        res.send(res)
  } catch (error) {
    res.send(error)
  }
})

router.patch('/medicalfeeupdate/:id', authToken, async(req,res)=>{
    try {
        const result = await Lmc.findOne({_id:req.params.id})
        result.sessionFee = req.body.sessionFee
        // res.sessionStatus = req.body.sessionStatus
        await result.save()
  
        res.send(result)       
    } catch (error) {
        res.send(error)       
    }
  })


 router.patch('/lmc/:id', authToken, async(req,res)=>{
    try{
        const leave = await Lmc.findByIdAndUpdate(req.params.id)
        leave.clientId = req.body.clientId,
        leave.date = req.body.date,
        leave.slotId = req.body.slotId
        leave.session_id = req.body.session_id

        await leave.save();
        res.send(leave);       
    }
    catch(error){
        res.send(error)
    }
})


router.delete('/lmc/:id', authToken, async(req,res)=>{
    try {
        const feeMaster = await FeeMaster.find({lmcId: req.params.id})

        if(feeMaster.length != 0){
            return res.status(400).send({message: 'Payment for selected LMC is already completed'})
        }
        const result = await Lmc.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
    
})

router.patch('/updateami/:id/:arrayId', authToken, async(req, res) =>{
    try {

        const {ami} = req.body

        const fees = await Fees.find({})
        const lmcFee = fees[0].lmc
        
        const arrayId =req.params.arrayId

        if(ami == false){
            amountToTherapist = lmcFee;
            amountToInara = 0;
         } 
         else if(ami == true){
            amountToTherapist = 0;
            amountToInara = lmcFee;
         }

        const lmc = await Lmc.where('_id').equals(req.params.id).updateOne(
            {
                "slots._id":arrayId
            },
            {
              $set : {
                        "slots.$.amountToTherapist": amountToTherapist,
                        "slots.$.amountToInara": amountToInara
                },
                            
            }
        )
        res.send(lmc)     
         
    } catch (error) {
        return res.send(error)
    }
})

module.exports = router