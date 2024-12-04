let isApplicationEnabled = true; // Standardmäßig ist die Anwendung aktiviert

// Status der Anwendung abrufen
const getApplicationStatus = (req, res) => {
    res.status(200).json({ enabled: isApplicationEnabled });
};

// Status der Anwendung umschalten
const toggleApplicationStatus = (req, res) => {
    isApplicationEnabled = req.body.enabled; // Wert vom Frontend
    res.status(200).json({
        message: `Application is now ${isApplicationEnabled ? "enabled" : "disabled"}`,
    });
};

module.exports = {
    getApplicationStatus,
    toggleApplicationStatus,
};
