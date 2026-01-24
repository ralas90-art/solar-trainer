export interface Slide {
    title: string;
    content: string;
    imagePlaceholder?: string;
    image?: string;
}

export interface ModuleContent {
    id: string;
    title: string;
    subtitle: string;
    pdfDownloadUrl?: string;
    slideDeckUrl?: string; // NEW: Slide Deck Link
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
}

export const MODULES: Record<string, ModuleContent> = {
    // DAY 1
    "day_1_foundation": {
        id: "day_1_foundation",
        title: "Day 1: The Foundation",
        subtitle: "Mindset & Basics",
        pdfDownloadUrl: "/downloads/Day_1_Foundation.pdf",
        sections: [
            {
                title: "Welcome to Solar: The Industry of the Future",
                type: "text",
                content: "Welcome to the solar revolution. You are entering an industry that is reshaping the global energy landscape. But success here isn't just about understanding kilowatts and panels; it's about mastering your own psychology. \n\nBefore we ever knock on a door or analyze a utility bill, we must build the 'Solar Mindset'. This industry is lucrative, but it is also demanding. It requires a thick skin, a servant's heart, and an unshakeable belief in what you are selling. \n\nIn this module, we will strip away the 'salesman' persona and rebuild you as a Solar Professional—a consultant who solves expensive problems for homeowners. We will also cover the fundamental physics of how a photovoltaic (PV) system turns sunlight into savings, ensuring you can explain it simply and confidently to any homeowner."
            },
            {
                title: "The Solar Mindset: Reframing Rejection",
                type: "comparison",
                content: "The biggest killer of new sales reps is not lack of skill, but fear of rejection. We must reframe how we view a 'No'.",
                comparison: {
                    rookie: "They said no. They hate me. I failed. This doesn't work.",
                    pro: "They simply requested more information. I haven't found their 'Why' yet. A 'No' is just the starting line."
                }
            },
            {
                title: "Mindset Architecture",
                type: "image",
                content: "Visualizing the components of a top performer's psychology.",
                imageSrc: "/images/module_1_mindset_infographic.png"
            },
            {
                title: "How Solar Works: The Physics of Savings",
                type: "slides",
                content: "You don't need to be an engineer, but you must be an expert. Here is the simple, 4-step process of how energy flows from the sun to the savings account.",
                slides: [
                    {
                        title: "PV Basics: The Energy Journey",
                        content: "1. Generation: Sunlight (Photons) hits the silicon cells, knocking electrons loose to create Direct Current (DC) electricity.\n2. Conversion: The Inverter converts this raw DC power into usable Alternating Current (AC) for the home.\n3. Consumption: The home uses this solar power first, before pulling from the expensive grid.\n4. Net Metering: Think of it like 'Rollover Minutes' on an old cell plan. Excess power you generate during the day isn't lost; it rolls over to cover you at night.",
                        image: "/images/module_6_how_solar_works.png",
                        imagePlaceholder: "Solar Diagram"
                    }
                ]
            },
            {
                title: "Qualifying Homes: Is This a 'Solar House'?",
                type: "slides",
                content: "Not every home is a good fit for solar. It is your ethical duty to disqualify bad homes early. We look for three main things: Roof, Sun, and Electrical.",
                slides: [
                    {
                        title: "The Perfect Roof",
                        content: "The ideal roof faces South, maximizing exposure to the sun's path. East and West are also viable, but North is often a deal-breaker (in the Northern Hemisphere). Look for shading from trees or chimneys—shade is the enemy of production. Finally, check the condition: we cannot install on a roof that needs replacing in 5 years.",
                        image: "/training_materials/qualifying_roofs.png",
                        imagePlaceholder: "Roof Diagram"
                    },
                    {
                        title: "Electrical Panel Integrity",
                        content: "The Main Service Panel (MSP) is the heart of the home's grid. We typically need a modern 200 Amp panel to handle backfeeding solar power. Watch out for 'Zinsco' or 'Federal Pacific' panels—these are known fire hazards and must be replaced (Main Panel Upgrade or MPU) before we can install, which adds cost to the project.",
                        image: "/training_materials/electrical_panel_guide.png",
                        imagePlaceholder: "Panel Diagram"
                    }
                ]
            }
        ]
    },

    // DAY 2
    "day_2_prospecting": {
        id: "day_2_prospecting",
        title: "Day 2: Prospecting",
        subtitle: "The Hunt",
        pdfDownloadUrl: "/downloads/Day_2_Prospecting.pdf",
        sections: [
            {
                title: "Territory Management: The Cloverleaf Strategy",
                type: "text",
                content: "Amateurs knock randomly. Professionals manage their territory like a business. The goal is to minimize drive time and maximize face time. We use the 'Cloverleaf Pattern' to create a web of influence around every positive interaction. \n\nWhen you get a sale, or even a good conversation, don't just leave. Knock the neighbor to the left, the neighbor to the right, and the three homes across the street. 'Jones just went solar' is the most powerful social proof you can use. Don't drive across town for one door; build a fortress in one neighborhood."
            },
            {
                title: "Digital Door Knocking",
                type: "list",
                content: "When it rains or gets dark, the work doesn't stop. Dominate the neighborhood digitally.",
                items: [
                    "Nextdoor/FB: 'Hey neighbors, I'm the guy who helped the Smiths on Elm St go solar...'",
                    "Geofencing: Target ads to the specific street you are canvassing.",
                    "Goal: Become the 'Mayor' of your assigned territory."
                ]
            },
            {
                title: "The Perfect Day: Routine Equals Freedom",
                type: "slides",
                content: "Discipline creates freedom. If you don't control your schedule, your feelings will. Here is the optimized schedule of a Top 1% Performer.",
                slides: [
                    {
                        title: "The Daily Schedule",
                        content: "10:00 AM - 12:00 PM: Personal Development & Admin. sharpen your axe.\n1:00 PM - 3:00 PM: Territory scouting and 'Go-Backs' (appointments).\n3:00 PM - 7:00 PM: The Golden Hours. This is when people are home. You should be hitting doors non-stop. No admin, no breaks.\n8:00 PM: Review and plan the next day's route.",
                        image: "/images/module_9_perfect_day.png",
                        imagePlaceholder: "Schedule"
                    }
                ]
            },
            {
                title: "Dropping the Persona: The Anti-Sales Approach",
                type: "comparison",
                content: "Homeowners have 'Salesman Alarms' installed in their brains. If you sound like a salesperson, you trigger the alarm and the door closes. We need to lower resistance by sounding like a confused, helpful neighbor.",
                comparison: {
                    rookie: "Hi! I'm with Solar Bros! We are saving money in the area! Do you want to buy panels?",
                    pro: "Hi... sorry to bother you. I'm just looking for the homeowner? ... Oh, that's you? Okay, I wasn't sure if I had the right house... I was just stopping by because..."
                }
            }
        ]
    },

    // DAY 3
    "day_3_discovery": {
        id: "day_3_discovery",
        title: "Day 3: Connection",
        subtitle: "Discovery & Psychology",
        pdfDownloadUrl: "/downloads/Day_3_Discovery.pdf",
        slideDeckUrl: "/downloads/In_Home_Presentation.pptx",
        sections: [
            {
                title: "In-Home Mastery",
                type: "text",
                content: "The Kitchen Table is your stage. Sit in the 'Power Seat' (next to them), not across (adversary)."
            },
            {
                title: "Personality Types (BOLT)",
                type: "image",
                content: "Identify the homeowner's type to mirror their energy.",
                imageSrc: "/training_materials/personality_types_bolt.png"
            },
            {
                title: "Question Architecture: The Pyramid of Influence",
                type: "comparison",
                content: "Mastering the flow of conversation means knowing WHICH type of question to ask and WHEN.",
                comparison: {
                    rookie: "Asking Closed Questions too early: 'Do you want to save money?' (Easy 'No').",
                    pro: "Asking Open-Ended Questions to build value, then Tie-Downs to lock it in."
                }
            },
            {
                title: "Type 1: Open-Ended Questions (The Discovery)",
                type: "list",
                content: "Use these to get them talking. They cannot be answered with 'Yes' or 'No'. Start with: Who, What, Where, When, Why, How.",
                items: [
                    "WHAT is your biggest concern with the current utility rates?",
                    "HOW long have you been thinking about doing something about the bill?",
                    "WHY is energy independence important to you specifically?"
                ]
            },
            {
                title: "Type 2: Tie-Downs (The Micro-Commitments)",
                type: "list",
                content: "Small questions at the end of statements to build a 'Yes Ladder'.",
                items: [
                    "Standard: '...wouldn't you agree?' / '...right?'",
                    "Inverse: 'It makes sense to stop renting your power, DOESN'T it?'",
                    "Tag: 'You want to lower that bill, DON'T you?'"
                ]
            },
            {
                title: "Type 3: Clarifying Questions (The Mirror)",
                type: "list",
                content: "When they say something vague, repeat the last 3 words as a question to dig deeper.",
                items: [
                    "Homeowner: 'We're thinking about moving soon.'",
                    "You: 'Moving soon?' (Wait for them to explain: 'Well, maybe in 5 years...')",
                    "Goal: Uncover the real timeline without interrogating them."
                ]
            },
            {
                title: "Type 4: Labeling (Emotional Intelligence)",
                type: "list",
                content: "Statements framed as observations to build empathy. (From Chris Voss).",
                items: [
                    "It sounds like you've had a bad experience with contractors before.",
                    "It seems like you're worried about the aesthetics of the panels.",
                    "It looks like you analyze every detail before making a decision."
                ]
            },
            {
                title: "Type 5: Trial Closes (Temperature Checks)",
                type: "comparison",
                content: "Checking the pulse before asking for the sale.",
                comparison: {
                    rookie: "Waiting until the end to ask: 'Do you want to buy it?' (High Pressure).",
                    pro: "Micro-checks along the way: 'If we could eliminate that bill, would that be helpful?'"
                }
            },
            {
                title: "Type 6: Consequence Questions (The Fear)",
                type: "list",
                content: "Getting them to visualize the pain of doing nothing.",
                items: [
                    "What happens in 5 years if rates go up 10% and you're still renting power?",
                    "Do you think the utility company is going to LOWER rates in the future?"
                ]
            },
            {
                title: "Practice Scenario: Deep Discovery",
                type: "simulation",
                content: "You are at the kitchen table with 'John', a skeptical analytical type (Owl). Practice finding his pain points without pitching product.",
                scenarioId: "discovery_1",
                openingLine: "I don't have much time. What are you selling?"
            },
            {
                title: "Sales Vocabulary",
                type: "list",
                content: "Words to Avoid (Fear Triggers):",
                items: [
                    "Sign, Contract, Cost, Pitch, Deal, Down Payment"
                ]
            },
            {
                title: "Sales Vocabulary",
                type: "list",
                content: "Words to Use (Confidence Builders):",
                items: [
                    "Authorize, Paperwork, Total Investment, Proposal, Agreement, Initial Amount"
                ]
            },
            {
                title: "The 3 Reasons Framework",
                type: "list",
                content: "Use this script to frame the conversation early:",
                items: [
                    "Reason #1: Savings and Price Protection (Economics)",
                    "Reason #2: Property Value Increases (Asset)",
                    "Reason #3: Producing Clean Power (Environment)"
                ]
            },
            {
                title: "Opening Script",
                type: "quote",
                content: "\"The purpose of this call is to help you learn more about solar energy... to see if you can produce your own power instead of renting it.\""
            }
        ]
    },

    // DAY 4
    "day_4_presentation": {
        id: "day_4_presentation",
        title: "Day 4: Presentation",
        subtitle: "Building Value",
        pdfDownloadUrl: "/downloads/Day_4_Presentation.pdf",
        sections: [
            {
                title: "The Bill Swap",
                type: "text",
                content: "You aren't spending extra money. You are redirecting a liability (Rent) to an asset (Mortgage)."
            },
            {
                title: "The Money Roadmap",
                type: "slides",
                content: "Follow the cash flow.",
                slides: [
                    {
                        title: "Money Roadmap",
                        content: "Stop burning money on the utility. Start building equity.",
                        image: "/images/module_7_money_roadmap.png",
                        imagePlaceholder: "Money Flow"
                    }
                ]
            },
            {
                title: "The ROI Script (Tax-Free Returns)",
                type: "text",
                content: "\"Mr. Homeowner, where else can you get a guaranteed 10% return that is tax-free? The stock market? Real estate? This system isn't just an appliance; it's the safest investment in your portfolio. You are moving money from a liability (rent) to an asset (ownership).\""
            },
            {
                title: "Financing 101",
                type: "comparison",
                content: "Ownership vs PPA",
                comparison: {
                    rookie: "PPA is a lease and it's bad.",
                    pro: "PPA is 'Pay for Production'. Zero debt, zero maintenance. Good for those without tax liability."
                }
            }
        ]
    },

    // DAY 5
    "day_5_closing": {
        id: "day_5_closing",
        title: "Day 5: Closing",
        subtitle: "Objections & Decisions",
        pdfDownloadUrl: "/downloads/Day_5_Objections.pdf",
        sections: [
            {
                title: "Objection Judo",
                type: "text",
                content: "Don't fight the objection. Align with it. Use the Porcupine Technique: Answer a question with a question."
            },
            {
                title: "The Decision Matrix",
                type: "image",
                content: "Use this visual to help homeowners weigh their options logically.",
                imageSrc: "/images/module_5_decision_matrix.png"
            },
            {
                title: "Practice Scenario: The Price Objection",
                type: "simulation",
                content: "The homeowner says 'It's too expensive'. Use the Feel-Felt-Found technique to overcome this.",
                scenarioId: "objection_price",
                openingLine: "50 thousand dollars?! That is way too expensive. I'm not interested."
            },
        ]
    },

    // DAY 6
    "day_6_mastery": {
        id: "day_6_mastery",
        title: "Day 6: Mastery",
        subtitle: "Referrals & Certification",
        pdfDownloadUrl: "/downloads/Day_6_Mastery.pdf",
        slideDeckUrl: "/downloads/Virtual_Presentation.pptx",
        sections: [
            {
                title: "The Referral Engine",
                type: "text",
                content: "A sale isn't the end. It's the seed for 3 more. Ask for referrals at the 'Moment of Happiness'."
            },
            {
                title: "The 10-Step Solar Lifecycle",
                type: "list",
                content: "From 'Hello' to 'Power On' (PTO):",
                items: [
                    "1. Proposal Generation & Usage Analysis",
                    "2. Contract Signed (Closed Won)",
                    "3. Site Audit (2-3 days post-sign)",
                    "4. Final Engineering Design",
                    "5. Permit Submission (AHJ)",
                    "6. Permit Approval",
                    "7. Installation (1-2 days)",
                    "8. Final Inspection",
                    "9. Permission to Operate (PTO)",
                    "10. System Activation"
                ]
            },
            {
                title: "The Referral Tree",
                type: "image",
                content: "How one happy customer branches into three new sales.",
                imageSrc: "/images/module_8_referral_tree.png"
            },
            {
                title: "Practice Scenario: Asking for Referrals",
                type: "simulation",
                content: "You just signed the deal. Now, ask for introductions to their neighbors without being pushy.",
                scenarioId: "referral_ask",
                openingLine: "This has been great, I'm really excited about the savings. Thanks for your help."
            },
            {
                title: "Verification",
                type: "text",
                content: "You are now ready. Take the Certification Exam to prove you can handle the toughest homeowners."
            }
        ]
    }
}
