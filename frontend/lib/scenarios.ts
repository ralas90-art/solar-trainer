/**
 * Fallback scenario data for when the backend API is unreachable.
 * This mirrors the backend's data.py SCENARIOS dictionary.
 * Used by sequential-simulation.tsx as a client-side fallback.
 */

export interface Scenario {
    id: string
    name: string
    description: string
    difficulty: string
    opening_line: string
    briefing: string
    valid_responses: string[]
    requiredModule?: string // ID of the curriculum module required to unlock this scenario
}

export const SCENARIOS: Record<string, Scenario> = {
    "d2d_1": {
        id: "d2d_1",
        name: "The Penny Pincher",
        description: "Homeowner claims solar is too expensive.",
        difficulty: "Medium",
        opening_line: "Solar is too expensive. I'll pass.",
        briefing: "Goal: Overcome the price objection.\n\nKey Concepts:\n1. Solar is a bill swap, not an extra cost.\n2. Focus on ROI (Return on Investment).\n3. Compare the rising cost of utility power vs. fixed solar payments.\n\nTip: Ask them 'How much did you pay for power last month?' to anchor the cost.",
        valid_responses: ["ROI", "savings", "bill swap"]
    },
    "eng_1": {
        id: "eng_1",
        name: "The Skeptical Engineer",
        description: "Customer wants technical specs and doubts efficiency claims.",
        difficulty: "Hard",
        opening_line: "I've analyzed the degradation rates of Tier 1 vs Tier 2 panels. Why should I trust your efficiency numbers?",
        briefing: "Goal: Build trust with a data-driven homeowner.\n\nKey Concepts:\n1. Production Guarantees are your safety net.\n2. Tier 1 equipment has standard degradation (<0.5%/year).\n3. Avoid fluff; use numbers and spec sheets.\n\nTip: Validate their research. Say 'That's a great question, let's look at the spec sheet together.'",
        valid_responses: ["degradation", "warranty", "spec sheet", "production guarantee"]
    },
    "lease_1": {
        id: "lease_1",
        name: "The Lease Objector",
        description: "Customer hates leases and only wants to own.",
        difficulty: "Hard",
        opening_line: "I will NEVER put a lien on my house. I only want to buy cash. Do not talk to me about a PPA.",
        briefing: "Goal: De-escalate and explain the PPA structure correctly.\n\nKey Concepts:\n1. A PPA is NOT a lien; it's a fixture filing (UCC-1).\n2. Focus on 'Performance' vs 'Ownership' risks.\n3. Explain transferability (it moves with the house).\n\nTip: Don't argue. Pivot to 'I understand completely. Let's look at why 80% of our neighbors chose this program...'",
        valid_responses: ["lien", "UCC-1", "transferable", "ownership"]
    },
    "exam_1": {
        id: "exam_1",
        name: "The Final Boss",
        description: "CERTIFICATION EXAM: A difficult homeowner with multiple objections.",
        difficulty: "Expert",
        opening_line: "I've talked to 3 other companies, and frankly, I'm not convinced any of you are telling the truth about these 'savings'. It sounds like a scam.",
        briefing: "⚠️ CERTIFICATION EXAM ⚠️\n\nThis is your final test. The homeowner is hostile and skeptical.\n\nYou must:\n1. Build Trust (Empathy/Validation).\n2. Address the 'Scam' objection (Social Proof/Stats).\n3. Pivot to Value (ROI/Protection).\n\nTo PASS, you must address ALL three points in your response.",
        valid_responses: ["trust", "scam", "neighbors", "ROI", "protection"]
    },
    "discovery_1": {
        id: "discovery_1",
        name: "Deep Discovery Practice",
        description: "Homeowner is guarding information. Use 'The 3 Reasons' framework.",
        difficulty: "Easy",
        opening_line: "I don't have much time. What are you selling?",
        briefing: "Goal: Switch from 'Selling' to 'Consulting'.\n\nKey Concepts:\n1. Use the '3 Reasons' framework to anchor the conversation.\n2. Ask open-ended questions (Who, What, How).\n3. Do NOT mention product/panels yet.\n\nTip: Say 'I'm not here to sell panels. I'm here to see if your home qualifies for the 3 Reasons...'",
        valid_responses: ["3 reasons", "consulting", "qualify"]
    },
    "referral_ask": {
        id: "referral_ask",
        name: "The Referral Ask",
        description: "Practice asking for introductions at the moment of happiness.",
        difficulty: "Hard",
        opening_line: "This has been great, I'm really excited about the savings. Thanks for your help.",
        briefing: "Goal: Turn 1 sale into 3.\n\nKey Concepts:\n1. Strike while the iron is hot (Moment of Happiness).\n2. Be specific: Ask for 'neighbors' or 'family', not 'anyone'.\n3. Use the 'Cloverleaf' concept.\n\nTip: 'I'm glad you're happy! Most of my business comes from neighbors... who in the neighborhood should I talk to next?'",
        valid_responses: ["neighbors", "family", "cloverleaf", "review"]
    },
    "not_interested": {
        id: "not_interested",
        name: "Simulation: Not Interested",
        description: "Quick shut-down at the door.",
        difficulty: "Easy",
        opening_line: "We're not interested, thanks. (Starts closing door)",
        briefing: "You are a busy homeowner who gets knocked on constantly. You are polite but firm.\n\nGoal for User: Use a 'Pattern Interrupt' to stop the door from closing.",
        valid_responses: ["why i'm here", "pattern interrupt", "just stopped by"]
    },
    "busy_objection": {
        id: "busy_objection",
        name: "Simulation: I'm Busy",
        description: "Homeowner is rushing out.",
        difficulty: "Easy",
        opening_line: "I'm literally walking out the door to pick up my kids. I can't talk.",
        briefing: "You are a frantic parent running late. You physically cannot talk right now.\n\nGoal for User: Do NOT pitch. Pivot immediately to a 'Go-Back' time.",
        valid_responses: ["go back", "come back", "what time", "6pm"]
    },
    "price_shopper": {
        id: "price_shopper",
        name: "Simulation: The Price Shopper",
        description: "Abrasive 'Bull' personality demanding price.",
        difficulty: "Hard",
        opening_line: "Look, just give me the price using the cheapest panels you have. I don't need a presentation.",
        briefing: "You are a 'Bull' personality. You think salespeople are liars. You want the bottom line immediately.\n\nGoal for User: Deflect. 'I can't give you a price until I know if you qualify.'",
        valid_responses: ["qualify", "can't give price", "depends", "usage"]
    },
    "debt_fear": {
        id: "debt_fear",
        name: "Simulation: Debt Fear",
        description: "Fear of long-term loans.",
        difficulty: "Medium",
        opening_line: "I worked hard to be debt-free. I am not taking on a $40,000 loan for 25 years.",
        briefing: "You are financially conservative and hate debt.\n\nGoal for User: Reframe. Explain the 'Bill Swap'. You are already in debt to the utility company forever.",
        valid_responses: ["bill swap", "rent vs own", "liability", "asset"]
    },
    "bad_experience": {
        id: "bad_experience",
        name: "Simulation: Bad Experience",
        description: "Neighbor got burned.",
        difficulty: "Medium",
        opening_line: "My neighbor got solar and his roof leaked and he's still paying an electric bill. I don't trust it.",
        briefing: "You are scared because of a horror story. You need trust.\n\nGoal for User: Isolate & Differentiate. 'Who did they go with?' Explain how we are different.",
        valid_responses: ["who was it", "warranty", "guarantee", "different"]
    },
    "price_objection": {
        id: "price_objection",
        name: "Simulation: Price Objection",
        description: "It's too expensive.",
        difficulty: "Medium",
        opening_line: "I just don't think I can afford another bill right now. It seems too expensive.",
        briefing: "You are value-conscious. You think this is an 'Extra' bill.\n\nGoal for User: Feel-Felt-Found. Validate the fear, then show it's a substitution, not an addition.",
        valid_responses: ["feel", "felt", "found", "substitute", "replace"]
    },
    "stalling_objection": {
        id: "stalling_objection",
        name: "Simulation: Stalling",
        description: "I need to think about it.",
        difficulty: "Medium",
        opening_line: "This sounds good, but I really need to take some time to think about it.",
        briefing: "You are afraid of making a bad decision. You are procrastinating.\n\nGoal for User: Decision Matrix. 'What is the cost of waiting?'",
        valid_responses: ["cost of waiting", "decision matrix", "utility rates"]
    },
    "moving_objection": {
        id: "moving_objection",
        name: "Simulation: Moving Soon",
        description: "I might move in 5 years.",
        difficulty: "Hard",
        opening_line: "We might be moving in 3 or 4 years, so I don't want to be stuck with this long contract.",
        briefing: "You view the contract as an anchor. You don't want to complicate your home sale.\n\nGoal for User: Explain 'Asset Transfer'. Solar increases home value (Zillow: +4%).",
        valid_responses: ["asset", "value", "transfer", "zillow", "equity"]
    },
    // --- ENHANCED CURRICULUM SCENARIOS (7-Day Accelerator) ---
    "guarded_gloria": {
        id: "guarded_gloria",
        name: "Guarded Gloria",
        description: "Day 2: Distrustful homeowner burned by contractors. Tests recognizing distrust signals.",
        difficulty: "Medium",
        opening_line: "No offense, but you're the third solar guy this month. The last one lied about our savings. I'm not falling for it again.",
        briefing: "Goal: Recognize distrust signals and reframe without pressure.\n\nKey Concepts:\n1. She's been burned — lead with empathy, not pitch.\n2. Acknowledge past bad experiences before discussing your offer.\n3. Use consultant language: 'I'm not here to sell you anything.'\n\nTip: Say 'I don't blame you at all. Can I ask — what specifically happened?'",
        valid_responses: ["empathy", "understand", "what happened", "not here to sell", "makes sense", "different"]
    },
    "busy_brian": {
        id: "busy_brian",
        name: "Busy Brian",
        description: "Day 2: Time-constrained homeowner. Tests rapid appointment setting.",
        difficulty: "Easy",
        opening_line: "Look, I've got exactly 30 seconds before my Uber gets here. Make it quick or leave a card.",
        briefing: "Goal: Handle micro objection and set appointment rapidly.\n\nKey Concepts:\n1. Do NOT pitch — deliver a 10-second value hook.\n2. Immediately pivot to scheduling: 'Thursday at 6 or Saturday at 10?'\n3. Respect his time — being brief builds more trust.\n\nTip: 'Totally get it — just helping your neighbor save $150/month. When's a better time?'",
        valid_responses: ["quick", "neighbor", "thursday", "saturday", "when works", "better time", "appointment"]
    },
    "burned_beth": {
        id: "burned_beth",
        name: "Burned Beth",
        description: "Day 3: Homeowner burned by previous contractor. Tests empathy-first trust rebuilding.",
        difficulty: "Hard",
        opening_line: "We had a contractor two years ago who promised us the moon and left us with a leaking roof and a system that doesn't produce half of what they said. Why would I trust you?",
        briefing: "Goal: Lead with empathy, rebuild trust through pacing.\n\nKey Concepts:\n1. Do NOT defend the industry immediately.\n2. Label her emotion: 'It sounds like that experience was really frustrating.'\n3. Differentiate through action: offer a free system audit.\n\nTip: 'I'm genuinely sorry that happened. Would it help if I took a look at your current system — no charge?'",
        valid_responses: ["sorry", "understand", "frustrating", "look at system", "audit", "warranty", "manufacturer"]
    },
    "analytical_alan": {
        id: "analytical_alan",
        name: "Analytical Alan",
        description: "Day 3: Owl personality with extensive research. Tests technical credibility.",
        difficulty: "Hard",
        opening_line: "I've been researching this for 6 months. I have a spreadsheet comparing 5 companies. Can you explain your panel degradation coefficient and how your production estimates account for soiling losses?",
        briefing: "Goal: Establish technical credibility, then redirect toward a decision.\n\nKey Concepts:\n1. Validate his research — 'That's thorough.'\n2. Answer with specifics: degradation ~0.5%/yr, soiling loss 2-5%.\n3. Pivot: 'You clearly know the tech. The real question is — which option gives you the best financial outcome?'\n\nTip: Don't compete on specs — compete on decision clarity.",
        valid_responses: ["degradation", "0.5%", "soiling", "thorough", "financial outcome", "decision", "spreadsheet"]
    },
    "busy_bob": {
        id: "busy_bob",
        name: "Busy Bob",
        description: "Day 3: Time-conscious homeowner. Tests efficient discovery conversation.",
        difficulty: "Medium",
        opening_line: "Yeah, come in, but I've got a call in 20 minutes so let's keep this moving. What do you need from me?",
        briefing: "Goal: Manage a time-conscious discovery conversation efficiently.\n\nKey Concepts:\n1. 'I respect your time — let's see if this makes sense in 15 minutes.'\n2. Use condensed discovery: Questions 1, 3, 9, and 10.\n3. If qualified, set full presentation appointment.\n\nTip: Speed = trust with Bull personalities.",
        valid_responses: ["respect time", "15 minutes", "makes sense", "full picture", "this week", "quick version"]
    },
    "friendly_frank": {
        id: "friendly_frank",
        name: "Friendly Frank",
        description: "Day 3: Lion personality, warm but avoids commitment. Tests steering toward decision.",
        difficulty: "Medium",
        opening_line: "Hey, come on in! Want some coffee? My wife makes great coffee. So you're the solar guy — my buddy Mike said you were coming. Tell me everything!",
        briefing: "Goal: Steer a friendly but non-committal homeowner toward a decision.\n\nKey Concepts:\n1. Rapport is easy — the challenge is getting to business.\n2. After 5 min rapport, bridge to discovery.\n3. Close assumptively: 'Mike's install is next month — want yours done around the same time?'\n\nTip: Lions will talk forever. Guide the conversation — don't let rapport replace discovery.",
        valid_responses: ["mike", "bill", "neighbor", "story", "next month", "same time", "discovery"]
    },
    "solar_sam": {
        id: "solar_sam",
        name: "Solar Sam",
        description: "Day 3: Already has solar. Tests referral pivot and upsell.",
        difficulty: "Medium",
        opening_line: "Oh yeah, we already went solar two years ago. The system's fine. Not sure why you're knocking.",
        briefing: "Goal: Turn an existing solar customer into a referral or upsell opportunity.\n\nKey Concepts:\n1. Don't leave — warm lead for referrals and battery upsell.\n2. Check satisfaction, then referral ask.\n3. Orphan owner check: 'Is your original rep still around?'\n\nTip: Existing solar homes are the easiest referral sources if you lead with service.",
        valid_responses: ["happy", "production", "referral", "neighbors", "rep still around", "battery", "upgrade"]
    },
    "loyal_linda": {
        id: "loyal_linda",
        name: "Loyal Linda",
        description: "Day 3: Trusts utility company. Tests non-confrontational education.",
        difficulty: "Medium",
        opening_line: "I've been with the electric company for 30 years and they've never done me wrong. I don't see why I'd switch to something else.",
        briefing: "Goal: Educate without confronting her loyalty to the utility.\n\nKey Concepts:\n1. Do NOT attack the utility.\n2. 'Have you noticed your rates changing over time?'\n3. Position solar as complementary: 'You keep the utility as backup.'\n\nTip: 'Solar just means you're not 100% dependent on their prices anymore.'",
        valid_responses: ["rates", "gone up", "not attacking", "still have utility", "your own power", "complement", "backup"]
    },
    "reluctant_rosa": {
        id: "reluctant_rosa",
        name: "Reluctant Rosa",
        description: "Day 3: Deflecting, avoidant homeowner. Tests mirroring and labeling.",
        difficulty: "Hard",
        opening_line: "I don't know... it's just... we're not really looking at that right now. Maybe later. I'll call you.",
        briefing: "Goal: Use tactical empathy to uncover the real objection.\n\nKey Concepts:\n1. Mirror: 'Not right now?' (Silence.)\n2. Label: 'It seems like there's something specific making you hesitate.'\n3. 'What would need to change for this to be the right time?'\n\nTip: The real objection is never the first one. Dig gently.",
        valid_responses: ["not right now", "what's holding", "seems like", "hesitate", "what would change", "real concern"]
    },
    "garcia_household": {
        id: "garcia_household",
        name: "The Garcia Household",
        description: "Day 3: Bull husband + Turtle wife. Tests dual-spouse dynamics.",
        difficulty: "Expert",
        opening_line: "(Husband, arms crossed) Alright, you've got 10 minutes. Show me the numbers. (Wife, sitting back) I just want to make sure we're not rushing into anything...",
        briefing: "Goal: Navigate dual-spouse dynamics with opposing personality types.\n\nKey Concepts:\n1. Mr. Garcia: Bull — wants numbers fast.\n2. Mrs. Garcia: Turtle — needs safety and time.\n3. Address BOTH or the deal dies.\n4. Use discovery Question 9 early.\n\nTip: Watch the quiet spouse's body language — crossed arms = unaddressed concern.",
        valid_responses: ["both spouses", "numbers", "comfortable", "cancel", "zero risk", "body language", "mrs garcia"]
    },
    "skeptical_steve": {
        id: "skeptical_steve",
        name: "Skeptical Steve",
        description: "Day 4: Questions rate structure assumptions. Tests data-based objection handling.",
        difficulty: "Hard",
        opening_line: "Your proposal says I'll save $45,000 over 25 years based on a 5% utility escalation rate. That seems aggressive. What if rates only go up 2%? Your whole pitch falls apart.",
        briefing: "Goal: Address data-based objections with conservative projections.\n\nKey Concepts:\n1. Show pessimistic (2%), realistic (4%), and optimistic (6%) scenarios.\n2. Historical average: 4.3% over 20 years.\n3. Position solar as a hedge against whatever rates do.\n\nTip: Conservative projections build more trust than best-case scenarios.",
        valid_responses: ["three scenarios", "conservative", "historical", "2%", "hedge", "insurance", "break-even"]
    },
    "numbers_nancy": {
        id: "numbers_nancy",
        name: "Numbers Nancy",
        description: "Day 4: Owl who interrupts with rapid-fire questions. Tests presentation flow management.",
        difficulty: "Hard",
        opening_line: "Wait — before you go further. What's the watt-per-dollar ratio? And what's your cost per kWh over the life of the system? Also, is that pre-tax or post-tax credit?",
        briefing: "Goal: Manage mid-presentation interruptions while maintaining flow.\n\nKey Concepts:\n1. Acknowledge and park: 'Great question — I'll cover that in Phase 3.'\n2. Give her something to hold — a spec sheet.\n3. Close with the Decision Matrix — it's her language.\n\nTip: 'I have a 6-step process. After step 6, I'll answer every remaining question.'",
        valid_responses: ["great question", "cover that", "cost per kwh", "phase 3", "spec sheet", "6 steps", "decision matrix"]
    },
    "stalling_stan": {
        id: "stalling_stan",
        name: "Stalling Stan",
        description: "Day 5: Multiple stacked objections hiding the real one. Tests identifying real objection.",
        difficulty: "Hard",
        opening_line: "I like the numbers, but I need to talk to my brother-in-law who works in construction. Also, I want to wait until the spring when rates are lower. And I'm not sure about the roof warranty. Can you just email me the proposal?",
        briefing: "Goal: Identify the real objection beneath a stack of stated ones.\n\nKey Concepts:\n1. Multiple objections at once = smokescreen.\n2. 'If we solve that, are you ready to move forward?'\n3. 'Between us — what's the one thing really holding you back?'\n\nTip: 'If your brother-in-law said it looks good, would you move forward today?'",
        valid_responses: ["real concern", "if we solve", "between us", "holding back", "move forward", "one thing"]
    },
    "hesitant_helen": {
        id: "hesitant_helen",
        name: "Hesitant Helen",
        description: "Day 5: Influenced by skeptical third party. Tests managing interference.",
        difficulty: "Hard",
        opening_line: "So I was really excited after our meeting, but then I talked to my sister and she said solar companies are all scams and I should wait for the technology to get better. Now I'm not sure.",
        briefing: "Goal: Handle third-party influence and rebuild confidence.\n\nKey Concepts:\n1. Don't attack the sister — she cares about Helen.\n2. 'What specifically did she say that concerned you?'\n3. Remind her of HER reasons: 'Your $280 July bill was the last straw.'\n\nTip: The decision was already made. You're reigniting her motivation.",
        valid_responses: ["sister cares", "what specifically", "your reasons", "280 bill", "talk to sister", "proven technology"]
    },
    "post_install_patricia": {
        id: "post_install_patricia",
        name: "Post-Install Patricia",
        description: "Day 6: Happy customer. Tests natural referral asking.",
        difficulty: "Easy",
        opening_line: "Oh my gosh, the panels look amazing! And I already got my first bill — it was only $14! I can't believe it actually works!",
        briefing: "Goal: Ask for referrals at the Moment of Happiness.\n\nKey Concepts:\n1. She's euphoric — the perfect moment.\n2. 'Who else on the street would love to see a bill like that?'\n3. Offer referral incentive: '$500 for anyone who goes solar through you.'\n\nTip: Get names and permission: 'Can I say Patricia sent me?'",
        valid_responses: ["incredible", "who else", "neighbors", "500", "review", "patricia sent me", "referral"]
    },
    "rodriguez_family": {
        id: "rodriguez_family",
        name: "The Rodriguez Family",
        description: "Day 6: Complex scenario with multiple challenges. Tests composure under pressure.",
        difficulty: "Expert",
        opening_line: "(Mr. Rodriguez) We got quotes from Tesla and Sunrun already. (Mrs. Rodriguez) And my mother says it's a scam. (Teenager walks in) Dad, the internet's out again — can solar fix that? (Dog barking in background)",
        briefing: "Goal: Manage chaos, address multiple stakeholders, maintain composure.\n\nKey Concepts:\n1. Address teen warmly, acknowledge competitors.\n2. 'What specifically did she hear?' for mother's concern.\n3. 'Mind if we sit at the table so I can show you both the numbers?'\n\nTip: The rep who stays calm in chaos wins.",
        valid_responses: ["homework", "different", "understand", "specifically", "table", "both", "calm", "next step"]
    }
}

/**
 * Get scenarios by their IDs, using local fallback data.
 * This function is used when the backend API is unreachable.
 */
export function getScenariosByIds(ids: string[]): Scenario[] {
    return ids
        .map(id => SCENARIOS[id])
        .filter(Boolean)
}
