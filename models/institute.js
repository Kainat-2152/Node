const mongoose = require('mongoose');

// Define the Institute Schema
const InstituteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true } // Reference to Admin
}, { timestamps: true });

module.exports = mongoose.model('Institute', InstituteSchema);
