# Interactive Curriculum Gating & Custom Simulator Unlock System

This plan details the implementation of a secure, production-grade gating system, adaptive quiz thresholds, custom celebratory modals, expert coaching tips, and an admin/demo player drawer.

## User Review Required

> [!IMPORTANT]
> - **Central Gating Mapping**: Locked simulators will now display exactly what day, module, and skill is required to unlock them.
> - **Adaptive Thresholds**: Quiz completion requires meeting a configurable threshold (default `80%`), with explicit certification overrides (e.g. `100%` for `mod_6_8`).
> - **Secure Admin/Demo Bypass**: Explicit bypass checks are used (allowed roles: `admin`, `demo_admin`, `manager`, and username `demo_admin`). No risky `username.includes("admin")` regex or broad patterns.
> - **Player Drawer**: Admin/demo users can jump directly to any day, module, or additive module via a bilingual mobile-friendly drawer inside the training player.
> - **Dynamic Spanish Slides**: Training player dynamically loads Spanish deck URLs and automatically falls back to English if the Spanish URL is empty or matches configuration placeholders.

## Proposed Changes

We will create/modify the following files:

### 1. Unified Locking Rules Mapping

#### [NEW] [scenario-lock-mapping.ts](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/frontend/lib/scenario-lock-mapping.ts)
- Define a central interface `ScenarioLockRule` with `scenarioId`, `requiredModuleId`, `requiredQuizThreshold`, `unlockLabel`, `relatedSkill`, `unlockLabelEs`, and bilingual `expertTips` (`en` and `es`).
- Create and export a comprehensive rules mapping `SCENARIO_TO_MODULE` covering all scenarios from Days 2 to 6, including specific additive modules and certifications.

### 2. Secure Admin/Demo Bypass Helper

#### [NEW] [auth-bypass.ts](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/frontend/lib/auth-bypass.ts)
- Implement `canBypassTrainingLocks(user)` which returns true if:
  - `user.role` is explicitly `'admin'`, `'demo_admin'`, or `'manager'`.
  - `user.username` is explicitly `'demo_admin'`.
- This helper will be imported by both the Simulator Hub and the training module experience.

### 3. Simulator Hub Gating UI

#### [MODIFY] [simulator-hub.tsx](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/frontend/components/simulator-hub.tsx)
- Import `SCENARIO_TO_MODULE` and `canBypassTrainingLocks`.
- Refactor how locks are calculated and visual states rendered:
  - For standard trainees, check if `canBypassTrainingLocks` is false.
  - Look up the lock rule for the card.
  - If locked, render a premium glassmorphic overlay detailing the required module name, target score threshold, and skill focus, along with a direct "Learn Skill" link navigating back to the respective module.
  - If unlocked, render standard interactive rep cards.

### 4. Custom Celebrations & Retry Modals in training player

#### [MODIFY] [guided-module-experience.tsx](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/frontend/components/training-module/guided-module-experience.tsx)
- Import `SCENARIO_TO_MODULE` and `canBypassTrainingLocks`.
- Dynamically calculate Spanish Google Slide URLs with English fallbacks.
- Update `handleQuizComplete` to check quiz score percentage:
  - If `scorePercent >= threshold`: mark quiz complete.
    - If `scorePercent === 100%`: show luxury "Perfect Score" celebration with bouncing trophy, gold pulsing ring, and custom CTA to launch simulator.
    - If `scorePercent < 100%`: show success modal themed around "Simulator Unlocked / High Score" with green badge and pro coaching tip.
  - If `scorePercent < threshold`: mark quiz incomplete, show retry guidance and "The Closer's Edge" Expert Tip to help them prepare for the next attempt.
- Embed bilingual "Expert Pro Tips" inside both celebratory states and the retry guidance.
- Gating curriculum navigation: standard trainees cannot navigate to locked modules in the sidebar/dropdown (visual locks on non-completed and non-next modules), while admin/demo users bypass this.
- Add an "Admin Drawer" button inside the player visible ONLY to admin/demo users that opens a clean, mobile-friendly list of all days, modules, and additive modules for immediate teleportation.

## Verification Plan

### Automated Tests
- Build and run Next.js compilation via command line to verify zero TypeScript errors:
  `npm run build` or `npx tsc --noEmit` within `frontend/`.

### Manual Verification (Browser Subagent)
1. **Curriculum Gating for Trainees**:
   - Log in as a trainee user.
   - Go to Simulator Hub.
   - Verify Day 3 cards show premium visual locks with exact module and quiz passing percentage requirements (e.g. "Requires Day 3 - Discovery Framework Quiz (Score: 80%+)").
   - Click "Learn Skill" -> verify it redirects to the exact training module page.

2. **Adaptive Quiz Unlocking**:
   - Navigate to a module.
   - Take the knowledge check quiz.
   - Scenarios to verify:
     - **Perfect Score (100%)**: Verify luxury modal with gold trophy, particle glowing style, and direct "Launch Simulator" link displays.
     - **Passing Score (80%-99%)**: Verify standard unlock success modal displays.
     - **Failing Score (<80%)**: Verify retry modal displays with clear score feedback and retry guidance.

3. **Bilingual Google Slide Rendering**:
   - Toggle language preference to Spanish.
   - Load training player.
   - Verify Spanish slide URL is rendered in the iframe.
   - Delete/mock a slide URL to verify fallback renders English slides instead of blank placeholders.

4. **Admin Module Library Drawer & Bypass**:
   - Log in as `demo_admin` / admin role.
   - Verify the "Module Library" button appears in the player.
   - Click it to verify drawer opens with all modules. Click `mod_1_5a` -> verify it loads the correct slide, audio, workbook, and quiz immediately.
   - Go to Simulator Hub and verify all cards are unlocked.
