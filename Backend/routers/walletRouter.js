const express = require('express');
const router =express.Router();
const Wallet = require('../models/wallet');
const authToken = require('../routers/verifyToken');

router.post('/wallet', authToken,async(req,res)=>{
    try {

        const {clientId, balanceAmount} = req.body

        walletExists = await Wallet.findOne({clientId: clientId})

        if(walletExists){
            return res.status(400).send({message:"Wallet already exists for this client"})
        }

        const wallet = new Wallet({
            clientId : clientId,
            balanceAmount : balanceAmount
        })
        await wallet.save()
        res.send(wallet)       
    } catch (error) {
        return res.send(error)
        
    }
})


router.get('/wallet', authToken,async(req,res)=>{
    try {
        const wallet = await Wallet.find({}).populate('clientId').sort({_id: -1})
        res.send(wallet)       
    } catch (error) {
        res.send(error)
        
    }
})

router.get('/getwallet/:id', authToken, async(req,res)=>{
    try {
        const wallet = await Wallet.findOne({clientId : req.params.id}).populate('cashOut.sessionMasterId')
        res.send(wallet)
    } catch (error) {
        res.send(error)
    }
})

router.get('/getwalletbyid/:id', authToken, async(req,res)=>{
    try {
        const wallet = await Wallet.findOne({_id : req.params.id}).populate('cashOut.sessionMasterId clientId')
        res.send(wallet)
    } catch (error) {
        res.send(error)
    }
})

router.patch('/updatewallet/:id', authToken,async(req,res)=>{
    try {
        const result = await Wallet.findById(req.params.id)
        
        if(result.cashOut.length > 0) {
            return res.status(400).send({message: 'Cash is already debited against this account'}) 
        }
        const wallet = await Wallet.findByIdAndUpdate(req.params.id)

        wallet.clientId = req.body.clientId

        await wallet.save()
        res.send(wallet)
    } catch (error) {
        res.send(error)
    }
})

router.patch('/updatebalance/:id', authToken,async(req,res)=>{
    try {
        const wallet = await Wallet.findByIdAndUpdate(req.params.id)

        wallet.balanceAmount = req.body.balanceAmount

        await wallet.save()
        res.send(wallet)
    } catch (error) {
        res.send(error)
    }
})

router.patch('/cashin/:id', authToken,async(req,res)=>{
    try{

        const wallet = await Wallet.findOne({ _id: req.params.id });

        if (!wallet) {
            return res.status(404).send({ message: 'Wallet not found' });
        }

        // Create a new cashIn object
        const newCashIn = {
            date: new Date(),
            amount: req.body.amount,
            paymentMode: req.body.paymentMode
        };

        // Push the new cashIn object into cashIn array
        wallet.cashIn.push(newCashIn);

        const updatedWallet = await wallet.save();

        res.send(updatedWallet);

    }
                
    catch(error){
        res.send({message: error.message})
    }
})

router.patch('/cashout/:id', authToken,async(req,res)=>{
    try{

        const wallet = await Wallet.findOne({ clientId: req.params.id });

        if (!wallet) {
            return res.status(404).send({ message: 'Wallet not found' });
        }

        // Create a new cashIn object
        const newCashOut = {
            date: new Date(),
            amount: req.body.amount,
            sessionMasterId: req.body.sessionMasterId
        };

        // Push the new cashIn object into cashIn array
        wallet.cashOut.push(newCashOut);

        const updatedWallet = await wallet.save();

        res.send(updatedWallet);

    }
                
    catch(error){
        res.send({message: error.message})
    }
})

router.patch('/updatecashin/:id/:arrayId', authToken, async(req, res) =>{
    try {

        const {date, amount, paymentMode} = req.body
        
        const arrayId =req.params.arrayId

        const cashIn = await Wallet.where('_id').equals(req.params.id).updateOne(
            {
                "cashIn._id":arrayId
            },
            {
              $set : {
                        "cashIn.$.date": date,
                        "cashIn.$.amount": amount,
                        "cashIn.$.paymentMode": paymentMode
                },
                            
            }
        )

        res.send(cashIn)     
         
    } catch (error) {
        return res.send(error)
    }
})

router.delete('/deletecashin/:id/:arrayId', authToken, async (req, res) => {
    try {
        const arrayId = req.params.arrayId;
        const id = req.params.id;

        // Use updateOne to pull the specific element from the cashIn array
        const result = await Wallet.updateOne(
            { _id: id },
            { $pull: { cashIn: { _id: arrayId } } }
        );

        // Log data for debugging

        // Check if the update was successful
        if (result.modifiedCount > 0) {
            res.send({ message: 'CashIn element deleted successfully' });
        } else {
            res.status(404).send({ message: 'CashIn element not found or already deleted' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message });
    }
});

router.delete('/deletewallet/:id', authToken, async(req,res)=>{
    try {
        const id = req.params.id;

        const result = await Wallet.findById(id)
        
        if(result.cashOut.length > 0) {
            return res.status(400).send({message: 'Cash is already debited against this account'}) 
        }

        const wallet = await Wallet.deleteOne({_id: id});
        res.send(wallet)
    } catch (error) {
        res.send(error)
    }
})





module.exports = router