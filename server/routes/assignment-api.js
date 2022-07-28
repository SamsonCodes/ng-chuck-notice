const express = require('express');
const morgan = require('morgan');

const assignmentController = require('../controllers/assignmentController');

const router = express.Router();

router.use(morgan("combined"));

router.post('/', assignmentController.addOne);
router.get('/', assignmentController.list);
router.get('/:id', assignmentController.getOne);
router.put('/:id', assignmentController.updateOne);
router.delete('/:id', assignmentController.deleteOne);

module.exports = router;