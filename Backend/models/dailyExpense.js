const mongoose = require('mongoose')

const dailyExpenseSchema = new mongoose.Schema(
    {
        date :{type:Date,required:true},
        expense : {type:Number,required:true},
        type : {type:String,required:true}, 
        collectedFrom : {type:mongoose.Schema.Types.ObjectId, ref:'User'}, 
        otherExpense : {type: String}
    }
)


const dailyExpenseModel = mongoose.model('DailyExpense',dailyExpenseSchema)

module.exports = dailyExpenseModel