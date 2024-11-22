const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sender: { type: String, required: true },
    replySubject: { type: String },
    replyBody: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Email', emailSchema);