const express = require('express');
const router = express.Router();
const ClientLogin = require('../models/clientLogin');
const {registerValidation, clientLoginValidation} = require('./validation')
const bcrypt = require('bcryptjs')
const jwtTokens = require('../utlis/jsonWebToken');
const authToken = require('../routers/verifyToken');
const Client = require('../models/client');
const cloudinary = require('../utlis/cloudinary');
const multer= require("../utlis/multer");

router.post('/register', async (req,res)=>{
    //hashing passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const client = new ClientLogin({ 
        clientId : req.body.clientId,
        client_ID : req.body.client_ID,
        password : hashedPassword
    });
    
    const cl = await Client.findOne({_id: req.body.clientId})
    cl.loginStatus = true;
    await cl.save();

    try {
        await client.save();
        res.send(client)        
    } catch (error) {
        res.status(400).send(error)        
    }
})

router.post('/fileupload', authToken, multer.single('file'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
       
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

router.post('/login', async(req,res)=>{
    try {
        const {error} = clientLoginValidation(req.body);
        if(error) return res.status(400).send({message: error.details[0].message});
    

       const client = await ClientLogin.findOne({client_ID: req.body.client_ID});
       if(!client) return res.status(400).send({message:'client_ID is not found'});
    
       const password = await ClientLogin.findOne({password: req.body.password});
       if(!password) return res.status(400).send({message:'client_ID is not found'});
    
    //    const validPass = await bcrypt.compare(req.body.password, client.password); 
    //    if(!validPass) return res.status(400).send({message:'Invalid Password'});

       let userToken = {id:client._id, client_ID:client.client_ID, role: 'parent'};

       let token = jwtTokens(userToken);
    
       //create and assign a token
    //    const token = jwt.sign({_id : user._id,name : user.name}, process.env.TOKEN_SECRET, {expiresIn: '5s'});

    // return res.status(200).send({token : token, role: user.role});
        return res.status(200).send({"token":token, "id":client._id, "role":"parent"});
    } catch (error) {
        res.send(error)
    }

});

router.patch('/client/:id/:clientId', authToken, async(req,res)=>{
    //hashing passwords
    // const emailExists = await ClientLogin.findOne({ client_ID: req.body.client_ID, _id: { $ne: req.params.id } });

    // if (emailExists) {
    //     return res.status(400).send({ message: 'Number already exists' });
    // }

    // const emailExistsClient = await Client.findOne({ email: req.body.email, _id: { $ne: req.params.clientId } });

    // if (emailExistsClient) {
    //     return res.status(400).send({ message: 'Email is already registered for client' });
    // }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    try {
        const user = await ClientLogin.findByIdAndUpdate(req.params.id)
        user.password = hashedPassword,
    
        await user.save()
        res.send(user)        
    } catch (error) {
        res.send(error)
    }
})

router.get('/getclient', authToken,async(req,res)=>{
    try {
        
        const compensationSession = await ClientLogin.find({}).populate('clientId')
        res.send(compensationSession)        
    } catch (error) {
        res.send(error)        
    }
})



router.get('/getclient/:id', authToken,async(req,res)=>{
    try {
        const compensationSession = await ClientLogin.findOne({_id: req.params.id}).populate('clientId')
        res.send(compensationSession)        
    } catch (error) {
        res.send(error)        
    }
})

router.get('/getclientlogin/:id', authToken,async(req,res)=>{
    try {
        const compensationSession = await ClientLogin.findOne({clientId: req.params.id}).populate('clientId')
        res.send(compensationSession)        
    } catch (error) {
        res.send(error)        
    }
})
module.exports = router