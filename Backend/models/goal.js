const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    clientId : {type: mongoose.Schema.Types.ObjectId, ref: 'client'},
    goals : [{
        startDate : {type: Date, default: Date.now()},
        goal : {type : String, required : true},
        category : {type: mongoose.Schema.Types.String, ref : 'Category'},
        term : {type : String, required : true},
        progressNote : {type : String},
        goalRemarks : {type: String},
        endDate : {type: Date},
        goalStatus : {type: Boolean, default : false},
    }]
})

const goalModel = mongoose.model('Goal', goalSchema);
module.exports = goalModel