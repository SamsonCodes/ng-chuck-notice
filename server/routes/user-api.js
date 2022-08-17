const express = require('express');
const morgan = require('morgan');
const passport = require('passport');

const userController = require('../controllers/userController');

const router = express.Router();

router.use(morgan("combined"));

router.post('/', userController.addOne);
router.post('/login', passport.authenticate('local'), (req, res)=>{
    res.send({msg: `logged in as ${req.user.name}`});
});
router.get('/', userController.list);
router.get('/:id', userController.getOne);
router.put('/:id', userController.updateOne);
router.delete('/:id', userController.deleteOne);

module.exports = router;