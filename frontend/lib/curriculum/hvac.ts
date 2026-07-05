/**
 * HVAC — Curriculum Shell
 * ========================
 * Status: PREVIEW | Prefix: hvac_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const HVAC_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "hvac_day_1",
    title: "HVAC Fundamentals & Comfort-Based Selling",
    subtitle: "Sell comfort, health, and efficiency — not equipment specs",
    objectives: [
      "Explain how residential HVAC systems work in homeowner-friendly language",
      "Identify the top 5 signs a homeowner needs a system upgrade",
      "Position replacement as an investment in comfort, health, and energy savings",
      "Handle 'I'll just repair it' and 'I'm getting other quotes' objections",
      "Understand SEER ratings, tonnage, and right-sizing without overwhelming the homeowner",
    ],
    modules: [
      { id: "hvac_1_1", moduleNumber: "1.1", title: "How HVAC Works — The Comfort Cycle", duration: "25 min", type: "content" },
      { id: "hvac_1_2", moduleNumber: "1.2", title: "Signs It's Time to Replace", duration: "20 min", type: "content" },
      { id: "hvac_1_3", moduleNumber: "1.3", title: "Comfort-First Value Proposition", duration: "25 min", type: "activity" },
      { id: "hvac_1_4", moduleNumber: "1.4", title: "SEER Ratings, Sizing & Efficiency Math", duration: "30 min", type: "content" },
      { id: "hvac_1_5", moduleNumber: "1.5", title: "Common HVAC Objections", duration: "25 min", type: "activity" },
    ],
    deliverables: ["HVAC symptom checklist completed", "Comfort value script written"],
    homework: ["Practice the 60-second HVAC explanation with a family member"],
  },
]

export const HVAC_MODULES: Record<string, ModuleContent> = {
  hvac_1_1: {
    id: "hvac_1_1",
    title: "Module 1.1: How HVAC Works — The Comfort Cycle",
    subtitle: "Speak confidently about heating and cooling without sounding like a technician.",
    sections: [
      {
        title: "The HVAC System in Plain Language",
        type: "text",
        content:
          "An HVAC system has three jobs: heat the home in winter, cool it in summer, and move fresh air through every room. The furnace or heat pump handles heating. The air conditioner or heat pump handles cooling. The ductwork distributes air. The thermostat controls everything. Your job is to explain this simply: 'Think of it like your home's lungs — when the system is healthy, every room breathes easily. When it is failing, some rooms suffocate.'",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "HVAC customers rarely call because they love shopping for equipment. They call because they are uncomfortable:",
        items: [
          "Hot and cold spots — some rooms are freezing while others are sweltering",
          "Rising energy bills with no change in usage patterns",
          "Strange noises — banging, grinding, or whistling from the system",
          "Poor air quality — dust, allergies, humidity problems",
          "The system is over 15 years old and repairs are becoming more frequent than birthdays",
        ],
      },
      {
        title: "Discovery Questions for HVAC",
        type: "list",
        content: "These questions move the conversation from 'fix my AC' to 'invest in my family's comfort':",
        items: [
          "How old is your current system? Do you know when it was last fully serviced?",
          "Are there any rooms in the house that are consistently too hot or too cold?",
          "Have you noticed your energy bills going up, even without changes in usage?",
          "Does anyone in the household have allergies or respiratory concerns?",
          "If you could design the perfect indoor climate for your family, what would that look like?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Never guarantee specific energy savings percentages. Reference manufacturer-rated efficiency improvements and recommend the homeowner verify estimated savings based on their specific usage patterns and local utility rates.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_hvac_1_1_1",
        type: "open_response",
        label: "Explain what an HVAC system does in 2 sentences as if talking to a homeowner.",
        placeholder: "Your HVAC system is like your home's lungs...",
        lines: 3,
      },
    ],
  },
}

export const HVAC_MODULE_SCENARIOS: Record<string, string[]> = {}
