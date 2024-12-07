const db = require('../../db');
const bcrypt = require('bcrypt') || require('bcryptjs');

class User {
    static async findByEmail(email) {
        try {
            const [results] = await db.promise().query(
                'SELECT user_id, email, name, password, is_admin FROM Users WHERE email = ?', 
                [email]
            );
            return results[0];
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    static async findById(userId) {
        try {
            const [results] = await db.promise().query(
                'SELECT user_id, email, name, is_admin FROM Users WHERE user_id = ?', 
                [userId]
            );
            return results[0];
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }

    static async create(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            const user = {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                is_admin: false
            };

            const [result] = await db.promise().query(
                'INSERT INTO Users SET ?', 
                user
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Email already exists');
            }
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error('Error verifying password');
        }
    }

    static async login(email, password) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isValid = await this.verifyPassword(password, user.password);
            if (!isValid) {
                throw new Error('Invalid credentials');
            }

            const { password: _, ...userData } = user;
            return userData;
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    static async getUserRuns(userId) {
        try {
            const [results] = await db.promise().query(
                `SELECT 
                    r.registration_id,
                    r.registered_at,
                    ru.run_name,
                    ru.location,
                    ru.date_time,
                    d.code as discount_code,
                    CASE 
                        WHEN ud.status IS NULL THEN 'REGISTERED'
                        ELSE ud.status 
                    END as discount_status
                 FROM Registrations r
                 JOIN Runs ru ON r.run_id = ru.run_id
                 LEFT JOIN Discounts d ON d.run_id = ru.run_id
                 LEFT JOIN UserDiscounts ud ON ud.discount_id = d.discount_id 
                    AND ud.user_id = r.user_id
                 WHERE r.user_id = ?
                 ORDER BY ru.date_time DESC`,
                [userId]
            );
            return results;
        } catch (error) {
            throw new Error(`Error getting user runs: ${error.message}`);
        }
    }

    static async getUserDiscounts(userId) {
        try {
            const [results] = await db.promise().query(
                'SELECT * FROM Discounts WHERE user_id = ? AND expires_at > NOW()',
                [userId]
            );
            return results;
        } catch (error) {
            throw new Error(`Error getting user discounts: ${error.message}`);
        }
    }

    static async getRegistrationStatus(userId, runId) {
        try {
            const [results] = await db.promise().query(
                `SELECT 
                    CASE 
                        WHEN ud.status IS NULL THEN 'REGISTERED'
                        ELSE ud.status 
                    END as discount_status
                 FROM Registrations r
                 JOIN Runs ru ON r.run_id = ru.run_id
                 LEFT JOIN Discounts d ON d.run_id = ru.run_id
                 LEFT JOIN UserDiscounts ud ON ud.discount_id = d.discount_id 
                    AND ud.user_id = r.user_id
                 WHERE r.user_id = ? AND r.run_id = ?`,
                [userId, runId]
            );
            return results[0]?.discount_status || null;
        } catch (error) {
            throw new Error(`Error getting registration status: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const [results] = await db.promise().query(
                'SELECT user_id, name, email, is_admin FROM Users'
            );
            return results;
        } catch (error) {
            throw new Error(`Error finding users: ${error.message}`);
        }
    }
}

module.exports = User; 