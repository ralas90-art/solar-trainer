---
name: theme-factory
description: Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 11 pre-set themes with colors/fonts that you can apply to any artifact that has been created, or can generate a new theme on-the-fly. The default SeptiVolt theme is "Electric High Voltage" — always use it unless another theme is explicitly requested.
license: Complete terms in LICENSE.txt
---

# Theme Factory Skill

This skill provides a curated collection of professional font and color themes, each with carefully selected color palettes and font pairings. Once a theme is chosen, it can be applied to any artifact — slides, HTML pages, documents, reports, or dashboards.

## Purpose

Apply consistent, professional styling to any artifact. Each theme includes:
- A cohesive color palette with hex codes
- Complementary font pairings for headers and body text
- A distinct visual identity for different contexts and audiences

---

## Default Theme — SeptiVolt Platform

> **When creating artifacts for the SeptiVolt platform or any solar sales training content, always apply the `Electric High Voltage` theme automatically without asking. Only prompt for theme selection when creating a non-platform artifact.**

---

## Usage Instructions

1. **Check context first**: If the artifact is for SeptiVolt, apply **Electric High Voltage** immediately
2. **Show the theme showcase** (for non-platform artifacts): Display `theme-showcase.pdf` for user preview
3. **Ask for their choice**: Ask which theme to apply
4. **Wait for selection**: Get explicit confirmation
5. **Apply the theme**: Apply selected theme's colors and fonts throughout

---

## Themes Available

### ⚡ Theme 11 — Electric High Voltage *(SeptiVolt Default)*

The signature theme of the SeptiVolt platform. Designed for AI-powered training simulators, performance dashboards, and enterprise solar sales tools.

**Identity:** Elite training simulator · High-performance dashboard · Dark-mode first

| Role | Value |
|------|-------|
| **Primary Accent** | Volt Cyan `#00F2FF` |
| **Secondary Accent** | Hyper Lime `#ADFF00` |
| **Background** | Circuit Navy `#0B1120` |
| **Card Surface** | Dark Graphite `#1E293B` |
| **Body Text** | Conductive Silver `#94A3B8` |
| **Headline Text** | White `#FFFFFF` |
| **Gradient** | `linear-gradient(135deg, #00F2FF, #ADFF00)` |

| Role | Font | Weight |
|------|------|--------|
| **Headings** | Montserrat | 800–900 (Extra Bold/Black) |
| **Body** | Roboto | 300–500 |
| **Data / HUD / Badges** | JetBrains Mono | 400–700 |

**Visual style:**
- Dark mode primary (always Circuit Navy background)
- Glassmorphism card surfaces (`rgba(30,41,59,0.6)` + `backdrop-filter: blur(16px)`)
- Volt Cyan glowing borders on active/interactive elements
- Hyper Lime for all success and progress indicators
- 8px corner radius on all cards/buttons
- Subtle circuit grid SVG texture at 4–6% opacity
- Soft glow shadows: `0 0 20px rgba(0,242,255,0.25)`

---

### Theme 1 — Ocean Depths
Professional and calming maritime theme.
Colors: Deep Navy `#1B3A5C`, Ocean Blue `#2E86AB`, Seafoam `#A8DADA`, Sand `#F5E6CA`, White `#FFFFFF`
Fonts: Merriweather (headings), Source Sans Pro (body)

### Theme 2 — Sunset Boulevard
Warm and vibrant sunset colors.
Colors: Deep Crimson `#8B1A1A`, Warm Orange `#E8671B`, Golden `#F4C430`, Peach `#FFB347`, Cream `#FFF8DC`
Fonts: Playfair Display (headings), Lato (body)

### Theme 3 — Forest Canopy
Natural and grounded earth tones.
Colors: Deep Forest `#1B4332`, Moss `#40916C`, Sage `#95D5B2`, Bark `#8B6914`, Parchment `#F5F5DC`
Fonts: Libre Baskerville (headings), Open Sans (body)

### Theme 4 — Modern Minimalist
Clean and contemporary grayscale.
Colors: Charcoal `#2C2C2C`, Medium Gray `#757575`, Light Gray `#BDBDBD`, Off-White `#F5F5F5`, Black `#1A1A1A`
Fonts: Inter (headings), Inter (body)

### Theme 5 — Golden Hour
Rich and warm autumnal palette.
Colors: Deep Amber `#92400E`, Amber `#D97706`, Golden `#F59E0B`, Warm Cream `#FEF3C7`, Brown `#78350F`
Fonts: Cormorant Garamond (headings), Nunito (body)

### Theme 6 — Arctic Frost
Cool and crisp winter-inspired theme.
Colors: Glacier `#0077B6`, Ice Blue `#90E0EF`, Frost `#CAF0F8`, Snow `#F8F9FA`, Deep `#023E8A`
Fonts: Raleway (headings), Roboto (body)

### Theme 7 — Desert Rose
Soft and sophisticated dusty tones.
Colors: Dusty Rose `#C9788A`, Sandstone `#D4A574`, Desert `#B8895A`, Mauve `#A67B9A`, Blush `#F5E6E8`
Fonts: Josefin Sans (headings), Lora (body)

### Theme 8 — Tech Innovation
Bold and modern tech aesthetic.
Colors: Electric Blue `#0066FF`, Neon Green `#00FF87`, Dark Navy `#0A0E1A`, Steel `#8892A4`, White `#FFFFFF`
Fonts: Space Grotesk (headings), DM Sans (body)

### Theme 9 — Botanical Garden
Fresh and organic garden colors.
Colors: Leaf `#4A7C59`, Petal `#E8A0B4`, Stem `#8FBA80`, Earth `#A0785A`, Sunlight `#F7F0D4`
Fonts: DM Serif Display (headings), Work Sans (body)

### Theme 10 — Midnight Galaxy
Dramatic and cosmic deep tones.
Colors: Deep Space `#0D0221`, Nebula Purple `#7B2D8B`, Star Blue `#4169E1`, Cosmic Pink `#FF69B4`, Stardust `#E8E8FF`
Fonts: Exo 2 (headings), Quicksand (body)

---

## Theme Details

Each theme is defined in the `themes/` directory with complete specifications including:
- Full color palette with hex codes
- Font pairings for headers and body text
- Distinct visual identity suitable for different contexts

## Application Process

After a preferred theme is selected:
1. Read the corresponding theme file from the `themes/` directory
2. Apply colors and fonts consistently throughout the artifact
3. Ensure proper contrast and readability
4. Maintain the theme's visual identity across all slides/sections

## Create Your Own Theme

To handle cases where none of the existing themes work:
1. Based on the provided description, generate a custom theme with a name, palette, and font pairing
2. Show the theme for review and confirmation
3. Apply as described above

When creating custom themes for SeptiVolt-related artifacts, extend from the **Electric High Voltage** base — adjust hue/saturation only, never replace Circuit Navy as the base or remove JetBrains Mono from data contexts.
