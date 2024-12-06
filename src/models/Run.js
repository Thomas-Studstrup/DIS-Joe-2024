const db = require('../../db');

class Run {
    static async findAll() {
        try {
            const [results] = await db.promise().query(
                'SELECT * FROM Runs ORDER BY date_time ASC'
            );
            return results;
        } catch (error) {
            throw new Error(`Error finding runs: ${error.message}`);
        }
    }

    static async findById(runId) {
        try {
            const [results] = await db.promise().query(
                'SELECT * FROM Runs WHERE run_id = ?',
                [runId]
            );
            return results[0];
        } catch (error) {
            throw new Error(`Error finding run: ${error.message}`);
        }
    }

    static async create(runData) {
        try {
            const [result] = await db.promise().query(
                'INSERT INTO Runs (run_name, location, date_time) VALUES (?, ?, ?)',
                [runData.run_name, runData.location, runData.date_time]
            );
            return result.insertId;
        } catch (error) {
            throw new Error(`Error creating run: ${error.message}`);
        }
    }

    static async getRecentRegistrations() {
        try {
            const [results] = await db.promise().query(
                `SELECT 
                    r.registration_id, 
                    r.registered_at as registration_date,
                    u.name as user_name, 
                    u.email as user_email,
                    u.user_id,
                    ru.run_name,
                    ru.run_id,
                    d.code as discount_code,
                    d.discount_id,
                    ud.status as discount_status
                 FROM Registrations r
                 JOIN Users u ON r.user_id = u.user_id
                 JOIN Runs ru ON r.run_id = ru.run_id
                 LEFT JOIN Discounts d ON d.run_id = ru.run_id
                 LEFT JOIN UserDiscounts ud ON ud.discount_id = d.discount_id 
                    AND ud.user_id = u.user_id
                 ORDER BY r.registered_at DESC
                 LIMIT 10`
            );
            return results;
        } catch (error) {
            throw new Error(`Error getting recent registrations: ${error.message}`);
        }
    }

    static async getUpcomingRuns(limit = 3) {
        try {
            const [results] = await db.promise().query(
                `SELECT * FROM Runs 
                 WHERE date_time > NOW() 
                 ORDER BY date_time ASC 
                 LIMIT ?`,
                [limit]
            );
            return results;
        } catch (error) {
            throw new Error(`Error getting upcoming runs: ${error.message}`);
        }
    }

    static async registerUser(userId, runId) {
        const connection = await db.promise();
        try {
            // Check for existing registration first
            const [existingReg] = await connection.query(
                'SELECT registration_id FROM Registrations WHERE user_id = ? AND run_id = ?',
                [userId, runId]
            );

            if (existingReg.length > 0) {
                throw new Error('You are already registered for this run');
            }

            // Start transaction
            await connection.beginTransaction();

            // Create registration
            const [registrationResult] = await connection.query(
                'INSERT INTO Registrations (user_id, run_id, registered_at) VALUES (?, ?, NOW())',
                [userId, runId]
            );

            // Get or create the run's discount
            const [existingDiscount] = await connection.query(
                'SELECT discount_id FROM Discounts WHERE run_id = ? LIMIT 1',
                [runId]
            );

            let discountId;
            if (existingDiscount.length === 0) {
                // Create a new discount for the run if none exists
                const [discountResult] = await connection.query(
                    'INSERT INTO Discounts (code, run_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 3 MONTH))',
                    [`RUN${runId}${Math.random().toString(36).substring(2, 6)}`.toUpperCase(), runId]
                );
                discountId = discountResult.insertId;
            } else {
                discountId = existingDiscount[0].discount_id;
            }

            // Create UserDiscount with PENDING status
            await connection.query(
                'INSERT INTO UserDiscounts (user_id, discount_id, status) VALUES (?, ?, ?)',
                [userId, discountId, 'PENDING']
            );

            // Commit transaction
            await connection.commit();
            return registrationResult.insertId;

        } catch (error) {
            // Rollback on error
            await connection.rollback();
            throw new Error(`Error registering for run: ${error.message}`);
        }
    }

    static async delete(runId) {
        try {
            const [result] = await db.promise().query(
                'DELETE FROM Runs WHERE run_id = ?',
                [runId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting run: ${error.message}`);
        }
    }

    static async update(runId, runData) {
        try {
            const [result] = await db.promise().query(
                'UPDATE Runs SET run_name = ?, location = ?, date_time = ? WHERE run_id = ?',
                [runData.run_name, runData.location, runData.date_time, runId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating run: ${error.message}`);
        }
    }

    static async acceptRegistration(registrationId) {
        try {
            // First update the status
            const [updateResult] = await db.promise().query(
                'UPDATE Registrations SET status = ? WHERE registration_id = ?',
                ['ACCEPTED', registrationId]
            );
            
            if (updateResult.affectedRows === 0) {
                throw new Error('Registration not found');
            }
            
            // Get complete registration details
            const [registrationDetails] = await db.promise().query(
                `SELECT 
                    r.registration_id,
                    r.status,
                    r.user_id,
                    r.run_id,
                    u.email as user_email,
                    u.name as user_name,
                    ru.run_name
                 FROM Registrations r
                 JOIN Users u ON r.user_id = u.user_id
                 JOIN Runs ru ON r.run_id = ru.run_id
                 WHERE r.registration_id = ?`,
                [registrationId]
            );
            
            if (registrationDetails.length === 0) {
                throw new Error('Registration details not found');
            }
            
            return registrationDetails[0];
        } catch (error) {
            console.error('Error in acceptRegistration:', error);
            throw new Error(`Error accepting registration: ${error.message}`);
        }
    }
}

module.exports = Run; 