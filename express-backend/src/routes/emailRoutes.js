// src/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { validateEmailInput, validationMiddleware } = require('../middlewares/validationMiddleware');
const { generateEmailReply } = require('../controllers/emailController');  // Verweise auf den Controller
const emailController = require('../controllers/emailController');
const mongoose = require("mongoose");


console.log(validateEmailInput);    // Soll eine Funktion ausgeben
console.log(validationMiddleware); // Soll eine Funktion ausgeben
console.log(generateEmailReply);    // Soll eine Funktion ausgeben

//Database Connection
mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });


router.post('/generate-email-reply', validateEmailInput, validationMiddleware, generateEmailReply);
router.get('/emails', emailController.getEmails);
router.delete('/email/:id', emailController.deleteEmail);
module.exports = router;
