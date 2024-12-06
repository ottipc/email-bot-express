// Middleware zur zentralen Fehlerbehandlung
const errorMiddleware = (err, req, res, next) => {
    console.error(`[Error]: ${err.message}`); // Logge den Fehler in der Konsole

    // Setze den Statuscode (Standard: 500 Internal Server Error)
    const statusCode = err.status || 500;

    // Sende die Antwort im JSON-Format
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: config.NODE_ENV === 'development' ? err.stack : {}, // Zeige Stack nur in Entwicklung
    });
};

module.exports = errorMiddleware;