const express = require('express');
const router = express.Router();
const instituteController = require('../controller/instituteController');
const auth = require('../middleware/auth');

// Create a new Institute by Admin
router.post('/institute', auth, instituteController.createInstitute);

// Get all Institutes managed by Admin
router.get('/institutes', auth, instituteController.getAllInstitutes);

// Update an Institute
router.put('/institute/:id', auth, instituteController.updateInstitute);

// Delete an Institute
router.delete('/institute/:id', auth, instituteController.deleteInstitute);

// Institute Signup
router.post('/institutesignup', instituteController.signupInstitute);

// Institute Login
router.post('/institutelogin', instituteController.loginInstitute);

module.exports = router;
