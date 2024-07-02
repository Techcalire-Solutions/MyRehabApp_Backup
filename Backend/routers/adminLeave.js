const express = require('express');
const router = express.Router();
const AdminLeave = require('../models/adminLeave')
const authToken = require('../routers/verifyToken');


router.post('/adminLeave', async(req,res)=>{
    try {
        const adminLeave = new AdminLeave({
            leaveType: req.body.leaveType,
            reason: req.body.reason,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            adminId: req.body.adminId,
            status: req.body.status
        })
        await adminLeave.save()
        res.send(adminLeave)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/adminLeave',async(req,res)=>{
    try {
        const adminLeave = await AdminLeave.find({}).sort({toDate: -1})
        .populate({
            path: 'adminId'
        })
        res.send(adminLeave)       
    } catch (error) {
        res.send(error)        
    }
})

router.get('/adminLeave/:id', authToken,async(req,res)=>{
    try {
        const adminLeave = await AdminLeave.findOne({_id: req.params.id}).populate({
            path: 'adminId'
        })
        res.send(adminLeave)
        
    } catch (error) {
        res.send(error)
        
    }
})

router.patch('/adminLeave/:id',  async (req, res) => {
    try {
        const adminLeave = await AdminLeave.findById(req.params.id);

        if (!adminLeave) {
            return res.status(404).json({ error: 'Admin leave not found' });
        }

        adminLeave.leaveType = req.body.leaveType;
        adminLeave.reason = req.body.reason;
        adminLeave.fromDate = req.body.fromDate;
        adminLeave.toDate = req.body.toDate;
        adminLeave.status = req.body.status;
        adminLeave.adminId = req.body.adminId;

        await adminLeave.save();
        res.json({ message: 'Admin leave updated successfully', updatedLeave: adminLeave });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating therapist leave', details: error.message });
    }
});

router.delete('/adminLeave/:id', authToken, async (req, res) => {
    try {
      const id = req.params.id;
      const result = await AdminLeave.deleteOne({ _id: id });
  
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