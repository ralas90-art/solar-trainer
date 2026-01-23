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
    sections: {
        title: string;
        content: string; // Supports basic HTML/JSX
        type: 'text' | 'list' | 'quote' | 'comparison' | 'slides';
        items?: string[]; // For lists
        comparison?: { rookie: string; pro: string }; // For comparison type
        slides?: Slide[]; // For slides type
    }[];
}

export const MODULES: Record<string, ModuleContent> = {
    // MODULE 1
    "module_1_mindset": {
        id: "module_1_mindset",
        title: "The Solar Mindset",
        subtitle: "Module 1",
        sections: [
            {
                title: "Avatar Intro",
                type: "text",
                content: "Welcome to Module 1. Before we talk about watts or kilowatts, we need to talk about *you*. Success in solar isn't just about what you know; it's about who you are. We'll cover how to handle rejection not as a failure, but as a stepping stone."
            },
            {
                title: "The Foundation of Success",
                type: "list",
                content: "The Solar Professional's Creed:",
                items: [
                    "Integrity First: I will never sell a system that doesn't benefit the homeowner.",
                    "Service Mindset: I am here to serve, not to take.",
                    "Belief: I believe in the power of solar to change lives."
                ]
            },
            {
                title: "Reframing Rejection",
                type: "comparison",
                content: "Reframing is the key to resilience.",
                comparison: {
                    rookie: "They rejected me. I'm annoying them.",
                    pro: "They rejected the offer *for now*. I have a solution that can save them thousands."
                }
            },
            {
                title: "The Stairway to Success",
                type: "text",
                content: "Attitude -> Work Ethic -> Skill -> Results. Your attitude determines your altitude. Check your attitude before every door.",
                // image: "/images/module_1_mindset_infographic.png" (Not supported in text type yet, ideally add image support to text or use slide)
            },
            {
                title: "Visual Summary",
                type: "slides",
                content: "Key Concepts from Module 1",
                slides: [
                    {
                        title: "The Stairway to Success",
                        content: "It starts with Attitude. Without the right mindset, skills don't matter.",
                        image: "/images/module_1_mindset_infographic.png",
                        imagePlaceholder: "Mindset Staircase"
                    }
                ]
            }
        ]
    },

    // MODULE 2
    "module_2_connection": {
        id: "module_2_connection",
        title: "The Art of Connection",
        subtitle: "Module 2",
        sections: [
            {
                title: "Stop Selling",
                type: "text",
                content: "The moment you sound like a salesperson, you lose. We use NEPQ (Neuro-Emotional Persuasion Questioning). Be a 'Problem Finder', not a product pusher."
            },
            {
                title: "The Anti-Sales Approach",
                type: "comparison",
                content: "Drop the 'Sales Persona'.",
                comparison: {
                    rookie: "Hi! I'm with Solar Bros and we're saving neighbors money!",
                    pro: "Hi... I'm just looking for the homeowner? ... I wasn't sure if I had the right house..."
                }
            },
            {
                title: "The Bridge of Trust",
                type: "slides",
                content: "Building the Gap.",
                slides: [
                    {
                        title: "The Trust Bridge",
                        content: "Move them from Current State (Pain) to Objective State (Solution). The gap is the Problem.",
                        image: "/images/module_2_trust_bridge.png",
                        imagePlaceholder: "Trust Bridge Diagram"
                    }
                ]
            }
        ]
    },

    // MODULE 3
    "module_3_presentation": {
        id: "module_3_presentation",
        title: "The Perfect Presentation",
        subtitle: "Module 3",
        sections: [
            {
                title: "Education vs Selling",
                type: "text",
                content: "The modern homeowner wants to be educated. Explain the 'Bill Swap'. You aren't buying extra; you are swapping a rental payment (Utility) for a mortgage payment (Solar)."
            },
            {
                title: "Visualizing the Swap",
                type: "slides",
                content: "Use these visuals to explain the concept.",
                slides: [
                    {
                        title: "Old Way vs New Way",
                        content: "Utility payments last forever and go up. Solar payments correspond to a fixed asset and end.",
                        image: "/images/module_3_old_vs_new.png",
                        imagePlaceholder: "Old vs New Graph"
                    },
                    {
                        title: "The Value Stack",
                        content: "1. Fixed Cost. 2. Home Value (+4%). 3. Tax Incentives (30%). 4. Ownership.",
                        imagePlaceholder: "Value Stack"
                    }
                ]
            }
        ]
    },

    // MODULE 4
    "module_4_objections": {
        id: "module_4_objections",
        title: "Mastering Objections",
        subtitle: "Module 4",
        sections: [
            {
                title: "The Psychology of No",
                type: "text",
                content: "An objection is not a stop sign. It's a signpost saying 'Help me understand'. Do not fight it. Align with it."
            },
            {
                title: "The Porcupine Technique",
                type: "quote",
                content: "When they ask 'Does it have a battery?', you ask 'Are you concerned about power outages?' Answer with a question."
            },
            {
                title: "Objection Judo",
                type: "slides",
                content: "Turn the force of the objection into a close.",
                slides: [
                    {
                        title: "Objection Judo Flow",
                        content: "The Attack (Objection) -> The Pivot (Empathy) -> The Throw (Solution).",
                        image: "/images/module_4_objection_judo.png",
                        imagePlaceholder: "Judo Flow"
                    }
                ]
            }
        ]
    },

    // MODULE 5
    "module_5_closing": {
        id: "module_5_closing",
        title: "Closing with Confidence",
        subtitle: "Module 5",
        sections: [
            {
                title: "The Assumptive Close",
                type: "text",
                content: "Don't ask *if* they want to buy. Ask *how* or *when*. 'Looking at the calendar, is Tuesday or Wednesday better for the site survey?'"
            },
            {
                title: "The Decision Matrix",
                type: "slides",
                content: "The Ben Franklin Close.",
                slides: [
                    {
                        title: "The Decision Matrix",
                        content: "Option A (Utility): 100% Interest, Rising Rates. Option B (Solar): Equity, Fixed Rate, Asset.",
                        image: "/images/module_5_decision_matrix.png",
                        imagePlaceholder: "Decision Matrix"
                    }
                ]
            }
        ]
    },

    // MODULE 6
    "module_6_technical": {
        id: "module_6_technical",
        title: "Technical Mastery",
        subtitle: "Module 6",
        sections: [
            {
                title: "How Solar Works",
                type: "slides",
                content: "Explain it to a 5-year old.",
                slides: [
                    {
                        title: "How Solar Works",
                        content: "1. Sun hits panels (DC). 2. Inverter converts (AC). 3. Home uses it. 4. Grid stores the rest (Net Metering).",
                        image: "/images/module_6_how_solar_works.png",
                        imagePlaceholder: "Solar Diagram"
                    }
                ]
            },
            {
                title: "Inverters",
                type: "text",
                content: "String Inverters (Christmas Lights - one goes out, all go out) vs Micro-inverters (Independent, safer, better in shade). We generally prefer micros."
            }
        ]
    },

    // MODULE 7
    "module_7_math": {
        id: "module_7_math",
        title: "Mastering the Math",
        subtitle: "Module 7",
        sections: [
            {
                title: "The Money Roadmap",
                type: "slides",
                content: "Follow the money.",
                slides: [
                    {
                        title: "The Money Roadmap",
                        content: "Stop wasting money on rent (Red). Start investing in equity (Green).",
                        image: "/images/module_7_money_roadmap.png",
                        imagePlaceholder: "Money Flow"
                    }
                ]
            },
            {
                title: "ROI",
                type: "text",
                content: "If a system costs $30k and saves $3k/year, that is a 10% tax-free return. Safer than stocks, better than the bank."
            }
        ]
    },

    // MODULE 8
    "module_8_referrals": {
        id: "module_8_referrals",
        title: "The Referral Engine",
        subtitle: "Module 8",
        sections: [
            {
                title: "Farming not Hunting",
                type: "text",
                content: "Don't chase leads forever. Build a network. Ask for referrals at the 'Moment of Happiness' - Install Day or First Bill."
            },
            {
                title: "The Referral Tree",
                type: "slides",
                content: "One customer becomes three.",
                slides: [
                    {
                        title: "The Referral Tree",
                        content: "A happy customer branches into Neighbors, Family, and Co-workers. 1 sale = 3 more.",
                        image: "/images/module_8_referral_tree.png",
                        imagePlaceholder: "Tree Diagram"
                    }
                ]
            }
        ]
    },

    // MODULE 9
    "module_9_territory": {
        id: "module_9_territory",
        title: "Territory Management",
        subtitle: "Module 9",
        sections: [
            {
                title: "The Cloverleaf Strategy",
                type: "text",
                content: "Don't drive aimlessly. Pick an anchor (install) and circle it. Loop 1: Immediate neighbors. Loop 2: Next street."
            },
            {
                title: "The Perfect Day",
                type: "slides",
                content: "Structure your time.",
                slides: [
                    {
                        title: "The Perfect Day",
                        content: "AM: Personal Dev & Admin. 1PM: Prep. 3PM-7:30PM: SHOWTIME (Knocking).",
                        image: "/images/module_9_perfect_day.png",
                        imagePlaceholder: "Schedule Timeline"
                    }
                ]
            }
        ]
    },

    // MODULE 10
    "module_10_inhome": {
        id: "module_10_inhome",
        title: "In-Home Presentation",
        subtitle: "Module 10",
        sections: [
            {
                title: "The Power Seat",
                type: "slides",
                content: "Where you sit matters.",
                slides: [
                    {
                        title: "The Power Seat",
                        content: "Never sit across (Adversary). Sit next to or 90-degrees (Advisor).",
                        image: "/images/module_10_power_seat.png",
                        imagePlaceholder: "Table Diagram"
                    }
                ]
            },
            {
                title: "Showmanship",
                type: "text",
                content: "Make it physical. Have them hand you the bill. Put the roof design in their hands. Ownership begins with touch."
            }
        ]
    },

    // MODULE 11
    "module_11_virtual": {
        id: "module_11_virtual",
        title: "Virtual Sales Mastery",
        subtitle: "Module 11",
        sections: [
            {
                title: "The Zoom Setup",
                type: "slides",
                content: "Don't look like a hostage.",
                slides: [
                    {
                        title: "Pro Zoom Setup",
                        content: "Lighting (Front). Camera (Eye Level). Background (Clean). Energy (+20%).",
                        image: "/images/module_11_zoom_setup.png",
                        imagePlaceholder: "Zoom Desk Setup"
                    }
                ]
            },
            {
                title: "Digital Handshake",
                type: "text",
                content: "Wave at the start. Use the mouse as a laser pointer. Look at the camera lens, not the screen, to make eye contact."
            }
        ]
    }
}
