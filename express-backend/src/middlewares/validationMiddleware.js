const { body, validationResult } = require("express-validator");

// Validierung der E-Mail-Eingabedaten
const validateEmailInput = [
    body("subject").notEmpty().withMessage("Betreff ist erforderlich"),
    body("body").notEmpty().withMessage("E-Mail-Inhalt ist erforderlich"),
    body("sender").isEmail().withMessage("Eine gültige Absenderadresse ist erforderlich"),
];

// Middleware zur Fehlerüberprüfung
const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    next();
};

module.exports = { validateEmailInput, validationMiddleware };
