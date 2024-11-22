const { generateChatGPTReply } = require('../../src/services/openaiService');
jest.mock('axios');
const axios = require('axios');

describe('OpenAI Service - generateChatGPTReply', () => {
    it('should return a valid response from OpenAI', async () => {
        // Simulate a successful response from OpenAI API
        const mockResponse = {
            data: {
                choices: [
                    {
                        message: {
                            content: 'Test-Antwort von ChatGPT.',
                        },
                    },
                ],
            },
        };

        // Mock axios.post um den gewünschten API-Endpunkt zu simulieren
        axios.post.mockResolvedValue(mockResponse);

        // Test: Die generateChatGPTReply Funktion aufrufen
        const reply = await generateChatGPTReply('Test Prompt');

        // Antwort überprüfen
        expect(reply).toBe('Test-Antwort von ChatGPT.');

        // Sicherstellen, dass axios.post mit der richtigen URL und Daten aufgerufen wurde
        expect(axios.post).toHaveBeenCalledTimes(1); // Überprüfen, dass es einmal aufgerufen wurde
        expect(axios.post).toHaveBeenCalledWith(
            'https://api.openai.com/v1/chat/completions', // Korrekte URL für chat completions
            expect.objectContaining({
                model: 'gpt-3.5-turbo', // Modell
                messages: [{ role: 'user', content: 'Test Prompt' }], // Richtige Datenstruktur
                max_tokens: 150, // Beispiel für zusätzliche Parameter
            }),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': expect.stringMatching(/^Bearer /), // Nur sicherstellen, dass es mit 'Bearer ' beginnt
                    'Content-Type': 'application/json', // Content-Type Header prüfen
                }),
            })
         ); // Ensure axios.post was called with the correct data
    });
    it('should throw an error if OpenAI API fails', async () => {
        console.log("Is Mock Funktion : " + jest.isMockFunction(axios.post)); // Sollte true sein
        // Simuliere einen API-Fehler
        axios.post.mockRejectedValue(new Error('API Error'));
        console.log("Is a Mock Funktion : " + jest.isMockFunction(axios.post)); // Sollte true sein
        console.log(axios.post.mock); // Überprüfen, ob der Mock definiert ist
        // Methode ausführen und prüfen
        await expect(generateChatGPTReply('Test Prompt')).rejects.toThrow('API Error');
    });
});