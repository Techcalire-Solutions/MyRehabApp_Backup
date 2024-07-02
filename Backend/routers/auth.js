const express = require('express');
const router =express.Router();
const User = require('../models/user');
const {registerValidation,loginValidation}=require('./validation')
const bcrypt = require('bcryptjs')
const jwtTokens = require('../utlis/jsonWebToken');
const authToken = require('../routers/verifyToken');

router.post('/register', async (req,res)=>{

    //lets validate data before we make a user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user already exits
    const emailExits = await User.findOne({email : req.body.email});
    if(emailExits) return res.status(400).send({message:'Email already exits'});

    //hashing passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({        
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
        role : req.body.role
    });


    try {
        const savedUser = await  user.save();
        // res.send({User:user._id });
        res.send(savedUser)        
    } catch (error) {
        res.status(400).send(err)        
    }
})

router.post('/login', async(req,res)=>{
    try {
        const {error} = loginValidation(req.body);
        if(error) return res.status(400).send({message: error.details[0].message});
    
       //checking if the email exits
       const user = await User.findOne({email: req.body.email});
       if(!user) return res.status(400).send({message:'Email is not found'});
    
       //checking  password is correct
       const validPass = await bcrypt.compare(req.body.password, user.password); //checking both password (req pswd and db pswd)
       if(!validPass) return res.status(400).send({message:'Invalid Password'});

       let userToken = {id:user._id, name:user.name, role:user.role};

       let token = jwtTokens(userToken);
    
       //create and assign a token
    //    const token = jwt.sign({_id : user._id,name : user.name}, process.env.TOKEN_SECRET, {expiresIn: '5s'});

    // return res.status(200).send({token : token, role: user.role});
        return res.status(200).send({"token":token, "id":user._id, "username":user.name,"role":user.role, "md":user.md, "company": user.companyId});
    } catch (error) {
        res.send(error)
    }

});

module.exports = router