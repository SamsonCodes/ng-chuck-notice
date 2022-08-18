const User = require('../models/user');
const genPassword = require('../lib/utils').genPassword;
const utils = require('../lib/utils');

//CREATE
module.exports.addOne = function(req, res){     
    const userData = unpackUserData(req);
    var newUser = new User(userData);
    newUser.save((err, doc) => {
        if(!err){ 
            res.send(doc);
        }
        else {
            return handleError(err, res);
        }
    });
}

module.exports.login = function(req, res, next){
    User.findOne({ name: req.body.name })
    .then((user) => {

        if (!user) {
            return res.status(401).json({ success: false, msg: "could not find user" });
        }
        
        // Function defined at bottom of app.js
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
        
        if (isValid) {

            const tokenObject = utils.issueJWT(user);

            res.status(200).json({ 
                success: true, 
                user: user, 
                token: tokenObject.token, 
                expiresIn: tokenObject.expires 
            });

        } else {

            res.status(401).json({ success: false, msg: "you entered the wrong password" });

        }

    })
    .catch((err) => {
        next(err);
    });
}

//READ
module.exports.list = function (req, res) {
    User
        .find()
        .exec(function (err, results) {
            if (err) {
                return handleError(err, res);
            }
            res.json(results);
        });
};

module.exports.getOne = function (req, res) {
    User
        .findById(req.params.id)
        .exec(function (err, User) {
            if (err) {
                return handleError(err, res);
            }
            res.json(User);
        });
};

//UPDATE
module.exports.updateOne = function(req, res){ 
    var newUserData = unpackUserData(req);
    User.findByIdAndUpdate(req.params.id, {$set : newUserData }, {new: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            return handleError(err, res);
        }
    })
}

//DELETE
module.exports.deleteOne = function(req, res){ 
    User.findByIdAndDelete(req.params.id, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            return handleError(err, res);
        }
    })
}

function unpackUserData(req){
    const saltHash = genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    var userData = {
        name: req.body.name,
        hash: hash,
        salt: salt,
        userGroup: req.body.userGroup,
        penalties: req.body.penalties
    }
    return userData;
}

function handleError(err, res) {
    console.log(err.toString());
    res.statusCode = 500;
    res.end("Server error: " + err.toString());
    return res;
}

