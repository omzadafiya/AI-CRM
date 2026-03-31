# 🚀 Deployment Guide: AI CRM on Vercel

This guide will walk you through the process of making your project live on Vercel.

## 📝 Prerequisites
1. Your project must be pushed to a **GitHub** repository.
2. You need a **Vercel** account.
3. You need a **MongoDB Atlas** connection string.

---

## 🏗️ Step 1: Deploying the Backend

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** > **"Project"**.
2. Import your GitHub repository.
3. In the **"Configure Project"** screen:
   - **Project Name**: `ai-crm-backend` (or similar).
   - **Root Directory**: Select `backend`.
   - **Framework Preset**: Select `Other`.
4. Open the **"Environment Variables"** section and add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `ELEVENZA_AUTH_TOKEN`: Your WhatsApp API token.
   - `ELEVENZA_ORIGIN`: Your origin website.
   - `MISTRAL_API_KEY`: Your Mistral AI key.
5. Click **"Deploy"**.
6. Once deployed, **Copy the Production URL** (e.g., `https://ai-crm-backend.vercel.app`).

---

## 🎨 Step 2: Deploying the Frontend

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** > **"Project"**.
2. Import the **SAME** GitHub repository again.
3. In the **"Configure Project"** screen:
   - **Project Name**: `ai-crm-frontend` (or similar).
   - **Root Directory**: Select `frontend`.
   - **Framework Preset**: Select `Vite`.
4. Open the **"Environment Variables"** section and add:
   - `VITE_API_URL`: Paste the **Backend URL** you copied in Step 1 (e.g., `https://ai-crm-backend.vercel.app`).
5. Click **"Deploy"**.

---

## ⚠️ Important Notes

> [!WARNING]
> **Image Uploads**: Since Vercel uses serverless functions, the `uploads/` folder is temporary. Any images you upload will be deleted after a short time. 
> For a permanent solution, you should use **Cloudinary** or **AWS S3** in the future.

> [!IMPORTANT]
> **Webhook Update**: After deploying the backend, you MUST update your WhatsApp Webhook URL in the **11za dashboard** to your new Vercel backend URL:
> `https://your-backend-url.vercel.app/api/chat`

---

## ✅ Final Check
1. Open your Frontend URL.
2. Go to the "Inventory" page.
3. If it loads your products, you are LIVE!
