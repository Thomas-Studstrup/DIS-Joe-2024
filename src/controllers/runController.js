const Run = require('../models/Run');
const User = require('../models/User');

class runController {
    static async listRuns(req, res) {
        try {
            const runs = await Run.findAll();
            const userRegistrations = await User.getUserRuns(req.session.userId);
            
            // Mark runs that user is registered for
            const runsWithRegistration = runs.map(run => ({
                ...run,
                isRegistered: userRegistrations.some(reg => reg.run_id === run.run_id)
            }));
            
            res.render('runs', { 
                runs: runsWithRegistration,
                error: req.session.error,
                success: req.session.success 
            });
            
            // Clear flash messages
            delete req.session.error;
            delete req.session.success;
        } catch (error) {
            console.error(error);
            req.session.error = 'Error loading runs';
            res.redirect('/');
        }
    }

    static async listMyRegistrations(req, res) {
        try {
            const registrations = await User.getUserRuns(req.session.userId);
            res.render('registrations', { 
                registrations,
                error: req.session.error,
                success: req.session.success 
            });
            
            // Clear flash messages
            delete req.session.error;
            delete req.session.success;
        } catch (error) {
            console.error(error);
            req.session.error = 'Error loading your registrations';
            res.redirect('/');
        }
    }

    static async showRun(req, res) {
        try {
            const run = await Run.findById(req.params.id);
            if (!run) {
                req.session.error = 'Run not found';
                return res.redirect('/runs');
            }

            const registrationStatus = await User.getRegistrationStatus(
                req.session.userId, 
                run.run_id
            );

            res.render('runs/show', { run, registrationStatus });
        } catch (error) {
            console.error(error);
            req.session.error = 'Error loading run details';
            res.redirect('/runs');
        }
    }

    static async registerForRun(req, res) {
        try {
            const runId = req.params.id;
            await Run.registerUser(req.session.userId, runId);
            req.session.success = 'Successfully registered for the run';
            res.redirect('/registrations');
        } catch (error) {
            console.error(error);
            req.session.error = 'Error registering for run';
            res.redirect(`/runs/${req.params.id}`);
        }
    }
}

module.exports = runController; 