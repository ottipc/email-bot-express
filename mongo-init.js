db = db.getSiblingDB("email-bot-express");

db.createUser({
    user: "express-bot",
    pwd: "YOUR_DB_PASSWORD",
    roles: [{ role: "readWrite", db: "email-bot-express" }]
});
