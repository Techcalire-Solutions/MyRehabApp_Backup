const { x, date } = require('@hapi/joi');
const { response } = require('express');
const express = require('express');
const router = express.Router();
const Client = require('../models/client');
const cloudinary = require('../utlis/cloudinary');
const multer= require("../utlis/multer");
const Session = require('../models/session');
const Assessment = require('../models/assessment');
const authToken = require('../routers/verifyToken');
const ClientLogin = require('../models/clientLogin')
const clientDataSource = require('../routers/dataSource')

router.post('/', async (req,res)=>{
    try{  
      const emergencyContactNumber = await Client.findOne({emergencyNumber : req.body.emergencyNumber})  
        
      const {dateOfBirth,firstName}=req.body
      const dob =  new Date(dateOfBirth) 
      const name = firstName.toString()
      const fn =  name.slice(0,3)
      const password = fn.toUpperCase()+dob.getFullYear()
   
    
        if(emergencyContactNumber){
            return res.status(400).send({message: 'Number already exists'})
        }
           console.log({"CLIENT ID":req.body.client_ID})    
  const client = new Client({
            client_ID : req.body.client_ID,
            firstName : req.body.firstName,
            emergencyNumber : req.body.emergencyNumber,
            email : req.body.email,
            dateOfBirth:req.body.dateOfBirth,
            gender : req.body.gender,
            nationality : req.body.nationality,
            homeLanguage : req.body.homeLanguage,
            familyType : req.body.familyType,
            familyMembers: req.body.familyMembers,
            referrerDetails : req.body.referrerDetails,
            reason : req.body.reason,
            fatherName : req.body.fatherName,
            fatherMobile : req.body.fatherMobile,
            fatherOccupation : req.body.fatherOccupation,
            motherName : req.body.motherName,
            motherMobile : req.body.motherMobile,
            motherOccupation : req.body.motherOccupation,
            annualIncome : req.body.annualIncome,
            siblingsDetails : req.body.siblingsDetails,
            address1 : req.body.address1,
            address2 : req.body.address2,
            pincode : req.body.pincode,
            status : req.body.status,
            date : req.body.date,
            remarks : req.body.remarks,
            preferredTiming : req.body.preferredTiming,
            medical:{},
            school:{},
            routine:{}
        })

        await client.save()

        try {
            if(client._id){
                const clientLogin = new ClientLogin({
                    clientId:client._id,
                    client_ID:client.client_ID,
                    password:password
                })
                await clientLogin.save()
            }
            
           
        } catch (error) {
            res.send(error)
            
        }
        res.send(client)
    }

    catch(err){
        return res.send(err)        
    }
})



