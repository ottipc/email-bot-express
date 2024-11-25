const Imap = require("imap");
const {simpleParser} = require("mailparser");
const {generateEmailReply} = require("../controllers/emailController");
const sendEmail = require("../services/sendEmail");
require("dotenv").config(); // Loading Environment from .env-Datei
const processedEmails = new Set(); // Speichert IDs verarbeiteter E-Mails
//const Listener = require("../models/listenerModel");
const Config = require("../models/configModel"); // Stelle sicher, dass der Pfad korrekt ist

let isListenerActive = process.env.LISTENER_ACTIVE === "true"; // Load from env

// Lade den Listener-Zustand aus der Datenbank
async function loadListenerState() {
    try {
        const config = await Config.findOne({ key: "isListenerActive" });
        console.log(`config in load listener state (emailListener.js) : ` + config);
        console.log(`value in load listener state (emailListener.js) : ` + config.value);

        //config.value = undefined;

        if (config) {
            isListenerActive = config.value; // Lade den gespeicherten Zustand
            console.log(`Listener state loaded from DB (emailListener.js): ` + config.value);
            return isListenerActive;
        } else {
            // Falls der Zustand nicht existiert, speichere den Standardwert
            await Config.create({ key: "isListenerActive", value: isListenerActive });
            console.log("Default listener state saved to DB.");
            return isListenerActive;
        }
    } catch (error) {
        console.error("Error loading listener state from DB:", error.message);
    }
}

// Speichere den Listener-Zustand in der Datenbank
async function saveListenerState(state) {
    try {
        console.log("In save listener state (emailListener.js) : " + state);
        await Config.findOneAndUpdate(
            { key: "isListenerActive" },
            { value: state },
            { upsert: true } // Erstellen, falls der Zustand noch nicht existiert
        );
        console.log(`Listener state saved to DB: ${state}`);
    } catch (error) {
        console.error("Error saving listener state to DB:", error.message);
    }
}

// Umschalten des Listener-Zustands
function toggleListener(state) {
    isListenerActive = state; // Aktualisiere den lokalen Zustand
    saveListenerState(state); // Speichere den Zustand in der Datenbank
    console.log(`Listener is now ${state ? "active" : "inactive"}`);
}

// Gib den aktuellen Zustand zurück
function getListenerState() {
    return isListenerActive;
}


// config IMAP-Connection
const imap = new Imap({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.IMAP_SERVER,
    port: 993,
    tls: true,
    tlsOptions: {rejectUnauthorized: false}, // Nur im Entwicklungsmodus!
});

// Queue and State
const emailQueue = []; // Warteschlange für E-Mails
let processing = false; // Status: Wird gerade verarbeitet?

// chose Directory of Emails listen to
function openInbox(cb) {
    imap.openBox("INBOX", false, cb);
}

// Processing next Email in Queue...
async function processQueue() {
    if (processing || emailQueue.length === 0) return; // If already processed or queue is empty, abort

    processing = true; // Setze Status auf "wird verarbeitet"
    const emailData = emailQueue.shift(); // Entferne die erste E-Mail aus der Queue

    console.log("Processing E-Mail...:", emailData);

    // Simulate a Response to the Controller
    const fakeReq = {
        body: {
            subject: emailData.subject,
            body: emailData.body,
            sender: emailData.sender,
            saveToDB: true, // Signalisiert dem Controller, dass die Antwort gespeichert werden soll
        },
    };

    const fakeRes = {
        status: (code) => ({
            json: async (data) => {
                console.log(`Controller Response: Status ${code}`, data);

                // Sende Antwort-E-Mail
                try {
                    await sendEmail(
                        emailData.sender, // Sende an den ursprünglichen Absender
                        data.reply_subject,
                        data.reply_body
                    );
                    console.log("Response Email send to :", emailData.sender);
                } catch (error) {
                    console.error("Error replying Response-E-Mail:", error.message);
                }

                return fakeRes;
            },
        }),
    };

    try {
        await generateEmailReply(fakeReq, fakeRes, console.error); // Rufe den Controller auf
    } catch (error) {
        console.error("Error calling the Controller:", error.message);
    } finally {
        processing = false; // Processing finished
        processQueue(); // Process next E-Mail in the Queue
    }
}

// Listener für neue E-Mails einrichten
imap.once("ready", () => {
    console.log("IMAP connected...");

    openInbox((err, box) => {
        if (err) throw err;

        console.log("Email Inout opened. Waiting for new E-Mails...");

        // Überwache neue E-Mails
        imap.on("mail", () => {
            //console.log("Got new E-Mail!");
            fetchNewEmails();
        });
    });
});


async function fetchNewEmails() {
    imap.search(["UNSEEN"], (err, results) => {
        if (err) {
            console.error("Error fetching new emails:", err);
            return;
        }

        if (!results || results.length === 0) {
            console.log("No new unread emails found.");
            return;
        }

        const fetch = imap.fetch(results, {bodies: "", markSeen: true});

        fetch.on("message", (msg) => {
            msg.on("body", async (stream) => {
                const parsedEmail = await simpleParser(stream);

                console.debug("New email:", {
                    from: parsedEmail.from.text,
                    subject: parsedEmail.subject,
                    text: parsedEmail.text,
                });

                // Simulate Request to the Controller
                const fakeReq = {
                    body: {
                        subject: parsedEmail.subject,
                        body: parsedEmail.text,
                        sender: parsedEmail.from.value[0].address,
                        saveToDB: true, // Immer speichern, egal ob Listener aktiv oder nicht
                        generateReply: isListenerActive, // Generiere Antwort nur, wenn Listener aktiv ist
                    },
                };

                const fakeRes = {
                    status: (code) => ({
                        json: (data) => {
                            console.log(`Controller response (status ${code}):`, data);
                            return fakeRes;
                        },
                    }),
                };

                try {
                    await generateEmailReply(fakeReq, fakeRes, console.error);
                    console.log("Email saved to database successfully.");
                } catch (error) {
                    console.error("Error processing email:", error.message);
                }
            });
        });

        fetch.once("end", () => {
            console.log("All new emails processed.");
        });
    });
}


// Fehlerbehandlung
imap.once("error", (err) => {
    console.error("IMAP Error:", err);
});

imap.once("end", () => {
    console.log("IMAP Connection end.");
});

// Start connection
(async () => {
    await loadListenerState(); // Zustand laden
    imap.connect(); // Verbindung starten
})();

module.exports = {toggleListener, loadListenerState, isListenerActive, fetchNewEmails};