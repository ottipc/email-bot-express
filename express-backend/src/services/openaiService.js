const axios = require('axios');

const generateChatGPTReply = async (message) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',  // Verwende das Modell, das du benötigst
            messages: [{ role: 'user', content: message }],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (err) {
        console.error('Error with OpenAI API:', err.response ? err.response.data : err.message);
        throw new Error('API Error');
    }
};


module.exports = { generateChatGPTReply};