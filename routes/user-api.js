const express = require('express');
const router = express.Router();
const morgan = require('morgan');

router.use(morgan("combined"));

router.get('/', (req, res) => {
    res.send('returns all users');
});

module.exports = router;