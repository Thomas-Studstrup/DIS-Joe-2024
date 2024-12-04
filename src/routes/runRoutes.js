const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

// Public routes with optional auth
router.get('/runs', optionalAuth, runController.listRuns);

// Protected routes
router.get('/registrations', requireAuth, runController.listMyRegistrations);
router.get('/runs/:id', requireAuth, runController.showRun);
router.post('/runs/:id/register', requireAuth, runController.registerForRun);

module.exports = router; 