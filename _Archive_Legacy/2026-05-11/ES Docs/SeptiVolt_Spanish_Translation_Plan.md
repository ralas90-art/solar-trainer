# SeptiVolt Bilingual Translation Plan
**Target:** Spanish (Latin American — Neutral / US Market)**  
**Purpose:** Upgrade training platform for Spanish-speaking solar reps and bilingual companies  
**Status:** PLAN ONLY — not yet executed  
**Date Created:** 2026-04-15

---

## 1. SCOPE INVENTORY

### 1A. Deliverable Types & Estimated Volume

| Deliverable | Count | Est. Words | Est. Tokens | Translation Method |
|---|---|---|---|---|
| MASTER_CURRICULUM_PACK.md | 1 file (7 days, 63 modules) | ~16,300 | ~21,700 | Claude — batch by day |
| V2 Module Packages (.docx + .md) | 4 days built (Days 1,3,4,5) | ~28,000 | ~37,000 | Claude — batch by day |
| PPTX Slide Decks (12 modules) | 12 files, ~76 slides | ~4,500 (text only) | ~6,000 | Claude — translate JS content arrays, rebuild |
| Trainer Script Workbooks | 7 days | ~21,000 | ~28,000 | Claude — batch by day |
| Trainee Workbooks | 7 days | ~14,000 | ~18,700 | Claude — batch by day |
| AI Narration Scripts (ElevenLabs) | Pending full build | ~17,500 | ~23,300 | Claude — translate after English finalized |
| **TOTAL** | | **~101,300** | **~134,700** | |

> **Note:** PPTX slides are the fastest win because they're programmatically generated — translating the JavaScript content arrays (not the rendered files) means one rebuild command produces all 12 Spanish decks.

---

## 2. LANGUAGE STANDARDS

### Dialect & Register
- **Dialect:** Latin American Spanish — neutral register (no regional slang)
- **Formality:** Professional but warm — matches the "consultant not salesperson" tone
- **Addressee:** "tú" for rep-to-trainee content; "usted" for rep-to-homeowner scripts

### Terminology Rules
| Term Type | Rule | Example |
|---|---|---|
| Technical solar terms | Keep in English | NEM 3.0, ITC, SGIP, kWh, kW, PV |
| Bracket placeholders | Never translate | `[COMPANY_NAME]`, `[MARKET]`, `[TRAINER NAME]` |
| Financial/legal terms | Spanish + English in parentheses on first use | "crédito fiscal (ITC)" |
| CRM/tool names | Keep in English | GoHighLevel, Aurora, HelioScope |
| Industry acronyms | Spell out in Spanish on first use | "Net Energy Metering (NEM 3.0)" |

### Output Format Options (Choose One Per Deliverable Type)
- **Spanish-Only (ES):** Full replacement. Best for reps who read only Spanish.
- **Bilingual Side-by-Side:** English + Spanish columns. Best for trainers managing mixed teams.
- **Bilingual Interleaved:** English paragraph → Spanish paragraph. Best for self-study.

**Recommended default:** Spanish-Only for PPTX decks and Trainee Workbooks; Bilingual Side-by-Side for Trainer Workbooks.

---

## 3. TOKEN/RATE LIMIT STRATEGY

### Claude Context Window Awareness
- **Input limit:** ~200K tokens per request (Sonnet)
- **Practical output limit per request:** ~4,000–6,000 words of translated content (quality degrades on very long outputs)
- **Safe batch size:** 1 day's module content = ~2,300 words → well within limits
- **Between-request pause:** Wait for full response before sending next batch; do not fire concurrent translation requests

### Chunking Rules by Deliverable

**MASTER_CURRICULUM_PACK.md**
- Translate 1 day per session request
- Day 1 (~2,200 words) → Day 2 → Day 3 → ... → Day 7
- Total: 7 translation requests (can split larger days if needed)

**V2 Module Packages (DOCX/MD)**
- Translate 1 day's module package per session request
- Each day = ~7,000 words → split into 2 requests if content-heavy
- Sequence: Day 4 → Day 5 → Day 1 → Day 3 → Day 6 → Day 2 → Day 7 (matches build order)

**PPTX Slide Content (Most Efficient Path)**
- Extract all English strings from `build_all.js` content arrays
- Translate all 12 modules' text content in 1–2 requests (~4,500 words total)
- Replace English arrays with Spanish in new file `build_all_es.js`
- Run `node build_all_es.js` → produces all 12 `Module_XXX_ES.pptx` files
- **This is the fastest deliverable: 2 translation requests → 12 finished PPTX files**

**Trainer Scripts & Workbooks**
- Translate 1 day per session (heaviest content — Trainer Scripts ~3,000 words/day)
- If a day exceeds 3,500 words, split by module set (first half / second half)

