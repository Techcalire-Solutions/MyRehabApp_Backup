const express = require('express');
const router =express.Router();
const Activity = require('../models/activity');

const authToken = require('../routers/verifyToken');
const multer= require("../utlis/multer");
const cloudinary = require('../utlis/cloudinary');


router.post('/activity', authToken,async(req,res)=>{
    try {
        const {sessionMasterId, assignedDate, activityDetails,activityStatus} = req.body
        const result = new Activity({
            sessionMasterId : sessionMasterId,
            assignedDate : assignedDate,
            activityStatus: activityStatus,
            activityDetails:activityDetails

        })
        await result.save()
        res.send(result) 
             
    } catch (error) {
        return res.send(error)
        
    }
})



router.get('/activity', authToken, async(req,res)=>{
    try {
        const task = await Activity.find({}).sort({assignedDate: -1})
      
        res.send(task)       
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/activity/:smId', authToken, async (req, res) => {
    try {
      const activity = await Activity.findOne({ sessionMasterId: req.params.smId }).populate('sessionMasterId');
      res.send(activity);
    } catch (error) {
      res.send(error);
    }
  });
  







router.patch('/activitystatus/:id', authToken, async (req, res) => {
    try {  
      const activity = await Activity.findById(sessionMasterId = req.params.id);
  
      if (!activity) {
        return res.status(404).send({ error: 'Activity not found' });
      }
  
      activity.activityStatus = req.body.activityStatus;
      await activity.save();
      res.send(activity);
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });


  router.patch('/activity/:id', authToken, async(req,res)=>{
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id)
        activity.assignedDate = req.body.assignedDate
        activity.activityStatus = req.body.activityStatus
        activity.activityDetails = req.body.activityDetails
      

        await activity.save()
        res.send(activity)
    } catch (error) {
        res.send(error)
    }
})

// router.get('/activity/:id', async (req, res) => {
//     try {
//         const activity = await Activity.findById(req.params.id);
//         if (!activity) {
//             return res.status(404).send({ error: 'Activity not found' });
//         }
//         res.send(activity);
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });

// router.get('/activity/:id', authToken, async (req, res) => {
//     try {
//         // const activity = await Activity.findOne({ id: req.params.id });
//         const activity = await Activity.findOne({id:req.params.id})


//         if (!activity) {
//             return res.status(404).send({ error: 'Activity not found for the given ID' });
//         }
//         res.send(activity);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send({ error: 'Internal server error' });
//     }
// });

router.get('/activity/:sessionMasterId', authToken, async (req, res) => {
    try {
        const activity = await Activity.findOne({ sessionMasterId: req.params.sessionMasterId });

        if (!activity) {
            return res.status(404).send({ error: 'Activity not found for the given sessionMasterId' });
        }
        res.send(activity);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Internal server error' });
    }
});


module.exports = router