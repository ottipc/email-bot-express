const { generateEmailReply } = require('../../src/controllers/emailController');
const Email = require('../../src/models/Email');

jest.mock('../../src/services/openaiService', () => ({
    generateChatGPTReply: jest.fn(() =>
        Promise.resolve('Test-Antwort von ChatGPT.')
    ),
}));

jest.mock('../../src/models/Email');

describe('Email Controller - generateEmailReply', () => {
    it('should generate a reply and save email to the database', async () => {
        const req = {
            body: {
                subject: 'Test Subject',
                body: 'Test Body',
                sender: 'test@example.com',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await generateEmailReply(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                reply: 'Test-Antwort von ChatGPT.',
            },
        });

        expect(Email.create).toHaveBeenCalledWith({
            subject: 'Test Subject',
            body: 'Test Body',
            sender: 'test@example.com',
            reply: 'Test-Antwort von ChatGPT.',
        });
    });
});
