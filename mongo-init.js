db = db.getSiblingDB("email-bot-express");

db.createUser({
    user: "express-bot-admin",
    pwd: "1VbfpRxD42kP",
    roles: [{ role: "readWrite", db: "email-bot-express" }]
});
