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
            { id: "mod_1_6", moduleNumber: "1.6", title: "Identity Shift — Consultant vs Salesperson", duration: "20 min", type: "activity" },
            { id: "mod_1_7", moduleNumber: "1.7", title: "Utility Bill Mastery", duration: "25 min", type: "quiz" },
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
            { id: "mod_2_1", moduleNumber: "2.1", title: "Territory Strategy & Planning", duration: "20 min", type: "activity" },
            { id: "mod_2_2", moduleNumber: "2.2", title: "Daily Efficiency Math & Time Management", duration: "15 min", type: "content" },
            { id: "mod_2_3", moduleNumber: "2.3", title: "Door Knocking Mastery", duration: "30 min", type: "activity", hasSimulation: true },
            { id: "mod_2_4", moduleNumber: "2.4", title: "Phone & Virtual Appointment Setting", duration: "25 min", type: "activity" },
            { id: "mod_2_5", moduleNumber: "2.5", title: "Anti-Sales Framing & Trust Building", duration: "20 min", type: "activity" },
            { id: "mod_2_6", moduleNumber: "2.6", title: "Objection Handling Preview — Top 5", duration: "25 min", type: "activity", hasSimulation: true },
            { id: "mod_2_7", moduleNumber: "2.7", title: "Daily Prospecting Workflow", duration: "15 min", type: "content" },
            { id: "mod_2_8", moduleNumber: "2.8", title: "Day 2 Role-Play Certification", duration: "30 min", type: "certification" }
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
            { id: "mod_3_3", moduleNumber: "3.3", title: "Tactical Empathy & Mirroring", duration: "20 min", type: "content", hasSimulation: true },
            { id: "mod_3_4", moduleNumber: "3.4", title: "Question Architecture — 12-Question Discovery", duration: "30 min", type: "activity" },
            { id: "mod_3_5", moduleNumber: "3.5", title: "Spouse & Decision-Maker Dynamics", duration: "20 min", type: "content" },
            { id: "mod_3_6", moduleNumber: "3.6", title: "Roof & Site Assessment", duration: "25 min", type: "activity" },
            { id: "mod_3_7", moduleNumber: "3.7", title: "Disqualification Mastery", duration: "20 min", type: "content" },
            { id: "mod_3_8", moduleNumber: "3.8", title: "Day 3 Full Discovery Simulation", duration: "40 min", type: "simulation", hasSimulation: true }
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
            { id: "mod_4_2", moduleNumber: "4.2", title: "Financing Deep Dive", duration: "35 min", type: "content" },
            { id: "mod_4_3", moduleNumber: "4.3", title: "The Value Stack — Beyond Money", duration: "20 min", type: "content" },
            { id: "mod_4_4", moduleNumber: "4.4", title: "Net Metering & Battery Reality", duration: "25 min", type: "content" },
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
            { id: "mod_6_2", moduleNumber: "6.2", title: "Review & Social Proof Strategy", duration: "20 min", type: "activity" },
            { id: "mod_6_3", moduleNumber: "6.3", title: "Orphan Owner Strategy", duration: "20 min", type: "activity" },
            { id: "mod_6_4", moduleNumber: "6.4", title: "Performance Dashboard & KPI Discipline", duration: "25 min", type: "activity" },
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
            "content": "The residential solar market in the United States is one of the fastest-growing industries in the country. The three primary reasons homeowners go solar are utility bill inflation, energy independence, and home value increase. Utility rates have gone up six to eight percent annually for the last two decades with no sign of stopping. That is the foundation of every conversation you'll have. You are offering homeowners a hedge against something that is guaranteed to keep rising."
        },
        {
            "title": "The Federal Tax Credit",
            "type": "text",
            "content": "The federal Investment Tax Credit \u2014 the ITC \u2014 gives homeowners a thirty percent credit on the total system cost. On a thirty-thousand-dollar system, that's nine thousand dollars back in their first tax filing. This credit is locked in through 2032. That's not forever. Every year a homeowner waits is a year of paying full utility rates AND a year closer to the credit potentially changing. The ITC creates real, legitimate urgency in your conversations."
        },
        {
            "title": "Common Solar Myths",
            "type": "text",
            "content": "You will hear these three myths constantly, and you need to be ready. First \u2014 solar doesn't work in cloudy states. False. Germany is one of the cloudiest countries in the world and leads in solar adoption. Panels produce electricity from daylight, not direct sunlight. Second \u2014 panels are too expensive. With financing, most homeowners pay less per month than their current utility bill from day one. Third \u2014 the technology will be better next year. The technology has improved every year for forty years. Waiting always costs more than it saves."
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
            "content": "There's a fundamental difference between a salesperson and a consultant. A salesperson pushes a product and chases a commission. A consultant diagnoses a problem and prescribes the right solution \u2014 even if that solution is walking away. In solar, this distinction matters because homeowners can feel which one you are within sixty seconds of opening the door. Your job is to enter every interaction as a consultant. You are restructuring someone's utility spending and protecting their family from inflation. Act accordingly."
        },
        {
            "title": "The Integrity Creed",
            "type": "text",
            "content": "The integrity creed is not optional \u2014 it's the foundation of a sustainable career. Never promise savings you can't guarantee. Never exaggerate return on investment. Disqualify aggressively \u2014 a bad fit today is a cancellation tomorrow, and cancellations hurt your income. And always remember that your long-term reputation is worth more than any single commission check. The reps who build six-figure incomes are the ones homeowners refer to their neighbors because they were treated with respect."
        },
        {
            "title": "Reframing Rejection",
            "type": "text",
            "content": "In solar sales, you will hear the word no more than any other word. Every single top performer in this industry hears no over a hundred times per week. The shift you need to make is this \u2014 no does not mean I reject you. It means not right now, or this isn't a fit. Both of those are useful information. Track your no's because they're the path to your yes's. A rep knocking forty-five doors statistically closes one deal. That means every door \u2014 including every no \u2014 is worth about seventy-eight dollars."
        },
        {
            "title": "Energy Management",
            "type": "text",
            "content": "This career requires emotional energy, and you have to manage it intentionally. Don't take rejection personally \u2014 the homeowner doesn't know you, and they're not rejecting you. They're protecting their time and their home. Celebrate small wins: an appointment set is a win, even if no deal follows. A meaningful conversation is a win. Reset between every door. The rep who treats door forty-five with the same energy as door one becomes the rep closing at a rate that changes everything."
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
            "content": "The solar loan is the most common and most beneficial financing structure for qualified homeowners. The homeowner borrows money to purchase the system outright, owns it completely, and receives the thirty percent federal tax credit \u2014 typically nine thousand dollars on a thirty-thousand-dollar system. Monthly payments are often lower than their current utility bill from day one. The trade-off is good credit is required \u2014 generally six hundred fifty or higher. The long-term savings are the highest of any financing option because the homeowner owns a depreciating-zero asset that eliminates their biggest recurring utility expense."
        },
        {
            "title": "The 18-Month Tax Credit Strategy",
            "type": "text",
            "content": "Many solar loans offer an eighteen-month same-as-cash window. Here is how to explain it. In the first eighteen months, the payment is slightly higher. But in year two, when the homeowner files their taxes and receives the thirty percent tax credit, they apply that lump sum directly to the loan principal. This significantly drops their monthly payment for the remaining life of the loan. The script is simple: you'll have a higher payment for eighteen months, then you apply your tax credit and your payment drops \u2014 permanently. Walk through that math with them clearly."
        },
        {
            "title": "Option 2 & 3 \u2014 Lease and PPA",
            "type": "text",
            "content": "The solar lease and Power Purchase Agreement are both zero-down options where the solar company owns the system. With a lease, the homeowner pays a fixed monthly amount. With a PPA, they pay per kilowatt-hour produced. Both options transfer maintenance responsibility to the company. The trade-off: the homeowner does not receive the federal tax credit, and both have escalator clauses that increase payments annually. Recommend these for homeowners with lower credit scores, no meaningful tax liability, or those who simply want simplicity over maximum savings."
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
    // ─── MODULE 6.1 — The Referral System ────────────────────────────────
    "mod_6_1": {
    "id": "mod_6_1",
    "title": "Module 6.1: The Referral System",
    "subtitle": "Generate referrals consistently (not randomly) Create a repeatable referral process Build pipeline that doesn't depend o",
    "sections": [
        {
            "title": "Why Referrals Are Worth More",
            "type": "text",
            "content": "Referrals close at forty to sixty percent \u2014 compared to twenty to thirty percent for cold leads. The trust is already established before you say a word. And the customer acquisition cost is zero. A single referral pipeline can eventually replace cold prospecting entirely. The consultants who build six-figure incomes treat referral generation as a system \u2014 not an afterthought. You are going to leave today with a repeatable three-step referral process that runs every time you close a deal."
        },
        {
            "title": "The 3-Step Referral System",
            "type": "text",
            "content": "Step one: plant the seed at the close. Before you leave: the biggest thank-you is a referral. If anyone you know has been complaining about their electric bill, I'd love an introduction. Step two: activate post-install. When their system goes live, send an excited message and ask: who's the first person you'd want to tell about this? Step three: personalized follow-up. Reach out to each referral by name, mentioning the mutual connection. A referral outreach that says your neighbor mentioned you've been thinking about solar opens at a completely different level than a cold call."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_6_1_1",
            "type": "open_response",
            "label": "Reflect on The Referral System: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 6.1 Knowledge Check",
        "questions": [
            {
                "id": "kc_6_1_a",
                "question": "What was the main concept covered in The Referral System?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 6.1 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 6.2 — Reputation Building & Online Presence ────────────────────────────────
    "mod_6_2": {
    "id": "mod_6_2",
    "title": "Module 6.2: Reputation Building & Online Presence",
    "subtitle": "Build a digital reputation that generates inbound leads Manage reviews proactively Use social proof at the door",
    "sections": [
        {
            "title": "Google Reviews & Neighborhood Authority",
            "type": "text",
            "content": "Ask every closed customer for a Google review and send the direct link \u2014 make it as frictionless as possible. Reviews compound over time. When a homeowner in your territory searches for solar companies and sees forty-seven five-star reviews including names they recognize from the neighborhood, the trust is already established before you knock. Pair that with yard signs on completed installs and you've created passive social proof at scale. Neighborhood authority is built rep by rep and install by install \u2014 it's one of the most powerful long-term assets you can build in this career."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_6_2_1",
            "type": "open_response",
            "label": "Reflect on Reputation Building & Online Presence: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 6.3 — KPI Tracking & Self-Coaching ────────────────────────────────
    "mod_6_3": {
    "id": "mod_6_3",
    "title": "Module 6.3: KPI Tracking & Self-Coaching",
    "subtitle": "Track meaningful metrics (not just activity) Identify where your funnel is leaking Self-coach using data",
    "sections": [
        {
            "title": "The Performance Funnel",
            "type": "text",
            "content": "Every rep's results start with one metric at the top: doors knocked. From there the funnel flows down \u2014 conversations, appointments set, appointments sat, proposals presented, deals closed. Your job is to know your conversion rate at each step. If you're knocking a hundred doors and only having five conversations, your opener needs work. If conversations convert to appointments at a low rate, your transition needs work. If appointments show at low rates, your pre-appointment communication needs work. If your close rate is low, objection handling needs work. Know your numbers and you'll always know exactly what to practice."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_6_3_1",
            "type": "open_response",
            "label": "Reflect on KPI Tracking & Self-Coaching: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 6.3 Knowledge Check",
        "questions": [
            {
                "id": "kc_6_3_a",
                "question": "What was the main concept covered in KPI Tracking & Self-Coaching?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 6.3 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 6.4 — Long-Term Mindset: Career vs. Job ────────────────────────────────
    "mod_6_4": {
    "id": "mod_6_4",
    "title": "Module 6.4: Long-Term Mindset: Career vs. Job",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "The Reputation Compound Effect",
            "type": "text",
            "content": "Every interaction you have either builds or erodes your reputation. Every honest conversation is a deposit. Every exaggeration is a withdrawal. Reps who think short-term chase any deal, overpromise, and burn bridges. Reps who think long-term qualify aggressively, build relationships, and generate referrals for years. Twenty-five closed deals means twenty-five potential referral sources. One hundred closed deals means enough inbound business to rarely cold knock. Treat every customer like a five-year relationship \u2014 because the best ones become exactly that."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_6_4_1",
            "type": "open_response",
            "label": "Reflect on Long-Term Mindset: Career vs. Job: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 6.5 — Advanced Scenario Practice ────────────────────────────────
    "mod_6_5": {
    "id": "mod_6_5",
    "title": "Module 6.5: Advanced Scenario Practice",
    "subtitle": "Integrate all skills in complex, real-world simulations Practice under pressure Receive detailed feedback",
    "sections": [
        {
            "title": "Scenario A \u2014 The Researcher",
            "type": "text",
            "content": "This homeowner has researched NEM 3.0, dealer fees, and degradation curves before you arrived. They're testing your expertise. Don't repeat basics \u2014 ask what they've already learned and where their gaps are. Use technical language. Admit when you need to confirm exact figures rather than bluffing. Then ask: based on everything you've researched, what's the one thing still holding you back? That question almost always surfaces the real blocker \u2014 which is usually not technical at all."
        },
        {
            "title": "Scenario B \u2014 Married Couple Standoff",
            "type": "text",
            "content": "Husband wants solar. Wife is skeptical from a prior contractor experience. And there's a hidden issue \u2014 they're planning to sell in four years. Your job is to balance enthusiasm for the husband with trust-building for the wife, address the four-year timeline honestly \u2014 which may mean a partial disqualification or an honest conversation about shorter payback structures \u2014 and never take sides. Validate both perspectives. Make the wife feel heard before she feels sold. Her trust is the key to the deal."
        },
        {
            "title": "Scenario C \u2014 Competing Quote",
            "type": "text",
            "content": "A warm referral lead \u2014 already motivated and mostly educated. But they got a competing quote eight thousand dollars cheaper. Your response is never to panic or drop your price reflexively. Walk them through the right comparison questions: what panels, what inverter, what warranty, who does the install, what's the monitoring system, and what's the cancellation policy? Eight thousand dollars in savings means nothing if the cheaper company uses inferior components, subcontracts the install, or doesn't exist in five years when a warranty claim comes in. Make the case for value, not price."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_6_5_1",
            "type": "open_response",
            "label": "Reflect on Advanced Scenario Practice: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 6.5 Knowledge Check",
        "questions": [
            {
                "id": "kc_6_5_a",
                "question": "What was the main concept covered in Advanced Scenario Practice?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 6.5 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 6.6 — Certification Exam ────────────────────────────────
    "mod_6_6": {
    "id": "mod_6_6",
    "title": "Module 6.6: Certification Exam",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Exam Overview",
            "type": "text",
            "content": "The certification exam is fifty questions covering five areas. Solar technology and system components \u2014 twenty percent. Utility bill analysis and financing \u2014 twenty percent. Homeowner psychology and the BOLT framework \u2014 twenty percent. Objection handling and closing \u2014 twenty-five percent. Compliance and ethics \u2014 fifteen percent. You need an eighty percent or higher to pass. This isn't a test you pass by studying hard the night before \u2014 it's a test you pass by being fully present through Days One through Six. If you've done the work, you're ready."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_6_6_1",
            "type": "open_response",
            "label": "Reflect on Certification Exam: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 6.6 Knowledge Check",
        "questions": [
            {
                "id": "kc_6_6_a",
                "question": "What was the main concept covered in Certification Exam?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 6.6 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 6.7 — Day 6 Wrap-Up & Day 7 Preview ────────────────────────────────
    "mod_6_7": {
    "id": "mod_6_7",
    "title": "Module 6.7: Day 6 Wrap-Up & Day 7 Preview",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "You're Ready for Day 7",
            "type": "text",
            "content": "You have learned more in six days than most solar reps learn in three months. Tomorrow is different \u2014 it's not a classroom day. You'll spend the morning shadowing your manager through three live appointments, watching how every skill in this program plays out in a real home with real homeowners. After lunch, you run one full appointment yourself, with your manager observing quietly. Then you debrief, receive your field assessment, and get cleared for solo selling. Get a good night's sleep. You are ready."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_6_7_1",
            "type": "open_response",
            "label": "Reflect on Day 6 Wrap-Up & Day 7 Preview: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 7.1 — Pre-Field Briefing ────────────────────────────────
    "mod_7_1": {
    "id": "mod_7_1",
    "title": "Module 7.1: Pre-Field Briefing",
    "subtitle": "Review Day 7 agenda Set expectations for shadowing Address any last-minute questions",
    "sections": [
        {
            "title": "Shadow Mode \u2014 What to Watch For",
            "type": "text",
            "content": "This morning you are in shadow mode. Your job is to observe and take notes \u2014 not to participate unless your manager invites you to. As you watch each appointment, focus on five things: how your manager positions themselves physically in the home, how they handle unexpected interruptions, how they identify and adapt to personality types in real time, how they phrase objection responses differently from how they were scripted, and when and how they make the close. After each appointment, you'll debrief in the car. Ask every question that came up."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_1_1",
            "type": "open_response",
            "label": "Reflect on Pre-Field Briefing: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 7.2 — Appointment #1 — Shadow & Observe ────────────────────────────────
    "mod_7_2": {
    "id": "mod_7_2",
    "title": "Module 7.2: Appointment #1 \u2014 Shadow & Observe",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Debrief After Appointment 1",
            "type": "text",
            "content": "After each shadow appointment, the debrief in the car is as important as the appointment itself. Your manager will ask what you noticed. Bring specific observations \u2014 not general thoughts. Then your manager will walk you through what they were thinking at key moments. Why they slowed down when the wife got quiet. Why they chose the summary close instead of the assumptive close. Why they asked about the electric vehicle at that specific point in the discovery. These context moments turn observation into insight."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_2_1",
            "type": "open_response",
            "label": "Reflect on Appointment #1 \u2014 Shadow & Observe: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 7.3 — Appointment #2 — Shadow & Observe ────────────────────────────────
    "mod_7_3": {
    "id": "mod_7_3",
    "title": "Module 7.3: Appointment #2 \u2014 Shadow & Observe",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Constructive Critique",
            "type": "text",
            "content": "After the second appointment, your manager will ask: what would you have done differently? This is not a test \u2014 it's a reflection exercise. Think about moments where the conversation could have gone another direction. When did the homeowner give a buying signal that wasn't immediately recognized? What objection could have been handled with a different technique? This kind of constructive critique \u2014 whether on your manager's appointment or your own \u2014 is how elite reps develop faster than average ones."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_3_1",
            "type": "open_response",
            "label": "Reflect on Appointment #2 \u2014 Shadow & Observe: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 7.4 — Appointment #3 — Shadow & Observe ────────────────────────────────
    "mod_7_4": {
    "id": "mod_7_4",
    "title": "Module 7.4: Appointment #3 \u2014 Shadow & Observe",
    "subtitle": "Decompress and process learnings Build confidence for afternoon appointment Review notes and scripts",
    "sections": [
        {
            "title": "Preparing Your Game Plan",
            "type": "text",
            "content": "After the third shadow appointment, before lunch, your manager will ask: you're up next after lunch \u2014 what's your game plan? Walk through your approach out loud. How will you open? What discovery questions will you lead with? What personality type do you expect based on the lead info? What objections might come up? How do you plan to close? Articulating this out loud is a form of mental rehearsal that significantly improves execution. Your manager will coach any adjustments before you go in."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_4_1",
            "type": "open_response",
            "label": "Reflect on Appointment #3 \u2014 Shadow & Observe: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 7.5 — Pre-Appointment Prep ────────────────────────────────
    "mod_7_5": {
    "id": "mod_7_5",
    "title": "Module 7.5: Pre-Appointment Prep",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Last-Minute Coaching",
            "type": "text",
            "content": "In the fifteen minutes before your appointment, your manager will ask you five questions. What do you know about this homeowner? What's your opener? What objections do you expect? Which homeowner type does this feel like? And how will you close? Answer all five out loud. Don't guess \u2014 draw on your training. Then take a breath. You've practiced this for six days. You know the framework. You know the objections. You know how to read a room. Trust your preparation and go execute."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_5_1",
            "type": "open_response",
            "label": "Reflect on Pre-Appointment Prep: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 7.6 — Rep Runs Full Appointment ────────────────────────────────
    "mod_7_6": {
    "id": "mod_7_6",
    "title": "Module 7.6: Rep Runs Full Appointment",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Running the Appointment",
            "type": "text",
            "content": "This is your moment. Your manager will sit quietly and observe \u2014 they will not intervene unless you freeze or the homeowner asks them a direct question. Your job is to run the full appointment from discovery through close as if no one else is in the room. Use everything from Day One through Six. Control the environment. Read the personality. Ask all twelve discovery questions. Deliver the value stack. Handle every objection with A.C.A. Ask for the sale. And if they close \u2014 ask for a referral before you leave. This is real. Do your job."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_6_1",
            "type": "open_response",
            "label": "Reflect on Rep Runs Full Appointment: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ],
    "quiz": {
        "title": "Module 7.6 Knowledge Check",
        "questions": [
            {
                "id": "kc_7_6_a",
                "question": "What was the main concept covered in Rep Runs Full Appointment?",
                "options": [
                    "The concept taught in this module",
                    "An incorrect distractor",
                    "Another incorrect concept",
                    "None of the above"
                ],
                "correctAnswerIndex": 0,
                "explanation": "This is an autogenerated placeholder for the 7.6 quiz."
            }
        ]
    }
}
,
    // ─── MODULE 7.7 — Post-Appointment Debrief ────────────────────────────────
    "mod_7_7": {
    "id": "mod_7_7",
    "title": "Module 7.7: Post-Appointment Debrief",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "Manager Feedback Framework",
            "type": "text",
            "content": "Your manager will debrief using a three-part structure. First, what went well \u2014 specific things you did well, with examples from the appointment. Second, what to improve \u2014 one or two specific, actionable adjustments for your next appointment. Third, your overall assessment: field-ready means you start setting appointments immediately. Almost there means one more shadowing day. Needs more training means continued role-play before solo selling. Regardless of the outcome \u2014 you ran a real appointment today. That puts you ahead of where you started seven days ago."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_7_1",
            "type": "open_response",
            "label": "Reflect on Post-Appointment Debrief: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 7.8 — Certification Sign-Off ────────────────────────────────
    "mod_7_8": {
    "id": "mod_7_8",
    "title": "Module 7.8: Certification Sign-Off",
    "subtitle": "missing_from_source",
    "sections": [
        {
            "title": "You Are Certified",
            "type": "text",
            "content": "If you've passed, your manager will sign your field certification form and submit it to operations. What happens next: your CRM is activated with your territory assignments, inbound leads begin routing to you, and you receive your business cards, yard signs, and marketing materials. You are now an active solar consultant. The certificate is not the end \u2014 it's the beginning. Every appointment from here builds your skill, your pipeline, and your reputation. Go earn it."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_8_1",
            "type": "open_response",
            "label": "Reflect on Certification Sign-Off: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
,
    // ─── MODULE 7.9 — Solo Prospecting ────────────────────────────────
    "mod_7_9": {
    "id": "mod_7_9",
    "title": "Module 7.9: Solo Prospecting",
    "subtitle": "Apply Day 2 prospecting skills in real territory Set 1\u20132 appointments for next week Build confidence",
    "sections": [
        {
            "title": "Your First Solo Doors",
            "type": "text",
            "content": "Tonight you'll knock twenty doors on your own. Use your thirty-second opener, handle every brush-off with the micro objection techniques from Day Two, and try to set at least one appointment for next week. Text your manager your results when you're done \u2014 how many doors, how many conversations, and how many appointments set. Then get some rest. Tomorrow you do it again. And the day after. This is the work that builds income. Welcome to your career in solar."
        }
    ],
    "workbookPrompts": [
        {
            "id": "wb_7_9_1",
            "type": "open_response",
            "label": "Reflect on Solo Prospecting: How will you apply this?",
            "placeholder": "Type your reflection here...",
            "lines": 2
        }
    ]
}
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
    "mod_2_3": ["guarded_gloria", "busy_brian"],
    "mod_2_6": ["not_interested", "busy_objection"],
    "mod_3_3": ["burned_beth", "reluctant_rosa"],
    "mod_3_4": ["analytical_alan", "busy_bob", "friendly_frank"],
    "mod_3_5": ["garcia_household"],
    "mod_3_8": ["solar_sam", "loyal_linda", "garcia_household"],
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
