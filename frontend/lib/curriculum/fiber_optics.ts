/**
 * Fiber Optic Internet — Curriculum Shell
 * ==========================================
 * Status: PREVIEW | Prefix: fiber_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const FIBER_OPTICS_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "fiber_day_1",
    title: "Fiber Internet Fundamentals & Value Selling",
    subtitle: "Sell speed, reliability, and future-proofing — not bandwidth specs",
    objectives: [
      "Explain fiber optic technology vs. cable and DSL in homeowner-friendly language",
      "Demonstrate the real-world impact of fiber on streaming, gaming, and remote work",
      "Position fiber as a home value investment and future-proofing decision",
      "Handle 'My internet is fast enough' and 'The price is too high' objections",
      "Understand service area maps and eligibility verification",
    ],
    modules: [
      { id: "fiber_1_1", moduleNumber: "1.1", title: "Fiber vs. Cable vs. DSL — The Speed Truth", duration: "25 min", type: "content" },
      { id: "fiber_1_2", moduleNumber: "1.2", title: "Real-World Impact on Daily Life", duration: "20 min", type: "content" },
      { id: "fiber_1_3", moduleNumber: "1.3", title: "The Future-Proofing Pitch", duration: "20 min", type: "content" },
      { id: "fiber_1_4", moduleNumber: "1.4", title: "Service Area & Eligibility Verification", duration: "15 min", type: "activity" },
      { id: "fiber_1_5", moduleNumber: "1.5", title: "Common Fiber Objections", duration: "25 min", type: "activity" },
    ],
    deliverables: ["Fiber vs. cable comparison card completed", "Future-proofing pitch script written"],
    homework: ["Research the fiber availability map for your primary territory"],
  },
]

export const FIBER_OPTICS_MODULES: Record<string, ModuleContent> = {
  fiber_1_1: {
    id: "fiber_1_1",
    title: "Module 1.1: Fiber vs. Cable vs. DSL — The Speed Truth",
    subtitle: "Help homeowners understand why not all 'high-speed internet' is created equal.",
    sections: [
      {
        title: "What Makes Fiber Different",
        type: "text",
        content:
          "Fiber optic internet transmits data using light through glass strands, not electrical signals through copper wire. This means fiber delivers symmetrical upload and download speeds (cable does not), has virtually no signal degradation over distance (DSL loses speed dramatically), and is not affected by neighborhood congestion during peak hours. For the homeowner, this translates to: video calls that never freeze, downloads that finish instantly, and an internet connection that performs the same at 8 PM as it does at 8 AM.",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "Internet customers are motivated by frustration with their current service:",
        items: [
          "Buffering during streaming — especially when multiple devices are active",
          "Video call dropouts during remote work meetings",
          "Online gaming lag that makes competitive play impossible",
          "Slow upload speeds that make backing up photos, sending files, or live streaming painful",
          "Price increases from cable companies with no improvement in service quality",
          "Bundled packages with services they don't want just to get acceptable internet speeds",
        ],
      },
      {
        title: "Discovery Questions",
        type: "list",
        content: "These questions uncover real frustration and create urgency:",
        items: [
          "How many devices are connected to your internet on a typical evening?",
          "Do you work from home or take video calls regularly?",
          "Have you experienced buffering, lag, or dropped connections recently?",
          "Do you know what upload speed you are currently getting? (Most people don't.)",
          "Has your internet bill gone up in the last year without any improvement in speed?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Always verify service availability at the specific address before promising fiber access. Quote actual plan speeds, not theoretical maximums. Disclose contract terms, installation fees, equipment costs, and any promotional pricing expiration dates clearly before the customer commits.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_fiber_1_1_1",
        type: "open_response",
        label: "Explain the difference between fiber and cable internet in 2 sentences a homeowner would understand.",
        placeholder: "Cable internet uses old copper wires and slows down when your neighbors...",
        lines: 3,
      },
    ],
  },
}

export const FIBER_OPTICS_MODULE_SCENARIOS: Record<string, string[]> = {}
