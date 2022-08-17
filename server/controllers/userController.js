const User = require('../models/user');
const genPassword = require('../lib/passwordUtils').genPassword;

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

