const jwt = require('jsonwebtoken');


function jwtTokens({id, name}){
    const user = {id, name};
    const accessToken = jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: '1d'});
    return({accessToken});    
}

module.exports = jwtTokens;