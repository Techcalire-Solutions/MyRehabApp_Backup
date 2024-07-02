const express = require('express');
const router =express.Router();
const DailyExpense = require('../models/dailyExpense');
const Slot = require('../models/slot');
const authToken = require('../routers/verifyToken');
const expensePrivilage = require('../middleware/expensePrivilage');

router.post('/dailyexpense', authToken,async(req,res)=>{
    try {
        const dailyexpense = new DailyExpense({
            date :req.body.date,
            expense : req.body.expense,
            type : req.body.type,
            collectedFrom : req.body.collectedFrom,
            otherExpense : req.body.otherExpense
        })
        await dailyexpense.save()
        res.send(dailyexpense)       
    } catch (error) {
       return  res.send(error)       
    }
})

router.get('/dailyexpense', authToken, expensePrivilage, async(req,res)=>{
    try {
        if(req.user.md === true){    
            const dailyexpense = await DailyExpense.find({}).sort({date: -1})
            .populate({path: 'collectedFrom'})
            res.send(dailyexpense) 
        }
        else if(req.user.md === false){
  
            const dailyexpenseFilter = await DailyExpense.find({collectedFrom : req.user.id}).sort({date: -1})
            .populate({path: 'collectedFrom'})
            res.send(dailyexpenseFilter)
        }
    } catch (error) {
      res.send(error)
    }
})

router.get('/dailyexpense/:id', authToken,async(req,res)=>{
    try {
        const dailyexpense = await DailyExpense.findOne({_id: req.params.id}).populate({path: 'collectedFrom'})
        res.send(dailyexpense)       
    } catch (error) {
      res.send(error)
    }
})

router.patch('/dailyexpense/:id', authToken,async(req,res)=>{
    try{ 
        const dailyexpense = await DailyExpense.findByIdAndUpdate(req.params.id)
        dailyexpense.expense = req.body.expense,
        dailyexpense.date = req.body.date   
        dailyexpense.type = req.body.type
        
        await dailyexpense.save();
        res.send(dailyexpense);       
    }
    catch(error){
        res.send(error)
    }
})


router.delete('/dailyexpense/:id', authToken,async(req,res)=>{
    try {
        const result = await DailyExpense.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
   
})

router.get('/filteredexpense', authToken, async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const result1 = await DailyExpense.find({date: {$gte : startDate, $lte : endDate}}).populate({path: 'collectedFrom'});
        res.send(result1);
    } catch (e) {
        res.status(500).send(e); // Use res.status(500) for internal server error
    }
});



module.exports = router