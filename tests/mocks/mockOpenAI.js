const generateChatGPTReply = jest.fn(() => {
    return Promise.resolve({
        reply: "Dies ist eine simulierte Antwort von ChatGPT.",
    });
});

module.exports = { generateChatGPTReply };
