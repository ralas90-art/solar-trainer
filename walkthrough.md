# Solar Sales Trainer Agent (V1.0) - Walkthrough

Congratulations! The Solar Sales Trainer Agent is now a feature-complete application ready for deployment. This guide covers how to run the application, its core features, and the architecture.

## 🚀 Quick Start (Local)

### 1. Backend (The Brain)
Runs the FastAPI server, SQLite database, and LLM integration.
1.  Navigate to `backend/`.
2.  Ensure you have your `OPENAI_API_KEY` in `backend/.env`.
3.  Double-click `run_server.bat` (or run `python -m uvicorn main:app --reload`).
    *   *This will automatically create the `database.db` SQLite file.*

### 2. Frontend (The Interface)
Runs the Next.js Dashboard.
1.  Navigate to `frontend/`.
2.  Run `npm run dev`.
3.  Open [http://localhost:3000](http://localhost:3000).

---

## 🌟 Key Features

### 1. Authentic Roleplay Simulation
*   **Dynamic Scenarios**: Choose from "The Skeptical Engineer", "The Lease Hater", or standard D2D encounters.
*   **State Awareness**: The agent adapts logic based on CA (NEM 3.0), TX (Deregulated), or NY (VDER).
*   **Voice Integration**: Speak naturally to the agent using the browser's Web Speech API.

### 2. Gamification & Progression
*   **Real-time Scoring**: Get instant feedback (0-100) on every response.
*   **Streak Counter**: Build momentum with consecutive good answers.
*   **Leaderboard**: Compete for the top spot on the "Top Performers" list.

### 3. Certification System
*   **User Auth**: Sign up and Login to save your progress.
*   **Printable Certificate**: Once you score > 100 points, unlock a formal "Certificate of Excellence" that allows for PDF export/printing.

### 4. Daily Workbooks & Slides
*   **PDF Workbooks**: Download comprehensive guides for each of the 6 training modules.
*   **Presentation Decks**: Access the official In-Home and Virtual presentation slides (PPTX) directly from the dashboard.

---

## 🏗️ Architecture

*   **Frontend**: Next.js 14, Tailwind CSS, Shadcn/UI.
*   **Backend**: Python FastAPI.
*   **Database**: SQLite (via SQLModel).
*   **AI**: OpenAI GPT-4o (via `llm_client.py`).

## 🚢 Deployment Ready
Check `deployment.md` for instructions on how to push this to **Vercel** (Frontend) and **Render** (Backend).
