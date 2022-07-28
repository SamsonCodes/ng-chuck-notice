const mongoose = require('mongoose');

const dependencySchema = new mongoose.Schema({
    task_id: String,
    dependency_id: String
});

module.exports = mongoose.model('Dependency', dependencySchema);