/**
 * Retail Energy / Electric Provider Switching — Curriculum Shell
 * ===============================================================
 * Status: PREVIEW | Prefix: energy_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const ENERGY_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "energy_day_1",
    title: "Deregulated Energy Markets & Customer Pain Points",
    subtitle: "Understand how energy deregulation works and why homeowners overpay",
    objectives: [
      "Explain energy deregulation in plain language without industry jargon",
      "Identify which states and territories offer customer choice",
      "Read and interpret a utility bill to show rate comparison opportunities",
      "Understand fixed vs. variable rate structures and break-even timelines",
      "Handle the 'Is this a scam?' objection with confidence and documentation",
    ],
    modules: [
      { id: "energy_1_1", moduleNumber: "1.1", title: "How Energy Deregulation Works", duration: "25 min", type: "content" },
      { id: "energy_1_2", moduleNumber: "1.2", title: "Reading Utility Bills for Rate Comparison", duration: "30 min", type: "activity" },
      { id: "energy_1_3", moduleNumber: "1.3", title: "Fixed vs. Variable Rate Economics", duration: "25 min", type: "content" },
      { id: "energy_1_4", moduleNumber: "1.4", title: "Overcoming Skepticism & Trust Barriers", duration: "30 min", type: "activity" },
      { id: "energy_1_5", moduleNumber: "1.5", title: "Compliance & Regulatory Boundaries", duration: "20 min", type: "content" },
    ],
    deliverables: ["Rate comparison worksheet completed", "Compliance boundaries checklist signed"],
    homework: ["Compare 3 real utility bills using the rate comparison worksheet"],
  },
]

export const ENERGY_MODULES: Record<string, ModuleContent> = {
  energy_1_1: {
    id: "energy_1_1",
    title: "Module 1.1: How Energy Deregulation Works",
    subtitle: "Explain the invisible system that allows homeowners to choose — and save.",
    sections: [
      {
        title: "The Regulated vs. Deregulated Model",
        type: "text",
        content:
          "In a regulated energy market, one utility company generates, transmits, and sells electricity. The homeowner has no choice. In a deregulated market, the grid still delivers power through the same wires, but the homeowner can choose who supplies the energy. This choice creates competition, which drives down rates. Your job is to explain this simply: 'The power comes through the same lines, but you get to pick who bills you — and at what rate.'",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "Homeowners in deregulated markets share common frustrations that drive switching behavior:",
        items: [
          "Unpredictable monthly bills due to variable utility rates",
          "Feeling trapped by a monopoly with no alternative options",
          "Rate increases that outpace inflation and erode household budgets",
          "Confusion about which provider is actually cheapest — analysis paralysis",
          "Fear of scams — past bad experiences with door-to-door energy companies",
        ],
      },
      {
        title: "Discovery Questions for Energy Switching",
        type: "list",
        content: "These questions uncover real pain and position you as a helpful advisor:",
        items: [
          "Do you know if you are on a fixed or variable rate right now?",
          "Have you noticed your electricity rate going up over the last year?",
          "Have you ever compared what you are paying per kilowatt-hour to the available alternatives?",
          "What would it mean to your family if you could lock in a lower rate for the next 12–24 months?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Never guarantee specific savings amounts. Show the rate comparison and let the math speak for itself. Always disclose contract terms, early termination fees, and any promotional expiration dates before the customer signs.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_energy_1_1_1",
        type: "open_response",
        label: "Explain energy deregulation in 2 sentences as if talking to a homeowner who has never heard of it.",
        placeholder: "Right now, your power company charges you whatever they want because...",
        lines: 3,
      },
    ],
  },
}

export const ENERGY_MODULE_SCENARIOS: Record<string, string[]> = {}
