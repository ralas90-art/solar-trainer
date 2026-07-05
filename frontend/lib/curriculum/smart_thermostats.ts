/**
 * Smart Thermostats & Energy Management — Curriculum Shell
 * =========================================================
 * Status: PREVIEW | Prefix: thermo_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const SMART_THERMOSTATS_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "thermo_day_1",
    title: "Smart Energy Management Fundamentals",
    subtitle: "Sell savings, convenience, and control — not gadgets",
    objectives: [
      "Explain how smart thermostats reduce energy waste without sacrificing comfort",
      "Demonstrate ROI within 12–18 months using real usage data",
      "Handle 'I can just use my regular thermostat' objection",
      "Understand integration with solar, HVAC, and whole-home energy systems",
      "Position smart thermostats as the control center of a modern home",
    ],
    modules: [
      { id: "thermo_1_1", moduleNumber: "1.1", title: "Smart Thermostats — Beyond the Gadget", duration: "25 min", type: "content" },
      { id: "thermo_1_2", moduleNumber: "1.2", title: "Energy Savings Math & ROI Framing", duration: "25 min", type: "content" },
      { id: "thermo_1_3", moduleNumber: "1.3", title: "Integration with Solar & HVAC Systems", duration: "20 min", type: "content" },
      { id: "thermo_1_4", moduleNumber: "1.4", title: "Common Objections & Rebuttals", duration: "25 min", type: "activity" },
    ],
    deliverables: ["ROI calculator worksheet completed", "Integration positioning script written"],
    homework: ["Research 3 smart thermostat models and their key differentiators"],
  },
]

export const SMART_THERMOSTATS_MODULES: Record<string, ModuleContent> = {
  thermo_1_1: {
    id: "thermo_1_1",
    title: "Module 1.1: Smart Thermostats — Beyond the Gadget",
    subtitle: "Position smart energy management as a financial decision, not a tech purchase.",
    sections: [
      {
        title: "The Control Center of a Modern Home",
        type: "text",
        content:
          "A smart thermostat is not a gadget — it is the financial control center of a home's energy consumption. Heating and cooling account for nearly 50% of a typical home's energy bill. A smart thermostat learns the household's schedule, adjusts temperatures automatically, and eliminates waste. Your pitch is simple: 'This device pays for itself in under a year, then keeps saving you money every month after that.'",
      },
      {
        title: "Homeowner Pain Points",
        type: "list",
        content: "Smart thermostat customers are motivated by control and savings:",
        items: [
          "Energy bills that feel too high but they do not know where the waste is",
          "Coming home to an uncomfortable house because they forgot to adjust the thermostat",
          "Rooms that are too hot upstairs and too cold downstairs",
          "Wanting to monitor and control their home's climate from their phone",
          "Utility rebate programs they did not know existed until you told them",
        ],
      },
      {
        title: "Discovery Questions",
        type: "list",
        content: "These questions position you as an energy advisor:",
        items: [
          "Do you currently adjust your thermostat when you leave the house, or does it run all day?",
          "Have you ever wished you could control your home's temperature from your phone?",
          "Are there times when you come home and the house is too hot or too cold?",
          "Are you aware that your utility company may offer rebates for smart thermostat installation?",
        ],
      },
      {
        title: "Compliance Reminder",
        type: "quote",
        content:
          "\"Energy savings estimates should reference manufacturer-published data or ENERGY STAR ratings. Never promise specific dollar savings — present estimated ranges and recommend the homeowner verify based on their actual usage.\"",
      },
    ],
    workbookPrompts: [
      {
        id: "wb_thermo_1_1_1",
        type: "open_response",
        label: "Write your 30-second smart thermostat pitch that focuses on savings and control, not features.",
        placeholder: "Right now, your heating and cooling runs on autopilot...",
        lines: 3,
      },
    ],
  },
}

export const SMART_THERMOSTATS_MODULE_SCENARIOS: Record<string, string[]> = {}
