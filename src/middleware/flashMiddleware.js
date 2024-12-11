const flashMiddleware = (req, res, next) => {
    // Get flash messages from cookies
    res.locals.error = req.cookies.error;
    res.locals.success = req.cookies.success;

    // Clear flash messages
    res.clearCookie('error');
    res.clearCookie('success');

    // Add flash helper method
    res.flash = (type, message) => {
        res.cookie(type, message, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
    };

    next();
};

module.exports = flashMiddleware; 