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
    pdfDownloadUrl?: string; // NEW: Download link
    sections: {
        title: string;
        content: string;
        type: 'text' | 'list' | 'quote' | 'comparison' | 'slides';
        items?: string[];
        comparison?: { rookie: string; pro: string };
        slides?: Slide[];
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
                title: "Welcome to Solar",
                type: "text",
                content: "Success in solar isn't just about sales; it's about belief. We start with the Solar Mindset (Zig Ziglar style) and the physics of how energy works."
            },
            {
                title: "The Solar Mindset",
                type: "comparison",
                content: "Reframing Rejection.",
                comparison: {
                    rookie: "They said no. I failed.",
                    pro: "They simply requested more information. I haven't found their 'Why' yet."
                }
            },
            {
                title: "How Solar Works",
                type: "slides",
                content: "Understanding the System.",
                slides: [
                    {
                        title: "PV Basics",
                        content: "Photosons hit the cells (DC). Inverter converts to AC. Home uses it first. Grid stores the rest.",
                        image: "/images/module_6_how_solar_works.png",
                        imagePlaceholder: "Solar Diagram"
                    }
                ]
            },
            {
                title: "Qualifying Homes",
                type: "slides",
                content: "Is this a 'Solar House'?",
                slides: [
                    {
                        title: "The Perfect Roof",
                        content: "South-Facing is Gold. Shading is the enemy. Roof must be in good condition.",
                        image: "/training_materials/qualifying_roofs.png", // Pointing to local copy for now, ideally moved to public
                        imagePlaceholder: "Roof Diagram"
                    },
                    {
                        title: "Electrical Panel",
                        content: "We need a modern 200 Amp panel. Old 'Zinsco' panels are fire hazards and must be swapped.",
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
                title: "Territory Management",
                type: "text",
                content: "Work smart. Use the Cloverleaf pattern. Don't drive across town for one door. Circle your wins."
            },
            {
                title: "The Perfect Day",
                type: "slides",
                content: "Structure leads to freedom.",
                slides: [
                    {
                        title: "Daily Schedule",
                        content: "AM: Prep & Admin. PM: Knocking. The Golden Hours are 3pm-7pm.",
                        image: "/images/module_9_perfect_day.png",
                        imagePlaceholder: "Schedule"
                    }
                ]
            },
            {
                title: "Dropping the Persona",
                type: "comparison",
                content: "Stop sounding like a salesperson.",
                comparison: {
                    rookie: "Hi! I'm with Solar Bros! We are saving money!",
                    pro: "Hi... I'm just looking for the homeowner? ... I wasn't sure if I had the right house..."
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
        sections: [
            {
                title: "In-Home Mastery",
                type: "text",
                content: "The Kitchen Table is your stage. Sit in the 'Power Seat' (next to them), not across (adversary)."
            },
            {
                title: "Personality Types (BOLT)",
                type: "slides",
                content: "Mirror their energy.",
                slides: [
                    {
                        title: "The 4 Types",
                        content: "Bull (Direct). Owl (Analytical). Lamb (Amiable). Tiger (Expressive).",
                        image: "/training_materials/personality_types_bolt.png",
                        imagePlaceholder: "BOLT Icons"
                    }
                ]
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
                type: "slides",
                content: "The Ben Franklin Close.",
                slides: [
                    {
                        title: "Decision Matrix",
                        content: "Doing Nothing = 100% Risk, 0% Equity. Going Solar = 0% Risk, High Equity.",
                        image: "/images/module_5_decision_matrix.png",
                        imagePlaceholder: "Matrix"
                    }
                ]
            }
        ]
    },

    // DAY 6
    "day_6_mastery": {
        id: "day_6_mastery",
        title: "Day 6: Mastery",
        subtitle: "Referrals & Certification",
        pdfDownloadUrl: "/downloads/Day_6_Mastery.pdf",
        sections: [
            {
                title: "The Referral Engine",
                type: "text",
                content: "A sale isn't the end. It's the seed for 3 more. Ask for referrals at the 'Moment of Happiness'."
            },
            {
                title: "Verification",
                type: "text",
                content: "You are now ready. Take the Certification Exam to prove you can handle the toughest homeowners."
            }
        ]
    }
}
