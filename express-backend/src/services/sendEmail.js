const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls : {
            rejectUnauthorized: false // Allow insecure certificates (optional, for testing only)
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email successfully sent to:', to);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Email could not be sent.');
    }
}

module.exports = sendEmail;