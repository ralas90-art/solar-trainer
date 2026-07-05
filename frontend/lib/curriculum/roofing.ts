/**
 * Roofing — Curriculum Shell
 * ============================
 * Status: PREVIEW | Prefix: roof_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const ROOFING_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "roof_day_1",
    title: "Roofing Sales Fundamentals & Storm Response",
    subtitle: "Sell protection, value, and urgency — backed by real inspection data",
    objectives: [
      "Identify storm damage indicators visible from the ground and on the roof",
      "Explain the insurance claim process to homeowners without practicing law",
      "Differentiate cosmetic damage from functional damage and communicate clearly",
      "Handle 'My roof looks fine' and 'I'll wait until it leaks' objections",
      "Position a roof replacement as a property value investment, not just a repair",
    ],
    modules: [
      { id: "roof_1_1", moduleNumber: "1.1", title: "Residential Roofing Systems Explained", duration: "25 min", type: "content" },
      { id: "roof_1_2", moduleNumber: "1.2", title: "Storm Damage Assessment & Documentation", duration: "35 min", type: "activity" },
      { id: "roof_1_3", moduleNumber: "1.3", title: "The Insurance Claim Process", duration: "30 min", type: "content" },
      { id: "roof_1_4", moduleNumber: "1.4", title: "Objection Handling for Roofing", duration: "30 min", type: "activity" },
      { id: "roof_1_5", moduleNumber: "1.5", title: "Compliance & Ethical Boundaries", duration: "20 min", type: "content" },
    ],
    deliverables: ["Damage identification checklist completed", "Insurance process explanation script written"],
    homework: ["Practice the roof inspection walkthrough narrative with photos"],
  },
]

export const ROOFING_MODULES: Record<string, ModuleContent> = {
  roof_1_1: {
    id: "roof_1_1",
    title: "Module 1.1: Residential Roofing Systems Explained",
    subtitle: "Speak with authority about the system protecting every homeowner's biggest investment.",
    sections: [
      {
        title: "What a Roof Actually Does",
        type: "text",
        content:
          "A roof is not just shingles — it is a system. The decking provides structural support. The underlayment acts as a moisture barrier. The shingles are the weather shield. The flashing seals vulnerable areas around vents, chimneys, and valleys. The ventilation system controls attic temperature and prevents moisture buildup. When any layer fails, the entire system is compromised. Your job is to help homeowners understand what they are actually protecting.",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "Roofing customers are motivated by protection, anxiety, or opportunity:",
        items: [
          "Visible damage after a storm — missing shingles, dented gutters, debris in the yard",
          "A roof that is 20+ years old and approaching the end of its expected lifespan",
          "Active leaks or water stains on interior ceilings and walls",
          "Insurance premium increases due to an aging or damaged roof",
          "Wanting to sell the home and knowing the roof condition will affect appraisal",
        ],
      },
      {
        title: "Discovery Questions",
        type: "list",
        content: "These questions position you as a professional inspector, not a door-to-door salesperson:",
        items: [
          "Do you know how old your current roof is, or when it was last replaced?",
          "Did you notice any changes to your roof after the last major storm?",
          "Have you seen any water stains, discoloration, or dampness on your ceilings or walls?",
          "Has your insurance company contacted you about the condition of your roof?",
          "Are you planning to stay in this home for the next 5–10 years, or are you considering selling?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Never advise a homeowner on how to file or inflate an insurance claim. Never offer to waive deductibles — it is illegal in most states. Your role is to document damage accurately, explain the process, and recommend the homeowner contact their insurance provider directly.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_roof_1_1_1",
        type: "open_response",
        label: "Explain what a roofing system is in 2 sentences as if talking to a homeowner who thinks 'roof' means 'shingles.'",
        placeholder: "Your roof is actually a multi-layer system that includes...",
        lines: 3,
      },
    ],
  },
}

export const ROOFING_MODULE_SCENARIOS: Record<string, string[]> = {}
