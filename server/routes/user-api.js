const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

const userController = require('../controllers/userController');

const router = express.Router();

router.use(morgan("combined"));

router.post('/', userController.addOne);
router.post('/login', userController.login);
// router.post('/register', userController.register);

router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.status(200).json({success: true, msg: "You are authorized!"});
});

router.get('/', userController.list);
router.get('/:id', userController.getOne);
router.put('/:id', userController.updateOne);
router.delete('/:id', userController.deleteOne);

module.exports = router;