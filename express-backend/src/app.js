console.log("Loading app.js...")
const config = require('./loadConfig');
const dbConfig = require('./models/configModel'); // Pa
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const emailRoutes = require('./routes/emailRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const app = express();
//const mongoose = require("mongoose");
// Middlewar
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
const { loadAutomaticResponseState } = require("./listener/emaiListener");
const {connect} = require("mongoose");
const MongoClient = require("mongodb").MongoClient;


const mongodbUri = config.MONGODB_URI; // Überprüfe, ob die Variable geladen wird
if (!mongodbUri) {
    console.error("MONGODB_URI ist nicht definiert. Überprüfe deine .env-Datei.");
    process.exit(1);
}
async function initDatabase() {
    const uri = config.MONGODB_URI || "mongodb://localhost:27017/email-bot-express";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("email-bot-express");

        // Insert default prompt if not exists
        const prompts = db.collection("prompts");
        if (!(await prompts.findOne({ type: "default" }))) {
            await prompts.insertOne({
                type: "default",
                value: 'You are a professional email assistant. Your job is to:\n' +
                    '-Analyze the following email and understand the context and the request.\n' +
                    '-The Response has to be in the same language as the original Email.\n' +
                    '-The Greeting at the end has to be in the same language as the original Email\n' +
                    '-Write a professional response that addresses the request precisely, friendly and individually.\n' +
                    'The response must not give any indication that it was automatically generated.\n' +
                    '- Automatically adapt the salutation to the name and polite form of the original email\n' +
                    "(e.g. 'Dear Mr. [Name]', 'Dear Ms. [Name]' or 'Hello [First Name]', depending on the tone of the original email).\n" +
                    '-Do not insert any Name after the greeting, because the Name is in the signature but insert a comma after the greeting at the end! That is important\n' +
                    "- If no name is given, start with 'Good day'(of course in original language of the original email, this is very important!).\n" +
                    '- Nothing may be changed or omitted from the signature. Use exactly the following signature (only the language have to be adjusted):',
                signature: 'Ottavio Braun\nSenior Dev Guy, PM\nKaiser-Friedrich-Straße 8\n10535 Berlin'

            });
        }

        // Insert default automatic response if not exists
        const Config = db.collection("configs");
        if (!(await Config.findOne({ name: "default-configs" }))) {
            await Config.insertOne({
                type: "default",
                name: "default-configs",
                description: "Config data",
                isActive: false
            });
        }

        // Insert default signature if not exists
        /*const configs = db.collection("configs");
        if (!(await configs.findOne({ name: "default-config" }))) {
            await configs.insertOne({
                type: "default",
                name: "default-config",
                key: "isAutomaticResponseActive",
                value: false
            });
        }*/
    } finally {
        await client.close();
    }
}

initDatabase().catch(console.error);



//Database Connection
connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });

async function initializeApplicationState() {
    try {
        // Überprüfe, ob `isApplicationEnabled` existiert
        const existingConfig = await dbConfig.findOne({ key: 'isApplicationEnabled' });
        if (!existingConfig) {
            // Falls nicht vorhanden, erstelle den Eintrag mit dem Standardwert
            await dbConfig.create({ key: 'isApplicationEnabled', value: false }); // Standardwert: false
            console.log("Initialized 'isApplicationEnabled' to false.");
        } else {
            console.log("'isApplicationEnabled' already exists:", existingConfig.value);
        }
    } catch (err) {
        console.error("Error initializing application state:", err.message);
    }
}


async function initializeAutomaticResponseState() {
    try {
        // Prüfen, ob der Eintrag bereits existiert
        const existingConfig = await Config.findOne({ key: 'automaticResponseState' });
        if (!existingConfig) {
            // Wenn nicht vorhanden, Standardwert setzen
            await Config.create({ key: 'automaticResponseState', value: false }); // Standardwert: false
            console.log("Initialized 'automaticResponseState' to false.");
        } else {
            console.log("'automaticResponseState' already exists:", existingConfig.value);
        }
    } catch (err) {
        console.error("Error initializing automatic response state:", err.message);
    }
}

// Rufe die Initialisierungsfunktion beim Serverstart auf
initializeAutomaticResponseState();

// Rufe die Initialisierungsfunktion beim Serverstart auf
initializeApplicationState();

// Lade den Automatic Response-State from Database at Application Start
loadAutomaticResponseState().then(() => {
    console.log("automatic response state initialized.");
});

// Swagger Docs
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Email Bot API',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/*.js'],
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = config.PORT || 3000;


app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api', emailRoutes);
console.log(errorMiddleware)
// Error Handling Middleware
app.use(errorMiddleware);

// Server starten
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = {app, config};