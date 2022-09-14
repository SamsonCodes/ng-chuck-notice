const express = require('express');
const morgan = require('morgan');
const isAuth = require('./authMiddleware').isAuth;
const Assignment = require('../models/assignment');
const parseJwt = require('../lib/utils').parseJwt;

const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(morgan("combined"));
router.use(isAuth);

router.post('/', taskController.addOne);
router.get('/', taskController.list);
router.get('/:id', taskController.getOne);
router.put('/:id', mayEdit, taskController.updateOne);
router.delete('/:id', taskController.deleteOne);

module.exports = router;

function mayEdit(req, res, next) {
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