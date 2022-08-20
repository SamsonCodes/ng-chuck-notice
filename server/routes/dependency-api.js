const express = require('express');
const morgan = require('morgan');
const isAuth = require('./authMiddleware').isAuth;

const dependencyController = require('../controllers/dependencyController');

const router = express.Router();

router.use(morgan("combined"));
router.use(isAuth);

router.post('/', dependencyController.addOne);
router.get('/', dependencyController.list);
router.get('/:id', dependencyController.getOne);
router.get('/task/:taskId', dependencyController.getByTaskId);
router.get('/dependency/:dependencyId', dependencyController.getByDependencyId);
router.put('/:id', dependencyController.updateOne);
router.delete('/:id', dependencyController.deleteOne);

module.exports = router;