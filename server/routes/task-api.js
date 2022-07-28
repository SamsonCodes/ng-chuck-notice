const express = require('express');
const morgan = require('morgan');

const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(morgan("combined"));

router.post('/', taskController.addOne);
router.get('/', taskController.list);
router.get('/:id', taskController.getOne);
router.put('/:id', taskController.updateOne);
router.delete('/:id', taskController.deleteOne);

module.exports = router;