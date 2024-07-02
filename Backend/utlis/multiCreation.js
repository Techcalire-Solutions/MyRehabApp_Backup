const Category = require('../models/category');
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const Fee = require('../models/fees')
const Company = require('../models/company');

async function dataInitialization(){
    const categories = [
        {therapyName : 'OCCUPATIONAL THERAPY', abbreviation : 'OT'},
        {therapyName : 'BEHAVIOURAL THERAPY', abbreviation : 'BT'},
        {therapyName : 'SPEECH THERAPY', abbreviation : 'ST'},
        {therapyName : 'CLINICAL PSYCOLOGY', abbreviation : 'CP'},
    ]

    const category = await Category.find()  
    if(category.length == 0){   
        Category.insertMany(categories, function(err, result) {
            if (err) throw err;
        })
    }

    const fees = {sessionFee : 500, assessmentFee : 600, lmc : 200, groupSessionFee : 400}
    const fee = await Fee.find()
    if(fee.length == 0){
        Fee.create(fees, function(err, result){
            if(err) throw err;
        })
    }

    const company = {companyName : 'My Rehab App', locationName : 'Ernakulam', companyInChargeName : 'Nishida PS'}
    const comp = await Company.find()
    if(comp.length == 0){
        const createdCompany = await Company.create(company)
        // Storing the companyId for later use
        const companyId = createdCompany._id

        //hashing passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt)

        const admin = [
            {name : 'admin', email : 'admin@gmail.com', password : hashedPassword, role : 'admin', md : true, companyId: companyId}
        ]

        const user = await User.find()
        if(user.length == 0){
            await User.create(admin)
        }
    }

}


module.exports = dataInitialization