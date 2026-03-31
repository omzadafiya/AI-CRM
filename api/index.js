const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const bodyParser = require('body-parser');
const apiRoutes = require('./src/routes/api');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Routes
// Note: In Vercel, the 'api/' folder is already mounted at '/api'
// So we use '/' here to avoid double prefixing like '/api/api'
app.use('/api', apiRoutes); 

// Simple health check
app.get('/', (req, res) => {
    res.send('AI CRM API is running...');
});

// Start Server or Export for Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
