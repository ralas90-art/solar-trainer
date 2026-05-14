import { ModuleContent } from "@/lib/modules";
import { INDUSTRY } from "@/lib/white-label.config";

export const DAY5_ADDITIVE_MODULES: Record<string, ModuleContent> = {
    // ─── MODULE 5.5A — The Post-Sale Project Lifecycle ───────────────────────────────
    "mod_5_5a": {
        id: "mod_5_5a",
        title: "Module 5.5A: The Post-Sale Project Lifecycle",
        subtitle: "Navigate the journey from contract signature to Permission to Operate.",
        sections: [
            {
                title: "1. The Project Lifecycle: A Rep's Map",
                type: "text",
                content: `Every ${INDUSTRY.toLowerCase()} project goes through the same general sequence of stages from contract to live system. The exact timing varies by market, utility, and jurisdiction — but the stages themselves are consistent.\n\nThere are 7 key stages: Contract Signed, Site Survey, System Design, Permitting, Installation, Inspection, and Permission to Operate (PTO).`
            },
            {
                title: "The Seven Stages",
                type: "list",
                content: "Here is the breakdown of the post-sale pipeline:",
                items: [
                    "Stage 1 - Contract Signed: Homeowner signs the agreement. The deal is live.",
                    "Stage 2 - Site Survey: A technician assesses the roof, electrical panel, and site conditions (1–3 weeks post-contract).",
                    "Stage 3 - System Design: Engineering finalizes the design based on survey data (1–4 weeks).",
                    "Stage 4 - Permitting: The design is submitted to local jurisdiction for approval (highly variable, 1 week to several months).",
                    "Stage 5 - Installation: The crew installs panels, inverters, and wiring (1-2 days).",
                    "Stage 6 - Inspection: Local inspector verifies system against approved permit (1-3 weeks post-install).",
                    "Stage 7 - PTO: Utility company authorizes the homeowner to turn on the system. This is the true finish line."
                ]
            },
            {
                title: "2. Total Timeline Expectations",
                type: "text",
                content: "From contract signing to PTO, timeline is typically 3 to 6 months in most markets. Some markets are faster, some are significantly slower. Never promise a specific timeline you cannot guarantee. Use ranges and use localized data."
            },
            {
                title: "3. Where Trust Is Most Commonly Lost",
                type: "list",
                content: "Reps who proactively manage post-sale expectations preserve their deals. Trust is commonly lost in 3 moments:",
                items: [
                    "Moment 1 — The Silence After Signing: Anxiety builds if they hear nothing for weeks. Check in within 48 hours.",
                    "Moment 2 — The Permit Surprise: No one warned them permits can take 6-10 weeks. Set this expectation explicitly at signing.",
                    "Moment 3 — The PTO Confusion: The system is on the roof, but they can't turn it on. Explain PTO clearly before and after installation."
                ]
            },
            {
                title: "4. The Rep's Role After the Close",
                type: "list",
                content: "Understanding boundaries is essential. Reps who try to do too much create confusion; those who do too little lose deals.",
                items: [
                    "Rep Owns: Homeowner relationship, expectation management, early problem escalation, referral relationship cultivation.",
                    "Operations Owns: Scheduling, design decisions, permit submission, installation scheduling, and inspection."
                ]
            },
            {
                title: "5. The 7-Touchpoint Model",
                type: "list",
                content: "Use the lifecycle as a proactive, offensive play to build referrals:",
                items: [
                    "1. Day of signing: Here's exactly what happens next.",
                    "2. Site survey confirmation: Your site survey is confirmed.",
                    "3. Post-site survey: Survey went well, design is being finalized.",
                    "4. Permit submitted: Your permit is in.",
                    "5. Install date confirmed: Great news — your install is scheduled!",
                    "6. Day of/after install: Panels are up! Here's the last step.",
                    "7. PTO received: You're officially live. Congratulations."
                ]
            },
            {
                title: "Module 5.5A Slide Deck",
                type: "slides",
                slides: [
                    {
                        title: "The Post-Sale Project Lifecycle",
                        content: `Your Map from Contract to Live. The #1 cause of ${INDUSTRY.toLowerCase()} cancellations is not buyer's remorse — it's broken trust.`,
                        image: `/images/${INDUSTRY.toLowerCase()}_project_pipeline.png`
                    },
                    {
                        title: "The Seven Stages",
                        content: "Contract → Survey → Design → Permit → Install → Inspection → PTO.\nPTO is the finish line, not installation.",
                        image: `/images/${INDUSTRY.toLowerCase()}_project_pipeline.png`
                    },
                    {
                        title: "Where Trust Is Most Commonly Lost",
                        content: "1. The Silence After Signing\n2. The Permit Surprise\n3. The PTO Confusion",
                        image: "/images/trust_breaking_moments.png"
                    },
                    {
                        title: "The 7-Touchpoint Model",
                        content: "Proactively check in at all 7 milestones: Signing, Survey, Design, Permit, Install, Inspection, PTO.",
                        image: "/images/trust_breaking_moments.png"
                    }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_5_5a_1",
                type: "open_response",
                label: "Order the Project Lifecycle Stages and estimate typical durations for each.",
                placeholder: "1. Contract, 2. Survey...",
                lines: 4
            }
        ],
        quiz: {
            title: "Knowledge Check: Project Lifecycle",
            questions: [
                {
                    id: "kc_5_5a_1",
                    question: "What is the true finish line for a solar project?",
                    options: [
                        "When the contract is signed",
                        "When the panels are installed on the roof",
                        "When the final inspection passes",
                        "When Permission to Operate (PTO) is granted by the utility"
                    ],
                    correctAnswerIndex: 3,
                    explanation: "PTO is the moment the homeowner is legally allowed to turn on their system and start saving."
                }
            ]
        }
    },
    // ─── MODULE 5.5B — Advanced Agreement Walkthrough ───────────────────────────────
    "mod_5_5b": {
        id: "mod_5_5b",
        title: "Module 5.5B: Advanced Agreement Walkthrough",
        subtitle: "Navigate the standard solar contract with confidence and transparency.",
        sections: [
            {
                title: "The Agreement Isn't a Barrier — It's a Shield",
                type: "text",
                content: `Most reps are afraid of the agreement. They rush through it, skip the fine print, and hope the homeowner doesn't ask hard questions. Module 5.5B flips that script. We treat the agreement as a professional document that protects both the homeowner and the company. A rep who can walk through an agreement transparently is a rep who closes with high integrity.`
            },
            {
                title: "1. The Four Pillars of the Agreement",
                type: "list",
                content: "Every standard solar agreement covers these four areas:",
                items: [
                    "Pillar 1 - The Scope: Exactly what is being installed (panel count, inverter type, battery capacity).",
                    "Pillar 2 - The Economics: Total cost, financing terms, and estimated production numbers.",
                    "Pillar 3 - The Warranties: Performance guarantees, workmanship warranties, and equipment coverage.",
                    "Pillar 4 - The Rights & Responsibilities: Cancellation policy, access rights, and legal disclosures."
                ]
            },
            {
                title: "2. The 'Deep Dive' Sections",
                type: "list",
                content: "Reps must be able to explain these three specific clauses without stuttering:",
                items: [
                    "The Cancellation Clause: Explain the 'Notice of Cancellation' (3-day right to rescind in most states) clearly. Transparency here reduces day-4 cancellations.",
                    "The Performance Guarantee: How it works, what it covers, and what happens if the system under-produces.",
                    "The Roof Warranty: Exactly what the company is responsible for (penetrations) and for how long."
                ]
            },
            {
                title: "3. Handling the 'Legal Jargon' Anxiety",
                type: "text",
                content: `Homeowner: \"This contract looks really long and complicated.\"\nPro Response: \"I completely understand. It's a customized home improvement project, so there's a lot of detail to ensure we're both on the same page. My job is to walk you through the key sections so you know exactly what you're signing. Which part would you like to look at first?\"`
            },
            {
                title: "4. The 'Review and Initial' Workflow",
                type: "text",
                content: "Instead of 'sign at the bottom,' use a 'review and initial' workflow. Walk the homeowner through the key disclosures, have them initial each important section, and then sign at the end. This ensures they actually understand the commitment and significantly reduces buyer's remorse."
            },
            {
                title: "Module 5.5B Slide Deck",
                type: "slides",
                slides: [
                    {
                        title: "Advanced Agreement Walkthrough",
                        content: "Closing with Transparency and Integrity.",
                        image: "/images/ethics_shield.png"
                    },
                    {
                        title: "The Four Pillars of the Agreement",
                        content: "Scope, Economics, Warranties, Rights.",
                        image: "/images/ethics_shield.png"
                    },
                    {
                        title: "The Cancellation Clause",
                        content: "Why transparency about the right to cancel builds trust.",
                        image: "/images/ethics_shield.png"
                    },
                    {
                        title: "The Review and Initial Workflow",
                        content: "Moving from 'signing' to 'onboarding'.",
                        image: "/images/ethics_shield.png"
                    }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_5_5b_1",
                type: "open_response",
                label: "A homeowner says: 'I need to have my lawyer look at this before I sign.' What is your consultative response?",
                placeholder: "I completely understand — it's a big decision...",
                lines: 4
            }
        ],
        quiz: {
            title: "Knowledge Check: Agreement Walkthrough",
            questions: [
                {
                    id: "kc_5_5b_1",
                    question: "What is the primary benefit of the 'Review and Initial' workflow?",
                    options: [
                        "It makes the contract harder to cancel.",
                        "It ensures the homeowner actually understands the key terms of the agreement.",
                        "It takes longer, which makes the deal feel more important.",
                        "It's a legal requirement in all 50 states."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Initialing key sections ensures the homeowner has actively reviewed and understood the most critical terms of their agreement."
                }
            ]
        }
    }
};
