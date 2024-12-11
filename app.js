require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');
const authRoutes = require('./src/routes/authRoutes');
const runRoutes = require('./src/routes/runRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { requireAuth, requireAdmin, optionalAuth } = require('./src/middleware/authMiddleware');
const Run = require('./src/models/Run');
const JWTUtil = require('./src/utils/jwt');
const flashMiddleware = require('./src/middleware/flashMiddleware');

app.use(cors());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flashMiddleware);

// Make user data and current path available to all views
app.use((req, res, next) => {
    const token = req.cookies.token;
    const user = token ? JWTUtil.verifyToken(token) : null;
    
    res.locals.user = user;
    res.locals.path = req.path;
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views')); 

// Public home route (no auth required) - MUST be before other routes
app.get('/', async (req, res) => {
    try {
        const upcomingRuns = await Run.getUpcomingRuns();
        
        // Get flash messages
        const error = req.cookies.error;
        const success = req.cookies.success;
        
        // Clear flash messages before rendering
        res.clearCookie('error');
        res.clearCookie('success');

        // Render the page
        res.render('index', { 
            upcomingRuns,
            error,
            success
        });
    } catch (error) {
        console.error(error);
        res.render('index', { 
            upcomingRuns: [],
            error: null,
            success: null
        });
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