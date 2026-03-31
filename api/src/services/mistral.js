let mistralInstance = null;

async function getMistral() {
    if (!mistralInstance) {
        const { Mistral } = await import('@mistralai/mistralai');
        mistralInstance = new Mistral({
            apiKey: process.env.MISTRAL_API_KEY,
        });
    }
    return mistralInstance;
}

const Product = require('../models/Product');
const Booking = require('../models/Booking');

/**
 * AI function to search products in MongoDB
 */
async function checkInventory({ name, brand, color, size }) {
    try {
        const query = {};
        if (name) query.name = new RegExp(name, 'i');
        if (brand) query.brand = new RegExp(brand, 'i');
        if (color) query.color = new RegExp(color, 'i');
        if (size) query.size = size;

        const products = await Product.find(query);
        return products.length > 0
            ? JSON.stringify(products.map(p => ({
                id: p._id,
                name: p.name,
                brand: p.brand,
                size: p.size,
                color: p.color,
                price: p.price,
                stock: p.stockQuantity
            })))
            : "No products matched these criteria.";
    } catch (error) {
        console.error("Error checking inventory:", error);
        return "Internal error during inventory lookup.";
    }
}

/**
 * AI function to book/reserve a product
 */
async function bookProduct({ productId, customerPhone, quantity = 1 }) {
    try {
        const product = await Product.findById(productId);
        if (!product) return "Invalid product ID.";
        if (product.stockQuantity < quantity) return `Insufficient stock. Only ${product.stockQuantity} available.`;

        // Reserve it
        product.stockQuantity -= quantity;
        await product.save();

        const booking = new Booking({
            productId,
            customerPhone,
            quantity,
            status: 'Pending'
        });
        await booking.save();

        return `Successfully reserved. Booking ID: ${booking._id}. Status: Pending (24hr reservation).`;
    } catch (error) {
        console.error("Error booking product:", error);
        return "Internal error during booking process.";
    }
}

const tools = [
    {
        type: "function",
        function: {
            name: "checkInventory",
            description: "Search for specific products in the shop's inventory.",
            parameters: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Name of product (e.g. shoes)" },
                    brand: { type: "string", description: "Brand" },
                    color: { type: "string", description: "Color" },
                    size: { type: "string", description: "Size" },
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "bookProduct",
            description: "Reserves a product for a customer.",
            parameters: {
                type: "object",
                properties: {
                    productId: { type: "string", description: "The internal ID of product" },
                    customerPhone: { type: "string", description: "The phone number of customer" },
                    quantity: { type: "number", description: "How many items to book" },
                },
                required: ["productId", "customerPhone"]
            }
        }
    }
];

const processUserMessage = async (message, phone) => {
    try {
        const messages = [
            { role: "system", content: "You are an AI Inventory Assistant for a local shop. You help customers find products and book them. Use tools to check stock and book products. Be helpful and clear in Hinglish or English as the customer speaks." },
            { role: "user", content: `Customer phone: ${phone}. Message: ${message}` }
        ];

        const mistral = await getMistral();

        const response = await mistral.chat.complete({
            model: "mistral-large-latest",
            messages: messages,
            tools: tools,
            tool_choice: "auto",
        });

        let responseMessage = response.choices[0].message;

        if (responseMessage.tool_calls) {
            messages.push(responseMessage);
            for (const toolCall of responseMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);
                
                let result;
                if (functionName === "checkInventory") {
                    result = await checkInventory(args);
                } else if (functionName === "bookProduct") {
                    result = await bookProduct({ ...args, customerPhone: phone });
                }

                messages.push({
                    role: "tool",
                    name: functionName,
                    content: result,
                    tool_call_id: toolCall.id,
                });
            }

            const mistral = await getMistral();
            const secondResponse = await mistral.chat.complete({
                model: "mistral-large-latest",
                messages: messages,
            });
            return secondResponse.choices[0].message.content;
        }

        return responseMessage.content;
    } catch (error) {
        console.error("Mistral processing error:", error);
        return "Maaf kijiye, abhi processing me samasya ho rahi hai. Kripya thodi der baaad phir se koshish karein.";
    }
};

module.exports = { processUserMessage };
