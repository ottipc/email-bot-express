const Email = require('../models/emailModel');
const { generateChatGPTReply } = require('../services/openaiService');


const getEmails = async (req, res) => {
    try {
        const emails = await Email.find(); // Alle E-Mails abrufen
        res.status(200).json({
            success: true,
            data: emails,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not fetch emails",
            error: error.message,
        });
    }
};


const deleteEmail = async (req, res) => {
    try {
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

        const replyBody = await generateChatGPTReply(subject, body);

        const email = new Email({
            subject,
            body,
            sender,
            replySubject: `Re: ${subject}`,
            replyBody,
        });
        await email.save();

        res.status(200).json({
            reply_subject: email.replySubject,
            reply_body: email.replyBody,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = { generateEmailReply, getEmails, deleteEmail };
