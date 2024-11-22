const { generateEmailReply, getEmails, deleteEmail } = require('../../src/controllers/emailController');
const Email = require('../../src/models/emailModel');
const { generateChatGPTReply } = require('../../src/services/openaiService');

// Mock dependencies
jest.mock('../../src/models/emailModel');
jest.mock('../../src/services/openaiService', () => ({
    generateChatGPTReply: jest.fn(),
}));

describe('emailController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test getEmails
    describe('getEmails', () => {
        it('should return all emails with status 200', async () => {
            const mockEmails = [{ id: 1, subject: 'Test Email' }];
            Email.find.mockResolvedValue(mockEmails);

            await getEmails(req, res);

            expect(Email.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockEmails,
            });
        });

        it('should return 500 if fetching emails fails', async () => {
            Email.find.mockRejectedValue(new Error('Database error'));

            await getEmails(req, res);

            expect(Email.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Could not fetch emails',
                error: 'Database error',
            });
        });
    });

    // Test deleteEmail
    describe('deleteEmail', () => {
        it('should delete an email and return status 200', async () => {
            req.params = { id: '12345' };
            Email.findByIdAndDelete.mockResolvedValue({ id: '12345', subject: 'Test Email' });

            await deleteEmail(req, res);

            expect(Email.findByIdAndDelete).toHaveBeenCalledWith('12345');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Email deleted successfully',
            });
        });

        it('should return 404 if email not found', async () => {
            req.params = { id: '12345' };
            Email.findByIdAndDelete.mockResolvedValue(null);

            await deleteEmail(req, res);

            expect(Email.findByIdAndDelete).toHaveBeenCalledWith('12345');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email not found',
            });
        });

        it('should return 500 if deletion fails', async () => {
            req.params = { id: '12345' };
            Email.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            await deleteEmail(req, res);

            expect(Email.findByIdAndDelete).toHaveBeenCalledWith('12345');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Could not delete email',
                error: 'Database error',
            });
        });
    });

    // Test generateEmailReply
    describe('generateEmailReply', () => {
        it('should generate a reply and save it to the database', async () => {
            req.body = { subject: 'Hello', body: 'Test body', sender: 'test@example.com' };

            generateChatGPTReply.mockResolvedValue('Generated reply body');
            // Mock für Email.prototype.save
            jest.spyOn(Email.prototype, 'save').mockImplementation(async function () {
                this.replySubject = `Re: Hello`;
                this.replyBody = 'Generated reply body';
            });

            //Email.prototype.save = jest.fn().mockResolvedValue();
            await generateEmailReply(req, res, next);

            expect(generateChatGPTReply).toHaveBeenCalledWith('Hello', 'Test body');
            expect(Email.prototype.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                reply_subject: 'Re: Hello',
                reply_body: 'Generated reply body',
            });
        });

        it('should call next with an error if saving to the database fails', async () => {
            req.body = { subject: 'Hello', body: 'Test body', sender: 'test@example.com' };
            generateChatGPTReply.mockResolvedValue('Generated reply body');
            Email.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

            await generateEmailReply(req, res, next);

            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });
    });
});
