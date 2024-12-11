/*En flashbesked er en midlertidig besked, der sendes fra serveren til klienten for at informere brugeren om noget, der netop er sket*/

const flashMiddleware = (req, res, next) => {
    // Hent flash-beskeder fra cookies og gør dem tilgængelige for views
    res.locals.error = req.cookies.error;
    res.locals.success = req.cookies.success;

    // Ryd flash-beskeder fra cookies, så de ikke vises igen
    res.clearCookie('error');
    res.clearCookie('success');

    // Tilføj en helper-metode til at sætte nye flash-beskeder
    res.flash = (type, message) => {
        res.cookie(type, message, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
    };

    next();
};

module.exports = flashMiddleware; 