const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    size: { type: String }, // e.g. "10", "XL"
    color: { type: String }, // e.g. "Red", "Blue"
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    imageUrl: { type: String },
    description: { type: String },
    shopId: { type: String, default: "shop_001" }, // For multi-shop support in future
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
