const path = require('path');
require('dotenv').config({
    path: path.resolve(
        __dirname,
        "..",
        `.env.${process.env.NODE_ENV || 'development'}`
    ),
});

console.log("Loaded ENV File:", `${process.env.NODE_ENV || 'development'}`);

// Überprüfe wichtige Variablen und werfe Fehler, wenn sie fehlen
if (!process.env.MONGODB_URI) {
    console.error("ERROR: MONGODB_URI is not defined in the environment file (loadConfig.js).");
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error("ERROR: JWT_SECRET is not defined in the environment file (loadConfig.js).");
    process.exit(1);
}

// Alle Variablen in einem Objekt exportieren
const config = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    IMAP_SERVER: process.env.IMAP_SERVER,
    SMTP_SERVER: process.env.SMTP_SERVER,
    PORT: process.env.SMTP_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    APP_NAME: process.env.APP_NAME || 'Default App',
    NODE_ENV: process.env.NODE_ENV || 'development',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
module.exports = config;
