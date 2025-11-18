const express = require('express');
const router = express.Router();

const createDepartment = require('../controllers/departmentController').createDepartment;
const getDepartments = require('../controllers/departmentController').getDepartments;

const protect = require('../middleware/authMiddleware'); // default import

// Only protected routes
router.post('/', protect, createDepartment);
router.get('/', protect, getDepartments);

module.exports = router;
