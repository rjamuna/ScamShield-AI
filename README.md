# ScamShield AI 🛡️

> AI-powered scam detection — HackDevengers 1.0
**🚀 Live Demo:** https://your-vercel-project.vercel.app

## Problem

Millions of people fall victim to SMS phishing, fake job offers, fraudulent payment requests, and malicious URLs every day. Most people cannot identify scam indicators without expert knowledge.

## Solution

ScamShield AI lets users paste any suspicious content and instantly receive an AI-powered risk analysis with a score, red flags, explanation, and recommended actions — all in seconds.

## Features

- 🤖 Groq AI-powered analysis (llama-3.1-8b-instant)
- 📋 Rule-based fallback when AI is unavailable
- 🔗 Static URL safety analysis
- 📊 Risk score 0–100 with SAFE / SUSPICIOUS / DANGEROUS levels
- 🔐 JWT authentication
- 📁 Scan history per user (MongoDB Atlas)
- 📱 Fully responsive UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| AI | Groq SDK (llama-3.1-8b-instant) |
| Auth | JWT + bcryptjs |

## Architecture

```
Browser (React/Vite)
    ↓ REST API (Axios)
Express Backend
    ├── JWT Auth Middleware
    ├── Groq AI Service → llama-3.1-8b-instant
    ├── Fallback Rule Analyzer
    ├── URL Static Analyzer
    └── MongoDB Atlas (Mongoose)
```

## Installation

```bash
# Clone
git clone <repo-url>
cd scamshield-ai

# Backend
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
# Fill in VITE_API_URL
npm install
npm run dev
```

## Environment Variables

### backend/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/scamshield?retryWrites=true&w=majority
JWT_SECRET=<strong-random-secret>
GROQ_API_KEY=<your-groq-api-key>
CLIENT_URL=http://localhost:5173
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Database Access → Add user with password
3. **Network Access → Add IP Address → Add `0.0.0.0/0` (allow all) for development**
4. Connect → Drivers → Copy connection string
5. Paste into `MONGO_URI` — append `/scamshield?retryWrites=true&w=majority` after the hostname

> ⚠️ If you see "Could not connect to any servers", your current IP is not whitelisted.
> Go to Atlas → Network Access → Add your IP or use `0.0.0.0/0` for development.

## Groq Setup

1. Go to [console.groq.com](https://console.groq.com)
2. API Keys → Create API Key
3. Paste into `GROQ_API_KEY`
4. Model used: `llama-3.1-8b-instant`

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/scans/analyze
POST   /api/scans/url
GET    /api/scans
GET    /api/scans/:id
DELETE /api/scans/:id

GET    /api/users/profile
PUT    /api/users/profile

GET    /api/health
```

## Deployment

### Backend → Render

1. Push backend to GitHub
2. New Web Service on [render.com](https://render.com)
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GROQ_API_KEY`
   - `CLIENT_URL` = your Vercel URL

### Frontend → Vercel

1. Push frontend to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Root Directory: `frontend`
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL + `/api`

## Demo Examples

**DANGEROUS:**
> URGENT! Your bank account will be blocked today. Verify your account immediately by clicking this link and entering your OTP.

**SUSPICIOUS:**
> Congratulations! You have been selected for a work-from-home opportunity. Pay a small registration fee to continue.

**SAFE:**
> Your appointment with ABC Clinic is confirmed for tomorrow at 10:00 AM.

## Future Improvements

- Browser extension for real-time detection
- Email forwarding analysis
- Community-reported scam database
- Multi-language support
- Screenshot OCR analysis
