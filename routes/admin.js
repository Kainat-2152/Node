const express = require('express');
const router = express.Router();
const Admin = require('../models/admin'); // Import the Admin model

// Signup endpoint
router.post('/admins', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the admin with the same email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).send({ error: 'Email already in use.' });
        }

        const admin = new Admin({ name, email, password });
        // Save the admin to the database
        await admin.save();
        // Generate an auth token
        const token = await admin.generateAuthToken();

        // Send back the admin data and token
        res.status(201).send({ admin, token });
    } catch (error) {
        console.error('Error details:', error); // Log the error details
        res.status(400).send({ error: 'Error creating admin.', details: error.message }); // Include error details in the response
    }
});

// Login endpoint
router.post('/adminslogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findByCredentials(email, password);
        const token = await admin.generateAuthToken(); // Use the instance method here
        res.send({ admin, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
