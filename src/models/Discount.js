const db = require('../../db');
const EmailService = require('../services/EmailService');

class Discount {
    static async findAll() {
        try {
            const [results] = await db.promise().query(
                `SELECT d.*, r.run_name 
                 FROM Discounts d
                 JOIN Runs r ON d.run_id = r.run_id
                 ORDER BY d.expires_at ASC`
            );
            return results;
        } catch (error) {
            throw new Error(`Error finding discounts: ${error.message}`);
        }
    }

    static async create(discountData) {
        try {
            const [result] = await db.promise().query(
                'INSERT INTO Discounts (code, run_id, expires_at) VALUES (?, ?, ?)',
                [discountData.code, discountData.run_id, discountData.expires_at]
            );
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('This discount code already exists');
            }
            throw new Error(`Error creating discount: ${error.message}`);
        }
    }

    static async delete(discountId) {
        try {
            const [result] = await db.promise().query(
                'DELETE FROM Discounts WHERE discount_id = ?',
                [discountId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting discount: ${error.message}`);
        }
    }

    static async updateUserDiscountStatus(discountId, status) {
        try {
            // Update query to include user email and name
            const [userDiscount] = await db.promise().query(
                `SELECT ud.*, d.code, d.run_id, d.expires_at, u.email, u.name, r.run_name
                 FROM UserDiscounts ud
                 JOIN Discounts d ON ud.discount_id = d.discount_id
                 JOIN Users u ON ud.user_id = u.user_id
                 JOIN Runs r ON d.run_id = r.run_id
                 WHERE d.discount_id = ?`,
                [discountId]
            );

            if (userDiscount.length === 0) {
                throw new Error('User discount not found');
            }

            // Update the status
            await db.promise().query(
                'UPDATE UserDiscounts SET status = ? WHERE discount_id = ?',
                [status, discountId]
            );

            // If status is ACCEPTED, send email with expiration date
            if (status === 'ACCEPTED') {
                await EmailService.sendRegistrationAcceptedEmail(
                    userDiscount[0].email,  // Use the queried user's email
                    userDiscount[0].name,   // Use the queried user's name
                    userDiscount[0].run_name,
                    userDiscount[0].code,
                    userDiscount[0].expires_at
                );
            }

            return true;
        } catch (error) {
            throw new Error(`Error updating discount status: ${error.message}`);
        }
    }
}

module.exports = Discount; 