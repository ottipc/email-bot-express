const Email = require('../models/emailModel');
const { generateChatGPTReply } = require('../services/openaiService');


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
        console.log("Deleting email from database with id : " + req.params.id);
        const email = await Email.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Email deleted successfully",
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
        const { subject, body, sender } = req.body;

        console.log('generateEmailReply aufgerufen mit:', { subject, body, sender });

        // Antwort mit ChatGPT generieren
        const replyBody = await generateChatGPTReply(subject, body);

        // Neue E-Mail speichern
        const email = new Email({
            subject,
            body,
            sender,
            replySubject: `Re: ${subject}`,
            replyBody,
        });
        await email.save();

        console.log('E-Mail erfolgreich gespeichert:', email);

        // Antwort senden
        res.status(200).json({
            reply_subject: email.replySubject,
            reply_body: email.replyBody,
        });
    } catch (error) {
        console.error('Fehler in generateEmailReply:', error.message);
        next(error);
    };

};

module.exports = { generateEmailReply, getEmails, deleteEmail };
