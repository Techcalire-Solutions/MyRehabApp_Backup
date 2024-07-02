const express = require('express');
const router =express.Router();
const FeeMaster = require('../models/groupFeeMaster');
const authToken = require('../routers/verifyToken');
const GroupMaster = require('../models/groupMaster');

router.post('/groupfeemaster', authToken, async(req,res)=>{
    try {
        const feemaster = new FeeMaster({
            groupMasterId :req.body.groupMasterId,
            clientId :req.body.clientId,
            collectedAmount :req.body.collectedAmount,
            dateAndTime :req.body.dateAndTime,
            recievedBy :req.body.recievedBy,
            paymentMode :req.body.paymentMode,
            remarks : req.body.remarks,
            amountToBeCollected : req.body.amountToBeCollected,
            paymentDate: req.body.paymentDate           
        })
        await feemaster.save()

        const gm = await GroupMaster.findByIdAndUpdate(req.body.groupMasterId)
        gm.status = true
        await gm.save()

        res.send(feemaster)
        
    } catch (error) {
        return res.send(error)       
    }
})

// router.post('/fileupload',multer.single("file"), async(req,res)=>{   
//     try {
//         const result = await cloudinary.uploader.upload(req.file.path);
//         res.send(result);           
//     } catch (error) {
//         res.send(error)
//     }
// })

 router.get('/groupfeemaster',authToken, async(req,res)=>{
    const feemaster = await FeeMaster.find({}).sort({paymentDate: -1})
    .populate('clientId recievedBy').populate({
        path: 'groupMasterId',
        populate:{
            path: 'session_id',
            populate: {
                path: 'therapistName',
                populate: {
                    path: 'therapyCategory'
                }
            },
            populate: {
                path: 'clientName'
            }
        }
    })

    res.send(feemaster)    
 })

 router.get('/groupfeemaster/:id',authToken, async(req,res)=>{
    try {
        const feemaster = await FeeMaster.find({assessmentMasterId : req.params.id}).populate({
            path: 'sessionMasterId',
            populate:{
                path: 'assessment_id',
                populate: {
                    path: 'therapistName',
                    populate: {
                        path: 'therapyCategory'
                    }
                }
            }
        }).populate({path: 'recievedBy'})
           
        res.send(feemaster)       
    } catch (error) {
        res.send(error)        
    }
 })

 router.patch('/groupfeemasterupdate/:id', authToken, async(req,res)=>{
    try {
        const result = await FeeMaster.findOne({sessionMasterId:req.params.id})
        result.paymentDate = req.body.paymentDate
        await result.save()

        res.send(result)       
    } catch (error) {
        res.send(error)       
    }
 })

 module.exports = router