const {app} = require('./src/app'); // App importieren
const PORT = process.env.PORT || 8000;
const authMiddleware = require('./src/middlewares/authMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const applicationRoutes = require("./src/routes/applicationRoutes");
const { swaggerUi, swaggerSpec } = require("./swaggerConfig");
console.log("Loading server.js...")

require('./src/listener/emaiListener');
console.log("Loaded ENV File (app.js):", `.env.${process.env.NODE_ENV || 'development'}`);

// Beispiel: Zugriff auf Umgebungsvariablen
console.log('Environment (server.js):', process.env.NODE_ENV);
console.log('MongoDB URI (server.js):', process.env.MONGODB_URI);
console.log("Email User (server.js): ", process.env.EMAIL_USER);
console.log("IMAP Server (server.js): ", process.env.IMAP_SERVER);


// Swagger-Documentation
if (process.env.NODE_ENV === "development") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
// Auth Rouths
app.use('/api/auth', authRoutes);
app.use("/api/application", applicationRoutes);




// Geschützter Endpunkt
app.get('/api/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: `Welcome, ${req.user.username}` });
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
