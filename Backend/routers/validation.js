const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = data =>{
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().min(6).max(30),
        password: Joi.string().min(5).max(30).required(),
        role: Joi.string().min(3).max(20).required(),
        therapyCategory:Joi.any().optional(),
        therapistName: Joi.any().optional(),
        md: Joi.any().optional(),
        qualifications: Joi.any().optional(),
        experiences: Joi.any().optional(),
        qualification_id : Joi.any().optional(),
        qualification_file : Joi.any().optional(),
        idProof_id : Joi.any().optional(),
        idProof_file : Joi.any().optional(),
        experience_id : Joi.any().optional(),
        experience_file : Joi.any().optional(),
        sharePercentage: Joi.any().optional(),
        birthDate: Joi.any().optional(),
        joiningDate: Joi.any().optional(),
        companyId: Joi.any().required(),
    })
    return schema.validate(data)
}



const loginValidation = data =>{
    const schema = Joi.object({
        email: Joi.string().min(6).max(30).required().email(),
        password: Joi.string().min(5).max(30).required(),
    })
    return schema.validate(data)
}

const clientLoginValidation = data =>{
    const schema = Joi.object({
        client_ID: Joi.string().max(10).required(),
        password: Joi.string().min(5).max(30).required(),
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.clientLoginValidation = clientLoginValidation;