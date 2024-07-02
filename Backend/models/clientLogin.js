const mongoose = require('mongoose');
var moment = require('moment');
const { string } = require('@hapi/joi');

const clientLoginSchema = new mongoose.Schema(
    { 
       clientId : {type: mongoose.Schema.Types.ObjectId, ref:'client'},
       client_ID : {type:String},
       password:{type: String, required: true},
       image_url :{type: String},
       cloudinary_id : {type: String}
    }
)

const clientLoginModel = mongoose.model('ClientLogin',clientLoginSchema)

module.exports = clientLoginModel