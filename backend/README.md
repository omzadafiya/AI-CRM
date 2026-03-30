# AI CRM for Local Shops (Inventory Assistant) 🛍️

AI-powered CRM concept for small shopkeepers to manage inventory and bookings via WhatsApp automatically.

## Tech Stack
- **Frontend**: React (Vite) with Tailwind CSS
- **Backend Logic**: Node.js & Express
- **Database**: MongoDB
- **AI Engine**: Mistral AI (Mistral Large)
- **Messaging**: WhatsApp Cloud API

## Features
- ✅ **Auto Stock Check**: Customer can ask about products in their language (e.g. "Do you have Red Nike shoes size 10?").
- ✅ **Booking System**: AI can book/reserve items for the customer.
- ✅ **Zero User Effort**: Shopkeeper just needs to update inventory; AI handles the rest.

## Getting Started

1.  **Clone the project**
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables (`.env`)**
    - `MONGODB_URI`: Your MongoDB connection string.
    - `MISTRAL_API_KEY`: Your Mistral AI API Key.
    - `WHATSAPP_VERIFY_TOKEN`: A secret string for your webhook verification.
    - `WHATSAPP_ACCESS_TOKEN`: Your Meta Developer Portal token.
    - `WHATSAPP_PHONE_NUMBER_ID`: Your WhatsApp Phone Number ID.

4.  **Seed Sample Data**
    ```bash
    node seed.js
    ```

5.  **Run the Backend**
    ```bash
    node index.js
    ```

6.  **Run the React Frontend**
    ```bash
    cd frontend
    npm run dev
    ```

## Testing Locally (Webhooks)
To test the WhatsApp webhook locally, use `ngrok`:
```bash
ngrok http 5000
```
Then update your webhook URL in Meta Developer Portal to: `https://<your-ngrok-url>/api/webhook`

## Example Conversation
- **Customer**: "Hello, do you have Red Nike shoes in size 10?"
- **AI**: "Yes, we have Nike Air Max in Red (Size: 10) available for 5000. Would you like me to reserve one for you?"
- **Customer**: "Yes, please reserve 1 for me."
- **AI**: "Great! I have reserved 1 Nike Air Max for you. Your booking ID is BK123. Please collect it within 24 hours."
