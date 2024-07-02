const User = require('../models/user');

module.exports = async function expensePrivilage(req, res, next) {
    if(req.user){     
        const user = await User.findOne({_id: req.user.id});
        if(user.md === true){
            req.user.md = true;
            next();
        }else if(user.md === false){
            req.user.md = false;
            next();
        }
        
    }
}