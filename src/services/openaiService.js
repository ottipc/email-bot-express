const axios = require('axios');

const generateChatGPTReply = async (subject, body) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',
                prompt: `Betreff: ${subject}\nE-Mail-Text: ${body}\n\nGeneriere eine formelle geschäftliche Antwort.`,
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error with OpenAI API:', error.message);
        throw new Error('Could not generate reply');
    }
};

module.exports = { generateChatGPTReply };