router.post('/createCredentials', async (req, res) => {
    try {
       
  
        console.log(clientDataSource);
        for (const element of clientDataSource) {
            try {
              
                const existingClient = await ClientLogin.findOne({ clientId: element.clientId });
                if (existingClient) {
                    console.log("Client already exists:", element.clientId);
                } else {
                    const credentialDetails = new ClientLogin({
                        clientId: element.clientId,
                        client_ID: element.client_ID,
                        password: element.password
                    });
                    await credentialDetails.save();
                    console.log("Client created:", element.clientId);
                }
            } catch (error) {
                console.log("Error:", error);
            }
        }
        res.send("Data created successfully...");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post('/fileupload', multer.single("file"), async(req,res)=>{   
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.send(result);           
    } catch (error) {
        res.send(error)
    }
})

    
router.patch('/' , async(req,res)=>{
    try {
        if(req.body.medical){           
            const client = await Client.findByIdAndUpdate(req.body.medical.clientid)
            client.medical.pregnancy = req.body.medical.pregnancy,
            client.medical.typeOfDelivery = req.body.medical.typeOfDelivery,
            client.medical.alcohol = req.body.medical.alcohol,
            client.medical.smoking = req.body.medical.smoking,
            client.medical.pregnancyType = req.body.medical.pregnancyType,
            client.medical.prematureMonths = req.body.medical.prematureMonths,
            client.medical.babyCry = req.body.medical.babyCry,
            client.medical.feedingProblem = req.body.medical.feedingProblem,
            client.medical.sleepProblem = req.body.medical.sleepProblem,
            client.medical.birthWeight = req.body.medical.birthWeight,
            client.medical.birthCompilcation = req.body.medical.birthCompilcation,
            client.medical.importantIllness = req.body.medical.importantIllness,
            client.medical.medicalCondition = req.body.medical.medicalCondition,
            client.medical.medications = req.body.medical.medications,
            client.medical.pregnancyComplications = req.body.medical.pregnancyComplications,
            client.medical.consanguineousMarriageHistory = req.body.medical.consanguineousMarriageHistory,
            client.medical.history = req.body.medical.history,
            client.medical.remarksVision = req.body.medical.remarksVision,
            client.medical.eyeTest = req.body.medical.eyeTest,
            client.medical.useGlass = req.body.medical.useGlass,
            client.medical.eyeProblem = req.body.medical.eyeProblem,
            client.medical.remarksHearing = req.body.medical.remarksHearing,
            client.medical.hearingTest = req.body.medical.hearingTest,
            client.medical.hearingAid = req.body.medical.hearingAid,
            client.medical.earProblem = req.body.medical.earProblem,
            client.medical.currentMedication = req.body.medical.currentMedication,
            client.medical.previoustMedication = req.body.medical.previoustMedication,
            client.medical.allergies = req.body.medical.allergies,
            client.medical.actualTherapies = req.body.medical.actualTherapies,
            client.medical.previousTherapies = req.body.medical.previousTherapies,
            client.medical.headRaise = req.body.medical.headRaise,
            client.medical.rollOver = req.body.medical.rollOver,
            client.medical.independentSitting = req.body.medical.independentSitting ,
            client.medical.crawled = req.body.medical.crawled,
            client.medical.pulledToStand = req.body.medical.pulledToStand,
            client.medical.independentStanding = req.body.medical.independentStanding,
            client.medical.walking = req.body.medical.walking,
            client.medical.dress = req.body.medical.dress,
            client.medical.spoon = req.body.medical.spoon,
            client.medical.saidFirstWords = req.body.medical.saidFirstWords,
            client.medical.babbling = req.body.medical.babbling,
            client.medical.presentLanguage = req.body.medical.presentLanguage,
            client.medical.fingerFeeding =req.body.medical.fingerFeeding,
            client.medical.cloudinary_id = req.body.medical.cloudinary_id,
            client.medical.file_url = req.body.medical.file_url
            
    
            await client.save()
            res.send(client)
        }
       
        if(req.body.school){
            const client = await Client.findByIdAndUpdate(req.body.school.clientid)
            client.school.schoolNameAndAddress = req.body.school.schoolNameAndAddress,
            client.school.grade = req.body.school.grade,
            client.school.teacherNameDetails = req.body.school.teacherNameDetails,
            client.school.previousSchool = req.body.school.previousSchool,
            client.school.generalBehaviour = req.body.school.generalBehaviour,
            client.school.teacherNoted = req.body.school.teacherNoted,
            client.school.getAlongWithOthers = req.body.school.getAlongWithOthers,
            client.school.mainSupport = req.body.school.mainSupport,
            client.school.screenTime = req.body.school.screenTime,
            client.school.playInterest = req.body.school.playInterest

            await client.save()
            res.send(client)            
        }           
    
        if(req.body.routine){
            const client = await Client.findByIdAndUpdate(req.body.routine.clientid)
            client.routine.feedAge = req.body.routine.feedAge,
            client.routine.goodAppetitie= req.body.routine.goodAppetitie,
            client.routine.messyEater = req.body.routine.messyEater,
            client.routine.foodPreference = req.body.routine.foodPreference,
            client.routine.tasteAndTexture = req.body.routine.tasteAndTexture,
            client.routine.ageAppropriate = req.body.routine.ageAppropriate
            client.routine.canDoUpButtons = req.body.routine.canDoUpButtons,
            client.routine.canPutOnSocks = req.body.routine.canPutOnSocks,
            client.routine.canPutOnShoes = req.body.routine.canPutOnShoes,
            client.routine.toiletTrained = req.body.routine.toiletTrained,
            client.routine.dayAndNight = req.body.routine.dayAndNight,
            client.routine.toiletRemarks= req.body.routine.toiletRemarks,
            client.routine.toiletNight= req.body.routine.toiletNight,
            client.routine.accidents = req.body.routine.accidents,
            client.routine.toiletPaperUse = req.body.routine.toiletPaperUse,
            client.routine.managingClothing = req.body.routine.managingClothing,
            client.routine.washingHands = req.body.routine.washingHands,
            client.routine.bathingAndBrushing = req.body.routine.bathingAndBrushing,
            client.routine.typicalNightSleep = req.body.routine.typicalNightSleep,
            client.routine.timeOfSleep = req.body.routine.timeOfSleep,
            client.routine.remarksSleep = req.body.routine.remarksSleep,
            client.routine.typicalWakeup = req.body.routine.typicalWakeup,
            client.routine.timeOfWakeup = req.body.routine.timeOfWakeup,
            client.routine.remarksWakeUp = req.body.routine.remarksWakeUp,
            client.routine.homework = req.body.routine.homework,
            client.routine.remarksHomework = req.body.routine.remarksHomework,
            client.routine.routineStrategies = req.body.routine.routineStrategies,
            client.routine.difficultSituation= req.body.routine.difficultSituation,
            client.routine.remarksChildBehaviour = req.body.routine.remarksChildBehaviour,
            client.routine.howYouKnowAboutUs = req.body.routine.howYouKnowAboutUs

            await client.save()
            res.send(client)        
        }               
    } catch (error) {
        res.send(error)
    }
})


router.get('/:id', authToken,async(req,res)=>{
    try {
        const client = await Client.findOne({_id:req.params.id}).sort({ firstName: 1 })
        res.send(client)       
    } catch (error) {
        res.send(error)
    }
})


router.patch('/personalformupdate/:id', authToken, async(req,res)=>{
    try {
        
        const client = await Client.findByIdAndUpdate(req.params.id)

        client.client_ID = req.body.client_ID,
        client.firstName = req.body.firstName,
        client.email = req.body.email,
        client.emergencyNumber = req.body.emergencyNumber,
        client.dateOfBirth = req.body.dateOfBirth,
        client.gender = req.body.gender,
        client.nationality = req.body.nationality,
        client.homeLanguage = req.body.homeLanguage,
        client.familyType = req.body.familyType,
        client.familyMembers = req.body.familyMembers,
        client.referrerDetails = req.body.referrerDetails,
        client.reason = req.body.reason,
        client.fatherName = req.body.fatherName,
        client.fatherMobile = req.body.fatherMobile,
        client.fatherOccupation = req.body.fatherOccupation,
        client.motherName = req.body.motherName,
        client.motherMobile = req.body.motherMobile,
        client.motherOccupation = req.body.motherOccupation,
        client.annualIncome =  req.body.annualIncome,
        client.siblingsDetails = req.body.siblingsDetails,
        client.address1 = req.body.address1
        client.address2 = req.body.address2,
        client.pincode = req.body.pincode,
        client.remarks = req.body.remarks,
        client.preferredTiming = req.body.preferredTiming

        await client.save();
        res.send(client)

    } catch (error) {
        res.send({ error: error.message})
    }
    
})

router.patch('/medicalformupdate/:id', authToken, async(req,res)=>{
    try {
            const client = await Client.findByIdAndUpdate(req.params.id)

            client.medical.pregnancy = req.body.pregnancy,
            client.medical.typeOfDelivery = req.body.typeOfDelivery,
            client.medical.alcohol = req.body.alcohol,
            client.medical.smoking = req.body.smoking,
            client.medical.pregnancyType = req.body.pregnancyType,
            client.medical.prematureMonths = req.body.prematureMonths,
            client.medical.babyCry = req.body.babyCry,
            client.medical.feedingProblem = req.body.feedingProblem,
            client.medical.sleepProblem = req.body.sleepProblem,
            client.medical.birthWeight = req.body.birthWeight,
            client.medical.birthCompilcation = req.body.birthCompilcation,
            client.medical.importantIllness = req.body.importantIllness,
            client.medical.medicalCondition = req.body.medicalCondition,
            client.medical.medications = req.body.medications,
            client.medical.pregnancyComplications = req.body.pregnancyComplications,
            client.medical.consanguineousMarriageHistory = req.body.consanguineousMarriageHistory,
            client.medical.history = req.body.history,
            client.medical.remarksVision = req.body.remarksVision,
            client.medical.eyeTest = req.body.eyeTest,
            client.medical.useGlass = req.body.useGlass,
            client.medical.eyeProblem = req.body.eyeProblem,
            client.medical.remarksHearing = req.body.remarksHearing,
            client.medical.hearingTest = req.body.hearingTest,
            client.medical.hearingAid = req.body.hearingAid,
            client.medical.earProblem = req.body.earProblem,
            client.medical.currentMedication = req.body.currentMedication,
            client.medical.previoustMedication = req.body.previoustMedication,
            client.medical.allergies = req.body.allergies,
            client.medical.actualTherapies = req.body.actualTherapies,
            client.medical.previousTherapies = req.body.previousTherapies,
            client.medical.headRaise = req.body.headRaise,
            client.medical.rollOver = req.body.rollOver,
            client.medical.independentSitting = req.body.independentSitting ,
            client.medical.crawled = req.body.crawled,
            client.medical.pulledToStand = req.body.pulledToStand,
            client.medical.independentStanding = req.body.independentStanding,
            client.medical.walking = req.body.walking,
            client.medical.dress = req.body.dress,
            client.medical.spoon = req.body.spoon,
            client.medical.saidFirstWords = req.body.saidFirstWords,
            client.medical.babbling = req.body.babbling,
            client.medical.presentLanguage = req.body.presentLanguage,
            client.medical.fingerFeeding =req.body.fingerFeeding,
            // client.medical.cloudinary_id = req.body.cloudinary_id,
            // client.medical.file_url = req.body.file_url
            
            await client.save();
            res.send(client)

    } catch (error) {
        res.send({ error: error.message})
    }
    
})

router.patch('/schoolformupdate/:id', authToken, async(req,res)=>{
    try {
            const client = await Client.findByIdAndUpdate(req.params.id)

            client.school.schoolNameAndAddress = req.body.schoolNameAndAddress,
            client.school.grade = req.body.grade,
            client.school.teacherNameDetails = req.body.teacherNameDetails,
            client.school.previousSchool = req.body.previousSchool,
            client.school.generalBehaviour = req.body.generalBehaviour,
            client.school.teacherNoted = req.body.teacherNoted,
            client.school.mainSupport = req.body.mainSupport,
            client.school.getAlongWithOthers = req.body.getAlongWithOthers,
            client.school.screenTime = req.body.screenTime
            client.school.playInterest = req.body.playInterest
            
            await client.save();
            res.send(client)

    } catch (error) {
        res.send({ error: error.message})
    }
    
})

router.patch('/routineformupdate/:id', authToken, async (req, res) => {

    try {

        const client = await Client.findByIdAndUpdate(req.params.id)

            client.routine.feedAge = req.body.feedAge,
            client.routine.goodAppetitie= req.body.goodAppetitie,
            client.routine.messyEater = req.body.messyEater,
            client.routine.foodPreference = req.body.foodPreference,
            client.routine.tasteAndTexture = req.body.tasteAndTexture,
            client.routine.ageAppropriate = req.body.ageAppropriate
            client.routine.canDoUpButtons = req.body.canDoUpButtons,
            client.routine.canPutOnSocks = req.body.canPutOnSocks,
            client.routine.canPutOnShoes = req.body.canPutOnShoes,
            client.routine.toiletTrained = req.body.toiletTrained,
            client.routine.dayAndNight = req.body.dayAndNight,
            client.routine.toiletNight= req.body.toiletNight,
            client.routine.accidents = req.body.accidents,
            client.routine.toiletPaperUse = req.body.toiletPaperUse,
            client.routine.managingClothing = req.body.managingClothing,
            client.routine.washingHands = req.body.washingHands,
            client.routine.bathingAndBrushing = req.body.bathingAndBrushing,
            client.routine.toiletRemarks=req.body.toiletRemarks,
            client.routine.typicalNightSleep = req.body.typicalNightSleep,
            client.routine.timeOfSleep = req.body.timeOfSleep,
            client.routine.remarksSleep = req.body.remarksSleep,
            client.routine.typicalWakeup = req.body.typicalWakeup,
            client.routine.timeOfWakeup = req.body.timeOfWakeup,
            client.routine.remarksWakeUp = req.body.remarksWakeUp,
            client.routine.homework = req.body.homework,
            client.routine.remarksHomework = req.body.remarksHomework,
            client.routine.routineStrategies = req.body.routineStrategies,
            client.routine.difficultSituation= req.body.difficultSituation,
            client.routine.remarksChildBehaviour = req.body.remarksChildBehaviour,
            client.routine.howYouKnowAboutUs = req.body.howYouKnowAboutUs


            await client.save();
            res.send(client)
        
    } catch (error) {
        res.send(error);
    }
    
})

router.patch('/statusupdate/:id', authToken,async(req,res)=>{
    try {
        const client = await Client.findOne({_id:req.params.id})
        client.status = req.body.status
        await client.save()
        res.send(client)       
    } catch (error) {
      
        res.send(error)       
    }
})

router.delete('/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id;

        const session = await Session.findOne({clientName : id})
        if(session){
            return res.status(400).send({message: 'There is a session exists for this client, please delete session before delete client'})
        }
        const assessment = await Assessment.findOne({clientName : id})
        if(assessment){
            return res.status(400).send({message: 'There is a assessment exists for this client, please delete assessment before delete client'})
        }
        const result = await Client.deleteOne({_id:req.params.id})
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.pageSize);
  const search = req.query.search;

  const skip = (page - 1) * limit;
  try {
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {}

    const result = await Client.find(query).skip(skip).limit(limit).sort({date: -1});

    let totalCount;

    if (req.query.search) {
      totalCount = await Client.countDocuments(query);
    } else {
      totalCount = await Client.countDocuments();
    }

    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: result,
      };
      res.json(response);
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  

router.get('/sortedclients/client', authToken,async(req,res)=>{
    try {
        const client = await Client.find({}).sort({irstName: 1})

        res.send(client)
    } catch (error) {
        res.send(error.message)       
    }
})

module.exports = router
