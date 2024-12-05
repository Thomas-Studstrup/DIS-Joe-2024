const nodemailer = require('nodemailer');

class EmailService {
    static transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,  // true for port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    static async sendRegistrationConfirmation(userEmail, runDetails) {
        try {
            await this.transporter.sendMail({
                from: `"Joe's Running Club" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: `Registration Confirmation - ${runDetails.run_name}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #C69AAE;">Registration Confirmation</h1>
                        <p>Thank you for registering for ${runDetails.run_name}!</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h2 style="color: #232323; margin-top: 0;">Event Details:</h2>
                            <p><strong>Date:</strong> ${new Date(runDetails.date_time).toLocaleString()}</p>
                            <p><strong>Location:</strong> ${runDetails.location}</p>
                        </div>
                        <p>We'll send you more information as the event approaches.</p>
                        <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                            Best regards,<br>
                            Joe's Running Club Team
                        </p>
                    </div>
                `
            });
            console.log('Registration confirmation email sent successfully');
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send confirmation email');
        }
    }
}

module.exports = EmailService; 