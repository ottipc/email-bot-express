// src/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { validateEmailInput, validationMiddleware } = require('../middlewares/validationMiddleware');
const { generateEmailReply } = require('../controllers/emailController');  // Verweise auf den Controller
const emailController = require('../controllers/emailController');
const mongoose = require("mongoose");
const { toggleAutomaticResponse, isLAutomaticResponseActive} = require("../listener/emaiListener");
const { loadAutomaticResponseState } = require("../listener/emaiListener");
const {getPrompt, updatePrompt} = require("../services/promptService");
const Prompt = require("../models/PromptModel");
const authMiddleware = require('../middlewares/authMiddleware');
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
router.get("/automaticresponse/state", async (req, res) => {
    console.debug("In get automaticresponse state (emailRoutes.js)");
    try {
        console.log("Fetching automatic response state...");
        const state = await loadAutomaticResponseState(); // Hole den aktuellen Zustand
        console.log("Current automatic response (emailRoutes.js):", state);
        res.status(200).json({ success: true, value: state });
    } catch (error) {
        console.error("Error fetching automatic response state (emailRoutes.js) :", error.message);
        res.status(500).json({ success: false, message: "Could not fetch automatic response state" });
    }
});

// Endpunkt: Listener aktivieren/deaktivieren
router.post("/automaticresponse/toggle", async (req, res) => {
    try {
        console.debug("In toggling automaticr esponse state (emailRoutes.js)");
        const { value } = req.body;
        console.log("state in toggle automaticr esponse state (emailRoutes.js) : " + value);
        toggleAutomaticResponse(value); // Aktualisiere den Zustand
        res.status(200).json({
            success: true,
            message: `Automatic Response is now ${value ? "active" : "inactive"}`,
        });
    } catch (error) {
        console.error("Error toggling automatic response state:", error.message);
        res.status(500).json({ success: false, message: "Could not toggle automatic response state" });
    }
});

/* @swagger
* /api/email/prompt:
*   get:
*     summary: Toggle the application status
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               object:
*                 description: prompt and signature
*     responses:
*       200:
*         description: Fetched Prompt and Signature succesfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*/
router.get("/prompt", async (req, res) => {
    try {
        const prompt = await Prompt.findOne();
        if (!prompt) {
            return res.status(404).json({ error: "Prompt not found." });
        }
        res.json({ prompt: prompt.value, signature: prompt.signature });
    } catch (error) {
        console.error("Error fetching prompt and signature:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Prompt und Signatur speichern oder aktualisieren
router.post("/prompt", async (req, res) => {
    try {
        const { prompt, signature } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        let existingPrompt = await Prompt.findOne();
        if (!existingPrompt) {
            existingPrompt = new Prompt({ value: prompt, signature }); // Neuer Eintrag
        } else {
            existingPrompt.value = prompt;
            existingPrompt.signature = signature || existingPrompt.signature; // Aktualisiere nur, wenn Signatur vorhanden
        }

        await existingPrompt.save();
        res.json({ message: "Prompt and signature updated successfully." });
    } catch (error) {
        console.error("Error updating prompt and signature:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
