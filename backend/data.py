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
