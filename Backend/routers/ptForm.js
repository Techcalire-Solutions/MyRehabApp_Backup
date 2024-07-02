const express = require('express')
const router = express.Router()
const Pt = require('../models/ptForm')

router.post('/' , async(req,res)=>{
    try {

        const {
            clientId ,height , weight , cheifComplaint
        
        } = req.body

        const pt = new Pt({
            clientId : clientId,
            height : height,
            weight : weight ,
            cheifComplaint :cheifComplaint

        })
        await pt.save()
        res.send(pt)


        
    } catch (error) {
        res.send(error.message)
        
    }
})


router.get('/' ,async(req,res)=>{
    try {
             const pt = await Pt.find({})
             res.send(pt)
        
    } catch (error) {
        res.send(error.message)
        
    }
})


module.exports = router

