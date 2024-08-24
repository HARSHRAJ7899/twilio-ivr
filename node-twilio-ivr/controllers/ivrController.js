const asyncHandler = require('express-async-handler');
const twilioService = require('../services/twilioService');


const validateRequestBody = (fields, req) => {
    for (const field of fields) {
        if (!req.body[field]) {
            const message = `${field} is required`;
            throw new Error(message);
        }
    }
};


exports.makeCall = asyncHandler(async (req, res) => {
    try {
        const toNumber = process.env.YOUR_PHONE_NUMBER;
        if (!toNumber) {
            res.status(400);
            throw new Error('Your phone number is not set in the environment variables.');
        }

        const callSid = await twilioService.makeCall(toNumber);
        res.status(200).json({ callSid });
    } catch (error) {
        res.status(constants.SERVER_ERROR);
        throw new Error(`Error initiating call: ${error.message}`);
    }
});

// Make a call for testing (GET route)
exports.makeCallGet = asyncHandler(async (req, res) => {
    try {
        const toNumber = process.env.YOUR_PHONE_NUMBER;
        if (!toNumber) {
            res.status(400);
            throw new Error('Your phone number is not set in the environment variables.');
        }

        const callSid = await twilioService.makeCall(toNumber);
        res.status(200).send(`Call initiated with SID: ${callSid}`);
    } catch (error) {
        res.status(500);
        throw new Error(`Error initiating call: ${error.message}`);
    }
});

// Handle the response from IVR
exports.handleResponse = asyncHandler(async (req, res) => {
    try {
        validateRequestBody(['Digits', 'To'], req);

        const { Digits, To } = req.body;
        await twilioService.handleResponse(Digits, To);
        res.send('<Response><Say>Thank you! Goodbye.</Say></Response>');
    } catch (error) {
        res.status(500);
        throw new Error(`Error handling response: ${error.message}`);
    }
});

// Handle the voice response for the IVR call
exports.handleVoice = asyncHandler(async (req, res) => {
    try {
        const { VoiceResponse } = require('twilio').twiml;
        const twiml = new VoiceResponse();

        const gather = twiml.gather({
            input: 'dtmf',
            numDigits: 1,
            action: '/ivr/handleResponse',
            method: 'POST'
        });

        gather.play('https://magenta-cobra-4248.twil.io/assets/Fara%20interview%20audio.mp3');

        twiml.redirect('/ivr/voice');  // If no input is received, replay the message

        res.type('text/xml');
        res.send(twiml.toString());
    } catch (error) {
        res.status(500);
        throw new Error(`Error handling voice response: ${error.message}`);
    }
});
