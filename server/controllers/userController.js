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
            let safeResults = [];
            results.forEach(user=>{
                safeResults.push(safeUserData(user));
            })
            res.json(safeResults);
        });
};

module.exports.getOne = function (req, res) {
    User
        .findById(req.params.id)
        .exec(function (err, user) {
            if (err) {
                return handleError(err, res);
            }
            res.json(safeUserData(user));
        });
};

//UPDATE
module.exports.updateOne = function(req, res){ 
    User
        .findById(req.params.id)
        .exec(function (err, user) {
            if (err) {
                return handleError(err, res);
            }
            if(user.userGroup != 'master'){
                var newUserData = unpackUserData(req);
                User.findByIdAndUpdate(req.params.id, {$set : newUserData }, {new: true}, (err, doc) => {
                    if(!err){ res.send(doc);}
                    else {
                        return handleError(err, res);
                    }
                })
            }    
            else{
                res.json({msg: 'Not allowed to update master.'});
            }        
        });
    
}

//DELETE
module.exports.deleteOne = function(req, res){ 
    User
        .findById(req.params.id)
        .exec(function (err, user) {
            if (err) {
                return handleError(err, res);
            }
            if(user.userGroup != 'master'){
                User.findByIdAndDelete(req.params.id, (err, doc) => {
                    if(!err){ res.send(doc);}
                    else {
                        return handleError(err, res);
                    }
                })
            }
            else{
                res.json({msg: 'Not allowed to delete master.'});
            }
        });
    
}

function unpackUserData(req){
    if(req.body.password){
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
    else {
        var userData = {
            name: req.body.name,
            userGroup: req.body.userGroup,
            penalties: req.body.penalties
        }
        return userData;
    }
    
}

function handleError(err, res) {
    console.log(err.toString());
    res.statusCode = 500;
    res.end("Server error: " + err.toString());
    return res;
}

function safeUserData(user){
    return {
        _id: user._id,
        name: user.name,
        userGroup: user.userGroup,
        penalties: user.penalties
    }
}

