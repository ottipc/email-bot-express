const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const { MongoMemoryServer } = require('mongodb-memory-server');

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
        expect(response.body.success).toBe(true);
        expect(response.body.data.reply).toBeTruthy(); // Antwort vorhanden
    });
});
