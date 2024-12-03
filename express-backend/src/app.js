require('dotenv').config();
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
// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
const { loadListenerState } = require("./listener/emaiListener");
const {connect} = require("mongoose");

const MongoClient = require("mongodb").MongoClient;

async function initDatabase() {
    const uri = process.env.MONGODB_URI || "mongodb://admin:securepassword@database:27017/email-bot-express";
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

        // Insert default listener if not exists
        const listeners = db.collection("listeners");
        if (!(await listeners.findOne({ name: "default-listener" }))) {
            await listeners.insertOne({
                type: "default",
                name: "default-listener",
                description: "Respond automatically",
                isActive: false
            });
        }

        // Insert default signature if not exists
        const configs = db.collection("configs");
        if (!(await configs.findOne({ name: "default-config" }))) {
            await configs.insertOne({
                type: "default",
                name: "default-config",
                key: "isListenerActive",
                value: false
            });
        }
    } finally {
        await client.close();
    }
}

initDatabase().catch(console.error);



//Database Connection
connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });



// Lade den Listener-Zustand aus der Datenbank beim Start
loadListenerState().then(() => {
    console.log("Listener state initialized.");
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
const PORT = process.env.PORT || 3000;


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

module.exports = app;