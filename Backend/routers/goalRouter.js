const express = require('express')
const router = express.Router()
const Goal = require('../models/goal');
const authToken = require('../routers/verifyToken');

router.post('/', authToken,async(req,res)=>{
    try {
        const { clientId, goals} = req.body;

        let client = await Goal.findOne({clientId: clientId})
        if(client){
            return res.send({message: "Goal is already added for the selected client"})
        }
        const result = new Goal({
            clientId : clientId,
            goals : goals
        })
        await result.save()
        res.send(result)       
    } catch (error) {
       return  res.send(error)       
    }
})


router.get('/', authToken, async(req,res)=>{
    try {
        const goal = await Goal.find({}).populate('clientId').sort({_id: -1})

        res.send(goal)
    } catch (error) {
        res.send (error)
    }
})

router.get('/clientid/:id', authToken, async(req,res)=>{
    try {
        const goal = await Goal.find({clientId: req.params.id}).populate('clientId')

        res.send(goal)
    } catch (error) {
        res.send (error)
    }
})

router.get('/:id', authToken, async(req,res)=>{
    try {
        const goal = await Goal.findById(req.params.id).populate('clientId')

        res.send(goal)
    } catch (error) {
        res.send (error)
    }
})

router.patch('/upadategoal/:id/:goalId', authToken, async(req, res) =>{
    try {

        const {progressNote, goalStatus} = req.body
        
        const arrayId = req.params.goalId

        const goal = await Goal.where('_id').equals(req.params.id).updateOne(
            {
                "goals._id":arrayId
            },
            {
              $set : {
                        "goals.$.progressNote": progressNote,
                        "goals.$.goalStatus": goalStatus
                },
                            
            }
        )

        res.send(goal)     
         
    } catch (error) {
        return res.send(error)
    }
})

router.patch('/addnewgoal/:id', authToken, async(req, res) =>{
    try {

        const {goals} = req.body
        
        // Update the document with a new goal
        const result = await Goal.findOneAndUpdate(
            { _id: req.params.id }, // Find the document based on clientId
            { $push: { goals: goals } }, // Add the new goal to the goals array
            { new: true }, // Return the modified document
            (err, updatedDocument) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Document updated successfully:', updatedDocument);
                }
            }
        );
        res.send(result)
         
    } catch (error) {
        return res.send(error)
    }
})

// router.patch('/goal/:id', authToken, async(req,res)=>{
//     try {
//         const goal = await Goal.findByIdAndUpdate(req.params.id)

//         goal.sessionFee = req.body.sessionFee,
//         goal.assessmentFee = req.body.assessmentFee
//         goal.lmc = req.body.lmc
//         goal.groupSessionFee = req.body.groupSessionFee

//         await goal.save()

//         res.send(goal)
        
//     } catch (error) {
//         res.send(error)
//     }
// })
module.exports = router