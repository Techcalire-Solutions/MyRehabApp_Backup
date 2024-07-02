const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
    {
        therapyName :{type:String,required:true},
        abbreviation : {type:String,required:true}
    }
)


const categoryModel = mongoose.model('Category',categorySchema)

module.exports = categoryModel