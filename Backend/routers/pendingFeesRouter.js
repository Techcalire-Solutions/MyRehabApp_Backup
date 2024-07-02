const express = require('express');
const router =express.Router();
const PendingFees = require('../models/pendingFees');
const authToken = require('../routers/verifyToken');

router.post('/pendingfee', authToken, async(req,res)=>{
    const { sessionMasterId, pendingAmount, type, lmcId, groupMasterId, clientId} = req.body;

    try {
        const pendingFee = new PendingFees({sessionMasterId, pendingAmount, type, lmcId, groupMasterId, clientId})

        await pendingFee.save()
        res.send(pendingFee)
    } catch (error) {
        res.send(error);
    }
})

router.get('/pendingfee', authToken, async (req, res) => {
    try {
        const pendingFee = await PendingFees.find({}).sort({_id: -1})
        .populate({
            path: 'sessionMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'therapistName',
                    populate: {
                      path: 'therapyCategory'
                    }
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'clientName'
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'slotName'
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'leave_session_id',
                populate: {
                    path: 'therapistName',
                    populate: {
                      path: 'therapyCategory'
                    }
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'leave_session_id',
                populate: {
                    path: 'clientName'
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'leave_session_id',
                populate: {
                    path: 'slotName'
                }
            }
        }).populate({
            path: 'lmcId',
            populate: {
                path: 'session_id',
                populate: [
                    {
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
                    }
                ]
            }
        }).populate('clientId').populate({
            path: 'groupMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'therapistName',
                    populate: {
                      path: 'therapyCategory'
                    }
                }
            }
        }).populate({
            path: 'groupMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'clientName'
                }
            }
        }).populate({
            path: 'groupMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'slotName'
                }
            }
        })
        

        res.send(pendingFee)
    } catch (error) {
        res.send(error);
    }
})

router.get('/pendingfee/:id', authToken, async (req, res) => {
    try {
        const pendingFee = await PendingFees.findOne({_id: req.params.id}).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'therapistName',
                    populate: {
                      path: 'therapyCategory'
                    }
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'clientName'
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'slotName'
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'leave_session_id',
                populate: {
                    path: 'therapistName',
                    populate: {
                      path: 'therapyCategory'
                    }
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'leave_session_id',
                populate: {
                    path: 'clientName'
                }
            }
        }).populate({
            path: 'sessionMasterId',
            populate: {
                path: 'leave_session_id',
                populate: {
                    path: 'slotName'
                }
            }
        }).populate({
            path: 'lmcId',
            populate: {
                path: 'session_id',
                populate: [
                    {
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
                    }
                ]
            }
        }).populate('clientId').populate({
            path: 'groupMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'therapistName',
                    populate: {
                      path: 'therapyCategory'
                    }
                }
            }
        }).populate({
            path: 'groupMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'clientName'
                }
            }
        }).populate({
            path: 'groupMasterId',
            populate: {
                path: 'session_id',
                populate: {
                    path: 'slotName'
                }
            }
        }).populate('clientId')


        res.send(pendingFee)
    } catch (error) {
        res.send(error);
    }
})

router.patch('/pendingfeeupdate/:id', authToken,async(req,res)=>{
    try {
        const result = await PendingFees.findOne({_id:req.params.id})
        result.pendingAmount = req.body.pendingAmount
        await result.save()

        res.send(result)       
    } catch (error) {
        res.send(error)       
    }
})

router.delete('/pendingfee/:id', authToken, async(req,res)=>{
    try {
        const result = await PendingFees.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
    
})

module.exports = router