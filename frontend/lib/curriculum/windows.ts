/**
 * Windows — Curriculum Shell
 * ============================
 * Status: PREVIEW | Prefix: win_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const WINDOWS_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "win_day_1",
    title: "Window Replacement Fundamentals & Value Selling",
    subtitle: "Sell comfort, efficiency, and curb appeal — not glass and frames",
    objectives: [
      "Explain window energy ratings (U-factor, SHGC) in homeowner-friendly language",
      "Identify signs that windows need replacement vs. simple repair",
      "Position window replacement as an energy, comfort, and aesthetic upgrade",
      "Handle 'Windows are too expensive' and 'I'll just fix the seals' objections",
      "Understand available rebates and financing options",
    ],
    modules: [
      { id: "win_1_1", moduleNumber: "1.1", title: "Window Systems & Energy Performance", duration: "25 min", type: "content" },
      { id: "win_1_2", moduleNumber: "1.2", title: "Signs It's Time to Replace", duration: "20 min", type: "content" },
      { id: "win_1_3", moduleNumber: "1.3", title: "The Triple Value Proposition", duration: "25 min", type: "activity" },
      { id: "win_1_4", moduleNumber: "1.4", title: "Financing & Rebate Navigation", duration: "20 min", type: "content" },
      { id: "win_1_5", moduleNumber: "1.5", title: "Common Window Objections", duration: "25 min", type: "activity" },
    ],
    deliverables: ["Window assessment checklist completed", "Triple value pitch script written"],
    homework: ["Assess the windows in your own home using the checklist"],
  },
]

export const WINDOWS_MODULES: Record<string, ModuleContent> = {
  win_1_1: {
    id: "win_1_1",
    title: "Module 1.1: Window Systems & Energy Performance",
    subtitle: "Speak with confidence about what makes one window better than another.",
    sections: [
      {
        title: "Why Windows Matter More Than Homeowners Think",
        type: "text",
        content:
          "Windows are responsible for 25–30% of a home's heating and cooling energy loss. Old, single-pane, or poorly sealed windows force HVAC systems to work harder, increase energy bills, and create uncomfortable drafts. Modern replacement windows with Low-E coatings, argon gas fills, and insulated frames dramatically reduce energy transfer. Your pitch: 'Your windows are either saving you money or costing you money every single month. There is no in between.'",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "Window replacement customers are motivated by comfort, aesthetics, and efficiency:",
        items: [
          "Drafts near windows — especially noticeable in winter",
          "Condensation or fog between double-pane glass (seal failure)",
          "Difficulty opening, closing, or locking old windows",
          "Faded furniture and flooring from UV exposure through old glass",
          "High energy bills despite recent HVAC upgrades",
          "Wanting to improve the home's curb appeal before selling",
        ],
      },
      {
        title: "Discovery Questions",
        type: "list",
        content: "These questions uncover the real motivation behind window interest:",
        items: [
          "Do you notice any drafts or cold spots near your windows during winter?",
          "Have you seen any fog or condensation between the glass panes?",
          "Do all of your windows open, close, and lock smoothly?",
          "How old are your current windows? Do you know if they are original to the home?",
          "Are you more concerned about energy savings, comfort, appearance, or all three?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Energy savings estimates should reference ENERGY STAR or NFRC ratings. Never guarantee specific dollar savings — provide estimated ranges based on the window specifications and recommend the homeowner verify with their utility provider.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_win_1_1_1",
        type: "open_response",
        label: "Write your opening explanation of why windows matter, in 2 sentences a homeowner would understand.",
        placeholder: "Your windows are responsible for up to 30% of...",
        lines: 3,
      },
    ],
  },
}

export const WINDOWS_MODULE_SCENARIOS: Record<string, string[]> = {}
