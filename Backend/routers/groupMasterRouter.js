const express = require('express');
const router = express.Router();
const User = require('../models/user');
const GroupMaster = require('../models/groupMaster');
const authToken = require('../routers/verifyToken');


router.post('/groupsessionmaster', authToken, async(req,res)=>{

  const {date,session_id,clientName,therapistName}= req.body
  try {
   const group = await GroupMaster.find({session_id: session_id, date: date})
    if(group.length != 0){
      return res.status(400).send({message: 'Session already started'})
    }
    
        groupSessionFees = clientName[0].sessionFee
        const groupTotalAmount = clientName.length * groupSessionFees
        const divident = groupTotalAmount/therapistName.length

        for(i=0; i<therapistName.length; i++){
            
            
                let therapist = await User.find({_id: therapistName[i].therapistId})
        
                for(j=0; j<therapist.length; j++){
                   if (therapist[j].sharePercentage==60){
                          const groupShareTherapist = divident*60/100
                          const groupShareInara = divident*40/100
                          amountToTherapist = groupShareTherapist/therapist.length
                          amountToInara = groupShareInara/therapist.length
                          therapistName[i].amountToTherapist= amountToTherapist
                          therapistName[i].amountToInara= amountToInara
                   }
                   if (therapist[j].sharePercentage==50){
                          const groupShare = divident*50/100 
                          amountToInara = groupShare/therapist.length
                          amountToTherapist = groupShare/therapist.length
                          therapistName[i].amountToInara= amountToInara
                          therapistName[i].amountToTherapist= amountToTherapist
                          
                   }
                }
            
               
        }
        try {
          const sessionmaster = new GroupMaster({
            date:date,
            session_id:session_id,
            clientName:clientName,
            therapistName
        })
         await sessionmaster.save()
         res.send(sessionmaster)
          
        } catch (error) {
           res.send(error)
        }
        
    
  } catch (error) {
    return res.send(error)
  }
    
        
  

})

router.get('/groupsessionmaster', async(req,res)=>{
    try {
        const sessionmaster = await GroupMaster.find({}).sort({date: -1})
        .populate('session_id therapistName.therapistId clientName.clientId')
        .populate({
            path: 'session_id',
            populate: {
              path: 'therapistName',
              populate: {
                path: 'therapyCategory'
              }
            }
          }).populate({
            path: 'session_id',
            populate: {
              path: 'clientName',
            }
          }).populate({
            path: 'session_id',
            populate: {
              path: 'slotName',
            }
      })
        res.send(sessionmaster)

    } catch (error) {
        res.send(error)       
    }
})

router.get('/groupsessionmaster/:id', authToken, async(req,res)=>{
    try {
        const sessionmaster = await GroupMaster.findById(req.params.id).populate('session_id therapistName.therapistId clientName.clientId')
        if(!sessionmaster) 
            return res.send('session master does not exist')
        res.send(sessionmaster)
    } catch (error) {
        res.send({error:error.message})
    }
})


router.patch('/groupsessionmaster/therapist/:id', authToken, async(req,res)=>{
  try {
        const master = await GroupMaster.findById(req.params.id)
        master.therapistName = req.body.therapistName
        await master.save()

        res.send(master)
  } catch (error) {
    res.send(error)
  }
})

router.patch('/groupsessionmaster/client/:id', authToken, async(req,res)=>{
  try {
        const master = await GroupMaster.findById(req.params.id)
        master.clientName = req.body.clientName
        await master.save()

        res.send(master)
  } catch (error) {
    res.send(error)
  }
})

router.patch('/updatestatus/:id/:clientNameId', authToken, async(req, res) =>{
  try {

      const {feeStatus} = req.body
      
      const clientNameId = req.params.clientNameId

      const master = await GroupMaster.where('_id').equals(req.params.id).updateOne(
          {
              "clientName._id": clientNameId
          },
          {
            $set : {
                      "clientName.$.feeStatus": feeStatus,               
              },
                          
          }
      )

      res.send(master)     
       
  } catch (error) {
      return res.send(error)
  }
})


// router.patch('/feeupdate/:id', authToken,async(req,res)=>{
//   try {
//       const sM = await sessionMaster.findOne({_id:req.params.id})
//       sM.sessionFee = req.body.sessionFee
//       sM.sessionStatus = req.body.sessionStatus
//       await sM.save()

//       res.send(sM)       
//   } catch (error) {
//       res.send(error)       
//   }
// })

module.exports = router;