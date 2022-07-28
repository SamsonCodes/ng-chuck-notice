const User = require('../models/user');

//CREATE
module.exports.addOne = function(req, res){ 
    var newUser = new User(
        {
            name: req.body.name,
            password: req.body.password,
            userGroup: req.body.userGroup
        }
    );
    newUser.save((err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('User post error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
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
    User.findByIdAndUpdate(req.params.id, {$set : req.body }, {new: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('User update error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    })
}

//DELETE
module.exports.deleteOne = function(req, res){ 
    User.findByIdAndDelete(req.params.id, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('User delete error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    })
}

function handleError(err, res) {
    console.log(err.toString());
    res.statusCode = 500;
    res.end("Server error: " + err.toString());
    return res;
}

