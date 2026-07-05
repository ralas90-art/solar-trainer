/**
 * Stucco — Curriculum Shell
 * ============================
 * Status: PREVIEW | Prefix: stucco_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const STUCCO_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "stucco_day_1",
    title: "Stucco Systems & Exterior Protection Selling",
    subtitle: "Sell protection, curb appeal, and long-term structural value",
    objectives: [
      "Explain the difference between traditional stucco and EIFS systems",
      "Identify common stucco failures and their underlying causes",
      "Position stucco repair/installation as structural protection, not cosmetics",
      "Handle 'It's just cosmetic' and 'I'll paint over it' objections",
      "Understand moisture intrusion risks and how to communicate them responsibly",
    ],
    modules: [
      { id: "stucco_1_1", moduleNumber: "1.1", title: "Stucco Systems — How They Protect Your Home", duration: "25 min", type: "content" },
      { id: "stucco_1_2", moduleNumber: "1.2", title: "Common Failures & Warning Signs", duration: "25 min", type: "content" },
      { id: "stucco_1_3", moduleNumber: "1.3", title: "The Structural Protection Pitch", duration: "25 min", type: "activity" },
      { id: "stucco_1_4", moduleNumber: "1.4", title: "Common Stucco Objections", duration: "25 min", type: "activity" },
    ],
    deliverables: ["Stucco inspection checklist completed", "Structural protection script written"],
    homework: ["Document 3 examples of stucco damage you observe in your neighborhood"],
  },
]

export const STUCCO_MODULES: Record<string, ModuleContent> = {
  stucco_1_1: {
    id: "stucco_1_1",
    title: "Module 1.1: Stucco Systems — How They Protect Your Home",
    subtitle: "Stucco is not a cosmetic finish — it is a weather barrier that protects the structure underneath.",
    sections: [
      {
        title: "More Than a Pretty Wall",
        type: "text",
        content:
          "Stucco is a multi-layer exterior cladding system. It consists of a metal lath base, a scratch coat, a brown coat, and a finish coat. Together, these layers create a weather-resistant shell that protects the wooden framing underneath from moisture, wind, and UV damage. When stucco cracks or fails, water gets behind it and causes rot, mold, and structural damage that is invisible from the outside. By the time the homeowner sees a problem, the hidden damage can be extensive.",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "Stucco customers are typically motivated by visible deterioration or sale preparation:",
        items: [
          "Visible cracks, staining, or discoloration on exterior walls",
          "Soft spots or areas where stucco has detached from the wall",
          "Moisture or mold discovered inside the home near exterior walls",
          "Preparing to sell and the inspection flagged stucco issues",
          "HOA or city code enforcement notices about exterior condition",
        ],
      },
      {
        title: "Discovery Questions",
        type: "list",
        content: "These questions move the conversation from 'cosmetic fix' to 'structural protection':",
        items: [
          "Have you noticed any cracks or discoloration on your stucco exterior?",
          "When was the last time your stucco was inspected or repaired?",
          "Have you experienced any moisture issues or musty smells inside the home?",
          "Are you planning to sell this home in the next few years?",
          "Has a home inspector or HOA flagged any issues with your exterior?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Never diagnose structural damage without proper inspection. Recommend a professional moisture test before making claims about hidden damage. Present repair/replacement as a proactive protection measure, not an emergency scare tactic.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_stucco_1_1_1",
        type: "open_response",
        label: "Write your explanation of why a crack in stucco is not 'just cosmetic' — in 2 sentences.",
        placeholder: "A crack in stucco might look like a surface issue, but behind that crack...",
        lines: 3,
      },
    ],
  },
}

export const STUCCO_MODULE_SCENARIOS: Record<string, string[]> = {}
