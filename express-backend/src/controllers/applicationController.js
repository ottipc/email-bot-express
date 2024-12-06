const Config = require('../models/configModel'); // Importiere das Config-Modell

// Status der Anwendung abrufen
const getApplicationState = async (req, res) => {
    try {
        const config = await Config.findOne({ key: 'isApplicationEnabled' });

        if (!config) {
            return res.status(404).json({ error: 'Application state not found' });
        }

        res.status(200).json({ isApplicationEnabled: config.value });
    } catch (err) {
        console.error('Error fetching application state:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Status der Anwendung setzen
const setApplicationState = async (req, res) => {
    try {
        const { isApplicationEnabled } = req.body;

        // Validierung des Eingangs
        if (typeof isApplicationEnabled !== 'boolean') {
            return res.status(400).json({ error: 'isApplicationEnabled must be a boolean value' });
        }

        // Upsert (Aktualisieren oder Erstellen)
        const config = await Config.findOneAndUpdate(
            { key: 'isApplicationEnabled' }, // Suchkriterium
            { value: isApplicationEnabled }, // Zu setzender Wert
            { upsert: true, new: true }      // Wenn nicht vorhanden, erstellen
        );

        res.status(200).json({ message: 'Application state updated successfully', config });
    } catch (err) {
        console.error('Error updating application state:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Status der Anwendung umschalten
const toggleApplicationState = async (req, res) => {
    try {
        // Abrufen des aktuellen Zustands
        const config = await Config.findOne({ key: 'isApplicationEnabled' });

        if (!config) {
            return res.status(404).json({ error: 'Application state not found' });
        }

        // Umschalten des Zustands
        const newState = !config.value;
        config.value = newState;
        await config.save();

        res.status(200).json({ message: 'Application state toggled successfully', isApplicationEnabled: newState });
    } catch (err) {
        console.error('Error toggling application state:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getApplicationState,
    setApplicationState,
    toggleApplicationState,
};
