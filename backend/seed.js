const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB...');

        // Clear existing products
        await Product.deleteMany({});

        const products = [
            {
                name: "Nike Air Max",
                brand: "Nike",
                category: "Shoes",
                size: "10",
                color: "Red",
                price: 5000,
                stockQuantity: 10,
                description: "Original Nike Air Max with breathable mesh."
            },
            {
                name: "Nike Revolution 6",
                brand: "Nike",
                category: "Shoes",
                size: "9",
                color: "Black",
                price: 3500,
                stockQuantity: 5,
                description: "Durable running shoes from Nike."
            },
            {
                name: "Adidas Ultraboost",
                brand: "Adidas",
                category: "Shoes",
                size: "10",
                color: "White",
                price: 7000,
                stockQuantity: 8,
                description: "Premium comfort with boost technology."
            }
        ];

        await Product.insertMany(products);
        console.log('Seed data inserted successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
