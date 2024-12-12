require('dotenv').config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Ruter
const authRoutes = require('./src/routes/authRoutes');
const runRoutes = require('./src/routes/runRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Middleware
const { requireAuth, requireAdmin, optionalAuth } = require('./src/middleware/authMiddleware');

app.use((req, res, next) => {
    console.log(`Request handled by: ${process.env.SERVER_NAME}`);
    next();
});

// JWT-værktøj og model
const JWTUtil = require('./src/utils/jwt');
const Run = require('./src/models/Run');
const flashMiddleware = require('./src/middleware/flashMiddleware');

// Aktiverer middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flashMiddleware);

// Gør brugerdata og aktuelle sti tilgængelig for alle views
app.use((req, res, next) => {
    const token = req.cookies.JWT;  // Hent JWT fra cookies
    const user = token ? JWTUtil.verifyToken(token) : null; // Verificér JWT, hvis den findes
    
    res.locals.user = user; // Gør brugerdata tilgængelig i views
    res.locals.path = req.path;  // Gør den aktuelle sti tilgængelig i views
    next();  // Fortsætter til næste middleware
});

// Konfigurer views
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'src', 'views')); 

// Hjemmerute (ingen autentificering påkrævet)
app.get('/', async (req, res) => {
    try {
        const upcomingRuns = await Run.getUpcomingRuns();
        
        // Henter og rydder flashbeskeder
        const error = req.cookies.error;
        const success = req.cookies.success;
        res.clearCookie('error');
        res.clearCookie('success');

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

// Tilføjer ruter til applikationen
app.use('/', authRoutes);
app.use('/', runRoutes);
app.use('/', adminRoutes);

// Make sure the server listens on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});