const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const instituteRoutes = require('./routes/institute'); // Ensure this path is correct
const adminRoutes = require('./routes/admin'); // Ensure this path is correct
const studentRoutes = require('./routes/students'); // Ensure this path is correct
const courseRoutes = require('./routes/courses');
const teacherRoutes = require('./routes/teachers');


const app = express();

app.use(bodyParser.json());
app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/school-db', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use('/api/institute', instituteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/teachers', teacherRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
