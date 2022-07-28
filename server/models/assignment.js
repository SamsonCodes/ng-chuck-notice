const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    user_id: String,
    task_id: String
});

module.exports = mongoose.model('Assignment', assignmentSchema);