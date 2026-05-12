# 🌿 EcoFriendlyShop AI

An AI-powered eco-friendly shopping assistant built with **React + Vite** (frontend) and **Express + TypeScript** (backend), leveraging the **Google Gemini API** to help users make sustainable shopping choices.

---

## 🗂️ Project Structure

```
ECOFRIENDLYSHOP AI/
├── backend/
│   ├── routes/
│   │   └── chat.ts          # API route for AI chat endpoint
│   ├── services/
│   │   ├── ecoScore.ts      # Eco-score calculation logic (Gemini-powered)
│   │   └── productApi.ts    # Product data / API service
│   └── utils/
│       └── validator.ts     # Request validation utilities
├── src/
│   ├── components/
│   │   ├── InputBox.tsx      # Chat input component
│   │   ├── MessageBubble.tsx # Individual message display
│   │   └── TypingIndicator.tsx # AI typing animation
│   ├── services/
│   │   └── geminiService.ts  # Frontend Gemini API service
│   ├── App.tsx               # Root React component
│   ├── main.tsx              # React app entry point
│   └── index.css             # Global styles (Tailwind CSS)
├── .env.example              # Environment variable template
├── .gitignore
├── index.html                # Vite HTML entry point
├── metadata.json
├── package.json              # Scripts & dependencies
├── server.ts                 # Express server (serves API + Vite dev middleware)
├── tsconfig.json
└── vite.config.ts            # Vite configuration
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** v20 or later → [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- A **Gemini API key** → [Get one here](https://ai.google.dev/)

---

## 🚀 How to Run Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "ECOFRIENDLYSHOP AI"
```

> Or simply download and extract the ZIP, then open a terminal in that folder.

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file:

```bash
# Windows (Command Prompt)
copy .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

> **Note for Node 23 users:** This command uses Node's native TypeScript support (`--experimental-strip-types`), which is the most stable way to run this project on Windows.

This command starts both:
- The **Express backend** (API server) on `http://localhost:3000`
- The **Vite frontend** (served via Express middleware) on `http://localhost:3000`

Open your browser and go to:

```
http://localhost:3000
```

---

## 🛠️ Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Starts the Express + Vite dev server with hot-reload |
| **build** | `npm run build` | Builds the React frontend for production (`dist/`) |
| **preview** | `npm run preview` | Serves the production build locally |
| **clean** | `npm run clean` | Removes the `dist/` folder |
| **lint** | `npm run lint` | Runs TypeScript type-checking (`tsc --noEmit`) |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key |
| `APP_URL` | Optional | The URL where this app is hosted (e.g. `http://localhost:3000`) |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express, TypeScript |
| AI | Google Gemini API (`@google/genai`) |
| Bundler | Vite 6 |
| Runtime | `tsx` (runs TypeScript directly) |
| Animations | Motion (Framer Motion successor) |

---

## 📦 Production Build & Deployment

```bash
# Build the frontend
npm run build

# Start in production mode
NODE_ENV=production node --import tsx/esm server.ts
```

The `dist/` folder will be served statically by Express. You can also deploy to:
- **Vercel** – Deploy directly from GitHub
- **Railway / Render** – Set `npm run dev` as start command and add env vars

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push and open a Pull Request

---

© 2026 EcoFriendlyShop AI – All rights reserved.
