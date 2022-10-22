const Task = require('../models/task');

//CREATE
module.exports.addOne = function(req, res){ 
    var newTaskData = unpackTaskData(req);
    var newTask = new Task(newTaskData);
    newTask.save((err, doc) => {
        if(!err){ 
            console.log(doc);
            res.send(doc);
        }
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
    var newTaskData = unpackTaskData(req);
    Task.findByIdAndUpdate(req.params.id, {$set : newTaskData }, {new: true}, (err, doc) => {
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

function unpackTaskData(req){
    var newTaskData = {
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        status: req.body.status,
        created_by: req.body.created_by,
        created_on: req.body.created_on
    };
    return newTaskData
}

function handleError(err, res) {
    console.log(err.toString());
    res.statusCode = 500;
    res.send("Server error: " + err.toString());
    return res;
}

