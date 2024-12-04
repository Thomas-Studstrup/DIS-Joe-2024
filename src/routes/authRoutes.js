const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login routes
router.get('/login', authController.showLogin);
router.post('/login', authController.login);

// Register routes
router.get('/register', authController.showRegister);
router.post('/register', authController.register);

// Logout route
router.get('/logout', authController.logout);

module.exports = router; 