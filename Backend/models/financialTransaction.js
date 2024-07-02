const mongoose = require('mongoose')

const financialTransactionSchema = new mongoose.Schema(
    {
        session_master_id: {type: mongoose.Schema.Types.ObjectId, ref:'SessionMaster', required: false},
        therapistId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        clientId:{type: mongoose.Schema.Types.ObjectId, ref: 'client'},
        sessionType:{type:String,required:true},
        amountToInara:{type:Number,required:true},
        amountToTherapist:{type:Number,required:true},
        paymentDate:{type: Date},
        paymentMode : {type: String},
    }
)



const financialTransactionModel = mongoose.model('FinancialTransaction',financialTransactionSchema)

module.exports = financialTransactionModel