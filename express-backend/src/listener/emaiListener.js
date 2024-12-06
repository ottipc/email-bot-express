const Imap = require("imap");
const {simpleParser} = require("mailparser");
const {generateEmailReply} = require("../controllers/emailController");
const sendEmail = require("../services/sendEmail");
//const processedEmails = new Set(); // Saving IDs of processed E-Mails
const Config = require("../models/configModel");

let isAutomaticResponseActive = "true"; //set default Automatic Response to true
console.log("Loading emailListener.js...")
console.log("emailListener.js geladen von:", module.parent?.filename || "Loaded directly!");
// Loading the automatic response state out of the database
async function loadAutomaticResponseState() {
    try {
        const config = await Config.findOne({ key: "isAutomaticResponseActive" });
        console.log(`config in load automatic response state (emailListener.js) : ` + config);
        console.log(`value in load automatic response state (emailListener.js) : ` + config.value);

        //config.value = undefined;

        if (config) {
            isLAutomaticResponseActive = config.value; // loading saved state
            console.log(`Automatic Response state loaded from DB (emailListener.js): ` + config.value);
            return isLAutomaticResponseActive;
        } else {
            // if state does not exist save the default value
            await Config.create({ key: "isAutomaticResponseActive", value: isAutomaticResponseActive });
            console.log("Default automatic response state saved to DB.");
            return isListenerActive;
        }
    } catch (error) {
        console.error("Error loading automatic response state from DB:", error.message);
    }
}

/**
 * Savig automatic Response State in the Database
 */
async function saveAutomaticResponseState(state) {
    try {
        console.log("In save automatic response state (emailListener.js) : " + state);
        await Config.findOneAndUpdate(
            { key: "isautomaticResonseActive" },
            { value: state },
            { upsert: true } // Create if state does not exist
        );
        console.log(`Automatic Response state saved to DB: ${state}`);
    } catch (error) {
        console.error("Error saving Automatic Response state to DB:", error.message);
    }
}

/**
 * switching the automatic respoonse state
 * @param state
 */
function toggleAutomaticResponse(state) {
    isAutomaticResponseActive = state; // setting state of isAutomaticResponseOn
    saveAutomaticResponseState(state); // save Automatic Response State to Database
    console.log(`Automatic Response is now ${state ? "active" : "inactive"}`);
}

/**
 * config IMAP-Connection
  * @type {Connection}
 */
console.log("Connection in emailListener : " + process.env.IMAP_SERVER)
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

/**
 * chose Directory of Emails listen to
 * @param cb
 */
function openInbox(cb) {
    imap.openBox("INBOX", false, cb);
}

/**
 * Processing next Email in Queue...
 * @returns {Promise<void>}
 */
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
    await loadAutomaticResponseState(); // Zustand laden
    imap.connect(); // Verbindung starten
})();

module.exports = {toggleAutomaticResponse, loadAutomaticResponseState, isAutomaticResponseActive, fetchNewEmails};