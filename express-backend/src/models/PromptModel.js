// PromptModel.js
const mongoose = require("mongoose");

// Schema für den Prompt
const promptSchema = new mongoose.Schema({
    value: {
        type: String,       // Der Prompt-Text
        required: true,     // Pflichtfeld
    },
    createdAt: {
        type: Date,         // Erstellungsdatum
        default: Date.now,  // Standardwert: aktuelles Datum
    },
    updatedAt: {
        type: Date,         // Aktualisierungsdatum
        default: Date.now,  // Standardwert: aktuelles Datum
    },
    signature: { type: String, required: false }, // Signatur (optional)
});

// Middleware: Aktualisiere "updatedAt" automatisch
promptSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Exportiere das Mongoose-Modell
module.exports = mongoose.model("Prompt", promptSchema);
