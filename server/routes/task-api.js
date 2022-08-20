const express = require('express');
const morgan = require('morgan');
const isAuth = require('./authMiddleware').isAuth;

const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(morgan("combined"));
router.use(isAuth);

router.post('/', taskController.addOne);
router.get('/', taskController.list);
router.get('/:id', taskController.getOne);
router.put('/:id', taskController.updateOne);
router.delete('/:id', taskController.deleteOne);

module.exports = router;