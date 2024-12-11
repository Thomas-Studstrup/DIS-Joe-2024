const JWTUtil = require('../utils/jwt');

// Middleware til at sikre, at brugeren er autentificeret
const requireAuth = (req, res, next) => {
    const token = req.cookies.JWT; // Henter JWT fra cookies
    const user = JWTUtil.verifyToken(token); // Verificerer token og udtrækker brugerdata

    if (!user) {
        // Hvis brugeren ikke er autentificeret, sendes en fejlbesked og omdirigeres til login
        res.cookie('error', 'Please login to access this page');
        return res.redirect('/login');
    }
    
    req.user = user;
    next();
};

// Middleware til at sikre, at brugeren er administrator
const requireAdmin = (req, res, next) => {
    const token = req.cookies.JWT;
    const user = JWTUtil.verifyToken(token);

    if (!user || !user.isAdmin) {
        return res.redirect('/');
    }
    
    req.user = user;
    next();
};

// brugeren har mulighed for at være enten autentificeret (logget ind) eller ikke autentificeret (ikke logget ind)
const optionalAuth = (req, res, next) => {
    const token = req.cookies.JWT;
    const user = JWTUtil.verifyToken(token);
    if (user) {
        req.user = user;
    }
    next();
};

module.exports = { requireAuth, requireAdmin, optionalAuth }; 