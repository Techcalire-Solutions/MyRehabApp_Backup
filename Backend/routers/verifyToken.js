//Middleware

const jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(401).send({message: 'Access Denied'});
    try {
        jwt.verify(token, process.env.TOKEN_SECRET, (error, user)=>{
            if(error) return res.status(403).send({message : 'Token is expired, Please login again...'});
            req.user = user
            next();
        })        
        
    } catch (err) {
        res.status(403).send({message : 'Invalid Token'});       
    }
}