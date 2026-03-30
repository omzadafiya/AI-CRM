const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Booking = require('../models/Booking');
const { processUserMessage } = require('../services/mistral');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

/**
 * 🤖 11za / WHATSAPP WEBHOOK ENDPOINT
 * This endpoint processes the incoming message and SENDS A REPLY via 11za API
 */
router.post('/chat', async (req, res) => {
    try {
        const payload = req.body;
        console.log("--- New Incoming Message from 11za ---");
        
        // 1. Extract Phone & Message
        const fromNumber = payload.from;
        let messageText = "";

        if (payload.content?.contentType === "text") {
            messageText = payload.content.text?.trim();
        } else if (payload.event === "MoMessage" && payload.content?.text) {
             messageText = payload.content.text;
        }

        // If no text found, ignore
        if (!messageText || !fromNumber) {
            return res.json({ success: true, status: "No text to process" });
        }

        console.log(`From: ${fromNumber} | Msg: ${messageText}`);

        // 2. Get AI Response from Mistral
        const aiResponse = await processUserMessage(messageText, fromNumber);
        console.log(`AI Response: ${aiResponse}`);

        // 3. SEND REPLY via 11za API
        const elevenzaApiUrl = "https://internal.11za.in/apis/sendMessage/sendMessages";
        const replyPayload = {
            "sendto": fromNumber,
            "authToken": process.env.ELEVENZA_AUTH_TOKEN,
            "originWebsite": process.env.ELEVENZA_ORIGIN,
            "contentType": "text",
            "text": aiResponse
        };

        try {
            const apiRes = await axios.post(elevenzaApiUrl, replyPayload);
            console.log("11za API Reply Success:", apiRes.data);
        } catch (apiErr) {
            console.error("11za API Reply Failed:", apiErr.response?.data || apiErr.message);
        }

        // Return 200 to 11za to acknowledge the webhook
        res.json({ success: true });

    } catch (err) {
        console.error("Webhook overall error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// --- INVENTORY API ROUTES ---

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error("GET /products error:", err);
        res.status(500).send('Server Error');
    }
});

router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const productData = { ...req.body };
        if (req.file) {
            productData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error("POST /products error:", err);
        res.status(500).send('Server Error');
    }
});

router.patch('/products/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
        res.json(product);
    } catch (err) {
        console.error("PATCH /products/:id error:", err);
        res.status(500).send('Server Error');
    }
});

router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('productId');
        res.json(bookings);
    } catch (err) {
        console.error("GET /bookings error:", err);
        res.status(500).send('Server Error');
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error("DELETE /products error:", err);
        res.status(500).send('Server Error');
    }
});

router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
        
        res.json({
            totalProducts,
            totalBookings,
            pendingBookings,
            inquiriesToday: 0, 
            activeChats: 0 
        });
    } catch (err) {
        console.error("GET /stats error:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
