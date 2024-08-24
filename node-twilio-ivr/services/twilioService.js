// services/twilioService.js
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

exports.makeCall = async (toNumber) => {
    try {
        const call = await client.calls.create({
            url: `${process.env.BASE_URL}/ivr/voice`,  // Pointing to your TwiML route
            to: toNumber,
            from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio phone number
            method: "POST"
        });
        return call.sid;
    } catch (error) {
        console.error('Error making call:', error);
        throw error;
    }
};

exports.handleResponse = async (digits, from) => {
    try {
        if (digits === '1') {
            const message = await client.messages.create({
                body: `Thank you for your interest! Here is your personalized interview link: ${process.env.INTERVIEW_LINK}`,
                from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio phone number
                to: from
            });
            return message.sid;
        }
    } catch (error) {
        console.error('Error handling response:', error);
        throw error;
    }
};
