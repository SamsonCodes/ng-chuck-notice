const passport = require('passport');
const parseJwt = require('../lib/utils').parseJwt;

module.exports.isAuth = passport.authenticate('jwt', {session: false});

module.exports.isAdmin = function(req, res , next) {    
    console.log(req.headers.authorization);
    let jwt = req.headers.authorization.split(' ')[1];
    let payload = parseJwt(jwt);
    if(payload.userGroup == 'admins'){        
        next();
    }
    else{
        res.status(401).send({msg: "Only admins can access this route."})
    }
}