
require('./src/listener/emaiListener');
const app = require('./src/app'); // App importieren
const PORT = process.env.PORT || 3000;
const authMiddleware = require('./src/middlewares/authMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const applicationRoutes = require("./src/routes/applicationRoutes");
const { swaggerUi, swaggerSpec } = require("./swaggerConfig");

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


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
