const Run = require('../models/Run');
const User = require('../models/User');
const EmailService = require('../services/EmailService');

class runController {
    static async listRuns(req, res) {
        try {
            const runs = await Run.findAll();
            const userRegistrations = await User.getUserRuns(req.user.id);
            
            // Mark runs that user is registered for
            const runsWithRegistration = runs.map(run => ({
                ...run,
                isRegistered: userRegistrations.some(reg => reg.run_id === run.run_id)
            }));
            
            // Get flash messages
            const error = req.cookies.error;
            const success = req.cookies.success;
            
            // Clear flash messages before rendering
            res.clearCookie('error');
            res.clearCookie('success');

            // Render the page
            res.render('runs', { 
                runs: runsWithRegistration,
                error,
                success
            });
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error loading runs');
            res.redirect('/');
        }
    }

    static async listMyRegistrations(req, res) {
        try {
            const registrations = await User.getUserRuns(req.user.id);
            
            // Get flash messages
            const error = req.cookies.error;
            const success = req.cookies.success;
            
            // Clear flash messages before rendering
            res.clearCookie('error');
            res.clearCookie('success');

            // Render the page
            res.render('registrations', { 
                registrations,
                error,
                success
            });
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error loading your registrations');
            res.redirect('/');
        }
    }

    static async showRun(req, res) {
        try {
            const run = await Run.findById(req.params.id);
            if (!run) {
                res.cookie('error', 'Run not found');
                return res.redirect('/runs');
            }

            const registrationStatus = await User.getRegistrationStatus(
                req.user.id, 
                run.run_id
            );

            res.render('runs/show', { run, registrationStatus });
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error loading run details');
            res.redirect('/runs');
        }
    }

    static async registerForRun(req, res) {
        try {
            const runId = req.params.id;
            const { email } = req.body;
            
            // Verify email matches user's email
            if (email !== req.user.email) {
                res.cookie('error', 'Email does not match your account');
                return res.redirect(`/runs/${runId}`);
            }

            // Get run details for email
            const run = await Run.findById(runId);
            if (!run) {
                res.cookie('error', 'Run not found');
                return res.redirect('/runs');
            }

            // Register user
            await Run.registerUser(req.user.id, runId);
            
            // Send confirmation email
            await EmailService.sendRegistrationConfirmation(email, run);

            res.cookie('success', 'Successfully registered for the run. Check your email for confirmation.');
            res.redirect('/registrations');
        } catch (error) {
            console.error(error);
            res.cookie('error', 'Error registering for run');
            res.redirect(`/runs/${req.params.id}`);
        }
    }
}

module.exports = runController; 