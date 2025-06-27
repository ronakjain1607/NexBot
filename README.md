# NexBot AI Chatbot Extension 🔮

NexBot is a Chrome Extension powered by Google's **Gemini API**, providing a sleek, minimal chat interface with persistent conversations, light/dark theme switching, and a copy-to-clipboard feature. Built for ease of use and fast deployment, this project includes both frontend (Chrome Extension) and backend (Node.js server) components.

---

## 📦 Project Overview

### 🧠 Features

- ✨ Simple and responsive UI for real-time chat
- 🌙 Light/Dark theme toggle with persistent preference
- 💾 Chat history saved via Chrome's local storage
- 📋 One-click copy button for chatbot replies
- 🔌 Backend server that communicates with Gemini via API key
- 🌐 Offline detection and graceful handling

---

## 🗂️ Folder & File Structure

NexBot/
├── popup.html # Chrome Extension UI layout
├── popup.js # Chat logic, API handling, theme & storage
├── style.css # Light/Dark themes and component styling
├── manifest.json # Chrome Extension manifest (v3)
├── icon.png # Extension icon (displayed in toolbar/store)
├── index.js # Express.js backend server
├── package.json # Backend dependencies and scripts
└── .env # (ignored) Environment file for Gemini API key


---

## 🧩 Chrome Extension Setup

### ✅ Requirements

- Google Chrome browser (latest)
- Extension unpacked folder
- A deployed or locally running backend server

### 🔧 Installation

1. Clone or download this repository.
2. Go to `chrome://extensions/` in your browser.
3. Enable **Developer Mode** (top-right toggle).
4. Click **Load Unpacked**.
5. Select the folder containing your `manifest.json` and `popup.html`.

> **Note:** Ensure `BACKEND_URL` in `popup.js` points to your deployed or local backend (`/api/chat` endpoint).

---

## 🖥️ Backend Server Setup

The server is a Node.js app that receives POST messages from the frontend and sends them to the Gemini API for a response.

### 🧾 Prerequisites

- Node.js v14 or higher
- NPM
- Gemini API Key from [Google AI Studio](https://ai.google.com/gemini)

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_actual_api_key_here
