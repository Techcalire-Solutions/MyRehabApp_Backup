const User = require('../models/user');

module.exports = async function privilage(req, res, next) {
    if(req.user){     
      
        const user = await User.findOne({_id: req.user.id});
  
        if(user.md === true){
            next();
        }else {
            return res.status(400).send({message :"You are not authorized to perform this action"})
        }
        
    }
}

