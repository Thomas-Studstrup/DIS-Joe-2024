const Run = require('../models/Run');
const User = require('../models/User');
const EmailService = require('../services/EmailService');

class runController {

    // Liste alle løb, og marker hvilke brugeren er registreret til
    static async listRuns(req, res) {
        try {
            const runs = await Run.findAll();
            const userRegistrations = await User.getUserRuns(req.user.id);
            
            // Tilføj registreringsstatus til hvert løb
            const runsWithRegistration = runs.map(run => ({
                ...run,
                isRegistered: userRegistrations.some(reg => reg.run_id === run.run_id)
            }));
            
            // Hent og ryd flash-beskeder
            const error = req.cookies.error;
            const success = req.cookies.success;
            res.clearCookie('error');
            res.clearCookie('success');

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

    // Liste brugerens egne registreringer
    static async listMyRegistrations(req, res) {
        try {
            const registrations = await User.getUserRuns(req.user.id);
            
            const error = req.cookies.error;
            const success = req.cookies.success;            
            res.clearCookie('error');
            res.clearCookie('success');

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

    // Vis detaljer for et specifikt løb
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

    // Registrer brugeren til et løb
    static async registerForRun(req, res) {
        try {
            const runId = req.params.id;
            const { email } = req.body;
            
            // Tjek at e-mail matcher brugerens e-mail
            if (email !== req.user.email) {
                res.cookie('error', 'Email does not match your account');
                return res.redirect(`/runs/${runId}`);
            }

            // Hent løbsdetaljer
            const run = await Run.findById(runId);
            if (!run) {
                res.cookie('error', 'Run not found');
                return res.redirect('/runs');
            }

            // Registrer brugeren til løbet
            await Run.registerUser(req.user.id, runId);
            
            // Send bekræftelsesmail
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