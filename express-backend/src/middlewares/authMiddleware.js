    const jwt = require('jsonwebtoken');
    require('dotenv').config();

    const authMiddleware = (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Access denied, token missing' });
        }

        try {
            const verified = jwt.verify(token.split(' ')[1], config.JWT_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };

    module.exports = authMiddleware;
