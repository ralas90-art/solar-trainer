# SeptiVolt Deployment Manifest

This document serves as the authoritative source of truth for the SeptiVolt production infrastructure.

## 1. Route Inventory

### Public Marketing & Legal
- `/` : Landing page / Hero / Trust section.
- `/pricing` : Subscription tiers and feature comparison.
- `/enterprise` : High-volume / custom implementation landing page.
- `/contact` : Lead capture for general inquiries.
- `/acceptable-use` : Legal compliance.
- `/cookie-policy` : Legal compliance.
- `/privacy` : Legal compliance.
- `/refund-policy` : Legal compliance.
- `/terms` : Legal compliance.

### Conversion Funnels
- `/solar-sales-training-assessment` : Weighted lead qualification funnel (High Value).

### Training Platform (Authenticated)
- `/login` : User authentication entry point.
- `/signup` : New rep registration.
- `/dashboard` : Rep performance overview.
- `/my-training` : Curriculum entry point.
- `/my-training/[moduleId]` : Lesson player / Quiz interface.
- `/curriculum-preview` : Marketing-focused training sample.
- `/certifications` : Milestone achievement viewing.
- `/ai-simulator` : (Beta) Interactive roleplay interface.

### Management & Operations
- `/manager` : Team visibility and analytics (Manager/Admin role).
- `/team-hub` : Team management interface.
- `/analytics` : Platform-wide usage metrics.
- `/kpis` : Key performance indicator tracking.
- `/leaderboards` : Gamification / Rep rankings.
- `/dashboard/reps/[userId]` : Individual rep performance drill-down.

### Internal / System
- `/onboarding/[token]` : Invitation-based registration.
- `/settings` : Profile management.
- `/settings/billing` : Subscription management.
- `/settings/company` : Team branding / configuration.
- `/payment/success` : Stripe/LemonSqueezy callback.
- `/payment/cancel` : Stripe/LemonSqueezy callback.

---

## 2. API Schema

### External Integrations
- `POST /api/assessment-submit`
  - **Purpose**: Proxies assessment data to GoHighLevel (GHL).
  - **Trigger**: Final step of the assessment funnel.
  - **Auth**: Server-side secret usage.
- `POST /api/manus-trigger`
  - **Purpose**: Triggers Manus agent for automated research/processing.
  - **Trigger**: High-value enterprise lead capture.

---

## 3. Environment Variables (Required)

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `GHL_WEBHOOK_URL` | Server | Webhook endpoint for GoHighLevel CRM integration. |
| `MANUS_API_KEY` | Server | API key for Manus agent orchestration. |
| `NEXT_PUBLIC_SITE_URL` | Client/Server | Base URL for metadata and absolute path resolution. |

---

## 4. Asset Conventions

### Audio Narration
- Path: `/audio/modules/[lang]/mod_[id]/section_[num].mp3`
- Fallback: `narration-service.ts` handles graceful degradation if file is missing.

### Images
- Path: `/public/`
- Standardized file: `platform_mockup_showcase.png` (Used in hero/meta).

---

## 5. Deployment Safety
- **`.vercelignore`**: Must use root-scoped `/public` and `/audio` to prevent stripping assets.
- **`.gitignore`**: Must exclude `.env`, `.env.local`, and `.vercel`.
- **Smoke Tests**: Required after every push to `master`.
