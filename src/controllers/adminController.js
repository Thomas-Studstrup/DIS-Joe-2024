const Run = require('../models/Run');
const User = require('../models/User');

class adminController {
    static async showDashboard(req, res) {
        try {
            const runs = await Run.findAll();
            const registrations = await Run.getRecentRegistrations();
            const users = await User.findAll();

            res.render('admin', { 
                runs, 
                registrations, 
                users,
                error: req.session.error,
                success: req.session.success 
            });

            // Clear flash messages
            delete req.session.error;
            delete req.session.success;
        } catch (error) {
            console.error(error);
            req.session.error = 'Error loading admin dashboard';
            res.redirect('/');
        }
    }

    static async showCreateRun(req, res) {
        try {
            res.render('create-run', {
                error: req.session.error,
                success: req.session.success
            });
            
            // Clear flash messages
            delete req.session.error;
            delete req.session.success;
        } catch (error) {
            console.error(error);
            req.session.error = 'Error loading create run form';
            res.redirect('/admin');
        }
    }

    static async createRun(req, res) {
        try {
            const { run_name, location, date_time } = req.body;
            
            // Basic validation
            if (!run_name || !location || !date_time) {
                req.session.error = 'All fields are required';
                return res.redirect('/admin/runs/create');
            }

            // Create the run
            await Run.create({
                run_name,
                location,
                date_time: new Date(date_time)
            });

            req.session.success = 'Run created successfully';
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            req.session.error = 'Error creating run';
            res.redirect('/admin/runs/create');
        }
    }
}

module.exports = adminController; 