const mongoose = require('mongoose')

const concessionSchema = new mongoose.Schema({
    clientId : {type : mongoose.Schema.Types.ObjectId, ref: 'client'},
    concessionAmount : {type : Number, required : true},
    referredBy : {type : mongoose.Schema.Types.ObjectId, ref: 'User'},
    date : {type : Date, required : true}
})

const concessionModel = mongoose.model('Concession', concessionSchema)
module.exports = concessionModel