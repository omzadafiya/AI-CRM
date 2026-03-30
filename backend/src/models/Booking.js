const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customerPhone: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled'], 
        default: 'Pending' 
    },
    reservedAt: { type: Date, default: Date.now },
    expiresAt: { 
        type: Date, 
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24-hour expiration
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
