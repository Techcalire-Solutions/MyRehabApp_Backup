const express = require('express');
const router =express.Router();
const {registerValidation}=require('./validation')
const bcrypt = require('bcryptjs')
const { default: mongoose } = require('mongoose');
const User = require('../models/user')
const Session = require('../models/session')
const Assessment = require('../models/assessment')
const Celebration = require('../models/celebration');
const authToken = require('../routers/verifyToken');
const cloudinary = require('../utlis/cloudinary');
const multer= require("../utlis/multer");
const privilage = require('../middleware/privilage');

router.post('/adduser', authToken, privilage, async (req,res)=>{
     if (req.body.role =='admin') {
     //lets validate data before we make a user
        const {error} = registerValidation(req.body);
        
        if(error) return res.status(400).send({message: error.details[0].message});

        //checking if the user already exits
        const emailExits = await User.findOne({email : req.body.email});
        if(emailExits) return res.status(400).send({message: 'Email already exits'});

        const { name, email, password, role, md, qualifications, experiences, qualification_id, qualification_file,
            idProof_id, idProof_file, experience_id, experience_file, birthDate, joiningDate, companyId } = req.body

        //hashing passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({
            name : name,
            email : email,
            password : hashedPassword,
            role : role,
            md : md,
            qualifications : qualifications,  
            experiences : experiences,
            qualification_id : qualification_id,
            qualification_file : qualification_file,
            idProof_id : idProof_id,
            idProof_file : idProof_file,
            experience_id : experience_id,
            experience_file : experience_file,
            companyId : companyId
        });  
        try {
            const savedUser = await user.save();
            try {
                const celebration = new Celebration({
                    userId : savedUser._id,
                    birthDate : birthDate,
                    joiningDate : joiningDate
                })
                const result = await celebration.save();
            } catch (error) {
                res.send(error)
            }
            res.send(savedUser)
        } catch (error) {
            res.send(error)           
        } 
     }
     
     else if(req.body.role=='therapist'){
    //lets validate data before we make a user
        const {error} = registerValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const { name, email, password, role, therapyCategory, md, qualifications, experiences, qualification_id, qualification_file,
            idProof_id, idProof_file, experience_id, experience_file, birthDate, joiningDate, sharePercentage, companyId } = req.body

            //checking if the user already exits
        const emailExits = await User.findOne({email : email});
        if(emailExits) return res.status(400).send({message: 'Email already exits'});

        //hashing passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        if(therapyCategory == ""){
            return res.status(400).send({message: 'Category not added'})
        }

        const user = new User({
            name : name,
            email : email,
            password : hashedPassword,
            role : role, 
            therapyCategory : therapyCategory,
            md : md,
            qualifications : qualifications,  
            experiences : experiences,
            // cloudinary_id : req.body.cloudinary_id,
            // file_url : req.body.file_url,
            qualification_id : qualification_id,
            qualification_file : qualification_file,
            idProof_id : idProof_id,
            idProof_file : idProof_file,
            experience_id : experience_id,
            experience_file : experience_file,
            sharePercentage : sharePercentage,
            companyId : companyId
        });  
        try {      
            const savedUser = await  user.save();
            try {
                const celebration = new Celebration({
                    userId : savedUser._id,
                    birthDate : birthDate,
                    joiningDate : joiningDate
                })
                const result = await celebration.save();
            } catch (error) {
                res.send(error)
            }
            res.send(savedUser)
        } catch (error) {
            res.send(error)           
        } 
    }
})

