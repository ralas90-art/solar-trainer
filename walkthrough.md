# SeptiVolt Walkthrough

## Overview
SeptiVolt is now a multi-surface SaaS training platform, not just a simulation UI. The current implemented product state is documented in `septivolt_platform_context.md`, which should be treated as the canonical architecture reference for future work.

## Core Platform Areas
- Dashboard
- Training modules
- AI sales simulator
- Leaderboards
- Certifications
- Performance analytics

## Core Learning Loop
The active learning loop is:

Dashboard
-> Training Module
-> AI Simulation
-> Score + Coaching
-> Leaderboard
-> Certification Progress
-> Performance Analytics

## Architecture Guidance
- Extend the existing platform architecture instead of regenerating core systems.
- Reuse established page structures, dashboard widgets, and platform component patterns.
- Preserve the Electric High Voltage design system and dark-mode shell.
- Treat implemented simulator, leaderboard, certification, and analytics flows as active architecture.

## Primary Reference
See `septivolt_platform_context.md` for the current product state, reusable component inventory, design system tokens, and implementation guardrails.
