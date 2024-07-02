const express = require('express');
const router =express.Router();
const Task = require('../models/task');
const authToken = require('../routers/verifyToken');
const multer= require("../utlis/multer");
const cloudinary = require('../utlis/cloudinary');

router.post('/task', authToken,async(req,res)=>{
    try {
        const {sessionMasterId, tasks, assignedDate} = req.body
        const result = new Task({
            sessionMasterId : sessionMasterId,
            tasks : tasks,
            assignedDate : assignedDate
        })
        await result.save()
        res.send(result) 
             
    } catch (error) {
        return res.send(error)
        
    }
})

router.post('/taskfileupload', authToken, multer.single('file'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
       
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

router.get('/task', authToken, async(req,res)=>{
    try {
        const task = await Task.find({}).sort({assignedDate: -1})
        .populate({
            path: 'sessionMasterId',
            populate: [
                {
                    path: 'session_id',
                    populate: [{
                        path: 'clientName'
                    },{
                        path: 'therapistName',
                        populate: [{
                            path: 'therapyCategory'
                        }]
                    }]
                }
            ]
        }).populate({
            path: 'sessionMasterId',
            populate: [
                {
                    path: 'leave_session_id',
                    populate: [{
                        path: 'clientName'
                    },{
                        path: 'therapistName',
                        populate: [{
                            path: 'therapyCategory'
                        }]
                    }]
                }
            ]
        }).populate({
            path: 'sessionMasterId',
            populate: [
                {
                    path: 'compensation_session_id',
                    populate: [{
                        path: 'clientName'
                    },{
                        path: 'therapistName',
                        populate: [{
                            path: 'therapyCategory'
                        }]
                    }]
                }
            ]
        })
        res.send(task)       
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/task/:id', authToken, async(req,res)=>{
    try {
        const task = await Task.findOne({_id : req.params.id}).populate({
            path: 'sessionMasterId',
            populate: [
                {
                    path: 'session_id',
                    populate: [{
                        path: 'clientName'
                    },{
                        path: 'therapistName',
                        populate: [{
                            path: 'therapyCategory'
                        }]
                    }]
                }
            ]
        }).populate({
            path: 'sessionMasterId',
            populate: [
                {
                    path: 'leave_session_id',
                    populate: [{
                        path: 'clientName'
                    },{
                        path: 'therapistName',
                        populate: [{
                            path: 'therapyCategory'
                        }]
                    }]
                }
            ]
        }).populate({
            path: 'sessionMasterId',
            populate: [
                {
                    path: 'compensation_session_id',
                    populate: [{
                        path: 'clientName'
                    },{
                        path: 'therapistName',
                        populate: [{
                            path: 'therapyCategory'
                        }]
                    }]
                }
            ]
        })
        res.send(task)
    } catch (error) {
        res.send(error)
    }
})

router.patch('/status/:id', authToken, async (req, res) => {
    try {  
        const task = await Task.findById(req.params.id); // Assuming you are using req.params.id to find the task

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        task.taskStatus = req.body.taskStatus;
        // Save the changes to the task
        await task.save();
        // Send the updated subtask or any other response
        res.send(task);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.patch('/status/:id/:taskid', authToken, async (req, res) => {
    try {  
        const task = await Task.findById(req.params.taskid); // Assuming you are using req.params.id to find the task

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        const subtask = task.tasks.find(t => t._id == req.params.id);

        if (!subtask) {
            return res.status(404).send({ error: 'Subtask not found' });
        }

        subtask.status = req.body.status;
        await subtask.save();
        // Save the changes to the task
        await task.save();

        // Send the updated subtask or any other response
        res.send(task);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.patch('/starttask/:id/:taskid', authToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskid); // Assuming you are using req.params.id to find the task

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        const subtask = task.tasks.find(t => t._id == req.params.id);

        if (!subtask) {
            return res.status(404).send({ error: 'Subtask not found' });
        }

        subtask.status = 'Done';
        subtask.completedDate = Date.now();
        subtask.response = req.body.response;
        subtask.file_url = req.body.file_url;
        subtask.cloudinary_id = req.body.cloudinary_id;

        // Save the changes to the task
        await subtask.save();

        await task.save();

        // Send the updated subtask or any other response
        res.send(task);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.patch('/reviewtask/:id/:taskid', authToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskid); // Assuming you are using req.params.id to find the task

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        const subtask = task.tasks.find(t => t._id == req.params.id);

        if (!subtask) {
            return res.status(404).send({ error: 'Subtask not found' });
        }

        subtask.status = 'Reviewed';
        subtask.point = req.body.point;
        subtask.remarks = req.body.remarks;

        // Save the changes to the task
        await subtask.save();

        await task.save();

        // Send the updated subtask or any other response
        res.send(task);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


// router.delete('/room/:id', async(req,res)=>{
//     try {
//         const id = req.params.id;

//         const slot = await Slot.findOne({roomName : id})
//         if(slot){
//             return res.status(400).json({message: 'There is a slot exists in this room, please remove slot before delete room'})
//         }
//         const result = await Room.deleteOne({_id:req.params.id})
//         res.send(result)
//     } catch (error) {
//         res.send(error)
//     }
    
// })



module.exports = router