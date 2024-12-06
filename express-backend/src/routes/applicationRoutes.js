const express = require("express");
const router = express.Router();
const {
    getApplicationState,
    toggleApplicationState,
    setApplicationState
} = require("../controllers/applicationController");

// Endpunkte für den Schalter

/**
 * @swagger
 * /api/application/state:
 *   get:
 *     summary: Get the application status
 *     responses:
 *       200:
 *         description: Application status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isApplicationEnabled:
 *                   type: boolean
 *                   description: Whether the application is enabled
 */
router.get("/state", getApplicationState);

/**
 * @swagger
 * /api/application/state:
 *   post:
 *     summary: Set the application status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isApplicationEnabled:
 *                 type: boolean
 *                 description: New application state
 *     responses:
 *       200:
 *         description: Application state updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 isApplicationEnabled:
 *                   type: boolean
 */
router.post("/state", setApplicationState);

/**
 * @swagger
 * /api/application/toggle:
 *   post:
 *     summary: Toggle the application status
 *     responses:
 *       200:
 *         description: Application status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 isApplicationEnabled:
 *                   type: boolean
 */
router.post("/toggle", toggleApplicationState);

module.exports = router;
