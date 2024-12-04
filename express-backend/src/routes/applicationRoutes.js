const express = require("express");
const router = express.Router();
const {
    getApplicationStatus,
    toggleApplicationStatus,
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
 *                 enabled:
 *                   type: boolean
 *                   description: Whether the application is enabled
 */

router.get("/state", getApplicationStatus);



/**
 * @swagger
 * /api/application/toggle:
 *   post:
 *     summary: Toggle the application status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 description: New application status
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/toggle", toggleApplicationStatus);



module.exports = router;
