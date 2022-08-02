const Assignment = require('../models/assignment');

//CREATE
module.exports.addOne = function(req, res){ 
    var newAssignmentData = unpackAssignmentData(req);
    var newAssignment = new Assignment(newAssignmentData);
    newAssignment.save((err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Assignment post error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    });
}

//READ
module.exports.list = function (req, res) {
    Assignment
        .find()
        .exec(function (err, results) {
            if (err) {
                return handleError(err, res);
            }
            res.json(results);
        });
};

module.exports.getOne = function (req, res) {
    Assignment
        .findById(req.params.id)
        .exec(function (err, Assignment) {
            if (err) {
                return handleError(err, res);
            }
            res.json(Assignment);
        });
};

//UPDATE
module.exports.updateOne = function(req, res){ 
    var newAssignmentData = unpackAssignmentData(req);
    Assignment.findByIdAndUpdate(req.params.id, {$set : newAssignmentData }, {new: true}, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Assignment update error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    })
}

//DELETE
module.exports.deleteOne = function(req, res){ 
    Assignment.findByIdAndDelete(req.params.id, (err, doc) => {
        if(!err){ res.send(doc);}
        else {
            console.log('Assignment delete error:' + JSON.stringify(err, undefined, 2)); 
            res.send(err);
        }
    })
}

function unpackAssignmentData(req){
    var newAssignmentData = new {
        user_id: req.body.user_id,
        task_id: req.body.task_id
    };
    return newAssignmentData
}

function handleError(err, res) {
    console.log(err.toString());
    res.statusCode = 500;
    res.end("Server error: " + err.toString());
    return res;
}

