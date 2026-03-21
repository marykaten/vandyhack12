# 💰 FinSight Assistant

AI-powered fintech assistant that analyzes transaction data and provides **clear, actionable, and non-judgmental financial insights**.

---

## 🚀 Overview

FinSight helps users understand their spending habits by transforming raw transaction data into:

* 📊 Spending insights
* ⚠️ Risk alerts
* 💡 Smart recommendations

Built with modern web technologies and powered by Google Gemini AI.

---

## 🧠 Key Features

* 🔍 **Transaction Analysis** – Understand where your money is going
* 🤖 **AI Insights** – Natural language financial summaries
* ⚡ **Fast & Responsive UI** – Built with React + Vite
* 🔐 **Secure Architecture** – API key protected via backend
* ☁️ **Serverless Deployment** – Powered by Vercel

---

## 🏗️ Tech Stack

**Frontend**

* React
* Vite
* TailwindCSS

**Backend**

* Vercel Serverless Functions (`/api/analyze`)

**AI**

* Google Gemini API (`@google/genai`)

---

## 🔐 Architecture

```
Frontend (React)
   ↓
/api/analyze (Serverless Backend)
   ↓
Gemini API (secured with environment variables)
```

> API keys are never exposed to the client.

---

## 🛠️ Local Development

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/finsight-assistant.git
cd finsight-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file:

```bash
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the app (frontend + backend)

```bash
npx vercel dev
```

---

## 🚀 Deployment (Vercel)

1. Push your repo to GitHub
2. Import project into Vercel
3. Add environment variable:

```
GEMINI_API_KEY = your_api_key
```

4. Deploy

---

## 📡 API Endpoint

### POST `/api/analyze`

#### Request:

```json
{
  "transactions": [...]
}
```

#### Response:

```json
{
  "text": "AI-generated financial insights..."
}
```

---

## ⚠️ Security Notes

* API keys are stored securely using environment variables
* No sensitive keys are exposed in frontend code
* AI requests are proxied through backend

---

## 💡 Future Improvements

* 📈 Spending category visualization
* 💳 Budget tracking system
* 🔔 Smart alerts (overspending detection)
* 📊 Charts & dashboards
* 🔒 Rate limiting & authentication

---

## 🏆 Hackathon Value

* Real-world fintech use case
* Secure full-stack architecture
* AI-driven insights with practical utility
* Scalable serverless design

---

## 👨‍💻 Author

Mary Kate Nguyen

---

## 📄 License

MIT License
