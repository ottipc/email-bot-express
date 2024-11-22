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

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());


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
app.use('/api/email', emailRoutes);
console.log(errorMiddleware)
// Error Handling Middleware
app.use(errorMiddleware);

// Server starten
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;