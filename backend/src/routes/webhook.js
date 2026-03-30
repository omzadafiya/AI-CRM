const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
const { processUserMessage } = require('../services/mistral');

dotenv.config();

/**
 * Handle Webhook Verification (WhatsApp API)
 */
router.get('/webhook', (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

/**
 * Handle Incoming Messages
 */
router.post('/webhook', async (req, res) => {
    let body = req.body;

    // Check if it's a WhatsApp message event
    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0] &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            let msg_body = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

            console.log(`Incoming message from ${from}: ${msg_body}`);

            // Process with AI
            const aiResponse = await processUserMessage(msg_body, from);

            // Send back to WhatsApp
            try {
                await axios({
                    method: "POST",
                    url: `https://graph.facebook.com/v17.0/${phone_number_id}/messages?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: { body: aiResponse },
                    },
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                console.error("Error sending message to WhatsApp:", error.response ? error.response.data : error.message);
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
