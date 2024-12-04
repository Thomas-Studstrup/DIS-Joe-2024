const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require('express-session');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const runRoutes = require('./src/routes/runRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { requireAuth, requireAdmin, optionalAuth } = require('./src/middleware/authMiddleware');
const Run = require('./src/models/Run');

app.use(cors());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Make user data and current path available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? {
        id: req.session.userId,
        email: req.session.userEmail,
        name: req.session.userName,
        isAdmin: req.session.isAdmin
    } : null;
    res.locals.path = req.path;
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views')); 

// Public home route (no auth required) - MUST be before other routes
app.get('/', async (req, res) => {
    try {
        const upcomingRuns = await Run.getUpcomingRuns();
        res.render('index', { 
            upcomingRuns,
            error: req.session.error,
            success: req.session.success 
        });
        
        // Clear flash messages
        delete req.session.error;
        delete req.session.success;
    } catch (error) {
        console.error(error);
        res.render('index', { upcomingRuns: [] });
    }
});

// Routes - after the home route
app.use('/', authRoutes);
app.use('/', runRoutes);
app.use('/', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});