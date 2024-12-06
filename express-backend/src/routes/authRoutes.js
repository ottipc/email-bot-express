const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const router = express.Router();
require('dotenv').config();

// Benutzer registrieren
router.post('/register', async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Logge die Anfrage
        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error("Username and password are required");
        }

        // Beispiel für die Benutzererstellung
        const newUser = await User.create({ username, password });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error in /register:", error.message); // Fehler loggen
        res.status(500).json({ message: "Internal Server Error : " + req.body, error: error.message });
    }
});

// Benutzer anmelden
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Benutzer finden
        const user = await User.findOne({ username });
        console.debug("Found User at Login:", user);

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Passwort vergleichen
        const isMatch = await user.comparePassword(password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Token generieren
        const payload = { id: user._id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
