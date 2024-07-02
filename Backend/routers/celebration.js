const express = require('express')
const router = express.Router()
const Celebration = require('../models/celebration');
const authToken = require('../routers/verifyToken');

router.get('/userid/:id', authToken, async(req,res)=>{
    try {
        const celebration = await Celebration.findOne({userId: req.params.id})

        res.send(celebration)
    } catch (error) {
        res.send (error)
    }
})

router.get('/', authToken, async(req,res)=>{
    try {
        const celebration = await Celebration.find().populate('userId')

        res.send(celebration)
    } catch (error) {
        res.send (error)
    }
})
module.exports = router