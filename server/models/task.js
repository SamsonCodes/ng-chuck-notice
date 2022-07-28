const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: String,
    status: String,
    created_by: String
});

module.exports = mongoose.model('Task', taskSchema);