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
    )
}
