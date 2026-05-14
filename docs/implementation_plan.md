# Simulation Feedback Implementation Plan

## Goal Description
Complete the "Simulation Interface Upgrade" by implementing the feedback phase. When a user finishes a simulation (either by auto-success or manually ending), the system will analyze the transcript using the backend API and display a comprehensive feedback report. This report will include a score, strengths, improvements, and a suggested script if the user failed.

## User Review Required
> [!NOTE]
> The backend analysis uses GPT-3.5-Turbo. We should monitor costs and latency.

## 🚀 Priority 1: Backend Integration & Persistence
Currently, the frontend uses `localStorage` for much of its progress tracking. For a multi-user, cross-device MVP, we must fully transition to the FastAPI/Supabase backend.

- [ ] **Unified Authentication**: Switch from hardcoded `trainee` ID to the backend `/login` and `/signup` flow.
- [ ] **State Migration**: Transition all `localStorage` logic to backend API calls.
    - [ ] Replace `getDashboardStats` in `lib/dashboard-data.ts` with calls to `/api/v1/analytics/snapshot`.
    - [ ] Ensure `updateTrainingModuleProgress` sends data to `/user/{user_id}/progress`.
- [ ] **Leaderboard Connection**: Replace hardcoded `reps` array in `app/leaderboards/page.tsx` with data from the `/leaderboard` endpoint.
- [ ] **Database Integrity**: Ensure Supabase or the production database is seeded with all tenant configurations and state profiles.

## 📚 Priority 2: Training Content Completion
The UI for training modules is robust, but the actual educational data needs to be fully populated across all 7 days of the curriculum.

- [ ] **Audit Findings**: Days 1-5 are well-populated in `lib/modules.ts`. Days 6 and 7 need final polish of their interactive segments.
- [ ] **Interactive Cleanup**: Verify all modules (1.1 through 7.2) have:
    - [ ] Audio teaching scripts (Deduplication check).
    - [ ] Interactive workbook prompts.
    - [ ] Knowledge check quizzes.
    - [ ] Associated AI simulation scenarios (Mapped in `lib/scenarios.ts`).
- [ ] **PDF Generation**: Ensure all "Day X" PDFs are available in `public/downloads/` for offline study.

## Proposed Changes

### Frontend
#### [MODIFY] [simulation-ui.tsx](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/solar-trainer/frontend/components/simulation-ui.tsx)
-   Add `handleFinishMission` function to:
    -   Set `isLoadingFeedback` state (need to add this state).
    -   Call `/api/v1/analyze-simulation` with the transcript and scenario details.
    -   Update `feedbackData` state with the API response.
    -   Set `mode` to `'feedback'`.
-   Update the `return` statement to render `SimulationFeedback` when `mode === 'feedback'`.
-   Implement handlers for `SimulationFeedback`:
    -   `onRetry`: Reset state and go back to `'briefing'` or `'roleplay'`.
    -   `onContinue`: Call `onComplete` prop.

### Backend
-   No changes required (endpoints already exist in `analysis.py`).

## Verification Plan

### Manual Verification
1.  Start the Solar Trainer application.
2.  Navigate to a roleplay scenario (e.g., Door-to-Door).
3.  Start a simulation and have a short conversation (at least 3 messages).
4.  Click "Finish Mission" (or trigger auto-success).
5.  **Verify**: The "Analyzing..." state is shown.
6.  **Verify**: The Feedback UI appears with:
    -   Pass/Fail status.
    -   Score.
    -   Strengths and Improvements list.
    -   Full transcript.
7.  Click "Try Again".
    -   **Verify**: Returns to Briefing/Roleplay mode.
8.  Click "Next Scenario" (or Continue).
    -   **Verify**: Calls the `onComplete` callback (logs to console or navigates).
