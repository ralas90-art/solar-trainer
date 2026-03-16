# SeptiVolt Platform Context

Last updated: March 10, 2026

## Purpose
This file is the canonical architecture and product-state reference for the active SeptiVolt platform inside this repository.

Use it to guide future implementation work. Extend the current platform architecture. Do not regenerate, replace, or overwrite the implemented foundation systems described below unless a task explicitly requires refactoring them.

## Current Product Status

### 1. Platform Foundation
The global SaaS shell is implemented and active.

Included systems:
- Left sidebar navigation
- Top navigation bar
- Dashboard home screen
- Reusable UI component structure
- Dark mode interface

Design system:
- Name: Electric High Voltage
- Volt Cyan: `#00F2FF`
- Hyper Lime: `#ADFF00`
- Circuit Navy: `#0B1120`
- Conductive Silver: `#94A3B8`

Typography:
- Headings: Inter / Montserrat
- Body: Roboto
- Metrics and data: JetBrains Mono

### 2. AI Sales Training Simulator
The AI simulation experience is implemented as a core platform system.

Included systems:
- Scenario setup panel
- Live simulation conversation panel
- Real-time scoring HUD
- Coaching feedback panel
- Performance summary after simulation

Simulation architecture layers:
- Homeowner persona layer
- Evaluation and scoring layer
- Coaching feedback generation layer

Active simulator component contracts:
- `SimulationConversation`
- `ScenarioCard`
- `ScoreMeter`
- `CoachingTipCard`
- `PerformanceSummary`

### 3. Training Module System
The training module experience is implemented.

Included systems:
- Structured lesson modules
- Script examples and callouts
- Knowledge check questions
- Training progress tracking
- Lesson-to-simulation transition flow

Implemented reusable components:
- `TrainingModuleHeader`
- `LessonCard`
- `ScriptExampleCard`
- `KnowledgeCheckCard`
- `ModuleProgressCard`

### 4. Leaderboards System
The leaderboard experience is implemented.

Included systems:
- Global rankings
- Personal performance ranking
- Skill category leaderboards
- Team leaderboard support
- Gamification indicators

Implemented reusable components:
- `LeaderboardTable`
- `LeaderboardRow`
- `RankBadge`
- `UserRankCard`
- `SkillLeaderboardCard`
- `TeamLeaderboardCard`

### 5. Certification System
The certification experience is implemented.

Included systems:
- Certification progress tracking
- Certification tracks
- Requirement checklist
- Final assessment stage
- Earned certification badges
- Downloadable credential support

Implemented reusable components:
- `CertificationOverviewCard`
- `CertificationTrackCard`
- `CertificationBadge`
- `RequirementChecklist`
- `AssessmentStatusCard`
- `CertificatePreviewCard`

### 6. Rep Performance Analytics Dashboard
The analytics dashboard is implemented.

Included systems:
- Performance summary cards
- Skill performance radar chart
- Score trend charts
- Simulation history table
- Coaching insights panel
- Training recommendations
- Optional team performance analytics

Implemented reusable components:
- `PerformanceStatCard`
- `SkillRadarChart`
- `ScoreTrendChart`
- `SimulationHistoryTable`
- `CoachingInsightCard`
- `TrainingRecommendationCard`
- `TeamPerformanceTable`

## Core Learning Loop
The primary SeptiVolt experience now follows this loop:

Dashboard
-> Training Module
-> AI Simulation
-> Score + Coaching
-> Leaderboard
-> Certification Progress
-> Performance Analytics

Treat this loop as the product backbone for new feature work.

## Architecture Guardrails
Future work should extend the current platform architecture rather than replace implemented systems.

Guardrails:
- Preserve the global application shell and the Electric High Voltage visual system.
- Reuse the established platform component patterns before introducing new parallel UI systems.
- Treat the simulator, training modules, leaderboards, certifications, and analytics as active production architecture.
- Add new features by composing around the current learning loop, not by rebuilding it.
- Avoid generating duplicate versions of existing pages, dashboards, widgets, or summary panels.
- Prefer incremental expansion of current routes, APIs, and component groups over greenfield replacements.

## Repository Alignment
This platform state is reflected in the current repository structure, with some areas already rendered as full pages and others represented through shell routes plus reusable component patterns.

Relevant frontend areas:
- `frontend/app/dashboard`
- `frontend/app/my-training`
- `frontend/app/leaderboards`
- `frontend/app/certifications`
- `frontend/app/analytics`
- `frontend/components/platform`
- `frontend/lib`

Relevant backend areas:
- `backend/main.py`
- `backend/routers/analysis.py`
- `backend/routers/certifications.py`
- `backend/routers/analytics_snapshot.py`
- `backend/routers/kpis.py`

## Next Development Focus
Only one future area was provided clearly in the request:
- Extend the platform architecture instead of regenerating core systems.

The final bullet in the request was truncated after `enterp`, so no additional feature detail is asserted here.
