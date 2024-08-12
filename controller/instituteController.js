const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Institute = require('../models/institute');
const auth = require('../middleware/auth');
const admin = require('../models/admin');

const router = express.Router();

const createInstitute = async (req, res) => {
    const { name, contactEmail, password } = req.body;
    const adminId = req.admin._id;

    try {
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newInstitute = new Institute({ 
            name, 
            contactEmail, 
            password: hashedPassword,  // Save the hashed password
            adminId 
        });

        await newInstitute.save();
        res.status(201).send(newInstitute);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get all Institutes managed by Admin
const getAllInstitutes = async (req, res) => {
    const adminId = req.admin._id; // Admin ID from the authenticated request

    try {
        const institutes = await Institute.find({ adminId });
        res.status(200).send(institutes);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching institutes.', details: error.message });
    }
};

// Update an Institute by Admin
const updateInstitute = async (req, res) => {
    const { id } = req.params; // Get institute ID from URL parameters
    const { name, contactEmail } = req.body; // Get new data from the request body
    const adminId = req.admin._id; // Get the logged-in admin's ID

    try {
        // Find and update the institute if it matches the given ID and adminId
        const institute = await Institute.findOneAndUpdate(
            { _id: id, adminId: adminId }, // Match by institute ID and admin ID
            { name, contactEmail }, // Update fields
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        // If no institute was found, send a 404 response
        if (!institute) {
            return res.status(404).send("Institute not found or you don't have permission to update it.");
        }

        // If the update was successful, send the updated institute data
        res.status(200).send(institute);
    } catch (error) {
        // Send a 400 response with the error message if something went wrong
        res.status(400).send({ error: error.message });
    }
};

// Delete an Institute by Admin
const deleteInstitute = async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin._id;

    try {
        // Find the institute by ID and ensure it's managed by the admin
        const institute = await Institute.findOneAndDelete({ _id: id, adminId });
        if (!institute) {
            return res.status(404).send({ error: "Institute not found or you don't have permission to delete it." });
        }

        res.status(200).send({ message: "Institute deleted successfully." });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Institute Signup
const signupInstitute = async (req, res) => {
    const { name, contactEmail, password } = req.body;

    try {
        // Check if the institute with the same email already exists
        const existingInstitute = await Institute.findOne({ contactEmail });
        if (existingInstitute) {
            return res.status(400).send({ error: 'Email already in use.' });
        }

        const institute = new Institute({ name, contactEmail, password });
        // Save the institute to the database
        await institute.save();

        // Generate an auth token
        const token = jwt.sign({ _id: institute._id.toString() }, 'secretKey'); // Replace 'secretKey' with your secret key
        res.status(201).send({ institute, token });
    } catch (error) {
        console.error('Error details:', error); // Log the error details
        res.status(400).send({ error: 'Error creating institute.', details: error.message });
    }
};

const loginInstitute = async (req, res) => {
    try {
        const { contactEmail, password } = req.body;

        // Find institute by email
        const institute = await Institute.findOne({ contactEmail });
        if (!institute) {
            return res.status(400).send({ error: 'Invalid email or password.' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, institute.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Invalid email or password.' });
        }

        // Check if the Institute was created by an admin
        if (!institute.adminId) {
            return res.status(403).send({ error: 'Access denied. Please contact your administrator.' });
        }

        // Generate an auth token
        const token = jwt.sign({ _id: institute._id.toString() }, 'secretKey'); // Replace 'secretKey' with your secret key
        res.status(200).send({ institute, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
module.exports = {
    createInstitute,
    getAllInstitutes,
    updateInstitute,
    deleteInstitute,
    signupInstitute,
    loginInstitute
};
