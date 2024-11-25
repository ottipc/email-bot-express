const Email = require('../models/emailModel');
const { generateChatGPTReply } = require('../services/openaiService');
const { sendMail } = require('../services/sendEmail');


const getEmails = async (req, res) => {
    try {
        console.log("Fetching emails from database...");
        const emails = await Email.find(); // Alle E-Mails abrufen
        console.log("Emails fetched successfully:", emails);
        res.status(200).json({
            success: true,
            data: emails,
        });
    } catch (error) {
        console.error("Error fetching emails:", error.message);
        res.status(500).json({
            success: false,
            message: "Could not fetch emails",
            error: error.message,
        });
    }
};


const deleteEmail = async (req, res) => {
    try {
        console.log("Deleting email from database with id:", req.params.id);
        const email = await Email.findByIdAndDelete(req.params.id); // Löscht E-Mail
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Email and reply deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not delete email",
            error: error.message,
        });
    }
};

const generateEmailReply = async (req, res, next) => {
    try {
        const { subject, body, sender, saveToDB, generateReply } = req.body;

        let replyBody = null;

        // Generiere nur eine Antwort, wenn `generateReply` true ist
        if (generateReply) {
            const gptprompt = `${process.env.GPT_PROMPT}\n\n${process.env.EMAIL_SIGNATURE}\n\n` + `Original Mail:\n\n`;
            replyBody = await generateChatGPTReply(gptprompt, subject, body);
        }

        // Speichere die E-Mail in der Datenbank
        if (saveToDB) {
            const email = new Email({
                subject,
                body,
                sender,
                replySubject: generateReply ? `Re: ${subject}` : null,
                replyBody: replyBody,
            });
            await email.save();
            console.log("Email saved to database:", email);
        }

        // Antwort zurückgeben (nur für manuelle Verarbeitung)
        res.status(200).json({
            success: true,
            reply_subject: generateReply ? `Re: ${subject}` : null,
            reply_body: replyBody,
        });
    } catch (error) {
        console.error("Error in generateEmailReply:", error.message);
        next(error);
    }
};

const generateManualReply = async (req, res, next) => {
    try {
        const { emailId } = req.body;

        // Hole die Original-Mail aus der Datenbank
        const email = await Email.findById(emailId);
        if (!email) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        const gptprompt = `${process.env.GPT_PROMPT}\n\n${process.env.EMAIL_SIGNATURE}\n\n` + `Original Mail:\n\n`;
        console.log("Sending to ChatGPT Email : \n + gptprompt")
        const replyBody = await generateChatGPTReply(gptprompt, email.subject, email.body);

        res.status(200).json({ success: true, replyBody }); // `replyBody` sollte korrekt zurückgegeben werden
    } catch (error) {
        console.error("Error in generateManualReply:", error.message);
        next(error);
    }
};


// Sendet eine generierte Antwort und speichert sie
const sendGeneratedReply = async (req, res, next) => {
    try {
        const { emailId, replyBody } = req.body;

        // Hole die Original-Mail aus der Datenbank
        const email = await Email.findById(emailId);
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }

        // Speichere die Antwort in der Datenbank
        email.replyBody = replyBody;
        email.replySubject = `Re: ${email.subject}`;
        await email.save();

        console.log("Reply saved to database:", email);

        // Sende die Antwort per E-Mail
        await sendEmail(email.sender, email.replySubject, replyBody);

        console.log("Reply sent to:", email.sender);

        // Rückmeldung an den Client
        res.status(200).json({
            success: true,
            message: "Reply sent successfully",
        });
    } catch (error) {
        console.error("Error in sendGeneratedReply:", error.message);
        next(error);
    }
};

module.exports = {
    getEmails,
    deleteEmail,
    generateEmailReply,
    generateManualReply,
    sendGeneratedReply,
};