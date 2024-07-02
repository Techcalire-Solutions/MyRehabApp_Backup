const express = require('express')
const router = express.Router()
const sessionMaster = require('../models/session_mater')
const authToken = require('../routers/verifyToken');
const Session = require('../models/session');
const LeaveSession = require('../models/leaveSession');
const CompensationSession = require('../models/compensationSession');
const Concession = require('../models/concession');
// const { startSession, default: mongoose } = require('mongoose');

router.post('/sessionmaster', authToken,async(req,res)=>{
      const {date = Date.now(), session_id, therapistName, sessionFee, feeStatus, concession, sessionStatus, leave_session_id,
          compensation_session_id, category, therapistId} = req.body
      let amountToInara=0;
      let amountToTherapist=0;
      try {
        if(session_id){
          this.session = await Session.findById(session_id).populate(['therapistName','clientName']);
          this.sm = await sessionMaster.find({session_id: session_id, date: date})
        }else if(leave_session_id){
          this.session = await LeaveSession.findById(leave_session_id).populate(['therapistName','clientName']);
          this.sm = await sessionMaster.find({leave_session_id: leave_session_id, date: date})
        }else if(compensation_session_id){
          this.session = await CompensationSession.findById(compensation_session_id).populate(['therapistName','clientName']);
          this.sm = await sessionMaster.find({compensation_session_id: compensation_session_id, date: date})
        }

        if(this.sm.length != 0){
          return res.status(400).send({message: 'Session already started'})
        }
      let concession = await Concession.find({clientId: this.session.clientName._id});
     
      let sharePercentage = this.session.therapistName.sharePercentage
      if(concession != null){
        if(concession.concessionAmount === 100){
          if (sharePercentage==50){
            this.amountToInara = (sessionFee - 100)/2;
            this.amountToTherapist= (sessionFee - 100)/2;
          }
          if (sharePercentage==60){
            this.amountToInara=(sessionFee - 100)*(40/100);
            this.amountToTherapist=(sessionFee - 100)*(60/100);
          } 
        }else if(concession.concessionAmount === 150){
          if (sharePercentage==50){
            this.amountToInara = 100;
            this.amountToTherapist = 250;
          }
          if (sharePercentage==60){
            this.amountToInara=50;
            this.amountToTherapist=300;
          }
        }else{
          if (sharePercentage==50){
            this.amountToInara = sessionFee/2;
            this.amountToTherapist= sessionFee/2;
          }
          if (sharePercentage==60){
            this.amountToInara=sessionFee*(40/100);
            this.amountToTherapist=sessionFee*(60/100);
          } 
        }

      } else {
        if (sharePercentage==50){
          this.amountToInara=250;
          this.amountToTherapist=250;
        }
        if (sharePercentage==60){
          this.amountToInara=200;
          this.amountToTherapist=300;
        }
    }  
    } catch (error) {
      return res.send(error);
    }
    try {
        const sessionmaster = new sessionMaster({
            date: date,
            session_id: session_id,
            therapistName: therapistName,
            sessionFee: sessionFee,
            feeStatus: feeStatus,
            concession: concession,
            sessionStatus: sessionStatus,
            leave_session_id : leave_session_id,
            compensation_session_id : compensation_session_id,
            category : category,
            therapistId : therapistId,
            amountToInara: this.amountToInara,
            amountToTherapist: this.amountToTherapist
        })

        await sessionmaster.save()
        return res.send(sessionmaster)
        
    } catch (error) {
        return res.send(error)
        
    }
})

router.get('/sessionmaster', authToken, async(req,res)=>{
    try {
        // const sessionmaster = await sessionMaster.find({}).populate('session_id session_id.therapistName')
        const sessionmaster = await sessionMaster.find({}).sort({date: -1})
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
          }).populate({
          path: 'leave_session_id',
          populate: {
            path: 'therapistName',
            populate: {
              path: 'therapyCategory',
            }
          }
        }).populate({
          path: 'leave_session_id',
          populate: {
            path: 'clientName',
          }
      }).populate({
          path: 'leave_session_id',
          populate: {
            path: 'slotName',
          }
      }).populate({
        path: 'compensation_session_id',
        populate: {
          path: 'therapistName',
          populate: {
            path: 'therapyCategory',
          }
        }
      }).populate({
        path: 'compensation_session_id',
        populate: {
          path: 'clientName',
        }
    }).populate({
        path: 'compensation_session_id',
        populate: {
          path: 'slotName',
        }
    })
        res.send(sessionmaster)

    } catch (error) {
        res.send(error)       
    }
})

router.get('/sessionmaster/:id', authToken, async(req,res)=>{
    try {
        const sessionmaster = await sessionMaster.findById(req.params.id).populate({
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
        }).populate({
          path: 'leave_session_id',
          populate: {
            path: 'therapistName',
            populate: {
              path: 'therapyCategory',
            }
          }
        }).populate({
          path: 'leave_session_id',
          populate: {
            path: 'clientName',
          }
      }).populate({
          path: 'leave_session_id',
          populate: {
            path: 'slotName',
          }
      }).populate({
        path: 'compensation_session_id',
        populate: {
          path: 'therapistName',
          populate: {
            path: 'therapyCategory',
          }
        }
      }).populate({
        path: 'compensation_session_id',
        populate: {
          path: 'clientName',
        }
    }).populate({
        path: 'compensation_session_id',
        populate: {
          path: 'slotName',
        }
    })
        if(!sessionmaster) 
            return res.send('session master does not exist')
        res.send(sessionmaster)
    } catch (error) {
        res.send({error:error.message})
    }
})

router.patch('/statusupdate/:id', authToken, async(req,res)=>{
  try {
        const master = await sessionMaster.findById(req.params.id)
        master.feeStatus = req.body.feeStatus
        await master.save()

        res.send(master)
  } catch (error) {
    res.send(error)
  }
})

router.patch('/feeupdate/:id', authToken,async(req,res)=>{
  try {
      const sM = await sessionMaster.findOne({_id:req.params.id})
      sM.sessionFee = req.body.sessionFee
      sM.sessionStatus = req.body.sessionStatus
      await sM.save()

      res.send(sM)       
  } catch (error) {
      res.send(error)       
  }
})

// router.get ('/getsalary', authToken, async(req, res)=>{
//   const {startDate, endDate, therapistId} = req.body;
  
//   // if (!therapistId){
//   //   return res.send({message:"Therapist Not selected"})
//   // }
  
//   try {
//     // const result = await sessionMaster.find({ therapistId: therapistId , date: {$gte : startDate, $lte : endDate}})

    
//     const result1 = await sessionMaster.aggregate([
//     // {
//     //   $match:{}
//     // }
//     //  { $match: {therapistId:mongoose.Types.ObjectId(therapistId)}},
//      {$group:{_id:"$therapistId", Total: {$sum:"$amountToTherapist"},TotalSession: { $sum: 1 }}},
    
//      {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: '_id',
//         as: "therapistId",
//       },
//     },
//     {
//       $unwind:{path:'$therapistId'}
//     }
//     ]);
//     res.send(result1) 
//   } catch (error) {
//     res.send(error)
//   }
// })

module.exports = router;