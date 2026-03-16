# Deployment Guide

## 1. Backend (FastAPI)
The backend is a standard Python FastAPI application.

### Requirements
- Python 3.10+
- SQLite (built-in)

### Steps
1. Navigate to `backend/`.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server (Production mode):
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   *Note: For production, consider using Gunicorn with Uvicorn workers.*

## 2. Frontend (Next.js)
The frontend is a React application built with Next.js.

### Requirements
- Node.js 18+

### Steps
1. Navigate to `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```

## 3. Environment Variables
Ensure these are set in your deployment environment (e.g., Render Dashboard, Vercel Settings).

- **Backend**:
  - `OPENAI_API_KEY`: Your OpenAI API Key.
  - `DATABASE_URL`: (Optional) Defaults to `sqlite:///./database.db`.

## 4. Hosting Recommendations
- **Frontend**: Vercel (Zero config, just push the repo).
- **Backend**: Render, Railway, or Fly.io (Python hosting).
