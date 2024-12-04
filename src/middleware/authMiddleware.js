const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        req.session.error = 'Please login to access this page';
        return res.redirect('/login');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.redirect('/');
    }
    next();
};

const optionalAuth = (req, res, next) => {
    next();
};

module.exports = { requireAuth, requireAdmin, optionalAuth }; 