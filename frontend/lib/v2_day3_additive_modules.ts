import { ModuleContent } from "@/lib/modules";
import { INDUSTRY } from "@/lib/white-label.config";

export const day3AdditiveModules: Record<string, ModuleContent> = {
  "3.7a": {
    id: "3.7a",
    title: "Technical Discovery Questions",
    duration: "45 min",
    points: 150,
    sections: [
      {
        type: "text",
        content: "Most reps discover a homeowner's motivations. Fewer reps discover a homeowner's risks. Module 3.7A upgrades the rep's discovery process to surface technical and project-level concerns earlier in the conversation — before they become surprises in the pipeline. The goal is not to turn discovery into an interrogation or a technical audit. It is to weave smart questions into natural conversation so that reps arrive at the proposal stage with a clearer picture of what they're actually selling into.",
      },
      {
        type: "list",
        title: "Learning Objectives",
        items: [
          "Ask natural, non-intrusive questions about roof age, electrical service, and site conditions that surface potential project risks before the survey.",
          "Identify homeowner signals that indicate HOA involvement, contractor history, or permitting sensitivities — and respond appropriately.",
          "Discover future load growth (EVs, pool equipment, additions) that may affect system sizing recommendations.",
          "Surface outage history and backup priorities in a way that opens the battery conversation naturally.",
          "Document technical discovery findings accurately so the survey team and operations have the context they need."
        ]
      },
      {
        type: "text",
        title: "Section 1: Why Technical Discovery Is Different",
        content: `Standard discovery focuses on motivation: why does this homeowner want ${INDUSTRY.toLowerCase()}? Technical discovery adds a second layer: what is the condition of this home and site, and what project-level factors might affect the timeline, cost, or feasibility of what we're proposing?\n\nThe tone of technical discovery:\nTechnical questions should feel like a rep taking genuine interest in the homeowner's home — not like a checklist being read from a clipboard. The rep who says 'Before I put together your proposal, I want to make sure I'm recommending the right system for your specific home — can I ask a few things about the house?' sounds like a professional.`
      },
      {
        type: "list",
        title: "Section 2: The Question Banks",
        items: [
          "Roof Age & Condition: 'Do you know roughly how old your roof is?' Surfaces viability and ownership timeline.",
          "Electrical Panel: 'Do you know if your home has a 100-amp or 200-amp electrical panel?' Surfaces MPU risk.",
          "Outage History: 'How often do you lose power in your area?' Opens the battery conversation naturally.",
          "Future Load Growth: 'Are you planning to get an electric vehicle in the next few years?' Determines correct sizing.",
          "HOA & Permitting: 'Is your home part of an HOA?' Surfaces pipeline friction points.",
          "Detached Structures: 'Is that structure in the back a garage, a workshop — is that part of your property?' Surfaces scope complexity."
        ]
      },
      {
        type: "text",
        title: "Section 3: The Documentation Habit",
        content: "After every discovery conversation, reps should document:\n- Roof age/condition signals\n- Electrical panel type (if known)\n- Outage history and backup priority level\n- Future load plans (EV, additions, electrification)\n- HOA involvement\n- Competitive landscape\n- Any red flags for the survey team\n\nThis documentation is what makes the survey handoff effective."
      },
      {
        type: "slides",
        title: "Module 3.7A Slide Deck",
        slides: [
          {
            title: "Technical Discovery Questions",
            image: "/images/technical_discovery.png",
            notes: "Surface the risk before it surfaces you."
          },
          {
            title: "The Tone That Makes It Work",
            notes: "Curious professional vs. auditor. Focus on natural transition phrases."
          },
          {
            title: "Roof & Electrical Questions",
            notes: "Discuss the core questions for roof age and panel capacity."
          },
          {
            title: "Outage History & Future Loads",
            notes: "How to open battery conversations and size systems accurately for future needs."
          },
          {
            title: "HOA & Site Complexity",
            notes: "Identifying pipeline friction (HOAs) and scope creep (detached structures)."
          },
          {
            title: "The Documentation Habit",
            notes: "Why written notes protect deals; what specifically to capture."
          }
        ]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_7a_1",
        type: "open_response",
        label: "The discovery conversation below is technically collecting the right information — but it sounds like an interrogation: 'What's the age of your roof? Do you have 100-amp or 200-amp service? Have you gotten other quotes? Are you in an HOA? Do you plan to get an EV?' Rewrite it so it sounds natural, consultative, and conversational.",
        placeholder: "Write your rewrite here...",
        lines: 4
      },
      {
        id: "wb_3_7a_2",
        type: "open_response",
        label: `A homeowner says: "Yes we're in an HOA, they've turned down two of our neighbors for ${INDUSTRY.toLowerCase()} already." What is your follow-up response?`,
        placeholder: "Your response...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 3.7A Knowledge Check",
      questions: [
        {
          id: "kc_3_7a_1",
          question: "A homeowner says their roof was 'put on when we moved in — that was 1996.' What is the most appropriate rep response?",
          options: [
            `That roof is too old for ${INDUSTRY.toLowerCase()} — we'll need to talk about a replacement first.`,
            `That's fine — most roofs can support ${INDUSTRY.toLowerCase()} regardless of age.`,
            "Good to know. Our site survey team does a roof assessment as part of the process — I'll make sure they take a close look so we don't run into anything unexpected.",
            "I can't move forward with a proposal until we know the roof condition."
          ],
          correctAnswerIndex: 2,
          explanation: "Setting expectations for the survey team's professional assessment is the most consultative and risk-mitigated approach."
        }
      ]
    }
  },
  "3.7b": {
    id: "3.7b",
    title: "Post-Close Site Survey Prep",
    duration: "45 min",
    points: 150,
    sections: [
      {
        type: "text",
        content: "The close is the beginning, not the end. Module 3.7B standardizes the rep's workflow between the close and the site survey. A survey that goes wrong — or is canceled because the rep didn't set proper expectations — is the number one cause of early-stage cancellation. This module teaches reps how to prepare the homeowner and the operations team for a perfect survey experience.",
      },
      {
        type: "list",
        title: "Learning Objectives",
        items: [
          "Standardize the 'Survey Prep' talk tracks: What the tech needs, where they need to go, and why the homeowner must be present.",
          "Identify and proactively flag project-level 'Red Flags' (attic access, panel location, dogs, roof steepness) for the operations team.",
          "Review the Pre-Survey SOP: How to collect and submit photos and documentation that make the survey tech's job easier.",
          "Mitigate survey-related 'Cold Feet': Remind the homeowner why the survey is a critical validation step for their custom design.",
          "Document discovery findings and red flags accurately in the CRM to ensure a seamless handoff to operations."
        ]
      },
      {
        type: "text",
        title: "Section 1: The 'Survey Prep' Talk Track",
        content: "Reps must move from 'Closing' mode to 'Onboarding' mode. A good onboarding talk track explains:\n- The Goal: Validating the roof condition and electrical capacity.\n- The Access: Why the tech needs into the garage and potentially the attic.\n- The Time: How long it takes and why the homeowner's presence matters for the final sign-off on panel locations."
      },
      {
        type: "text",
        title: "Section 2: Site Observations for Operations",
        content: "Every rep should take a basic 'pre-survey' photo package:\n1. Main Electrical Panel (with cover open if possible)\n2. Proposed Inverter/Battery Location\n3. The Main Roof Plane\n4. Potential Obstructions (AC units, chimneys)\n\nThis small effort reduces survey no-shows and engineering redesigns significantly."
      },
      {
        type: "text",
        title: "Section 3: Documenting Red Flags Correctly",
        content: "The most common rep documentation failure is notes that are vague, incomplete, or filed in a place the survey team never sees.\n\nVague (Bad): \"Roof might be an issue.\"\nSpecific (Good): \"Homeowner believes roof was installed around 1998. Original composition shingles. No known repairs but mentioned some curling near the north-facing section.\"\n\nVague (Bad): \"Electrical panel could be an issue.\"\nSpecific (Good): \"Homeowner confirmed main breaker is labeled 100A. Panel is in the garage, easily accessible. Rep flagged potential MPU requirement and homeowner is aware.\""
      },
      {
        type: "slides",
        title: "Module 3.7B Slide Deck",
        slides: [
          {
            title: "Site Survey Prep for Reps",
            image: "/images/site_survey_prep.png",
            notes: "The handoff that makes or breaks the pipeline."
          },
          {
            title: "What the Survey Is Validating",
            notes: "Roof, shading, electrical, site — the four pillars."
          },
          {
            title: "The Pre-Survey Information Package",
            notes: "Review what info ops needs before the survey tech arrives."
          },
          {
            title: "Documenting Red Flags",
            notes: "Vague vs. specific documentation examples."
          },
          {
            title: "How Poor Survey Prep Damages Deals",
            notes: "Review scenarios: The MPU Surprise, The No-Show Survey, The Redesign."
          },
          {
            title: "The Pre-Survey SOP Checklist",
            notes: "The complete rep workflow from close to post-survey follow-up."
          }
        ]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_7b_1",
        type: "open_response",
        label: "Rewrite this vague note into a specific, actionable one: 'Panel could be 100 amp — not sure.'",
        placeholder: "Specific note here...",
        lines: 2
      },
      {
        id: "wb_3_7b_2",
        type: "open_response",
        label: "Write the script for the call or text you would send to a homeowner to prepare them for their upcoming site survey (scheduled for next Thursday at 10 AM, tech named Marcus).",
        placeholder: "Your message...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 3.7B Knowledge Check",
      questions: [
        {
          id: "kc_3_7b_1",
          question: "A rep closes a deal on Monday. The site survey is scheduled for the following Wednesday. What should the rep do within 24–48 hours of the close?",
          options: [
            "Nothing — the survey is operations' responsibility from here.",
            "Confirm the survey date with the homeowner, submit the pre-survey information package to the project coordinator, and document all red flags in the CRM.",
            "Call the homeowner to make sure they haven't changed their mind.",
            "Email the survey team the homeowner's contact information and nothing else."
          ],
          correctAnswerIndex: 1,
          explanation: "Proactive communication and documentation are the keys to a successful survey and project launch."
        }
      ]
    }
  }
};
