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
            rejectUnauthorized: false // Unsichere Zertifikate zulassen (optional, nur für Tests)
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
        console.log('E-Mail erfolgreich gesendet an:', to);
    } catch (error) {
        console.error('Fehler beim Senden der E-Mail:', error.message);
        throw new Error('E-Mail konnte nicht gesendet werden.');
    }
}

module.exports = sendEmail;