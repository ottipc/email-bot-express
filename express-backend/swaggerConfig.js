const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger-Definition
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "My Application API",
        version: "1.0.0",
        description: "API documentation for my application",
    },
    servers: [
        {
            url: "http://localhost:3000", // Basis-URL für die API
        },
    ],
};

// Optionen für swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"], // Dokumentiere die Routen
};

// Swagger-Spezifikation
const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