router.post('/userfileupload', authToken, multer.single('file'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
       
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

router.post('/userExp', authToken, multer.single('file'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
       
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

router.post('/userQual', authToken, multer.single('file'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
       
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

router.post('/userId', authToken, multer.single('file'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
       
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

router.get('/user', authToken, async(req,res)=>{
    try {
        const user = await User.find({}).sort({_id: -1}).populate('therapyCategory companyId')
        res.send(user)       
    } catch (error) {
        res.send(error)        
    }
})

router.get('/gettherapist', authToken, async(req,res)=>{
    try {       
        const user1 = await User.find({role:"therapist"}).populate('therapyCategory companyId')
        res.send(user1)       
    } catch (error) {
        res.send(error)
    }
})

router.get('/gettherapist/category/:id', authToken, async(req,res)=>{
    try {       
        const user1 = await User.find({role:"therapist", therapyCategory: req.params.id}).populate('therapyCategory companyId')
        res.send(user1)       
    } catch (error) {
        res.send(error)
    }
})

router.get('/getadmin', authToken, async(req,res)=>{
    try {      
        const user1 = await User.find({role:"admin"}).populate('companyId')
        res.send(user1)        
    } catch (error) {
        res.send(error)
    }
})

router.get('/gettherapist/:id', authToken, async(req,res)=>{
    try {      
        const user = await User.findById(req.params.id).populate('therapyCategory')
        res.send(user)        
    } catch (error) {
        res.send(error)
    }
})

router.patch('/user/:id/:celebid', authToken, async(req,res)=>{
    const salt = await bcrypt.genSalt(10);

    const { name, email, password, role, therapyCategory, md, qualifications, experiences, sharePercentage, 
        birthDate, joiningDate, companyId} = req.body
    if(req.body.therapyCategory == ""){
        return res.status(400).send('Category not added')
    }
    
    try {
        const user = await User.findByIdAndUpdate(req.params.id)

        if(req.body.password){
            const hashedPassword = await bcrypt.hash(password, salt)

            user.name = name,
            user.email = email,
            user.password = hashedPassword,
            user.role = role,
            user.therapyCategory = therapyCategory
            user.md = md
            user.qualifications = qualifications
            user.experiences = experiences
            user.sharePercentage = sharePercentage,
            user.companyId = companyId

            await user.save()

            try {
                const celeb = await Celebration.findByIdAndUpdate(req.params.celebid)
                celeb.birthDate = birthDate
                celeb.joiningDate = joiningDate

                await celeb.save()

            } catch (error) {
                res.send(error)
            }
            res.send(user)     
        }else{
            user.name = req.body.name,
            user.email = req.body.email,
            user.role = req.body.role,
            user.therapyCategory = req.body.therapyCategory
            user.md = req.body.md
            user.qualifications = req.body.qualifications
            user.experiences = req.body.experiences
            user.companyId = req.body.companyId

            await user.save()
            res.send(user)    
        }

           
    } catch (error) {
        res.send(error)
    }
})

router.patch('/userupload/:id', authToken, async(req,res)=>{    
    try {
        const user = await User.findByIdAndUpdate(req.params.id)
        user.cloudinary_id = req.body.cloudinary_id
        user.file_url = req.body.file_url
        
        await user.save()
        res.send(user)        
    } catch (error) {
        res.send(error)
    }
})

router.patch('/expupload/:id', authToken, async(req,res)=>{    
    try {
        const user = await User.findByIdAndUpdate(req.params.id)
        user.experience_id = req.body.experience_id
        user.experience_file = req.body.experience_file
        
        await user.save()
        res.send(user)        
    } catch (error) {
        res.send(error)
    }
})

router.patch('/qualupload/:id', authToken, async(req,res)=>{    
    try {
        const user = await User.findByIdAndUpdate(req.params.id)
        user.qualification_id = req.body.qualification_id
        user.qualification_file = req.body.qualification_file
        
        await user.save()
        res.send(user)        
    } catch (error) {
        res.send(error)
    }
})

router.patch('/idupload/:id', authToken, async(req,res)=>{    
    try {
        const user = await User.findByIdAndUpdate(req.params.id)
        user.idProof_id = req.body.idProof_id
        user.idProof_file = req.body.idProof_file
        
        await user.save()
        res.send(user)        
    } catch (error) {
        res.send(error)
    }
})

router.delete('/user/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id;

        const session = await Session.findOne({therapistName : id})
        if(session){
            return res.status(400).send({message: 'There is a session assigned to this user, please remove session before delete user'})
        }

        const assessment = await Assessment.findOne({therapistName : id})
        if(assessment){
            return res.status(400).send({message: 'There is a assessment session exists in this slot, please remove assessment session before delete slot'})
        }

        const user = await User.deleteOne({_id:req.params.id})
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router