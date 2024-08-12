const mongoose = require('mongoose');

// Define the Course Schema
const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
});
module.exports = mongoose.model('Course', CourseSchema);
    