const db = require('../../db');
const EmailService = require('../services/EmailService');

class Discount {
    // Henter alle rabatkoder, inklusiv tilknyttede løbsdata
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

    // Opretter en ny rabatkode i databasen
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

    // Sletter en rabatkode baseret på dens ID
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

    // Opdaterer status for en brugers rabatkode
    static async updateUserDiscountStatus(discountId, status) {
        try {
            // Hent data om brugerrabat, rabatkode og tilknyttet bruger og løb
            const [userDiscount] = await db.promise().query(
                `SELECT ud.*, d.code, d.run_id, d.expires_at, u.email, u.name, r.run_name
                 FROM UserDiscounts ud
                 JOIN Discounts d ON ud.discount_id = d.discount_id
                 JOIN Users u ON ud.user_id = u.user_id
                 JOIN Runs r ON d.run_id = r.run_id
                 WHERE ud.user_discount_id = ?`,
                [discountId]
            );

            if (userDiscount.length === 0) {
                throw new Error('User discount not found');
            }

            // Opdater status for brugerrabat ud fra brugerID
            await db.promise().query(
                'UPDATE UserDiscounts SET status = ? WHERE user_discount_id = ?',
                [status, discountId]
            );

            // Send en e-mail, hvis rabatten er accepteret
            if (status === 'ACCEPTED') {
                await EmailService.sendRegistrationAcceptedEmail(
                    userDiscount[0].email,
                    userDiscount[0].name,
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