const express = require('express');
const { validateEmail } = require('../middlewares/validationMiddleware');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { generateReply } = require('../controllers/emailController');

const router = express.Router();

/**
 * @swagger
 * /generate-email-reply:
 *   post:
 *     summary: Generate a formal email reply
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *               sender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post(
    '/generate-email-reply',
    authenticateJWT,
    validateEmail,
    generateReply
);

module.exports = router;
