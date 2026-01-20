# Next Steps & Tool Recommendations

This document provides a step-by-step guide to moving from the current Python prototype to a fully functional, white-labeled web application.

## Phase 1: LLM & Voice Integration (The "Brain" & "Mouth")
Replace the simple keyword matching in `prototype_agent.py` with real AI.

### Step 1.1: Connect the LLM (The "Brain")
1.  **Select a Provider**: Google Gemini (via Vertex AI) or OpenAI (GPT-4o).
2.  **Prompt Engineering**:
    *   Create a "System Prompt" that injects the *State Profile* and *User Level*.
    *   *Example*: "You are a homeowner in [STATE]. The user is a [LEVEL] rep. Respond with specialized objections about [INCENTIVES]."
3.  **Code Action**: Update the agent to send the user's audio transcript to the LLM and get a text response + critique.

### Step 1.2: Voice Interaction (The "Mouth" & "Ears")
How to make the agent talk and listen.

*   **Speech-to-Text (STT)**: Use **OpenAI Whisper** (fast, accurate, cheap). It converts the sales rep's voice into text for the LLM.
*   **Text-to-Speech (TTS)**: This is where the agent speaks back.

#### ElevenLabs Alternatives
If ElevenLabs is too expensive or not viable, consider these strong options:

| Provider | Pros | Cons | Best For |
| :--- | :--- | :--- | :--- |
| **OpenAI Audio API** | Simple integration (same SDK as GPT), very low latency. | Less emotional range/customization than ElevenLabs. | Fast, conversational bots. |
| **Play.ht** | Extremely high quality, "cloning" features similar to ElevenLabs. | Can be pricey at scale. | Premium "human-like" quality. |
| **Azure AI Speech** | Enterprise-grade, highly reliable, compliance-friendly. | Setup is more complex (Azure portal). | Large-scale, stable deployments. |
| **Deepgram** | Fastest processing (millisecond latency). | Voice quality is good but slightly robotic compared to top tier. | Real-time, interruption-heavy calls. |

**Recommendation**: Start with **OpenAI Audio API** for easiest development. Switch to **Play.ht** if you need hyper-realistic anger/emotion in the voices.

## Phase 2: Building the Web Dashboard (White-Label UI)
Move from the command line to a web browser.

### Step 2.1: Choose a Dashboard Template
Don't build from scratch. Use a modern React Admin framework to save weeks of work.

#### Dashboard Suggestions
1.  **Tremor (React Library)** *Highly Recommended*
    *   **Why**: Specifically built for "Dashboards". Stunning charts, simple cards, professional aesthetic.
    *   **Best For**: Displaying "Resilience Scores", "Sales Funnel" stats, and "State Progress".
2.  **Shadcn/ui (Component Collection)**
    *   **Why**: The current industry standard. Extremely flexible, copy-paste components. Clean, Apple-like design.
    *   **Best For**: Building the specific "sim chat" interface and settings menus.
3.  **Refine.dev**
    *   **Why**: A "headless" framework for admin panels. Handles authentication, routing, and data fetching out of the box.
    *   **Best For**: Managing the "Tenant" database (CRUD operations for adding new Solar Companies).

### Step 2.2: Frontend Architecture
1.  **Auth Layer**: Use **Clerk** or **NextAuth**.
    *   *Feature*: Store `tenant_id` in the user's session token to auto-load branding (Logo, Colors) on login.
2.  **State Management**: Use **Zustand** or **React Context**.
    *   *Feature*: Keep track of `currentUserState` (e.g., "CA") and `activeModule` globally.
3.  **Real-Time Audio**: Use a WebSocket connection (or WebRTC) to stream audio to the backend server.

## Summary Checklist
- [ ] **Backend**: Set up a Python (FastAPI) or Node.js (Express) server to run the LLM logic.
- [ ] **Voice**: Sign up for OpenAI API (handles both LLM and Audio).
- [ ] **Frontend**: Initialize a Next.js project with Tailwind CSS and Shadcn/ui.
- [ ] **Database**: Set up Supabase (PostgreSQL) to store User Profiles and State Data.
