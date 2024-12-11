const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');
const { requireAuth } = require('../middleware/authMiddleware');

// Oftenlig route 
router.get('/runs', requireAuth, runController.listRuns);

// Private routes
router.get('/registrations', requireAuth, runController.listMyRegistrations);
router.get('/runs/:id', requireAuth, runController.showRun);
router.post('/runs/:id/register', requireAuth, runController.registerForRun);

module.exports = router; 