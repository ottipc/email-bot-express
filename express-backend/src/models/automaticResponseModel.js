// src/models/automaticResponseModel.js
const mongoose = require("mongoose");

const automaticResponseSchema = new mongoose.Schema({
    isActive: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("automatic_response", automaticResponseSchema);
