// src/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { validateEmailInput, validationMiddleware } = require('../middlewares/validationMiddleware');
const { generateEmailReply } = require('../controllers/emailController');  // Verweise auf den Controller
const emailController = require('../controllers/emailController');
const mongoose = require("mongoose");
const { toggleListener, isListenerActive} = require("../listener/emaiListener");
const { loadListenerState } = require("../listener/emaiListener");

console.log(validateEmailInput);    // Should output a function
console.log(validationMiddleware); // Should output a function
console.log(generateEmailReply);    // Should output a function

//Database Connection
/*
mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });

*/

router.post('/generate-email-reply', validateEmailInput, validationMiddleware, generateEmailReply);
router.get('/email/emails', emailController.getEmails); // curl http://localhost:3000/api/email/emails
router.delete('/email/:id', emailController.deleteEmail);
router.post("/email/manual-reply", emailController.generateManualReply);
router.post("/email/send-reply", emailController.sendGeneratedReply);

// Endpunkt: Listener-Zustand abrufen
router.get("/listener/state", async (req, res) => {
    console.debug("In get listener state (emailRoutes.js)");
    try {
        console.log("Fetching listener state...");
        const state = await loadListenerState(); // Hole den aktuellen Zustand
        console.log("Current listener state (emailRoutes.js):", state);
        res.status(200).json({ success: true, value: state });
    } catch (error) {
        console.error("Error fetching listener state (emailRoutes.js) :", error.message);
        res.status(500).json({ success: false, message: "Could not fetch listener state" });
    }
});

// Endpunkt: Listener aktivieren/deaktivieren
router.post("/listener/toggle", async (req, res) => {
    try {
        console.debug("In toggling listener state (emailRoutes.js)");
        const { value } = req.body;
        console.log("state in toggle listener state (emailRoutes.js) : " + value);
        toggleListener(value); // Aktualisiere den Zustand
        res.status(200).json({
            success: true,
            message: `Listener is now ${value ? "active" : "inactive"}`,
        });
    } catch (error) {
        console.error("Error toggling listener state:", error.message);
        res.status(500).json({ success: false, message: "Could not toggle listener state" });
    }
});
module.exports = router;
