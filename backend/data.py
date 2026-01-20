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
        valid_responses=["ROI", "savings", "bill swap"]
    ),
    "eng_1": Scenario(
        id="eng_1",
        name="The Skeptical Engineer",
        description="Customer wants technical specs and doubts efficiency claims.",
        difficulty="Hard",
        opening_line="I've analyzed the degradation rates of Tier 1 vs Tier 2 panels. Why should I trust your efficiency numbers?",
        valid_responses=["degradation", "warranty", "spec sheet", "production guarantee"]
    ),
    "lease_1": Scenario(
        id="lease_1",
        name="The Lease Objector",
        description="Customer hates leases and only wants to own. You have to sell the PPA benefits or pivot.",
        difficulty="Hard",
        opening_line="I will NEVER put a lien on my house. I only want to buy cash. Do not talk to me about a PPA.",
        valid_responses=["lien", "UCC-1", "transferable", "ownership"]
    )
}
