const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mocking the API service
jest.mock('../../src/services/openaiService', () => ({
    generateChatGPTReply: jest.fn().mockResolvedValue('Mocked reply body'),
}));

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Email Routes Integration Tests', () => {
    it('should create a new email reply', async () => {
        const response = await request(app)
            .post('/api/email/generate-email-reply')
            .send({
                subject: 'Test Subject',
                body: 'Test Body',
                sender: 'test@example.com',
            });

        expect(response.status).toBe(200);
        expect(response.body.reply_subject).toBe('Re: Test Subject');
        expect(response.body.reply_body).toBe('Mocked reply body'); // Check mocked reply
    });
});
