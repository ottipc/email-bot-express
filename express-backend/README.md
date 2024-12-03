# Email Bot Backend

This is a Node.js-based backend application that uses Express.js to create an email bot. The bot processes incoming emails via IMAP, generates replies using OpenAI's GPT models, and sends automated responses via SMTP.

---

## Features

- **IMAP Listener**: Monitors an email inbox for new messages and triggers processing.
- **OpenAI Integration**: Generates responses for incoming emails using GPT.
- **Email Sending**: Sends automated responses using the `nodemailer` library.
- **Database Integration**: Stores processed emails and their responses in MongoDB.
- **RESTful API**: Includes endpoints for email management (list, delete, etc.).

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 16.x or higher.
- **MongoDB**: Locally or cloud-hosted instance.
- **IMAP-enabled Email Account**: To listen for incoming emails.
- **SMTP-enabled Email Account**: For sending responses.
- **OpenAI API Key**: To use GPT for generating email replies.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ottipc/email-bot-express.git
   cd email-bot-express
   cd express-backend

**Test Call

```
curl -X POST http://localhost:3000/api/generate-email-reply \
-H "Content-Type: application/json" \
-d '{
    "subject": "Meeting Schedule",
    "body": "Can we schedule a meeting for next week?",
    "sender": "john.doe@example.com"
}'
```
**Getting all Emails**
```
curl -X GET  http://localhost:3000/api/emails
```
**Deleting Email:**
```
http://localhost:3000/api/email/6741c8b2a12489e914592bc2
```
**Saving Prompt and Signature:**
```
curl -X POST http://localhost:3000/api/prompt \
-H "Content-Type: application/json" \
-d '{"prompt":"New Prompt","signature":"New Signature"}'
```

**Backend .env:**
```
# Server Port
PORT=3000

# MongoDB URI (lokale Entwicklung)
MONGODB_URI=mongodb://localhost:27017/dbname

# Falls MongoDB Atlas genutzt wird
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/emailsDB?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key

# OpenAI API Key
OPENAI_API_KEY=YOUR-CHAT-GPT-API-KEY

# Node.js Umgebung
NODE_ENV=development

EMAIL_USER=test@gmx.de
EMAIL_PASSWORD=emailpasswort
IMAP_SERVER=imap.gmx.net
SMTP_SERVER=mail.gmx.net
SMTP_PORT=587
```

