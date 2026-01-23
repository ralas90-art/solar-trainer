export interface Slide {
    title: string;
    content: string;
    imagePlaceholder?: string;
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
    "day_1_basics": {
        id: "day_1_basics",
        title: "The Solar Mindset",
        subtitle: "Module 1",
        sections: [
            {
                title: "Who Are You?",
                type: "text",
                content: "You are not just a 'salesperson.' You are an Energy Consultant. Most people think solar sales is about knocking doors and annoying people. Wrong."
            },
            {
                title: "Visual Aid: Understanding the Grid",
                type: "slides",
                content: "Review these slides to understand the current utility monopoly vs. solar independence.",
                slides: [
                    {
                        title: "The Old Way: Renting Power",
                        content: "You pay the utility company for every kWh forever. Rates go up 4-6% every year. You own nothing.",
                        imagePlaceholder: "Utility Bill"
                    },
                    {
                        title: "The New Way: Owning Power",
                        content: "Solar replaces your bill with a fixed asset payment. Once paid off, your power is free.",
                        imagePlaceholder: "Solar Panels"
                    },
                    {
                        title: "Net Metering Explained",
                        content: "During the day, you send excess power to the grid. At night, you pull it back. The grid acts as your battery.",
                        imagePlaceholder: "Grid Diagram"
                    }
                ]
            },
            {
                title: "The Solar Creed",
                type: "quote",
                content: "\"We do not sell panels. We sell freedom from the utility monopoly.\""
            }
        ]
    },
    "day_2_pitch": {
        id: "day_2_pitch",
        title: "The Perfect Pitch",
        subtitle: "Module 2",
        sections: [
            {
                title: "Door-to-Door Deck",
                type: "slides",
                content: "This is the 'Energy Independence' presentation you'll use at the door or simplified in-home.",
                slides: [
                    {
                        title: "Energy Independence",
                        content: "Prepared for the [Homeowner Name] Family by [Agent Name].",
                        imagePlaceholder: "Title Slide"
                    },
                    {
                        title: "The Problem: Inflation",
                        content: "Utility rates have doubled in the last 20 years. What will they look like in 20 more?",
                        imagePlaceholder: "Graph Rising"
                    },
                    {
                        title: "The Solution: Rate Locking",
                        content: "Solar locks in your rate for 25 years. It's like buying gas at 1990 prices forever.",
                        imagePlaceholder: "Lock Icon"
                    },
                    {
                        title: "0% Down Explained",
                        content: "You don't pay upfront. The savings from the bill cover the cost of the solar payment.",
                        imagePlaceholder: "No Money Icon"
                    }
                ]
            },
            {
                title: "The 30-Second Hook",
                type: "text",
                content: "You have 4 seconds to earn 30 seconds. You have 30 seconds to earn 2 minutes. Don't waste time on small talk."
            }
        ]
    },
    "day_3_objections": {
        id: "day_3_objections",
        title: "Objection Dojo",
        subtitle: "Module 3",
        sections: [
            {
                title: "In-Home Presentation Tactics",
                type: "slides",
                content: "Use these visual aids to overcome the 'Too Expensive' objection.",
                slides: [
                    {
                        title: "Cost of Doing Nothing",
                        content: "If you pay $200/mo rising at 4%, you will pay over $100,000 to the utility in the next 25 years.",
                        imagePlaceholder: "$100k Stack"
                    },
                    {
                        title: "Equity vs. Expense",
                        content: "Utility payments are 100% interest. Solar payments are equity in your home value.",
                        imagePlaceholder: "House Value"
                    }
                ]
            },
            {
                title: "The Porcupine Technique",
                type: "quote",
                content: "\"If I could show you how to lower that bill without spending a dime out of pocket, would you be open to looking at the numbers?\""
            }
        ]
    },
    "day_4_closing": {
        id: "day_4_closing",
        title: "Closing & Contracts",
        subtitle: "Module 4",
        sections: [
            {
                title: "Virtual Sales Deck",
                type: "slides",
                content: "Key slides for remote ZOOM closings.",
                slides: [
                    {
                        title: "Your Path to Energy Independence",
                        content: "Virtual Consultation. [Agent Photo].",
                        imagePlaceholder: "Zoom Cover"
                    },
                    {
                        title: "System Design",
                        content: "Here is your roof. We fit 24 panels on the South/West face for specific 98% offset.",
                        imagePlaceholder: "Roof CAD"
                    },
                    {
                        title: "The Savings Report",
                        content: "Old Bill: $250. New Bill: $180. Net Savings: $70/mo immediately.",
                        imagePlaceholder: "Savings Table"
                    }
                ]
            },
            {
                title: "The Assumptive Close",
                type: "text",
                content: "Don't ask IF they want to move forward. Ask WHEN/HOW. Assume the sale has already been made in your mind."
            }
        ]
    },
    "day_5_exam": {
        id: "day_5_exam",
        title: "Certification Exam",
        subtitle: "Module 5",
        sections: [
            {
                title: "The Final Test",
                type: "text",
                content: "This is a full simulation. You will face a difficult homeowner who throws multiple objections at you. You must navigate from the Door approach all the way to the Close."
            }
        ]
    }
}
