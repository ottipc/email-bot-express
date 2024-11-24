const Imap = require("imap");
const { simpleParser } = require("mailparser");
const { generateEmailReply } = require("../controllers/emailController");
const sendEmail = require("../services/sendEmail");
require("dotenv").config(); // Loading Environment from .env-Datei
const processedEmails = new Set(); // Speichert IDs verarbeiteter E-Mails


// config IMAP-Connection
const imap = new Imap({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.IMAP_SERVER,
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }, // Nur im Entwicklungsmodus!
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
            console.error("Fehler beim Abrufen neuer E-Mails:", err);
            return;
        }

        if (!results || results.length === 0) {
            console.log("Keine neuen ungelesenen E-Mails gefunden.");
            return;
        }

        const fetch = imap.fetch(results, { bodies: "" , markSeen: true});  //fetch new Emails and mark as seen

        fetch.on("message", (msg) => {
            msg.on("body", async (stream) => {
                const parsedEmail = await simpleParser(stream);

                //check if email is processed
                const emailId = parsedEmail.messageId; // Eindeutige Kennung der E-Mail
                if (processedEmails.has(emailId)) {
                    console.log("E-Mail bereits verarbeitet:", emailId);
                    return; // Überspringe verarbeitete E-Mails
                }

                processedEmails.add(emailId); // Markiere die E-Mail als verarbeitet

                console.debug("New E-Mail:", {
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
