const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the Admin Schema
const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    instituteIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Institute' }]
}, { timestamps: true });

// Hash the password before saving the admin model
AdminSchema.pre('save', async function (next) {
    const admin = this;

    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }

    next();

    db.admin.remove({ adminId: { $exists: true } })

});

// Method to generate auth token
AdminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const token = jwt.sign({ _id: admin._id.toString() }, 'yourSecretKey', { expiresIn: '1h' });
    return token;
};

// Static method to find admin by credentials
AdminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await mongoose.model('admin').findOne({ email }); // Use mongoose.model here
    if (!admin) {
        throw new Error('Admin not found');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }
    return admin;
};

module.exports = mongoose.model('admin', AdminSchema); // Ensure model name is 'admin'
