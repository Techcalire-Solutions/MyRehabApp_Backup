const express = require('express');
const router = express.Router();
const TherapistLeave = require('../models/therapistLeave')
const authToken = require('../routers/verifyToken');


router.post('/therapistLeave', async(req,res)=>{
    try {
        const therapistLeave = new TherapistLeave({
            leaveType: req.body.leaveType,
            reason: req.body.reason,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            therapistId: req.body.therapistId,
            status: req.body.status,
            compensation: req.body.compensation
        })
        await therapistLeave.save()
        res.send(therapistLeave)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/therapistLeave',async(req,res)=>{
    try {
        const therapistLeave = await TherapistLeave.find({}).sort({toDate: -1})
        .populate({
            path: 'therapistId',
            populate: {
                path: 'therapyCategory'
            } 
        }).populate('compensation.clientId')
        .populate({
            path: 'compensation.slotId',
            populate: {
                path: 'therapyCategory'
            }
        })
        res.send(therapistLeave)       
    } catch (error) {
        res.send(error)        
    }
})

router.get('/therapistLeave/:id', authToken,async(req,res)=>{
    try {
        const therapistLeave = await TherapistLeave.findOne({_id: req.params.id}).populate({
            path: 'therapistId',
            populate: {
                path: 'therapyCategory'
            } 
        }).populate('compensation.clientId compensation.slotId')
        res.send(therapistLeave)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.patch('/therapistLeavestatusupdate/:id', authToken, async(req,res)=>{
    try {
          const master = await TherapistLeave.findById(req.params.id)
          master.status = req.body.status
          await master.save()
  
          res.send(master)
    } catch (error) {
      res.send(error)
    }
})

router.patch('/therapistLeave/:id',  async (req, res) => {
    try {
        const therapistLeave = await TherapistLeave.findById(req.params.id);

        if (!therapistLeave) {
            return res.status(404).json({ error: 'Therapist leave not found' });
        }

        therapistLeave.leaveType = req.body.leaveType;
        therapistLeave.reason = req.body.reason;
        therapistLeave.fromDate = req.body.fromDate;
        therapistLeave.toDate = req.body.toDate;
        therapistLeave.status = req.body.status;
        therapistLeave.compensation = req.body.compensation;

        await therapistLeave.save();
        res.json({ message: 'Therapist leave updated successfully', updatedLeave: therapistLeave });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating therapist leave', details: error.message });
    }
});

router.delete('/therapistLeave/:id', authToken, async (req, res) => {
    try {
      const id = req.params.id;
      const result = await TherapistLeave.deleteOne({ _id: id });
  
      if (result.deletedCount === 1) {
     
        res.status(204).send();
      } else {
       
        res.status(404).send({ error: 'Therapist leave not found.' });
      }
    } catch (error) {
    
      res.status(500).send({ error: 'An error occurred while deleting the therapist leave.' });
    }
  });
  


module.exports = router;