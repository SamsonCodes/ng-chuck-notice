const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    userGroup: String,
    penalties: Number
});

module.exports = mongoose.model('User', userSchema);