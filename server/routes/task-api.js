const express = require('express');
const morgan = require('morgan');
const isAuth = require('./authMiddleware').isAuth;
const mayEdit = require('./authMiddleware').mayEdit;

const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(morgan("combined"));
router.use(isAuth);

router.post('/', taskController.addOne);
router.get('/', taskController.list);
router.get('/:id', taskController.getOne);
router.put('/:id', mayEdit, taskController.updateOne);
router.delete('/:id', mayEdit, taskController.deleteOne);

module.exports = router;

