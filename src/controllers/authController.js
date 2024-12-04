const User = require('../models/User');

class authController {
    static async showLogin(req, res) {
        const error = req.session.error;
        delete req.session.error;
        res.render('login', { error });
    }

    static async showRegister(req, res) {
        const error = req.session.error;
        delete req.session.error;
        res.render('register', { error });
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            
            if (!user) {
                req.session.error = 'Invalid email or password';
                return res.redirect('/login');
            }
            
            const isValidPassword = await User.verifyPassword(password, user.password);
            
            if (!isValidPassword) {
                req.session.error = 'Invalid email or password';
                return res.redirect('/login');
            }

            // Set user session with correct field names
            req.session.userId = user.user_id;
            req.session.userEmail = user.email;
            req.session.userName = user.name;
            req.session.isAdmin = user.is_admin;
            
            res.redirect('/');
        } catch (error) {
            console.error(error);
            req.session.error = 'An error occurred during login';
            res.redirect('/login');
        }
    }

    static async register(req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            
            if (password !== confirmPassword) {
                req.session.error = 'Passwords do not match';
                return res.redirect('/register');
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                req.session.error = 'Email already registered';
                return res.redirect('/register');
            }

            await User.create({ name, email, password });
            req.session.success = 'Registration successful! Please login.';
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            req.session.error = 'An error occurred during registration';
            res.redirect('/register');
        }
    }

    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/login');
        });
    }
}

module.exports = authController; 