/**
 * Smart Home Security / Alarm Systems — Curriculum Shell
 * ========================================================
 * Status: PREVIEW | Prefix: sec_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const SMART_HOME_SECURITY_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "sec_day_1",
    title: "Home Security Fundamentals & Protection Selling",
    subtitle: "Sell peace of mind — not equipment packages",
    objectives: [
      "Explain modern smart security systems in homeowner-friendly language",
      "Identify the trigger events that drive homeowner security purchases",
      "Position monitoring as an investment in family safety, not a monthly expense",
      "Handle 'I already have a system' and 'I'll just use cameras' objections",
      "Understand professional monitoring vs. self-monitoring economics",
    ],
    modules: [
      { id: "sec_1_1", moduleNumber: "1.1", title: "Modern Home Security — Beyond the Alarm", duration: "25 min", type: "content" },
      { id: "sec_1_2", moduleNumber: "1.2", title: "Trigger Events & Urgency Psychology", duration: "25 min", type: "content" },
      { id: "sec_1_3", moduleNumber: "1.3", title: "Professional vs. Self-Monitoring", duration: "20 min", type: "content" },
      { id: "sec_1_4", moduleNumber: "1.4", title: "Common Security Objections", duration: "30 min", type: "activity" },
    ],
    deliverables: ["Security needs assessment checklist completed", "Trigger event identification guide written"],
    homework: ["Interview 2 homeowners about what makes them feel safe at home"],
  },
]

export const SMART_HOME_SECURITY_MODULES: Record<string, ModuleContent> = {
  sec_1_1: {
    id: "sec_1_1",
    title: "Module 1.1: Modern Home Security — Beyond the Alarm",
    subtitle: "Today's smart security is a connected ecosystem — not just a box on the wall.",
    sections: [
      {
        title: "The Evolution of Home Security",
        type: "text",
        content:
          "Home security has evolved from a simple alarm that screams when a door opens into a connected ecosystem: smart locks, video doorbells, motion sensors, glass break detectors, flood sensors, and 24/7 professional monitoring — all controlled from a smartphone. Your job is to show homeowners that modern security is not just about break-ins. It is about knowing what is happening at home when you are not there.",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "Security purchases are emotionally driven — these are the triggers:",
        items: [
          "A recent break-in or attempted break-in in the neighborhood",
          "Moving into a new home and wanting to feel safe from day one",
          "Having children, elderly family members, or pets at home alone",
          "Package theft — a rapidly growing frustration for homeowners",
          "Wanting to check on the home while traveling or at work",
        ],
      },
      {
        title: "Discovery Questions",
        type: "list",
        content: "These questions uncover the emotional driver behind the security need:",
        items: [
          "What made you start thinking about home security — was there a specific event?",
          "When you are away from home, what worries you the most?",
          "Do you have anyone at home during the day — kids, elderly family, pets?",
          "Have you had any issues with package theft in your area?",
          "If you could check on your home from anywhere, what would you want to see?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Never make guarantees about crime prevention. Security systems are deterrents that reduce risk and improve response time. Always disclose monitoring contract terms, equipment ownership details, and cancellation policies before the customer signs.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_sec_1_1_1",
        type: "open_response",
        label: "Write your opening line for a homeowner who just had a neighbor experience a break-in.",
        placeholder: "I understand how unsettling that must be. A lot of families in this area...",
        lines: 3,
      },
    ],
  },
}

export const SMART_HOME_SECURITY_MODULE_SCENARIOS: Record<string, string[]> = {}
