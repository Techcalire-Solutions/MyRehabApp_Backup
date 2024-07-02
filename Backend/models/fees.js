const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    sessionFee : {type : Number, required : true},
    assessmentFee : {type : Number, required : true},
    lmc : {type : Number, required : true},
    groupSessionFee : {type : Number, required : true}
})

const feeModel = mongoose.model('Fees', feeSchema);
module.exports = feeModel