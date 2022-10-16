const mongoose = require('mongoose');

const jokeSchema = new mongoose.Schema({
    joke: String
});

module.exports = mongoose.model('Joke', jokeSchema);