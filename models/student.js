const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
