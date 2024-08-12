const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Student = require('../models/student');

// Create a new course
router.post('/', async (req, res) => {
    const { name, description, instituteId } = req.body;
    try {
        const course = new Course({ name, description, instituteId });
        await course.save();
        console.log('Course created:', course); // Log the created course
        res.status(201).send(course);
    } catch (error) {
        console.error('Error creating course:', error); // Log any errors
        res.status(400).send({ error: 'Error creating course.' });
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.send(courses);
    } catch (error) {
        console.error('Error fetching courses:', error); // Log any errors
        res.status(500).send({ error: 'Error fetching courses.' });
    }
});

// Get a course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send({ error: 'Course not found.' });
        }
        res.send(course);
    } catch (error) {
        console.error('Error fetching course:', error); // Log any errors
        res.status(500).send({ error: 'Error fetching course.' });
    }
});

// Update a course by ID
router.put('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'instituteId'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send({ error: 'Course not found.' });
        }

        updates.forEach(update => course[update] = req.body[update]);
        await course.save();
        res.send(course);
    } catch (error) {
        console.error('Error updating course:', error); // Log any errors
        res.status(400).send({ error: 'Error updating course.' });
    }
});

// Delete a course by ID
router.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).send({ error: 'Course not found.' });
        }
        res.send(course);
    } catch (error) {
        console.error('Error deleting course:', error); // Log any errors
        res.status(500).send({ error: 'Error deleting course.' });
    }
});


module.exports = router;
