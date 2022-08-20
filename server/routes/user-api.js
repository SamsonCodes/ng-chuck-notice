const express = require('express');
const morgan = require('morgan');
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;

const userController = require('../controllers/userController');

const router = express.Router();

router.use(morgan("combined"));

router.post('/login', userController.login);

router.post('/', isAuth, isAdmin, userController.addOne);
router.get('/', isAuth, userController.list);
router.get('/:id', isAuth, userController.getOne);
router.put('/:id', isAuth, isAdmin, userController.updateOne);
router.delete('/:id', isAuth, isAdmin, userController.deleteOne);

module.exports = router;