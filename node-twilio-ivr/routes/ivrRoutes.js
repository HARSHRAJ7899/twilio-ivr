// routes/ivrRoutes.js
const express = require('express');
const router = express.Router();
const ivrController = require('../controllers/ivrController');

/**
 * @swagger
 * tags:
 *   name: IVR
 *   description: Operations related to the IVR system
 */

/**
 * @swagger
 * /ivr/makeCall:
 *   post:
 *     summary: Initiates a call to a predefined phone number
 *     tags: [IVR]
 *     responses:
 *       200:
 *         description: Call initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 callSid:
 *                   type: string
 *                   description: The SID of the initiated call
 *                   example: "CA1234567890abcdef1234567890abcdef"
 *       500:
 *         description: Internal Server Error
 */
router.post('/makeCall', ivrController.makeCall);

/**
 * @swagger
 * /ivr/makeCall:
 *   get:
 *     summary: Initiates a call to a predefined phone number (GET method for testing)
 *     tags: [IVR]
 *     responses:
 *       200:
 *         description: Call initiated successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Call initiated with SID: CA1234567890abcdef1234567890abcdef"
 *       500:
 *         description: Internal Server Error
 */
router.get('/makeCall', ivrController.makeCallGet);

/**
 * @swagger
 * /ivr/handleResponse:
 *   post:
 *     summary: Handles the response from the IVR
 *     tags: [IVR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               Digits:
 *                 type: string
 *                 description: The digits input by the user
 *                 example: "1"
 *               From:
 *                 type: string
 *                 description: The phone number of the caller
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Response handled successfully
 *         content:
 *           text/xml:
 *             schema:
 *               type: string
 *               example: "<Response><Say>Thank you! Goodbye.</Say></Response>"
 *       500:
 *         description: Internal Server Error
 */
router.post('/handleResponse', ivrController.handleResponse);

/**
 * @swagger
 * /ivr/voice:
 *   post:
 *     summary: Provides the voice response for the IVR system
 *     tags: [IVR]
 *     responses:
 *       200:
 *         description: Voice response provided successfully
 *         content:
 *           text/xml:
 *             schema:
 *               type: string
 *               example: "<Response><Gather input='dtmf' numDigits='1' action='/ivr/handleResponse' method='POST'><Play>https://magenta-cobra-4248.twil.io/assets/Fara%20interview%20audio.mp3</Play></Gather><Redirect>/ivr/voice</Redirect></Response>"
 *       500:
 *         description: Internal Server Error
 */
router.post('/voice', ivrController.handleVoice);

module.exports = router;
