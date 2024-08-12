const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');
const Course = require('../models/course');

const bcrypt = require('bcryptjs'); // For password hashing

// Create a new teacher
router.post('/', async (req, res) => {
    const { name, email, password, instituteId } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !instituteId) {
        return res.status(400).send({ error: 'All fields are required.' });
    }

    try {
        // Check if a teacher with the same email already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).send({ error: 'Teacher with this email already exists.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new teacher
        const teacher = new Teacher({ name, email, password: hashedPassword, instituteId });
        await teacher.save();
        
        // Send response
        res.status(201).send(teacher);
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).send({ error: 'Error creating teacher.' });
    }
});


// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.send(teachers);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching teachers.' });
    }
});

// Get a teacher by ID
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).send({ error: 'Teacher not found.' });
        }
        res.send(teacher);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching teacher.' });
    }
});

// Update a teacher by ID
router.put('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'instituteId'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).send({ error: 'Teacher not found.' });
        }

        updates.forEach(update => teacher[update] = req.body[update]);
        await teacher.save();
        res.send(teacher);
    } catch (error) {
        res.status(400).send({ error: 'Error updating teacher.' });
    }
});

// Delete a teacher by ID
router.delete('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) {
            return res.status(404).send({ error: 'Teacher not found.' });
        }
        res.send(teacher);
    } catch (error) {
        res.status(500).send({ error: 'Error deleting teacher.' });
    }
});



module.exports = router;
