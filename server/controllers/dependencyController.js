const Dependency = require('../models/dependency');

//CREATE
module.exports.addOne = function(req, res){ 
    var newDependency = new Dependency(req.body);
    newDependency.save((err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Dependency post error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    });
}

//READ
module.exports.list = function (req, res) {
    Dependency
        .find()
        .exec(function (err, results) {
            if (err) {
                return handleError(err, res);
            }
            res.json(results);
        });
};

module.exports.getOne = function (req, res) {
    Dependency
        .findById(req.params.id)
        .exec(function (err, Dependency) {
            if (err) {
                return handleError(err, res);
            }
            res.json(Dependency);
        });
};

//UPDATE
module.exports.updateOne = function(req, res){ 
    Dependency.findByIdAndUpdate(req.params.id, {$set : req.body }, {new: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Dependency update error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    })
}

//DELETE
module.exports.deleteOne = function(req, res){ 
    Dependency.findByIdAndDelete(req.params.id, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Dependency delete error:' + JSON.stringify(err, undefined, 2)); 
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

