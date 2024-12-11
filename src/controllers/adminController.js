const Run = require('../models/Run');
const User = require('../models/User');
const Discount = require('../models/Discount');
const EmailService = require('../services/EmailService');

class adminController {

    // Viser admin-dashboard med løb, registreringer, brugere og rabatkoder
    static async showDashboard(req, res) {
        try {
            const runs = await Run.findAll();
            const registrations = await Run.getRecentRegistrations();
            const users = await User.findAll();
            const discounts = await Discount.findAll();

            const error = req.cookies.error;
            const success = req.cookies.success;
        
            res.clearCookie('error');
            res.clearCookie('success');

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

    // Viser formular til oprettelse af løb
    static async showCreateRun(req, res) {
        try {
            const error = req.cookies.error;
            const success = req.cookies.success;
            res.clearCookie('error');
            res.clearCookie('success');

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

    // Opretter et nyt løb
    static async createRun(req, res) {
        try {
            const { run_name, location, date_time } = req.body;
            
            if (!run_name || !location || !date_time) {
                res.cookie('error', 'All fields are required');
                return res.redirect('/admin/runs/create');
            }

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

    // Sletter et løb
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

    // Rediger et løb
    static async editRun(req, res) {
        try {
            const runId = req.params.id;
            const { run_name, location, date_time } = req.body;
            
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

    // Lav en rabatkode
    static async createDiscount(req, res) {
        try {
            const { code, run_id, expires_at } = req.body;
            
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

    // Sletter en rabatkode
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

    // Opdaterer status for en rabatkode og sender e-mail, hvis den accepteres
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