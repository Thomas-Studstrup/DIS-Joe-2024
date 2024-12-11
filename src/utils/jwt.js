const jwt = require('jsonwebtoken');

const JWTUtil = {
    // Genererer en JWT-token med brugerdata
    generateToken(user) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        
        return jwt.sign(
            { 
                id: user.user_id,
                email: user.email,
                name: user.name,
                isAdmin: user.is_admin 
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    },

    // Verificerer en JWT-token og returnerer dekodet data eller null ved fejl
    verifyToken(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        if (!token) {
            return null;
        }

        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error('JWT verification error:', error.message);
            return null;
        }
    }
};

module.exports = JWTUtil; 