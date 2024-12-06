const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        host: config.SMTP_SERVER,
        port: config.SMTP_PORT,
        secure: false,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASSWORD,
        },
        tls : {
            rejectUnauthorized: false // Allow insecure certificates (optional, for testing only)
        }
    });

    const mailOptions = {
        from: config.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email successfully sent to:', to);
        alert('Email successfully sent to:', to);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Email could not be sent.');
    }
}

module.exports = sendEmail;