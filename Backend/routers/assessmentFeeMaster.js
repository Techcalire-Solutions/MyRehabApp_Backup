const express = require('express');
const router =express.Router();
const FeeMaster = require('../models/assessmentFeeMaster');
const authToken = require('../routers/verifyToken');
const AssessmentMaster = require('../models/assessmentMaster');
const Assessment = require('../models/assessment');
const Concession = require('../models/concession');
const Fees = require ('../models/fees');
const FinancialTransaction = require('../models/financialTransaction')


router.post('/assessmentfeemaster', authToken, async(req,res)=>{

    const { sessionMasterId,collectedAmount,dateAndTime,recievedBy,paymentMode,remarks,amountToBeCollected=600,
    paymentDate = Date.now()}= req.body
    try {
        const feemaster = new FeeMaster({
            sessionMasterId :sessionMasterId,
            collectedAmount :collectedAmount,
            dateAndTime :dateAndTime,
            recievedBy :recievedBy,
            paymentMode :paymentMode,
            remarks : remarks,
            amountToBeCollected : amountToBeCollected,
            paymentDate :paymentDate,          
        })
        await feemaster.save()

        if(req.body.sessionMasterId != null){
            const sm = await AssessmentMaster.findByIdAndUpdate(sessionMasterId)
            sm.feeStatus = true
            await sm.save()
        }

        try {
            const am = await AssessmentMaster.findByIdAndUpdate(sessionMasterId)
            am.status = true
            await am.save()
        } catch (error) {
            console.log(error);
        }
        
        try {
            let fees = await Fees.find({})
            let assessmentFee= fees[0].assessmentFee
            let sessionID = await AssessmentMaster.findById(sessionMasterId);

            let assessment = await Assessment.findById(sessionID.assessment_id).populate(['therapistName','clientName']);
            let concession = await Concession.findOne({clientId: assessment.clientName._id});
            let amounToInara=0;
            let amountToTherapist=0;
            let sharePercentage = assessment.therapistName.sharePercentage
    
            if (sharePercentage==50){
                amounToInara = assessmentFee/2;
                amountToTherapist= assessmentFee/2;
            }
            if (sharePercentage==60){
                amounToInara=assessmentFee*(40/100);
                amountToTherapist=assessmentFee*(60/100);
            }    

                const financialTransaction = new FinancialTransaction({
                    session_master_id: sessionMasterId,
                    therapistId: assessment.therapistName._id,
                    clientId: assessment.clientName._id,
                    sessionType: "Assesment",
                    amountToInara:amounToInara,
                    amountToTherapist:amountToTherapist,
                    paymentDate: Date.now(),
                    paymentMode : paymentMode,
                })
        
                await financialTransaction.save();
        
            } catch (error) {
                console.log(error);
            }






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

 router.get('/assessmentfeemaster',authToken, async(req,res)=>{
    const feemaster = await FeeMaster.find({}).sort({ paymentDate: -1 }).populate({
        path: 'sessionMasterId',
        populate:{
            path: 'assessment_id',
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
        path: 'sessionMasterId',
        populate:{
            path: 'compensation_assessment_id',
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

 router.get('/assessmentfeemaster/:id',authToken, async(req,res)=>{
    try {
        const feemaster = await FeeMaster.find({assessmentMasterId : req.params.id}).sort({ paymentDate: -1 })
        .populate({
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

 module.exports = router