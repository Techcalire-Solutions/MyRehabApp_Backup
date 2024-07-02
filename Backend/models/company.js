const mongoose = require('mongoose')

const companySchema = new mongoose.Schema(
    {
        companyName: {type:String,required:true},
        locationName: {type:String},
        companyInChargeName: {type:String,required:true},
        gstNo: {type:String},
    }
)


const companyModel = mongoose.model('Company',companySchema)

module.exports = companyModel