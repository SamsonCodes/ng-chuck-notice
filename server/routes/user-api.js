const express = require('express');
const morgan = require('morgan');
const isAuth = require('./authMiddleware').isAuth;

const userController = require('../controllers/userController');

const router = express.Router();

router.use(morgan("combined"));

router.post('/login', userController.login);

router.post('/', isAuth, userController.addOne);
router.get('/', isAuth, userController.list);
router.get('/:id', isAuth, userController.getOne);
router.put('/:id', isAuth, userController.updateOne);
router.delete('/:id', isAuth, userController.deleteOne);

module.exports = router;