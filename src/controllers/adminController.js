const Run = require('../models/Run');
const User = require('../models/User');
const Discount = require('../models/Discount');
const EmailService = require('../services/EmailService');

class adminController {
    static async showDashboard(req, res) {
        try {
            const runs = await Run.findAll();
            const registrations = await Run.getRecentRegistrations();
            const users = await User.findAll();
            const discounts = await Discount.findAll();

            // Get flash messages
            const error = req.cookies.error;
            const success = req.cookies.success;
            
            // Clear flash messages before rendering
            res.clearCookie('error');
            res.clearCookie('success');

            // Render the page
            res.render('admin', { 
                runs, 
                registrations, 
                users,
                discounts,
                error,
                success
            });
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error loading admin dashboard');
            res.redirect('/');
        }
    }

    static async showCreateRun(req, res) {
        try {
            // Get flash messages
            const error = req.cookies.error;
            const success = req.cookies.success;
            
            // Clear flash messages before rendering
            res.clearCookie('error');
            res.clearCookie('success');

            // Render the page
            res.render('create-run', {
                error,
                success
            });
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error loading create run form');
            res.redirect('/admin');
        }
    }

    static async createRun(req, res) {
        try {
            const { run_name, location, date_time } = req.body;
            
            // Basic validation
            if (!run_name || !location || !date_time) {
                res.cookie('error', 'All fields are required');
                return res.redirect('/admin/runs/create');
            }

            // Create the run
            await Run.create({
                run_name,
                location,
                date_time: new Date(date_time)
            });

            res.cookie('success', 'Run created successfully');
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error creating run');
            res.redirect('/admin/runs/create');
        }
    }

    static async deleteRun(req, res) {
        try {
            const runId = req.params.id;
            await Run.delete(runId);
            
            res.cookie('success', 'Run deleted successfully');
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error deleting run');
            res.redirect('/admin');
        }
    }

    static async editRun(req, res) {
        try {
            const runId = req.params.id;
            const { run_name, location, date_time } = req.body;
            
            // Basic validation
            if (!run_name || !location || !date_time) {
                res.cookie('error', 'All fields are required');
                return res.redirect('/admin');
            }

            await Run.update(runId, {
                run_name,
                location,
                date_time: new Date(date_time)
            });

            res.cookie('success', 'Run updated successfully');
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error updating run');
            res.redirect('/admin');
        }
    }

    static async createDiscount(req, res) {
        try {
            const { code, run_id, expires_at } = req.body;
            
            // Basic validation
            if (!code || !run_id || !expires_at) {
                res.cookie('error', 'All fields are required');
                return res.redirect('/admin');
            }

            await Discount.create({
                code: code.toUpperCase(),
                run_id,
                expires_at: new Date(expires_at)
            });

            res.cookie('success', 'Discount code created successfully');
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.cookie('error', error.message);
            res.redirect('/admin');
        }
    }

    static async deleteDiscount(req, res) {
        try {
            const discountId = req.params.id;
            await Discount.delete(discountId);
            
            res.cookie('success', 'Discount code deleted successfully');
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error deleting discount code');
            res.redirect('/admin');
        }
    }

    static async updateDiscountStatus(req, res) {
        try {
            const discountId = req.params.id;
            const newStatus = req.body.status;
            
            await Discount.updateUserDiscountStatus(discountId, newStatus);
            
            res.cookie('success', newStatus === 'ACCEPTED' 
                ? 'Discount accepted and email sent to user'
                : `Discount status updated to ${newStatus}`);
            
            res.redirect('/admin');
        } catch (error) {
            console.error('Error updating discount status:', error);
            res.cookie('error', `Error updating discount status: ${error.message}`);
            res.redirect('/admin');
        }
    }
}

module.exports = adminController; 