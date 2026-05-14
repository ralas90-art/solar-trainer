import { ModuleContent } from "@/lib/modules";
import { INDUSTRY } from "@/lib/white-label.config";

export const day1AdditiveModules: Record<string, ModuleContent> = {
  "1.5a": {
    id: "1.5a",
    title: "Understanding Utility Bills & Net Metering",
    duration: "45 min",
    points: 150,
    sections: [
      {
        type: "text",
        content: `Understanding how homeowners are currently billed—and exactly how ${INDUSTRY.toLowerCase()} changes that equation—is the financial foundation of every ${INDUSTRY.toLowerCase()} pitch. Module 1.5A trains reps to read utility bills fluently and explain net metering (NEM) in simple, accessible language. If a rep cannot confidently explain how a utility bill works, they cannot credibly explain why ${INDUSTRY.toLowerCase()} is a better financial alternative.`,
      },
      {
        type: "list",
        title: "Learning Objectives",
        items: [
          "Identify and explain tiered pricing vs. Time-of-Use (TOU) rates on a standard utility bill.",
          "Define Net Energy Metering (NEM) and explain how it credits homeowners for excess production.",
          "Calculate 'true cost per kWh' by dividing total monthly charges by total usage.",
          "Explain seasonal rate variations and how they affect annual savings projections.",
          "Handle 'The Fixed Charge' objection: Why the utility still charges a small fee even with 100% offset."
        ]
      },
      {
        type: "text",
        title: "Section 1: The Three Most Common Rate Structures",
        content: `Standard Flat Rate: You pay one price per unit of power. Simple, but becoming rare in competitive markets.\n\nTiered Pricing: The more you use, the more you pay per unit.\n- Baseline tier: Cheapest power (e.g., first 500 kWh)\n- Tier 2/3: More expensive power (e.g., 501+ kWh)\n- The pitch: '${INDUSTRY} shaves off those expensive top tiers first. We're replacing your most expensive power with cheaper ${INDUSTRY.toLowerCase()} power.'\n\nTime-of-Use (TOU) Pricing: When you use power matters just as much as how much you use.\n- Peak hours (e.g., 4 PM - 9 PM): Most expensive power.\n- Off-peak hours (e.g., 9 PM - 4 PM): Cheaper power.\n- The pitch: 'The utility charges you the most when your family is home and needs power the most. ${INDUSTRY} (especially with a battery) lets you avoid buying power during those peak surge pricing hours.'`
      },
      {
        type: "text",
        title: "Section 2: Tiered vs. Time-of-Use (TOU) Rates",
        content: `Tiered Pricing: The more you use, the more you pay per unit.\n- Baseline tier: Cheapest power (e.g., first 500 kWh)\n- Tier 2/3: More expensive power (e.g., 501+ kWh)\n- The pitch: '${INDUSTRY} shaves off those expensive top tiers first. We're replacing your most expensive power with cheaper ${INDUSTRY.toLowerCase()} power.'\n\nTime-of-Use (TOU) Pricing: When you use power matters just as much as how much you use.\n- Peak hours (e.g., 4 PM - 9 PM): Most expensive power.\n- Off-peak hours (e.g., 9 PM - 4 PM): Cheaper power.\n- The pitch: 'The utility charges you the most when your family is home and needs power the most. ${INDUSTRY} (especially with a battery) lets you avoid buying power during those peak surge pricing hours.'`
      },
      {
        type: "text",
        title: "Section 3: Net Energy Metering (NEM) Explained",
        content: `${INDUSTRY} is the engine that makes ${INDUSTRY.toLowerCase()} financially viable for grid-tied homes.\n\nThe simple explanation:\n'Think of the utility grid like a bank account for your power. During the day, your panels produce more power than your house uses. That extra power is sent to the grid, and the utility gives you a credit for it. At night, when your panels aren't producing, you pull power back from the grid, using those credits. Net metering is just the math of your deposits minus your withdrawals.'`
      },
      {
        type: "slides",
        title: "Module 1.5A Slide Deck",
        slides: [
          {
            title: "Advanced Utility Bill Analysis",
            image: "/images/utility_bill_autopsy.png",
            notes: "Reading between the lines of the utility bill."
          },
          {
            title: "Tiered vs. TOU Rates",
            notes: "Visual breakdown of how utilities escalate costs."
          },
          {
            title: "The Net Metering Concept",
            notes: "The grid as a giant battery for your credits."
          },
          {
            title: "Calculating True ROI",
            notes: "Moving from 'monthly bill' to 'annualized value'."
          }
        ]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_5a_1",
        type: "open_response",
        label: "Explain Net Metering as if you were talking to a 10-year-old.",
        placeholder: "Imagine the utility company is like a piggy bank...",
        lines: 3
      },
      {
        id: "wb_1_5a_2",
        type: "open_response",
        label: "Calculate the 'true cost per kWh' for a bill that is $342.12 with 1,450 kWh used.",
        placeholder: "Total Bill / Total Usage = ...",
        lines: 1
      }
    ],
    quiz: {
      title: "Module 1.5A Knowledge Check",
      questions: [
        {
          id: "kc_1_5a_1",
          question: "Under a tiered pricing structure, which power is replaced first by solar?",
          options: [
            "The cheapest baseline power",
            "The most expensive 'top tier' power",
            "All power is replaced equally",
            "None of the above"
          ],
          correctAnswerIndex: 1,
          explanation: "Solar offsets your total usage, effectively removing the most expensive units of power from the top of your utility's pricing tiers first."
        }
      ]
    }
  },
  "1.5b": {
    id: "1.5b",
    title: "Seasonal Variation & Bill Forecasting",
    duration: "45 min",
    points: 150,
    sections: [
      {
        type: "text",
        content: `Homeowners don't use power evenly throughout the year. Most reps present a single month's savings and assume it applies year-round. This is a primary source of post-install complaints when winter production drops. Module 1.5B teaches reps how to analyze and present seasonal variation so that homeowners understand the full 12-month value cycle of ${INDUSTRY.toLowerCase()}.`,
      },
      {
        type: "list",
        title: "Learning Objectives",
        items: [
          "Explain the 'Summer Surge' in usage and how it affects production requirements.",
          "Identify seasonal rate changes (Winter vs. Summer rates) and their impact on bill calculations.",
          "Accurately forecast annual production vs. annual usage for a homeowner.",
          "Set proper expectations for winter production dips and net metering credit carryover.",
          "Use historical bill data to build trust in savings projections."
        ]
      },
      {
        type: "text",
        title: "Section 1: The Summer Surge vs. Winter Dip",
        content: `Usage: In most markets, usage peaks in the summer (A/C) and potentially in the winter (heating if electric). \n\nProduction: ${INDUSTRY} production peaks in the late spring and summer (longer days, higher sun angle) and dips significantly in the winter.\n\nNet Metering Handoff: The goal of a well-designed system is to over-produce in the spring/summer to build up a 'bank' of credits that carries the homeowner through the lower-production winter months.`
      },
      {
        type: "text",
        title: "Section 2: Seasonal Rate Changes",
        content: "Many utilities charge more per kWh in the summer months (June–September) than in the winter months. Reps must ensure they are using the correct seasonal rates when calculating savings — or better yet, using a true annual average to keep the math honest."
      },
      {
        type: "text",
        title: "Section 3: The 'Annual True-Up' Concept",
        content: "If the homeowner is in a market with an annual true-up (like many NEM 2.0/3.0 programs), they need to understand that their 'bill' isn't really settled until the end of their 12-month cycle. Explaining the true-up prevents panic when they see a small utility charge in a low-production month."
      },
      {
        type: "slides",
        title: "Module 1.5B Slide Deck",
        slides: [
          {
            title: "Seasonal Variation & Bill Forecasting",
            image: "/images/production_demand_curve.png",
            notes: "Moving beyond the 'one month' pitch."
          },
          {
            title: "Summer vs. Winter Utility Economics",
            notes: "Rates change, usage changes, production changes. Show all three."
          },
          {
            title: "The Credit Carryover Bank",
            notes: "Visualizing how summer production pays for winter usage."
          },
          {
            title: "Explaining the Annual True-Up",
            notes: "The finish line that matters most for the homeowner's wallet."
          }
        ]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_5b_1",
        type: "open_response",
        label: "A homeowner asks: 'Why is my bill $40 this month? I thought you said I'd have a $0 bill?' (It is December). Write your response.",
        placeholder: "I'm glad you noticed that — it's actually exactly how the system is designed to work...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 1.5B Knowledge Check",
      questions: [
        {
          id: "kc_1_5b_1",
          question: "When is the most critical time to explain seasonal production variation to a homeowner?",
          options: [
            "Only if they ask about it",
            "After the system is installed",
            "During the initial sales presentation at the kitchen table",
            "When the utility sends the first winter bill"
          ],
          correctAnswerIndex: 2,
          explanation: "Setting the expectation early prevents 'buyer's remorse' or confusion when production naturally dips during winter months."
        }
      ]
    }
  },
  "1.7a": {
    id: "1.7a",
    title: "Basic Site Engineering Awareness",
    duration: "45 min",
    points: 150,
    sections: [
      {
        type: "text",
        content: `A rep's job is not to be an engineer, but a rep who ignores basic engineering constraints is a rep who loses deals in the pipeline. Module 1.7A teaches the 'field observations' that every rep must make before leaving the property to ensure the proposed system is actually buildable. The goal is: 'See more, promise less, close better.'`,
      },
      {
        type: "list",
        title: "Learning Objectives",
        items: [
          "Identify roof orientations (Azimuth) and explain why South-facing is the 'Gold Standard.'",
          "Recognize roof material types (Comp Shingle, Tile, Metal) and their impact on installation.",
          "Identify 100-amp vs. 200-amp electrical service and know when an upgrade (MPU) might be required.",
          "Perform a 'Ground-Level Shade Check' to identify mature trees or obstructions that will affect production.",
          "Know the 'Flag vs. Guess' boundary: How to point out a technical issue without quoting a cost or making a promise."
        ]
      },
      {
        type: "text",
        title: "Section 1: Reading the Roof",
        content: `Orientation (Azimuth): South is best. West/East is good. North is generally avoided (in the northern hemisphere).\n\nPitch/Tilt: Steeper isn't always better. The 'ideal' tilt is usually equal to the latitude of the home.\n\nCondition: If the roof has less than 5–10 years of life left, it's a conversation that needs to happen *now*, not after the survey.`
      },
      {
        type: "text",
        title: "Section 2: The Electrical Panel",
        content: `100A vs. 200A Service: The most critical observation. A 100-amp panel often requires a Main Panel Upgrade (MPU) to handle the backfeed of a modern ${INDUSTRY.toLowerCase()} array. \n\nWhat to look for: The number stamped on the main breaker. \n\nBreaker Space: Even a 200A panel can be a problem if every single slot is completely full (requires a subpanel or line-side tap).`
      },
      {
        type: "text",
        title: "Section 3: The 'Flag vs. Guess' Boundary",
        content: `The highest-risk mistake a rep can make is guessing how much an upgrade will cost or promising it won't be needed.\n\nCorrect Flagging Language: "I noticed your main panel is a 100-amp service. Our site survey team will assess it completely, but just so you're aware, that sometimes means we need to upgrade the panel to accommodate the ${INDUSTRY.toLowerCase()} safely. We'll cross that bridge if the engineers say it's necessary, but I want to make sure I note it."\n\nGuessing (WRONG): "Oh, your panel is 100 amps. That'll be a $2,500 upgrade fee."`
      },
      {
        type: "slides",
        title: "Module 1.7A Slide Deck",
        slides: [
          {
            title: "Basic Site Engineering Awareness",
            image: "/images/roof_assessment.png",
            notes: "Introduce the concept: 'See more, promise less, close better.'"
          },
          {
            title: "Reading the Roof",
            notes: "Discuss Azimuth (South = Best), Tilt, and Shading."
          },
          {
            title: "Electrical Panel Awareness",
            notes: "Focus on identifying 100A vs 200A service."
          },
          {
            title: "The Flag vs. Guess Boundary",
            notes: "Teach the exact scripting for pointing out an issue without quoting a cost or making a promise."
          },
          {
            title: "Field Observation Checklist",
            notes: "Review the items every rep should check before leaving the property."
          }
        ]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_7a_1",
        type: "open_response",
        label: "During a sales visit, you notice the main electrical panel in the garage. The main breaker is labeled '100A.' The panel has two open breaker slots out of approximately 20 total slots. What should you say to the homeowner about this observation? Write your actual language.",
        placeholder: "I noticed your electrical panel...",
        lines: 3
      },
      {
        id: "wb_1_7a_2",
        type: "open_response",
        label: "A homeowner's primary south-facing roof has a large, mature oak tree casting shadow across 40% of the plane. They haven't mentioned it. How do you handle this observation in the conversation?",
        placeholder: "Your response...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 1.7A Knowledge Check",
      questions: [
        {
          id: "kc_1_7a_1",
          question: `Which roof orientation produces the most annual ${INDUSTRY.toLowerCase()} energy in the northern hemisphere?`,
          options: ["East-facing", "West-facing", "North-facing", "South-facing"],
          correctAnswerIndex: 3,
          explanation: "In the Northern Hemisphere, the sun is always to the South. Therefore, south-facing roofs receive the most direct sunlight throughout the year."
        },
        {
          id: "kc_1_7a_2",
          question: "During a sales visit, a rep notices the main electrical panel's main breaker is labeled '100A.' What is the most appropriate next action?",
          options: [
            "Tell the homeowner the project cannot proceed without an upgrade.",
            "Ignore it — the site survey team will figure it out.",
            "Proactively flag it to the homeowner as something the site survey team will assess, explain it may affect project scope or cost, and note it in your visit summary.",
            "Quote a specific MPU cost range to the homeowner so they can budget accordingly."
          ],
          correctAnswerIndex: 2,
          explanation: "Transparency builds trust. Flagging potential issues early prevents surprises later in the process."
        }
      ]
    }
  }
};
