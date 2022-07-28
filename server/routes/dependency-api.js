const express = require('express');
const morgan = require('morgan');

const dependencyController = require('../controllers/dependencyController');

const router = express.Router();

router.use(morgan("combined"));

router.post('/', dependencyController.addOne);
router.get('/', dependencyController.list);
router.get('/:id', dependencyController.getOne);
router.put('/:id', dependencyController.updateOne);
router.delete('/:id', dependencyController.deleteOne);

module.exports = router;