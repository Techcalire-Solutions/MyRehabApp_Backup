const express = require('express');
const router =express.Router();
const FeeMaster = require('../models/fee_master');
const cloudinary = require('../utlis/cloudinary');
const multer= require("../utlis/multer");
const authToken = require('../routers/verifyToken');
const SessionMaster = require('../models/session_mater');
const Session = require('../models/session')
const Concession= require('../models/concession');
const Lmc = require('../models/lmc');

const FinancialTransaction = require('../models/financialTransaction')

router.post('/feemaster', authToken, async(req,res)=>{
    const {sessionMasterId, lmcId, groupMasterId, sessionType, collectedAmount, dateAndTime, paymentDate = Date.now(), recievedBy, paymentMode, 
        remarks, amountToBeCollected, collectedTo, arrayId} = req.body
    try {
        const feemaster = new FeeMaster({
            sessionMasterId : sessionMasterId,
            lmcId : lmcId,
            groupMasterId : groupMasterId,
            sessionType : sessionType,
            collectedAmount : collectedAmount,
            dateAndTime : dateAndTime,
            paymentDate : paymentDate,
            recievedBy : recievedBy,
            paymentMode : paymentMode,
            remarks : remarks,
            amountToBeCollected : amountToBeCollected,
            collectedTo : collectedTo,
            arrayId : arrayId,        
        })

        if(req.body.sessionMasterId != null){
            const sm = await SessionMaster.findByIdAndUpdate(sessionMasterId)
            sm.feeStatus = true
            await sm.save()
        }

        if(req.body.lmcId != null){
            const lmc = await Lmc.where('_id').equals(lmcId).updateOne(
                {
                    "slots._id":arrayId
                },
                {
                  $set : {
                            "slots.$.feeStatus": true
                    },
                                
                }
            )
       
        }

        await feemaster.save()

           
        res.send(feemaster)
        
    } catch (error) {
        return res.send(error)
        
    }
})

router.post('/fileupload', authToken, multer.single("file"), async(req,res)=>{   
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.send(result);           
    } catch (error) {
        res.send(error)
    }
})

router.get('/feemaster', authToken, async(req,res)=>{
    const feemaster = await FeeMaster.find({}).sort({paymentDate: -1})
    .populate({
        path: 'sessionMasterId',
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
    }).populate({path: 'recievedBy'}).populate({
        path: 'sessionMasterId',
        populate:{
            path: 'leave_session_id',
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
    }).populate({
        path: 'lmcId',
        populate: {
            path: 'clientId',
        },
    }).populate({
        path: 'lmcId',
        populate: {
            path: 'slots.therapistId',
        },
    }).populate({
        path: 'groupMasterId',
        populate:{
            path: 'therapistName.therapistId'              
        },
        populate: {
            path: 'clientName.clientId',
        }
    })
    res.send(feemaster)    
 })

 router.get('/feemaster/:id', authToken,async(req,res)=>{
    try {
        const feemaster = await FeeMaster.findOne({sessionMasterId : req.params.id}).populate({
            path: 'sessionMasterId',
            populate: [
                {
                    path: 'session_id',
                    populate: [{
                        path: 'therapistName',
                        populate: {
                            path: 'therapyCategory'
                        }
                    },
                    {
                        path: 'slotName'
                    },
                    {
                        path: 'clientName'
                    }]
                },
                
            ]
        })
        .populate({
            path: 'lmcId',
            populate: [
                {
                    path: 'session_id',
                    populate: {
                        path: 'therapistName',
                        populate: {
                            path: 'therapyCategory'
                        }
                    }
                },
                {
                    path: 'slotName'
                },
                {
                    path: 'clientName'
                }
            ]
        })
        
        .populate({path: 'recievedBy'})
           
        res.send(feemaster)       
    } catch (error) {
        res.send(error)        
    }
 })

 router.patch('/feemasterupdate/:id', authToken, async(req,res)=>{
    try {
        const result = await FeeMaster.findOne({sessionMasterId:req.params.id})
        result.paymentDate = req.body.paymentDate
        await result.save()

        res.send(result)       
    } catch (error) {
        res.send(error)       
    }
 })

 router.patch('/feemasterupdatelmc/:id', authToken,async(req,res)=>{
    try {
        const result = await FeeMaster.findOne({lmcId:req.params.id})
        result.paymentDate = req.body.paymentDate
        await result.save()

        res.send(result)       
    } catch (error) {
        res.send(error)       
    }
 })


 module.exports = router