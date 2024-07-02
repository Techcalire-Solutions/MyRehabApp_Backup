const express = require('express');
const router =express.Router();
const Category = require('../models/category');
const Slot = require('../models/slot');
const authToken = require('../routers/verifyToken');
const privilage = require('../middleware/privilage')
router.post('/addcategory', authToken, privilage, async(req,res)=>{
    try {
        const category = new Category({
            therapyName :req.body.therapyName,
            abbreviation : req.body.abbreviation
        })
        await category.save()
        res.send(category)       
    } catch (error) {
       return  res.send(error)       
    }
})

router.get('/category', authToken,async(req,res)=>{
    try {
        const category = await Category.find({})
        res.send(category)       
    } catch (error) {
      res.send(error)
    }
})

router.get('/category/:id', authToken,async(req,res)=>{
    try {
        const category = await Category.findOne({_id: req.params.id})
        res.send(category)       
    } catch (error) {
      res.send(error)
    }
})

router.patch('/category/:id', authToken,async(req,res)=>{
    try{ 
        const category = await Category.findByIdAndUpdate(req.params.id)
        category.therapyName = req.body.therapyName,
        category.abbreviation = req.body.abbreviation   
            
        await category.save();
        res.send(category);       
    }
    catch(error){
        res.send(error)
    }
})


router.delete('/category/:id', authToken,async(req,res)=>{
    try {
        const id = req.params.id;

        const slot = await Slot.findOne({therapyCategory : id})
        if(slot){
            return res.status(400).send({message: 'There is a slot exists in this category, please remove slot before delete category'})
        }
        const result = await Category.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
   
})


module.exports = router