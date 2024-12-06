const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Apply both auth and admin middleware to all admin routes
router.use(requireAuth, requireAdmin);

router.get('/admin', adminController.showDashboard);
router.get('/admin/runs/create', adminController.showCreateRun);
router.post('/admin/runs/create', adminController.createRun);
router.post('/admin/runs/:id/delete', adminController.deleteRun);
router.post('/admin/runs/:id/edit', adminController.editRun);
router.post('/admin/discounts/create', adminController.createDiscount);
router.post('/admin/discounts/:id/delete', adminController.deleteDiscount);
router.post('/admin/discounts/:id/status', adminController.updateDiscountStatus);

module.exports = router; 