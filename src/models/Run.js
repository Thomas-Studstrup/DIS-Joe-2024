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
                `SELECT r.registration_id, r.status, r.registered_at as registration_date,
                        u.name as user_name, ru.run_name
                 FROM Registrations r
                 JOIN Users u ON r.user_id = u.user_id
                 JOIN Runs ru ON r.run_id = ru.run_id
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
        try {
            const [result] = await db.promise().query(
                'INSERT INTO Registrations (user_id, run_id, status, registered_at) VALUES (?, ?, ?, NOW())',
                [userId, runId, 'PENDING']
            );
            return result.insertId;
        } catch (error) {
            // Check if it's a duplicate registration
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('You are already registered for this run');
            }
            throw new Error(`Error registering for run: ${error.message}`);
        }
    }
}

module.exports = Run; 