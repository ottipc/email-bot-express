const axios = require('axios');

const generateChatGPTReply = async (gptprompt, subject, body) => {
    try {
        //sending to ChatGPT :-)
        console.debug("Sending to ChatGPT Data :\n" + gptprompt.replace(/\\n/g, '\n') + "\n" + body);
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',  // use chosen model
            messages: [{ role: 'user', content: gptprompt + " " + body }],
            max_tokens: 1000
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (err) {
        console.error('Error with OpenAI API (model : gpt-3.5-turbo): ', err.response ? err.response.data : err.message);
        throw new Error('API Error (model gpt-3.5-turbo)');
    }
};


module.exports = { generateChatGPTReply};