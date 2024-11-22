// src/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { validateEmailInput, validationMiddleware } = require('../middlewares/validationMiddleware');
const { generateEmailReply } = require('../controllers/emailController');  // Verweise auf den Controller


console.log(validateEmailInput);    // Soll eine Funktion ausgeben
console.log(validationMiddleware); // Soll eine Funktion ausgeben
console.log(generateEmailReply);    // Soll eine Funktion ausgeben

router.post('/generate-email-reply', validateEmailInput, validationMiddleware, generateEmailReply);
router.get('/emails', emailController.getEmails);
router.delete('/email/:id', emailController.deleteEmail);
module.exports = router;
