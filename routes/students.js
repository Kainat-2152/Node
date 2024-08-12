const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Course = require('../models/course');

// Create a new student
router.post('/', async (req, res) => {
    const { name, email, password, instituteId } = req.body;
    try {
        const student = new Student({ name, email, password, instituteId });
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send({ error: 'Error creating student.' });
    }
});

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching students.' });
    }
});

// Get a student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('courses');
        if (!student) {
            return res.status(404).send({ error: 'Student not found.' });
        }
        res.send(student);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching student.' });
    }
});

// Update a student by ID
router.put('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'instituteId'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send({ error: 'Student not found.' });
        }

        updates.forEach(update => student[update] = req.body[update]);
        await student.save();
        res.send(student);
    } catch (error) {
        res.status(400).send({ error: 'Error updating student.' });
    }
});

// Delete a student by ID
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).send({ error: 'Student not found.' });
        }
        res.send(student);
    } catch (error) {
        res.status(500).send({ error: 'Error deleting student.' });
    }
});



module.exports = router;
