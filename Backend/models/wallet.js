const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema(
    {
        clientId :{type: mongoose.Schema.Types.ObjectId, ref:'client'},
        cashIn : [{
            date : {type: Date, default: Date.now()},
            amount : {type: Number, default: 0},
            paymentMode : {type: String}
        }],
        cashOut : [{
            date : {type: Date, default: Date.now()},
            amount : {type: Number, default: 0},
            sessionMasterId : {type: mongoose.Schema.Types.ObjectId, ref: 'SessionMaster'}     
        }],
        balanceAmount :{type: Number, default: 0}       
    }
)



const walletModel = mongoose.model('Wallet',walletSchema)

module.exports = walletModel