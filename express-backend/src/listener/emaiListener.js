const Imap = require("imap");
const { simpleParser } = require("mailparser");
const { generateEmailReply } = require("../controllers/emailController");
const sendEmail = require("../services/sendEmail");
require("dotenv").config(); // Lädt die Umgebungsvariablen aus der .env-Datei

// IMAP-Verbindung konfigurieren
const imap = new Imap({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.IMAP_SERVER,
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }, // Nur im Entwicklungsmodus!
});

// Queue und Status
const emailQueue = []; // Warteschlange für E-Mails
let processing = false; // Status: Wird gerade verarbeitet?

function openInbox(cb) {
    imap.openBox("INBOX", false, cb);
}

// Verarbeite die nächste E-Mail in der Queue
async function processQueue() {
    if (processing || emailQueue.length === 0) return; // Wenn bereits verarbeitet wird oder Queue leer ist, abbrechen

    processing = true; // Setze Status auf "wird verarbeitet"
    const emailData = emailQueue.shift(); // Entferne die erste E-Mail aus der Queue

    console.log("Verarbeite E-Mail:", emailData);

    // Simuliere eine Anfrage an den Controller
    const fakeReq = {
        body: {
            subject: emailData.subject,
            body: emailData.body,
            sender: emailData.sender,
        },
    };

    const fakeRes = {
        status: (code) => ({
            json: async (data) => {
                console.log(`Controller Antwort: Status ${code}`, data);

                // Sende Antwort-E-Mail
                try {
                    await sendEmail(
                        emailData.sender, // Sende an den ursprünglichen Absender
                        data.reply_subject,
                        data.reply_body
                    );
                    console.log("Antwort gesendet an:", emailData.sender);
                } catch (error) {
                    console.error("Fehler beim Senden der Antwort-E-Mail:", error.message);
                }

                return fakeRes;
            },
        }),
    };

    try {
        await generateEmailReply(fakeReq, fakeRes, console.error); // Rufe den Controller auf
    } catch (error) {
        console.error("Fehler beim Aufruf des Controllers:", error.message);
    } finally {
        processing = false; // Verarbeitung abgeschlossen
        processQueue(); // Nächste E-Mail in der Queue verarbeiten
    }
}

// Listener für neue E-Mails einrichten
imap.once("ready", () => {
    console.log("IMAP verbunden.");

    openInbox((err, box) => {
        if (err) throw err;

        console.log("Posteingang geöffnet. Warte auf neue E-Mails...");

        // Überwache neue E-Mails
        imap.on("mail", () => {
            console.log("Neue E-Mail erhalten!");
            fetchNewEmails();
        });
    });
});

async function fetchNewEmails() {
    imap.search(["UNSEEN"], (err, results) => {
        if (err) {
            console.error("Fehler beim Abrufen neuer E-Mails:", err);
            return;
        }

        if (!results || results.length === 0) {
            console.log("Keine neuen ungelesenen E-Mails gefunden.");
            return;
        }

        const fetch = imap.fetch(results, { bodies: "" });

        fetch.on("message", (msg) => {
            msg.on("body", async (stream) => {
                const parsedEmail = await simpleParser(stream);

                console.log("Neue E-Mail:", {
                    from: parsedEmail.from.text,
                    subject: parsedEmail.subject,
                    text: parsedEmail.text,
                });

                // Füge die E-Mail-Daten zur Queue hinzu
                emailQueue.push({
                    subject: parsedEmail.subject,
                    body: parsedEmail.text,
                    sender: parsedEmail.from.value[0].address,
                });

                processQueue(); // Starte die Verarbeitung, falls noch nicht gestartet
            });
        });

        fetch.once("end", () => {
            console.log("Alle neuen E-Mails verarbeitet.");
        });
    });
}

// Fehlerbehandlung
imap.once("error", (err) => {
    console.error("IMAP Fehler:", err);
});

imap.once("end", () => {
    console.log("IMAP Verbindung beendet.");
});

// Verbindung starten
imap.connect();
