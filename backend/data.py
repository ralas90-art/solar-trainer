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
    "objection_price": Scenario(
        id="objection_price",
        name="Price Shock",
        description="Homeowner says 'It's too expensive'.",
        difficulty="Medium",
        opening_line="50 thousand dollars?! That is way too expensive. I'm not interested.",
        briefing="Goal: Reframe Cost vs Investment.\n\nKey Concepts:\n1. Acknowledge and Validate (Feel-Felt-Found).\n2. Show the 'Cost of Doing Nothing' (Utility Bill).\n3. Reframe as 'Asset' vs 'Liability'.\n\nTip: 'I felt the same way until I realized I was already paying $60k to the utility company with nothing to show for it.'",
        valid_responses=["feel", "felt", "found", "investment", "utility"]
    ),
    "referral_ask": Scenario(
        id="referral_ask",
        name="The Referral Ask",
        description="Practice asking for introductions at the moment of happiness.",
        difficulty="Hard",
        opening_line="This has been great, I'm really excited about the savings. Thanks for your help.",
        briefing="Goal: Turn 1 sale into 3.\n\nKey Concepts:\n1. Strike while the iron is hot (Moment of Happiness).\n2. Be specific: Ask for 'neighbors' or 'family', not 'anyone'.\n3. Use the 'Cloverleaf' concept.\n\nTip: 'I'm glad you're happy! Most of my business comes from neighbors... who in the neighborhood should I talk to next?'",
        valid_responses=["neighbors", "family", "cloverleaf", "review"]
    )
}
