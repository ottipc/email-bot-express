// services/promptService.js
const Prompt = require('../models/PromptModel');

// Prompt erstellen
async function createPrompt(promptText) {
    const prompt = new Prompt({ value: promptText });
    await prompt.save();
    console.log("Prompt saved:", prompt);
    return prompt;
}

// Prompt abrufen
async function getPrompt() {
    let prompt = await Prompt.findOne();
    prompt = prompt === null ? "" : prompt;
    console.log("Loaded Prompt:", prompt);
    return prompt;
}

// Prompt aktualisieren
async function updatePrompt(newPromptText) {
    let prompt = await Prompt.findOne();
    if (!prompt) {
        prompt = new Prompt({ value: newPromptText });
    } else {
        prompt.value = newPromptText;
    }
    await prompt.save();
    console.log("Prompt updated:", prompt);
    return prompt;
}

module.exports = {
    createPrompt,
    getPrompt,
    updatePrompt,
};
