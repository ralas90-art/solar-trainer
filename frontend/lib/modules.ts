export interface Slide {
    title: string;
    content: string;
    imagePlaceholder?: string;
    image?: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export interface Quiz {
    title: string;
    questions: QuizQuestion[];
}

export interface ModuleContent {
    id: string;
    title: string;
    subtitle: string;
    pdfDownloadUrl?: string;
    slideDeckUrl?: string;
    quiz?: Quiz; // NEW: Quiz Data
    sections: {
        title: string;
        content: string;
        type: 'text' | 'list' | 'quote' | 'comparison' | 'slides' | 'simulation' | 'image';
        items?: string[];
        comparison?: { rookie: string; pro: string };
        slides?: Slide[];
        scenarioId?: string; // For simulation
        openingLine?: string; // Opening dialogue line
        imageSrc?: string; // For standalone image
        narration?: string; // Optional custom audio narration text
    }[];
    workbookPrompts?: WorkbookPrompt[];
}

// Workbook prompt types for interactive response capture
export interface WorkbookPrompt {
    id: string                // e.g., "wb_1_1_1"
    type: "open_response" | "fill_blank" | "checklist" | "rating"
    label: string             // The question or instruction
    placeholder?: string      // Hint text
    lines?: number            // For open_response: textarea rows (1=short, 5=paragraph)
    items?: string[]          // For checklist items
    maxRating?: number        // For rating: max value (default 5)
}

// Sub-module metadata for training map navigation
export interface SubModuleInfo {
    id: string           // e.g., "mod_1_1" — maps to MODULES key
    moduleNumber: string // e.g., "1.1"
    title: string
    duration: string
    type: "content" | "activity" | "quiz" | "simulation" | "certification" | "field"
    hasSimulation?: boolean
}

export interface DayInfo {
    dayNumber: number
    dayId: string        // e.g., "day_1" — used for routing
    title: string
    subtitle: string
    objectives: string[]
    modules: SubModuleInfo[]
    deliverables: string[]
    homework: string[]
}

export const DAY_MODULES: DayInfo[] = [
    {
        dayNumber: 1,
        dayId: "day_1",
        title: "Onboarding & Foundations",
        subtitle: "Remove friction, build identity, ignite excitement",
        objectives: [
            "Understand the realistic income trajectory for Months 1, 3, 6, and Year 2",
            "Complete all administrative onboarding — paperwork, CRM access, systems",
            "Explain how solar works in 60 seconds without notes",
            "Read a utility bill and make a go / no-go qualification decision",
            "Adopt the consultant identity and sign the Integrity Pledge"
        ],
        modules: [
            { id: "mod_1_1", moduleNumber: "1.1", title: "Welcome & Vision Casting", duration: "15 min", type: "content" },
            { id: "mod_1_2", moduleNumber: "1.2", title: "Administrative Onboarding", duration: "45 min", type: "activity" },
            { id: "mod_1_3", moduleNumber: "1.3", title: "Company Culture & Expectations", duration: "20 min", type: "content" },
            { id: "mod_1_4", moduleNumber: "1.4", title: "Solar Industry Overview", duration: "20 min", type: "quiz" },
            { id: "mod_1_5", moduleNumber: "1.5", title: "Solar Technology Fundamentals", duration: "25 min", type: "quiz" },
            { id: "mod_1_5a", moduleNumber: "1.5A", title: "Utility Bills & Net Metering", duration: "45 min", type: "content" },
            { id: "mod_1_5b", moduleNumber: "1.5B", title: "Solar Financial Structures", duration: "40 min", type: "content" },
            { id: "mod_1_6", moduleNumber: "1.6", title: "Identity Shift — Consultant vs Salesperson", duration: "20 min", type: "activity" },
            { id: "mod_1_7", moduleNumber: "1.7", title: "Utility Bill Mastery", duration: "25 min", type: "quiz" },
            { id: "mod_1_7a", moduleNumber: "1.7A", title: "Basic Site Engineering Awareness", duration: "45 min", type: "content" },
            { id: "mod_1_8", moduleNumber: "1.8", title: "Day 1 Wrap-Up & Preview", duration: "15 min", type: "content" }
        ],
        deliverables: ["Commitment agreement signed", "All paperwork + CRM login confirmed", "Expectations document signed", "Industry quiz 80%+", "Technology quiz 80%+", "Integrity Pledge signed", "Bill reading quiz 80%+"],
        homework: ["Watch net metering videos", "Read the top objections guide (5 pages)", "Explain solar to a family member — record yourself"]
    },
    {
        dayNumber: 2,
        dayId: "day_2",
        title: "Prospecting & Territory Domination",
        subtitle: "Generate consistent opportunity flow through strategic prospecting",
        objectives: [
            "Build a territory plan with 3 target neighborhoods and a daily route",
            "Knock a door and deliver the 30-second opener in 3 variations",
            "Handle the top 5 door objections without a script",
            "Set a phone appointment using the inbound opener and discovery questions",
            "Pass the Day 2 role-play certification"
        ],
        modules: [
            { id: "mod_2_1", moduleNumber: "2.1", title: "Homeowner Psychology: Why People Resist Solar", duration: "20 min", type: "content" },
            { id: "mod_2_2", moduleNumber: "2.2", title: "Territory Strategy & Planning", duration: "20 min", type: "activity" },
            { id: "mod_2_3", moduleNumber: "2.3", title: "Daily Efficiency Math & Time Management", duration: "15 min", type: "content" },
            { id: "mod_2_4", moduleNumber: "2.4", title: "The Solar Conversation Framework: Introduction", duration: "20 min", type: "content" },
            { id: "mod_2_5", moduleNumber: "2.5", title: "Door Knocking Mastery", duration: "30 min", type: "activity", hasSimulation: true },
            { id: "mod_2_6", moduleNumber: "2.6", title: "Micro Objection Handling: Getting Past the Brush-Off", duration: "25 min", type: "activity", hasSimulation: true },
            { id: "mod_2_7", moduleNumber: "2.7", title: "Phone & Virtual Appointment Setting", duration: "25 min", type: "activity" },
            { id: "mod_2_8", moduleNumber: "2.8", title: "Anti-Sales Framing & Trust Building", duration: "20 min", type: "activity" },
            { id: "mod_2_9", moduleNumber: "2.9", title: "Daily Prospecting Workflow & Accountability", duration: "15 min", type: "content" },
            { id: "mod_2_10", moduleNumber: "2.10", title: "Day 2 Role-Play Certification", duration: "30 min", type: "certification" },
            { id: "mod_2_11", moduleNumber: "2.11", title: "Day 2 Wrap-Up & Field Assignment", duration: "15 min", type: "content" }
        ],
        deliverables: ["Written territory plan — 3 neighborhoods + routes", "Daily schedule commitment signed", "Recorded 30-sec pitch video", "5 practice calls logged", "Anti-sales personal script", "Objection rapid-fire passed", "Role-play certification passed"],
        homework: ["Knock 20 doors tonight — practice only", "Record yourself at 3 doors — watch before tomorrow", "Study top 10 objections script"]
    },
    {
        dayNumber: 3,
        dayId: "day_3",
        title: "Discovery, Psychology & In-Home Mastery",
        subtitle: "Uncover true pain, profile personalities, and control the appointment",
        objectives: [
            "Control the in-home environment — seating, distractions, opening frame",
            "Identify all 4 BOLT personality types and adapt your communication",
            "Use mirroring, labeling, and tactical pauses to uncover hidden concerns",
            "Ask all 12 discovery questions in sequence from memory",
            "Know when to disqualify and how to do it with integrity"
        ],
        modules: [
            { id: "mod_3_1", moduleNumber: "3.1", title: "In-Home Positioning & Environmental Control", duration: "20 min", type: "content" },
            { id: "mod_3_2", moduleNumber: "3.2", title: "Personality Profiling — BOLT Framework", duration: "25 min", type: "activity" },
            { id: "mod_3_3", moduleNumber: "3.3", title: "Real-World Homeowner Scenario Library", duration: "20 min", type: "content" },
            { id: "mod_3_4", moduleNumber: "3.4", title: "Tactical Empathy & Mirroring", duration: "20 min", type: "content", hasSimulation: true },
            { id: "mod_3_5", moduleNumber: "3.5", title: "Question Architecture: The Discovery Sequence", duration: "30 min", type: "activity" },
            { id: "mod_3_6", moduleNumber: "3.6", title: "Spouse & Decision-Maker Dynamics", duration: "20 min", type: "content" },
            { id: "mod_3_7", moduleNumber: "3.7", title: "Roof & Site Assessment", duration: "25 min", type: "activity" },
            { id: "mod_3_7a", moduleNumber: "3.7A", title: "Technical Discovery Questions", duration: "45 min", type: "content" },
            { id: "mod_3_7b", moduleNumber: "3.7B", title: "Site Survey Prep for Reps", duration: "45 min", type: "content" },
            { id: "mod_3_8", moduleNumber: "3.8", title: "Disqualification Mastery: When to Walk Away", duration: "20 min", type: "content", hasSimulation: true },
            { id: "mod_3_9", moduleNumber: "3.9", title: "Day 3 Full Discovery Simulation", duration: "40 min", type: "simulation", hasSimulation: true },
            { id: "mod_3_10", moduleNumber: "3.10", title: "Day 3 Wrap-Up & Homework", duration: "15 min", type: "content" }
        ],
        deliverables: ["Seating strategy diagram drawn", "BOLT cheat sheet created", "5 calibrated questions written", "Personal 12-question discovery script", "Spouse dynamics checklist", "Site qualification checklist", "Disqualification criteria written", "Simulation feedback form received"],
        homework: ["Set 1 real appointment — friend, family, or homeowner", "Run full discovery using 12-question script — record yourself", "Study utility bill deep dive guide for Day 4"]
    },
    {
        dayNumber: 4,
        dayId: "day_4",
        title: "Presentation Mastery & Financing",
        subtitle: "Deliver compelling, compliant presentations that drive decisions",
        objectives: [
            "Analyze a utility bill live using the 5-step autopsy",
            "Explain all 3 financing structures and recommend the right one",
            "Deliver the 4-pillar value stack in under 60 seconds",
            "Run all 6 phases of the presentation with micro-closes",
            "Handle the top 5 financial objections using payment-not-cost language"
        ],
        modules: [
            { id: "mod_4_1", moduleNumber: "4.1", title: "Utility Bill Deep Dive — Advanced Analysis", duration: "25 min", type: "activity", hasSimulation: true },
            { id: "mod_4_1a", moduleNumber: "4.1A", title: "Time-of-Use Rates & Utility Tariff Strategy", duration: "30 min", type: "content" },
            { id: "mod_4_2", moduleNumber: "4.2", title: "Financing Deep Dive", duration: "35 min", type: "content" },
            { id: "mod_4_2a", moduleNumber: "4.2A", title: "Incentive Strategy & Compliance", duration: "30 min", type: "content" },
            { id: "mod_4_2b", moduleNumber: "4.2B", title: "Cash vs. Loan vs. PPA vs. Lease Economics", duration: "30 min", type: "content" },
            { id: "mod_4_3", moduleNumber: "4.3", title: "The Value Stack — Beyond Money", duration: "20 min", type: "content" },
            { id: "mod_4_4", moduleNumber: "4.4", title: "Net Metering & Battery Reality", duration: "25 min", type: "content" },
            { id: "mod_4_4a", moduleNumber: "4.4A", title: "NEM 3.0 & Battery Sales Logic", duration: "30 min", type: "content" },
            { id: "mod_4_5", moduleNumber: "4.5", title: "System Design & Production Estimates", duration: "20 min", type: "content" },
            { id: "mod_4_6", moduleNumber: "4.6", title: "The 6-Phase Presentation Flow", duration: "30 min", type: "activity", hasSimulation: true },
            { id: "mod_4_7", moduleNumber: "4.7", title: "Handling Financial Objections", duration: "25 min", type: "activity" },
            { id: "mod_4_8", moduleNumber: "4.8", title: "Day 4 Full Presentation Simulation", duration: "30 min", type: "simulation" }
        ],
        deliverables: ["Bill analysis 5-step script", "Financing comparison one-pager", "Value stack cheat sheet — 4 pillars", "NEM + battery FAQ sheet", "Sample design report annotated", "Presentation checklist — 6 phases", "Financial objection pocket card", "Manager feedback form + coaching plan"],
        homework: ["Run one full presentation — friend, family, or real lead", "Record yourself — watch before bed, note one improvement", "Study top 15 objection scripts for Day 5"]
    },
    {
        dayNumber: 5,
        dayId: "day_5",
        title: "Objection Mastery & Ethical Closing",
        subtitle: "Handle any objection with confidence and close deals ethically",
        objectives: [
            "Classify any objection as logical, emotional, or tactical",
            "Deliver scripted responses to all 15 top solar objections without notes",
            "Use the porcupine, feel-felt-found, and negative reverse techniques",
            "Apply the right closing framework to the right personality type",
            "Walk through a contract clearly and reinforce the decision post-signature"
        ],
        modules: [
            { id: "mod_5_1", moduleNumber: "5.1", title: "Objection Psychology — Understanding Resistance", duration: "20 min", type: "content" },
            { id: "mod_5_2", moduleNumber: "5.2", title: "The Top 15 Solar Objections", duration: "45 min", type: "activity", hasSimulation: true },
            { id: "mod_5_3", moduleNumber: "5.3", title: "Advanced Objection Techniques", duration: "25 min", type: "content" },
            { id: "mod_5_4", moduleNumber: "5.4", title: "Closing Frameworks", duration: "30 min", type: "activity" },
            { id: "mod_5_5", moduleNumber: "5.5", title: "Contract Walk-Through & Transparency", duration: "20 min", type: "content" },
            { id: "mod_5_5a", moduleNumber: "5.5A", title: "The Post-Sale Project Lifecycle", duration: "30 min", type: "content" },
            { id: "mod_5_5b", moduleNumber: "5.5B", title: "Common Installation Pipeline Issues", duration: "25 min", type: "content" },
            { id: "mod_5_5c", moduleNumber: "5.5C", title: "Troubleshooting & Escalation Paths", duration: "25 min", type: "content" },
            { id: "mod_5_5d", moduleNumber: "5.5D", title: "Save-the-Deal Communication", duration: "25 min", type: "content" },
            { id: "mod_5_6", moduleNumber: "5.6", title: "Cancellation Prevention Strategies", duration: "25 min", type: "content", hasSimulation: true },
            { id: "mod_5_7", moduleNumber: "5.7", title: "Day 5 Full Objection & Close Simulation", duration: "35 min", type: "simulation" },
            { id: "mod_5_8", moduleNumber: "5.8", title: "Day 5 Wrap-Up", duration: "10 min", type: "content" }
        ],
        deliverables: ["Objection framework pocket card", "Objection script book — all 15", "Advanced techniques cheat sheet", "Closing frameworks cheat sheet", "Contract checklist — laminated", "Cancellation prevention checklist + email template", "Simulation feedback form"],
        homework: ["Run 1 full appointment — discovery through close", "Objection drill: all 15 with a partner — record it", "Submit recording by 9 PM"]
    },
    {
        dayNumber: 6,
        dayId: "day_6",
        title: "Post-Sale Excellence & Career Growth",
        subtitle: "Build a sustainable, repeatable career through referrals, reputation, and discipline",
        objectives: [
            "Ask for referrals at all 3 post-sale trigger moments",
            "Build a KPI tracker and diagnose your own performance bottlenecks",
            "Communicate proactively through all 7 phases of the install lifecycle",
            "Write your 1-year, 3-year, and 5-year income goals",
            "Pass the Day 6 certification exam (80%+ written + practical)"
        ],
        modules: [
            { id: "mod_6_1", moduleNumber: "6.1", title: "The Referral Engine — Building Passive Pipeline", duration: "25 min", type: "content", hasSimulation: true },
            { id: "mod_6_1a", moduleNumber: "6.1A", title: "Referral System Architecture", duration: "30 min", type: "content" },
            { id: "mod_6_2", moduleNumber: "6.2", title: "Review & Social Proof Strategy", duration: "20 min", type: "activity" },
            { id: "mod_6_2a", moduleNumber: "6.2A", title: "Review Generation & Social Proof Systems", duration: "25 min", type: "content" },
            { id: "mod_6_3", moduleNumber: "6.3", title: "Orphan Owner Strategy", duration: "20 min", type: "activity" },
            { id: "mod_6_3a", moduleNumber: "6.3A", title: "Orphan Owner Reactivation Playbook", duration: "25 min", type: "content" },
            { id: "mod_6_4", moduleNumber: "6.4", title: "Performance Dashboard & KPI Discipline", duration: "25 min", type: "activity" },
            { id: "mod_6_4a", moduleNumber: "6.4A", title: "KPI Mastery & Self-Coaching System", duration: "25 min", type: "content" },
            { id: "mod_6_5", moduleNumber: "6.5", title: "Project Lifecycle Management", duration: "25 min", type: "content", hasSimulation: true },
            { id: "mod_6_6", moduleNumber: "6.6", title: "Professional Reputation & Long-Term Ethics", duration: "20 min", type: "content" },
            { id: "mod_6_7", moduleNumber: "6.7", title: "Career Path & Income Scaling", duration: "20 min", type: "activity" },
            { id: "mod_6_8", moduleNumber: "6.8", title: "Day 6 Final Certification Exam", duration: "30 min", type: "certification" }
        ],
        deliverables: ["Referral request scripts — 3 stages", "Review request templates", "Orphan owner script + 5 names from CRM", "KPI tracker built and active", "Project lifecycle handout", "Integrity pledge re-signed", "Signed income goal sheet", "Certification badge (if passed)"],
        homework: ["Review Days 1-6 notes", "Study the 4 practical exam tasks", "Get to sleep early — Day 7 is in the field"]
    },
    {
        dayNumber: 7,
        dayId: "day_7",
        title: "Field Certification & Launch",
        subtitle: "Validate skills in real-world scenarios and launch into independent selling",
        objectives: [
            "Observe 3 live appointments and extract specific lessons from each",
            "Run 1 full appointment with manager observing — discovery through close",
            "Receive live field feedback and certification decision",
            "Knock 20 doors solo and set your first appointment as a certified rep"
        ],
        modules: [
            { id: "mod_7_1", moduleNumber: "7.1", title: "Pre-Field Briefing", duration: "30 min", type: "content" },
            { id: "mod_7_2", moduleNumber: "7.2", title: "Shadow Appointment #1", duration: "90 min", type: "field" },
            { id: "mod_7_3", moduleNumber: "7.3", title: "Shadow Appointment #2", duration: "90 min", type: "field" },
            { id: "mod_7_4", moduleNumber: "7.4", title: "Shadow Appointment #3", duration: "90 min", type: "field" },
            { id: "mod_7_5", moduleNumber: "7.5", title: "Pre-Appointment Prep — In the Car", duration: "15 min", type: "activity" },
            { id: "mod_7_6", moduleNumber: "7.6", title: "My Appointment — Field Notes", duration: "90 min", type: "field" },
            { id: "mod_7_7", moduleNumber: "7.7", title: "Debrief & Certification Decision", duration: "20 min", type: "certification" },
            { id: "mod_7_8", moduleNumber: "7.8", title: "Field Activation", duration: "10 min", type: "content" },
            { id: "mod_7_9", moduleNumber: "7.9", title: "Solo Prospecting — First 20 Doors", duration: "120 min", type: "field" }
        ],
        deliverables: ["Observation checklists completed for 3 appointments", "Post-appointment self-assessment", "Manager feedback form", "Certification decision received", "First 20-door tracker completed"],
        homework: ["You are now a certified solar rep — go build your career"]
    }
]

export const MODULES: Record<string, ModuleContent> = {
    // ─── MODULE 1.1 — Welcome & Vision Casting ───────────────────────────────
    "mod_1_1": {
        id: "mod_1_1",
        title: "Module 1.1: Welcome & Vision Casting",
        subtitle: "Set expectations, show earnings potential, introduce the solar mission.",
        sections: [
            {
                title: "Welcome to the SeptiVolt Accelerator",
                type: "text",
                content: "Welcome to the SeptiVolt Solar Sales Rep Accelerator. Over the next seven days, you are going to build the skills, mindset, and tools to become a professional solar consultant. This isn't a theory course — every lesson is built around real conversations, real objections, and real closings. By Day Seven, you will be field-certified and ready to generate income. Let's get started."
            },
            {
                title: "Your Income Potential in Solar",
                type: "list",
                content: "Let's talk about what's actually possible here. Most new reps earn $3K–$5K in month one. By month three, consistent reps earn $8K–$12K/month. Top performers hit $15K–$25K/month by month six. These are real numbers from real reps — the key is showing up every day, especially in the early weeks.",
                items: [
                    "Month 1 (Learning Curve): $3,000 – $5,000",
                    "Month 3 (Consistency Phase): $8,000 – $12,000",
                    "Month 6+ (Top Performer): $15,000 – $25,000",
                    "Daily consistency in the early weeks is the only variable you control"
                ]
            },
            {
                title: "The 7-Day Structure",
                type: "text",
                content: "Day One is onboarding and foundation — today. Days Two through Six are intensive training, each day building on the last. Day Seven is your field certification — you'll run a real appointment with your manager observing. Every day has role-plays built in, because the only way to get good at this is to practice. Daily micro-assessments will catch any gaps before Day Seven."
            },
            {
                title: "The 4 Stages of Competence",
                type: "list",
                content: "Every skill you learn follows four stages. Your job in this program is to move through these stages as fast as possible. The dip is normal — push through it.",
                items: [
                    "1. Unconscious Incompetence — you don't know what you don't know. You're excited but dangerous.",
                    "2. Conscious Incompetence — you realize how much there is to learn. It feels uncomfortable. This is where most people quit. Don't.",
                    "3. Conscious Competence — you can do it, but you have to think hard about it. You're in the grind.",
                    "4. Unconscious Competence — automatic. Flow state. This is mastery."
                ]
            },
            {
                title: "Your Signed Commitment",
                type: "quote",
                content: "\"Before we move on, you're going to sign a commitment agreement. This is not a legal document — it's a personal contract with yourself. You're committing to showing up fully for the next seven days, completing your daily assignments, and holding yourself accountable to the standards of a professional solar consultant. Sign it and mean it.\""
            }
        ],
        workbookPrompts: [
            {
                id: "wb_1_1_1",
                type: "open_response",
                label: "What is your income goal for Month 3? What daily activity level do you need to hit it?",
                placeholder: "Be specific — e.g. $10,000/mo = X doors/day, X appointments/week",
                lines: 4
            },
            {
                id: "wb_1_1_2",
                type: "open_response",
                label: "Which stage of competence are you in right now? What will it feel like when you are in stage 4?",
                placeholder: "Be honest, then describe what unconscious competence looks and feels like for you",
                lines: 3
            },
            {
                id: "wb_1_1_3",
                type: "checklist",
                label: "Commitment Agreement — initial each item:",
                items: [
                    "I will show up fully for all 7 days",
                    "I will complete every daily assignment",
                    "I will hold myself to professional solar consultant standards",
                    "I will not skip role-plays, even when they're uncomfortable"
                ]
            }
        ],
        quiz: {
            title: "Module 1.1 Knowledge Check",
            questions: [
                {
                    id: "kc_1_1_a",
                    question: "What stage of competence feels most uncomfortable and causes most reps to quit?",
                    options: [
                        "Unconscious Incompetence",
                        "Conscious Incompetence",
                        "Conscious Competence",
                        "Unconscious Competence"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Conscious Incompetence is 'The Dip' — you now see how much you don't know. It's uncomfortable, but it's the only way to grow. Reps who push through it become top performers."
                },
                {
                    id: "kc_1_1_b",
                    question: "By Month 6, what is a realistic monthly income range for a consistently performing solar rep?",
                    options: [
                        "$1,000 – $3,000",
                        "$3,000 – $5,000",
                        "$15,000 – $25,000",
                        "$50,000+"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Top performers who show up daily and follow the system hit $15K–$25K/month by month six. This is achievable — not guaranteed. It requires consistent activity from Day One."
                }
            ]
        }
    }
,
    // ─── MODULE 1.2 — Administrative Onboarding ────────────────────────────────
    "mod_1_2": {
    "id": "mod_1_2",
    "title": "Module 1.2: Administrative Onboarding",
    "subtitle": "Complete all paperwork efficiently Set up systems and tools Remove day-one confusion",
    "sections": [
        {
            "title": "Onboarding Checklist",
            "type": "text",
            "content": "Administrative onboarding sounds boring, but getting this wrong costs you money. If your CRM isn't set up, you can't log leads. If your design software isn't working, you can't pull proposals. We're going to move through the checklist quickly and completely. Your documents include your contractor agreement, tax paperwork, compliance forms, and if applicable your non-compete. Get them signed and submitted today."
        },
        {
            "title": "Tools & Systems Setup",
            "type": "text",
            "content": "After paperwork, you'll set up your tools. This means your CRM account \u2014 log in and confirm it works. Your design software like Aurora or HelioScope \u2014 install it and test it. Your company communication tools, calendar links, and mobile apps for route planning. Do not leave today without testing every login. One credential failing on your first real appointment will cost you a deal."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_1_2_1",
            "type": "open_response",
            "label": "Reflect on Administrative Onboarding: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 1.3 — Company Culture & Expectations ────────────────────────────────
    "mod_1_3": {
    "id": "mod_1_3",
    "title": "Module 1.3: Company Culture & Expectations",
    "subtitle": "Clarify behavioral standards Set performance benchmarks Explain support systems",
    "sections": [
        {
            "title": "Daily Schedule Expectations",
            "type": "text",
            "content": "Your most valuable asset is your golden hours. That's two pm to seven pm \u2014 the window when homeowners are home and receptive. During golden hours, you knock doors or make calls. Nothing else. Admin happens in the morning between eight and ten. Team calls and training run from ten to noon. This structure exists because it works. Top reps protect their golden hours like they protect their income \u2014 because those hours ARE their income."
        },
        {
            "title": "Weekly KPIs",
            "type": "text",
            "content": "Here are the numbers you're aiming for every week. One hundred to one hundred fifty doors knocked, or an equivalent number of outbound calls. Ten to fifteen appointments set. Five to eight appointment sits. And by week three, one to three closed deals per week. These aren't arbitrary targets \u2014 they're the activity levels that produce consistent income. If your numbers are off, we'll use these benchmarks to diagnose where the leak is."
        },
        {
            "title": "Manager Support Structure",
            "type": "text",
            "content": "You are not doing this alone. Your manager will check in with you daily for the first two weeks. Ride-alongs are available whenever you need a live model to follow. The team channel is open for real-time questions. Use these resources aggressively in your first weeks. The reps who grow fastest are the ones who ask the most questions, not the ones who try to figure it all out themselves."
        },
        {
            "title": "Compensation Deep Dive",
            "type": "text",
            "content": "Understanding how you get paid removes anxiety and replaces it with focus. Commission is typically paid per kilowatt installed, or as a flat rate per deal \u2014 depending on your company's structure. There are bonuses and accelerators for hitting volume. There is also a chargeback policy for cancellations, which is why we qualify hard and prevent buyer's remorse from day one. Ask your manager for the exact figures for your market today."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_1_3_1",
            "type": "open_response",
            "label": "Reflect on Company Culture & Expectations: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 1.4 — Solar Industry Overview ────────────────────────────────
    "mod_1_4": {
    "id": "mod_1_4",
    "title": "Module 1.4: Solar Industry Overview",
    "subtitle": "Understand the solar market landscape Know your competition Grasp the urgency (why now?)",
    "sections": [
        {
            "title": "Why Solar, Why Now",
            "type": "text",
            "content": "The residential solar market in the United States is one of the fastest-growing industries in the country. The three primary reasons homeowners go solar are utility bill inflation, energy independence, and home value increase. Utility rates have gone up six to eight percent annually for the last two decades with no sign of stopping. That is the foundation of every conversation you'll have. You are offering homeowners a hedge against rising historical utility rates.",
            "narration": "Welcome to Module 1.4. The residential solar market is growing fast, and for good reason. Homeowners are looking for three things: protection from inflation, energy independence, and an increase in their property value. Utility rates have gone up six to eight percent year over year for two decades. That's your starting point. You are offering them a reliable hedge against rising historical utility rates. Let's keep it simple and focused on these facts."
        },
        {
            "title": "The Federal Tax Credit",
            "type": "text",
            "content": "Under current federal guidance, the Residential Clean Energy Credit applied to qualifying residential solar property installed through December 31, 2025. Never promise a refund, check, or guaranteed tax savings. Eligibility depends on the law in effect, installation timing, ownership structure, and the homeowner’s individual tax situation. Always recommend that the homeowner confirm eligibility with a qualified tax professional.",
            "narration": "Let's talk about the federal tax credit. Under current federal guidance, the Residential Clean Energy Credit applied to qualifying residential solar property installed through December 31, 2025. This is a crucial compliance point. Never promise a refund, check, or guaranteed tax savings to a homeowner. Eligibility depends on the law in effect, installation timing, ownership structure, and their individual tax situation. Always recommend that the homeowner confirm their eligibility with a qualified tax professional. Keep it professional and play by the rules."
        },
        {
            "title": "Common Solar Myths",
            "type": "text",
            "content": "You will hear these three myths constantly, and you need to be ready. First \u2014 solar doesn't work in cloudy states. False. Germany is one of the cloudiest countries in the world and leads in solar adoption. Panels produce electricity from daylight, not direct sunlight. Second \u2014 panels are too expensive. With financing, most homeowners pay less per month than their current utility bill from day one. Third \u2014 the technology will be better next year. The technology has improved every year for forty years. Waiting always costs more than it saves.",
            "narration": "You're going to hear myths out in the field. Be ready for them. First, that solar doesn't work in cloudy areas. Not true. Germany leads the world in solar adoption, and they get Alaska-level sunlight. Panels need daylight, not direct heat. Second, that panels are too expensive. With modern financing, it's just a bill swap, often saving them money from day one. Third, that they should wait for better tech. Tech improves incrementally, but waiting always costs more than it saves. Address these myths calmly and move forward."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_1_4_1",
            "type": "open_response",
            "label": "Reflect on Solar Industry Overview: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 1.4 Knowledge Check",
        "questions": [
            {
                "id": "kc_1_4_a",
                "question": "What was the main concept covered in Solar Industry Overview?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 1.4 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 1.5 — Solar Technology Fundamentals ────────────────────────────────
    "mod_1_5": {
    "id": "mod_1_5",
    "title": "Module 1.5: Solar Technology Fundamentals",
    "subtitle": "Speak with technical authority Answer homeowner questions confidently Avoid sounding like a typical \"pushy salesperson\"",
    "sections": [
        {
            "title": "How Solar Works \u2014 The Simple Flow",
            "type": "text",
            "content": "Here is how a solar system works in plain language. Sunlight hits the panels. The panels generate DC electricity \u2014 direct current. The inverter converts that DC power into AC \u2014 alternating current \u2014 which is what your home actually uses. Any excess power you produce flows back to the utility grid, and you receive credits for it through a program called net metering. At night, or on cloudy days, you draw from the grid and use those credits. It's a closed loop that works in your favor."
        },
        {
            "title": "System Components",
            "type": "text",
            "content": "A typical solar system has five main components. The panels themselves \u2014 monocrystalline panels are the most efficient and most common in residential installs. The inverter, which converts power \u2014 string inverters are standard, microinverters are premium and monitor each panel individually. The racking system that mounts panels to the roof. The monitoring system, which lets homeowners track production via an app. And the meter, which measures what you consume versus what you produce."
        },
        {
            "title": "Warranties You Must Know",
            "type": "text",
            "content": "Warranties are not a detail \u2014 they're a closing tool. The panel performance warranty guarantees eighty percent output for twenty-five years. The inverter warranty runs ten to twenty-five years depending on the brand. The workmanship warranty covers the installation itself for ten years. When a homeowner asks what happens if something breaks, your answer is immediate and confident \u2014 here's what's covered, here's for how long, and here's who handles it. That confidence builds trust."
        },
        {
            "title": "What Solar Does NOT Do",
            "type": "text",
            "content": "Being honest about limitations is what separates consultants from salespeople. Solar will not eliminate your utility bill one hundred percent \u2014 connection fees and local charges remain, typically ten to twenty dollars per month. Solar will not power your home during a grid outage unless you have a battery. And solar does not pay you money directly, unless you're in a state with SREC programs. Setting these expectations upfront prevents cancellations and builds long-term trust."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_1_5_1",
            "type": "open_response",
            "label": "Reflect on Solar Technology Fundamentals: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 1.5 Knowledge Check",
        "questions": [
            {
                "id": "kc_1_5_a",
                "question": "What was the main concept covered in Solar Technology Fundamentals?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 1.5 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 1.6 — Identity Shift: Consultant vs. Salesperson ────────────────────────────────
    "mod_1_6": {
    "id": "mod_1_6",
    "title": "Module 1.6: Identity Shift: Consultant vs. Salesperson",
    "subtitle": "Reframe the role Build integrity-first mindset Prevent burnout from rejection",
    "sections": [
        {
            "title": "Salesperson vs. Consultant",
            "type": "text",
            "content": "There's a fundamental difference between a salesperson and a consultant. A salesperson pushes a product and chases a commission. A consultant diagnoses a problem and prescribes the right solution \u2014 even if that solution is walking away. In solar, this distinction matters because homeowners can feel which one you are within sixty seconds of opening the door. Your job is to enter every interaction as a consultant. You are restructuring someone's utility spending and protecting their family from inflation. Act accordingly.",
            "narration": "Welcome to Module 1.6. Let's talk about identity. There is a massive difference between being a salesperson and being a consultant. A salesperson pushes products and chases a commission. A consultant diagnoses a problem and prescribes the right solution, even if that means walking away. Homeowners will read your intent in the first minute. When you knock on a door, you aren't selling a gadget. You are helpfully restructuring their utility bills to protect their household. Enter every home as a professional consultant."
        },
        {
            "title": "The Integrity Creed",
            "type": "text",
            "content": "The integrity creed is not optional \u2014 it's the foundation of a sustainable career. Never promise or guarantee solar savings. Never exaggerate return on investment. Disqualify aggressively \u2014 a bad fit today is a cancellation tomorrow, and cancellations hurt your income. And always remember that your long-term reputation is worth more than any single commission check. The reps who build six-figure incomes are the ones homeowners refer to their neighbors because they were treated with respect.",
            "narration": "Let's talk about the integrity creed. It is the foundation of a real sales career. Never promise or guarantee solar savings. Never exaggerate the return on investment. Disqualify homes that aren't a good fit. A bad deal today is a cancellation tomorrow, and that hurts everyone. Remember, your long-term reputation in the neighborhood is worth more than any single commission check. Treat people with respect, and they will refer you to their neighbors."
        },
        {
            "title": "Reframing Rejection",
            "type": "text",
            "content": "In solar sales, you will hear the word no more than any other word. Every single top performer in this industry hears no over a hundred times per week. The shift you need to make is this \u2014 no does not mean I reject you. It means not right now, or this isn't a fit. Both of those are useful information. Track your no's because they're the path to your yes's. A rep knocking forty-five doors statistically closes one deal. That means every door \u2014 including every no \u2014 is worth about seventy-eight dollars.",
            "narration": "Rejection is part of the game. In solar, you will hear 'no' more than any other word. The best reps in this industry hear it over a hundred times a week. The secret is to reframe it: 'no' doesn't mean a personal rejection. It just means 'not right now' or 'this home is not a fit.' Track your numbers. Statistically, if you knock forty-five doors to close one deal, every single door you touch is worth about seventy-eight dollars, no matter what they say."
        },
        {
            "title": "Energy Management",
            "type": "text",
            "content": "This career requires emotional energy, and you have to manage it intentionally. Don't take rejection personally \u2014 the homeowner doesn't know you, and they're not rejecting you. They're protecting their time and their home. Celebrate small wins: an appointment set is a win, even if no deal follows. A meaningful conversation is a win. Reset between every door. The rep who treats door forty-five with the same energy as door one becomes the rep closing at a rate that changes everything.",
            "narration": "Managing your energy is what keeps you in the game. Don't take rejection personally. The homeowner is just protecting their time and space. Celebrate the small wins, like a solid conversation or a set appointment. Reset your mind between every single door. If you knock on door forty-five with the same positive energy you had on door one, you'll see your close rates soar. Stay consistent."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_1_6_1",
            "type": "open_response",
            "label": "Reflect on Identity Shift: Consultant vs. Salesperson: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 1.7 — Utility Bill Mastery: Introduction ────────────────────────────────
    "mod_1_7": {
    "id": "mod_1_7",
    "title": "Module 1.7: Utility Bill Mastery: Introduction",
    "subtitle": "Read and interpret a utility bill Identify qualified homeowners instantly Understand offset percentages",
    "sections": [
        {
            "title": "Anatomy of a Utility Bill",
            "type": "text",
            "content": "The utility bill is your most powerful qualifying tool. Here's what to look for. The total monthly kilowatt-hour usage \u2014 this tells you how much power the home consumes. The total charges, broken into supply, delivery, and fees. The rate structure \u2014 is it tiered, flat, or time-of-use? And the twelve-month usage history, which tells you whether this is a seasonal household or a consistent consumer. You should be able to read a utility bill fluently in under two minutes."
        },
        {
            "title": "Qualification Thresholds",
            "type": "text",
            "content": "Not every homeowner is a solar candidate. The minimum thresholds you're looking for are six hundred kilowatt-hours of monthly usage, a monthly bill of at least one hundred dollars, and annual usage above eight thousand kilowatt-hours. Below these numbers, the system size becomes too small to justify the cost and financing. Qualifying hard early saves you hours of wasted presentations and protects your close rate."
        },
        {
            "title": "Red Flags on a Bill",
            "type": "text",
            "content": "Some things on a utility bill should make you pause. A past-due balance can signal credit issues that will affect financing. Budget billing hides the homeowner's true usage by averaging it out \u2014 always ask for the actual usage breakdown. And if the usage seems very low for the size of the home, dig deeper. It could mean they rent part of the home, they're planning to move, or another party controls the usage. Look for these before investing two hours in a presentation."
        },
        {
            "title": "Understanding Offset Percentage",
            "type": "text",
            "content": "Offset percentage is how much of a homeowner's energy usage the solar system will produce annually. A one hundred percent offset means the system produces exactly what the home uses in a year. Most consultants recommend sizing at one hundred five to one hundred ten percent to account for panel degradation and future usage increases. If you size at eighty percent offset, the homeowner still has a meaningful utility bill. You'll use offset percentage in every proposal conversation from Day Four forward."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_1_7_1",
            "type": "open_response",
            "label": "Reflect on Utility Bill Mastery: Introduction: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 1.7 Knowledge Check",
        "questions": [
            {
                "id": "kc_1_7_a",
                "question": "What was the main concept covered in Utility Bill Mastery: Introduction?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 1.7 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 1.8 — Day 1 Wrap-Up & Preview ────────────────────────────────
    "mod_1_8": {
    "id": "mod_1_8",
    "title": "Module 1.8: Day 1 Wrap-Up & Preview",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Day 1 Key Takeaways",
            "type": "text",
            "content": "Let's lock in what you covered today. You are administratively onboarded and system-ready. You understand how solar works at a technical level that builds confidence. You can read a utility bill and identify a qualified lead. And you've adopted the mindset of a consultant, not a salesperson. These are not small things. Most reps start their first week without this foundation. You're already ahead."
        },
        {
            "title": "Tonight's Homework",
            "type": "text",
            "content": "Before tomorrow, complete three assignments. Watch two short videos on net metering \u2014 links are in your training portal. Read the top objection handling guide your company has provided \u2014 it's five pages, read it fully. And practice explaining how solar works to someone at home. Record yourself on your phone. Listen back. You'll hear what needs tightening. This kind of self-review is one of the fastest ways to improve."
        },
        {
            "title": "Tomorrow's Preview",
            "type": "text",
            "content": "Tomorrow is one of the most important days in the program. You'll learn homeowner psychology \u2014 why people resist solar, and what to do about it. You'll build your territory strategy. You'll learn the Solar Conversation Framework, which is the backbone of every interaction you'll ever have. And you'll practice micro objection handling \u2014 the skill that separates reps who get appointments from those who get doors closed in their face. Come ready to work."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_1_8_1",
            "type": "open_response",
            "label": "Reflect on Day 1 Wrap-Up & Preview: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 2.1 — Homeowner Psychology: Why People Resist Solar ────────────────────────────────
    "mod_2_1": {
    "id": "mod_2_1",
    "title": "Module 2.1: Homeowner Psychology: Why People Resist Solar",
    "subtitle": "Understand the psychological barriers homeowners bring to every solar conversation Recognize resistance as normal human ",
    "sections": [
        {
            "title": "Why Understanding Psychology Matters",
            "type": "text",
            "content": "Before you can persuade anyone of anything, you need to understand how they think. The most common mistake in solar sales is treating every homeowner like they simply need more information. They don't. They need trust, time, and the right framing. This module will change how you walk up to every door. Reps who understand why homeowners resist close twice as many deals as those who only know what to say."
        },
        {
            "title": "Status Quo Bias",
            "type": "text",
            "content": "Homeowners are not actively looking for a solar salesperson. When you show up at their door, their brain's default mode is to preserve the status quo. Change feels risky. Inaction feels safe \u2014 even when the current situation is objectively worse. This is called status quo bias. Your job isn't to push homeowners toward a decision. It's to guide them toward understanding, and let the decision emerge naturally from the numbers."
        },
        {
            "title": "Contractor Trust Barriers",
            "type": "text",
            "content": "Most homeowners have been let down by a contractor before. A roofer who disappeared after the deposit. An HVAC company that overcharged. A home warranty that covered nothing. That history lives in the background of every conversation you have. The homeowner isn't just evaluating solar \u2014 they're evaluating you as a person and whether you'll be different. Slow down. Don't push for information or commitment before you've earned it. Every genuine moment of rapport is a deposit in their trust account."
        },
        {
            "title": "Solar Industry Skepticism",
            "type": "text",
            "content": "The solar industry has earned some of its bad reputation. Aggressive door-to-door tactics, misleading savings promises, and companies that went bankrupt mid-install have made some homeowners deeply skeptical of any solar rep \u2014 regardless of how you present yourself. The solution is to acknowledge this proactively. Name the elephant in the room. Reps who say \u2014 I know solar reps have a certain reputation, and here's why I do things differently \u2014 build trust faster than those who pretend the skepticism doesn't exist."
        },
        {
            "title": "Loss Aversion",
            "type": "text",
            "content": "Nobel Prize-winning research shows that people feel the pain of a loss about twice as intensely as the pleasure of an equivalent gain. In practice this means: framing solar as preventing a loss is more powerful than framing it as gaining a benefit. A homeowner who could save two hundred dollars per month isn't moved by gaining two hundred dollars \u2014 they're moved by not losing two hundred dollars every month to a utility that doesn't deserve it. Use this framing. It works."
        },
        {
            "title": "Decision Fatigue",
            "type": "text",
            "content": "By the time you knock on a door at five pm, that homeowner may have made thousands of decisions that day. Decision fatigue makes people default to no \u2014 not because they don't want solar, but because saying no requires less mental effort than evaluating a proposal. Your response to this is to make every next step easy and low-risk. Keep your door pitch under sixty seconds. Don't ask for a big decision at the door \u2014 ask for a small one. An appointment. That's it."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_1_1",
            "type": "open_response",
            "label": "Reflect on Homeowner Psychology: Why People Resist Solar: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 2.1 Knowledge Check",
        "questions": [
            {
                "id": "kc_2_1_a",
                "question": "What was the main concept covered in Homeowner Psychology: Why People Resist Solar?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 2.1 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 2.2 — Territory Strategy & Planning ────────────────────────────────
    "mod_2_2": {
    "id": "mod_2_2",
    "title": "Module 2.2: Territory Strategy & Planning",
    "subtitle": "Choose high-probability neighborhoods Leverage install proximity Build neighborhood authority",
    "sections": [
        {
            "title": "The Cloverleaf Strategy",
            "type": "text",
            "content": "The cloverleaf strategy is simple and powerful. You start from a recent solar install in a neighborhood and work outward in concentric circles. When you knock on the next door and say \u2014 your neighbor on the corner just went solar and I'm following up in the area \u2014 you immediately have social proof. The homeowner's first thought is: someone I know already did this. That transforms the conversation from cold to warm before you've said another word."
        },
        {
            "title": "Territory Selection Criteria",
            "type": "text",
            "content": "Not all neighborhoods are created equal. The sweet spot for solar is homes valued at two hundred fifty thousand dollars or more, with roofs between five and fifteen years old, served by a utility with strong net metering policies, and in HOA-friendly areas. Avoid co-op utilities if your area has poor net metering agreements. Use Zillow, county records, and your company's install database to pre-qualify neighborhoods before you spend a single golden hour in them."
        },
        {
            "title": "Building Neighborhood Authority",
            "type": "text",
            "content": "The goal is to saturate one area before moving to another. Become the solar rep in that zip code. When multiple neighbors have seen you, talked about you, or seen your yard signs \u2014 the next conversation opens at a much higher trust level. Some advanced reps host neighborhood info sessions once they have three or more installs on a block. That kind of neighborhood authority is what eliminates the need for cold prospecting over time."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_2_1",
            "type": "open_response",
            "label": "Reflect on Territory Strategy & Planning: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 2.3 — Daily Efficiency Math & Time Management ────────────────────────────────
    "mod_2_3": {
    "id": "mod_2_3",
    "title": "Module 2.3: Daily Efficiency Math & Time Management",
    "subtitle": "Understand revenue per hour Maximize golden hours Eliminate time waste",
    "sections": [
        {
            "title": "The Math Behind the Door",
            "type": "text",
            "content": "Let's run the math on a typical door-knocking day. Industry averages show one conversation per three doors knocked, one appointment per five conversations, and one close per three appointments. That means forty-five doors equals one close on average. At an average commission of thirty-five hundred dollars, and five golden hours per day, that's roughly three hundred eighty-nine dollars per hour worked. Every door you knock \u2014 whether they answer or not \u2014 is worth about seventy-eight dollars. That reframe makes rejection a lot easier to process."
        },
        {
            "title": "Daily Non-Negotiables",
            "type": "text",
            "content": "Your golden hours \u2014 two pm to seven pm \u2014 are for one thing only: prospecting. No admin. No errands. No long phone calls. During these five hours, your only job is to knock doors or dial numbers, set appointments, and advance conversations. The reps who protect this window build income. The reps who let it get eaten by distractions wonder why they're not closing. Set a minimum of two appointments per golden-hour session. Anything less and your pipeline will run dry within two weeks."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_3_1",
            "type": "open_response",
            "label": "Reflect on Daily Efficiency Math & Time Management: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 2.4 — The Solar Conversation Framework: Introduction ────────────────────────────────
    "mod_2_4": {
    "id": "mod_2_4",
    "title": "Module 2.4: The Solar Conversation Framework: Introduction",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "The 7-Step Framework Overview",
            "type": "text",
            "content": "Every solar conversation you'll ever have \u2014 at the door, on the phone, or inside a home \u2014 follows the same seven-step arc. Step one: Pattern Interrupt. Step two: Rapport. Step three: Curiosity Question. Step four: Problem Awareness. Step five: Utility Bill Discovery. Step six: Qualification. Step seven: Appointment or next step. You may move through some steps faster than others depending on the homeowner, but you never skip a step. This framework is your GPS. Use it every single time."
        },
        {
            "title": "Framework at the Door \u2014 60 Seconds",
            "type": "text",
            "content": "At the door, you compress the full framework into sixty to ninety seconds. Break their autopilot with a neighbor reference or something unexpected \u2014 that's your Pattern Interrupt. One human moment before business \u2014 that's Rapport. Ask a simple curiosity question about their energy situation. Help them see a problem they've been tolerating. Ask about their monthly electric bill \u2014 that's your Discovery. Confirm they own the home and how long they've lived there \u2014 that's Qualification. Then close on a specific appointment time. Sixty seconds. Seven steps. Done."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_4_1",
            "type": "open_response",
            "label": "Reflect on The Solar Conversation Framework: Introduction: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 2.4 Knowledge Check",
        "questions": [
            {
                "id": "kc_2_4_a",
                "question": "What was the main concept covered in The Solar Conversation Framework: Introduction?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 2.4 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 2.5 — Door Knocking Mastery ────────────────────────────────
    "mod_2_5": {
    "id": "mod_2_5",
    "title": "Module 2.5: Door Knocking Mastery",
    "subtitle": "Overcome door anxiety Master the 30-second pitch Set appointments efficiently",
    "sections": [
        {
            "title": "Pre-Knock Preparation",
            "type": "text",
            "content": "What happens before you knock matters as much as what you say at the door. Appearance: clean, professional, name badge visible. Materials: your tablet charged, business cards in your pocket, and any one-pager you use. And mindset: before you ever raise your hand to knock, reset. Expect that most people won't be interested. Celebrate the conversations, not just the appointments. The rep who walks to each door with calm confidence closes more than the rep who walks up hoping for a yes."
        },
        {
            "title": "The 30-Second Opener \u2014 3 Variations",
            "type": "text",
            "content": "You have three proven openers. The Neighbor Reference opener leverages a nearby install to create social proof immediately. The Utility Bill Audit opener positions you as someone doing free energy assessments in the area \u2014 low threat, high curiosity. The Install Proximity opener works when you have active job sites nearby \u2014 you're introducing yourself as part of a crew already on the street. Memorize all three. Use whichever fits the neighborhood and the moment."
        },
        {
            "title": "Appointment Setting Close",
            "type": "text",
            "content": "When you're ready to close on an appointment, don't ask if they want one. Give them a choice between two times. I have Thursday at six or Saturday at ten \u2014 which works better for you? This is called an assumptive binary close. You're not asking if they want an appointment. You're assuming they do and asking which time works. This small language shift increases appointment conversion dramatically. Practice it until it feels natural."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_5_1",
            "type": "open_response",
            "label": "Reflect on Door Knocking Mastery: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 2.5 Knowledge Check",
        "questions": [
            {
                "id": "kc_2_5_a",
                "question": "What was the main concept covered in Door Knocking Mastery?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 2.5 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 2.6 — Micro Objection Handling: Getting Past the Brush-Off ────────────────────────────────
    "mod_2_6": {
    "id": "mod_2_6",
    "title": "Module 2.6: Micro Objection Handling: Getting Past the Brush-Off",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "What Micro Objections Really Are",
            "type": "text",
            "content": "Most objections at the door are not real objections. They are automatic, reflexive responses designed to end the interaction as quickly as possible. The homeowner isn't thinking deeply about solar \u2014 they're trying to get back to their life. Your response should never be to argue or defend. The golden rule of micro objections is this: don't argue, don't defend \u2014 ask one curious question and invite them back into the conversation."
        },
        {
            "title": "Not Interested \u2014 The Response",
            "type": "text",
            "content": "When someone says not interested, respond with curiosity, not defense. Try: Totally fair \u2014 quick question, have you already looked into solar, or just haven't gotten around to it yet? If they haven't looked, that opens the door to explain why most people in the area qualify. If they already looked, ask what stopped them from moving forward. That one question reopens the entire conversation. Never argue with not interested. Make it a question."
        },
        {
            "title": "I'm Busy, Leave Info, Already Have Solar",
            "type": "text",
            "content": "Three more common ones. I'm busy right now \u2014 tell them you're not pitching today, you're just booking free consultations. Two minutes to pick a time, then you do all the prep work. Just leave me some info \u2014 the info won't mean anything without their specific numbers. Redirect to booking. Already have solar \u2014 lead with curiosity, ask how it's working out, and pivot to battery storage upgrades or referrals. Every brush-off has a response. Know yours before you knock."
        },
        {
            "title": "Spouse, Renting, and Bad Experience",
            "type": "text",
            "content": "Need to talk to my spouse \u2014 validate it immediately and ask if the spouse is home now. If not, find a time when both are available. I don't like presenting to one spouse because it just doesn't make sense any other way. We're renting \u2014 solar is for homeowners, but pivot to referrals. Do they know neighbors who own? Bad experience \u2014 lead with full empathy. Ask what happened. Listen completely. Then ask if they'd be open to fifteen minutes just to see if things have changed."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_6_1",
            "type": "open_response",
            "label": "Reflect on Micro Objection Handling: Getting Past the Brush-Off: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 2.6 Knowledge Check",
        "questions": [
            {
                "id": "kc_2_6_a",
                "question": "What was the main concept covered in Micro Objection Handling: Getting Past the Brush-Off?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 2.6 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 2.7 — Phone & Virtual Appointment Setting ────────────────────────────────
    "mod_2_7": {
    "id": "mod_2_7",
    "title": "Module 2.7: Phone & Virtual Appointment Setting",
    "subtitle": "Convert inbound leads to appointments Handle cold calls professionally Master tonality & pacing",
    "sections": [
        {
            "title": "Speed to Lead",
            "type": "text",
            "content": "When an inbound lead comes in, your response time is everything. Call within five minutes. If they don't answer, leave a voicemail and send a text simultaneously \u2014 multi-touch. Research shows lead conversion drops dramatically after the first thirty minutes. The homeowner submitted a form while they were curious and motivated. Your job is to reach them while that energy is still there. Every minute you wait, the window closes."
        },
        {
            "title": "Phone Discovery & Appointment Set",
            "type": "text",
            "content": "When you reach them, open with energy and reference their inquiry. Then move into three to five discovery questions: What's your average electric bill? How long have you been in the home? Have you looked into solar before? Is your spouse involved in decisions? From there, transition directly to booking. Tell them you'll pull their utility data and roof layout before you meet, so the call is fully customized. Then give two specific time options and lock them in."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_7_1",
            "type": "open_response",
            "label": "Reflect on Phone & Virtual Appointment Setting: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 2.7 Knowledge Check",
        "questions": [
            {
                "id": "kc_2_7_a",
                "question": "What was the main concept covered in Phone & Virtual Appointment Setting?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 2.7 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 2.8 — Anti-Sales Framing & Trust Building ────────────────────────────────
    "mod_2_8": {
    "id": "mod_2_8",
    "title": "Module 2.8: Anti-Sales Framing & Trust Building",
    "subtitle": "Position as consultant, not salesperson Use disarming language Build instant rapport",
    "sections": [
        {
            "title": "The Anti-Pitch Opener",
            "type": "text",
            "content": "The fastest way to lower a homeowner's guard is to say something they didn't expect from a solar rep. Try: I'm not here to sell you anything today. I'm just here to see if it makes sense. That one sentence removes the pressure they were bracing for. It shifts the dynamic from adversarial to collaborative. Follow it immediately with permission-based questions: Is it okay if I ask you a few things first? Mind if I pull up your roof real quick? You're building micro-agreements before you've asked for anything significant."
        },
        {
            "title": "Disqualification Framing",
            "type": "text",
            "content": "One of the most powerful things you can say early in a conversation is: Honestly, solar doesn't make sense for everyone. Let me first figure out if you're even a fit. This is disqualification framing, and it works through reverse psychology. By suggesting they might not qualify, you activate the homeowner's desire to qualify. You've created a challenge they now want to pass. You've also pre-positioned yourself as selective \u2014 and selective consultants are trusted more than desperate salespeople."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_8_1",
            "type": "open_response",
            "label": "Reflect on Anti-Sales Framing & Trust Building: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 2.9 — Daily Prospecting Workflow & Accountability ────────────────────────────────
    "mod_2_9": {
    "id": "mod_2_9",
    "title": "Module 2.9: Daily Prospecting Workflow & Accountability",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "The Daily Prospecting Rhythm",
            "type": "text",
            "content": "Your day has four blocks. Morning from eight to ten is for admin, CRM updates, and route planning. Midday from ten to two is for training, team calls, and proposal prep. Two to seven pm \u2014 golden hours \u2014 is for prospecting only. And from seven to eight pm, you log your activity, complete follow-ups, and plan tomorrow's route. This structure removes decision fatigue about what to do next. You always know what time it is and what your job is."
        },
        {
            "title": "KPI Tracking & Accountability",
            "type": "text",
            "content": "Every night, report four numbers to your manager: doors knocked, conversations had, appointments set, and follow-ups completed. These numbers tell the whole story. If you're knocking doors but not having conversations, the opener needs work. If you're having conversations but not setting appointments, the transition needs work. If you're setting appointments but they're not showing, the confirmation process needs work. Track your numbers and you always know exactly where to improve."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_9_1",
            "type": "open_response",
            "label": "Reflect on Daily Prospecting Workflow & Accountability: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 2.10 — Day 2 Role-Play Certification ────────────────────────────────
    "mod_2_10": {
    "id": "mod_2_10",
    "title": "Module 2.10: Day 2 Role-Play Certification",
    "subtitle": "Validate learning through live simulation Build confidence before real field work Test all Day 2 skills end-to-end",
    "sections": [
        {
            "title": "Certification Format",
            "type": "text",
            "content": "Today's role-play certification has four rounds. Round one: you knock a door and your manager plays a skeptical homeowner who opens with not interested. Round two: you take a phone call from a rushed lead. Round three: you handle three micro objections back to back in rapid fire. Round four: you run the full seven-step Conversation Framework at the door from start to finish. You need to demonstrate all four competencies before leaving today. This is your first real test."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_10_1",
            "type": "open_response",
            "label": "Reflect on Day 2 Role-Play Certification: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 2.10 Knowledge Check",
        "questions": [
            {
                "id": "kc_2_10_a",
                "question": "What was the main concept covered in Day 2 Role-Play Certification?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 2.10 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 2.11 — Day 2 Wrap-Up & Field Assignment ────────────────────────────────
    "mod_2_11": {
    "id": "mod_2_11",
    "title": "Module 2.11: Day 2 Wrap-Up & Field Assignment",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Tonight's Field Assignment",
            "type": "text",
            "content": "Tonight you have a field assignment. Knock twenty doors. This is practice \u2014 no pressure to close anything. But knock them like they're real, because they are real. Record yourself at three of those doors with your phone. Watch the playback tonight and notice your body language, your opener, your energy. Then review your homeowner empathy map from earlier and note which types you encountered. Bring your observations to tomorrow's session. Day Three starts where Day Two left off."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_2_11_1",
            "type": "open_response",
            "label": "Reflect on Day 2 Wrap-Up & Field Assignment: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 3.1 — In-Home Positioning & Environmental Control ────────────────────────────────
    "mod_3_1": {
    "id": "mod_3_1",
    "title": "Module 3.1: In-Home Positioning & Environmental Control",
    "subtitle": "Control the appointment setting Build subconscious authority Eliminate distractions",
    "sections": [
        {
            "title": "Pre-Arrival Checklist",
            "type": "text",
            "content": "Before you walk in the door, do three things. Confirm the appointment two hours before by text and call. Arrive five minutes early and park in front of the home. From your car, assess the roof \u2014 look for shading, pitch, and condition before you ever ring the doorbell. This recon saves you time inside and lets you ask smarter questions. Walking in prepared is not optional \u2014 it's the standard of a professional consultant."
        },
        {
            "title": "The Power Seat Strategy",
            "type": "text",
            "content": "Where you sit in the home matters more than most reps realize. Your goal is the kitchen or dining table \u2014 not the couch. At the table, position yourself at the head or corner. Homeowners sit to your side, which creates a collaborative dynamic instead of an adversarial face-off. Ask them to face away from the TV. Request that pets are settled and kids are occupied. These aren't rude requests \u2014 they're professional ones. Your opening frame should be: I'm going to ask a lot of questions first, then show you numbers. If it makes sense, great. If not, I'll tell you."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_1_1",
            "type": "open_response",
            "label": "Reflect on In-Home Positioning & Environmental Control: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 3.2 — Personality Profiling ────────────────────────────────
    "mod_3_2": {
    "id": "mod_3_2",
    "title": "Module 3.2: Personality Profiling",
    "subtitle": "Identify personality type in 2 minutes Adapt communication style Avoid mismatches that kill deals",
    "sections": [
        {
            "title": "The BOLT Personality Types",
            "type": "text",
            "content": "The BOLT framework gives you four personality types to quickly identify and adapt to. Bull \u2014 dominant, direct, fast. They want the bottom line immediately. Owl \u2014 analytical, detail-oriented, skeptical. They want data, warranties, and specs. Lion \u2014 enthusiastic, social, emotional. They want to connect personally and feel good about the decision. Turtle \u2014 steady, risk-averse, hesitant. They need social proof, safety, and zero pressure. You'll typically know which type someone is within two minutes of entering their home."
        },
        {
            "title": "Adapting to Each Type",
            "type": "text",
            "content": "For the Bull \u2014 skip the small talk, show the ROI fast, get to the close. For the Owl \u2014 bring data, show the degradation curve, quote specific warranties and engineering reports. For the Lion \u2014 ask about their family, make the conversation personal, celebrate the environmental and legacy impact. For the Turtle \u2014 move slowly, emphasize how many neighbors have done this, remove any feeling of pressure, and let them feel they're in control of the pace. Most couples are a mix \u2014 adapt to both, starting with whoever is more resistant."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_2_1",
            "type": "open_response",
            "label": "Reflect on Personality Profiling: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 3.2 Knowledge Check",
        "questions": [
            {
                "id": "kc_3_2_a",
                "question": "What was the main concept covered in Personality Profiling?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 3.2 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 3.3 — Real-World Homeowner Scenario Library ────────────────────────────────
    "mod_3_3": {
    "id": "mod_3_3",
    "title": "Module 3.3: Real-World Homeowner Scenario Library",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Scenario 1 \u2014 The Burned Homeowner",
            "type": "text",
            "content": "The burned homeowner has been let down by a contractor before. Their trust has been violated and they are looking for evidence that you're the same. Your job is to not defend the industry or minimize their experience. Validate completely. Ask what specifically went wrong \u2014 that shows you genuinely care. Move slower than you normally would. Offer social proof in writing: reviews, references, license numbers, warranty documents. Never rush to close with this homeowner. Let them set the pace."
        },
        {
            "title": "Scenario 2 \u2014 The Researcher",
            "type": "text",
            "content": "This homeowner has done extensive research and their ego is invested in that research. They are testing you. Don't talk down to them or repeat basics they already know. Ask what they've learned and what questions remain. Use specific technical language \u2014 NEM, degradation curves, DC-to-AC ratio, dealer fees. If you don't know something, say so honestly: great question \u2014 let me get you the exact figures from our engineer. Then ask them: based on your research, what's the one thing that's been holding you back? That usually reveals the real objection."
        },
        {
            "title": "Scenario 3 \u2014 The Busy Homeowner",
            "type": "text",
            "content": "This homeowner is time-constrained, or uses busyness as a shield. Accept the time constraint immediately \u2014 I respect that, I'll be quick. Lead right away with the most compelling hook: your bill is over X, right? In fifteen minutes I can show you whether you're leaving money on the table. Skip rapport-building and get to curiosity questions fast. If they truly can't sit now, secure a specific appointment: what if I came back Thursday at six \u2014 twenty minutes, I'll have everything prepared."
        },
        {
            "title": "Scenario 4 \u2014 The Friendly Non-Committer",
            "type": "text",
            "content": "This homeowner likes you and enjoys the conversation \u2014 but likability is not decision readiness. They're conflict-avoidant. They'll agree with everything and then say let me think about it at the end. Enjoy the rapport, but use micro-closes throughout: make sense so far? If the numbers worked, would anything stop you from moving forward? When they say they'll think about it, ask specifically what they want to think through. Then use assumptive language to advance: let's get you scheduled."
        },
        {
            "title": "Scenario 5 \u2014 Already Has Solar / Trusts the Utility",
            "type": "text",
            "content": "Already has solar \u2014 lead with genuine curiosity: how's it working out? Look for dissatisfaction, upgrade opportunities, or battery storage needs. If they're happy, pivot to referrals. Trusts the utility \u2014 don't attack the utility company. Instead, educate gently: do you know how much they've raised rates over the last ten years? Show historical data as a factual conversation, not an accusation. Reframe solar as a hedge: you'd still be connected to the utility, you'd just be less dependent on their pricing decisions."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_3_1",
            "type": "open_response",
            "label": "Reflect on Real-World Homeowner Scenario Library: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 3.3 Knowledge Check",
        "questions": [
            {
                "id": "kc_3_3_a",
                "question": "What was the main concept covered in Real-World Homeowner Scenario Library?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 3.3 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 3.4 — Tactical Empathy & Mirroring ────────────────────────────────
    "mod_3_4": {
    "id": "mod_3_4",
    "title": "Module 3.4: Tactical Empathy & Mirroring",
    "subtitle": "Build deep rapport instantly Make homeowners feel heard Uncover hidden objections",
    "sections": [
        {
            "title": "Mirroring \u2014 Repeat the Last Three Words",
            "type": "text",
            "content": "Mirroring is one of the most powerful rapport-building tools that exists. When a homeowner says something \u2014 worried about the cost \u2014 you simply repeat their last two or three words as a question. Worried about the cost? They'll naturally elaborate. You haven't said anything \u2014 you've just opened a door. This technique forces them to say more than they planned to, and in doing so they often reveal the real concern underneath the surface one."
        },
        {
            "title": "Labeling & Calibrated Questions",
            "type": "text",
            "content": "Labeling means naming the emotion you're observing. It sounds like you're frustrated with your utility company. It seems like you're concerned about the commitment. When you name emotions accurately, homeowners feel heard \u2014 and when people feel heard, they trust. Pair labeling with calibrated questions \u2014 open-ended questions that start with what or how. What would saving a hundred dollars a month allow you to do? What's making you consider this now? These questions build motivation instead of putting homeowners on the defensive."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_4_1",
            "type": "open_response",
            "label": "Reflect on Tactical Empathy & Mirroring: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 3.4 Knowledge Check",
        "questions": [
            {
                "id": "kc_3_4_a",
                "question": "What was the main concept covered in Tactical Empathy & Mirroring?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 3.4 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 3.5 — Question Architecture: The Discovery Sequence ────────────────────────────────
    "mod_3_5": {
    "id": "mod_3_5",
    "title": "Module 3.5: Question Architecture: The Discovery Sequence",
    "subtitle": "Uncover true pain points Build urgency Qualify financial readiness",
    "sections": [
        {
            "title": "Questions About Current State",
            "type": "text",
            "content": "The first four discovery questions focus on the homeowner's current situation. What is your average electric bill? Has it been going up the last few years \u2014 they almost always say yes. What is the most you've ever paid in a single month \u2014 this anchors a high number in their mind. And what do you hate most about your utility company \u2014 this is an emotional trigger that surfaces frustration they've been carrying for years. These questions don't just qualify the lead \u2014 they build the emotional foundation for your presentation."
        },
        {
            "title": "Questions About Future State & Decision-Making",
            "type": "text",
            "content": "The next set of questions looks forward and qualifies the decision. What happens if rates go up another six percent next year? How long are you planning to stay in this home? Are you thinking about an electric vehicle? These build urgency and future-proof the conversation. Then move to decision-making questions. Who else needs to be part of this decision \u2014 identify blockers early. If the numbers make sense, is there any reason you wouldn't move forward \u2014 smoke out hidden objections before you've built the proposal. And confirm credit range and timeline. These twelve questions are your entire pre-presentation checklist."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_5_1",
            "type": "open_response",
            "label": "Reflect on Question Architecture: The Discovery Sequence: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 3.5 Knowledge Check",
        "questions": [
            {
                "id": "kc_3_5_a",
                "question": "What was the main concept covered in Question Architecture: The Discovery Sequence?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 3.5 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 3.6 — Spouse & Decision-Maker Dynamics ────────────────────────────────
    "mod_3_6": {
    "id": "mod_3_6",
    "title": "Module 3.6: Spouse & Decision-Maker Dynamics",
    "subtitle": "Prevent \"I need to talk to my spouse\" objection Ensure both decision-makers are aligned Avoid single-spouse closes (high",
    "sections": [
        {
            "title": "The Golden Rule \u2014 Never Present to One Spouse",
            "type": "text",
            "content": "This rule has one exception: a confirmed single decision-maker. If a spouse is not home, do not present. Reschedule. Presenting to one spouse and closing without the other is the number one cause of next-day cancellations. The logic is simple: the absent spouse hears a summary with missing information, gets concerned, and kills the deal. The rep who insisted on presenting to one spouse caused that cancellation. When in doubt, say: I don't like to move forward unless both of you are there \u2014 when's a good time for both?"
        },
        {
            "title": "Equalizing Both Spouses",
            "type": "text",
            "content": "Throughout the presentation, make eye contact with both homeowners equally. Ask both for input \u2014 and specifically direct questions to the quieter spouse. Does that make sense? \u2014 look at both. Sound good so far? \u2014 wait for both to nod. Any concerns? \u2014 let both voice objections. If one spouse is clearly skeptical, address them directly and early: I can tell you're the careful one \u2014 that's a good thing. What's your biggest concern? Handling skepticism head-on in front of their partner builds credibility with both of them."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_6_1",
            "type": "open_response",
            "label": "Reflect on Spouse & Decision-Maker Dynamics: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 3.6 Knowledge Check",
        "questions": [
            {
                "id": "kc_3_6_a",
                "question": "What was the main concept covered in Spouse & Decision-Maker Dynamics?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 3.6 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 3.7 — Roof & Site Assessment ────────────────────────────────
    "mod_3_7": {
    "id": "mod_3_7",
    "title": "Module 3.7: Roof & Site Assessment",
    "subtitle": "Spot deal-killers early Set realistic expectations Avoid costly site surveys for unqualified homes",
    "sections": [
        {
            "title": "Roof Inspection Basics",
            "type": "text",
            "content": "During or before every appointment, walk the property and assess the roof. The four things you're evaluating are shading, condition, pitch, and material. Heavy shade from trees is a serious production killer \u2014 if it covers more than forty percent of the usable roof area, the system may not economically justify itself. A roof needing replacement within five years should be addressed before install \u2014 panels have to come off during a re-roof and that costs extra. And the ideal roof is south-facing between fifteen and forty degrees of pitch on asphalt shingles."
        },
        {
            "title": "Electrical Panel & HOA Considerations",
            "type": "text",
            "content": "Ask to see the electrical panel \u2014 usually in the garage or basement. Two hundred amp service is ideal. One hundred amp may require a main panel upgrade costing two to five thousand dollars \u2014 that affects your proposal. Red flag brands like Zinsco or Federal Pacific need replacement before solar and should be disclosed. For HOA properties, confirm solar is permitted and ask about any aesthetics restrictions. Most HOAs legally cannot deny solar under state laws, but they may control placement. Get this information before you finalize the design."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_7_1",
            "type": "open_response",
            "label": "Reflect on Roof & Site Assessment: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 3.8 — Disqualification Mastery: When to Walk Away ────────────────────────────────
    "mod_3_8": {
    "id": "mod_3_8",
    "title": "Module 3.8: Disqualification Mastery: When to Walk Away",
    "subtitle": "Protect time and company resources Build trust by being honest Avoid future cancellations",
    "sections": [
        {
            "title": "The Top Disqualification Scenarios",
            "type": "text",
            "content": "Walking away from a bad deal is one of the highest-integrity moves a consultant can make \u2014 and it's also good business. The top scenarios where you disqualify: homeowner is moving within three years, credit score is below six hundred, the roof needs replacement first, heavy shading makes production unviable, usage is below four hundred kilowatt-hours per month, or the homeowner has unrealistic expectations like eliminating their bill to zero. In every case, be direct. Say the honest thing. Recommend the right path. Then ask to follow up when conditions change."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_8_1",
            "type": "open_response",
            "label": "Reflect on Disqualification Mastery: When to Walk Away: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 3.8 Knowledge Check",
        "questions": [
            {
                "id": "kc_3_8_a",
                "question": "What was the main concept covered in Disqualification Mastery: When to Walk Away?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 3.8 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 3.9 — Day 3 Full Discovery Simulation ────────────────────────────────
    "mod_3_9": {
    "id": "mod_3_9",
    "title": "Module 3.9: Day 3 Full Discovery Simulation",
    "subtitle": "Validate all Day 3 skills in one realistic scenario Receive manager feedback Build confidence for real appointments",
    "sections": [
        {
            "title": "Simulation Setup",
            "type": "text",
            "content": "In today's full discovery simulation you will run a complete in-home discovery with a challenging scenario. A married couple: one personality type who's eager and one who's skeptical. A monthly electric bill of two hundred forty dollars. A recently repaired roof. And a hidden objection from the skeptical spouse. Your job is to control the environment, identify both personality types, ask all twelve discovery questions, use mirroring and labeling to uncover the hidden objection, and qualify their financial readiness \u2014 all while maintaining calm consultant energy."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_9_1",
            "type": "open_response",
            "label": "Reflect on Day 3 Full Discovery Simulation: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 3.9 Knowledge Check",
        "questions": [
            {
                "id": "kc_3_9_a",
                "question": "What was the main concept covered in Day 3 Full Discovery Simulation?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 3.9 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 3.10 — Day 3 Wrap-Up & Homework ────────────────────────────────
    "mod_3_10": {
    "id": "mod_3_10",
    "title": "Module 3.10: Day 3 Wrap-Up & Homework",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Day 3 Homework",
            "type": "text",
            "content": "Tonight: set one real appointment. It can be a friend or family member if needed, but run the full discovery when you get there. Use all twelve questions. Record yourself and submit the recording by nine pm. Tomorrow is Day Four \u2014 presentation mastery. You'll learn how to show the numbers in a way that makes the decision obvious, master all three financing structures, and run a full twenty-minute presentation role-play. Come in tomorrow with your discovery recording reviewed and notes taken."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_3_10_1",
            "type": "open_response",
            "label": "Reflect on Day 3 Wrap-Up & Homework: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 4.1 — Utility Bill Deep Dive: Advanced Analysis ────────────────────────────────
    "mod_4_1": {
    "id": "mod_4_1",
    "title": "Module 4.1: Utility Bill Deep Dive: Advanced Analysis",
    "subtitle": "Perform surgical bill analysis in front of homeowner Build credibility through technical mastery Identify hidden savings",
    "sections": [
        {
            "title": "The Bill Autopsy Process",
            "type": "text",
            "content": "When you analyze a utility bill in front of a homeowner, narrate everything you're doing. Let me show you exactly where your money's going. This transparency builds trust. You're not hiding behind a proposal \u2014 you're showing them their own data in real time. Start with the twelve-month usage history. Add up the total kilowatt-hours. Calculate the daily average. Then say: so you're using about thirty-three kilowatt-hours per day \u2014 that's typical for a home this size in this area. You've immediately shown expertise without selling anything."
        },
        {
            "title": "Rate Structure Identification",
            "type": "text",
            "content": "The rate structure determines how much solar actually saves. A flat rate is the simplest \u2014 same cents per kilowatt-hour all month. A tiered rate gets more expensive as usage increases, which means solar saves more per kilowatt-hour because it eliminates the most expensive usage tiers first. Time-of-use rates charge different amounts by time of day \u2014 morning off-peak is cheap, afternoon on-peak is expensive. For time-of-use customers, solar production during peak hours is most valuable, and a battery can maximize those savings even further."
        },
        {
            "title": "Inflation Projection",
            "type": "text",
            "content": "Here is the most powerful number in your presentation. Look up your utility's historical rate increase \u2014 typically five to six percent per year. Then show the compounding effect. A current bill of one hundred eighty dollars per month becomes two hundred forty dollars in five years, three hundred twenty in ten, and over four hundred dollars in fifteen. Over twenty-five years, the homeowner will pay the utility over one hundred thousand dollars \u2014 and own nothing. Solar locks their rate. The contrast between those two futures is where decisions get made."
        },
        {
            "title": "True-Up Logic & Offset Explained",
            "type": "text",
            "content": "For homeowners on net metering, true-up is the annual settlement. During the year, credits accumulate when the system overproduces. At year-end, the utility settles the account. If you overproduced, they pay you \u2014 typically at wholesale rates. If you underproduced, you pay the difference at retail. That's why we size systems at one hundred five to one hundred ten percent of annual usage \u2014 to build in a production cushion for degradation and future increases. And they'll still have a small monthly bill \u2014 usually ten to twenty dollars \u2014 for connection fees. That's the honest expectation to set."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_4_1_1",
            "type": "open_response",
            "label": "Reflect on Utility Bill Deep Dive: Advanced Analysis: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 4.1 Knowledge Check",
        "questions": [
            {
                "id": "kc_4_1_a",
                "question": "What was the main concept covered in Utility Bill Deep Dive: Advanced Analysis?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 4.1 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 4.2 — Financing Deep Dive ────────────────────────────────
    "mod_4_2": {
    "id": "mod_4_2",
    "title": "Module 4.2: Financing Deep Dive",
    "subtitle": "Explain loan vs lease vs PPA clearly Match financing to homeowner's goals Calculate payments with confidence",
    "sections": [
        {
            "title": "Option 1 \u2014 Solar Loan",
            "type": "text",
            "content": "The solar loan is the most common and most beneficial financing structure for qualified homeowners. The homeowner borrows money to purchase the system outright, owns it completely, and may be eligible to apply for the Residential Clean Energy Credit if qualifying property was installed through December 31, 2025. Eligibility depends on individual tax situation and timing. Monthly payments are often lower than their current utility bill from day one. The trade-off is good credit is required \u2014 generally six hundred fifty or higher. The long-term savings are the highest of any financing option because the homeowner owns a depreciating-zero asset that eliminates their biggest recurring utility expense.",
            "narration": "Let's look at Option One: the solar loan. This is the most common financing structure. The homeowner borrows money to purchase the system outright and owns it completely. Under current federal guidance, they may be eligible to apply for the Residential Clean Energy Credit if the qualifying property was installed through December 31, 2025. Remember, eligibility depends on their individual tax situation and timing. Monthly payments are often lower than their current utility bill from day one. It requires a good credit score—generally six hundred fifty or higher. Long-term savings are high because they own an asset that replaces a rising utility bill."
        },
        {
            "title": "The 18-Month Tax Credit Strategy",
            "type": "text",
            "content": "Many solar loans offer an eighteen-month same-as-cash window. Here is how to explain it. In the first eighteen months, the payment is slightly higher. The loan is structured assuming a tax credit is applied within eighteen months to keep the payment low, but you'll want to consult your tax professional to verify your eligibility under the federal guidelines. Walk through that math with them clearly.",
            "narration": "Many solar loans offer an eighteen-month same-as-cash window. In the first eighteen months, the payment is slightly higher. The loan is structured assuming a tax credit is applied within eighteen months to keep the payment low. You must advise the homeowner to consult their tax professional to verify their eligibility under federal guidelines. Walk through that math with them clearly and keep it fully compliant."
        },
        {
            "title": "Option 2 & 3 \u2014 Lease and PPA",
            "type": "text",
            "content": "The solar lease and Power Purchase Agreement are both zero-down options where the solar company owns the system. With a lease, the homeowner pays a fixed monthly amount. With a PPA, they pay per kilowatt-hour produced. Both options transfer maintenance responsibility to the company. The trade-off: the homeowner does not receive the federal tax credit, and both have escalator clauses that increase payments annually. Recommend these for homeowners with lower credit scores, no meaningful tax liability, or those who simply want simplicity over maximum savings.",
            "narration": "Options two and three are leases and Power Purchase Agreements. These are zero-down structures where the solar provider owns and maintains the panels. Under a lease, the homeowner pays a flat monthly rate. Under a PPA, they pay a set rate per kilowatt-hour generated. The main trade-offs are that the homeowner does not get the federal tax credit, and these contracts often include an annual escalator. Recommend these for clients with lower credit, no tax liability, or those who value a maintenance-free setup over maximum savings."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_4_2_1",
            "type": "open_response",
            "label": "Reflect on Financing Deep Dive: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 4.2 Knowledge Check",
        "questions": [
            {
                "id": "kc_4_2_a",
                "question": "What was the main concept covered in Financing Deep Dive?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 4.2 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 4.3 — The Value Stack: Beyond Money ────────────────────────────────
    "mod_4_3": {
    "id": "mod_4_3",
    "title": "Module 4.3: The Value Stack: Beyond Money",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "The 4 Pillars of Solar Value",
            "type": "text",
            "content": "The financial case for solar is strong \u2014 but the decision to go solar is rarely made by math alone. It's made by the combination of financial safety, emotional security, and identity. The four pillars are: financial protection from rate inflation, energy independence from the utility monopoly, home value increase from the asset added, and environmental impact from clean energy generation. Use all four pillars every time. But lead with the one that resonates most for that specific homeowner's BOLT type and lifestyle."
        },
        {
            "title": "The 60-Second Value Stack Script",
            "type": "text",
            "content": "Here is how you deliver all four pillars in sixty seconds. Financial protection \u2014 you are locking your rate while your neighbors' bills keep climbing. Energy independence \u2014 you are no longer at the mercy of the utility's pricing decisions. Home equity \u2014 you are adding fifteen to twenty thousand dollars in home value. And peace of mind \u2014 ten years from now, when your neighbors are paying four hundred dollars a month, you'll be so glad you did this. This isn't just about saving fifty dollars a month. It's about protecting your family from the next twenty-five years of rate increases."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_4_3_1",
            "type": "open_response",
            "label": "Reflect on The Value Stack: Beyond Money: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 4.4 — Net Metering & Battery Storage ────────────────────────────────
    "mod_4_4": {
    "id": "mod_4_4",
    "title": "Module 4.4: Net Metering & Battery Storage",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Net Metering Explained Simply",
            "type": "text",
            "content": "The simplest way to explain net metering is this: think of the grid as your battery. When your panels produce more than your home uses during the day, that extra power goes onto the grid and your meter runs backward \u2014 you're banking credits. At night, when your panels aren't producing, you draw from the grid and spend those credits. The utility acts like a large storage account for your energy. At the end of the year, you settle up. If you banked more than you spent, the utility owes you. If you spent more than you banked, you pay the difference."
        },
        {
            "title": "When Batteries Make Sense",
            "type": "text",
            "content": "Battery storage makes sense in four situations. One \u2014 frequent power outages, where backup power has real value. Two \u2014 time-of-use rates, where you can charge the battery during off-peak hours and discharge during expensive on-peak hours. Three \u2014 states with NEM 3.0, where solar-to-grid credits are reduced and self-consumption becomes more financially beneficial. Four \u2014 homeowners with strong energy independence goals who want to minimize their grid dependence. When none of these apply, batteries add cost without proportional benefit \u2014 and it's your job to say so."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_4_4_1",
            "type": "open_response",
            "label": "Reflect on Net Metering & Battery Storage: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 4.5 — System Design & Production Estimates ────────────────────────────────
    "mod_4_5": {
    "id": "mod_4_5",
    "title": "Module 4.5: System Design & Production Estimates",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Live Design Walkthrough",
            "type": "text",
            "content": "When you pull up the homeowner's roof in the design software, walk them through what you're doing. Here's your home from satellite. Here are where we'd place the panels \u2014 south and west-facing planes for maximum production. This twenty-four-panel system at four hundred watts each gives us nine point six kilowatts of capacity. The software estimates about twelve thousand five hundred kilowatt-hours of production per year, based on twenty-five years of weather data for this exact location. That's a hundred four percent of your current usage \u2014 a small production cushion built in."
        },
        {
            "title": "Compliance Language for Estimates",
            "type": "text",
            "content": "This is a compliance checkpoint that protects you and your company. What you can say: this is an estimate based on historical weather data \u2014 actual production may vary. What you cannot say: you will definitely produce this much, or your bill will be zero. Every estimate includes natural variation due to weather, shading changes, and degradation over time. Using compliant language signals you're a professional. It also prevents cancellations caused by unmet expectations. Accuracy in your promises is the foundation of a cancellation-free pipeline."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_4_5_1",
            "type": "open_response",
            "label": "Reflect on System Design & Production Estimates: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 4.5 Knowledge Check",
        "questions": [
            {
                "id": "kc_4_5_a",
                "question": "What was the main concept covered in System Design & Production Estimates?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 4.5 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 4.6 — The Full Presentation Flow ────────────────────────────────
    "mod_4_6": {
    "id": "mod_4_6",
    "title": "Module 4.6: The Full Presentation Flow",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "The 6-Phase Presentation Structure",
            "type": "text",
            "content": "The full presentation runs twenty minutes and has six phases. Phase one: bill analysis \u2014 five minutes showing them exactly where their money is going. Phase two: system design \u2014 five minutes showing their specific roof and production model. Phase three: financial comparison \u2014 seven minutes showing the twenty-five-year cost of doing nothing versus going solar. Phase four: value stack \u2014 two minutes covering the four pillars. Phase five: incentives and timeline \u2014 one minute covering the federal tax credit and install process. Phase six: transition to close. End every phase with a micro-close \u2014 a short check-in question that confirms alignment before moving forward."
        },
        {
            "title": "Controlling Interruptions & Buying Signals",
            "type": "text",
            "content": "During your presentation, two things will happen: interruptions and buying signals. For interruptions, acknowledge them and redirect: great question \u2014 let me finish this slide and I'll come right back to that. This keeps momentum without dismissing their concern. For buying signals \u2014 leaning forward, nodding, asking about install dates, asking when can we get started \u2014 these are your indicators to accelerate to the close. Don't keep presenting when someone is ready to buy. Transition immediately: the system makes sense, the numbers work, and you're qualified. The only question is \u2014 when do you want to get started?"
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_4_6_1",
            "type": "open_response",
            "label": "Reflect on The Full Presentation Flow: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 4.6 Knowledge Check",
        "questions": [
            {
                "id": "kc_4_6_a",
                "question": "What was the main concept covered in The Full Presentation Flow?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 4.6 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 4.7 — Day 4 Wrap-Up & Homework ────────────────────────────────
    "mod_4_7": {
    "id": "mod_4_7",
    "title": "Module 4.7: Day 4 Wrap-Up & Homework",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Tonight's Assignment",
            "type": "text",
            "content": "Tonight's homework is to deliver the full twenty-minute presentation to a family member and record it. Watch it back and note: did you use micro-closes after each phase? Did you narrate your bill analysis clearly? Did you explain financing confidently? Also practice the payment calculations for three hypothetical homeowners \u2014 different usage levels and credit scores. Tomorrow is Day Five \u2014 objection handling and closing. It's one of the most skill-intensive days in the program. Come in with your presentation memorized."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_4_7_1",
            "type": "open_response",
            "label": "Reflect on Day 4 Wrap-Up & Homework: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 5.1 — Objection Handling Psychology ────────────────────────────────
    "mod_5_1": {
    "id": "mod_5_1",
    "title": "Module 5.1: Objection Handling Psychology",
    "subtitle": "Reframe objections as requests for more information Respond calmly, not defensively Turn objections into closes",
    "sections": [
        {
            "title": "What an Objection Really Is",
            "type": "text",
            "content": "An objection is not a no. An objection is a request for reassurance. If someone were completely uninterested, they'd simply stop engaging \u2014 they wouldn't bother objecting. Every objection tells you they're still in the conversation. The problem is how most reps respond: they get defensive, throw more information, or cave immediately. None of those work. The framework that does work is called A.C.A. \u2014 Acknowledge, Clarify, Answer. Follow this sequence on every objection, in every conversation, and your close rate will climb."
        },
        {
            "title": "The A.C.A. Framework",
            "type": "text",
            "content": "Acknowledge \u2014 validate the concern without agreeing with it. Something like: that makes total sense. Or: I hear you. Clarify \u2014 ask a question to understand what's really underneath the stated concern. Most homeowners surface an objection that hides a deeper one. Answer \u2014 once you understand what they actually need, provide that specific information. Not a general defense of solar. Not a sales pitch. The exact answer to the exact concern. Short. Clear. Confident. Then check in: does that help?"
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_5_1_1",
            "type": "open_response",
            "label": "Reflect on Objection Handling Psychology: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 5.1 Knowledge Check",
        "questions": [
            {
                "id": "kc_5_1_a",
                "question": "What was the main concept covered in Objection Handling Psychology?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 5.1 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 5.2 — The Top 10 Closing Objections + Responses ────────────────────────────────
    "mod_5_2": {
    "id": "mod_5_2",
    "title": "Module 5.2: The Top 10 Closing Objections + Responses",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "I Need to Think About It & Too Expensive",
            "type": "text",
            "content": "I need to think about it \u2014 clarify immediately. Of course \u2014 what specifically do you want to think through? If they're vague, offer three likely categories: the timing, the money, or something that doesn't fully make sense yet. Ask which is closest. That level of specificity always surfaces the real objection. Too expensive \u2014 ask whether it's the monthly payment or the total cost that feels off. If it's monthly, show the solar payment versus their current utility bill side by side. If it's the total, reframe it: this isn't an expense \u2014 it's a twenty-five-year investment that pays for itself."
        },
        {
            "title": "Getting Other Quotes & Not Ready Right Now",
            "type": "text",
            "content": "Getting other quotes \u2014 encourage it. Genuinely. Tell them exactly what to ask competitors: about warranties, installer experience, monitoring, and cancellation policy. Most reps won't answer those questions clearly \u2014 and that contrast makes you look excellent. Then offer to prepare a preliminary design for comparison purposes \u2014 no obligation. Not ready right now \u2014 ask what would need to change for the timing to be right. If they name a specific trigger, set a follow-up for after that event and log it in your CRM immediately. If they name nothing specific, gently use the ITC timeline and current rate increases to frame the cost of waiting."
        },
        {
            "title": "Trust Issues, Home Sale, Roof Warranty, Technology",
            "type": "text",
            "content": "Don't trust solar companies \u2014 acknowledge the concern, ask what specifically they've heard, then show credentials: licenses, reviews, BBB rating, and warranty terms in writing. What if I sell my house \u2014 solar adds home value beyond the remaining loan balance; buyers often pay more for solar homes. Roof warranty \u2014 your workmanship warranty covers the installation for ten years; existing roof warranties can be reviewed before signing. Technology will be better next year \u2014 true, and it's been true for forty years. Every month you wait is a month you're paying the utility. What specifically are you hoping improves?"
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_5_2_1",
            "type": "open_response",
            "label": "Reflect on The Top 10 Closing Objections + Responses: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 5.2 Knowledge Check",
        "questions": [
            {
                "id": "kc_5_2_a",
                "question": "What was the main concept covered in The Top 10 Closing Objections + Responses?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 5.2 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 5.3 — Closing Techniques ────────────────────────────────
    "mod_5_3": {
    "id": "mod_5_3",
    "title": "Module 5.3: Closing Techniques",
    "subtitle": "Ask for the sale confidently Use proven closing techniques without pressure Handle last-minute resistance",
    "sections": [
        {
            "title": "The 5 Closing Techniques",
            "type": "text",
            "content": "You have five closing techniques to deploy based on the homeowner's personality and readiness. The Assumptive Close \u2014 proceed to logistics as if the decision has been made: let's get your application started. What day works for your site survey? The Summary Close \u2014 recap the entire value proposition and ask a simple yes or no question. The Decision Matrix \u2014 draw a T-chart showing the cost of going solar versus the cost of waiting. The Silence Close \u2014 ask for the sale once, clearly, then stop talking. Whoever speaks first loses. And the Last Objection \u2014 is there anything else holding you back, or are you ready to move forward?"
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_5_3_1",
            "type": "open_response",
            "label": "Reflect on Closing Techniques: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 5.3 Knowledge Check",
        "questions": [
            {
                "id": "kc_5_3_a",
                "question": "What was the main concept covered in Closing Techniques?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 5.3 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 5.4 — Contract Walk-Through & Compliance ────────────────────────────────
    "mod_5_4": {
    "id": "mod_5_4",
    "title": "Module 5.4: Contract Walk-Through & Compliance",
    "subtitle": "Walk through contract clearly and confidently Prevent buyer's remorse before it starts Meet all legal/compliance obligat",
    "sections": [
        {
            "title": "The 5-Section Contract Walk-Through",
            "type": "text",
            "content": "Never say just sign here. Walk through the contract section by section. System description \u2014 here are your exact panels, inverter, and system size. Exactly what's going on your roof. Pricing and financing \u2014 here's your total cost, your tax credit, and your monthly payment. Warranties \u2014 twenty-five year panel warranty, ten year workmanship, twelve year inverter. Cancellation policy \u2014 you have a three-day right of rescission. No penalty within seventy-two hours \u2014 just email us. Installation timeline \u2014 sixty to ninety days post-permit. Then say: this isn't the scary part. This is the starting line. From here, we do all the work."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_5_4_1",
            "type": "open_response",
            "label": "Reflect on Contract Walk-Through & Compliance: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 5.4 Knowledge Check",
        "questions": [
            {
                "id": "kc_5_4_a",
                "question": "What was the main concept covered in Contract Walk-Through & Compliance?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 5.4 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 5.5 — Cancellation Prevention & Buyer's Remorse ────────────────────────────────
    "mod_5_5": {
    "id": "mod_5_5",
    "title": "Module 5.5: Cancellation Prevention & Buyer's Remorse",
    "subtitle": "Understand why cancellations happen Prevent remorse before it sets in Lock in commitment post-close",
    "sections": [
        {
            "title": "Why Homeowners Cancel",
            "type": "text",
            "content": "Cancellations happen for five predictable reasons. A skeptical family member talked them out of it after you left. They found a competing quote and panicked. They felt rushed or pressured during the sale. They didn't fully understand what they signed. Or time passed and the urgency faded. Every one of these is preventable. Rushing the close causes the first and third. Skipping contract walk-through causes the fourth. Failing to lock in next-step excitement causes the fifth. Prevention starts during the sale, not after."
        },
        {
            "title": "Post-Close Protocol",
            "type": "text",
            "content": "At the moment of close, before you leave: congratulate them and inoculate them. Say: congrats! Here's what's going to happen next \u2014 you'll probably get a call from a competitor and a family member who questions the decision. That's completely normal. The math we looked at together doesn't change. Call me anytime with questions. Then send a text within one hour recapping next steps and expressing excitement. Schedule a check-in call at forty-eight hours. And if they do call to cancel \u2014 don't panic, don't argue. Ask what changed since you spoke, listen fully, and address the actual concern."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_5_5_1",
            "type": "open_response",
            "label": "Reflect on Cancellation Prevention & Buyer's Remorse: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 5.5 Knowledge Check",
        "questions": [
            {
                "id": "kc_5_5_a",
                "question": "What was the main concept covered in Cancellation Prevention & Buyer's Remorse?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 5.5 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 5.6 — Day 5 Wrap-Up & Homework ────────────────────────────────
    "mod_5_6": {
    "id": "mod_5_6",
    "title": "Module 5.6: Day 5 Wrap-Up & Homework",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Study and Practice Tonight",
            "type": "text",
            "content": "Tonight: study all ten objection responses until you can deliver each one fluently without notes. Then run a full appointment simulation \u2014 door knock, discovery, presentation, close \u2014 with a friend or partner playing a difficult homeowner. Finally, review the Day Six preview. Tomorrow you'll build your referral system, track your performance like a pro, and take your certification exam. By the end of Day Six, you'll be ready for the field. Come in tomorrow fully rested and focused."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_5_6_1",
            "type": "open_response",
            "label": "Reflect on Day 5 Wrap-Up & Homework: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 1.5A — Utility Bills & Net Metering ─────────────────────────────
    "mod_1_5a": {
        id: "mod_1_5a",
        title: "Module 1.5A: Utility Bills & Net Metering",
        subtitle: "Understand how homeowners are billed and how solar changes the equation.",
        sections: [
            {
                title: "The Financial Foundation",
                type: "text",
                content: "Understanding how homeowners are currently billed — and exactly how solar changes that equation — is the financial foundation of every solar pitch. If a rep cannot confidently explain how a utility bill works, they cannot credibly explain why solar is a better financial alternative."
            },
            {
                title: "Learning Objectives",
                type: "list",
                content: "By the end of this module, you will be able to:",
                items: [
                    "Fluently identify the key components of a utility bill: rate plan, tiered vs. Time-of-Use structure, delivery vs. supply charges, and total kWh usage.",
                    "Identify peak and off-peak hours visually and explain their financial impact to a homeowner.",
                    "Explain the core concept of Net Energy Metering (NEM) in plain, non-jargon language.",
                    "Differentiate between 1:1 net metering and partial/avoided-cost net metering.",
                    "Identify when a homeowner's current utility rate makes them an exceptionally good or poor candidate for solar."
                ]
            },
            {
                title: "Section 1: The Anatomy of a Utility Bill",
                type: "text",
                content: "The homeowner's utility bill is the 'before' picture. You cannot sell the 'after' if you don't understand the 'before.'\n\nKey Components to Always Locate:\n1. Total kWh Usage (monthly and annual if available)\n2. The Rate Plan (e.g., Tiered, Time-of-Use)\n3. The Total Amount Due\n4. Delivery vs. Generation/Supply charges (in deregulated markets)\n\nNever ask the homeowner to interpret their own bill. The rep should glance at the bill and quickly identify these four things. Taking a bill and looking confused destroys credibility instantly."
            },
            {
                title: "Section 2: Tiered vs. Time-of-Use (TOU) Rates",
                type: "text",
                content: "Tiered Pricing: The more you use, the more you pay per unit.\n- Baseline tier: Cheapest power (e.g., first 500 kWh)\n- Tier 2/3: More expensive power (e.g., 501+ kWh)\n- The pitch: 'Solar shaves off those expensive top tiers first. We're replacing your most expensive power with cheaper solar power.'\n\nTime-of-Use (TOU) Pricing: When you use power matters just as much as how much you use.\n- Peak hours (e.g., 4 PM–9 PM): Most expensive power.\n- Off-peak hours (e.g., 9 PM–4 PM): Cheaper power.\n- The pitch: 'The utility charges you the most when your family is home and needs power the most. Solar — especially with a battery — lets you avoid buying power during those peak hours.'"
            },
            {
                title: "Section 3: Net Energy Metering (NEM) Explained",
                type: "text",
                content: "Net metering is the financial mechanism that makes solar viable for grid-tied homes.\n\nThe simple explanation:\n'Think of the utility grid like a bank account for your power. During the day, your panels produce more power than your house uses. That extra power is sent to the grid, and the utility gives you a credit for it. At night, when your panels aren't producing, you pull power back from the grid, using those credits. Net metering is just the math of your deposits minus your withdrawals.'"
            },
            {
                title: "Section 4: The True-Up Bill",
                type: "list",
                content: "Key points about annual true-up billing:",
                items: [
                    "Annual billing cycle vs. monthly billing cycle.",
                    "The True-Up is the annual reconciliation of what was produced vs. what was consumed.",
                    "Setting expectations: A solar bill doesn't usually look like zero every month. There are usually base connection fees ($10–$20/mo) that cannot be offset."
                ]
            },
            {
                title: "Module 1.5A Slide Deck",
                type: "slides",
                content: "Slide deck for Utility Bills & Net Metering",
                slides: [
                    { title: "Utility Bills & Net Metering: The Financial Foundation", content: "Introduce the importance of understanding the 'before' picture.", image: "/images/utility_bill_breakdown.png" },
                    { title: "The Anatomy of a Utility Bill", content: "Highlight the 4 key components: Usage, Rate Plan, Total Due, Delivery vs. Supply." },
                    { title: "Tiered vs. Time-of-Use (TOU)", content: "Compare the two primary rate structures. Discuss peak vs. off-peak.", image: "/images/tou_rate_chart.png" },
                    { title: "Net Energy Metering (NEM)", content: "Explain NEM using the bank account analogy: credits and debits.", image: "/images/net_metering_flow.png" },
                    { title: "1:1 vs. Partial Credit NEM", content: "Explain regional differences in net metering policies." },
                    { title: "The True-Up Bill", content: "Explain annual reconciliation and non-bypassable base connection charges." }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_1_5a_1",
                type: "open_response",
                label: "Review the sample utility bill. Identify the Total kWh usage, the Rate Plan (Tiered or TOU), and the Total base/connection fee.",
                placeholder: "kWh usage: __ | Rate Plan: __ | Base fee: __",
                lines: 2
            },
            {
                id: "wb_1_5a_2",
                type: "open_response",
                label: "In your own words, summarize Net Energy Metering (NEM) as if explaining it to a homeowner who has never heard the term.",
                placeholder: "Think of the utility grid like...",
                lines: 4
            },
            {
                id: "wb_1_5a_3",
                type: "open_response",
                label: "A homeowner is on a heavily Tiered plan (Tier 1: 15¢, Tier 2: 28¢, Tier 3: 45¢). How do you explain the financial benefit of solar to them?",
                placeholder: "Your pitch...",
                lines: 4
            }
        ],
        quiz: {
            title: "Module 1.5A Knowledge Check",
            questions: [
                {
                    id: "kc_1_5a_1",
                    question: "If a homeowner is on a Time-of-Use (TOU) plan, when is their power generally the most expensive?",
                    options: ["Overnight", "Mid-Day", "Late Afternoon / Evening (e.g., 4 PM to 9 PM)", "Early Morning"],
                    correctAnswerIndex: 2,
                    explanation: "Peak hours on TOU plans are typically late afternoon and evening when grid demand is highest."
                },
                {
                    id: "kc_1_5a_2",
                    question: "What is a True-Up bill?",
                    options: [
                        "A monthly fee for being connected to the grid.",
                        "An annual billing cycle where the utility reconciles total solar production against total grid consumption.",
                        "A penalty fee for producing too much solar energy.",
                        "The bill received on the anniversary of the home purchase."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The True-Up is the annual reconciliation — the math of all your credits versus all your usage for the year."
                }
            ]
        }
    },

    // ─── MODULE 1.5B — Solar Financial Structures ────────────────────────────────
    "mod_1_5b": {
        id: "mod_1_5b",
        title: "Module 1.5B: Solar Financial Structures",
        subtitle: "Match the right financial vehicle to the homeowner's situation and goals.",
        sections: [
            {
                title: "Solar Is Not One-Size-Fits-All",
                type: "text",
                content: "Solar is not a one-size-fits-all financial product. This module trains reps on the primary ways a homeowner can pay for solar: Cash, Loan, and Third-Party Ownership (Lease/PPA). The goal is not to bias the rep toward one specific product, but to teach them how to match the right financial vehicle to the homeowner's specific financial situation and goals.",
                narration: "Welcome to Module 1.5B: Solar Financial Structures. Solar is not a one-size-fits-all financial product. Your goal as a consultant is not to push one specific option, but to help the homeowner find the best fit for their situation. We'll break down Cash, Loans, and Third-Party Ownership. Let's make sure you can explain these clearly."
            },
            {
                title: "Learning Objectives",
                type: "list",
                content: "By the end of this module, you will be able to:",
                items: [
                    "Explain the core mechanics of a Cash purchase, Solar Loan, Solar Lease, and Power Purchase Agreement (PPA).",
                    "Identify the ideal homeowner profile for each financial product.",
                    "Explain the Federal Solar Investment Tax Credit (ITC) accurately, without giving illegal tax advice.",
                    "Understand the difference between dealer fees and the cash price of a system.",
                    "Position the 'Swap Your Bill' concept effectively."
                ],
                narration: "By the end of this module, you will understand the mechanics of cash, loans, leases, and PPAs. You will learn to identify which homeowner profile matches each product, explain the federal tax credit accurately without giving tax advice, and position the 'bill swap' concept effectively. Let's dive in."
            },
            {
                title: "Section 1: The Swap Your Bill Concept",
                type: "text",
                content: "The fundamental premise of most solar financing:\n'Right now, you are renting your power from the utility company. It's an indefinite lease with an escalator built in, and you'll never own it. Solar allows you to swap that unpredictable utility bill for a fixed, predictable payment that actually has an end date.'\n\nIf the solar monthly payment is lower than (or equal to) their average utility bill, they are saving money from day one.",
                narration: "Let's talk about swapping the bill. Right now, homeowners rent their electricity from the utility company on an endless lease with rising rates. Solar lets them swap that unpredictable expense for a fixed, predictable payment that has an end date. If the solar payment is equal to or lower than their current average bill, they are saving money starting day one. It is a logical, powerful frame."
            },
            {
                title: "Section 2: The Federal Investment Tax Credit (ITC)",
                type: "text",
                content: "Under current federal guidance, the Residential Clean Energy Credit applied to qualifying residential solar property installed through December 31, 2025. Never promise a refund, check, or guaranteed tax savings. Eligibility depends on the law in effect, installation timing, ownership structure, and the homeowner’s individual tax situation. Always recommend that the homeowner confirm eligibility with a qualified tax professional.\n\nHow it affects loans: Many solar loans are built around an 18-month re-amortization period. If the homeowner is eligible for and applies a tax credit to the loan within 18 months, their monthly payment stays low. Otherwise, their monthly payment adjusts upward.",
                narration: "Here is the federal tax credit compliance standard. Under current federal guidance, the Residential Clean Energy Credit applied to qualifying residential solar property installed through December 31, 2025. Never promise a refund, check, or guaranteed tax savings. Eligibility depends on the law in effect, installation timing, ownership structure, and the homeowner's individual tax situation. Always recommend they confirm eligibility with a qualified tax professional. Many solar loans re-amortize at eighteen months, and if they don't apply the tax credit, the payment adjusts upward. Keep this clear and compliant."
            },
            {
                title: "Section 3: Product Matchmaking",
                type: "text",
                content: "Cash Purchase:\n- Best for: Homeowners with liquidity, looking for maximum long-term ROI. They keep the ITC.\n\nSolar Loan:\n- Best for: Homeowners who want ownership and the ITC, but want to leverage financing to achieve a Day-1 low monthly payment.\n- Keep in mind: Dealer fees mean the financed price is higher than the cash price.\n\nLease/PPA (Third-Party Ownership):\n- Best for: Homeowners on fixed incomes, retirees without tax liability, or those who just want the lowest monthly rate with zero maintenance responsibility.\n- The financing company keeps the ITC and passes the savings down via a lower monthly rate.",
                narration: "Let's review matchmaking. Cash is best for clients with savings who want the highest return on investment. Loans are great for those who want ownership and the tax credit but prefer low monthly payments over upfront costs. Leases and PPAs are perfect for clients on fixed incomes, retirees with no tax liability, or anyone who wants zero maintenance worries. Learn these profiles to recommend the right solution."
            },
            {
                title: "Module 1.5B Slide Deck",
                type: "slides",
                content: "Slide deck for Solar Financial Structures",
                slides: [
                    { title: "Solar Financial Structures: Options & Implications", content: "Introduce the concept of matching the product to the homeowner.", image: "/images/ownership_vs_lease.png" },
                    { title: "The Swap Your Bill Concept", content: "Explain replacing a forever utility bill with a fixed payment." },
                    { title: "Federal ITC Compliance", content: "Crucial compliance boundaries: Never give tax advice.", image: "/images/solar_incentives.png" },
                    { title: "Option 1: Cash Purchase", content: "Maximum ROI, maximum upfront cost." },
                    { title: "Option 2: Solar Loans & Dealer Fees", content: "Ownership without the upfront cost. Explain the 18-month re-amortization." },
                    { title: "Option 3: Third Party (Lease / PPA)", content: "Best for those who cannot utilize the ITC or want zero maintenance liability." }
                ],
                narration: "This slide deck helps you visualize these options. We walk the homeowner from the bill swap concept, through compliance boundaries, and into Cash, Loans, and Third-Party ownership. Use these slides to anchor your explanation in real facts and build client trust."
            }
        ],
        workbookPrompts: [
            {
                id: "wb_1_5b_1",
                type: "open_response",
                label: "A retired homeowner on a fixed pension mentions they do not pay income taxes anymore. Which financial product (Cash, Loan, or Lease/PPA) is likely the worst fit for them, and why?",
                placeholder: "Worst fit: __ | Because...",
                lines: 3
            },
            {
                id: "wb_1_5b_2",
                type: "open_response",
                label: "Write out the exact phrasing you would use to explain the Federal Tax Credit to a homeowner while maintaining strict compliance.",
                placeholder: "Depending on your tax situation...",
                lines: 3
            }
        ],
        quiz: {
            title: "Module 1.5B Knowledge Check",
            questions: [
                {
                    id: "kc_1_5b_1",
                    question: "Why does a 25-year solar loan often have an 18-month target date built into it?",
                    options: [
                        "That is when the equipment warranty expires.",
                        "That gives the homeowner time to receive their tax return and apply the Tax Credit (ITC) to the loan principal to keep the payment low.",
                        "The loan must be paid off entirely in 18 months.",
                        "It takes 18 months for the solar panels to turn on."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The 18-month window is designed to let the homeowner apply their ITC refund to the principal, keeping the long-term monthly payment low."
                },
                {
                    id: "kc_1_5b_2",
                    question: "Which of the following scenarios is ideal for a Third-Party Ownership (Lease or PPA) product?",
                    options: [
                        "A high-income earner looking for the absolute best ROI over 25 years.",
                        "A homeowner wanting to add battery storage and claim all tax incentives.",
                        "A homeowner who pays zero federal taxes and just wants a lower electric bill with peace of mind regarding maintenance.",
                        "A homeowner looking to increase the resale value of their home for a sale next year."
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Lease/PPA is ideal when the homeowner cannot use the ITC — retirees on fixed income are the classic example."
                }
            ]
        }
    },

    // ─── MODULE 1.7A — Basic Site Engineering Awareness ──────────────────────────
    "mod_1_7a": {
        id: "mod_1_7a",
        title: "Module 1.7A: Basic Site Engineering Awareness",
        subtitle: "See more, promise less, close better.",
        sections: [
            {
                title: "Why Site Awareness Matters",
                type: "text",
                content: "The most common source of post-close friction is a site condition discovered at survey that the rep should have seen at the sales visit. This module teaches reps 'Site Engineering Awareness' — not how to be an electrician or structural engineer, but how to observe key indicators on the roof and electrical panel to surface red flags early."
            },
            {
                title: "The Guiding Principle",
                type: "quote",
                content: "\"See more, promise less, close better.\""
            },
            {
                title: "Learning Objectives",
                type: "list",
                content: "By the end of this module, you will be able to:",
                items: [
                    "Identify the optimal roof orientations (azimuth) for solar production and explain why it matters.",
                    "Visually identify roof shading issues and understand how they impact production estimates.",
                    "Distinguish visually between a 100A and 200A main electrical panel.",
                    "Understand the Flag vs. Guess boundary: flagging potential issues for the survey team without diagnosing or quoting costs prematurely.",
                    "Create a personal pre-survey field observation checklist."
                ]
            },
            {
                title: "Section 1: Reading the Roof",
                type: "text",
                content: "Orientation (Azimuth): South-facing roofs produce the most energy. East/West are viable but produce less. North-facing roofs are typically unacceptable in the Northern Hemisphere.\n\nTilt/Pitch: Very steep roofs or completely flat roofs require special mounting hardware and may have safety implications for the install crew.\n\nCondition & Shading: Are there curling shingles? Heavy moss? Is there a mature oak tree covering the southern roof face in shadow? Shading is the #1 variable that alters the production estimate."
            },
            {
                title: "Section 2: The Electrical Panel",
                type: "text",
                content: "100A vs. 200A Service: The most critical observation. A 100-amp panel often requires a Main Panel Upgrade (MPU) to handle the backfeed of a modern solar array.\n\nWhat to look for: The number stamped on the main breaker.\n\nBreaker Space: Even a 200A panel can be a problem if every single slot is completely full — requires a subpanel or line-side tap."
            },
            {
                title: "Section 3: The Flag vs. Guess Boundary",
                type: "text",
                content: "The highest-risk mistake a rep can make is guessing how much an upgrade will cost or promising it won't be needed.\n\nCorrect Flagging Language: 'I noticed your main panel is a 100-amp service. Our site survey team will assess it completely, but just so you're aware, that sometimes means we need to upgrade the panel to accommodate the solar safely. We'll cross that bridge if the engineers say it's necessary, but I want to make sure I note it.'\n\nGuessing (WRONG): 'Oh, your panel is 100 amps. That'll be a $2,500 upgrade fee.'"
            },
            {
                title: "Module 1.7A Slide Deck",
                type: "slides",
                content: "Slide deck for Basic Site Engineering Awareness",
                slides: [
                    { title: "Basic Site Engineering Awareness", content: "See more, promise less, close better.", image: "/images/roof_assessment.png" },
                    { title: "Reading the Roof", content: "Discuss Azimuth (South = Best), Tilt, and Shading." },
                    { title: "Electrical Panel Awareness", content: "Focus on identifying 100A vs 200A service." },
                    { title: "The Flag vs. Guess Boundary", content: "Teach the exact scripting for pointing out an issue without quoting a cost or making a promise." },
                    { title: "Field Observation Checklist", content: "Review the items every rep should check before leaving the property." }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_1_7a_1",
                type: "open_response",
                label: "During a sales visit, you notice the main electrical panel's main breaker is labeled '100A.' What should you say to the homeowner? Write your actual language.",
                placeholder: "I noticed your main panel is...",
                lines: 3
            },
            {
                id: "wb_1_7a_2",
                type: "open_response",
                label: "A homeowner's south-facing roof has a large oak tree casting shadow across 40% of the plane. They haven't mentioned it. How do you handle this?",
                placeholder: "I want to be upfront with you about something I noticed...",
                lines: 4
            }
        ],
        quiz: {
            title: "Module 1.7A Knowledge Check",
            questions: [
                {
                    id: "kc_1_7a_1",
                    question: "Which roof orientation produces the most annual solar energy in the northern hemisphere?",
                    options: ["East-facing", "West-facing", "North-facing", "South-facing"],
                    correctAnswerIndex: 3,
                    explanation: "South-facing roofs receive the most direct sunlight throughout the day in the northern hemisphere."
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
                    explanation: "Flag it professionally, set the expectation, but never guess the cost. That's the survey team's job."
                }
            ]
        }
    },

    // ─── MODULE 3.7A — Technical Discovery Questions ─────────────────────────────
    "mod_3_7a": {
        id: "mod_3_7a",
        title: "Module 3.7A: Technical Discovery Questions",
        subtitle: "Surface project risks before they become pipeline surprises.",
        sections: [
            {
                title: "Why Technical Discovery Is Different",
                type: "text",
                content: "Most reps discover a homeowner's motivations. Fewer reps discover a homeowner's risks. This module upgrades the discovery process to surface technical and project-level concerns earlier in the conversation — before they become surprises in the pipeline. The goal is not to turn discovery into an interrogation or a technical audit. It is to weave smart questions into natural conversation so that reps arrive at the proposal stage with a clearer picture of what they're actually selling into."
            },
            {
                title: "Learning Objectives",
                type: "list",
                content: "By the end of this module, you will be able to:",
                items: [
                    "Ask natural, non-intrusive questions about roof age, electrical service, and site conditions that surface potential project risks before the survey.",
                    "Identify homeowner signals that indicate HOA involvement, contractor history, or permitting sensitivities — and respond appropriately.",
                    "Discover future load growth (EVs, pool equipment, additions) that may affect system sizing recommendations.",
                    "Surface outage history and backup priorities in a way that opens the battery conversation naturally.",
                    "Document technical discovery findings accurately so the survey team and operations have the context they need."
                ]
            },
            {
                title: "Section 1: The Tone That Makes It Work",
                type: "text",
                content: "Technical questions should feel like a rep taking genuine interest in the homeowner's home — not like a checklist being read from a clipboard. The rep who says 'Before I put together your proposal, I want to make sure I'm recommending the right system for your specific home — can I ask a few things about the house?' sounds like a professional."
            },
            {
                title: "Section 2: The Question Banks",
                type: "list",
                content: "Key technical discovery questions to weave naturally into conversation:",
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
                title: "Section 3: The Documentation Habit",
                type: "text",
                content: "After every discovery conversation, reps should document:\n- Roof age/condition signals\n- Electrical panel type (if known)\n- Outage history and backup priority level\n- Future load plans (EV, additions, electrification)\n- HOA involvement\n- Competitive landscape\n- Any red flags for the survey team\n\nThis documentation is what makes the survey handoff effective."
            },
            {
                title: "Module 3.7A Slide Deck",
                type: "slides",
                content: "Slide deck for Technical Discovery Questions",
                slides: [
                    { title: "Technical Discovery Questions", content: "Surface the risk before it surfaces you.", image: "/images/technical_discovery.png" },
                    { title: "The Tone That Makes It Work", content: "Curious professional vs. auditor. Focus on natural transition phrases." },
                    { title: "Roof & Electrical Questions", content: "Discuss the core questions for roof age and panel capacity." },
                    { title: "Outage History & Future Loads", content: "How to open battery conversations and size systems accurately for future needs." },
                    { title: "HOA & Site Complexity", content: "Identifying pipeline friction (HOAs) and scope creep (detached structures)." },
                    { title: "The Documentation Habit", content: "Why written notes protect deals; what specifically to capture." }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_3_7a_1",
                type: "open_response",
                label: "The discovery below collects the right info but sounds like an interrogation. Rewrite it so it sounds natural and consultative: 'What's the age of your roof? Do you have 100-amp or 200-amp service? Have you gotten other quotes? Are you in an HOA? Do you plan to get an EV?'",
                placeholder: "Before I put together your proposal, I want to make sure...",
                lines: 5
            },
            {
                id: "wb_3_7a_2",
                type: "open_response",
                label: "A homeowner says: 'Yes we're in an HOA, they've turned down two of our neighbors for solar already.' What is your follow-up response?",
                placeholder: "Good to know — a lot of states actually protect homeowners' rights to install solar...",
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
                        "That roof is too old for solar — we'll need to talk about a replacement first.",
                        "That's fine — most roofs can support solar regardless of age.",
                        "Good to know. Our site survey team does a roof assessment as part of the process — I'll make sure they take a close look so we don't run into anything unexpected.",
                        "I can't move forward with a proposal until we know the roof condition."
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Flag it professionally and let the survey team assess. Never unilaterally disqualify or guarantee without data."
                },
                {
                    id: "kc_3_7a_2",
                    question: "A homeowner says they're in an HOA that has 'been difficult before.' The best rep response is:",
                    options: [
                        "Don't worry — HOAs can't legally block solar in most states.",
                        "That may be a problem — I'll need to check with our team before we can proceed.",
                        "Good to know. Most states do protect homeowners' rights to install solar, but there's still an HOA review process our team manages. It usually adds a few weeks to the timeline, and I'll flag this for our operations team.",
                        "HOA approval isn't part of our process — that's something you'd handle separately."
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Acknowledge, inform, and take ownership. Never dismiss or scare them unnecessarily."
                }
            ]
        }
    },

    // ─── MODULE 3.7B — Site Survey Prep for Reps ─────────────────────────────────
    "mod_3_7b": {
        id: "mod_3_7b",
        title: "Module 3.7B: Site Survey Prep for Reps",
        subtitle: "The handoff that makes or breaks the pipeline.",
        sections: [
            {
                title: "Why Survey Prep Is a Rep Responsibility",
                type: "text",
                content: "The site survey is one of the most important moments in the solar project pipeline — and one of the most misunderstood by reps. Most reps think their job is done once the contract is signed and the survey is scheduled. This module reframes that entirely: the rep's preparation before the survey is what determines whether the survey runs smoothly, whether the homeowner is ready for it, and whether the project is set up to complete without unnecessary delays or cost surprises."
            },
            {
                title: "Learning Objectives",
                type: "list",
                content: "By the end of this module, you will be able to:",
                items: [
                    "Explain what the site survey is actually validating — and what that means for the rep's preparation.",
                    "Know exactly what information to gather from the homeowner before the survey is conducted.",
                    "Prepare the homeowner for the survey visit in a way that reduces anxiety, prevents no-shows, and sets accurate expectations.",
                    "Document red flags and discovery findings in a format that is actually useful to the survey team.",
                    "Understand how poor survey prep creates downstream damage — and how good prep protects deals."
                ]
            },
            {
                title: "Section 1: What the Site Survey Is Actually Validating",
                type: "list",
                content: "The survey team is confirming four things:",
                items: [
                    "Roof structural integrity and suitability.",
                    "Shading analysis (quantifying exact production loss to finalize engineering).",
                    "Electrical system compatibility (MPU check, inverter location).",
                    "Site-specific installation planning (conduit routes, access constraints)."
                ]
            },
            {
                title: "Section 2: Pre-Survey Homeowner Preparation",
                type: "text",
                content: "What to tell the homeowner before the survey:\n\nWhat it is: 'The site survey is when our technical team comes to your home to confirm all the details we'll need to finalize your system design.'\n\nWho comes: 'One of our site assessment technicians will come out.'\n\nWhat to have ready: Access to electrical panel, attic access, and secure any pets.\n\nWhat they'll find out: 'After the survey, our engineering team will finalize your design. If they find anything, I'll be your point of contact.'\n\nDO NOT say it's 'just a formality.'"
            },
            {
                title: "Section 3: Documenting Red Flags Correctly",
                type: "text",
                content: "The most common rep documentation failure is notes that are vague, incomplete, or filed in a place the survey team never sees.\n\nVague (Bad): 'Roof might be an issue.'\nSpecific (Good): 'Homeowner believes roof was installed around 1998. Original composition shingles. No known repairs but mentioned some curling near the north-facing section.'\n\nVague (Bad): 'Electrical panel could be an issue.'\nSpecific (Good): 'Homeowner confirmed main breaker is labeled 100A. Panel is in the garage, easily accessible. Rep flagged potential MPU requirement and homeowner is aware.'"
            },
            {
                title: "Module 3.7B Slide Deck",
                type: "slides",
                content: "Slide deck for Site Survey Prep for Reps",
                slides: [
                    { title: "Site Survey Prep for Reps", content: "The handoff that makes or breaks the pipeline.", image: "/images/site_survey_prep.png" },
                    { title: "What the Survey Is Validating", content: "Roof, shading, electrical, site — the four pillars." },
                    { title: "The Pre-Survey Information Package", content: "Review what ops needs before the survey tech arrives." },
                    { title: "Documenting Red Flags", content: "Vague vs. specific documentation examples." },
                    { title: "How Poor Survey Prep Damages Deals", content: "Review scenarios: The MPU Surprise, The No-Show Survey, The Redesign." },
                    { title: "The Pre-Survey SOP Checklist", content: "The complete rep workflow from close to post-survey follow-up." }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_3_7b_1",
                type: "open_response",
                label: "Rewrite this vague note into a specific, actionable one: 'Panel could be 100 amp — not sure.'",
                placeholder: "Homeowner confirmed main breaker is labeled...",
                lines: 2
            },
            {
                id: "wb_3_7b_2",
                type: "open_response",
                label: "Write the script for the call or text you would send to a homeowner to prepare them for their upcoming site survey (scheduled for next Thursday at 10 AM, tech named Marcus).",
                placeholder: "Hey [Name], this is [Your Name] from [Company]...",
                lines: 5
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
                    explanation: "The rep owns the relationship and the communication. Proactive handoff within 48 hours protects the deal."
                },
                {
                    id: "kc_3_7b_2",
                    question: "A rep tells the homeowner before the survey: 'The site survey is just a formality — it's really just someone coming to measure the roof and take a few photos.' This is:",
                    options: [
                        "Accurate — the survey is mostly visual documentation.",
                        "A compliance violation.",
                        "Problematic — it sets the homeowner up to feel misled if the survey reveals any significant findings that affect scope, cost, or design.",
                        "Fine as long as the survey doesn't actually find anything."
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Never undersell the survey. If it turns up an MPU requirement and you called it a 'formality,' trust is damaged immediately."
                }
            ]
        }
    },


    // ─── MODULE 4.1A — Time-of-Use Rates & Utility Tariff Strategy ───────────────
    "mod_4_1a": {
        id: "mod_4_1a",
        title: "Module 4.1A: Time-of-Use Rates & Utility Tariff Strategy",
        subtitle: "Understand TOU rates, explain peak hours, and integrate rate knowledge into savings story.",
        sections: [
            {
                title: "The Electricity Bill Isn't What Most People Think It Is",
                type: "text",
                content: "Most homeowners think their electricity bill is just 'how much power I used × a price.' In reality, many utilities charge differently based on when you use electricity — not just how much. This is called Time-of-Use pricing (TOU), and it changes the value of solar fundamentally. The bill is more like a hotel room rate than a flat product price. The same room costs more on a Friday night than a Tuesday."
            },
            {
                title: "Flat Rate vs. TOU Rate: Know the Difference",
                type: "text",
                content: "Flat rate: You pay the same price per kilowatt-hour (kWh) regardless of when you use it. Straightforward to explain savings. Less common in progressive utility markets.\n\nTime-of-Use (TOU): You pay a higher price during 'peak' hours (typically afternoon and evening) and a lower price during 'off-peak' hours (nights, early mornings, sometimes weekends).\n\nWhy this matters for solar: Solar panels produce the most power during the middle of the day. In flat-rate areas, that daytime production directly offsets bill usage. In TOU areas, midday solar production may earn less credit than what the homeowner uses in the evening peak window."
            },
            {
                title: "What Peak Hours Actually Mean",
                type: "text",
                content: "Peak hours are when demand on the utility grid is highest — typically 4 PM–9 PM in most markets. Electricity during peak hours costs significantly more than off-peak electricity. Solar panels produce power from roughly 8 AM–5 PM. There's a mismatch between peak production (noon) and peak cost (evening). This gap is the exact reason battery storage has become a stronger financial tool — not just an emergency backup play."
            },
            {
                title: "Net Metering and How Rate Structures Affect It",
                type: "list",
                content: "Net metering allows homeowners to send excess solar power back to the grid and receive a credit on their bill. The value of that credit depends entirely on the utility's program rules — and varies by market.",
                items: [
                    "In flat-rate markets: excess solar may get credited at close to retail rate.",
                    "In TOU markets with newer net metering programs: excess solar exported to the grid during off-peak hours may get credited at a lower rate than what the homeowner pays during evening peak.",
                    "The rep should never assume what the homeowner's net metering credit rate is. Always verify with current program language."
                ]
            },
            {
                title: "How to Use This in the Presentation",
                type: "text",
                content: "Reps do NOT need to recreate a utility rate schedule on the homeowner's kitchen table. The goal is to use rate awareness to deepen trust and explain the 'why' — not to teach a class.\n\nSimple rep language examples:\n'Your utility uses time-of-use rates, which means the electricity you use at night costs more than what solar produces during the day. That's actually part of why a battery can make a real financial difference for you.'\n'With a flat-rate utility like yours, every kilowatt-hour your panels produce offsets your bill at the same rate — which simplifies the math and keeps the payback cleaner.'"
            },
            {
                title: "Rate Structures Vary by Market",
                type: "text",
                content: "Every utility is different. Every state is different. Rate programs change. This module teaches the concept — your specific market training will cover the exact programs your homeowners are on. Key compliance note: Never quote a homeowner's specific rate per kWh unless you have verified their current bill. Utility rates change. Programs change. Always use their actual bill as the reference document."
            },
            {
                title: "Presentation Slides",
                type: "slides",
                content: "Slide deck for Time-of-Use Rates & Utility Tariff Strategy",
                slides: [
                    { title: "Understanding Time-of-Use Rates", content: "What Smart Reps Know about TOU rates and utility tariffs.", image: "/images/utility_bill_autopsy.png" },
                    { title: "The Electricity Bill Isn't Simple", content: "What most homeowners think vs. what's really happening on the grid.", image: "/images/utility_bill_autopsy.png" },
                    { title: "Flat Rate vs. Time-of-Use", content: "Two types of rate plans: paying the same flat rate everywhere vs varying by time of day.", image: "/images/tou_rate_chart.png" },
                    { title: "Solar Production vs Utility Cost Peaks", content: "Solar produces most midday, while utility costs peak in the evening when people are home.", image: "/images/production_demand_curve.png" },
                    { title: "What This Means For Your Savings", content: "Rate structures change the conversation. You must match the system to the homeowner's actual curve.", image: "/images/savings_graph.png" },
                    { title: "Net Metering Reality Check", content: "What it is, what it isn't, and why current-program language framing builds trust.", image: "/images/ethics_shield.png" },
                    { title: "The Battery Connection", content: "Why Time-Of-Use makes storage financially relevant and fundamentally changes the ROI.", image: "/images/solar_battery_setup.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_4_1a_1",
                type: "open_response",
                label: "Think of a recent bill you analyzed. Was it flat rate or TOU? How did that affect your pitch?",
                placeholder: "Rate type & impact on pitch...",
                lines: 3
            },
            {
                id: "wb_4_1a_2",
                type: "open_response",
                label: "Write completely safe language for explaining TOU to an analytical engineer.",
                placeholder: "Your response...",
                lines: 4
            }
        ],
        quiz: {
            title: "Module 4.1A Knowledge Check",
            questions: [
                {
                    id: "kc_4_1a_1",
                    question: "A homeowner is on a TOU rate plan with peak hours from 4 PM to 9 PM. Their solar panels produce the most power from 10 AM to 2 PM. What is the primary financial implication of this mismatch?",
                    options: [
                        "The homeowner won't produce enough power for their needs",
                        "The solar production occurs during lower-cost hours, meaning peak-hour usage may not be fully offset by solar credits",
                        "Solar panels don't work well in TOU markets",
                        "The homeowner's system is sized incorrectly"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Peak production is midday; peak cost is evening. When you produce cheap power and consume expensive power, offsets won't cancel dollar for dollar."
                },
                {
                    id: "kc_4_1a_2",
                    question: "When a homeowner asks you what their net metering credit rate is, the best response is:",
                    options: [
                        "It's the same as your retail rate — you get full credit",
                        "It varies by program, and I want to verify the current terms for your utility before I tell you something inaccurate",
                        "Net metering always pays you retail rate for everything you export",
                        "I'm not sure — I'll have to check"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Confidence comes from knowing you need to verify, not making a guess that becomes a liability."
                }
            ]
        }
    },

    // ─── MODULE 4.2A — Incentive Strategy & Compliance ───────────────────────────
    "mod_4_2a": {
        id: "mod_4_2a",
        title: "Module 4.2A: Incentive Strategy & Compliance",
        subtitle: "Navigate tax credits and rebates using verification-first language.",
        sections: [
            {
                title: "The Incentive Landscape Has Changed",
                type: "text",
                content: "For many years, reps relied heavily on a well-known federal residential solar tax credit to anchor their financial presentations. The federal incentive landscape has shifted. Reps should not assume the old credit structures apply to today's homeowners without verification. Key principle: Never assume. Always verify. Always use current-program language."
            },
            {
                title: "Four Types of Solar Incentives",
                type: "list",
                content: "Know the difference between the 4 major incentive categories:",
                items: [
                    "Federal incentives: Programs authorized at the national level. Verify current eligibility and terms.",
                    "State incentives: Vary dramatically by state (e.g. tax credits, sales tax exemptions).",
                    "Utility incentives: Rebates per watt installed, demand-response credits. Very time-sensitive.",
                    "Local incentives: City or county programs. Highly variable."
                ]
            },
            {
                title: "Tax Credit vs. Rebate",
                type: "text",
                content: "Tax credit: Reduces the amount of tax you owe to the government. Does not produce a refund if you don't have sufficient tax liability. Depends on individual tax situation.\n\nRebate: A direct payment or bill credit — does not depend on your tax liability. If the program offers $500, you get $500 off, period."
            },
            {
                title: "Verification-First Language",
                type: "text",
                content: "Verification-first language means the rep always acknowledges that incentive programs can change and that the homeowner should verify eligibility before making decisions based on them.\n\nExample: 'A tax credit reduces what you owe the IRS — but the amount you benefit depends on your specific tax situation, and I'd always encourage you to verify that with your tax advisor.'"
            },
            {
                title: "What Reps Can and Cannot Say",
                type: "list",
                content: "Compliance posture is non-negotiable.",
                items: [
                    "CAN SAY: 'There are state, utility, and local incentive programs that may be available to you.'",
                    "CAN SAY: 'A tax credit could reduce what you owe in taxes — your tax advisor would know how that applies.'",
                    "CANNOT SAY: 'You'll get a big check back from the government.'",
                    "CANNOT SAY: 'This basically pays for itself with the incentives.'"
                ]
            },
            {
                title: "Presentation Slides",
                type: "slides",
                content: "Slide deck for Incentive Strategy & Compliance",
                slides: [
                    { title: "Incentive Strategy & Compliance", content: "Winning with honesty in a shifting incentive landscape.", image: "/images/ethics_shield.png" },
                    { title: "Four Types of Incentives", content: "Federal, State, Utility, and Local. Know what's available in your market.", image: "/images/solar_incentives.png" },
                    { title: "Tax Credit vs. Rebate: The Distinction", content: "Tax credits reduce what you owe. Rebates come straight off the top regardless of tax liability.", image: "/images/module_7_money_roadmap.png" },
                    { title: "Verification-First Language", content: "Saying 'Let me verify the current programs' builds more trust than making an unverified guarantee.", image: "/images/ethics_shield.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_4_2a_1",
                type: "open_response",
                label: "Write a simple explanation differentiating a tax credit from a rebate.",
                placeholder: "A tax credit is...",
                lines: 3
            },
            {
                id: "wb_4_2a_2",
                type: "open_response",
                label: "Rewrite this non-compliant phrase: 'You'll get 30% back from the government when you file taxes.'",
                placeholder: "Revised safe response...",
                lines: 2
            }
        ],
        quiz: {
            title: "Module 4.2A Knowledge Check",
            questions: [
                {
                    id: "kc_4_2a_1",
                    question: "A homeowner asks, 'Will I get money back from the government for this?' What is the most accurate response?",
                    options: [
                        "Yes — you'll get 30% back when you file your taxes.",
                        "There's a federal tax credit that reduces what you owe in taxes — how much that benefits you depends on your specific tax situation, and your accountant would be the right person to confirm that.",
                        "I'm not sure — I'll have to ask my manager.",
                        "No, that program ended."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Using verification-first language puts the liability on their tax specialist and builds trust through transparency."
                },
                {
                    id: "kc_4_2a_2",
                    question: "A rep tells a homeowner, 'You'll definitely get the full federal tax credit — everyone does.' This is:",
                    options: [
                        "A strong close",
                        "A compliance violation that creates legal and reputational risk",
                        "Fine as long as the homeowner agrees",
                        "Standard industry practice"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Not everyone has tax liability. Promising a tax outcome is a compliance violation."
                }
            ]
        }
    },

    // ─── MODULE 4.2B — Cash vs. Loan vs. PPA vs. Lease Economics ─────────────────
    "mod_4_2b": {
        id: "mod_4_2b",
        title: "Module 4.2B: Cash vs. Loan vs. PPA vs. Lease Economics",
        subtitle: "Develop the financial intuition to guide homeowners toward the right fit.",
        sections: [
            {
                title: "Two Buckets: Ownership vs. Third-Party",
                type: "text",
                content: "Ownership structures: The homeowner owns the solar system. They take on the cost and receive all of the benefits (cash purchase, solar loan).\n\nThird-party structures: A company owns the solar system. The homeowner agrees to either buy the power the system produces (PPA) or rent the hardware (lease).\n\nTeaching point: Ownership = more financial upside, more responsibility. Third-party = simpler, lower barrier to entry, fewer benefits long-term."
            },
            {
                title: "Cash Purchase and Solar Loan",
                type: "text",
                content: "Cash: Highest upfront cost but best long-term financial outcome. No interest, homeowner captures all incentives. Best for homeowners with capital.\n\nSolar Loan: Finance through a third-party lender. Little/no money down, monthly payment. Homeowner owns system and is eligible for incentives. Total cost is higher due to interest and dealer fees (fee lending companies charge the solar company)."
            },
            {
                title: "Power Purchase Agreement (PPA) and Solar Lease",
                type: "text",
                content: "PPA: A third-party company installs the system at no upfront cost. Homeowner buys the power at a contracted rate (often lower than utility rate). Usually has an annual escalation clause. No incentive eligibility.\n\nLease: Similar to PPA but homeowner pays a fixed monthly amount to 'rent' the equipment instead of paying per kWh produced. Also does not qualify for tax incentives directly."
            },
            {
                title: "How to Guide Without Overwhelming",
                type: "text",
                content: "Don't present all four options at once. Guide the homeowner using simple questions:\n- 'Do you want to own it?' → Ownership path\n- 'Do you have cash available, or would you prefer payments?' → Cash vs. loan\n- 'Is ownership important, or reducing your bill the main goal?' → Opens PPA/lease dialogue\n- 'Do you plan to be in this home long term?'"
            },
            {
                title: "Presentation Slides",
                type: "slides",
                content: "Slide deck for Financing Economics",
                slides: [
                    { title: "Cash, Loan, PPA, Lease", content: "Knowing what fits the homeowner's financial goals.", image: "/images/module_7_money_roadmap.png" },
                    { title: "Two Buckets: Ownership vs. Third-Party", content: "Owning the hardware vs. buying the power/renting the hardware.", image: "/images/ownership_vs_lease.png" },
                    { title: "The Ownership Path", content: "Cash (no interest, fast payback) and Loans (building equity, applying incentives).", image: "/images/solar_house.png" },
                    { title: "The Third-Party Path", content: "PPAs and Leases provide simpler entry, immediate bill relief, but no direct incentives.", image: "/images/module_4_objection_judo.png" },
                    { title: "Guiding the Conversation", content: "Ask 'Do you want to own it?' and 'How long are you staying in this home?'", image: "/images/three_reasons_shield.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_4_2b_1",
                type: "open_response",
                label: "Analyze Profile A: Retired couple, significant savings, want to 'pay it off and forget it.'",
                placeholder: "Best fit and why...",
                lines: 3
            },
            {
                id: "wb_4_2b_2",
                type: "open_response",
                label: "How would you honestly explain 'dealer fees' inside a solar loan?",
                placeholder: "Your response...",
                lines: 4
            }
        ],
        quiz: {
            title: "Module 4.2B Knowledge Check",
            questions: [
                {
                    id: "kc_4_2b_1",
                    question: "Which of the following is a key difference between a PPA and a solar lease?",
                    options: [
                        "In a PPA, the homeowner owns the system; in a lease, they do not",
                        "In a PPA, the homeowner pays per kilowatt-hour produced; in a lease, they pay a flat monthly amount for the equipment",
                        "A lease always has a lower rate than a PPA",
                        "There is no meaningful difference"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "PPA is buying power, Lease is renting hardware."
                },
                {
                    id: "kc_4_2b_2",
                    question: "A dealer fee in solar financing refers to:",
                    options: [
                        "A fee the homeowner pays the dealer when buying the system",
                        "A fee the lending company charges the solar company to offer their loan product — which is often built into the system price",
                        "A government surcharge on financed solar systems",
                        "A fee charged to the rep by their employer"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Dealer fees are the cost of borrowing built into the total financed cost. It's not a scam, just the economics of lending."
                }
            ]
        }
    },

    // ─── MODULE 4.4A — NEM 3.0 & Battery Sales Logic ─────────────────────────────
    "mod_4_4a": {
        id: "mod_4_4a",
        title: "Module 4.4A: NEM 3.0 & Battery Sales Logic",
        subtitle: "Understand the NEM 3.0 shift and build the battery conversation correctly.",
        sections: [
            {
                title: "Why NEM 3.0 Changes the Conversation",
                type: "text",
                content: "Net metering has evolved significantly in major solar markets. In California and other progressive states, the shift from NEM 2.0 to NEM 3.0 dramatically reduced the credit homeowners receive for exporting excess solar power to the grid. This changes the financial equation: under NEM 3.0, a solar-only system without battery storage may underperform older projections. The rep who understands this builds credibility. The rep who ignores it gets burned when the homeowner does their own research."
            },
            {
                title: "NEM 2.0 vs. NEM 3.0: The Core Difference",
                type: "list",
                content: "Understanding the shift is essential for accurate savings conversations:",
                items: [
                    "NEM 2.0: Homeowners received near-retail rate credits for all excess power exported to the grid. Simple math, strong savings story.",
                    "NEM 3.0 (where applicable): Export credits are based on 'avoided cost' — the utility's cost to generate power, not the retail rate homeowners pay. Export credits drop by as much as 75% compared to NEM 2.0.",
                    "The implication: Under NEM 3.0, it is financially smarter to store excess power in a battery and use it at night than to export it at a low credit rate.",
                    "Battery + solar under NEM 3.0 can outperform solar-only under NEM 2.0 in total bill reduction."
                ]
            },
            {
                title: "The Battery Conversation: How to Open It",
                type: "text",
                content: "Do not lead with 'backup power.' Lead with economics.\n\n'With the way net metering works in your area, the power your panels produce at noon is worth the most to you when you're actually using it at home — not when you're sending it back to the grid for a fraction of the credit. A battery lets you store that midday production and use it when your utility charges you the most: evenings. That's where the real savings are stacked.'"
            },
            {
                title: "Battery Objections and Responses",
                type: "list",
                content: "Common objections and how to address them:",
                items: [
                    "'It's too expensive': 'The battery pays for itself faster under current net metering than it used to — and it's often the difference between a good system and a great financial decision.'",
                    "'I don't need backup power': 'That's actually a separate benefit. The primary reason most of my clients add storage now is financial — to capture their own power instead of giving it back at a discount.'",
                    "'Will prices come down?': 'Incentives for storage are strong right now and program rules are tightening. Waiting typically means less favorable terms, not better ones.'"
                ]
            },
            {
                title: "Compliance Note",
                type: "text",
                content: "NEM programs vary significantly by utility and state. Do not present NEM 3.0 specifics to homeowners in markets still on NEM 2.0 or legacy programs. Always verify the current net metering program for the homeowner's specific utility before building savings projections. Use current program language, not assumptions from a previous market or training."
            },
            {
                title: "Module 4.4A Slide Deck",
                type: "slides",
                content: "Slide deck for NEM 3.0 & Battery Sales Logic",
                slides: [
                    { title: "NEM 3.0 & Battery Sales Logic", content: "The net metering shift that changed the solar financial story.", image: "/images/net_metering_flow.png" },
                    { title: "NEM 2.0 vs. NEM 3.0", content: "From near-retail credits to avoided cost. The math changed. Your pitch must too.", image: "/images/net_metering_flow.png" },
                    { title: "Why Battery Storage Is Now a Financial Tool", content: "Store it, use it at peak. Don't export it at a discount.", image: "/images/solar_battery_setup.png" },
                    { title: "Opening the Battery Conversation", content: "Lead with economics, not backup. The savings story is stronger.", image: "/images/savings_graph.png" },
                    { title: "Handling Battery Objections", content: "Too expensive? Timing? Backup power? Address each with the financial frame.", image: "/images/module_4_objection_judo.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_4_4a_1",
                type: "open_response",
                label: "Explain the difference between NEM 2.0 and NEM 3.0 in plain language a homeowner would understand.",
                placeholder: "Under the older net metering program...",
                lines: 4
            },
            {
                id: "wb_4_4a_2",
                type: "open_response",
                label: "Write your battery conversation opener — leading with economics, not backup power.",
                placeholder: "With the way net metering works in your area...",
                lines: 4
            }
        ],
        quiz: {
            title: "Module 4.4A Knowledge Check",
            questions: [
                {
                    id: "kc_4_4a_1",
                    question: "Under NEM 3.0, what is the primary financial argument for adding battery storage to a solar system?",
                    options: [
                        "Batteries provide backup power during outages",
                        "Storing excess solar production and using it during peak-cost evening hours is more financially beneficial than exporting it to the grid at reduced credit rates",
                        "Batteries extend the life of the solar panels",
                        "Batteries are required by law under NEM 3.0"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Under NEM 3.0, export credits drop significantly. Using stored power at home during peak hours delivers more financial value than exporting."
                },
                {
                    id: "kc_4_4a_2",
                    question: "A homeowner in a NEM 3.0 market says 'I don't need backup power, so I don't need a battery.' The best response is:",
                    options: [
                        "You're right — backup power is the only reason to add a battery.",
                        "Backup is actually the secondary benefit. The primary reason most clients add storage is financial — to capture their own solar at full value instead of exporting it at a reduced credit rate.",
                        "Let me check if your utility requires a battery.",
                        "Batteries are optional and you'll save plenty without one."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Reframe battery from backup device to financial optimization tool. That's the NEM 3.0 conversation."
                }
            ]
        }
    },


    // ─── MODULE 5.5A — The Post-Sale Project Lifecycle ───────────────────────────
    "mod_5_5a": {
        id: "mod_5_5a",
        title: "Module 5.5A: The Post-Sale Project Lifecycle",
        subtitle: "Navigate the journey from contract signature to Permission to Operate.",
        sections: [
            {
                title: "The Project Lifecycle: A Rep's Map",
                type: "text",
                content: "Every solar project goes through the same general sequence of stages from contract to live system. The exact timing varies by market, utility, and jurisdiction — but the stages themselves are consistent.\n\nThere are 7 key stages: Contract Signed, Site Survey, System Design, Permitting, Installation, Inspection, and Permission to Operate (PTO).",
                narration: "Welcome to Module 5.5A: The Post-Sale Project Lifecycle. Every solar project follows the same basic journey from contract signing to the system turning live. While timelines vary by market, utility, and local rules, the stages themselves are consistent. Let's look at the seven key stages: contract, site survey, engineering design, permitting, installation, inspection, and permission to operate."
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
                    "Stage 5 - Installation: The crew installs panels, inverters, and wiring (1–2 days).",
                    "Stage 6 - Inspection: Local inspector verifies system against approved permit (1–3 weeks post-install).",
                    "Stage 7 - PTO: Utility company authorizes the homeowner to turn on the system. This is the true finish line."
                ],
                narration: "Let's break down the seven stages. First, signing the contract. Second, the site survey, where a tech checks the roof and electric panel. Third, system design by engineering. Fourth, permitting with the local jurisdiction. Fifth, installation, which usually takes just one to two days. Sixth, local inspection. And seventh, PTO, or Permission to Operate, which is when the utility company lets you turn the panels on. PTO is the true finish line."
            },
            {
                title: "Total Timeline Expectations",
                type: "text",
                content: "From contract signing to PTO, timeline is typically 3 to 6 months in most markets. Some markets are faster, some are significantly slower. Never promise a specific timeline you cannot guarantee. Use ranges and use localized data.",
                narration: "From signing to turning the system on takes about three to six months in most areas. Some places are faster, others are much slower. Never promise a specific date. Always explain timeline ranges based on local data so your client knows what to expect."
            },
            {
                title: "Where Trust Is Most Commonly Lost",
                type: "list",
                content: "Reps who proactively manage post-sale expectations preserve their deals. Trust is commonly lost in 3 moments:",
                items: [
                    "Moment 1 — The Silence After Signing: Anxiety builds if they hear nothing for weeks. Check in within 48 hours.",
                    "Moment 2 — The Permit Surprise: No one warned them permits can take 6–10 weeks. Set this expectation explicitly at signing.",
                    "Moment 3 — The PTO Confusion: The system is on the roof, but they can't turn it on. Explain PTO clearly before and after installation."
                ],
                narration: "Trust is easily broken if you don't manage expectations. The three high-risk moments are: the silence right after signing, the unexpected delay in permitting, and the wait for PTO after the panels are already on the roof. Proactively check in during these times to keep the homeowner informed and prevent cancellations."
            },
            {
                title: "The Rep's Role After the Close",
                type: "list",
                content: "Understanding boundaries is essential. Reps who try to do too much create confusion; those who do too little lose deals.",
                items: [
                    "Rep Owns: Homeowner relationship, expectation management, early problem escalation, referral relationship cultivation.",
                    "Operations Owns: Scheduling, design decisions, permit submission, installation scheduling, and inspection."
                ],
                narration: "Keep your boundaries clear. As the rep, you own the relationship, expectation setting, and referral gathering. Operations handles the scheduling, designs, permits, installs, and inspections. Don't confuse the homeowner by trying to do operations' job, but never ignore their questions either."
            },
            {
                title: "The 7-Touchpoint Model",
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
                ],
                narration: "Use the seven-touchpoint model as a strategy to build referrals. Call your client at signing, when the survey is scheduled, after the survey, when permits are submitted, when installation is scheduled, right after install, and finally when PTO is granted. Keeping them updated at every step turns happy customers into referral engines."
            },
            {
                title: "Module 5.5A Slide Deck",
                type: "slides",
                content: "",
                slides: [
                    { title: "The Post-Sale Project Lifecycle", content: "Your Map from Contract to Live. The #1 cause of solar cancellations is not buyer's remorse — it's broken trust.", image: "/images/solar_project_pipeline.png" },
                    { title: "The Seven Stages", content: "Contract → Survey → Design → Permit → Install → Inspection → PTO.\nPTO is the finish line, not installation.", image: "/images/solar_project_pipeline.png" },
                    { title: "Where Trust Is Most Commonly Lost", content: "1. The Silence After Signing\n2. The Permit Surprise\n3. The PTO Confusion", image: "/images/trust_breaking_moments.png" },
                    { title: "The 7-Touchpoint Model", content: "Proactively check in at all 7 milestones: Signing, Survey, Design, Permit, Install, Inspection, PTO.", image: "/images/trust_breaking_moments.png" }
                ],
                narration: "Use this slide deck to set expectations with your clients. Show them the map from contract to PTO, point out where delays can happen, and walk them through your communication touchpoints. Showing them you have a plan builds immediate confidence."
            }
        ],
        workbookPrompts: [
            {
                id: "wb_5_5a_1",
                type: "checklist",
                label: "Order the Project Lifecycle Stages:",
                items: [
                    "1. Contract Signed",
                    "2. Site Survey",
                    "3. System Design",
                    "4. Permitting",
                    "5. Installation",
                    "6. Inspection",
                    "7. Permission to Operate (PTO)"
                ]
            },
            {
                id: "wb_5_5a_2",
                type: "open_response",
                label: "Write your at-the-table timeline setting script (under 2 minutes):",
                placeholder: "Before you sign, I want to walk you through exactly what happens next...",
                lines: 4
            }
        ],
        quiz: {
            title: "Module 5.5A Knowledge Check",
            questions: [
                {
                    id: "kc_5_5a_1",
                    question: "What does PTO stand for, and when does it occur in the project lifecycle?",
                    options: [
                        "Power Transfer Operation — it occurs at installation",
                        "Permission to Operate — it occurs after inspection, when the utility authorizes turning on the system",
                        "Project Timeline Optimization — it occurs during permitting",
                        "Panel Transfer Order — it occurs when equipment ships"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "PTO stands for Permission to Operate, meaning the utility company has formally granted you the right to connect to the grid."
                },
                {
                    id: "kc_5_5a_2",
                    question: "A rep closes a deal on a Tuesday. The best next action is:",
                    options: [
                        "Wait for the homeowner to contact them with questions",
                        "Contact the homeowner within 48 hours to confirm the site survey is scheduled and review what comes next",
                        "Send a generic thank you email and move on",
                        "Call the homeowner only if there's a problem"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Avoiding the 'Silence After Signing' protects your deal and reassures the homeowner."
                }
            ]
        }
    },

    // ─── MODULE 5.5B — Common Installation Pipeline Issues ───────────────────────
    "mod_5_5b": {
        id: "mod_5_5b",
        title: "Module 5.5B: Common Installation Pipeline Issues",
        subtitle: "Issues are normal. Silence is not.",
        sections: [
            {
                title: "The Mindset: Issues Are Normal",
                type: "text",
                content: "Most pipeline issues are normal and happen on a significant percentage of deals. The issue itself rarely kills a deal — poor communication around the issue does. An informed homeowner is dramatically less likely to cancel than a surprised one."
            },
            {
                title: "Issues by Stage",
                type: "list",
                content: "Awareness of potential issues at each stage helps you communicate effectively:",
                items: [
                    "Survey (Roof Condition): Roof has structural issues or lacks lifespan. (Repair/replace needed).",
                    "Survey (Shade): Shade analysis reduces production potential. Set honest expectations.",
                    "Design (Main Panel Upgrade - MPU): Electrical service panel cannot safely support solar. Significant surprise cost ($1,500–$5k).",
                    "Permitting: Rejections require resubmission. HOAs may enforce separate aesthetic reviews.",
                    "Financing: Lender stipulations like income verification must be cleared for funds.",
                    "Installation & Inspection: Supply chain delays on panels/batteries. Inspection failures add weeks.",
                    "PTO: Utility delays interconnect approval."
                ]
            },
            {
                title: "Competitor Re-Entry",
                type: "quote",
                content: "\"While a homeowner's project is delayed, a competitor approaches them with promises of faster timelines or lower prices. Deal cancellation is high. Prevent this through consistent rep communication. A homeowner who trusts their rep is not a prospect for a competitor.\""
            },
            {
                title: "Escalation vs. Normal Issues",
                type: "list",
                content: "Develop a sense for what requires internal escalation versus what just needs communication.",
                items: [
                    "Normal: Permit corrections, HOA review, PTO wait, minor design adjustments.",
                    "Escalation-Level: MPU discovered with no prior disclosure, failed inspection with no resolution path, explicit cancellation threats, competitor involvement."
                ]
            },
            {
                title: "Module 5.5B Slide Deck",
                type: "slides",
                content: "",
                slides: [
                    { title: "Common Installation Pipeline Issues", content: "Issues are normal. Silence is not.\nKnow how to frame bad news correctly.", image: "/images/solar_pipeline_issues.png" },
                    { title: "The Main Panel Upgrade (MPU)", content: "Upgrading a 100-amp panel to safely support solar.\nCost: $1,500–$5,000.\nFrame it as protecting the home, not a hidden fee.", image: "/images/solar_pipeline_issues.png" },
                    { title: "Competitor Re-Entry During Delays", content: "Competitors prey on delayed projects.\nPrevention: Build unshakeable trust.\nResponse: Don't panic. Compare the reset.", image: "/images/competitor_reentry.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_5_5b_1",
                type: "open_response",
                label: "Rewrite this bad news delivery: \"Your electrical panel is only 100-amp. You need a panel upgrade. It'll cost extra.\"",
                placeholder: "Our team identified something that actually protects your home...",
                lines: 3
            },
            {
                id: "wb_5_5b_2",
                type: "open_response",
                label: "A competitor offered $4,000 less and a 30-day timeline during your 3-month permit wait. Write your response:",
                placeholder: "Don't disparage. Help them think clearly about starting over...",
                lines: 4
            }
        ],
        quiz: {
            title: "Module 5.5B Knowledge Check",
            questions: [
                {
                    id: "kc_5_5b_1",
                    question: "A homeowner's site survey reveals their electrical panel is 100-amp service. Why does this matter?",
                    options: [
                        "It has no impact.",
                        "It may need to be upgraded to 200-amp to safely support the solar system, adding cost and time.",
                        "100-amp panels always need to be replaced, and the homeowner knew this.",
                        "This only matters if the homeowner is adding a battery."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "An MPU (Main Panel Upgrade) is a common pipeline surprise cost that reps must learn to frame properly."
                },
                {
                    id: "kc_5_5b_2",
                    question: "A competitor approaches a homeowner whose project has been delayed for 8 weeks. The most effective rep response is to:",
                    options: [
                        "Tell the homeowner the competitor is lying.",
                        "Tell the homeowner to ignore them.",
                        "Help the homeowner understand what starting over actually means without disparaging the competitor.",
                        "Offer to reduce the price to match."
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Help them understand the timeline reset without being petty."
                }
            ]
        }
    },

    // ─── MODULE 5.5C — Troubleshooting & Escalation Paths ────────────────────────
    "mod_5_5c": {
        id: "mod_5_5c",
        title: "Module 5.5C: Troubleshooting & Escalation Paths",
        subtitle: "Structured approach to internal escalations when deals run into trouble.",
        sections: [
            {
                title: "Issue Identification: What Kind of Problem Is This?",
                type: "text",
                content: "Before escalating, correctly categorize what's happening.\n\nCategory A: Design/Technical (Engineering owns it).\nCategory B: Permit/Jurisdiction (Permitting team owns it).\nCategory C: Financing (Finance team owns it).\nCategory D: Install/Inspection (Operations owns it).\nCategory E: Customer Relationship/Cancellation Risk (Rep/Manager owns it)."
            },
            {
                title: "The Pre-Escalation Checklist",
                type: "list",
                content: "Before escalating, gather this info so you are taken seriously:",
                items: [
                    "Homeowner name and deal/project ID",
                    "Current project stage",
                    "Specific factual issue description",
                    "What the homeowner knows so far",
                    "Homeowner's emotional state / cancellation risk",
                    "What resolution the rep believes is needed",
                    "Deadline constraint"
                ]
            },
            {
                title: "What to NOT Say",
                type: "list",
                content: "Reps who blame operations to homeowners create permanent trust damage.",
                items: [
                    "NOT: 'Operations is dropping the ball.' (Assigns blame internally)",
                    "NOT: 'I'm not sure what's going on.' (Creates doubt)",
                    "NOT: 'I'll see what I can do.' (Vague)",
                    "SAY: 'I'm working on getting you a specific answer by [time].'",
                    "SAY: 'I understand this isn't what you expected. I'm taking ownership of this right now.'"
                ]
            },
            {
                title: "The Four-Part Escalation Message",
                type: "text",
                content: "When escalating to a manager, give them a clear package:\n\n1. Who: Homeowner name, deal ID, stage\n2. What: Specific issue — factual\n3. State: Cancellation risk level\n4. Ask: Specific action required, by when"
            },
            {
                title: "Module 5.5C Slide Deck",
                type: "slides",
                content: "",
                slides: [
                    { title: "Troubleshooting & Escalation Paths", content: "Moving Fast When Deals Are at Risk", image: "/images/troubleshooting_escalation.png" },
                    { title: "The Pre-Escalation Checklist", content: "- Name / ID\n- Current Phase\n- The Factual Issue\n- Emotional State\n- What is the specific Ask?", image: "/images/troubleshooting_escalation.png" },
                    { title: "The Four-Part Escalation Message", content: "1. Who\n2. What\n3. State\n4. Ask", image: "/images/troubleshooting_escalation.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_5_5c_1",
                type: "open_response",
                label: "Rewrite this: \"Operations is really behind right now. It's not my fault.\"",
                placeholder: "I want to make sure I get you the right information — let me loop in the right person...",
                lines: 3
            },
            {
                id: "wb_5_5c_2",
                type: "open_response",
                label: "Write a four-part escalation message for Maria Santos (Week 9 permit wait, frustrated):",
                placeholder: "I need to flag a cancellation risk — Maria Santos, Deal 4022. They're at week 9...",
                lines: 4
            }
        ],
        quiz: {
            title: "Module 5.5C Knowledge Check",
            questions: [
                {
                    id: "kc_5_5c_1",
                    question: "A homeowner's loan has been flagged for additional income verification. Which team do you contact?",
                    options: [
                        "Engineering",
                        "Permitting",
                        "Finance / contract administration",
                        "Installation"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "This is a Category C financial issue owned by the finance department."
                },
                {
                    id: "kc_5_5c_2",
                    question: "A homeowner is frustrated and the rep says: 'I'm not sure what's going on — I'm trying to find out.' This statement:",
                    options: [
                        "Is honest and appropriate",
                        "Creates doubt without providing comfort",
                        "Builds trust",
                        "Is fine if the homeowner is calm"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "It creates doubt. Replace with a specific action and a callback timeframe."
                }
            ]
        }
    },

    // ─── MODULE 5.5D — Save-the-Deal Communication ───────────────────────────────
    "mod_5_5d": {
        id: "mod_5_5d",
        title: "Module 5.5D: Save-the-Deal Communication",
        subtitle: "Face the homeowner when friction strikes and bring the deal back.",
        sections: [
            {
                title: "Own the Communication, Not the Problem",
                type: "text",
                content: "The rep does not own the operational problem (permits, utility queues, roof conditions). The rep DOES own the communication around the problem. When reps conflate these, they make promises they can't keep, or they avoid the homeowner entirely out of guilt."
            },
            {
                title: "Communicating Delays Clearly",
                type: "list",
                content: "The five-step proactive delay call framework:",
                items: [
                    "Step 1: Lead with acknowledgment, not defense.",
                    "Step 2: State what happened factually.",
                    "Step 3: Validate the impact.",
                    "Step 4: Provide the next concrete step.",
                    "Step 5: Reaffirm the relationship."
                ]
            },
            {
                title: "Handling Homeowner Ghosting",
                type: "text",
                content: "Ghosting is almost always emotional, not logistical. The 3-strike check-in system:\n\nAttempt 1: Warm, no-pressure check-in call.\nAttempt 2: Value-add project update 5 days later.\nAttempt 3: Honest, direct outreach 5 days later to address concerns directly."
            },
            {
                title: "Spouse or Family Pushback Post-Close",
                type: "text",
                content: "When a family member creates doubt: Do not get defensive. Do not attempt a full re-close re-presentation. Find out the specific concern, offer a focused direct conversation to answer questions, address it honestly, and give them space while keeping the door open."
            },
            {
                title: "Protecting Trust Without Blaming Operations",
                type: "list",
                content: "Blaming operations destroys confidence in the whole company.",
                items: [
                    "Bad: 'I'm trying to figure out why they haven't done this.'",
                    "Good: 'We're working on this and I'm taking personal ownership of getting the answer.'"
                ]
            },
            {
                title: "Module 5.5D Slide Deck",
                type: "slides",
                content: "",
                slides: [
                    { title: "Save-the-Deal Communication", content: "Protecting revenue when projects hit friction.\nOwn the communication, not the problem.", image: "/images/ghosting_homeowner.png" },
                    { title: "Handling Homeowner Ghosting", content: "Ghosting is emotional, not logistical.\nUse the 3-attempt framework: Warm, Value-Add, Direct.", image: "/images/ghosting_homeowner.png" },
                    { title: "Spouse & Family Pushback", content: "Don't re-close.\nOffer a focused conversation to address specific concerns.\nDo not get defensive if they consulted an 'expert.'", image: "/images/trust_breaking_moments.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_5_5d_1",
                type: "open_response",
                label: "Write the first step of a proactive delay call (acknowledgment):",
                placeholder: "I'm calling because I have an update on your project...",
                lines: 2
            },
            {
                id: "wb_5_5d_2",
                type: "open_response",
                label: "Write the 3rd attempt (honest/direct) outreach for a ghosted lead:",
                placeholder: "I want to make sure I'm serving you well...",
                lines: 3
            }
        ],
        quiz: {
            title: "Module 5.5D Knowledge Check",
            questions: [
                {
                    id: "kc_5_5d_1",
                    question: "A homeowner hasn't responded to two calls and a text in 10 days. Best next action?",
                    options: [
                        "Call every day",
                        "Send a warm, low-pressure 3rd outreach acknowledging the disconnect",
                        "Mark as lost",
                        "Escalate immediately to the manager"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The third outreach is the final, direct but compassionate attempt."
                },
                {
                    id: "kc_5_5d_2",
                    question: "A homeowner's spouse is resistant after signing. The best approach is:",
                    options: [
                        "Re-present the full pitch",
                        "Reduce the price",
                        "Ask to understand the specific concern and offer a focused low-pressure conversation",
                        "Tell the signed homeowner to handle it"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Never 're-close'. It's overwhelming. Just address their exact lingering doubts objectively."
                }
            ]
        }
    },


    // ─── MODULE 6.1A — Referral System Architecture ──────────────────────────────
    "mod_6_1a": {
        id: "mod_6_1a",
        title: "Module 6.1A: Referral System Architecture",
        subtitle: "Build a systematic referral engine — not a one-time ask.",
        sections: [
            {
                title: "Why Most Referral Attempts Fail",
                type: "text",
                content: "Most reps treat referrals as a reaction — they ask when they remember, or when the homeowner seems happy. A referral system treats referrals as a proactive, repeatable process built into every stage of the client relationship. The difference between a rep who gets 1 referral per 10 deals and a rep who gets 3–5 is not personality. It's structure."
            },
            {
                title: "The Three Referral Trigger Moments",
                type: "list",
                content: "There are three moments in the client lifecycle where referral requests convert at the highest rate:",
                items: [
                    "Trigger 1 — At the Close: The homeowner is most excited and committed immediately after signing. Ask: 'Who in your neighborhood do you think would also benefit from this?' Keep it casual and unthreatening.",
                    "Trigger 2 — Post-Install: Panels are on the roof. Neighbors can see them. Homeowner pride is at its peak. Call to celebrate — and ask who's been asking about the panels.",
                    "Trigger 3 — First Bill: The homeowner sees their first reduced bill or credits. Emotion is real. This is the best time for a specific, name-based referral request."
                ]
            },
            {
                title: "The Referral Architecture: From Request to Close",
                type: "text",
                content: "A referral system has four components:\n\n1. The Ask (at each trigger moment) — specific, warm, and non-pressured\n2. The Capture (who exactly did they mention?) — get a name and ideally a phone number\n3. The Warm Intro (text/email to the referral with homeowner copying) — social proof built in\n4. The Follow-Through (CRM log, outreach within 24 hours) — speed is conversion"
            },
            {
                title: "Referral Ask Scripts",
                type: "list",
                content: "Copy-paste ready referral language for each trigger moment:",
                items: [
                    "At Close: 'Before I head out — is there anyone in your neighborhood or circle you think would appreciate knowing about this? I only work with people who are genuinely good fits, so I'd love a warm intro.'",
                    "Post-Install: 'Your system looks great out there! I've had a few reps ask me about neighborhoods like yours — has anyone asked you about the panels yet? I'd love to connect with them.'",
                    "First Bill: 'That's a real result — congratulations. You know what's funny? The people who benefit most from solar are usually the people around you who have similar bills. Is there anyone specific you'd want to pass my number to?'"
                ]
            },
            {
                title: "Building Referral Habits Into the CRM",
                type: "text",
                content: "Every client record should have:\n- Referral ask logged (date, trigger moment, response)\n- Names captured (even if not converted)\n- Warm intro status\n- Follow-up date set\n\nReps who log referral activity close 40–60% more referral deals than those who don't — not because they ask more, but because they follow through."
            },
            {
                title: "Module 6.1A Slide Deck",
                type: "slides",
                content: "Slide deck for Referral System Architecture",
                slides: [
                    { title: "Referral System Architecture", content: "From reactive ask to systematic pipeline.", image: "/images/referral_engine.png" },
                    { title: "The Three Trigger Moments", content: "1. At the Close\n2. Post-Install\n3. First Bill\nEach has a different emotional hook.", image: "/images/referral_engine.png" },
                    { title: "The Referral Architecture", content: "Ask → Capture → Warm Intro → Follow-Through.\nThe system beats the ask.", image: "/images/referral_engine.png" },
                    { title: "Referral Ask Scripts", content: "Specific, warm, non-pressured language for each trigger.", image: "/images/referral_engine.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_6_1a_1",
                type: "open_response",
                label: "Write your post-install referral ask script in your own voice:",
                placeholder: "Your panels look great out there...",
                lines: 3
            },
            {
                id: "wb_6_1a_2",
                type: "open_response",
                label: "Describe how you will log referral activity in your CRM after every appointment:",
                placeholder: "After every signed deal, I will...",
                lines: 3
            }
        ],
        quiz: {
            title: "Module 6.1A Knowledge Check",
            questions: [
                {
                    id: "kc_6_1a_1",
                    question: "Which of the three referral trigger moments typically converts at the highest rate?",
                    options: [
                        "At the close — homeowner is committed and excited",
                        "Post-install — panels are visible and neighbors ask questions",
                        "First bill — homeowner sees real financial results and emotion is highest",
                        "All three convert equally"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "The first bill moment produces the strongest emotional response tied to real financial proof — the highest-converting referral trigger."
                },
                {
                    id: "kc_6_1a_2",
                    question: "What is the most important step reps skip that kills referral conversion?",
                    options: [
                        "Asking for the referral",
                        "Following through with outreach within 24 hours of getting a name",
                        "Sending a thank you card",
                        "Asking for a Google review at the same time"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Speed is conversion. A name given and not followed up within 24 hours loses more than 50% of its conversion potential."
                }
            ]
        }
    },

    // ─── MODULE 6.2A — Review Generation & Social Proof Systems ──────────────────
    "mod_6_2a": {
        id: "mod_6_2a",
        title: "Module 6.2A: Review Generation & Social Proof Systems",
        subtitle: "Turn happy clients into a visible, searchable reputation that generates leads.",
        sections: [
            {
                title: "Why Reviews Are Revenue",
                type: "text",
                content: "A rep with 50 five-star Google reviews generates inbound interest without additional prospecting. A rep with zero reviews loses deals to competitors with 200. Reviews are not a marketing team problem — they are a rep's responsibility. Every satisfied homeowner who doesn't leave a review is a missed lead generation opportunity."
            },
            {
                title: "When to Ask for a Review",
                type: "list",
                content: "Timing determines the quality and likelihood of a review:",
                items: [
                    "Best time: Within 48 hours of PTO — the homeowner is officially live, the emotional peak is real, and the experience is fresh.",
                    "Good time: Post-install, when panels are visible and the homeowner is proud.",
                    "Avoid: During pipeline issues, delays, or any moment of friction. A forced review during a bad experience creates a bad review."
                ]
            },
            {
                title: "The Review Ask Script",
                type: "text",
                content: "'Hey [Name], your system is officially live — that's a big day! I have a small favor to ask. Reviews are really how families like yours find out if solar is worth it. If you had a good experience, it would mean a lot to me if you'd share it on Google. I'll send you a direct link — it takes about 2 minutes. Would that be okay?'\n\nAlways send the link. Never make them search for it. Friction kills completion."
            },
            {
                title: "Platforms to Prioritize",
                type: "list",
                content: "Not all review platforms are equal in solar:",
                items: [
                    "Google Business Profile: Highest priority. Drives local search visibility and shows in Maps results.",
                    "EnergySage: Industry-specific solar comparison site. High-intent prospects research here.",
                    "Yelp: Secondary. Relevant in some markets.",
                    "Facebook: Useful for local community groups where solar decisions are discussed."
                ]
            },
            {
                title: "Social Proof Beyond Reviews",
                type: "list",
                content: "Reviews are one form of social proof. Build a full social proof stack:",
                items: [
                    "Before/after bill photos (with homeowner permission) — real numbers convert skeptics.",
                    "Video testimonials — 30 seconds at PTO asking 'what was the experience like?' is gold.",
                    "Neighborhood installs map — showing homeowners that their neighbors have already gone solar accelerates decisions.",
                    "Photo of install day — a crew on a roof is powerful visual proof."
                ]
            },
            {
                title: "Module 6.2A Slide Deck",
                type: "slides",
                content: "Slide deck for Review Generation & Social Proof Systems",
                slides: [
                    { title: "Review Generation & Social Proof Systems", content: "Every happy homeowner who doesn't leave a review is a missed lead.", image: "/images/social_proof.png" },
                    { title: "When to Ask", content: "PTO is the peak moment. Timing is everything.", image: "/images/social_proof.png" },
                    { title: "The Review Ask Script", content: "Ask → Send the link → Follow up once.", image: "/images/social_proof.png" },
                    { title: "Building the Full Social Proof Stack", content: "Reviews + Bills + Video Testimonials + Neighborhood Map", image: "/images/social_proof.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_6_2a_1",
                type: "open_response",
                label: "Write your review ask script in your own voice — at the PTO milestone:",
                placeholder: "Hey [Name], your system is officially live...",
                lines: 3
            },
            {
                id: "wb_6_2a_2",
                type: "open_response",
                label: "List 3 forms of social proof you will actively collect beyond Google reviews:",
                placeholder: "1. Before/after bill photos... 2... 3...",
                lines: 3
            }
        ],
        quiz: {
            title: "Module 6.2A Knowledge Check",
            questions: [
                {
                    id: "kc_6_2a_1",
                    question: "What is the single highest-priority review platform for a solar rep to focus on?",
                    options: [
                        "Yelp",
                        "Facebook",
                        "Google Business Profile",
                        "EnergySage"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Google Business Profile drives local search visibility and Maps results — the highest-traffic discovery point for local solar prospects."
                },
                {
                    id: "kc_6_2a_2",
                    question: "What is the biggest mistake reps make when asking for reviews?",
                    options: [
                        "Asking too early",
                        "Not sending a direct link — making the homeowner search for it themselves",
                        "Asking too often",
                        "Asking at PTO instead of at the close"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Friction kills completion. A direct link removes every barrier between intent and action."
                }
            ]
        }
    },

    // ─── MODULE 6.3A — Orphan Owner Reactivation Playbook ────────────────────────
    "mod_6_3a": {
        id: "mod_6_3a",
        title: "Module 6.3A: Orphan Owner Reactivation Playbook",
        subtitle: "Convert existing solar customers abandoned by previous reps into referrals, upgrades, and loyalty.",
        sections: [
            {
                title: "What Is an Orphan Owner?",
                type: "text",
                content: "An orphan owner is a homeowner who purchased solar through your company but whose original rep is no longer with the organization. They have a live solar system but no active rep relationship. They receive bills, monitoring alerts, and questions — with no assigned point of contact. This is both a service failure and a revenue opportunity."
            },
            {
                title: "Why Orphan Owners Matter",
                type: "list",
                content: "Orphan owners represent one of the highest-ROI activities for an experienced rep:",
                items: [
                    "They already trust the company enough to have purchased.",
                    "They are likely to refer neighbors if their experience has been positive.",
                    "They are upgrade candidates (battery, EV charger, system expansion).",
                    "They are cancellation risks if they feel ignored — especially during issues.",
                    "Reactivating 5 orphan owners can generate 10–15 referral conversations."
                ]
            },
            {
                title: "The Reactivation Call Framework",
                type: "text",
                content: "Step 1 — Introduce yourself: 'Hi [Name], this is [Your Name] from [Company]. I've been assigned as your new point of contact — I just wanted to reach out and introduce myself.'\n\nStep 2 — Acknowledge the gap: 'I know you may not have heard from us in a while, and I want to make sure that changes. You're a customer, and you deserve consistent support.'\n\nStep 3 — Check on the system: 'How has your system been performing? Have you had any questions or concerns I can help with?'\n\nStep 4 — Open the door: 'I'd also love to keep you in the loop on anything new that might benefit you — like battery options or any programs you might qualify for.'"
            },
            {
                title: "Identifying Upgrade Opportunities",
                type: "list",
                content: "During the reactivation call, listen for these upgrade signals:",
                items: [
                    "Electric vehicle purchase or interest — battery + EV charger conversation",
                    "High bills despite solar — system underperformance or new loads",
                    "Power outage concerns — battery backup opportunity",
                    "Home addition or pool planned — additional load requiring system expansion",
                    "'My neighbor is interested' — immediate referral pipeline signal"
                ]
            },
            {
                title: "Module 6.3A Slide Deck",
                type: "slides",
                content: "Slide deck for Orphan Owner Reactivation Playbook",
                slides: [
                    { title: "Orphan Owner Reactivation Playbook", content: "Existing customers are your highest-ROI prospect pool.", image: "/images/orphan_owner.png" },
                    { title: "Why Orphan Owners Matter", content: "Trust already exists. The relationship just needs a rep.", image: "/images/orphan_owner.png" },
                    { title: "The Reactivation Call Framework", content: "Introduce → Acknowledge → Check-In → Open the Door", image: "/images/orphan_owner.png" },
                    { title: "Upgrade Signals to Listen For", content: "EVs, High Bills, Outages, Additions, Neighbor Interest", image: "/images/orphan_owner.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_6_3a_1",
                type: "open_response",
                label: "Write your orphan owner reactivation opening script — introduce yourself and acknowledge the gap:",
                placeholder: "Hi [Name], this is [Your Name] from [Company]...",
                lines: 4
            },
            {
                id: "wb_6_3a_2",
                type: "open_response",
                label: "List 3 upgrade signals you will specifically listen for during a reactivation call:",
                placeholder: "1. EV interest... 2... 3...",
                lines: 3
            }
        ],
        quiz: {
            title: "Module 6.3A Knowledge Check",
            questions: [
                {
                    id: "kc_6_3a_1",
                    question: "What is the primary reason orphan owners are a high-ROI opportunity?",
                    options: [
                        "They are easy to upsell without relationship building",
                        "They already trust the company enough to have purchased — the relationship just needs a rep",
                        "They always want battery storage",
                        "They are unlikely to cancel so they don't need attention"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The trust threshold is already crossed. You're not selling solar — you're reactivating a relationship."
                },
                {
                    id: "kc_6_3a_2",
                    question: "During a reactivation call, a homeowner mentions they just bought an electric vehicle. This is:",
                    options: [
                        "Irrelevant to the solar conversation",
                        "A battery and EV charger upgrade signal — open that conversation",
                        "A reason the homeowner may want to cancel solar",
                        "Something to note but not pursue on this call"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "An EV purchase means increased energy load, grid dependence, and strong battery/EV charger upgrade opportunity."
                }
            ]
        }
    },

    // ─── MODULE 6.4A — KPI Mastery & Self-Coaching System ────────────────────────
    "mod_6_4a": {
        id: "mod_6_4a",
        title: "Module 6.4A: KPI Mastery & Self-Coaching System",
        subtitle: "Track the numbers that drive income and diagnose your own performance bottlenecks.",
        sections: [
            {
                title: "Why Self-Coaching Is the Highest-Leverage Skill",
                type: "text",
                content: "The reps who build long-term careers in solar are not always the most talented — they are the most self-aware. They know their close rate, their set rate, their show rate, and they know exactly where their deals are dying. A rep who can identify their own bottleneck is a rep who can fix it without waiting for a manager to tell them."
            },
            {
                title: "The Six Core Solar KPIs",
                type: "list",
                content: "Every rep should track these six metrics weekly:",
                items: [
                    "Doors Knocked (or Leads Contacted): Total activity volume. The base of the funnel.",
                    "Appointments Set (Set Rate): Doors knocked ÷ appointments set. Industry benchmark: 1 set per 20–30 doors.",
                    "Appointments Shown (Show Rate): Appointments set ÷ appointments that actually occurred. Target: 70%+.",
                    "Proposals Presented (Pitch Rate): Appointments shown ÷ full proposals delivered.",
                    "Deals Closed (Close Rate): Proposals presented ÷ contracts signed. Industry range: 20–40%.",
                    "Average Contract Value (ACV): Total revenue ÷ deals closed. Tracks deal quality, not just volume."
                ]
            },
            {
                title: "Diagnosing Your Bottleneck",
                type: "text",
                content: "Look at your funnel from the top down:\n\n- Low set rate → Problem is at the door. Scripts, positioning, neighborhood targeting.\n- Low show rate → Problem is pre-appointment communication. Confirmation process, rapport, value framing.\n- Low pitch rate → Problem is in-home positioning. Discovery, trust, environment control.\n- Low close rate → Problem is presentation, objection handling, or financing confidence.\n- Low ACV → Problem is qualification or product matching.\n\nFix the biggest leak first. Don't spray everywhere."
            },
            {
                title: "The Weekly Self-Review Process",
                type: "list",
                content: "A 15-minute weekly review that top performers run every Sunday or Monday morning:",
                items: [
                    "Step 1: Pull last week's numbers — doors, sets, shows, pitches, closes.",
                    "Step 2: Calculate each conversion rate.",
                    "Step 3: Compare to your personal baseline and industry benchmark.",
                    "Step 4: Identify the one metric furthest from benchmark.",
                    "Step 5: Set one specific behavioral goal for the coming week to improve that metric.",
                    "Step 6: Share with your manager or accountability partner."
                ]
            },
            {
                title: "Module 6.4A Slide Deck",
                type: "slides",
                content: "Slide deck for KPI Mastery & Self-Coaching System",
                slides: [
                    { title: "KPI Mastery & Self-Coaching System", content: "Track the numbers. Own the outcomes.", image: "/images/kpi_dashboard.png" },
                    { title: "The Six Core Solar KPIs", content: "Doors → Sets → Shows → Pitches → Closes → ACV", image: "/images/kpi_dashboard.png" },
                    { title: "Diagnosing Your Bottleneck", content: "Low set rate = door problem.\nLow show rate = confirmation problem.\nLow close rate = pitch/objection problem.", image: "/images/kpi_dashboard.png" },
                    { title: "The Weekly Self-Review Process", content: "15 minutes. Pull numbers. Find the leak. Set one behavioral goal.", image: "/images/kpi_dashboard.png" }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_6_4a_1",
                type: "open_response",
                label: "Using last week's numbers, calculate your set rate, show rate, and close rate. Where is your biggest gap?",
                placeholder: "Set rate: __ | Show rate: __ | Close rate: __ | Biggest gap: ...",
                lines: 3
            },
            {
                id: "wb_6_4a_2",
                type: "open_response",
                label: "Write one specific behavioral goal for this week based on your bottleneck diagnosis:",
                placeholder: "This week I will specifically...",
                lines: 2
            }
        ],
        quiz: {
            title: "Module 6.4A Knowledge Check",
            questions: [
                {
                    id: "kc_6_4a_1",
                    question: "A rep's close rate is 35% but their show rate is only 45%. Where should they focus first?",
                    options: [
                        "Improving their close rate — it's below 40%",
                        "Improving their show rate — appointments not happening means closes are impossible regardless of skill",
                        "Knocking more doors to compensate",
                        "Increasing their average contract value"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Fix the biggest leak first. A 45% show rate means more than half of set appointments never happen — no close rate fixes that."
                },
                {
                    id: "kc_6_4a_2",
                    question: "What does a consistently low 'set rate' (appointments set per door knocked) most likely indicate?",
                    options: [
                        "The rep is closing too aggressively",
                        "The rep's in-home presentation needs work",
                        "The rep has a problem at the door — opener, positioning, or targeting",
                        "The rep is working the wrong neighborhoods"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Set rate is the door-to-appointment conversion. Low set rate = door script, opener, or trust-building problem at first contact."
                }
            ]
        }
    },

    // ─── DAY 6 MODULES ───────────────────────────────────────────────────────

    "mod_6_1": {
        id: "mod_6_1",
        title: "Module 6.1: The Referral Engine — Building Passive Pipeline",
        subtitle: "Turn every closed deal into three more through a disciplined referral system.",
        sections: [
            {
                title: "Why Referrals Are Your Most Profitable Channel",
                type: "text",
                content: "A referred lead closes at 3–5× the rate of a cold prospect, costs nothing to acquire, and arrives pre-sold on your credibility. Top earners in solar build referral systems from Day One — not as an afterthought, but as a strategic priority."
            },
            {
                title: "The 3 Referral Trigger Moments",
                type: "list",
                content: "There are three moments when a customer is most emotionally primed to refer you — missing any one of them is leaving money on the table.",
                items: [
                    "Trigger 1 — Post-Signature Euphoria: Immediately after signing, ask while excitement is highest.",
                    "Trigger 2 — System Install Complete: Customer sees panels on their roof — pride and visibility are at peak.",
                    "Trigger 3 — First Bill After Go-Live: Customer sees their first near-zero utility bill — the proof is undeniable."
                ]
            },
            {
                title: "The Referral Ask Script",
                type: "quote",
                content: "\"Most of my business comes from people just like you — homeowners who are glad they made the switch. Who's one person in your neighborhood or family who'd benefit from a conversation like we just had? I'm not asking you to sell them — just an introduction.\""
            },
            {
                title: "Building a Referral Tracking System",
                type: "list",
                content: "A referral not tracked is a referral lost. Your system must be simple enough to use in the field.",
                items: [
                    "Log every referral name and contact in CRM within 24 hours",
                    "Tag the source customer so you can report back ('Your neighbor John said yes!')",
                    "Set a 3-day follow-up task for every referral received",
                    "Send a handwritten thank-you to any customer whose referral closes"
                ]
            },
            {
                title: "Simulation: Referral Ask at Trigger 1",
                type: "simulation",
                content: "Practice the post-signature referral conversation with post_install_patricia.",
                scenarioId: "post_install_patricia"
            }
        ],
        workbookPrompts: [
            { id: "wb_6_1_1", type: "open_response", label: "Write your personal referral ask script for Trigger Moment 1 (post-signature). Make it sound natural in your voice.", placeholder: "Start with: 'Most of my business...'", lines: 4 },
            { id: "wb_6_1_2", type: "checklist", label: "Referral system setup checklist", items: ["CRM referral field created", "3 trigger reminders set in calendar", "Thank-you card supply ready", "Referral script practiced 5× out loud"] }
        ]
    },

    "mod_6_2": {
        id: "mod_6_2",
        title: "Module 6.2: Review & Social Proof Strategy",
        subtitle: "Systematically generate 5-star reviews that become your 24/7 sales force.",
        sections: [
            {
                title: "Why Online Reviews Close Deals Before You Arrive",
                type: "text",
                content: "88% of consumers trust online reviews as much as personal recommendations. A prospect who Googles you before your appointment and sees 40+ five-star reviews walks in pre-sold. Reviews reduce objections, accelerate decisions, and differentiate you from every other rep in your market."
            },
            {
                title: "The Review Request Timing",
                type: "list",
                content: "Timing determines whether a customer leaves a review. Ask at the wrong moment and you get nothing.",
                items: [
                    "Best time: Within 48 hours of system installation — enthusiasm is highest",
                    "Second best: Day of first low utility bill — proof triggers gratitude",
                    "Method: Text with a direct link — never just verbal. Remove friction.",
                    "Follow-up once if no review after 5 days — 'Just making sure the link worked'"
                ]
            },
            {
                title: "The Review Request Message",
                type: "quote",
                content: "\"Hey [Name], it was a pleasure working with you. If you have 2 minutes, your review would mean the world to me — it helps families in [City] find a trustworthy rep. Here's the direct link: [Google Review Link]. Thanks for trusting me with your home.\""
            }
        ],
        workbookPrompts: [
            { id: "wb_6_2_1", type: "open_response", label: "Write your personalized review request text message (max 3 sentences).", placeholder: "Hey [Name]...", lines: 3 }
        ]
    },

    "mod_6_3": {
        id: "mod_6_3",
        title: "Module 6.3: Orphan Owner Strategy",
        subtitle: "Reactivate past customers whose reps left — a goldmine hiding in your company's CRM.",
        sections: [
            {
                title: "What Is an Orphan Owner?",
                type: "text",
                content: "An orphan owner is a customer whose original sales rep has left the company. They have an existing relationship with your organization but no dedicated point of contact. These are warm leads — they already said yes to solar once. Your job is to become their trusted advisor."
            },
            {
                title: "The Orphan Owner Outreach Script",
                type: "quote",
                content: "\"Hi, is this [Name]? My name is [Your Name] — I'm with [Company] and I've been assigned as your new account manager. I wanted to introduce myself, confirm everything is running smoothly with your system, and let you know I'm your point of contact going forward. Do you have 2 minutes?\""
            },
            {
                title: "Converting Orphan Owners to Referral Sources",
                type: "list",
                content: "Once you've re-established trust, an orphan owner becomes one of your best referral assets.",
                items: [
                    "Schedule a free system performance review — build face time",
                    "Identify any service needs and resolve them — prove your value",
                    "Ask for referrals after resolving any issue — gratitude converts",
                    "Add them to your review request sequence if they haven't left one"
                ]
            }
        ],
        workbookPrompts: [
            { id: "wb_6_3_1", type: "open_response", label: "Pull 5 orphan owner names from CRM. Write their names and one personalized note for your first outreach call.", placeholder: "1. [Name] — Note: ...", lines: 6 }
        ]
    },

    "mod_6_4": {
        id: "mod_6_4",
        title: "Module 6.4: Performance Dashboard & KPI Discipline",
        subtitle: "Track what matters, diagnose bottlenecks, and self-coach like a top performer.",
        sections: [
            {
                title: "The 5 KPIs Every Solar Rep Must Track Daily",
                type: "list",
                content: "You cannot improve what you don't measure. These five numbers tell you exactly where your income is being lost.",
                items: [
                    "Doors Knocked — your raw activity input",
                    "Set Rate (Appointments Set / Doors Knocked) — door effectiveness",
                    "Show Rate (Appointments Shown / Set) — follow-up and commitment quality",
                    "Close Rate (Deals Closed / Appointments Shown) — presentation effectiveness",
                    "Average Contract Value — deal quality and upsell skill"
                ]
            },
            {
                title: "Diagnosing Your Bottleneck",
                type: "comparison",
                content: "Find the ratio that breaks first — that's where you focus 80% of your coaching energy.",
                comparison: {
                    rookie: "Tracks nothing. Guesses at what's wrong. Blames market conditions.",
                    pro: "Reviews KPIs every morning. Identifies the broken ratio. Adjusts that specific behavior that day."
                }
            },
            {
                title: "Your Daily KPI Review Ritual",
                type: "text",
                content: "Every morning before you leave for the field, spend 5 minutes with your numbers. Ask: 'What was my set rate yesterday? Is it trending up or down? What's one thing I'll do differently at the door today?' This 5-minute habit compounds over a 90-day career into elite performance."
            }
        ],
        workbookPrompts: [
            { id: "wb_6_4_1", type: "checklist", label: "KPI tracker setup", items: ["Doors knocked column", "Set rate column", "Show rate column", "Close rate column", "ACV column", "Weekly trend row"] },
            { id: "wb_6_4_2", type: "open_response", label: "Based on your last week of activity, which KPI is your biggest bottleneck? What's one specific change you'll make this week?", placeholder: "My bottleneck is... I'll fix it by...", lines: 4 }
        ]
    },

    "mod_6_5": {
        id: "mod_6_5",
        title: "Module 6.5: Project Lifecycle Management",
        subtitle: "Manage the post-sale process so customers trust you through every phase.",
        sections: [
            {
                title: "The 7 Phases of the Solar Install Lifecycle",
                type: "list",
                content: "Setting expectations before each phase eliminates 80% of cancellations. Customers cancel when they're surprised — they stay when they know what's coming.",
                items: [
                    "Phase 1 — Contract & Welcome: 24-hour confirmation call. Confirm documents, set expectations.",
                    "Phase 2 — Site Survey: Notify 48 hours before. 'An engineer will visit to measure your roof.'",
                    "Phase 3 — Permitting: 'This takes 3–8 weeks depending on your city. Normal and expected.'",
                    "Phase 4 — Install Scheduled: Excitement call. 'Your install date is confirmed!'",
                    "Phase 5 — Installation Day: Check-in morning of. Be reachable.",
                    "Phase 6 — Inspection & Interconnection: 'Almost there — utility company approves the connection.'",
                    "Phase 7 — PTO & Go-Live: Celebration call. 'Your system is live. Check your monitoring app!'"
                ]
            },
            {
                title: "Simulation: Managing a Project Delay",
                type: "simulation",
                content: "Handle a frustrated customer whose install has been delayed 3 weeks.",
                scenarioId: "rodriguez_family"
            }
        ],
        workbookPrompts: [
            { id: "wb_6_5_1", type: "open_response", label: "Write a 2-sentence proactive update message you'd send a customer at Phase 3 (permitting) to prevent them from calling in anxious.", placeholder: "Hey [Name], quick update on your project...", lines: 3 }
        ]
    },

    "mod_6_6": {
        id: "mod_6_6",
        title: "Module 6.6: Professional Reputation & Long-Term Ethics",
        subtitle: "Build a career that lasts by treating every customer as a long-term relationship.",
        sections: [
            {
                title: "The Reputation Equation",
                type: "text",
                content: "In solar sales, your reputation is your most valuable business asset. One dishonest close generates a complaint, a cancellation, a bad review, and lost referral trees that would have generated $50,000+ in future commission. Ethical selling isn't just the right thing — it's the profitable thing."
            },
            {
                title: "The Integrity Standards of a Certified SeptiVolt Rep",
                type: "list",
                content: "These aren't guidelines — they're the non-negotiables of the profession.",
                items: [
                    "Never misrepresent savings projections — use conservative, honest estimates",
                    "Disclose all contract terms clearly — cancellation windows, escalators, and conditions",
                    "Never pressure a decision — if they need 48 hours, respect it",
                    "If a deal isn't right for the homeowner, walk away — referrals follow integrity",
                    "Report any ethical concerns about team members to your manager immediately"
                ]
            },
            {
                title: "The Long-Term Perspective",
                type: "quote",
                content: "\"The rep who manipulates a customer into a bad deal closes one sale and loses a territory. The rep who earns trust closes one sale and gains twenty referrals. Your long-term income is built on reputation, not tricks.\""
            }
        ],
        workbookPrompts: [
            { id: "wb_6_6_1", type: "open_response", label: "Describe a situation where walking away from a sale would be the right ethical call. How would you handle it?", placeholder: "I would walk away if...", lines: 4 }
        ]
    },

    "mod_6_7": {
        id: "mod_6_7",
        title: "Module 6.7: Career Path & Income Scaling",
        subtitle: "Map your trajectory from rep to team leader and beyond.",
        sections: [
            {
                title: "The Solar Career Ladder",
                type: "list",
                content: "Solar is one of the few industries where a rep can move from entry-level to six figures within 12 months — and to leadership within 24.",
                items: [
                    "Level 1 — Certified Rep (Month 1–3): Building fundamentals, $3K–$8K/mo",
                    "Level 2 — Senior Rep (Month 4–12): Consistent 4+ deals/mo, $10K–$18K/mo",
                    "Level 3 — Lead Rep / Trainer (Month 12–18): Mentoring new reps, override income",
                    "Level 4 — Team Lead / Manager (Year 2+): Team of 5–15, override + personal production",
                    "Level 5 — Regional Director: Multi-team leadership, equity and equity-style comp"
                ]
            },
            {
                title: "Writing Your Income Goals",
                type: "text",
                content: "Goal-setting without specifics is just wishful thinking. Your 1-year, 3-year, and 5-year income goals must be connected to specific activity levels — otherwise they're not goals, they're fantasies."
            }
        ],
        workbookPrompts: [
            { id: "wb_6_7_1", type: "open_response", label: "Write your 1-year, 3-year, and 5-year income goals. For each, state the role you'll need to be in and one key skill you must develop to get there.", placeholder: "Year 1: $... | Role: ... | Skill: ...", lines: 6 }
        ]
    },

    "mod_6_8": {
        id: "mod_6_8",
        title: "Module 6.8: Day 6 Final Certification Exam",
        subtitle: "Demonstrate mastery across all six days of the accelerator.",
        sections: [
            {
                title: "Certification Exam — Written Component",
                type: "text",
                content: "This exam covers all material from Days 1 through 6. You must score 80% or higher to receive the SeptiVolt Sales Rep Certification. You have one retake opportunity if you score below 80% on your first attempt."
            }
        ],
        quiz: {
            title: "Day 6 Certification Exam",
            questions: [
                { id: "cert_6_1", question: "What are the three referral trigger moments?", options: ["Door knock, appointment set, contract signed", "Post-signature, install complete, first low bill", "Day 1, Day 3, Day 7", "CRM entry, survey, installation"], correctAnswerIndex: 1, explanation: "The three trigger moments are post-signature euphoria, system install complete, and first low utility bill." },
                { id: "cert_6_2", question: "Which KPI diagnoses a problem specifically at the door?", options: ["Close Rate", "Average Contract Value", "Set Rate", "Show Rate"], correctAnswerIndex: 2, explanation: "Set rate (appointments set per door knocked) measures door effectiveness directly." },
                { id: "cert_6_3", question: "What is an 'orphan owner'?", options: ["A prospect who has never heard of solar", "A customer who cancelled their contract", "A customer whose original rep left the company", "A homeowner with no utility bill history"], correctAnswerIndex: 2, explanation: "Orphan owners are existing customers with no active rep — they're warm and reachable." },
                { id: "cert_6_4", question: "When should you first ask for a review?", options: ["During the sales presentation", "Within 48 hours of system installation", "After the first utility bill arrives", "At the 6-month check-in"], correctAnswerIndex: 1, explanation: "Within 48 hours of install — enthusiasm is at peak and the experience is fresh." },
                { id: "cert_6_5", question: "Which of these is an integrity violation?", options: ["Disclosing all contract terms clearly", "Using conservative savings estimates", "Pressuring a customer to sign before 48 hours they requested", "Walking away from a bad-fit deal"], correctAnswerIndex: 2, explanation: "Pressuring a customer who requested time to decide violates professional ethics standards." }
            ]
        }
    },

    // ─── DAY 7 MODULES ───────────────────────────────────────────────────────

    "mod_7_1": {
        id: "mod_7_1",
        title: "Module 7.1: Pre-Field Briefing",
        subtitle: "Mental and tactical preparation for your field certification day.",
        sections: [
            {
                title: "Today Is Different",
                type: "text",
                content: "Today you stop practicing and start doing. Day 7 is your field certification — you will shadow three live appointments with your manager, then run one appointment yourself with your manager observing. At the end of the day, you'll receive your certification decision. Show up prepared."
            },
            {
                title: "Your Pre-Field Checklist",
                type: "list",
                content: "Before you leave for the field, confirm every item on this list.",
                items: [
                    "Discovery script reviewed and internalized — no cue cards",
                    "Top 10 objections practiced verbally this morning",
                    "Presentation flow memorized — all 6 phases",
                    "Referral ask scripted and ready",
                    "Professional appearance — business casual, clean, prepared",
                    "Phone charged, CRM access confirmed, manager contact saved"
                ]
            },
            {
                title: "The Mindset for Field Day",
                type: "quote",
                content: "\"You are not going to observe today — you are going to study. Watch every move your manager makes and ask yourself: why did they do that? What was the customer's reaction? What would I have done differently? Learning never stops, even after you're certified.\""
            }
        ],
        workbookPrompts: [
            { id: "wb_7_1_1", type: "checklist", label: "Pre-field readiness check", items: ["Scripts reviewed", "Objections drilled", "Appearance ready", "Phone charged", "CRM confirmed", "Mindset locked in"] }
        ]
    },

    "mod_7_2": {
        id: "mod_7_2",
        title: "Module 7.2: Shadow Appointment #1",
        subtitle: "Observe a live appointment and extract specific, actionable lessons.",
        sections: [
            {
                title: "How to Shadow Effectively",
                type: "text",
                content: "Passive observation is wasted time. Active shadowing means taking notes, tracking the customer's emotional state, and identifying exactly when and why the momentum shifted. You should leave every shadow appointment with at least 3 specific takeaways."
            },
            {
                title: "Shadow Observation Framework",
                type: "list",
                content: "Use this framework for every appointment you shadow today.",
                items: [
                    "Opening: How did they establish authority and likability in the first 2 minutes?",
                    "Discovery: Which questions created the biggest emotional response?",
                    "Presentation: Where did the customer lean in vs. check out?",
                    "Objections: Which technique did they use and did it land?",
                    "Close: What specifically triggered the decision?"
                ]
            }
        ],
        workbookPrompts: [
            { id: "wb_7_2_1", type: "open_response", label: "Shadow Appointment #1 — 3 specific takeaways:", placeholder: "1. They did __ when __ and the customer responded by __...", lines: 5 }
        ]
    },

    "mod_7_3": {
        id: "mod_7_3",
        title: "Module 7.3: Shadow Appointment #2",
        subtitle: "Deepen your observation skills and identify repeatable patterns.",
        sections: [
            {
                title: "Pattern Recognition",
                type: "text",
                content: "By the second appointment, you should start seeing patterns — techniques your manager uses consistently, moments where every customer reacts similarly, and places in the flow where objections cluster. Patterns are your playbook."
            }
        ],
        workbookPrompts: [
            { id: "wb_7_3_1", type: "open_response", label: "Shadow Appointment #2 — What pattern did you notice across both appointments so far?", placeholder: "Both times, the customer responded to...", lines: 4 }
        ]
    },

    "mod_7_4": {
        id: "mod_7_4",
        title: "Module 7.4: Shadow Appointment #3",
        subtitle: "Final observation before you run your own appointment.",
        sections: [
            {
                title: "Pre-Game Preparation",
                type: "text",
                content: "After this appointment, you run one yourself. Use this shadow to watch with the mindset of a player about to take the field. What would you do the same? What would you do differently? Trust your training."
            }
        ],
        workbookPrompts: [
            { id: "wb_7_4_1", type: "open_response", label: "Shadow Appointment #3 — What is one thing you'll do differently in your own appointment today?", placeholder: "In my appointment, I will...", lines: 3 }
        ]
    },

    "mod_7_5": {
        id: "mod_7_5",
        title: "Module 7.5: Pre-Appointment Prep — In the Car",
        subtitle: "The 10-minute ritual that separates prepared reps from reactive ones.",
        sections: [
            {
                title: "The In-Car Prep Ritual",
                type: "list",
                content: "Do this before every appointment — not just today.",
                items: [
                    "Review the customer's utility bill data and usage history",
                    "Identify 2 likely objections based on what you know about them",
                    "Rehearse your opening 60 seconds out loud — in the car, alone",
                    "Set your intention: 'I am here to help this family make a great decision'",
                    "Deep breath — walk in calm, confident, and present"
                ]
            }
        ],
        workbookPrompts: [
            { id: "wb_7_5_1", type: "open_response", label: "Write your appointment intention statement for today's live appointment.", placeholder: "Today I will...", lines: 2 }
        ]
    },

    "mod_7_6": {
        id: "mod_7_6",
        title: "Module 7.6: My Appointment — Field Notes",
        subtitle: "Your live certification appointment — run the full process from discovery to close.",
        sections: [
            {
                title: "Run the Full Process",
                type: "text",
                content: "This is your appointment. Your manager is observing, not intervening. Run the full process: environmental control, discovery, presentation, objection handling, and close. If you get stuck, pause and think — don't look to your manager for help. This is your moment."
            },
            {
                title: "Post-Appointment Self-Assessment",
                type: "text",
                content: "Immediately after the appointment, before your manager gives feedback, do your own honest assessment. What went well? Where did you hesitate? What would you change? Self-awareness is the foundation of improvement."
            }
        ],
        workbookPrompts: [
            { id: "wb_7_6_1", type: "open_response", label: "Post-appointment self-assessment: What went well?", placeholder: "I executed well on...", lines: 3 },
            { id: "wb_7_6_2", type: "open_response", label: "Post-appointment self-assessment: What would you change?", placeholder: "Next time I'll...", lines: 3 }
        ]
    },

    "mod_7_7": {
        id: "mod_7_7",
        title: "Module 7.7: Debrief & Certification Decision",
        subtitle: "Receive your manager's feedback and certification outcome.",
        sections: [
            {
                title: "The Debrief Process",
                type: "text",
                content: "Your manager will walk through your appointment step by step, providing specific feedback on each phase. Listen actively — this is the most valuable coaching you'll receive as a new rep. Take notes. Ask clarifying questions. Do not get defensive."
            },
            {
                title: "Certification Outcomes",
                type: "list",
                content: "There are three possible outcomes from today's field certification.",
                items: [
                    "Certified — You demonstrated readiness across all five assessment criteria. You are cleared for independent field work.",
                    "Provisional Certification — Strong in most areas, one gap identified. Cleared for field with manager check-ins for 2 weeks.",
                    "Extension Recommended — Specific gap requires additional training. A focused 2-day extension plan will be provided."
                ]
            },
            {
                title: "Regardless of Outcome",
                type: "quote",
                content: "\"Every rep who goes through this program — regardless of certification outcome on Day 7 — is more prepared than 90% of the reps currently working in the field. Your training doesn't end today. It begins.\""
            }
        ],
        workbookPrompts: [
            { id: "wb_7_7_1", type: "open_response", label: "Manager feedback — 3 specific coaching points received:", placeholder: "1. ...", lines: 5 },
            { id: "wb_7_7_2", type: "rating", label: "How prepared do you feel to run independent appointments?", maxRating: 10 }
        ]
    },

    "mod_7_8": {
        id: "mod_7_8",
        title: "Module 7.8: Field Activation",
        subtitle: "You are now a certified solar sales professional. Here is your launch plan.",
        sections: [
            {
                title: "Your First 30 Days as a Certified Rep",
                type: "list",
                content: "The first 30 days post-certification are critical. Reps who build strong habits now compound their income for years. Reps who don't often plateau or quit within 90 days.",
                items: [
                    "Week 1: 40 doors/day minimum — activity volume builds confidence",
                    "Week 2: 3 appointments set and run — measure all 5 KPIs daily",
                    "Week 3: 1 deal closed — first commission hits differently",
                    "Week 4: Referral system activated — ask at every close",
                    "30-day review with manager: KPI analysis and coaching plan for Month 2"
                ]
            },
            {
                title: "You Are Ready",
                type: "quote",
                content: "\"Seven days ago, you didn't know how to read a utility bill. Today, you can run a full appointment, handle any objection, close ethically, and build a referral pipeline. That is not a small thing. Go build your career.\""
            }
        ],
        workbookPrompts: [
            { id: "wb_7_8_1", type: "open_response", label: "Write your personal commitment statement for your first 30 days as a certified rep.", placeholder: "In my first 30 days I will...", lines: 4 }
        ]
    },

    "mod_7_9": {
        id: "mod_7_9",
        title: "Module 7.9: Solo Prospecting — First 20 Doors",
        subtitle: "Your first independent prospecting session as a certified SeptiVolt rep.",
        sections: [
            {
                title: "The Significance of Door #1",
                type: "text",
                content: "The first door you knock alone — no trainer watching, no safety net — is the most important door of your career. Not because of the outcome, but because of what it proves to yourself: that you can do this independently. Knock it with confidence."
            },
            {
                title: "20-Door Tracker",
                type: "list",
                content: "Track each interaction. Data from your first solo session becomes your baseline for measuring improvement.",
                items: [
                    "Doors knocked: __/20",
                    "Contacts made (someone answered): __",
                    "Appointments set: __",
                    "Objections handled: __",
                    "One thing that surprised you: __"
                ]
            }
        ],
        workbookPrompts: [
            { id: "wb_7_9_1", type: "open_response", label: "After your first 20 solo doors — what was your biggest learning?", placeholder: "I learned that...", lines: 3 },
            { id: "wb_7_9_2", type: "open_response", label: "What will you do differently on door 21?", placeholder: "Starting with door 21...", lines: 2 }
        ]
    },

    "mod_4_8": {
        id: "mod_4_8",
        title: "Module 4.8: Day 4 Full Presentation Simulation",
        subtitle: "Practice presenting a full solar proposal in the AI simulator.",
        sections: [
            {
                title: "Presentation Simulation Instructions",
                type: "text",
                content: "This module puts your presentation skills to the test in the AI Simulator. You will run a full in-home presentation simulation with a virtual homeowner. The simulation will assess your ability to explain utility bill autopsy details, value stacks, net metering, battery storage, and financing options clearly and compliantly. You must remain within the compliance guidelines at all times, making no guaranteed claims regarding tax credits or savings. Aim to complete all phases of the presentation in under twenty minutes, ending each phase with a solid micro-close to confirm alignment.",
                narration: "Welcome to Module 4.8. Today you're putting your presentation skills to the test in the AI Simulator. You will run a full in-home proposal roleplay. The simulator will assess your ability to explain utility bills, net metering, battery storage, and financing options clearly and compliantly. You must remain compliant at all times, making no guaranteed claims regarding tax credits or savings. Keep the presentation under twenty minutes, ending each phase with a solid micro-close to confirm alignment. Good luck."
            }
        ],
        workbookPrompts: [
            {
                id: "wb_4_8_1",
                type: "open_response",
                label: "Record your biggest takeaways from the Day 4 Full Presentation Simulation. What areas did you excel in, and what needs polish?",
                placeholder: "I noticed that...",
                lines: 3
            }
        ]
    },

    "mod_5_7": {
        id: "mod_5_7",
        title: "Module 5.7: Day 5 Full Objection & Close Simulation",
        subtitle: "Test your objection handling and closing skills in the AI simulator.",
        sections: [
            {
                title: "Objection & Closing Simulation Instructions",
                type: "text",
                content: "This is the ultimate day-five challenge. You will enter the simulator to run a full objection-handling and closing roleplay. The virtual homeowner will throw multiple stacked objections at you, ranging from financial hesitations ('too expensive', 'high interest rates') to trust and timing issues ('let me think about it', 'cancellation concerns'). You must classify each objection correctly, use disarming and consultative frameworks, remain strictly compliant (never promising or guaranteeing tax savings or credit timelines), and guide the customer to a signed contract with complete transparency.",
                narration: "Welcome to Module 5.7. This is the ultimate day-five challenge. You will enter the simulator to run a full objection-handling and closing roleplay. The virtual homeowner will throw multiple stacked objections at you. You must classify each objection correctly, use consultative frameworks, remain strictly compliant, and guide the customer to a signed contract with complete transparency. Focus on active listening and disarming techniques."
            }
        ],
        workbookPrompts: [
            {
                id: "wb_5_7_1",
                type: "open_response",
                label: "Which objection was the hardest to handle in the simulator, and how did you resolve it?",
                placeholder: "The most challenging objection was...",
                lines: 3
            }
        ]
    },

    "mod_5_8": {
        id: "mod_5_8",
        title: "Module 5.8: Day 5 Wrap-Up",
        subtitle: "Reflect on Day 5 and prepare for Day 6.",
        sections: [
            {
                title: "Reflecting on Objection Mastery",
                type: "text",
                content: "You have successfully completed Day Five of the training curriculum. Today you learned how to classify and handle the top fifteen solar objections, apply closing frameworks to different personality types, and walk through a contract transparently. Tonight, reflect on your progress. Tomorrow is Day Six: Post-Sale Excellence & Career Growth, where you'll learn to ask for referrals, build a KPI tracker, and take your final certification exam. Get plenty of rest tonight so you are sharp and ready.",
                narration: "Welcome to Module 5.8. You have successfully completed Day Five of the training curriculum. Today you learned how to classify and handle the top fifteen solar objections, apply closing frameworks, and walk through a contract transparently. Tonight, reflect on your progress. Tomorrow is Day Six: Post-Sale Excellence & Career Growth, where you'll learn to ask for referrals and take your final certification exam. Get plenty of rest tonight so you are sharp and ready."
            }
        ],
        workbookPrompts: [
            {
                id: "wb_5_8_1",
                type: "open_response",
                label: "Reflect on Day 5 and write down one area of objection handling you want to practice further.",
                placeholder: "I want to practice...",
                lines: 2
            }
        ]
    },

}
// Each module has an ordered list of scenarios that must be completed sequentially
export const MODULE_SCENARIOS: Record<string, string[]> = {
    // Legacy day-level mappings (backward compat)
    "day_1_foundation": [],
    "day_2_prospecting": ["d2d_1", "not_interested", "busy_objection", "guarded_gloria", "busy_brian"],
    "day_3_discovery": ["discovery_1", "price_shopper", "debt_fear", "burned_beth", "analytical_alan", "reluctant_rosa", "garcia_household"],
    "day_4_presentation": ["eng_1", "bad_experience", "price_objection", "skeptical_steve", "numbers_nancy"],
    "day_5_closing": ["d2d_1", "lease_1", "stalling_objection", "moving_objection", "stalling_stan", "hesitant_helen"],
    "day_6_mastery": ["referral_ask", "exam_1", "post_install_patricia", "rodriguez_family"],
    // Sub-module level mappings
    "mod_2_5": ["guarded_gloria", "busy_brian"],
    "mod_2_6": ["not_interested", "busy_objection"],
    "mod_3_3": ["burned_beth", "reluctant_rosa"],
    "mod_3_4": ["analytical_alan", "busy_bob", "friendly_frank"],
    "mod_3_5": ["garcia_household"],
    "mod_3_8": ["solar_sam", "loyal_linda", "garcia_household"],
    "mod_3_9": ["discovery_1"],
    "mod_4_1": ["skeptical_steve"],
    "mod_4_6": ["numbers_nancy"],
    "mod_5_2": ["stalling_stan"],
    "mod_5_6": ["hesitant_helen"],
    "mod_6_1": ["post_install_patricia"],
    "mod_6_5": ["rodriguez_family"],
}


// Map scenarios back to their primary module for "Resume Training" logic
export const SCENARIO_TO_MODULE: Record<string, string> = {}
Object.entries(MODULE_SCENARIOS).forEach(([moduleId, scenarioIds]) => {
    scenarioIds.forEach(scenarioId => {
        // Only map if not already set, or if it's a mod_ id (preferring sub-modules over legacy days)
        if (!SCENARIO_TO_MODULE[scenarioId] || moduleId.startsWith('mod_')) {
            SCENARIO_TO_MODULE[scenarioId] = moduleId
        }
    })
})
