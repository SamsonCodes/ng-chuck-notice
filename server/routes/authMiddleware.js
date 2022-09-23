const passport = require('passport');
const parseJwt = require('../lib/utils').parseJwt;
const Assignment = require('../models/assignment');

module.exports.isAuth = passport.authenticate('jwt', {session: false});

module.exports.isAdmin = function(req, res, next) {  
    let jwt = req.headers.authorization.split(' ')[1];
    let payload = parseJwt(jwt);
    if(payload.userGroup == 'admins' || payload.userGroup =='master'){        
        next();
    }
    else{
        res.status(401).send({msg: "Only admins and master can access this route."})
    }
}

module.exports.mayEdit = function(req, res, next) {
    let jwt = req.headers.authorization.split(' ')[1];
    let payload = parseJwt(jwt);
    if(payload.userGroup == 'admins' || payload.userGroup == 'managers' || payload.userGroup == 'master'){        
        next();
    }
    else{
        Assignment
        .find({task_id: req.params.id})
        .exec(function (err, results) {
            if (err) {
                return handleError(err, res);
            }
            let userResults = results.filter(a => {return a.user_id == payload.sub});
            if(userResults.length > 0){
                next();
            }
            else{
                res.status(401).send({msg: "You are not authorized to edit this task."});
            }
        });
    }
}