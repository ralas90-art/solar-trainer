---
name: brand-guidelines
description: Applies the SeptiVolt Electric High Voltage brand identity — colors, typography, and visual style — to any artifact such as slides, HTML pages, docs, dashboards, or reports. Use this skill whenever brand colors, style guidelines, visual formatting, or company design standards apply to a SeptiVolt artifact.
license: Complete terms in LICENSE.txt
---

# SeptiVolt Brand Styling

## Overview

This skill applies the **SeptiVolt Electric High Voltage** visual identity to any artifact. SeptiVolt is an AI-powered solar sales training platform. The brand represents energy, acceleration, mastery, intelligence, and renewable technology.

**Brand feel:** _"Elite training for the next generation of solar professionals."_

**Keywords**: branding, SeptiVolt, visual identity, post-processing, styling, brand colors, typography, Electric High Voltage, dark mode, design system, solar training

---

## Brand Guidelines

### Core Color Palette

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| Primary Accent | **Volt Cyan** | `#00F2FF` | CTAs, interactive SVG elements, AI highlights, active borders |
| Secondary Accent | **Hyper Lime** | `#ADFF00` | Success states, progress, achievements, leaderboard |
| Base Background | **Circuit Navy** | `#0B1120` | Primary dark background for all interfaces |
| Neutral Text | **Conductive Silver** | `#94A3B8` | Body text, UI labels, secondary data |
| Card Surface | **Dark Graphite** | `#1E293B` | Card backgrounds, secondary surfaces |
| Light Contrast | **Interface Gray** | `#E2E8F0` | High-contrast text on dark, dividers |
| Pure | **White** | `#FFFFFF` | Primary headline text on dark backgrounds |

### Accent Color Rotation

When multiple accent colors are needed (e.g., chart series, shape fills), cycle through:
1. Volt Cyan `#00F2FF` — primary
2. Hyper Lime `#ADFF00` — secondary
3. `rgba(0, 242, 255, 0.5)` — Volt Cyan at 50% — tertiary
4. `rgba(173, 255, 0, 0.5)` — Hyper Lime at 50% — quaternary

**Never use** generic blue (`#3B82F6`), amber, orange, or red as accents — these are not SeptiVolt colors.

### Gradient Pairings

| Gradient | Use Case |
|----------|----------|
| `linear-gradient(135deg, #00F2FF, #ADFF00)` | Progress bars, badges, certifications, level indicators |
| `linear-gradient(135deg, #00F2FF, #00b8c8)` | Primary CTA buttons |
| `radial-gradient(ellipse, rgba(0,242,255,0.08), transparent)` | Background glow accents |
| `linear-gradient(90deg, transparent, #00F2FF, transparent)` | Horizontal divider accent lines |

### Glow & Shadow Standards

| State | Shadow Value |
|-------|-------------|
| Active card (Volt Cyan) | `0 0 20px rgba(0, 242, 255, 0.25), 0 0 40px rgba(0, 242, 255, 0.1)` |
| Strong glow (hover CTA) | `0 0 30px rgba(0, 242, 255, 0.5), 0 0 60px rgba(0, 242, 255, 0.2)` |
| Success / Lime glow | `0 0 20px rgba(173, 255, 0, 0.25), 0 0 40px rgba(173, 255, 0, 0.1)` |
| Text glow (headline) | `text-shadow: 0 0 24px rgba(0, 242, 255, 0.5)` |

---

## Typography System

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Display Headings** | Montserrat | 800–900 | Module titles, dashboard h1, hero text |
| **UI Headings** | Montserrat | 700 | Card titles, section headers |
| **Body Text** | Roboto | 300–500 | Lesson content, explanations, descriptions |
| **HUD / Data / Labels** | JetBrains Mono | 400–700 | All numeric metrics, AI scores, badges, tags |

### JetBrains Mono — Mandatory Usage

JetBrains Mono **must** be applied to:
- All numeric data (XP, scores, streak counts, rankings)
- AI simulation real-time feedback text
- Module type chips / difficulty badges
- Performance scorecard values
- Training duration labels
- Technical metric outputs

This is the key font choice that establishes the **simulator feel** vs. a standard course platform.

### Font Fallback Stack

```
Montserrat → Inter → Arial → sans-serif        (headings)
Roboto → Helvetica Neue → Arial → sans-serif   (body)
JetBrains Mono → Fira Code → Courier New → monospace  (data/HUD)
```

---

## Visual Style Directives

| Directive | Specification |
|-----------|--------------|
| **Color mode** | Dark mode primary — Circuit Navy background always |
| **Corner radius** | 8px on all cards and interactive elements |
| **Card style** | Glassmorphism: `rgba(30,41,59,0.6)` bg + `backdrop-filter: blur(16px)` + `1px solid rgba(0,242,255,0.1)` border |
| **Active borders** | `1px solid rgba(0,242,255,0.3)` + soft volt glow |
| **Background texture** | Subtle circuit grid SVG at 4–6% opacity over Circuit Navy |
| **UI inspiration** | Linear.app precision + Stripe analytics + Duolingo gamification |

### HUD / Glowing Corner Borders

For simulation panels, mission cards, and data displays, apply glowing corner accents:
- Top-left: `2px solid #00F2FF` border top + left, 8px each
- Bottom-right: `2px solid #00F2FF` border bottom + right, 8px each
- Overall border: `1px solid rgba(0,242,255,0.2)`

---

## The 7-Day Visual Motif

References to the number **7** should appear wherever appropriate to reinforce the 7-Day Solar Sales Accelerator:

- 7-segment progress rings (one per day)
- 7-dot strip indicators in headers
- 7-star simulation rating systems
- 7 milestone badges (one per day)

---

## Application Checklist

When applying SeptiVolt brand to any artifact, verify:

- [ ] Background is Circuit Navy `#0B1120` (or darker variant)
- [ ] Interactive/accent colors use Volt Cyan `#00F2FF`
- [ ] Success/progress colors use Hyper Lime `#ADFF00`
- [ ] Headings use Montserrat 700–900
- [ ] Body text uses Roboto
- [ ] All numeric data uses JetBrains Mono
- [ ] No generic blue, amber, or orange accents present
- [ ] Active elements have Volt Cyan glow shadow
- [ ] Corner radius is 8px
- [ ] Cards use glassmorphism style
