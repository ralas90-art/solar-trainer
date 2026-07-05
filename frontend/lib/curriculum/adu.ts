/**
 * ADUs (Accessory Dwelling Units) — Curriculum Shell
 * =====================================================
 * Status: PREVIEW | Prefix: adu_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const ADU_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "adu_day_1",
    title: "ADU Fundamentals & Income Property Selling",
    subtitle: "Sell rental income, multigenerational flexibility, and property value growth",
    objectives: [
      "Explain what an ADU is and the different types (detached, attached, garage conversion, JADU)",
      "Identify which homeowners are the strongest ADU candidates",
      "Present the ROI case: rental income, property value increase, and tax advantages",
      "Handle 'It's too expensive,' 'Permits are impossible,' and 'My yard is too small' objections",
      "Understand local zoning basics and how to research permit requirements",
    ],
    modules: [
      { id: "adu_1_1", moduleNumber: "1.1", title: "What Is an ADU — Types & Opportunities", duration: "25 min", type: "content" },
      { id: "adu_1_2", moduleNumber: "1.2", title: "The Financial Case for ADUs", duration: "30 min", type: "content" },
      { id: "adu_1_3", moduleNumber: "1.3", title: "Zoning, Permits & Feasibility", duration: "25 min", type: "content" },
      { id: "adu_1_4", moduleNumber: "1.4", title: "Identifying Ideal ADU Candidates", duration: "20 min", type: "activity" },
      { id: "adu_1_5", moduleNumber: "1.5", title: "Common ADU Objections", duration: "25 min", type: "activity" },
    ],
    deliverables: ["ADU feasibility checklist completed", "ROI presentation framework written"],
    homework: ["Research the ADU zoning rules for your primary territory"],
  },
]

export const ADU_MODULES: Record<string, ModuleContent> = {
  adu_1_1: {
    id: "adu_1_1",
    title: "Module 1.1: What Is an ADU — Types & Opportunities",
    subtitle: "Help homeowners see the income-producing asset hiding in their own backyard.",
    sections: [
      {
        title: "The ADU Opportunity",
        type: "text",
        content:
          "An Accessory Dwelling Unit is a secondary housing unit built on the same lot as an existing home. It can be a detached backyard cottage, an attached addition, a garage conversion, or a Junior ADU carved out of existing living space. In states like California, recent legislation has dramatically simplified ADU permitting, creating a massive opportunity for homeowners to generate rental income, house family members, or increase property value — often by $100,000 to $300,000 or more.",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "ADU customers are motivated by financial opportunity or family logistics:",
        items: [
          "Aging parents who need to live nearby but want independence and privacy",
          "Adult children who cannot afford local housing and need a transitional option",
          "Desire for passive rental income without buying a separate investment property",
          "Property value stagnation — the home has not appreciated as expected",
          "Unused backyard or garage space that is costing money to maintain with no return",
          "Remote workers who need a dedicated home office separate from the main house",
        ],
      },
      {
        title: "Discovery Questions",
        type: "list",
        content: "These questions identify motivation and feasibility:",
        items: [
          "Have you ever considered turning unused space on your property into an income source?",
          "Do you have family members who might benefit from living close by but independently?",
          "Do you know what comparable ADU rental rates are in your neighborhood?",
          "Have you looked into the current ADU permitting rules for your city?",
          "If you could add $1,500–$3,000 per month in rental income, how would that change your financial plan?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Never guarantee specific rental income figures or property value increases. Present market comparables and estimates with clear disclaimers. Always recommend the homeowner verify zoning, permitting, and financing eligibility with their local planning department and financial advisor.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_adu_1_1_1",
        type: "open_response",
        label: "Write your 30-second ADU pitch for a homeowner with a large backyard and aging parents.",
        placeholder: "Imagine being able to keep your parents close by, in a private, comfortable unit...",
        lines: 4,
      },
    ],
  },
}

export const ADU_MODULE_SCENARIOS: Record<string, string[]> = {}
