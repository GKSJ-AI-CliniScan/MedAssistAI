# 🚀 Deploying MedAssist AI to Render

This comprehensive guide covers how to deploy the entire **MedAssist AI (Flask ML Backend + React Frontend)** platform onto [Render](https://render.com).

---

## 📋 Overview of Architecture on Render

```
  ┌────────────────────────────────────────────────────────┐
  │         User Browser (Web / Mobile / Voice UI)          │
  └───────────────────────────┬────────────────────────────┘
                              │ HTTPS / REST API
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │   MedAssist Frontend (Render Static Site)               │
  │   - React 19 + Vite 6 + Tailwind CSS                   │
  │   - URL: https://medassist-frontend.onrender.com       │
  └───────────────────────────┬────────────────────────────┘
                              │ Calls /api via VITE_API_URL
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │   MedAssist Backend (Render Web Service)                │
  │   - Python 3.11 + Flask + Gunicorn                     │
  │   - Compressed ML Model (best_decision_tree_model)     │
  │   - 7 Core Modules + 377 Feature Classifier            │
  │   - URL: https://medassist-backend.onrender.com        │
  └───────────────────────────┬────────────────────────────┘
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│ MongoDB Atlas (Cloud)   │       │ Groq Cloud API (Free)   │
│ Or In-Memory Resilient  │       │ Medical AI Assistant &  │
│ Patient/Report Store    │       │ Clinical Chat Engine    │
└─────────────────────────┘       └─────────────────────────┘
```

---

## ⚡ Method 1: One-Click Render Blueprint (Recommended)

MedAssist AI includes a pre-configured `render.yaml` Blueprint file at the repository root.

### Steps:
1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure MedAssist AI for Render deployment"
   git push origin main
   ```
2. **Log into Render**:
   - Navigate to [dashboard.render.com](https://dashboard.render.com).
3. **Create New Blueprint Instance**:
   - Click **New +** → **Blueprint**.
   - Connect your GitHub repository (`MedAssistAI`).
   - Render will automatically parse `render.yaml` and discover both services:
     - `medassist-backend` (Python Web Service)
     - `medassist-frontend` (Static Site)
4. **Configure Environment Variables** (if prompted):
   - `GROQ_API_KEY`: Enter your Groq key (or use the preloaded default).
   - `MONGO_URI`: Enter your MongoDB Atlas connection string (optional; defaults to resilient store if left unset).
5. Click **Apply**.
6. Render will automatically build both services, link the frontend `VITE_API_URL` to your backend URL, and deploy!

---

## 🛠️ Method 2: Manual Setup on Render Dashboard

If you prefer configuring the services manually:

### Step 2.1: Deploy Backend Web Service
1. On the Render Dashboard, click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `medassist-backend`
   - **Region**: Any (e.g. `Oregon (US West)` or `Frankfurt`)
   - **Root Directory**: `flask_backend` (or `MedAssistAI/flask_backend` depending on repo structure)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app`
   - **Plan**: `Free`
4. Under **Advanced** → **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `PORT` | `5000` | Server internal binding port |
   | `PYTHON_VERSION` | `3.11.9` | Python runtime version |
   | `SECRET_KEY` | `94b7e8d3c1a2f693e507b9a528695021f1c84d7a60b9432e` | Flask session secret |
   | `JWT_SECRET` | `f72c4e1a60b9387a2d1f054238e9c6b3a2f810d734e569c2` | JWT Token generation secret |
   | `FLASK_ENV` | `production` | Production environment mode |
   | `GROQ_API_KEY` | `your_groq_api_key_here` | Groq AI key (free from console.groq.com) |
   | `MONGO_URI` | `mongodb+srv://...` (Optional) | MongoDB Atlas connection URI |
5. **Health Check Path**: Set to `/api/health`.
6. Click **Create Web Service**.
7. Note down your backend URL (e.g., `https://medassist-backend.onrender.com`).

---

### Step 2.2: Deploy Frontend Static Site
1. On the Render Dashboard, click **New +** → **Static Site**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `medassist-frontend`
   - **Root Directory**: `frontend` (or `MedAssistAI/frontend`)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Advanced** → **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://medassist-backend.onrender.com/api` | Your deployed backend API URL with `/api` |
5. Under **Redirects/Rewrites**, add a rewrite rule for React Single Page Application routing:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

## 🗄️ Setting Up Free MongoDB Atlas (Optional)

MedAssist AI features built-in in-memory fallback stores that work even without MongoDB, but for persistent cloud database storage:

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Sandbox Cluster**.
3. Under **Database Access**, create a database user (e.g., `medassist_user` and password).
4. Under **Network Access**, allow access from anywhere: `0.0.0.0/0`.
5. Click **Connect** → **Drivers** (Python) and copy your connection string:
   ```
   mongodb+srv://medassist_user:<password>@cluster0.xxxxx.mongodb.net/medassist_ai?retryWrites=true&w=majority
   ```
6. Paste this URI into the `MONGO_URI` environment variable of your Render backend web service.

---

## 🧪 Verifying Live Deployment

Once both services show **Live**:

1. **Backend Health Check**:
   - Open: `https://medassist-backend.onrender.com/api/health`
   - Expected JSON:
     ```json
     {
       "service": "MedAssistAI Flask Backend",
       "status": "healthy"
     }
     ```

2. **Frontend Portal**:
   - Open: `https://medassist-frontend.onrender.com`
   - Log in using any instant demo account or register a new account:

| Role | Email / Identifier | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@medassist.ai` | `123456` | Symptom Checker, AI Consultant, Reports, History |
| **Doctor** | `doctor@medassist.ai` | `123456` | Clinical Queue, Patient Records, Consultations |
| **Lab Technician** | `lab@medassist.ai` | `123456` | Lab Reports, Document Upload, Test Results |
| **Receptionist** | `receptionist@medassist.ai` | `123456` | Appointment Booking, Token Queue Management |
| **Pharmacist** | `pharmacy@medassist.ai` | `123456` | Pharmacy Inventory, Prescription Dispensing |
| **Hospital Admin** | `admin@medassist.ai` | `123456` | Hospital Analytics, Department & Staff Management |
| **Super Admin** | `superadmin@medassist.ai` | `123456` | Complete Platform Overview, AI Diagnostics Engine |

---

## 🔍 Troubleshooting Render Deployment

- **Cold Starts on Free Tier**: Render's free web services spin down after 15 minutes of inactivity. The first request after sleep may take ~30-40 seconds while the container initializes.
- **Model Loading**: The model `best_decision_tree_model.joblib` is compressed to 4.36 MB and loads in under 300ms upon boot.
- **CORS Issues**: Flask CORS is enabled for all origins (`*`) and automatically supports any custom domain or Render URL.
- **Client-side 404 on Refresh**: Ensure the rewrite rule `/* -> /index.html` is configured in the Static Site settings.
