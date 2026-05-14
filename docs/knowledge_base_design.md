# State-Specific Knowledge Base Design

This document details how the agent stores, processes, and serves state-specific solar data to the trainee.

## 1. Data Schema
We will use a JSON structure (or SQL tables) to define "State Profiles".

### Example State Profile: California (CA)
```json
{
  "state_code": "CA",
  "name": "California",
  "metering_policy": "NEM 3.0",
  "key_drivers": ["Battery Storage", "Peak Shaving", "Resilience"],
  "avg_electricity_rate": 0.35,
  "incentives": [
    {
      "name": "SGIP",
      "description": "Rebate for battery storage installation.",
      "eligibility": "First-come, first-served basis."
    }
  ],
  "script_adjustments": {
    "savings_pitch": "Don't focus on selling power back to the grid. Focus on storing cheap solar power to use when the grid gets expensive at night.",
    "objection_wait": "If they want to wait, remind them that NEM 2.0 grandfathering is gone, but battery prices might go up."
  }
}
```

### Example State Profile: New York (NY)
```json
{
  "state_code": "NY",
  "name": "New York",
  "metering_policy": "VDER / Hybrid Net Metering",
  "key_drivers": ["Community Solar", "Tax Credits"],
  "avg_electricity_rate": 0.22,
  "incentives": [
    {
      "name": "NYS Tax Credit",
      "description": "25% of system cost up to $5,000.",
      "eligibility": "Primary residence."
    }
  ],
  "script_adjustments": {
    "savings_pitch": "You get a literal dollar-for-dollar offset on your taxes, plus the VDER stack value.",
    "objection_wait": "The state tax credit cap resets every year, but funds are limited."
  }
}
```

## 2. Dynamic Curriculum Logic
The "Roleplay Engine" will inject these variables into the prompt.

*   **Prompt Template**:
    > "You are a homeowner in {state_name}. Your electricity rate is {avg_electricity_rate}/kWh. You are skeptical because you heard solar doesn't pay off anymore.
    >
    > **Trainee Goal**: Explain how {metering_policy} works and why they need {key_drivers[0]}."

## 3. Mandatory Knowledge Checks
Before unlocking the "Sales Floor" simulation, the rep must pass the **State Regulations Quiz**:
1.  *Question*: "Under NEM 3.0 in California, what is the export rate for solar sent to the grid?"
    *   *Answer*: "Wholesale avoided cost (very low), unless sent during peak hours."
2.  *Question*: "In New York, is the 25% tax credit refundable?"
    *   *Answer*: "No, it's a credit against tax liability, but can roll over for 5 years."
