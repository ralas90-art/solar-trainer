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
}

export const MODULES: Record<string, ModuleContent> = {
    // DAY 1
    "day_1_foundation": {
        id: "day_1_foundation",
        title: "Day 1: The Foundation",
        subtitle: "Mindset, Physics & Operations",
        pdfDownloadUrl: "/downloads/Day_1_Foundation.pdf",
        quiz: {
            title: "Day 1 Certification Exam",
            questions: [
                {
                    id: "q1_role",
                    question: "What is the primary role of a Solar Professional?",
                    options: [
                        "To sell as many panels as possible",
                        "To be a Consultant who solves expensive problems",
                        "To convince people to buy something they don't need",
                        "To maximize the commission check"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Integrity First. You are a Consultant helping homeowners move from a liability to an asset."
                },
                {
                    id: "q1_rejection",
                    question: "In the context of reframing rejection, what does a 'No' actually mean?",
                    options: [
                        "The homeowner hates you",
                        "The product is bad",
                        "You haven't found their 'Why' yet / Request for Info",
                        "You should give up and go home"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "A 'No' is just a request for more information or a sign that trust hasn't been established."
                },
                {
                    id: "q1_net_metering",
                    question: "What is Net Metering best compared to?",
                    options: [
                        "A slot machine",
                        "Rollover minutes on a cell phone plan",
                        "A tax audit",
                        "A car lease"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Net Metering allows you to store excess power on the grid during the day and use it strictly at night."
                },
                {
                    id: "q1_physics_1",
                    question: "What type of privacy electricity do solar panels produce directly from the sun?",
                    options: [
                        "AC (Alternating Current)",
                        "DC (Direct Current)",
                        "Static Electricity",
                        "Magnetic Field"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Panels create DC power. The Inverter is needed to convert it to AC for the home."
                },
                {
                    id: "q1_physics_2",
                    question: "What is the function of the Inverter?",
                    options: [
                        "To clean the panels",
                        "To convert DC power into AC power",
                        "To store energy for the night",
                        "To measure the roof"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The inverter translates the raw DC power from the roof into the usable AC power for the outlets."
                },
                {
                    id: "q1_roof_1",
                    question: "Which roof direction (Azimuth) provides the highest production in the Northern Hemisphere?",
                    options: [
                        "North",
                        "East",
                        "South",
                        "West"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "South faces the sun directly for the longest portion of the day."
                },
                {
                    id: "q1_roof_2",
                    question: "Which of these roof materials is an automatic DISQUALIFICATION (No-Go)?",
                    options: [
                        "Composite Shingle",
                        "Concrete Tile",
                        "Metal Standing Seam",
                        "Wood Shake"
                    ],
                    correctAnswerIndex: 3,
                    explanation: "Wood Shake is a severe fire hazard and impossible to insure. We cannot install on it."
                },
                {
                    id: "q1_panel_1",
                    question: "Which electrical panel brand is a known fire hazard and requires an immediate upgrade (MPU)?",
                    options: [
                        "Square D",
                        "Siemens",
                        "Zinsco / Federal Pacific",
                        "Eaton"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Zinsco and Federal Pacific panels have breakers that fail to trip, causing fires. They must be replaced."
                },
                {
                    id: "q1_ops_1",
                    question: "What happens immediately after the homeowner signs the contract (Phase 2)?",
                    options: [
                        "Installation happens the next day",
                        "The Site Survey",
                        "Permission to Operate",
                        "The Sales Rep gets paid in full"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "After signing, a Site Surveyor must measure the roof and inspect the electrical to finalize the engineering."
                },
                {
                    id: "q1_ops_2",
                    question: "Who approves the blueprints before installation can begin?",
                    options: [
                        "The HOA only",
                        "The City/County (AHJ) via Permitting",
                        "The Neighbor",
                        "The Sales Manager"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The Authority Having Jurisdiction (AHJ) must stamp the plans (Permit) before we legally build."
                },
                {
                    id: "q1_ops_3",
                    question: "Can the homeowner support their home with solar immediately after installation?",
                    options: [
                        "Yes, flip the switch!",
                        "No, they must wait for Permission to Operate (PTO)",
                        "Only if they have a battery",
                        "Only on weekends"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The system is physically on the roof but legally must remain off until the Utility grants PTO (Permission to Operate)."
                },
                {
                    id: "q1_attitude",
                    question: "Where should you check your attitude before knocking a door?",
                    options: [
                        "At the door",
                        "In the car (Check-up from the neck up)",
                        "After the first rejection",
                        "Never"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Your mental state is determined before you step onto the turf."
                },
                {
                    id: "q1_tou",
                    question: "What does 'TOU' stand for?",
                    options: [
                        "Time of Use",
                        "Terms of Understanding",
                        "Total Output Usage",
                        "Tax on Utility"
                    ],
                    correctAnswerIndex: 0,
                    explanation: "Time of Use rates make power more expensive during peak evening hours (4pm-9pm)."
                },
                {
                    id: "q1_bill",
                    question: "What is a 'Demand Charge'?",
                    options: [
                        "A fee strictly for solar users",
                        "A penalty for high peak usage (speed/kW) regardless of total duration",
                        "The cost of the meter",
                        "A late payment fee"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Demand charges bill you for the highest 'speed' of power you pulled at once, not just the total amount."
                },
                {
                    id: "q1_integrity",
                    question: "What is the first rule of the Solar Professional's Creed?",
                    options: [
                        "Always be Closing",
                        "Integrity First",
                        "Profit First",
                        "Assume the Sale"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "I will never sell a system that doesn't benefit the homeowner."
                },
                {
                    id: "q1_learning",
                    question: "Which stage of competence is known as 'The Dip of Despair'?",
                    options: [
                        "Unconscious Incompetence",
                        "Conscious Incompetence",
                        "Conscious Competence",
                        "Unconscious Competence"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Conscious Incompetence is when you realize how much you don't know. It is painful but necessary for growth."
                },
                {
                    id: "q1_inverter",
                    question: "Why do we prefer Microinverters over String Inverters?",
                    options: [
                        "They are cheaper",
                        "They look better",
                        "They eliminate the single point of failure (Christmas Light Effect)",
                        "They use more wire"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Microinverters allow each panel to operate independently, so shade or failure on one does not kill the system."
                },
                {
                    id: "q1_units",
                    question: "What is the difference between kW and kWh?",
                    options: [
                        "They are the same",
                        "kW is the Rate (Speed), kWh is the Amount (Volume)",
                        "kW is for gas, kWh is for solar",
                        "kWh is for batteries only"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "kW is the 'Horsepower' (Speed), kWh is the 'Gallons' (Volume/Usage). You pay for kWh."
                }
            ]
        },
        sections: [
            {
                title: "Mission Briefing: Building the Solar Professional",
                type: "text",
                content: "MISSION OBJECTIVE: Transform from a 'Salesperson' into a 'Consultant'.\n\nBy the end of Day 1, you will understand the physics of solar, the psychology of a top performer, and exactly how to qualify a home. This is the foundation of your career."
            },
            {
                title: "The Learning Curve: The 4 Stages of Competence",
                type: "list",
                content: "Learning solar is a journey. You will pass through 4 distinct stages. Recognizing where you are helps you avoid quitting during the 'Dip'.",
                items: [
                    "1. Unconscious Incompetence (Ignorance is Bliss): You don't know what you don't know. You are excited but dangerous.",
                    "2. Conscious Incompetence (The Dip of Despair): You realize how much you don't know. This is where most people quit. PUSH THROUGH.",
                    "3. Conscious Competence (The Grind): You can do it, but it takes extreme focus and effort. You are mechanical.",
                    "4. Unconscious Competence (Flow State): You can do it in your sleep. You are a master."
                ]
            },
            {
                title: "Visual Guide: The Curve",
                type: "image",
                content: "Recognize where you are to avoid the 'Dip'.",
                imageSrc: "/images/competence_stages.png"
            },
            {
                title: "Deep Dive: The History of the Grid",
                type: "text",
                content: "To sell the future, you must understand the past. The grid we use today was designed over 100 years ago.\n\n**The War of Currents:** In the late 1880s, Thomas Edison (DC) and Nikola Tesla (AC) fought for dominance. Tesla won because AC power travels better over long distances. This created the 'Centralized Utility Model': massive power plants burning coal far away, sending power over hundreds of miles of wire to your home.\n\n**The Problem:** This model is inefficient (power loss over wires), fragile (fires, outages), and expensive (monopoly control). Solar represents the shift to 'Decentralized Power'—generating energy right where it is used. You are not just selling panels; you are upgrading the country's infrastructure.\n\n**Why DC Matters:** Solar panels produce DC power (just like your phone/laptop). The grid is AC. Your inverter is the bridge between the future (DC) and the past (AC)."
            },
            {
                title: "Visual Guide: The War of Currents",
                type: "image",
                content: "Centralized vs Decentralized Power. The shift is inevitable.",
                imageSrc: "/images/grid_history_war.png"
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
                title: "The Solar Professional's Creed",
                type: "list",
                content: "Commit to these three principles before you ever knock a door:",
                items: [
                    "1. Integrity First: I will never sell a system that doesn't benefit the homeowner.",
                    "2. Service Mindset: I am here to serve, not to take. Commission is a byproduct of value.",
                    "3. Belief: I believe in the power of solar to change lives. My conviction is contagious."
                ]
            },
            {
                title: "How Solar Works: The Physics of Savings",
                type: "slides",
                content: "You don't need to be an engineer, but you must be an expert. Here is the simple, 4-step process of how energy flows from the sun to the savings account.",
                slides: [
                    {
                        title: "PV Basics: The Energy Journey",
                        content: "1. Generation: Sunlight (Photons) hits the silicon cells, creating Direct Current (DC) electricity.\n2. Conversion: The Inverter converts this raw DC power into usable Alternating Current (AC) for the home.\n3. Consumption: The home uses this solar power first, before pulling from the expensive grid.\n4. Net Metering: Think of it like 'Rollover Minutes'. Excess power rolls over to cover you at night.",
                        image: "/images/module_6_how_solar_works.png",
                        imagePlaceholder: "Solar Diagram"
                    }
                ]
            },
            {
                title: "Inverters 101: String vs Micro",
                type: "comparison",
                content: "The Inverter is the heart of the system. We use Microinverters. Here is why:",
                comparison: {
                    rookie: "String Inverter (Old Tech): Like Christmas lights. If one panel is shaded, the whole string goes down. Single point of failure.",
                    pro: "Microinverters (Our Tech): Each panel operates independently. Shade on one panel does not affect the others. Safer, more reliable, 25-year warranty."
                }
            },
            {
                title: "Visual Guide: String vs Micro",
                type: "image",
                content: "Why Microinverters win every time. Check the difference.",
                imageSrc: "/images/inverter_comparison.png"
            },
            {
                title: "Decoding the Bill: kW vs kWh",
                type: "list",
                content: "You must speak the language of the utility bill to sell savings.",
                items: [
                    "kWh (Kilowatt-hour): The 'Gallons' of gas. The amount of energy used over time. This is what you pay for.",
                    "kW (Kilowatt): The 'Horsepower' of the engine. The rate of energy usage at a specific moment.",
                    "Tier 1 (Baseline Usage): The cheapest power you buy.",
                    "Tier 2+ (The Penalty Zone): Expensive power charged for high usage. Solar eliminates this first."
                ]
            },
            {
                title: "Visual Guide: kW vs kWh",
                type: "image",
                content: "Speed vs Volume. Understand the difference.",
                imageSrc: "/images/kw_vs_kwh_analogy.png"
            },
            {
                title: "Deep Dive: Roof Anatomy 101",
                type: "list",
                content: "You are putting a 40-year asset on their roof. You need to know if it will hold. Memorize these terms:",
                items: [
                    "Rafters: The internal wooden skeleton (usually 2x4 or 2x6). We bolt into these to secure the system. Hitting the center of the rafter is critical.",
                    "Flashing: The metal sheets used to waterproof penetrations. The #1 cause of leaks is bad flashing. We slide it *under* the shingle.",
                    "Azimuth: The compass direction the roof faces. 180° (South) is Gold. 270° (West) is Silver (catches expensive evening usage). North is usually dead.",
                    "Pitch: The steepness. 10-20° is easy walk. 30°+ requires ropes. 45° is a ski slope.",
                    "Comp Shingle: Standard install. Easy.",
                    "Concrete Tile: Requires 'Tile Replacements' or 'Hooks'. Never drill through the tile itself (it cracks)."
                ]
            },
            {
                title: "Visual Guide: Roof Anatomy",
                type: "image",
                content: "Know your rafters from your flashing.",
                imageSrc: "/images/roof_anatomy_diagram.png"
            },
            {
                title: "Qualifying Homes: The 'No-Go' List",
                type: "list",
                content: "Not every home qualifies. Memorize these disqualifiers to save time:",
                items: [
                    "ROOF: Wood Shake (Fire Hazard), North-Facing (No Sun), or Poor Condition (Sagging).",
                    "ELECTRICAL: Zinsco or Federal Pacific panels (Fire Hazard - Require MPU).",
                    "BILL: Bills under $50/mo usually don't save money with solar."
                ]
            },
            {
                title: "Visual Guide: Disqualified Roofs",
                type: "image",
                content: "Do not knock these homes. It is a waste of time.",
                imageSrc: "/images/bad_roof_examples.png"
            },
            {
                title: "War Story: The $50k Denied Deal",
                type: "quote",
                content: "\"I once signed a 15kW system. $10,000 commission. I spent 3 hours building rapport, pet the dog, ate dinner with them. I submitted the deal, counted my money, and went home to celebrate. \n\nTwo days later, Site Survey failed it. Why? The rafters were rotted due to termite damage I didn't check. And I missed the 100 Amp Main Panel that needed a $3,500 upgrade neither of us accounted for. \n\nThe deal died. I wasted 20 hours and lost $0. \n\nLesson: Trust but Verify. Poke the roof (with your eyes). Inspect the electrical. Don't sell a dream that physics can't deliver.\""
            },
            {
                title: "The Solar Project Lifecycle (A to Z)",
                type: "image",
                content: "The roadmap from Signature to Savings. Click to expand.",
                imageSrc: "/images/solar_project_roadmap.png"
            },
            {
                title: "Deep Dive: Project Lifecycle Steps",
                type: "text",
                content: "Selling the deal is just Day 0. You are managing a construction project. Here is the roadmap:\n\n1. The Sale: Agreement signed, soft credit check passing.\n2. Site Survey: Tech comes to measure roof and inspect wiring.\n3. Engineering & Permitting: Plans are drawn and sent to the City (AHJ).\n4. Installation: Panels go on the roof (1-2 days).\n5. Inspection: City verifies safety.\n6. PTO (Permission to Operate): Utility gives the green light to turn it on.\n\nWARNING: The system sits 'off' between Install and PTO. Manage your customer's expectations!"
            },
            {
                title: "Simulation: The Skeptical Engineer",
                type: "simulation",
                content: "Test your new technical knowledge. This homeowner wants to know about degradation and efficiency. Use your knowledge of specs.",
                scenarioId: "eng_1",
                openingLine: "I've analyzed the degradation rates of Tier 1 vs Tier 2 panels. Why should I trust your efficiency numbers?"
            },
            {
                title: "Next Mission Briefing",
                type: "text",
                content: "BRIDGE TO DAY 2: Now that you have the Mindset, the Physics, and the Roadmap, you have the vehicle. But a vehicle is useless without a road. Tomorrow, in Day 2, we will teach you 'The Hunt'—how to find qualified homeowners who desperately need what you have. Rest up. The hunt begins at dawn."
            }
        ]
    },

    // DAY 2
    "day_2_prospecting": {
        id: "day_2_prospecting",
        title: "Day 2: Prospecting",
        subtitle: "The Hunt & Territory Management",
        pdfDownloadUrl: "/downloads/Day_2_Prospecting.pdf",
        quiz: {
            title: "Day 2 Certification Exam",
            questions: [
                {
                    id: "q2_goal",
                    question: "What is the primary objective of Prospecting?",
                    options: [
                        "To close the deal on the porch",
                        "To find qualified homeowners and buy Face Time",
                        "To hand out as many flyers as possible",
                        "To get into an argument about politics"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "You are not there to sell solar on the doorstep. You are there to sell the APPOINTMENT (Face Time)."
                },
                {
                    id: "q2_cloverleaf_1",
                    question: "What is the 'Cloverleaf Strategy'?",
                    options: [
                        "A good luck charm",
                        "Knocking random doors all over the city",
                        "Working in tight loops around a center point (Installation/Sale)",
                        "Driving to the wealthy neighborhoods only"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "The Cloverleaf strategy builds a web of influence around a specific anchor point, minimizing travel time."
                },
                {
                    id: "q2_cloverleaf_2",
                    question: "Why do we knock the neighbors of a current install?",
                    options: [
                        "To complain about the noise",
                        "To use 'Social Proof' (e.g., 'The Smiths just went solar')",
                        "To borrow sugar",
                        "To ask for directions"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Name-dropping a neighbor (Social Proof) is the most powerful trust signal you can use."
                },
                {
                    id: "q2_schedule_1",
                    question: "According to the 'Perfect Day' schedule, what are the 'Golden Hours' for knocking?",
                    options: [
                        "9:00 AM - 11:00 AM",
                        "12:00 PM - 2:00 PM",
                        "3:00 PM - 7:30 PM",
                        "9:00 PM - Midnight"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "3:00 PM to 7:30 PM is when people are actually home from work. This is 'Money Time'."
                },
                {
                    id: "q2_schedule_2",
                    question: "What should you be doing between 11:00 AM and 1:00 PM?",
                    options: [
                        "Knocking doors",
                        "Sleeping",
                        "Admin, Follow-ups, and Territory Scouting",
                        "Playing video games"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Don't knock when nobody is home. Use mid-day for admin and scouting."
                },
                {
                    id: "q2_body_1",
                    question: "How far back should you stand from the door after ringing the bell?",
                    options: [
                        "1 foot (Toe to door)",
                        "6 feet (The Trust Zone)",
                        "On the sidewalk",
                        "Hide in the bushes"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Standing back 6 feet relieves pressure and shows respect for their personal space."
                },
                {
                    id: "q2_body_2",
                    question: "Where should you look when the homeowner opens the door?",
                    options: [
                        "Directly in their eyes (Stare them down)",
                        "At your phone",
                        "Break eye contact occasionally to look at the house/roof",
                        "At your shoes"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Constant eye contact is aggressive. Breaking it to look at the 'problem' (the house) lowers pressure."
                },
                {
                    id: "q2_tone_1",
                    question: "For Phone/Virtual sales, how much more energy do you need compared to in-person?",
                    options: [
                        "Same amount",
                        "Less (be calm)",
                        "20% more (Audio flattens emotion)",
                        "100% more (Yell)"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Phone audio cuts the high and low frequencies of your voice. You must overcompensate by 20% to sound normal."
                },
                {
                    id: "q2_tech_1",
                    question: "What is the '3-Second Rule' on a cold call?",
                    options: [
                        "Hang up after 3 seconds",
                        "You have 3 seconds to sound irrelevant or interesting",
                        "Wait 3 seconds before speaking",
                        "Count to 3 before breathing"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "People decide instantly if you are a spam caller. You must hook them immediately."
                },
                {
                    id: "q2_digital_1",
                    question: "What is 'Digital Door Knocking'?",
                    options: [
                        "Knocking on the computer screen",
                        "Using Nextdoor/FB to target the neighborhood you are working in",
                        "Sending spam emails",
                        "Playing solar video games"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Digital Door Knocking extends your presence into the neighborhood's online groups."
                },
                {
                    id: "q2_opener_1",
                    question: "Why do we use the 'Anti-Sales' approach (confused neighbor)?",
                    options: [
                        "To trick them",
                        "To lower the 'Salesman Alarm' / Resistance",
                        "Because we are actually lost",
                        "Because it's funny"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The moment you sound like a polished salesperson, their wall goes up. Seeming 'confused' keeps the wall down."
                },
                {
                    id: "q2_opener_2",
                    question: "Which constitutes a 'Rookie' opening line?",
                    options: [
                        "Hi... sorry to bother you...",
                        "I was just looking for the homeowner...",
                        "HI! I'M WITH SOLAR BROS SAVING YOU MONEY!",
                        "I wasn't sure if I had the right house..."
                    ],
                    correctAnswerIndex: 2,
                    explanation: "High-pitch, fast-talking excitement triggers the 'Stranger Danger' reflex."
                },
                {
                    id: "q2_mindset",
                    question: "If you get a 'No', what should you do before leaving the neighborhood?",
                    options: [
                        "Drive home crying",
                        "Knock the neighbors to the left and right (Cloverleaf)",
                        "Eat lunch",
                        "Call your mom"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "One 'No' does not condemn the neighborhood. The neighbor might be your 'Yes'."
                },
                {
                    id: "q2_resource",
                    question: "What is the most valuable resource a canvasser has?",
                    options: [
                        "Flyers",
                        "Face Time (Time in front of people)",
                        "Gas money",
                        "Business cards"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Everything you do (Territory management, scheduling) is designed to maximize Face Time."
                },
                {
                    id: "q2_weather",
                    question: "What should you do when it rains?",
                    options: [
                        "Go home",
                        "Digital Door Knock (Social Media/Admin)",
                        "Sit in the car and wait",
                        "Knock anyway without an umbrella"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The work doesn't stop. Shift to digital channels or phone/admin work."
                }
            ]
        },
        sections: [
            {
                title: "Recap: The Foundation",
                type: "text",
                content: "PREVIOUSLY: In Day 1, you built the 'Solar Mindset'—learning that rejection is just data. You also learned to identify a 'Solar House' (Roof, Sun, Panel). Now, we take that knowledge to the streets."
            },
            {
                title: "Mission Briefing: The Art of the Hunt",
                type: "text",
                content: "MISSION OBJECTIVE: Master the science of finding qualified homeowners.\n\nAVATAR: \"You can have the best script in the world, but if you're knocking the wrong doors at the wrong time, you're going to fail. We're going to talk Territory Management. I'll teach you the 'Cloverleaf' pattern so you never waste gas driving back and forth. Let's maximize your efficiency.\""
            },
            {
                title: "Territory Management: The Cloverleaf Strategy",
                type: "text",
                content: "Amateurs knock randomly. Professionals manage their territory like a business. The goal is to minimize drive time and maximize face time. We use the 'Cloverleaf Pattern' to create a web of influence around every positive interaction.\n\n• Loop 1: Immediate Neighbors (\"I'm helping Mrs. Jones next door...\")\n• Loop 2: Across the street.\n• Loop 3: The next block over.\n\nResult: You build a fortress of social proof in one area."
            },
            {
                title: "Visual Guide: The Cloverleaf Map",
                type: "image",
                content: "Visualizing the perfect striking pattern.",
                imageSrc: "/images/cloverleaf_strategy.png"
            },
            {
                title: "Deep Dive: Door Hangers (The Breadcrumb Strategy)",
                type: "text",
                content: "Never leave a door un-knocked, but if they aren't home, leave a 'Breadcrumb'.\n\n**The Rule:** Do NOT use a generic company flyer. It looks like trash.\n**The Strategy:** Use a handwritten sticky note or a specialized door hanger that looks like a 'Delivery Notice' or 'Utility Note'.\n\n**Script on Note:**\n'Hi [Name if known], stopped by about the neighbor's project. Sorry I missed you. - [Your Name]'\n\nCuriosity gets them to call you back. Marketing does not."
            },
            {
                title: "The Perfect Day Schedule",
                type: "slides",
                content: "Discipline creates freedom. If you don't control your schedule, your feelings will. Here is the schedule of a Top 1% Performer.",
                slides: [
                    {
                        title: "The Daily Schedule",
                        content: "9:00 AM - 11:00 AM: Personal Development (Gym, Mindset).\n11:00 AM - 1:00 PM: Admin & Scout (Don't knock empty houses).\n1:00 PM - 3:00 PM: Prep & Lunch.\n3:00 PM - 7:30 PM: THE GOLDEN HOURS. Everyone is home. Knock non-stop.",
                        image: "/images/perfect_day_schedule.png",
                        imagePlaceholder: "Schedule"
                    }
                ]
            },
            {
                title: "Track 1: Door-to-Door Mastery (The Ground Game)",
                type: "list",
                content: "Physical presence is your superpower involved in D2D. Use the environment.",
                items: [
                    "Body Language: Stand back 6 feet (The Trust Zone).",
                    "Eye Contact: Break it occasionally to look at the house (lowers pressure).",
                    "Props: Point at the meter or the roof (Visual Anchoring)."
                ]
            },
            {
                title: "Visual Guide: D2D Mastery",
                type: "image",
                content: "Positioning is everything. See the breakdown.",
                imageSrc: "/images/d2d_mastery_tips.png"
            },
            {
                title: "Deep Dive: Body Language Library",
                type: "list",
                content: "90% of communication is non-verbal. Master these micro-signals to read the homeowner before they speak:",
                items: [
                    "The Lean Away: If they lean back when you speak, you are too close or too aggressive. Step back.",
                    "The Arms Crossed: Defensive. Hand them something (a flyer, your iPad) to force them to 'open' their posture.",
                    "The Feet Pointing: If their feet are pointed at the door/street, they want to leave. You have 10 seconds to hook them.",
                    "The Head Tilt: If they tilt their head, they are curious/confused. This is good. Stop talking and let them ask a question.",
                    "The Eye Block (Rubbing Eyes): They do not like what they are seeing. You showed a high price or bad news. Pivot immediately."
                ]
            },
            {
                title: "Visual Guide: Body Language Cheat Sheet",
                type: "image",
                content: "Decode the signals instantly.",
                imageSrc: "/images/body_language_guide.png"
            },
            {
                title: "Deep Dive: The Anatomy of a Perfect Pitch",
                type: "image",
                content: "Master the psychology of the pitch using the 4-step framework. Click to expand.",
                imageSrc: "/images/perfect_pitch.png"
            },
            {
                title: "Toolbox: The 'Door Hanger' Strategy",
                type: "text",
                content: "Never leave a door un-knocked, but if they aren't home, leave a 'Breadcrumb'.\n\n**The Rule:** Do NOT use a generic company flyer. It looks like trash.\n**The Strategy:** Use a handwritten sticky note or a specialized door hanger that looks like a 'Delivery Notice' or 'Utility Note'.\n\n**Script on Note:**\n'Hi [Name if known], stopped by about the neighbor's project. Sorry I missed you. - [Your Name]'\n\nCuriosity gets them to call you back. Marketing does not."
            },
            {
                title: "Track 2: Virtual & Phone Pros (The Air Game)",
                type: "list",
                content: "Without physical offer, your Voice and Tech setup must be flawless.",
                items: [
                    "Tone: You must have 20% more energy than in person (Audio flattens emotion).",
                    "The 3-Second Rule: You have 3 seconds to sound irrelevant or interesting.",
                    "Tech: Hardwired internet only. No lagging video."
                ]
            },
            {
                title: "Script Vault: 5 Cold Call Hooks",
                type: "list",
                content: "On the phone, you must hook them instantly. Here are 5 variations:",
                items: [
                    "1. The Pattern Interrupt: 'Hi John? ... [Pause] ... This is Mike, I'm sure you hate cold calls, so I'll be brief. Hang up on me if you want, but...'",
                    "2. The Neighbor Drop: 'Hey, I'm working with the Smiths down the street on their NEM 3.0 transition...'",
                    "3. The Mystery: 'I was just looking at the aerial view of your roof online, are those tree branches still shading the west side?' (Specifics build trust).",
                    "4. The Utility Hook: 'Did you see the rate hike notice in your bill this month, or is it set to paperless?'",
                    "5. The Wrong Number: 'Is this the owner of [Address]? Oh good, I thought I had the wrong number...'"
                ]
            },
            {
                title: "Digital Door Knocking",
                type: "list",
                content: "When it rains or gets dark, the work doesn't stop. Dominate the neighborhood digitally.",
                items: [
                    "Nextdoor/FB Groups: \"Hey neighbors, I'm the guy who helped the Smiths on Elm St go solar...\"",
                    "Geofencing: Target ads to the specific street you are canvassing.",
                    "Goal: Become the 'Mayor' of your assigned territory."
                ]
            },
            {
                title: "Dropping the Persona: The Anti-Sales Approach",
                type: "comparison",
                content: "Homeowners have 'Salesman Alarms' installed in their brains. If you sound like a salesperson, you trigger the alarm and the door closes. We need to lower resistance by sounding like a confused, helpful neighbor. This is the 'Anti-Sales' approach.",
                comparison: {
                    rookie: "Hi! I'm with Solar Bros! We are saving money in the area! Do you want to buy panels?",
                    pro: "Hi... sorry to bother you. I'm just looking for the homeowner? ... Oh, that's you? Okay, I wasn't sure if I had the right house... I was just stopping by because..."
                }
            },
            {
                title: "Simulation: Not Interested",
                type: "simulation",
                content: "They shut you down immediately. Practice the 'Pattern Interrupt' to keep the conversation alive.",
                scenarioId: "not_interested",
                openingLine: "We're not interested, thanks. (Starts closing door)"
            },
            {
                title: "Simulation: I'm Busy",
                type: "simulation",
                content: "They are rushing out the door. Don't pitch. Pivot to a scheduled time (The 'Go-Back').",
                scenarioId: "busy_objection",
                openingLine: "I'm literally walking out the door to pick up my kids. I can't talk."
            },
            {
                title: "Bridge to Day 3: Connection",
                type: "text",
                content: "Getting them to open the door is Step 1. Keeping them at the door (or on the phone) requires deep psychology. Tomorrow, in Day 3, we will break down the 'Art of Connection', teaching you how to build a bridge of trust in under 30 seconds."
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
        quiz: {
            title: "Day 3 Certification Exam",
            questions: [
                {
                    id: "q3_goal",
                    question: "What is the primary mission of Day 3?",
                    options: [
                        "To pitch the product immediately",
                        "To become a 'Trusted Advisor' through connection",
                        "To show them the price",
                        "To inspect the roof"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "People hate being sold but love to buy. You must connect before you correct."
                },
                {
                    id: "q3_bolt_bull",
                    question: "A prospect interrupts you and asks 'How much is this going to cost?'. Which Personality Type are they?",
                    options: [
                        "Owl (Analytical)",
                        "Lamb (Amiable)",
                        "Bull (Driver)",
                        "Tiger (Expressive)"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "The Bull is direct, impatient, and cares about the bottom line. Get to the point."
                },
                {
                    id: "q3_bolt_owl",
                    question: "A prospect asks for a spec sheet on the panel degradation rates. Which Personality Type are they?",
                    options: [
                        "Owl (Analytical)",
                        "Lamb (Amiable)",
                        "Bull (Driver)",
                        "Tiger (Expressive)"
                    ],
                    correctAnswerIndex: 0,
                    explanation: "The Owl loves data, details, and spreadsheets. Give them the evidence."
                },
                {
                    id: "q3_bolt_lamb",
                    question: "A prospect offers you water and asks 'What do the neighbors think?'. Which Personality Type are they?",
                    options: [
                        "Owl (Analytical)",
                        "Lamb (Amiable)",
                        "Bull (Driver)",
                        "Tiger (Expressive)"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The Lamb is relationship-focused and dislikes conflict. They care about social proof and safety."
                },
                {
                    id: "q3_bolt_tiger",
                    question: "A prospect asks 'Will these black panels look cool on my roof?'. Which Personality Type are they?",
                    options: [
                        "Owl (Analytical)",
                        "Lamb (Amiable)",
                        "Bull (Driver)",
                        "Tiger (Expressive)"
                    ],
                    correctAnswerIndex: 3,
                    explanation: "The Tiger cares about status, appearance, and being unique. Focus on the aesthetics."
                },
                {
                    id: "q3_q_open",
                    question: "What is the purpose of an Open-Ended Question?",
                    options: [
                        "To get a 'Yes' or 'No' answer",
                        "To get the prospect talking and uncover their 'Why'",
                        "To confirm a sale",
                        "To close the deal"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Open-ended questions (Who, What, Where, When, Why, How) obtain information and feelings."
                },
                {
                    id: "q3_q_tiedown",
                    question: "Which of the following is a 'Tie-Down'?",
                    options: [
                        "Do you want solar?",
                        "How much is your bill?",
                        "Saving money makes sense, doesn't it?",
                        "What is your name?"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "A Tie-Down is a micro-commitment question placed at the end of a statement to build agreement."
                },
                {
                    id: "q3_seat",
                    question: "Where is the 'Power Seat' at the kitchen table?",
                    options: [
                        "Across from the homeowner (Adversarial)",
                        "Standing up",
                        "Next to the homeowner (Collaborative)",
                        "In the living room"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Sitting next to them allows you to look at the iPad together, framing the interaction as 'Us vs The Problem'."
                },
                {
                    id: "q3_labeling",
                    question: "What is 'Labeling' in negotiation?",
                    options: [
                        "Calling the customer names",
                        "Stating an observation about their emotion (e.g., 'It seems like you are hesitating')",
                        "Writing your name on the contract",
                        "Classifying the lead as 'Hot' or 'Cold'"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Labeling validates the prospect's emotions without judging them, lowering resistance."
                },
                {
                    id: "q3_mirror",
                    question: "What is the 'Mirroring' technique?",
                    options: [
                        "Copying their body language exactly",
                        "Repeating the last 3 words they said as a question",
                        "Wearing the same clothes as them",
                        "Looking in a mirror before the pitch"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Repeating their last words ('...moving soon?') invites them to elaborate without you asking a direct question."
                },
                {
                    id: "q3_vocab_1",
                    question: "Which word should you AVOID because it triggers 'Sales Resistance'?",
                    options: [
                        "Agreement",
                        "Contract",
                        "Paperwork",
                        "Form"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The word 'Contract' sounds binding and scary. Use 'Agreement' or 'Paperwork' instead."
                },
                {
                    id: "q3_vocab_2",
                    question: "Instead of 'Cost' or 'Price', what word should you use?",
                    options: [
                        "Expense",
                        "Investment / Total Amount",
                        "Bill",
                        "Debt"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Solar is an asset, not a cost. Framing it as an 'Investment' shifts the mindset."
                },
                {
                    id: "q3_3sec_rule",
                    question: "In the 'Anti-Sales' approach, what is the goal of the first 30 seconds?",
                    options: [
                        "To pitch the company history",
                        "To lower resistance by NOT sounding like a salesperson",
                        "To show them the savings",
                        "To ask for the bill"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "You must dismantle the 'Salesman Alarm' before you can discuss business."
                },
                {
                    id: "q3_listening",
                    question: "What is the ratio of Listening to Talking you should aim for in Discovery?",
                    options: [
                        "50/50",
                        "80% Talking / 20% Listening",
                        "80% Listening / 20% Talking",
                        "100% Talking"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "You have two ears and one mouth. Use them in that proportion."
                },
                {
                    id: "q3_bridge",
                    question: "The 'Bridge of Trust' connects which two states?",
                    options: [
                        "Day and Night",
                        "Current State (Problem) to Objective State (Solution)",
                        "Renting to Owning",
                        "Solar to Wind"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Discovery builds a bridge from their current pain (High Bills) to their desired future (Savings/Freedom)."
                }
            ]
        },
        sections: [
            {
                title: "Mission Briefing: The Psychology of Trust",
                type: "text",
                content: "MISSION OBJECTIVE: In Day 3, we stop being 'Salespeople' and start being 'Trusted Advisors'.\n\nAVATAR: \"Stop selling. Seriously. The moment you sound like a salesperson, you lose. In Module 2, we're going to learn the 'Art of Connection'. You're going to learn how to be a 'Problem Finder', not a product pusher. Let's learn how to build that bridge of trust.\""
            },
            {
                title: "Recap: The Hunt",
                type: "text",
                content: "PREVIOUSLY: In Day 2, you learned how to find the customer. You mastered the door approach and the 'Cloverleaf' strategy. Now that you are sitting at the kitchen table (or on the Zoom call), the real game begins."
            },
            {
                title: "In-Home Mastery",
                type: "text",
                content: "The Kitchen Table is your stage. Sit in the 'Power Seat' (next to them), not across (adversary)."
            },
            {
                title: "Visual Guide: The Power Seat",
                type: "image",
                content: "Don't sit across. Sit next to. It changes the psychology.",
                imageSrc: "/images/power_seat_positioning.png"
            },
            {
                title: "Remote Connection (Phone & Video)",
                type: "comparison",
                content: "Rules for the 'Air Game' (Virtual & Phone Sales). Connection is harder without physical presence.",
                comparison: {
                    rookie: "Treating it like a face-to-face chat (Low energy, looking at screen).",
                    pro: "20% more vocal energy (Phone) & looking at the CAMERA lens (Video). Lighting in front, not behind."
                }
            },
            {
                title: "Personality Types (BOLT System)",
                type: "image",
                content: "You must mirror the prospect. We categorize them into 4 types. Click to zoom.",
                imageSrc: "/images/personality_types_bolt.png"
            },
            {
                title: "Deep Dive: The BOLT Profile Library",
                type: "list",
                content: "To build trust, you must speak their language. Identify their type in the first 30 seconds:",
                items: [
                    "🐂 BULL (Driver): Direct, impatient, results-oriented. DO: Be brief, focus on ROI, give bottom-line numbers. DON'T: Small talk, waffle, or be late.",
                    "🦉 OWL (Analytical): Logical, detail-oriented, skeptical. DO: Show the specs, use spreadsheets, provide evidence. DON'T: Rush them or use hype/emotion.",
                    "🐑 LAMB (Amiable): Relational, conflict-averse, slow-paced. DO: Build rapport, mention neighbors (social proof), emphasize safety. DON'T: Push hard or create conflict.",
                    "🐅 TIGER (Expressive): Energetic, status-conscious, impulsive. DO: Be excited, focus on aesthetics ('Curb Appeal'), make them feel special. DON'T: Bore them with technical spreadsheets."
                ]
            },
            {
                title: "Deep Dive: FBI Negotiation Tactics",
                type: "text",
                content: "We borrow heavily from Chris Voss (FBI Hostage Negotiator). The goal is 'Tactical Empathy'.\n\n**The Late-Night FM DJ Voice:** Lower your pitch. Speak slower. This calms the reptilian brain.\n**Mirroring:** Repeat the last 3 words they said as a question. \n*Homeowner:* 'We're too busy.'\n*You:* 'Too busy?'\n*Homeowner:* 'Yeah, we're renovating the kitchen.'\n\n**Result:** They reveal the truth without you interrogating them."
            },
            {
                title: "Toolbox: The 'Columbo' Method",
                type: "comparison",
                content: "The smartest person in the room is usually the one playing dumb.",
                comparison: {
                    rookie: "Acts like the expert. Corrects the homeowner. 'Actually, that's wrong...'",
                    pro: "Acts confused to elicit information. 'I'm sorry, I might be missing something... help me understand why you'd want to keep renting power from the utility?'"
                }
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
                title: "Simulation: The Price Shopper",
                type: "simulation",
                content: "They demand a price before you've built value. Deflect and return to qualifying.",
                scenarioId: "price_shopper",
                openingLine: "Look, just give me the price using the cheapest panels you have. I don't need a presentation."
            },
            {
                title: "Sales Vocabulary: Words Matter",
                type: "comparison",
                content: "One wrong word can kill trust.",
                comparison: {
                    rookie: "Contract, Sign here, Cost, Pitch, Deal, Down Payment",
                    pro: "Agreement, Authorize here, Investment, Presentation, Project, Initial Deposit"
                }
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
                title: "Visual Guide: The 3 Pillars",
                type: "image",
                content: "Economics. Asset. Environment. The Triple Threat.",
                imageSrc: "/images/three_reasons_shield.png"
            },
            {
                title: "Opening Script",
                type: "quote",
                content: "\"The purpose of this call is to help you learn more about solar energy... to see if you can produce your own power instead of renting it.\""
            },
            {
                title: "Visual Guide: The Script Flow",
                type: "image",
                content: "Purpose -> Goal -> Permission.",
                imageSrc: "/images/opening_script_flow.png"
            },
            {
                title: "Bridge to Day 4: Presentation",
                type: "text",
                content: "You have Connected. You have discovered their Pain. You have built Trust. Now, and only now, have you earned the right to offer a solution. Tomorrow, in Day 4, we will show you exactly HOW to present the solution so that saying 'Yes' becomes the only logical choice."
            }
        ]
    },

    // DAY 4
    "day_4_presentation": {
        id: "day_4_presentation",
        title: "Day 4: Presentation",
        subtitle: "The Solution & The Math",
        pdfDownloadUrl: "/downloads/Day_4_Presentation.pdf",
        quiz: {
            title: "Day 4 Certification Exam",
            questions: [
                {
                    id: "q4_bill_swap",
                    question: "What is the core concept of the 'Bill Swap'?",
                    options: [
                        "Buying new windows to save energy",
                        "Swapping a fluctuating liability (Rent) for a fixed asset (Mortgage)",
                        "Switching utility companies",
                        "Paying a higher bill for green energy"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Solar isn't an extra bill. It's simply redirecting the money they are already spending into something they own."
                },
                {
                    id: "q4_rent_vs_own",
                    question: "How do we frame the current utility relationship?",
                    options: [
                        "As a partnership",
                        "As a 'Rental' agreement with rising rates and no end date",
                        "As a necessary evil",
                        "As a cheap option"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "They are renting their power. The price goes up, and they never build equity."
                },
                {
                    id: "q4_rollover",
                    question: "What is the best analogy for explaining Net Metering to a 5-year-old?",
                    options: [
                        "Rollover Minutes",
                        "The stock market",
                        "A banking ledger",
                        "A water reservoir"
                    ],
                    correctAnswerIndex: 0,
                    explanation: "Rollover minutes are intuitive: Use what you need, save the rest for later. It simplifies the grid concept."
                },
                {
                    id: "q4_itc",
                    question: "How do you explain the 30% Federal Tax Credit (ITC)?",
                    options: [
                        "The government sends you a check in the mail",
                        "It's a discount taken off the price immediately",
                        "It's like a 'Coupon' from the government that allows you to keep money you would have paid in taxes",
                        "It's a scam"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "The ITC is a tax credit, not a rebate. It allows them to withhold tax money they owe."
                },
                {
                    id: "q4_ppa",
                    question: "What is the main benefit of a PPA (Power Purchase Agreement)?",
                    options: [
                        "You own the panels",
                        "You get the tax credit",
                        "Zero debt, zero maintenance, just cheaper power (Pay for Production)",
                        "It has the highest ROI"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "PPA is for people who don't want debt or don't have tax liability. They just buy the power at a discount."
                },
                {
                    id: "q4_roi",
                    question: "If a system costs $30,000 and saves $3,000/year, what is the ROI?",
                    options: [
                        "5%",
                        "10% (Tax-Free)",
                        "20%",
                        "1%"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "3,000 is 10% of 30,000. Beating the stock market with zero risk is a powerful selling point."
                },
                {
                    id: "q4_value_stack_1",
                    question: "Which of these is NOT part of the 'Value Stack'?",
                    options: [
                        "Fixed Cost (Inflation Hedge)",
                        "Home Value Increase (~4%)",
                        "The color of the truck",
                        "Ownership (Asset)"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "We stack financial and tangible benefits: Cost control, Equity, and Tax Incentives."
                },
                {
                    id: "q4_education",
                    question: "According to the 'Education vs Selling' principle, what does the modern homeowner want?",
                    options: [
                        "To be sold aggressively",
                        "To be educated so they can make their own decision",
                        "To be tricked",
                        "To ignore the details"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Nobody wants to be sold. Everyone wants to be the smartest person in the room. Make them the expert."
                },
                {
                    id: "q4_loan",
                    question: "What is the primary selling point of a $0 Down Solar Loan?",
                    options: [
                        "You have to pay closing costs",
                        "It swaps a high bill for a lower payment immediately with no out-of-pocket cost",
                        "It is complicated",
                        "It has a high interest rate"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The 'Bill Swap' works best with a loan because the monthly operational cost drops on Day 1."
                },
                {
                    id: "q4_zillow",
                    question: "According to Zillow, how much does solar increase a home's value on average?",
                    options: [
                        "0%",
                        "4%",
                        "10%",
                        "20%"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "This is a key statistic to combat the 'I'm moving soon' objection. The system pays for itself in equity."
                },
                {
                    id: "q4_inflation",
                    question: "How does solar protect against inflation?",
                    options: [
                        "It doesn't",
                        "By locking in a fixed rate for electricity while utility rates rise forever",
                        "By using gold wiring",
                        "By printing money"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Utility rates historically rise 4-6% a year. Solar creates a flat line of cost for 25 years."
                },
                {
                    id: "q4_script_1",
                    question: "Complete the script: 'Mr. Homeowner, this isn't an extra bill. It's simply...'",
                    options: [
                        "...a new tax.",
                        "...a luxury item.",
                        "...redirecting the money you are already spending.",
                        "...a gamble."
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Reframing the cost is critical. It's not *new* money; it's *redirected* money."
                },
                {
                    id: "q4_analogy_1",
                    question: "What analogy do we use for the Utility Company?",
                    options: [
                        "The benevolent protector",
                        "The Monopoly (The only restaurant in town)",
                        "The partner",
                        "The charity"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Framing the utility as a Monopoly helps the homeowner realize they have no choice—until now."
                },
                {
                    id: "q4_cash",
                    question: "Why is a Cash purchase the 'best' ROI?",
                    options: [
                        "It's not",
                        "You avoid all interest payments and own the asset immediately",
                        "It takes longer",
                        "It costs more"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Cash is king for pure ROI because 100% of the savings go to the pocket, none to the bank interest."
                },
                {
                    id: "q4_fear",
                    question: "What is the biggest fear homeowners have about the 'Bill Swap'?",
                    options: [
                        "That it's too good to be true (The Catch)",
                        "That the sun will explode",
                        "That the panels are ugly",
                        "That the grid will fail"
                    ],
                    correctAnswerIndex: 0,
                    explanation: "When you show them they can save money with $0 down, they assume there is a catch. You must address this skepticism."
                }
            ]
        },
        sections: [
            {
                title: "Mission Briefing: The Solution",
                type: "text",
                content: "MISSION OBJECTIVE: Learn to present the solution so clearly that the price becomes irrelevant.\n\nAVATAR: \"You've made the connection. Now, how do you present the solution? We're not just selling panels; we're selling freedom from the utility monopoly. I'll show you how to explain the 'Bill Swap' so simply that even a child would understand it. Let's stack the value so high that the price becomes irrelevant.\""
            },
            {
                title: "Recap: The Connection",
                type: "text",
                content: "PREVIOUSLY: In Day 3, you learned to ask Questions instead of making Statements. You uncovered their 'Why'. Now, you will use that information to tailor a 'Perfect Presentation' that speaks directly to their needs."
            },
            {
                title: "Visual Guide: Utility Bill Autopsy",
                type: "image",
                content: "Don't just talk about the bill. Show them the hidden fees. Click to expand.",
                imageSrc: "/images/utility_bill_autopsy.png"
            },
            {
                title: "Deep Dive: Utility Bill Autopsy (Text Breakdown)",
                type: "list",
                content: "You must be able to read a bill better than the person who pays it. Here is the line-by-line dissection:",
                items: [
                    "GENERATION: The actual cost of creating the energy (burning coal/gas). This is rising due to global fuel prices.",
                    "TRANSMISSION: The cost of sending power over high-voltage lines from the plant to the city. These lines cause wildfires, leading to lawsuits and rate hikes.",
                    "DISTRIBUTION: The local poles and wires in the neighborhood. You are paying for their maintenance.",
                    "PUBLIC PURPOSE PROGRAMS: Hidden taxes for low-income assistance and efficiency mandates. You pay this even if you don't use it.",
                    "DWR BOND CHARGES: We are still paying off the debt from the 2001 Energy Crisis. It's a mortgage on the grid."
                ]
            },
            {
                title: "The Value Stack (Why Solar Wins)",
                type: "list",
                content: "Price is only an issue in the absence of value. Stack these 4 benefits:",
                items: [
                    "1. FIXED COST: Inflation protection. Utility rates rise ~6% annually. Solar is flat.",
                    "2. EQUITY: Zillow states solar homes sell for ~4% more.",
                    "3. TAX INCENTIVES: The 30% Federal ITC is a massive coupon.",
                    "4. CONTROL: Owning your power vs. renting from a monopoly."
                ]
            },
            {
                title: "Visual Guide: The Value Stack",
                type: "image",
                content: "Stack the benefits so high the price looks small.",
                imageSrc: "/images/value_stack_pyramid.png"
            },
            {
                title: "Deep Dive: Inflation Math (The Education Close)",
                type: "text",
                content: "Teach them 'Future Value'.\n\n**The Math:**\nCurrent Bill: $200/mo\nUtility Inflation: 6% (Historical Average)\n\n**In 10 Years:**\n$200 * 1.06^10 = **$358/mo**\n\n**In 25 Years:**\n$200 * 1.06^25 = **$858/mo**\n\n**The Solar Payment:**\n$200/mo (Fixed). It never goes up.\n\nThis simple napkin math kills the 'waiting' objection."
            },
            {
                title: "Visual Guide: The Cost of Doing Nothing",
                type: "image",
                content: "Show them the curve. Red vs Green.",
                imageSrc: "/images/inflation_curve.png"
            },
            {
                title: "Simulation: Bad Experience",
                type: "simulation",
                content: "Their neighbor had a bad experience. Isolate the variable (Company/Equipment) and differentiate yourself.",
                scenarioId: "bad_experience",
                openingLine: "My neighbor got solar and his roof leaked and he's still paying an electric bill. I don't trust it."
            },
            {
                title: "Deep Dive: Advanced Metering (The Utility Game)",
                type: "list",
                content: "You cannot sell solar without understanding how the utility counts the money. Research YOUR utility:",
                items: [
                    "NEM 1.0 (1:1 Net Metering): The Holy Grail. The utility acts as a free infinite battery. You spin the meter backwards.",
                    "NEM 3.0 / Net Billing: The utility pays you wholesale (pennies) for exports but charges retail for imports. RESULT: Solar alone doesn't work. You need a BATTERY to store day power for night use.",
                    "Deregulated Markets (e.g., Texas): There is no one utility. Hundreds of Retail Electric Providers (REPs). Some offer buyback, some don't. You must find the 'Solar Friendly' plan.",
                    "Avoided Cost: The utility only pays you what it costs THEM to generate power (~3 cents). Avoid exporting at all costs."
                ]
            },
            {
                title: "Deep Dive: Battery Storage Truths",
                type: "list",
                content: "Manage expectations. A battery is not a magic infinite generator.",
                items: [
                    "Whole Home vs Critical Load: ONE battery will NOT run the AC, Pool Pump, and Oven for 3 days. It runs the Fridge, Lights, and Wi-Fi.",
                    "Capacity (kWh): A standard battery is ~10-13 kWh. The average home uses 30 kWh/day. Do the math.",
                    "Power (kW): 'Capacity' is the gas tank size. 'Power' is the horsepower. If you turn on the dryer, you might exceed the KW output and trip the battery."
                ]
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
                title: "Financing 101: The Menu",
                type: "comparison",
                content: "Different strokes for different folks. Match the product to the pain.",
                comparison: {
                    rookie: "Pushing the same product (e.g., Loan) on everyone regardless of tax status.",
                    pro: "Option A (Cash) for ROI. Option B (Loan) for Ownership. Option C (PPA) for lowest payment/no debt."
                }
            },
            {
                title: "Simulation: Debt Fear",
                type: "simulation",
                content: "They are afraid of a 25-year loan. Explain the concept of 'Redirected Spend' (Bill Swap).",
                scenarioId: "debt_fear",
                openingLine: "I worked hard to be debt-free. I am not taking on a $40,000 loan for 25 years."
            },
            {
                title: "The ROI Script (Tax-Free Returns)",
                type: "text",
                content: "\"Mr. Homeowner, where else can you get a guaranteed 10% return that is tax-free? The stock market? Real estate? This system isn't just an appliance; it's the safest investment in your portfolio. You are moving money from a liability (rent) to an asset (ownership).\""
            },
            {
                title: "Comparison: Ownership vs PPA",
                type: "comparison",
                content: "When to sell which?",
                comparison: {
                    rookie: "PPA is a lease and it's bad.",
                    pro: "PPA is 'Pay for Production'. Zero debt, zero maintenance. Perfect for retirees with no tax liability."
                }
            },
            {
                title: "Bridge to Day 5: Closing",
                type: "text",
                content: "You've presented the perfect solution. The math makes sense. But human beings are emotional creatures, and fear will always creep in at the last second. Tomorrow, in Day 5, we will teach you how to handle that fear, overcome objections, and 'Close with Confidence'."
            }
        ]
    },

    // DAY 5
    "day_5_closing": {
        id: "day_5_closing",
        title: "Day 5: Closing",
        subtitle: "Objections & Decisions",
        pdfDownloadUrl: "/downloads/Day_5_Objections.pdf",
        quiz: {
            title: "Day 5 Certification Exam",
            questions: [
                {
                    id: "q5_goal",
                    question: "What is the philosophical definition of 'Closing' in our training?",
                    options: [
                        "Forcing the customer to sign",
                        "Something you do FOR people, not TO them",
                        "Tricking them into a contract",
                        "The end of the relationship"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Closing is the act of helping someone make a decision that is good for them. It is a service."
                },
                {
                    id: "q5_assumptive",
                    question: "Which of the following is an 'Assumptive Close'?",
                    options: [
                        "Do you want to buy solar?",
                        "What do you think?",
                        "Which works better for the site survey: Tuesday at 2 PM or Wednesday at 10 AM?",
                        "Can I have your business?"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "The Assumptive Close moves past the 'If' and focuses on the 'When' (Logistics)."
                },
                {
                    id: "q5_porcupine",
                    question: "What is the 'Porcupine Technique'?",
                    options: [
                        "Sticking the customer with a pen",
                        "Answering a question with a question to uncover the real concern",
                        "Being prickly and defensive",
                        "Speaking very slowly"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "If they ask 'Does it have a battery?', asking 'Are you looking for backup power?' reveals their true motive."
                },
                {
                    id: "q5_fff",
                    question: "What does 'Feel-Felt-Found' stand for?",
                    options: [
                        "Feel good, Felt bad, Found money",
                        "Empathize (Feel), Validate (Felt), Resolve (Found)",
                        "Touch the panels",
                        "None of the above"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "I understand how you FEEL. Others FELT the same way. But they FOUND that..."
                },
                {
                    id: "q5_obj_price",
                    question: "Customer says: 'It's too expensive.' What is the best response?",
                    options: [
                        "You're cheap.",
                        "It's actually free.",
                        "I understand. Is it the monthly payment that's too high, or the total amount?",
                        "I can give you a discount."
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Clarify if it's a cash-flow issue (monthly) or a sticker-shock issue (total). Usually, it's monthly."
                },
                {
                    id: "q5_obj_wait",
                    question: "Customer says: 'I need to think about it.' What is the hidden meaning?",
                    options: [
                        "They are philosophers",
                        "They want to meditate",
                        "Uncertainty (Fear of making a mistake)",
                        "They hate you"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "'I need to think about it' usually means 'I'm afraid of making a bad decision'. Address the fear."
                },
                {
                    id: "q5_matrix_1",
                    question: "In the Decision Matrix, what is the cost of 'Option A: Do Nothing'?",
                    options: [
                        "Zero",
                        "100% Loss (Rent)",
                        "A small fee",
                        "The price of solar"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Doing nothing isn't free. It costs 100% of their utility bill forever, with zero equity."
                },
                {
                    id: "q5_matrix_2",
                    question: "In the Decision Matrix, what is the risk of 'Option B: Go Solar'?",
                    options: [
                        "The roof leaking",
                        "The sun disappearing",
                        "None (covered by Performance Guarantee & Warranties)",
                        "Bankruptcy"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "With bumper-to-bumper warranties and production guarantees, the risk is transferred to the installer."
                },
                {
                    id: "q5_contract",
                    question: "How do we frame the 'Contract' to lower anxiety?",
                    options: [
                        "The Binding Legal Document",
                        "The 20-Year Lockdown",
                        "Paperwork / Approval Form",
                        "The Marriage Certificate"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Call it 'Paperwork' or an 'Approval Form' to see if the home qualifies."
                },
                {
                    id: "q5_soft_check",
                    question: "How should you position the credit check?",
                    options: [
                        "A hard pull on your credit report",
                        "A scary financial investigation",
                        "Just a 'soft check' to see if you qualify for the government incentives",
                        "A background check"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Framing it as a 'soft check' (which it often is) and tying it to 'incentives' lowers the barrier."
                },
                {
                    id: "q5_agreement_ladder",
                    question: "What is the 'Cycle of Agreement'?",
                    options: [
                        "Getting them to sign immediately",
                        "Asking small questions that get a 'Yes' so the big 'Yes' is easier",
                        "Agreeing with everything they say",
                        "Riding a bike"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Momentum matters. 'You want lower bills, right?' -> 'Yes'. 'And fixed rates?' -> 'Yes'."
                },
                {
                    id: "q5_obj_move",
                    question: "Customer says: 'I might move in 5 years.' best response?",
                    options: [
                        "Don't move.",
                        "That's perfect. Homes with solar sell for 4% more, so you'll make a profit when you sell.",
                        "You're stuck then.",
                        "Cancel the appointment."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Turn the objection into a benefit. Solar is an asset that increases resale value."
                },
                {
                    id: "q5_silence",
                    question: "What should you do after asking for the close (The Assumptive Question)?",
                    options: [
                        "Keep talking to convince them",
                        "Shut up. The first person to speak loses.",
                        "Apologize",
                        "Check your phone"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Silence is pressure. Let them sit in it and process the decision. Do not rescue them."
                },
                {
                    id: "q5_urgency",
                    question: "How can you create authentic urgency?",
                    options: [
                        "Lie about a sale ending",
                        "Mention the declining tax credit or utility rate hikes coming soon",
                        "Scream",
                        "Say you are leaving town"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Use real external factors (NEM deadlines, Tax Credit sunsets, Rate Hikes) to drive action."
                },
                {
                    id: "q5_mindset",
                    question: "If you walk into a close thinking 'I hope they buy', what will happen?",
                    options: [
                        "They will buy",
                        "They will sense your uncertainty and hesitation",
                        "Nothing",
                        "You will get lucky"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Confidence is contagious. So is doubt. You must assume the sale before you walk in."
                }
                ,
                {
                    id: "q5_ethics_tax",
                    question: "Is the Federal Tax Credit (ITC) a guaranteed check from the government?",
                    options: [
                        "Yes, everyone gets it",
                        "No, it is a liability offset. You must have tax liability to use it.",
                        "It depends on your credit score",
                        "It's a lottery"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The ITC is a non-refundable tax credit. If you don't pay taxes, you don't get the credit. Never promise it."
                },
                {
                    id: "q5_ethics_free",
                    question: "Can you legally advertise solar as 'Free'?",
                    options: [
                        "Yes, if it's zero down",
                        "No, unless it is truly free (no cost ever). 'Zero Down' is not 'Free'.",
                        "Only on Facebook",
                        "If you cross your fingers"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Deceptive marketing ('Free Solar') is a violation of the SEIA Code of Ethics and triggers lawsuits."
                }
            ]
        },
        sections: [
            {
                title: "Mission Briefing: The Psychology of Agreement",
                type: "text",
                content: "MISSION OBJECTIVE: Navigate objections and guide the homeowner to a decision.\n\nAVATAR: \"What happens when they say 'No'? Do you panic? In Module 4, we're Mastering Objections. I'll teach you the 'Porcupine' technique and how to use 'Feel-Felt-Found' to turn skeptics into believers. Resistance is not a stop sign. It's a signpost saying 'Help me understand'.\""
            },
            {
                title: "Recap: The Value",
                type: "text",
                content: "PREVIOUSLY: In Day 4, you built the value stack. You showed them the math. Now, they want it, but fear is holding them back. Your job today is to lead them through that fear."
            },
            {
                title: "Objection Judo: The Porcupine Technique",
                type: "comparison",
                content: "When they ask a question, answer with a question to uncover the real concern.",
                comparison: {
                    rookie: "Customer: 'Does it have a battery?' -> Rookie: 'Yes! It's $10k.' (Conversation ends).",
                    pro: "Customer: 'Does it have a battery?' -> Pro: 'Are you looking for backup power for medical equipment?' (Opens conversation)."
                }
            },
            {
                title: "Deep Dive: Feel-Felt-Found Archive",
                type: "list",
                content: "Memorize these scripts for the Top 3 Objections:",
                items: [
                    "PRICE: 'I understand how you FEEL about the cost. My other client, Bob, FELT the same way initially. But what he FOUND was that by redirecting his bill money, he actually increased his monthly cash flow immediately.'",
                    "SPOUSAL: 'I understand how you FEEL about needing to talk to your wife. Many husbands FELT that pressure. But they FOUND that bringing back a finished proposal with $0 down made the conversation much easier because it wasn't a problem, it was a solution.'",
                    "UNCERTAINTY: 'I know you FEEL like waiting is safer. Others FELT that way too. But they FOUND that while they waited, utility rates went up 12%, costing them $600 in lost savings.'",
                    "LIEN FEAR: 'I know the word lien is scary. My aunt FELT the same way. What she FOUND was that it's actually a UCC-1 fixture filing—it means the bank owns the panels, not your house. It doesn't stop you from selling.'",
                    "WAITING FOR RATES: 'I get it. Waiting seems smart. My neighbor FELT that last year. He FOUND that interest rates went up 2% and the panels got more expensive. Waiting actually COST him $4,000.'"
                ]
            },
            {
                title: "Simulation: The Price Objection",
                type: "simulation",
                content: "Practice the Feel-Felt-Found technique against a price objection.",
                scenarioId: "price_objection",
                openingLine: "I just don't think I can afford another bill right now. It seems too expensive."
            },
            {
                title: "The Assumptive Close",
                type: "comparison",
                content: "Don't ask IF they want to buy. Ask HOW they want to proceed. Act as if the decision has already been made.",
                comparison: {
                    rookie: "So... what do you think? Do you want to sign up?",
                    pro: "So, looking at the calendar, I have appointments for the site survey on Tuesday at 2 PM or Wednesday at 10 AM. Which one works better for you?"
                }
            },
            {
                title: "The Decision Matrix (Ben Franklin Close)",
                type: "text",
                content: "When they are on the fence, make it visual. Compare the two realities:\n\n**Option A: Do Nothing (Utility)**\n• Risks: Rates go up ~5-10%/year.\n• Cost: 100% loss (Rent).\n• Equity: $0.\n• Control: None.\n\n**Option B: Go Solar**\n• Risks: None (Performance Guarantee).\n• Cost: Less than current bill (Fixed).\n• Equity: Increases home value.\n• Control: 100%."
            },
            {
                title: "The Decision Matrix Visual",
                type: "image",
                content: "Use this chart to show that doing nothing is the most expensive option.",
                imageSrc: "/images/module_5_decision_matrix.png"
            },
            {
                title: "Simulation: The Stalling Objection",
                type: "simulation",
                content: "The homeowner wants to 'think about it'. Use the Decision Matrix logic to show that indecision is costly.",
                scenarioId: "stalling_objection",
                openingLine: "This sounds good, but I really need to take some time to think about it."
            },
            {
                title: "Simulation: The Moving Objection",
                type: "simulation",
                content: "They are worried about being stuck with the contract if they move. Explain the Asset Transfer.",
                scenarioId: "moving_objection",
                openingLine: "We might be moving in 3 or 4 years, so I don't want to be stuck with this long contract."
            },
            {
                title: "Deep Dive: Decoding the Contract",
                type: "list",
                content: "Reduce anxiety by translating 'Legalize' into 'Human'. Go through the agreement page by page:",
                items: [
                    "Page 1 (Scope of Work): 'This just lists the hardware we are installing. 12 panels, 1 inverter. Verify the address is correct.'",
                    "Page 2 (Payment): 'This confirms the $0 down. You pay nothing until the system is ON. The monthly amount is fixed at [Amount].'",
                    "Page 3 (The Escalator): 'See this 2.9%? That is your cap. The utility goes up 6-10%. You are capped here. It is rent control.'",
                    "Page 4 (The ITC): 'This line shows the 30% tax credit. The lender floats this money for 18 months. You just catch the check and hand it to them.'",
                    "Page 5 (Right to Cancel): 'You have 3 days to change your mind. No pressure.'"
                ]
            },
            {
                title: "Visual Guide: Contract Decoder",
                type: "image",
                content: "Translate legalese into human.",
                imageSrc: "/images/contract_decoder.png"
            },
            {
                title: "Practice Scenario: The Price Objection",
                type: "simulation",
                content: "The homeowner says 'It's too expensive'. Use the Feel-Felt-Found technique to overcome this.",
                scenarioId: "objection_price",
                openingLine: "50 thousand dollars?! That is way too expensive. I'm not interested."
            },
            {
                title: "The High Road: Ethics & Long-Term Success",
                type: "list",
                content: "Your reputation is your equity. Don't burn it for a quick commission.",
                items: [
                    "The Tax Credit Rule: Never promise it. Explain it as an 'offset'. Use the disclaimer: 'Consult your tax professional'.",
                    "The 'Free' Rule: Solar is 'Zero Down', not 'Free'. Someone pays for it.",
                    "The Golden Rule: Would you sell this system, at this price, to your own grandmother? If not, walk away."
                ]
            },
            {
                title: "Visual Guide: The Code of Ethics",
                type: "image",
                content: "Integrity is your brand.",
                imageSrc: "/images/ethics_shield.png"
            },
            {
                title: "Bridge to Day 6: Mastery",
                type: "text",
                content: "You did it. You got the signature. You closed the deal. Most reps stop here. Top performers know that the real work—and the real money—starts AFTER the sale. Tomorrow, in Day 6, we will teach you how to turn this one sale into three more through the 'Referral Engine'. Get ready to scale."
            }
        ]
    },

    // DAY 6
    "day_6_mastery": {
        id: "day_6_mastery",
        title: "Day 6: Mastery",
        subtitle: "Referrals & Automation",
        pdfDownloadUrl: "/downloads/Day_6_Mastery.pdf",
        quiz: {
            title: "Day 6 Certification Exam",
            questions: [
                {
                    id: "q6_goal",
                    question: "What is the ultimate goal of the Referral Engine?",
                    options: [
                        "To annoy your friends",
                        "To turn one sale into three and stop cold calling",
                        "To get more likes on Facebook",
                        "To maximize your tax return"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Farming referrals allows you to stop hunting for new leads. It creates a self-sustaining business."
                },
                {
                    id: "q6_happiness_1",
                    question: "When is the 'Moment of Happiness'?",
                    options: [
                        "When you sign the contract (Asking for money)",
                        "When you knock on their door",
                        "Install Day or First Bill (Peak positive emotion)",
                        "When the roof leaks"
                    ],
                    correctAnswerIndex: 2,
                    explanation: "Never ask for favors when asking for money. Ask when they receive the value (Panels up or Bill killed)."
                },
                {
                    id: "q6_farming",
                    question: "A Rookie hunts. What does a Pro do?",
                    options: [
                        "Farms",
                        "Fishes",
                        "Sleeps",
                        "Hides"
                    ],
                    correctAnswerIndex: 0,
                    explanation: "Farming implies cultivating relationships and harvesting the fruit later."
                },
                {
                    id: "q6_orphan",
                    question: "What is an 'Orphan Owner'?",
                    options: [
                        "A child without parents",
                        "A homeowner with solar whose original installer went out of business or disappeared",
                        "A house without a roof",
                        "A lead that no one called"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Orphans are the easiest sales. They already believe in solar but need service. You become their hero."
                },
                {
                    id: "q6_orphan_script",
                    question: "What is the key to the Orphan Owner script?",
                    options: [
                        "Trying to sell them more panels immediately",
                        "Leading with Service ('I'm just checking if you need warranty help')",
                        "Telling them their system is bad",
                        "Asking for money"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Service-first lowers resistance. Once they trust you, they will ask YOU about batteries or upgrades."
                },
                {
                    id: "q6_math",
                    question: "If every customer gives you 3 referrals, and you close 1 of them, what happens?",
                    options: [
                        "You go broke",
                        "Your business doubles every year without spending money on ads",
                        "You get tired",
                        "Nothing"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Exponential growth comes from the referral tree. 1 becomes 2, 2 becomes 4."
                },
                {
                    id: "q6_app",
                    question: "What is a crucial step during 'Implementation' (Day 50-60)?",
                    options: [
                        "Ghosting the customer",
                        "Helping them download the App to monitor production",
                        "Asking for a tip",
                        "Doing nothing"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "The App is their proof that the system works. If they don't see the data, they don't feel the value."
                },
                {
                    id: "q6_pto",
                    question: "What does PTO stand for in this context?",
                    options: [
                        "Paid Time Off",
                        "Permission to Operate (Utility Green Light)",
                        "Please Turn On",
                        "Panel Test Operation"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "PTO is the legal authorization from the utility to turn the switch on."
                },
                {
                    id: "q6_expectations",
                    question: "Why must you manage expectations between Install and PTO?",
                    options: [
                        "Because the system sits on the roof 'OFF' for weeks/months waiting for the city",
                        "Because customers get bored",
                        "Because panels need to rest",
                        "Because the sun is weak"
                    ],
                    correctAnswerIndex: 0,
                    explanation: "The 'Gap of Rage' happens when customers see panels but don't see savings. Pre-frame this wait."
                },
                {
                    id: "q6_celebration",
                    question: "What should you do on Activation Day?",
                    options: [
                        "Send a text",
                        "Go there in person to flick the switch (Celebration)",
                        "Ignore them",
                        "Send a bill"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Turning it into a ceremony anchors the positive emotion and is the perfect time to ask for referrals."
                },
                {
                    id: "q6_referral_fee",
                    question: "How much should you offer for a referral fee?",
                    options: [
                        "Nothing, they should do it for love",
                        "$500 - $1,000 (Make it meaningful)",
                        "$5",
                        "A high five"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Money talks. $500 is enough to make them pick up the phone and call their brother."
                },
                {
                    id: "q6_social_media",
                    question: "How can you leverage a happy customer on social media?",
                    options: [
                        "Take a selfie with them (with permission) and tag them",
                        "Post their address publicly",
                        "Ignore them",
                        "Block them"
                    ],
                    correctAnswerIndex: 0,
                    explanation: "Tagging them exposes you to their entire friend list (Trust Transference)."
                },
                {
                    id: "q6_gift",
                    question: "What is a 'Solar Warming/Closing Gift'?",
                    options: [
                        "A bill",
                        "A logical gift like LED bulbs or a Nest Thermostat",
                        "A puppy",
                        "Cash"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "A gift that helps them save MORE energy reinforces your brand as an efficiency consultant."
                },
                {
                    id: "q6_review",
                    question: "When should you ask for a Google Review?",
                    options: [
                        "Never",
                        "Immediately after the Moment of Happiness",
                        "When they are angry",
                        "10 years later"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Strike while the iron is hot. Reviews build your digital reputation for orphan owners to find."
                },
                {
                    id: "q6_legacy",
                    question: "What is the ultimate measure of a Solar Professional?",
                    options: [
                        "How much money they made",
                        "The number of families they helped and the referrals they earned",
                        "How fast they talk",
                        "Their car"
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Sales is a service. Your legacy is your network of happy homeowners."
                }
            ]
        },
        sections: [
            {
                title: "Mission Briefing: Building an Empire",
                type: "text",
                content: "MISSION OBJECTIVE: Turn one sale into three through the power of Referrals.\n\nThe goal of Day 6 is to ensure you never have to knock a cold door again. By mastering the 'Moment of Happiness', you will build a self-sustaining business based on trust."
            },
            {
                title: "Recap: The Journey",
                type: "text",
                content: "PREVIOUSLY: You have traveled the full path. Mindset (Day 1), Prospecting (Day 2), Connection (Day 3), Presentation (Day 4), and Closing (Day 5). You are now a lethal sales professional. This final module is about longevity—working smarter, not harder."
            },
            {
                title: "The Referral Engine",
                type: "text",
                content: "A sale isn't the end. It's the seed for 3 more. Ask for referrals at the 'Moment of Happiness':\n\n1. Install Day: \"Look at those panels! Who else do you know on this street?\"\n2. First Bill / True-Up: \"You just saved $200. Who else needs this?\""
            },
            {
                title: "The Referral Tree",
                type: "image",
                content: "Visualizing how one happy customer branches into Neighbors, Friends, and Family.",
                imageSrc: "/images/module_8_referral_tree.png"
            },
            {
                title: "Orphan Owner Strategy",
                type: "list",
                content: "The easiest sales are 'Orphan Owners'—people whose solar company went bankrupt.",
                items: [
                    "Strategy: Knock doors with existing solar.",
                    "Script: \"I'm not selling. I'm just the local service rep for the area. I know your installer left town, and I wanted to be your emergency contact.\"",
                    "Result: Instant trust. They will eventually buy batteries, upgrades, or refer you."
                ]
            },
            {
                title: "The Referral Tree",
                type: "image",
                content: "How one happy customer branches into three new sales.",
                imageSrc: "/images/module_8_referral_tree.png"
            },
            {
                title: "Referral Script Vault",
                type: "list",
                content: "Memorize these lines. They are worth their weight in gold.",
                items: [
                    "The 'Who Do You Know?': 'Mrs. Jones, people usually ask me who else I'm working with in the neighborhood. Who should I absolutely NOT talk to? (Laughs) Okay, who should I talk to?'",
                    "The 'Hero' Script: 'I promised to keep your installers busy. They did a great job for you, right? Who else needs this level of service?'",
                    "The 'Bill Kill': 'You just zeroed out your bill. Do you have any friends who still pay the utility company? Allow me to save them too.'"
                ]
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
