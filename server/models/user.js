const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    hash: String,
    salt: String,
    userGroup: String,
    penalties: Number
});

module.exports = mongoose.model('User', userSchema);