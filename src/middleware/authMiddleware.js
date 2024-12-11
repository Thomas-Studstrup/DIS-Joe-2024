const JWTUtil = require('../utils/jwt');

const requireAuth = (req, res, next) => {
    const token = req.cookies.JWT;
    const user = JWTUtil.verifyToken(token);

    if (!user) {
        res.cookie('error', 'Please login to access this page');
        return res.redirect('/login');
    }
    
    req.user = user;
    next();
};

const requireAdmin = (req, res, next) => {
    const token = req.cookies.JWT;
    const user = JWTUtil.verifyToken(token);

    if (!user || !user.isAdmin) {
        return res.redirect('/');
    }
    
    req.user = user;
    next();
};

const optionalAuth = (req, res, next) => {
    const token = req.cookies.JWT;
    const user = JWTUtil.verifyToken(token);
    if (user) {
        req.user = user;
    }
    next();
};

module.exports = { requireAuth, requireAdmin, optionalAuth }; 