const express = require('express')
const router = express.Router()
const Fees = require('../models/fees');
const authToken = require('../routers/verifyToken');

router.get('/fees', authToken, async(req,res)=>{
    try {
        const fees = await Fees.find({})

        res.send(fees)
    } catch (error) {
        res.send (error)
    }
})

router.patch('/fees/:id', authToken, async(req,res)=>{
    try {
        const fees = await Fees.findByIdAndUpdate(req.params.id)

        fees.sessionFee = req.body.sessionFee,
        fees.assessmentFee = req.body.assessmentFee
        fees.lmc = req.body.lmc
        fees.groupSessionFee = req.body.groupSessionFee

        await fees.save()

        res.send(fees)
        
    } catch (error) {
        res.send(error)
    }
})
module.exports = router