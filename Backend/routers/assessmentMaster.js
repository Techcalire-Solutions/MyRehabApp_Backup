const express = require('express')
const router = express.Router()
const assessmentMaster = require('../models/assessmentMaster')
const authToken = require('../routers/verifyToken');
const Assessment = require('../models/assessment');
const Fees = require ('../models/fees');
const LeaveSession = require('../models/leaveSession');
const CompensationSession = require('../models/compensationSession');

router.post('/assessmentmaster', authToken, async(req,res)=>{

  const{date,assessment_id,therapistName,assessmentFee,feeStatus,leave_session_id,sessionStatus,compensation_assessment_id,category}=req.body
   
  try {
    if(assessment_id){
      this.assessment = await Assessment.findById(assessment_id).populate(['therapistName','clientName']);
      this.am = await assessmentMaster.find({assessment_id: assessment_id, date: date})
    }else if(leave_session_id){
      this.assessment = await LeaveSession.findById(leave_session_id).populate(['therapistName','clientName']);
      this.am = await assessmentMaster.find({leave_session_id: leave_session_id, date: date})
    }else if(compensation_assessment_id){
      this.assessment = await CompensationSession.findById(compensation_assessment_id).populate(['therapistName','clientName']);
      this.am = await assessmentMaster.find({compensation_assessment_id: compensation_assessment_id, date: date})
    }

    if(this.am.length != 0){
      return res.status(400).send({message: 'Assessment already started'})
    }

  
    let sharePercentage = this.assessment.therapistName.sharePercentage
    let TherapistId = this.assessment.therapistName._id

    if (sharePercentage==50){
      this.amountToInara = assessmentFee/2;
      this.amountToTherapist= assessmentFee/2;
    }
    if (sharePercentage==60){
      this.amountToInara=assessmentFee*(40/100);
      this.amountToTherapist=assessmentFee*(60/100);
    } 

    try {
      const assessmentmaster = new assessmentMaster({
          date:date,
          assessment_id:assessment_id,
          therapistName:therapistName,
          assessmentFee:assessmentFee,
          feeStatus:feeStatus,
          leave_session_id:leave_session_id,
          sessionStatus: sessionStatus,
          compensation_assessment_id: compensation_assessment_id,
          category: category,
          amountToInara:this.amountToInara,
          amountToTherapist:this.amountToTherapist,
          therapistId:TherapistId
      })
      await assessmentmaster.save()
      res.send(assessmentmaster)
      
  } catch (error) {
      res.send(error)
      
  }
 
    
  } catch (error) {
    return res.send(error.message)
  }
    
  
  
  
})

router.get('/assessmentmaster', authToken, async(req,res)=>{
    try {
        // const assessmentMaster = await assessmentMaster.find({}).populate('session_id session_id.therapistName')
        const assessmentmaster = await assessmentMaster.find({}).sort({ date: -1 })
        .populate({
            path: 'assessment_id',
            populate: {
              path: 'therapistName',
              populate: {
                path: 'therapyCategory',
              }
            }
          }).populate({
            path: 'assessment_id',
            populate: {
              path: 'clientName',
            }
        }).populate({
            path: 'assessment_id',
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
        path: 'compensation_assessment_id',
        populate: {
          path: 'therapistName',
          populate: {
            path: 'therapyCategory',
          }
        }
      }).populate({
        path: 'compensation_assessment_id',
        populate: {
          path: 'clientName',
        }
    }).populate({
        path: 'compensation_assessment_id',
        populate: {
          path: 'slotName',
        }
    })
        res.send(assessmentmaster)

    } catch (error) {
        res.send(error)       
    }
})

router.get('/assessmentmaster/:id', authToken, async(req,res)=>{
    try {
        const assessmentmaster = await assessmentMaster.findById(req.params.id).populate({
            path: 'assessment_id',
            populate: {
              path: 'therapistName',
              populate: {
                path: 'therapyCategory'
              }
            }
          }).populate({
            path: 'assessment_id',
            populate: {
              path: 'clientName',
            }
        }).populate({
            path: 'assessment_id',
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
        path: 'compensation_assessment_id',
        populate: {
          path: 'therapistName',
          populate: {
            path: 'therapyCategory',
          }
        }
      }).populate({
        path: 'compensation_assessment_id',
        populate: {
          path: 'clientName',
        }
    }).populate({
        path: 'compensation_assessment_id',
        populate: {
          path: 'slotName',
        }
    })
        if(!assessmentmaster) 
            return res.send('assessment master does not exist')
        res.send(assessmentmaster)
    } catch (error) {
        res.send({error:error.message})
    }
})

router.patch('/feestatusupdate/:id', authToken, async(req,res)=>{
  try {
        const master = await assessmentMaster.findById(req.params.id)
        master.feeStatus = req.body.feeStatus
        await master.save()

        res.send(master)
  } catch (error) {
    res.send(error)
  }
})

module.exports = router;