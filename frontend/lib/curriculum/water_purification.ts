/**
 * Water Purification — Curriculum Shell
 * ========================================
 * Status: PREVIEW | Prefix: water_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const WATER_PURIFICATION_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "water_day_1",
    title: "Water Quality & Health-Based Selling",
    subtitle: "Sell health, safety, and peace of mind — not filters",
    objectives: [
      "Explain common water contaminants and their health implications",
      "Perform a basic water quality test and interpret results for the homeowner",
      "Position whole-home purification as a health investment, not a luxury",
      "Handle 'My water is fine' and 'I just use a pitcher filter' objections",
      "Understand the difference between filtration, softening, and purification",
    ],
    modules: [
      { id: "water_1_1", moduleNumber: "1.1", title: "Water Quality — What's Really in Your Water", duration: "25 min", type: "content" },
      { id: "water_1_2", moduleNumber: "1.2", title: "Testing & Interpretation", duration: "30 min", type: "activity" },
      { id: "water_1_3", moduleNumber: "1.3", title: "Filtration vs. Softening vs. Purification", duration: "25 min", type: "content" },
      { id: "water_1_4", moduleNumber: "1.4", title: "Health-First Value Proposition", duration: "20 min", type: "content" },
      { id: "water_1_5", moduleNumber: "1.5", title: "Common Water Purification Objections", duration: "25 min", type: "activity" },
    ],
    deliverables: ["Water test interpretation guide completed", "Health-first pitch script written"],
    homework: ["Test your own tap water using the provided kit and document results"],
  },
]

export const WATER_PURIFICATION_MODULES: Record<string, ModuleContent> = {
  water_1_1: {
    id: "water_1_1",
    title: "Module 1.1: Water Quality — What's Really in Your Water",
    subtitle: "Show homeowners what they can't see — and why it matters for their family's health.",
    sections: [
      {
        title: "The Invisible Problem",
        type: "text",
        content:
          "Municipal water passes basic safety standards, but 'safe' and 'clean' are not the same thing. Tap water can legally contain trace amounts of chlorine, lead, PFAS (forever chemicals), microplastics, and pharmaceutical residues. A water test makes the invisible visible. When a homeowner sees the actual contents of their water printed on a test strip, the conversation changes from 'I don't need this' to 'How quickly can you fix this?'",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "Water purification customers are motivated by health concerns and quality of life:",
        items: [
          "Bad taste or odor in tap water — chlorine, sulfur, metallic flavors",
          "Hard water causing scale buildup on fixtures, appliances, and shower glass",
          "Dry skin and hair from showering in unfiltered water",
          "Concerns about lead, PFAS, or contaminants — especially with children",
          "Spending $50–$100/month on bottled water and wanting a better solution",
          "Staining on sinks, toilets, and laundry from iron or mineral content",
        ],
      },
      {
        title: "Discovery Questions",
        type: "list",
        content: "These questions turn curiosity into urgency without using scare tactics:",
        items: [
          "Have you ever noticed an unusual taste or smell when you drink your tap water?",
          "Do you see white buildup around your faucets or on your showerhead?",
          "Does anyone in your household have sensitive skin, eczema, or allergies?",
          "Are you currently buying bottled water? How much do you estimate you spend per month?",
          "Have you ever tested your water quality, or do you know what is in your local water supply?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Never claim that a water purification system prevents, treats, or cures any medical condition. Reference contaminant reduction certifications (NSF/ANSI standards) and recommend the homeowner consult their physician for health-specific concerns.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_water_1_1_1",
        type: "open_response",
        label: "Write your opening line for a homeowner who says 'My water is fine — the city takes care of it.'",
        placeholder: "That's a great point — city water does meet basic safety standards. But 'safe' and 'clean' aren't...",
        lines: 3,
      },
    ],
  },
}

export const WATER_PURIFICATION_MODULE_SCENARIOS: Record<string, string[]> = {}