**AI Narration Scripts**
- Translate AFTER all English scripts are finalized (don't translate drafts)
- 1 day per request (~2,500 words of narration per day)
- ElevenLabs uses Spanish voices — specify: `es-MX` (Mexican Spanish) or `es-US` for US market; `es-SV` for El Salvador market

---

## 4. TRANSLATION SEQUENCING (PRIORITY ORDER)

Execute in this order to maximize early impact:

| Phase | Deliverable | Why First | Est. Sessions |
|---|---|---|---|
| **Phase 1** | PPTX Slide Decks (12 modules) | Fastest ROI — visual, shareable, re-buildable | 2 |
| **Phase 2** | MASTER_CURRICULUM_PACK.md | Foundation — used to generate all other content | 7 |
| **Phase 3** | Trainee Workbooks (7 days) | Reps need these during training | 7 |
| **Phase 4** | V2 Module Packages | Current active build — translate as each day completes | 1 per day |
| **Phase 5** | Trainer Script Workbooks | Managers/trainers — important but less urgent than rep-facing | 7 |
| **Phase 6** | AI Narration Scripts | Last because they depend on finalized English versions | 7 |

**Total estimated Claude sessions to complete full translation: ~35–40 sessions**  
(Each session = 1 focused translation request + QA review)

---

## 5. SESSION WORKFLOW (HOW EACH TRANSLATION SESSION RUNS)

```
TRANSLATION SESSION TEMPLATE:
1. State the target: "Translate Day 3 of MASTER_CURRICULUM_PACK.md to Spanish"
2. Paste the relevant content block (1 day / 1 module package)
3. Include the terminology rules (or reference this plan)
4. Claude translates + returns Spanish version
5. Quick spot-check: verify 3–5 bracket placeholders survived, 3–5 technical terms in English
6. Save output to: [filename]_ES.md / _ES.docx
7. Wait for full output before starting next batch
```

### PPTX Session (Different Flow)
```
PPTX TRANSLATION SESSION:
1. Provide the JS content arrays from build_all.js (slide titles, bullets, tips)
2. Request: "Translate all English strings to Spanish. Keep [COMPANY_NAME] brackets, 
   NEM/ITC/SGIP/kWh/kW in English. Return as replacement JS object."
3. Receive translated JS → paste into build_all_es.js
4. Run: node build_all_es.js
5. Visual QA: spot-check 3 slides per module (title, one content, one exercise)
```

---

## 6. FILE NAMING CONVENTION

| English Version | Spanish Version |
|---|---|
| `Module_1.5a_Utility_Bill_NEM3.pptx` | `Module_1.5a_Analisis_Recibo_NEM3_ES.pptx` |
| `septivolt_v2_day1_modules.docx` | `septivolt_v2_day1_modules_ES.docx` |
| `MASTER_CURRICULUM_PACK.md` | `MASTER_CURRICULUM_PACK_ES.md` |
| Trainer Script Day 1 | `Trainer_Script_Day1_ES.docx` |
| Trainee Workbook Day 1 | `Trainee_Workbook_Day1_ES.docx` |

> All Spanish files live in a `/ES/` subfolder within the Solar Sales Accelerator workspace.

---

## 7. QUALITY CONTROL

### Automated Checks (Run After Each File)
- Search for untranslated English paragraphs > 3 sentences
- Search for missing bracket placeholders (`[COMPANY_NAME]`, etc.)
- Search for translated technical terms that should stay in English (NEM, ITC, SGIP)

### Spot-Check Protocol (Human Review)
For each translated day, a bilingual reviewer should check:
- [ ] Does the tone match "consultant, not salesperson"?
- [ ] Are homeowner-facing scripts in `usted` form?
- [ ] Are trainer-facing instructions in `tú` form?
- [ ] Does "El Salvador Spanish" phrasing need adjusting for US market (or vice versa)?
- [ ] Are any cultural references (holidays, regulations) market-specific?

---

## 8. PLATFORM INTEGRATION NOTES

When integrated into the SeptiVolt training platform:
- Store both English and Spanish versions as separate content tracks
- Use a language toggle at the module level (not page level)
- ElevenLabs voice assignments: Spanish track → `es-MX` or `es-419` (Latin American)
- Gamification/quiz system: translate question + answer options (answer logic unchanged)
- `[COMPANY_NAME]` bracket should remain in both language versions for white-label replacement

---

## 9. WHAT TO DO NEXT

**Immediate next action (Phase 1 — fastest win):**  
Start a new session and say:
> "Translate all slide content from build_all.js to Spanish. Here are the content arrays: [paste modules array]. Keep NEM 3.0, ITC, SGIP, kWh, kW in English. Keep all bracket placeholders. Use formal Latin American Spanish."

Then rebuild with `node build_all_es.js` → 12 Spanish PPTX files in under 5 minutes.

**After Phase 1:** Begin Phase 2 (MASTER_CURRICULUM_PACK) one day at a time.
