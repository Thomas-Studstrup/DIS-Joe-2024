const JWTUtil = require('../utils/jwt');

const requireAuth = (req, res, next) => {
    const JWT = req.cookies.token;
    const user = JWTUtil.verifyToken(JWT);

    if (!user) {
        res.cookie('error', 'Please login to access this page');
        return res.redirect('/login');
    }
    
    req.user = user;
    next();
};

const requireAdmin = (req, res, next) => {
    const JWT = req.cookies.token;
    const user = JWTUtil.verifyToken(JWT);

    if (!user || !user.isAdmin) {
        return res.redirect('/');
    }
    
    req.user = user;
    next();
};

const optionalAuth = (req, res, next) => {
    const JWT = req.cookies.token;
    const user = JWTUtil.verifyToken(JWT);
    if (user) {
        req.user = user;
    }
    next();
};

module.exports = { requireAuth, requireAdmin, optionalAuth }; 