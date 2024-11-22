const Email = require('../models/emailModel');
const { generateChatGPTReply } = require('../services/openaiService');

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

module.exports = { generateEmailReply };
