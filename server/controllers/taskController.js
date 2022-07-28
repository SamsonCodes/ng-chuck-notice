const Task = require('../models/task');

//CREATE
module.exports.addOne = function(req, res){ 
    var newTask = new Task(req.body);
    newTask.save((err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Task post error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    });
}

//READ
module.exports.list = function (req, res) {
    Task
        .find()
        .exec(function (err, results) {
            if (err) {
                return handleError(err, res);
            }
            res.json(results);
        });
};

module.exports.getOne = function (req, res) {
    Task
        .findById(req.params.id)
        .exec(function (err, Task) {
            if (err) {
                return handleError(err, res);
            }
            res.json(Task);
        });
};

//UPDATE
module.exports.updateOne = function(req, res){ 
    Task.findByIdAndUpdate(req.params.id, {$set : req.body }, {new: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Task update error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    })
}

//DELETE
module.exports.deleteOne = function(req, res){ 
    Task.findByIdAndDelete(req.params.id, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Task delete error:' + JSON.stringify(err, undefined, 2)); 
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

