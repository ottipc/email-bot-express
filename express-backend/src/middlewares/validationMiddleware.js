// src/middlewares/validationMiddleware.js
const validateEmailInput = (req, res, next) => {
    const { subject, body, sender } = req.body;
    if (!subject || !body || !sender) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    next(); // Wenn alles in Ordnung, zum nächsten Middleware oder Controller weitergehen
};

const validationMiddleware = (req, res, next) => {
    // Weitere Validierungen können hier hinzugefügt werden
    next();
};

module.exports = { validateEmailInput, validationMiddleware };
