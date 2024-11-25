// src/models/listenerModel.js
const mongoose = require("mongoose");

const listenerSchema = new mongoose.Schema({
    isActive: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("Listener", listenerSchema);
