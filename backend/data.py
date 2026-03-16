from models import TenantConfig, StateProfile, Scenario

STATE_KNOWLEDGE_BASE = {
    "CA": StateProfile(
        code="CA",
        name="California",
        metering="NEM 3.0",
        incentives=["SGIP (Battery Rebate)", "30% Federal ITC"],
        critical_keywords=["battery", "storage", "evening usage", "nem 3.0"],
        pitch_focus="Self-consumption. Don't sell to grid, store it."
    ),
    "NY": StateProfile(
        code="NY",
        name="New York",
        metering="Net Metering / VDER",
        incentives=["25% NY State Tax Credit", "MW Block Grant"],
        critical_keywords=["tax credit", "one-to-one", "value stack"],
        pitch_focus="Tax liability offset and grid credits."
    )
}

TENANT_CONFIGS = {
    "1": TenantConfig(
        id="solar_bros_inc",
        name="Solar Bros Inc",
        allowed_states=["CA"],
        brand_tone="Aggressive, high-energy"
    ),
    "2": TenantConfig(
        id="green_future_solutions",
        name="Green Future Solutions",
        allowed_states=["NY", "CA"],
        brand_tone="Consultative, educational"
    )
}

SCENARIOS = {
    "d2d_1": Scenario(
        id="d2d_1",
        name="The Penny Pincher",
        description="Homeowner claims solar is too expensive.",
        difficulty="Medium",
        opening_line="Solar is too expensive. I'll pass.",
        briefing="Goal: Overcome the price objection.\n\nKey Concepts:\n1. Solar is a bill swap, not an extra cost.\n2. Focus on ROI (Return on Investment).\n3. Compare the rising cost of utility power vs. fixed solar payments.\n\nTip: Ask them 'How much did you pay for power last month?' to anchor the cost.",
        valid_responses=["ROI", "savings", "bill swap"]
    ),
    "eng_1": Scenario(
        id="eng_1",
        name="The Skeptical Engineer",
        description="Customer wants technical specs and doubts efficiency claims.",
        difficulty="Hard",
        opening_line="I've analyzed the degradation rates of Tier 1 vs Tier 2 panels. Why should I trust your efficiency numbers?",
        briefing="Goal: Build trust with a data-driven homeowner.\n\nKey Concepts:\n1. Production Guarantees are your safety net.\n2. Tier 1 equipment has standard degradation (<0.5%/year).\n3. Avoid fluff; use numbers and spec sheets.\n\nTip: Validate their research. Say 'That's a great question, let's look at the spec sheet together.'",
        valid_responses=["degradation", "warranty", "spec sheet", "production guarantee"]
    ),
    "lease_1": Scenario(
        id="lease_1",
        name="The Lease Objector",
        description="Customer hates leases and only wants to own. You have to sell the PPA benefits or pivot.",
        difficulty="Hard",
        opening_line="I will NEVER put a lien on my house. I only want to buy cash. Do not talk to me about a PPA.",
        briefing="Goal: De-escalate and explain the PPA structure correctly.\n\nKey Concepts:\n1. A PPA is NOT a lien; it's a fixture filing (UCC-1).\n2. Focus on 'Performance' vs 'Ownership' risks.\n3. Explain transferability (it moves with the house).\n\nTip: Don't argue. Pivot to 'I understand completely. Let's look at why 80% of our neighbors chose this program...'",
        valid_responses=["lien", "UCC-1", "transferable", "ownership"]
    ),
    "exam_1": Scenario(
        id="exam_1",
        name="The Final Boss",
        description="CERTIFICATION EXAM: A difficult homeowner with multiple objections (Price, Trust, Tech).",
        difficulty="Expert",
        opening_line="I've talked to 3 other companies, and frankly, I'm not convinced any of you are telling the truth about these 'savings'. It sounds like a scam.",
        briefing="⚠️ CERTIFICATION EXAM ⚠️\n\nThis is your final test. The homeowner is hostile and skeptical.\n\nYou must:\n1. Build Trust (Empathy/Validation).\n2. Address the 'Scam' objection (Social Proof/Stats).\n3. Pivot to Value (ROI/Protection).\n\nTo PASS, you must address ALL three points in your response.",
        valid_responses=["trust", "scam", "neighbors", "ROI", "protection"]
    ),
    "discovery_1": Scenario(
        id="discovery_1",
        name="Deep Discovery Practice",
        description="Homeowner is guarding information. Use 'The 3 Reasons' framework.",
        difficulty="Easy",
        opening_line="I don't have much time. What are you selling?",
        briefing="Goal: Switch from 'Selling' to 'Consulting'.\n\nKey Concepts:\n1. Use the '3 Reasons' framework to anchor the conversation.\n2. Ask open-ended questions (Who, What, How).\n3. Do NOT mention product/panels yet.\n\nTip: Say 'I'm not here to sell panels. I'm here to see if your home qualifies for the 3 Reasons...'",
        valid_responses=["3 reasons", "consulting", "qualify"]
    ),
    "referral_ask": Scenario(
        id="referral_ask",
        name="The Referral Ask",
        description="Practice asking for introductions at the moment of happiness.",
        difficulty="Hard",
        opening_line="This has been great, I'm really excited about the savings. Thanks for your help.",
        briefing="Goal: Turn 1 sale into 3.\n\nKey Concepts:\n1. Strike while the iron is hot (Moment of Happiness).\n2. Be specific: Ask for 'neighbors' or 'family', not 'anyone'.\n3. Use the 'Cloverleaf' concept.\n\nTip: 'I'm glad you're happy! Most of my business comes from neighbors... who in the neighborhood should I talk to next?'",
        valid_responses=["neighbors", "family", "cloverleaf", "review"]
    ),
    # --- NEW SCENARIOS ---
    "not_interested": Scenario(
        id="not_interested",
        name="Simulation: Not Interested",
        description="Quick shut-down at the door.",
        difficulty="Easy",
        opening_line="We're not interested, thanks. (Starts closing door)",
        briefing="You are a busy homeowner who gets knocked on constantly. You are polite but firm.\n\nGoal for User: Use a 'Pattern Interrupt' (e.g., 'That's exactly why I'm here') to stop the door from closing.",
        valid_responses=["why i'm here", "pattern interrupt", "just stopped by"]
    ),
    "busy_objection": Scenario(
        id="busy_objection",
        name="Simulation: I'm Busy",
        description="Homeowner is rushing out.",
        difficulty="Easy",
        opening_line="I'm literally walking out the door to pick up my kids. I can't talk.",
        briefing="You are a frantic parent running late. You physically cannot talk right now.\n\nGoal for User: Do NOT pitch. Pivot immediately to a 'Go-Back' time. 'No problem, I'll be back at 6pm.'",
        valid_responses=["go back", "come back", "what time", "6pm"]
    ),
    "price_shopper": Scenario(
        id="price_shopper",
        name="Simulation: The Price Shopper",
        description="Abrasive 'Bull' personality demanding price.",
        difficulty="Hard",
        opening_line="Look, just give me the price using the cheapest panels you have. I don't need a presentation.",
        briefing="You are a 'Bull' personality. You think salespeople are liars. You want the bottom line immediately.\n\nGoal for User: Deflect. 'I can't give you a price until I know if you qualify.' Do not give a number.",
        valid_responses=["qualify", "can't give price", "depends", "usage"]
    ),
    "debt_fear": Scenario(
        id="debt_fear",
        name="Simulation: Debt Fear",
        description="Fear of long-term loans.",
        difficulty="Medium",
        opening_line="I worked hard to be debt-free. I am not taking on a $40,000 loan for 25 years.",
        briefing="You are financially conservative and hate debt. You see the solar loan as a 'Liablity'.\n\nGoal for User: Reframe. Explain the 'Bill Swap'. You are already in debt to the utility company forever. This replaces a 100% interest debt (Rent) with a 0% down asset.",
        valid_responses=["bill swap", "rent vs own", "liability", "asset"]
    ),
    "bad_experience": Scenario(
        id="bad_experience",
        name="Simulation: Bad Experience",
        description="Neighbor got burned.",
        difficulty="Medium",
        opening_line="My neighbor got solar and his roof leaked and he's still paying an electric bill. I don't trust it.",
        briefing="You are scared because of a horror story. You need trust.\n\nGoal for User: Isolate & Differentiate. 'Who did they go with?' Explain how we are different (Warranties, Guarantees).",
        valid_responses=["who was it", "warranty", "guarantee", "different"]
    ),
    "price_objection": Scenario(
        id="price_objection",
        name="Simulation: Price Objection",
        description="It's too expensive.",
        difficulty="Medium",
        opening_line="I just don't think I can afford another bill right now. It seems too expensive.",
        briefing="You are value-conscious. You think this is an 'Extra' bill.\n\nGoal for User: Feel-Felt-Found. Validate the fear, then show it's a substitution, not an addition.",
        valid_responses=["feel", "felt", "found", "substitute", "replace"]
    ),
    "stalling_objection": Scenario(
        id="stalling_objection",
        name="Simulation: Stalling",
        description="I need to think about it.",
        difficulty="Medium",
        opening_line="This sounds good, but I really need to take some time to think about it.",
        briefing="You are afraid of making a bad decision. You are procrastinating.\n\nGoal for User: Decision Matrix. 'What is the cost of waiting?' (Paying the utility). Create urgency.",
        valid_responses=["cost of waiting", "decision matrix", "utility rates"]
    ),
    "moving_objection": Scenario(
        id="moving_objection",
        name="Simulation: Moving Soon",
        description="I might move in 5 years.",
        difficulty="Hard",
        opening_line="We might be moving in 3 or 4 years, so I don't want to be stuck with this long contract.",
        briefing="You view the contract as an anchor. You don't want to complicate your home sale.\n\nGoal for User: Explain 'Asset Transfer'. Solar increases home value (Zillow: +4%). It sells the home faster.",
        valid_responses=["asset", "value", "transfer", "zillow", "equity"]
    ),
    
    # --- ENHANCED CURRICULUM SCENARIOS (7-Day Accelerator) ---
    "guarded_gloria": Scenario(
        id="guarded_gloria",
        name="Guarded Gloria",
        description="Day 2: Distrustful homeowner who's been burned by contractors before. Tests recognizing distrust signals and reframing without pressure.",
        difficulty="Medium",
        opening_line="No offense, but you're the third solar guy this month. The last one lied about our savings. I'm not falling for it again.",
        briefing="Goal: Recognize distrust signals and reframe without pressure.\n\nKey Concepts:\n1. She's been burned — lead with empathy, not pitch.\n2. Acknowledge past bad experiences before discussing your offer.\n3. Use consultant language: 'I'm not here to sell you anything. Let's just see if it even makes sense.'\n4. Offer to leave information and follow up — don't push for same-day commitment.\n\nTip: Say 'I don't blame you at all. Can I ask — what specifically happened?' to show you're different.",
        valid_responses=["empathy", "understand", "what happened", "not here to sell", "makes sense", "different"]
    ),
    "busy_brian": Scenario(
        id="busy_brian",
        name="Busy Brian",
        description="Day 2: Time-constrained homeowner rushing out. Tests micro objection handling and rapid appointment setting.",
        difficulty="Easy",
        opening_line="Look, I've got exactly 30 seconds before my Uber gets here. Make it quick or leave a card.",
        briefing="Goal: Handle micro objection and set appointment rapidly.\n\nKey Concepts:\n1. Do NOT pitch — he has no time for a presentation.\n2. Deliver a 10-second value hook: neighbor reference + savings hint.\n3. Immediately pivot to scheduling: 'Thursday at 6 or Saturday at 10?'\n4. Respect his time — being brief builds more trust than being thorough.\n\nTip: 'Totally get it — just helping your neighbor at [address] save $150/month. When's a better time — Thursday evening or Saturday morning?'",
        valid_responses=["quick", "neighbor", "thursday", "saturday", "when works", "better time", "appointment"]
    ),
    "burned_beth": Scenario(
        id="burned_beth",
        name="Burned Beth",
        description="Day 3: Homeowner burned by a previous contractor. Tests empathy-first approach and trust rebuilding.",
        difficulty="Hard",
        opening_line="We had a contractor two years ago who promised us the moon and left us with a leaking roof and a system that doesn't produce half of what they said. Why would I trust you?",
        briefing="Goal: Lead with empathy, rebuild trust through pacing.\n\nKey Concepts:\n1. Do NOT defend the industry or your company immediately.\n2. Label her emotion: 'It sounds like that experience was really frustrating.'\n3. Ask about the specifics — show genuine concern.\n4. Differentiate through action: offer a free system audit, warranties from manufacturers (not installers).\n5. Let her control the pace — no urgency.\n\nTip: 'I'm genuinely sorry that happened. Would it help if I took a look at your current system — no charge — just to see if it's performing correctly?'",
        valid_responses=["sorry", "understand", "frustrating", "look at system", "audit", "warranty", "manufacturer"]
    ),
    "analytical_alan": Scenario(
        id="analytical_alan",
        name="Analytical Alan",
        description="Day 3: Owl personality who's done extensive research. Tests technical credibility and redirecting to decision.",
        difficulty="Hard",
        opening_line="I've been researching this for 6 months. I have a spreadsheet comparing 5 companies. Can you explain your panel degradation coefficient and how your production estimates account for soiling losses?",
        briefing="Goal: Establish technical credibility, then redirect toward a decision.\n\nKey Concepts:\n1. Validate his research — 'That's thorough. Most people don't dig that deep.'\n2. Answer with specifics: degradation ~0.5%/yr, soiling loss 2-5% depending on region.\n3. After 2-3 technical answers, pivot: 'You clearly know the tech. The real question is — which option gives you the best financial outcome?'\n4. Use the Decision Matrix to simplify his comparison.\n\nTip: Don't compete on specs — compete on decision clarity. He has analysis paralysis.",
        valid_responses=["degradation", "0.5%", "soiling", "thorough", "financial outcome", "decision", "spreadsheet"]
    ),
    "busy_bob": Scenario(
        id="busy_bob",
        name="Busy Bob",
        description="Day 3: Homeowner who keeps checking his phone and rushing. Tests managing time-conscious conversations.",
        difficulty="Medium",
        opening_line="Yeah, come in, but I've got a call in 20 minutes so let's keep this moving. What do you need from me?",
        briefing="Goal: Manage a time-conscious discovery conversation efficiently.\n\nKey Concepts:\n1. Acknowledge the constraint: 'I respect your time — let's see if this even makes sense in 15 minutes.'\n2. Use the condensed discovery: focus on Questions 1, 3, 9, and 10 from the 12-question framework.\n3. If it qualifies, set a full presentation appointment: 'The quick version looks great. Can we sit down for 45 minutes this week to show you the full picture?'\n4. Be the rep who respects time — it differentiates you.\n\nTip: Speed = trust with Bull personalities. Fast is professional, slow is suspicious.",
        valid_responses=["respect time", "15 minutes", "makes sense", "full picture", "this week", "quick version"]
    ),
    "friendly_frank": Scenario(
        id="friendly_frank",
        name="Friendly Frank",
        description="Day 3: Lion personality who's warm and engaging but avoids commitment. Tests steering toward commitment.",
        difficulty="Medium",
        opening_line="Hey, come on in! Want some coffee? My wife makes great coffee. So you're the solar guy — my buddy Mike said you were coming. Tell me everything!",
        briefing="Goal: Steer a friendly but non-committal homeowner toward a decision.\n\nKey Concepts:\n1. Rapport is easy with Lions — the challenge is getting to business.\n2. After 5 minutes of rapport, bridge: 'I love the coffee. So Mike mentioned you were frustrated with your electric bill — what's going on?'\n3. Use stories and neighbor examples (Lions love stories).\n4. Close with an assumptive: 'Mike's install is next month — want to get yours done around the same time?'\n\nTip: Lions will talk forever. Guide the conversation — don't let rapport replace discovery.",
        valid_responses=["mike", "bill", "neighbor", "story", "next month", "same time", "discovery"]
    ),
    "solar_sam": Scenario(
        id="solar_sam",
        name="Solar Sam",
        description="Day 3: Already has solar installed. Tests discovery with existing customer and referral pivot.",
        difficulty="Medium",
        opening_line="Oh yeah, we already went solar two years ago. The system's fine. Not sure why you're knocking.",
        briefing="Goal: Turn an existing solar customer into a referral or upsell opportunity.\n\nKey Concepts:\n1. Don't leave — this is a warm lead for referrals and battery upsell.\n2. Check satisfaction: 'Great! Are you happy with it? How's the production been?'\n3. If happy → referral ask: 'Who else on the street is still paying full price to the utility?'\n4. If system is underperforming → service opportunity + possible system upgrade.\n5. Orphan owner check: 'Is your original rep still around if you need something?'\n\nTip: Existing solar homes are the easiest referral sources if you lead with service.",
        valid_responses=["happy", "production", "referral", "neighbors", "rep still around", "battery", "upgrade"]
    ),
    "loyal_linda": Scenario(
        id="loyal_linda",
        name="Loyal Linda",
        description="Day 3: Trusts her utility company deeply. Tests non-confrontational education and rate history framing.",
        difficulty="Medium",
        opening_line="I've been with the electric company for 30 years and they've never done me wrong. I don't see why I'd switch to something else.",
        briefing="Goal: Educate without confronting her loyalty to the utility.\n\nKey Concepts:\n1. Do NOT attack the utility — she's loyal and will defend them.\n2. Reframe: 'You're right, they've been reliable. Have you noticed your rates changing over time?'\n3. Show rate history: 'Rates have gone up 47% in the last 10 years. That's not their fault — it's the market.'\n4. Position solar as complementary: 'You keep the utility as backup, but you produce most of your own power.'\n5. Use the 'landlord' analogy gently.\n\nTip: 'You'll still have the utility — solar just means you're not 100% dependent on their prices anymore.'",
        valid_responses=["rates", "gone up", "not attacking", "still have utility", "your own power", "complement", "backup"]
    ),
    "reluctant_rosa": Scenario(
        id="reluctant_rosa",
        name="Reluctant Rosa",
        description="Day 3: Deflecting and avoidant homeowner. Tests mirroring, labeling, and uncovering the real objection.",
        difficulty="Hard",
        opening_line="I don't know... it's just... we're not really looking at that right now. Maybe later. I'll call you.",
        briefing="Goal: Use tactical empathy to uncover the real objection beneath the deflection.\n\nKey Concepts:\n1. She's not saying no — she's avoiding the decision.\n2. Mirror: 'Not right now?' (Silence. Let her fill the gap.)\n3. Label: 'It seems like there's something specific that's making you hesitate.'\n4. Calibrated question: 'What would need to change for this to be the right time?'\n5. Common hidden objections: spouse, credit, previous bad experience, or simply fear.\n\nTip: The real objection is never the first one. Dig gently using Chris Voss techniques.",
        valid_responses=["not right now", "what's holding", "seems like", "hesitate", "what would change", "real concern"]
    ),
    "garcia_household": Scenario(
        id="garcia_household",
        name="The Garcia Household",
        description="Day 3: Mixed couple — Bull husband + Turtle wife. Tests full discovery and dual-spouse dynamics.",
        difficulty="Expert",
        opening_line="(Husband, arms crossed) Alright, you've got 10 minutes. Show me the numbers. (Wife, sitting back) I just want to make sure we're not rushing into anything...",
        briefing="Goal: Navigate dual-spouse dynamics with opposing personality types.\n\nKey Concepts:\n1. Mr. Garcia is a Bull — wants bottom-line numbers fast.\n2. Mrs. Garcia is a Turtle — needs safety, assurance, and time.\n3. You must address BOTH or the deal dies. Don't default to the louder spouse.\n4. To Mr. Garcia: 'Your bill is $220. Solar payment: $165. That's $55/month in your pocket from day one.'\n5. To Mrs. Garcia: 'I want to make sure you're comfortable. You have a 3-day right to cancel — zero risk.'\n6. Use discovery Question 9 early: 'Who else needs to be part of this decision?'\n\nTip: Watch for the quiet spouse's body language — crossed arms, looking away, checking phone = unaddressed concern.",
        valid_responses=["both spouses", "numbers", "comfortable", "cancel", "zero risk", "body language", "mrs garcia"]
    ),
    "skeptical_steve": Scenario(
        id="skeptical_steve",
        name="Skeptical Steve",
        description="Day 4: Analytical homeowner who questions rate structure assumptions. Tests data-based objection handling.",
        difficulty="Hard",
        opening_line="Your proposal says I'll save $45,000 over 25 years based on a 5% utility escalation rate. That seems aggressive. What if rates only go up 2%? Your whole pitch falls apart.",
        briefing="Goal: Address data-based objections with honest, conservative projections.\n\nKey Concepts:\n1. Acknowledge the valid point: 'That's a fair challenge. Let me show you three scenarios.'\n2. Show pessimistic (2%), realistic (4%), and optimistic (6%) projections.\n3. Historical data: 'Over the last 20 years, the national average has been 4.3%.'\n4. Even at 2%: solar still saves money — the break-even just moves from year 7 to year 10.\n5. Position solar as a hedge: 'It's insurance against whatever rates do.'\n\nTip: Conservative projections build more trust than best-case scenarios with Owl personalities.",
        valid_responses=["three scenarios", "conservative", "historical", "2%", "hedge", "insurance", "break-even"]
    ),
    "numbers_nancy": Scenario(
        id="numbers_nancy",
        name="Numbers Nancy",
        description="Day 4: Owl personality who interrupts your presentation with rapid-fire questions. Tests presentation flow management.",
        difficulty="Hard",
        opening_line="Wait — before you go further. What's the watt-per-dollar ratio? And what's your cost per kWh over the life of the system? Also, is that pre-tax or post-tax credit?",
        briefing="Goal: Manage mid-presentation interruptions while maintaining flow.\n\nKey Concepts:\n1. Don't get derailed — acknowledge and park: 'Great question — I'll cover that in the financial comparison section.'\n2. If she insists: answer briefly and bridge back: 'The cost per kWh is about 8 cents versus utility's 18 cents. I'll show you the full breakdown in Phase 3.'\n3. Give her something to hold — a printed spec sheet or leave-behind she can review.\n4. Match her energy: be precise, avoid rounded numbers.\n5. Close with the Decision Matrix — it's her language.\n\nTip: Owls respect structure. Say: 'I have a 6-step process. After step 6, I'll answer every remaining question.'",
        valid_responses=["great question", "cover that", "cost per kwh", "phase 3", "spec sheet", "6 steps", "decision matrix"]
    ),
    "stalling_stan": Scenario(
        id="stalling_stan",
        name="Stalling Stan",
        description="Day 5: Homeowner with multiple stacked objections hiding the real one. Tests identifying the real objection.",
        difficulty="Hard",
        opening_line="I like the numbers, but I need to talk to my brother-in-law who works in construction. Also, I want to wait until the spring when rates are lower. And I'm not sure about the roof warranty. Can you just email me the proposal?",
        briefing="Goal: Identify the real objection beneath a stack of stated ones.\n\nKey Concepts:\n1. Multiple objections at once = smokescren. None of these are the real issue.\n2. Technique: Address one, then ask: 'If we solve that, are you ready to move forward?'\n3. If they add ANOTHER objection → the real issue hasn't surfaced yet.\n4. Ask directly: 'I hear you on all of those. Between us — what's the one thing that's really holding you back?'\n5. Common hidden objections: credit concern, spouse disagreement, fear of commitment.\n\nTip: 'If your brother-in-law said it looks good, would you move forward today?' If yes — it's the real issue. If they add another excuse — keep digging.",
        valid_responses=["real concern", "if we solve", "between us", "holding back", "move forward", "one thing"]
    ),
    "hesitant_helen": Scenario(
        id="hesitant_helen",
        name="Hesitant Helen",
        description="Day 5: Homeowner influenced by skeptical third party. Tests managing third-party interference and reinforcing confidence.",
        difficulty="Hard",
        opening_line="So I was really excited after our meeting, but then I talked to my sister and she said solar companies are all scams and I should wait for the technology to get better. Now I'm not sure.",
        briefing="Goal: Handle third-party influence and rebuild confidence post-close.\n\nKey Concepts:\n1. Don't attack the sister — she's trying to protect Helen.\n2. Label: 'It sounds like your sister really cares about you making a good decision.'\n3. Ask: 'What specifically did she say that concerned you?' (Isolate the objection.)\n4. Counter with facts: '2 million US homes have solar. The technology is proven.'\n5. Remind her of HER reasons: 'When we met, you said your $280 bill in July was the last straw. Has that changed?'\n6. Offer: 'Would it help if I talked with your sister? I'm happy to answer her questions.'\n\nTip: The decision was already made emotionally. You're reigniting her original motivation.",
        valid_responses=["sister cares", "what specifically", "your reasons", "280 bill", "talk to sister", "proven technology"]
    ),
    "post_install_patricia": Scenario(
        id="post_install_patricia",
        name="Post-Install Patricia",
        description="Day 6: Happy customer after installation. Tests natural referral asking technique.",
        difficulty="Easy",
        opening_line="Oh my gosh, the panels look amazing! And I already got my first bill — it was only $14! I can't believe it actually works!",
        briefing="Goal: Ask for referrals naturally at the Moment of Happiness.\n\nKey Concepts:\n1. This is the PERFECT moment — she's euphoric.\n2. Celebrate with her: 'That's incredible! From $200 to $14 — you're basically printing money now!'\n3. Transition naturally: 'Who else on the street do you think would love to see a bill like that?'\n4. Be specific: ask about neighbors BY STREET, not 'anyone you know.'\n5. Offer the referral incentive: '$500 for anyone who goes solar through you.'\n6. Ask for a Google review while she's happy.\n\nTip: Get names and permission: 'Can I say Patricia sent me?' The warm intro makes the next sale 5x easier.",
        valid_responses=["incredible", "who else", "neighbors", "500", "review", "patricia sent me", "referral"]
    ),
    "rodriguez_family": Scenario(
        id="rodriguez_family",
        name="The Rodriguez Family",
        description="Day 6: Complex scenario with multiple simultaneous challenges. Tests full appointment management and composure under pressure.",
        difficulty="Expert",
        opening_line="(Mr. Rodriguez) We got quotes from Tesla and Sunrun already. (Mrs. Rodriguez) And my mother says it's a scam. (Teenager walks in) Dad, the internet's out again — can solar fix that? (Dog barking in background)",
        briefing="Goal: Manage chaos, address multiple stakeholders, and maintain composure.\n\nKey Concepts:\n1. Chaos is normal — most real appointments look like this.\n2. Address the teen warmly: 'Ha! Solar can save money for better WiFi though.'\n3. Acknowledge competitors: 'Great — you've done your homework. Let me show you what makes us different.'\n4. Address the mother (through Mrs. Rodriguez): 'I totally understand her concern. What specifically did she hear?'\n5. Manage the environment: 'Mind if we sit at the table so I can show you both the numbers side by side?'\n6. You must close or set a firm next step despite the chaos.\n\nTip: The rep who stays calm in chaos wins. Don't try to eliminate distractions — work through them with humor and professionalism.",
        valid_responses=["homework", "different", "understand", "specifically", "table", "both", "calm", "next step"]
    ),

    # --- ADVANCED SCENARIOS (BONUS CONTENT) ---
    "misinformed_engineer": Scenario(
        id="misinformed_engineer",
        name="The Misinformed Engineer",
        description="Engineer with outdated technical knowledge and conspiracy theories.",
        difficulty="Hard",
        opening_line="Oh, solar? Yeah, I've been looking into that. I actually just read a study that said panels lose 50% efficiency after 5 years. Plus, the grid can't handle the feedback voltage. Are you guys aware of that?",
        briefing="ADVANCED: Homeowner has consumed misinformation from outdated sources. He's mixing real technical terms with false data.\n\nGoal: Correct without insulting his intelligence. Use data to gently correct (e.g., 'That 50% number was from 1980s panels. Modern panels degrade 0.5% per year'). Transition from technical debate to financial benefit.",
        valid_responses=["degradation", "0.5%", "modern panels", "spec sheet", "production guarantee", "financial benefit"]
    ),
    "rushed_parent": Scenario(
        id="rushed_parent",
        name="The Rushed Parent",
        description="Overwhelmed parent with 60 seconds before chaos erupts.",
        difficulty="Moderate",
        opening_line="Hi, sorry, this really isn't a good time. I just got home and I have to get dinner started. What's this about?",
        briefing="ADVANCED: Homeowner is actually interested but literally has 60 seconds.\n\nGoal: Respect time while planting a seed. Deliver 10-second value hook. Secure permission for follow-up (specific time). Exit gracefully without being pushy.",
        valid_responses=["bad timing", "follow-up", "specific time", "leave card", "call back", "when works"]
    ),
    "skeptical_accountant": Scenario(
        id="skeptical_accountant",
        name="The Skeptical Accountant",
        description="CPA who analyzes numbers for a living, hyper-vigilant for tricks.",
        difficulty="Advanced",
        opening_line="Okay, I've got your proposal here. Before we go further, I need to understand the assumptions in this ROI calculation. What's the escalation rate you're using for electricity prices?",
        briefing="ADVANCED: Homeowner will find flaws in any projection because that's his job. He's genuinely risk-averse and needs bulletproof logic.\n\nGoal: Provide conservative estimates, not best-case. Show multiple financial models (pessimistic, realistic, optimistic). Use third-party data sources. Position solar as risk mitigation.",
        valid_responses=["conservative", "escalation rate", "IRR", "third-party", "risk mitigation", "multiple models"]
    ),
    "grieving_widow": Scenario(
        id="grieving_widow",
        name="The Grieving Widow",
        description="Emotionally fragile homeowner making decisions alone after loss.",
        difficulty="Advanced",
        opening_line="Hi... yes, I remember you came by. My husband was really excited about this. He handled all the house stuff. I'm just not sure I can make a decision like this on my own right now.",
        briefing="ADVANCED: This is NOT a sales objection—it's grief. Requires emotional intelligence.\n\nGoal: Lead with empathy, not urgency. Offer to include a trusted family member. Simplify the process. Give her permission to say 'not yet' without pressure. Position solar as honoring his wishes (if appropriate).",
        valid_responses=["empathy", "family member", "take your time", "no pressure", "support", "honoring"]
    ),
    "hoa_nightmare": Scenario(
        id="hoa_nightmare",
        name="The HOA Nightmare",
        description="Homeowner defeated by strict HOA, previous solar applications denied.",
        difficulty="Hard",
        opening_line="Look, I'd love to go solar, but my HOA rejected my neighbor's application last year. They said the panels were 'aesthetically inconsistent with community standards.' I'm not going through that headache.",
        briefing="ADVANCED: Homeowner has given up before trying. Rep must reframe HOA as solvable, not a dead end.\n\nGoal: Acknowledge frustration without badmouthing HOA. Cite Solar Rights Act (state-specific). Offer to handle HOA application. Show examples of approved systems in similar communities. Position as 'HOA navigator'.",
        valid_responses=["solar rights", "handle application", "approved systems", "navigator", "state law", "aesthetics"]
    ),
    "high_intent_procrastinator": Scenario(
        id="high_intent_procrastinator",
        name="The High-Intent Procrastinator",
        description="Genuinely interested with budget, but endless decision paralysis.",
        difficulty="Moderate",
        opening_line="Hey! Yeah, I've been meaning to call you back. I'm still really interested, I just wanted to check one more thing with my brother-in-law. He knows a guy who does solar. I'll get back to you next week for sure.",
        briefing="ADVANCED: There's no real objection—just decision paralysis. Homeowner is waiting for 'perfect certainty' that will never come.\n\nGoal: Identify the real fear (commitment, FOMO, analysis paralysis). Use assumptive close. Create deadline with real consequence. Make next step smaller (schedule install date, can cancel).",
        valid_responses=["what's holding", "deadline", "assumptive", "schedule", "certainty", "one more thing"]
    ),
    "competitor_loyalist": Scenario(
        id="competitor_loyalist",
        name="The Competitor Loyalist",
        description="Already has quote from major national brand, anchored to their price.",
        difficulty="Hard",
        opening_line="Thanks for coming out. So, I've already got a proposal from SunPower. They're offering 25 panels, 10kW system, $28,000 after incentives. What can you do?",
        briefing="ADVANCED: Homeowner is anchored to competitor's price and brand recognition.\n\nGoal: Differentiate without trashing competition or racing to bottom on price. Acknowledge competitor's strengths. Highlight local advantage (faster service, community ties). Show value beyond equipment. Ask questions competitor didn't.",
        valid_responses=["acknowledge", "local advantage", "service", "value beyond", "questions", "differentiate"]
    ),
    "referral_gatekeeper": Scenario(
        id="referral_gatekeeper",
        name="The Referral Gatekeeper",
        description="Thrilled customer who's protective of friends, fears being pushy.",
        difficulty="Moderate",
        opening_line="Oh man, I love it! The crew was great. Referrals? Um... I mean, I could, but I don't want to be that guy who's always pushing stuff on people, you know?",
        briefing="ADVANCED: Homeowner fears being seen as salesy or annoying friends.\n\nGoal: Reframe referrals as helping, not selling. Reframe as 'who do you care about enough to share this with?' Offer to be the 'bad guy' (rep reaches out). Make it easy (text template). Focus on neighbors (they'll see panels anyway).",
        valid_responses=["care about", "helping", "neighbors", "text template", "bad guy", "share"]
    ),
    "analytical_paralysis": Scenario(
        id="analytical_paralysis",
        name="The Analytical Paralysis Couple",
        description="Researching for 18 months with spreadsheets, afraid of commitment.",
        difficulty="Advanced",
        opening_line="Okay, so we've talked to 7 companies now. We have this comparison chart. Can you explain why your inverter efficiency is 96.5% versus the 97.2% from Company B? And what's your position on microinverters versus string inverters for a partially shaded roof?",
        briefing="ADVANCED: No amount of information will satisfy them—they're afraid of commitment.\n\nGoal: Validate their thoroughness, then redirect. Show cost of waiting (lost savings, incentive changes). Simplify decision to 2-3 key factors. Use social proof (neighbors who decided). Create 'decision deadline' framework.",
        valid_responses=["cost of waiting", "simplify", "social proof", "decision deadline", "good enough", "key factors"]
    ),
    "transition_master": Scenario(
        id="transition_master",
        name="The Transition Master Test",
        description="Distracted homeowner gives 30 seconds, tests rapid rapport building.",
        difficulty="Hard",
        opening_line="Yeah, hi. What can I do for you?",
        briefing="ADVANCED: Homeowner will give 30 seconds. Rep must transition from stranger to trusted advisor in record time.\n\nGoal: Earn permission to continue conversation. Transition from pitch to dialogue. Ask question that makes them think. Create curiosity gap. Secure next step (appointment, not sale).",
        valid_responses=["permission", "question", "curiosity", "appointment", "dialogue", "earn"]
    )
}
