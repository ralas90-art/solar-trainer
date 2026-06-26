import { WHITE_LABEL } from "./white-label.config"

const ind = WHITE_LABEL.industry;
const prod = WHITE_LABEL.productName;
const obj = WHITE_LABEL.objectName;
const bill = WHITE_LABEL.billName;
const rep = WHITE_LABEL.repTitle;

export const EXPERT_PRO_TIPS: Record<string, string> = {
    "wb_1_1_1": `Aim for a Month 3 target of 3-5 deals/week. To hit this, establish a daily benchmark of 30 door knocks or 40 outbound calls during the Golden Hours (2 PM - 7 PM). Consistency is the ultimate compound interest in ${ind} sales.`,
    "wb_1_1_2": `Trainees in Stage 2 (Conscious Incompetence) often feel overwhelmed when first hearing objections. Reaching Stage 4 means objection handling becomes conversational tennis—effortless and automatic.`,
    "wb_1_2_1": `Pro Tip: Test your CRM app in offline mode before stepping onto a neighborhood block. Ensure your credentials for custom mapping tools and proposal software are saved and work on cellular data.`,
    "wb_1_3_1": `Golden Hours are sacred. Block out 2 PM to 7 PM in your calendar as 'Field Prospecting' and treat it as an unbreakable commitment. Shift all administrative work and CRM logging to early mornings (8 AM - 10 AM).`,
    "wb_1_4_1": `Leverage the federal Residential Clean Energy Credit as a core driver of urgency, noting that under current guidance it applied to qualifying solar property installed through Dec 31, 2025. Explain that utility rate hikes compound annually—waiting is a net loss.`,
    "wb_1_5_1": `When explaining technical setups, keep it conversational. Focus on 'Net Metering' as a digital bank account—energy generated during the day gets deposited as credits, and withdrawn for free at night.`,
    "wb_2_1_1": `Focus your territory plan on high-density neighborhoods with clear southern exposure and minimal tree shading. A perfect route has 80+ potential homes within walking distance.`,
    "wb_2_3_1": `Use a pattern interrupt at the door. Avoid stating 'I'm here to sell you ${prod}'. Instead, start with: 'I was just speaking with your neighbor Frank about the utility bill increase...'`,
    "wb_2_5_1": `Transition from a transactional mindset to a consultative one. Ask: 'If you had to guess, what do you think is driving the recent surges in your utility rates?'`,
    "wb_3_2_1": `Adapting to BOLT framework: Speak in bottom-line terms to Bulls, highlight technical specs to Owls, emphasize simple processes to Turtles, and build enthusiastic rapport with Lions.`,
    "wb_3_3_1": `Use tactical labeling when a homeowner hesitates: 'It seems like you have a concern about how ${prod} will affect your ${obj}.' This allows them to state the real objection without feeling pressured.`,
    "wb_3_4_1": `The 12 discovery questions are designed to dig into the 'Why'. Never jump to a pitch before answering: 'What is the absolute maximum you've ever paid for your utility bill?'`,
    "wb_4_1_1": `During the bill autopsy, highlight the fixed 'Customer Charge' vs the variable 'Usage Charge'. Show them that they have zero control over the variable rate increases until they own their power source.`,
    "wb_4_2_1": `PPAs vs. Loans: PPAs focus on an immediate 'lower rate per kWh' with zero down, while loans are an asset purchase. Match the financing to the customer's BOLT profile—Turtles prefer PPAs, Owls prefer loans or cash.`,
    "wb_5_2_1": `When hit with 'I need to think about it', isolate the concern: 'I understand. Aside from the monthly payment, is there any other reason you'd hesitate to switch to ${prod} today?'`,
    "wb_6_1_1": `The 'Moment of Happiness' is right after the contract is signed or the system turns on. Always ask: 'Who is the one neighbor on this street who would be most excited to see their bill drop to $15?'`,
    "wb_6_8_1": `The Certification Exam tests your ability to maintain composure under pressure. Breathe, validate the customer's emotion first, isolate the core objection, and close with confidence.`
};

export const DYNAMIC_PLACEHOLDERS: Record<string, string> = {
    "wb_1_1_1": "e.g. Month 3: $12,000/mo = 40 doors/day, 8 sat appointments/week...",
    "wb_1_1_2": "Describe your current comfort level and what absolute flow state looks like for you...",
    "wb_1_2_1": "List the credentials verified and steps taken to ensure 100% field readiness...",
    "wb_1_3_1": "Outline your scheduled daily blocked hours (Onboarding, Admin, and Golden Door Hours)...",
    "wb_1_4_1": "How will you present the Federal ITC and rate inflation to create natural urgency?...",
    "wb_1_5_1": "Explain how solar works in 3 bullet points using the 'utility bank account' analogy...",
    "wb_2_1_1": "Enter your target neighborhoods, starting street, and daily door knock goal...",
    "wb_2_3_1": "Draft your personalized door opener using a local neighbor reference...",
    "wb_2_5_1": "Write down 3 open-ended questions that build immediate consultative trust...",
    "wb_3_2_1": "How will you spot a Bull personality in the first 60 seconds and adapt your presentation?...",
    "wb_3_3_1": "Give an example of a label and a mirror you will use to de-escalate a nervous homeowner...",
    "wb_3_4_1": "List the three discovery questions you feel are most critical for uncovering true financial pain...",
    "wb_4_1_1": "Walk through how you will explain tariff rate adjustments and variable charges to an Owl...",
    "wb_4_2_1": "Compare how you would present a loan vs a PPA to a value-conscious customer...",
    "wb_5_2_1": "Write your exact go-to response for handling the 'too expensive' objection...",
    "wb_6_1_1": "Draft your exact script for asking for three introductions at the moment of contract signing...",
    "wb_6_8_1": "Draft your game plan for handling a hostile dual-spouse meeting with multiple objections..."
};
