const nodemailer = require('nodemailer');

class EmailService {
    static transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    static async sendEmail(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: `"Joe's Running Club" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    static async sendRegistrationConfirmation(userEmail, runDetails) {
        try {
            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #C69AAE;">Registration Confirmation</h1>
                    <p>Thank you for registering for ${runDetails.run_name}!</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="color: #232323; margin-top: 0;">Event Details:</h2>
                        <p><strong>Date:</strong> ${new Date(runDetails.date_time).toLocaleString()}</p>
                        <p><strong>Location:</strong> ${runDetails.location}</p>
                    </div>
                    <p>We are looking forward to seeing you.</p>
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        Best regards,<br>
                        Joe's Running Club Team
                    </p>
                </div>
            `;
            await this.sendEmail(userEmail, `Registration Confirmation - ${runDetails.run_name}`, emailContent);
            console.log('Registration confirmation email sent successfully');
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Failed to send confirmation email');
        }
    }

    static async sendRegistrationAcceptedEmail(userEmail, userName, runName, discountCode, expiresAt) {
        try {
            const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #C69AAE;">Coupon for Joe & The Juice!</h1>
                    <p>Dear ${userName},</p>
                    
                    <p>Great news! Your registration and attendance at <strong>${runName}</strong> have triggered a discount code.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="color: #232323; margin-top: 0;">Your Discount Code</h2>
                        <p style="font-size: 24px; font-weight: bold; color: #C69AAE; text-align: center; 
                                  padding: 10px; background-color: #fff; border-radius: 4px;">
                            ${discountCode}
                        </p>
                        <p style="font-size: 0.9em; color: #666;">
                            This code is valid until ${expirationDate}.
                        </p>
                    </div>
                    
                    <p>Thank's for your support!</p>
                    
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        Best regards,<br>
                        Joe's Running Club Team
                    </p>
                </div>
            `;

            await this.sendEmail(userEmail, 'Registration Accepted!', emailContent);
        } catch (error) {
            console.error('Error sending acceptance email:', error);
            throw error;
        }
    }
}

module.exports = EmailService;