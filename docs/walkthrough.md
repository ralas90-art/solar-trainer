# Platform Walkthrough & White-Label Finalization

This guide provides a high-level overview of the platform architecture and confirms the completion of the branding abstraction phase.

## Current Platform State
The platform is a multi-surface SaaS training environment, fully decoupled from any specific brand identity. All branding is controlled via the `WHITE_LABEL` configuration object.

## Core Platform Areas
- **Dashboard**: Team and individual performance overview.
- **Training Modules**: Localized lesson content (EN/ES) and interactive slides.
- **AI Sales Simulator**: Real-time voice/text simulations with instant coaching feedback.
- **Leaderboards**: Competitive gamification and team ranking.
- **Certifications**: Professional credential tracks and downloadable certificates.
- **Performance Analytics**: Signal-based coaching and long-term retention tracking.

## White-Label Sanitization (Completed)
- [x] **Dynamic Branding**: UI components utilize `WHITE_LABEL.companyName` for all identity references.
- [x] **Neutral Docs**: Architecture and sales documentation use generic placeholders.
- [x] **Demo Neutrality**: Demo data domains switched to `@ai-sales.demo`.
- [x] **Support Logic**: Unified support email abstraction (`support@training-os.com`).

## Architecture Guidance
- **White-Label First**: Never hardcode brand names; always import and use `WHITE_LABEL` config.
- **Component Reuse**: Leverage established dashboard widgets and platform shell components.
- **Multi-tenant Safety**: Respect `isDemoMode` and persistence boundaries.

## Primary Reference
See [platform_context.md](file:///c:/Users/12132/Desktop/Antigravity%20Solar%20Sales%20Trainer%20Agent/solar-trainer/platform_context.md) for technical implementation details, reusable component inventory, and design system tokens.
