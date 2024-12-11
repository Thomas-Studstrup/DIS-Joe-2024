const User = require('../models/User');
const JWTUtil = require('../utils/jwt');

class authController {
    static async showLogin(req, res) {
        const error = req.cookies.error;
        res.clearCookie('error');
        res.render('login', { error });
    }

    static async showRegister(req, res) {
        const error = req.cookies.error;
        res.clearCookie('error');
        res.render('register', { error });
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            
            if (!user) {
                res.cookie('error', 'Invalid email or password');
                return res.redirect('/login');
            }
            
            const isValidPassword = await User.verifyPassword(password, user.password);
            
            if (!isValidPassword) {
                res.cookie('error', 'Invalid email or password');
                return res.redirect('/login');
            }

            // Generate JWT token
            const JWT = JWTUtil.generateToken(user);
            
            // Set token in cookie
            res.cookie('JWT', JWT, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.cookie('error', 'An error occurred during login');
            res.redirect('/login');
        }
    }

    static async register(req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            
            if (password !== confirmPassword) {
                res.cookie('error', 'Passwords do not match');
                return res.redirect('/register');
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                res.cookie('error', 'Email already registered');
                return res.redirect('/register');
            }

            const user = await User.create({ name, email, password });
            res.cookie('success', 'Registration successful! Please login.');
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.cookie('error', 'An error occurred during registration');
            res.redirect('/register');
        }
    }

    static async logout(req, res) {
        res.clearCookie('JWT');
        res.redirect('/login');
    }
}

module.exports = authController; 