import { ModuleContent } from "@/lib/modules";
import { INDUSTRY } from "@/lib/white-label.config";

export const ADDITIVE_DAY4_MODULES: Record<string, ModuleContent> = {
    "mod_4_1a": {
        id: "mod_4_1a",
        title: "Module 4.1A: Time-of-Use Rates & Utility Tariff Strategy",
        subtitle: "Understand TOU rates, explain peak hours, and integrate rate knowledge into savings story.",
        sections: [
            {
                title: "The Electricity Bill Isn't What Most People Think It Is",
                type: "text",
                content: `Most homeowners think their electricity bill is just 'how much power I used × a price.' In reality, many utilities charge differently based on *when* you use electricity — not just *how much.* This is called Time-of-Use pricing (TOU), and it changes the value of ${INDUSTRY.toLowerCase()} fundamentally. The bill is more like a hotel room rate than a flat product price. The same room costs more on a Friday night than a Tuesday.`
            },
            {
                title: "Flat Rate vs. TOU Rate: Know the Difference",
                type: "text",
                content: `Flat rate: You pay the same price per kilowatt-hour (kWh) regardless of when you use it. Straightforward to explain savings. Less common in progressive utility markets.\nTime-of-Use (TOU): You pay a higher price during 'peak' hours (typically afternoon and evening) and a lower price during 'off-peak' hours (nights, early mornings, sometimes weekends).\nWhy this matters for ${INDUSTRY.toLowerCase()}: ${INDUSTRY} panels produce the most power during the middle of the day. In flat-rate areas, that daytime production directly offsets bill usage. In TOU areas, midday ${INDUSTRY.toLowerCase()} production may earn *less credit* than what the homeowner uses in the evening peak window.`
            },
            {
                title: "What Peak Hours Actually Mean",
                type: "text",
                content: `Peak hours are when demand on the utility grid is highest — typically 4 PM–9 PM in most markets. Electricity during peak hours costs significantly more than off-peak electricity. ${INDUSTRY} panels produce power from roughly 8 AM–5 PM. There's a mismatch between peak production (noon) and peak cost (evening). This gap is the exact reason battery storage has become a stronger financial tool — not just an emergency backup play.`
            },
            {
                title: "Net Metering and How Rate Structures Affect It",
                type: "list",
                content: `Net metering allows homeowners to send excess ${INDUSTRY.toLowerCase()} power back to the grid and receive a credit on their bill. The value of that credit depends entirely on the utility's program rules — and varies by market.`,
                items: [
                    `In flat-rate markets: excess ${INDUSTRY.toLowerCase()} may get credited at close to retail rate.`,
                    `In TOU markets with newer net metering programs: excess ${INDUSTRY.toLowerCase()} exported to the grid during off-peak hours may get credited at a *lower* rate than what the homeowner pays during evening peak.`,
                    "The rep should never assume what the homeowner's net metering credit rate is. Always verify with current program language."
                ]
            },
            {
                title: "How to Use This in the Presentation",
                type: "text",
                content: `Reps do NOT need to recreate a utility rate schedule on the homeowner's kitchen table. The goal is to use rate awareness to *deepen trust* and *explain the "why"* — not to teach a class.\nSimple rep language examples:\n"Your utility uses time-of-use rates, which means the electricity you use at night costs more than what ${INDUSTRY.toLowerCase()} produces during the day. That's actually part of why a battery can make a real financial difference for you.\"\n\"With a flat-rate utility like yours, every kilowatt-hour your panels produce offsets your bill at the same rate — which simplifies the math and keeps the payback cleaner.\"`
            },
            {
                title: "Rate Structures Vary by Market",
                type: "text",
                content: "Every utility is different. Every state is different. Rate programs change. This module teaches the *concept* — your specific market training will cover the exact programs your homeowners are on. Key compliance note: Never quote a homeowner's specific rate per kWh unless you have verified their current bill. Utility rates change. Programs change. Always use their actual bill as the reference document."
            },
            {
                title: "Presentation Slides",
                type: "slides",
                slides: [
                    {
                        title: "Understanding Time-of-Use Rates",
                        content: "What Smart Reps Know about TOU rates and utility tariffs.",
                        image: "/images/utility_bill_autopsy.png"
                    },
                    {
                        title: "The Electricity Bill Isn't Simple",
                        content: "What most homeowners think vs. what's really happening on the grid.",
                        image: "/images/utility_bill_autopsy.png"
                    },
                    {
                        title: "Flat Rate vs. Time-of-Use",
                        content: "Two types of rate plans: paying the same flat rate everywhere vs varying by time of day.",
                        image: "/images/tou_rate_chart.png"
                    },
                    {
                        title: `${INDUSTRY} Production vs Utility Cost Peaks`,
                        content: `${INDUSTRY} produces most midday, while utility costs peak in the evening when people are home.`,
                        image: "/images/production_demand_curve.png"
                    },
                    {
                        title: "What This Means For Your Savings",
                        content: "Rate structures change the conversation. You must match the system to the homeowner's actual curve.",
                        image: "/images/savings_graph.png"
                    },
                    {
                        title: "Net Metering Reality Check",
                        content: "What it is, what it isn't, and why current-program language framing builds trust.",
                        image: "/images/ethics_shield.png"
                    },
                    {
                        title: "The Battery Connection",
                        content: "Why Time-Of-Use makes storage financially relevant and fundamentally changes the ROI.",
                        image: `/images/${INDUSTRY.toLowerCase()}_battery_setup.png`
                    }
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
            title: "Knowledge Check: Time-of-Use",
            questions: [
                {
                    id: "kc_4_1a_1",
                    question: "What is the primary difference between a flat rate and a Time-of-Use (TOU) rate?",
                    options: [
                        "Flat rates only apply to residential customers.",
                        "TOU rates change based on the time of day, while flat rates stay the same.",
                        "Flat rates are more expensive than TOU rates.",
                        "TOU rates only apply during the summer."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "TOU rates vary based on when electricity is used, typically with 'peak' and 'off-peak' pricing."
                }
            ]
        }
    },
    "mod_4_1b": {
        id: "mod_4_1b",
        title: "Module 4.1B: Avoiding the 'Savings Trap'",
        subtitle: "How to present savings with integrity, manage expectations, and protect your reputation.",
        sections: [
            {
                title: "The Danger of Over-Promising",
                type: "text",
                content: `The most common reason for ${INDUSTRY.toLowerCase()} cancellations and bad reviews isn't the equipment — it's the expectation gap. When a rep promises 'no more utility bills' or 'guaranteed 50% savings' without accounting for rate changes, seasonal variation, or future usage, they are setting a trap for themselves and the company. Module 4.1B is about presenting the financial truth in a way that still closes the deal.`
            },
            {
                title: "What is the 'Savings Trap'?",
                type: "text",
                content: "The 'Savings Trap' happens when a rep uses the best-case scenario (peak summer production) to represent the entire year, or fails to explain that a '100% offset' system doesn't necessarily mean a '$0 bill' due to fixed utility charges and net metering credits. Building a proposal on half-truths creates a 'ticking time bomb' in your pipeline."
            },
            {
                title: "Section 1: The '100% Offset' Myth",
                type: "list",
                content: "Explain these three truths to every homeowner to stay out of the trap:",
                items: [
                    "Fixed Charges: Most utilities have a minimum monthly connection fee (e.g., $15–$30) that solar does not offset.",
                    "Seasonal Production: You will produce more than you need in July and less than you need in December. The 'savings' is an annual calculation, not a monthly guarantee.",
                    "Non-Bypassable Charges: Some newer utility programs have fees that cannot be offset by solar credits. Know your market's specifics."
                ]
            },
            {
                title: "Section 2: Handling the 'Guaranteed Savings' Question",
                type: "text",
                content: `Homeowner: \"So you guarantee I'll save $200 a month?\"\nThe Trap: \"Yes, absolutely. The math doesn't lie.\"\nThe Pro Response: \"The system is designed to produce X amount of power, which at current rates would offset approximately Y on your bill. While I can't guarantee exactly what the utility will charge in the future or how your family's usage might change, we're building this based on your actual historical data to be as accurate as possible.\"`
            },
            {
                title: "Section 3: The Power of Under-Promising",
                type: "text",
                content: "Reps who slightly under-promise (e.g., 'This should cover about 95% of your needs' vs 'This covers everything') actually have *higher* closing rates. Why? Because it sounds more realistic. Homeowners are naturally skeptical of 'perfect' solutions. Adding a touch of conservative realism builds massive credibility."
            },
            {
                title: "Presentation Slides",
                type: "slides",
                slides: [
                    {
                        title: "Avoiding the 'Savings Trap'",
                        content: "Integrity-based selling for long-term success.",
                        image: "/images/ethics_shield.png"
                    },
                    {
                        title: "The Expectation Gap",
                        content: "Why over-promising is the fastest way to kill your career.",
                        image: "/images/ethics_shield.png"
                    },
                    {
                        title: "100% Offset vs. $0 Bill",
                        content: "Explaining fixed charges and seasonal variation clearly.",
                        image: "/images/tou_rate_chart.png"
                    },
                    {
                        title: "The Pro Response to 'Guarantees'",
                        content: "Scripting for honesty that still builds confidence.",
                        image: "/images/ethics_shield.png"
                    }
                ]
            }
        ],
        workbookPrompts: [
            {
                id: "wb_4_1b_1",
                type: "open_response",
                label: "A homeowner asks: 'Will this system cover my entire bill?' Write a pro response that manages expectations without losing the sale.",
                placeholder: "Your response...",
                lines: 4
            }
        ],
        quiz: {
            title: "Knowledge Check: Avoiding the Savings Trap",
            questions: [
                {
                    id: "kc_4_1b_1",
                    question: "Why is it important to explain fixed utility charges to a homeowner?",
                    options: [
                        "So they know solar can't help them.",
                        "To prevent them from being surprised by a small bill after installation.",
                        "Because it makes the ROI look better.",
                        "It's required by law in all states."
                    ],
                    correctAnswerIndex: 1,
                    explanation: "Explaining fixed charges prevents the homeowner from feeling misled when they see a small utility charge post-install."
                }
            ]
        }
    }
};
