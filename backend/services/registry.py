"""
White-Label Variable Registry
Centralized source of truth for allowed template variables.
"""

ALLOWED_VARIABLES = {
    "company_name",
    "crm_name",
    "proposal_tool",
    "door_knocking_tool",
    "financing_options",
    "phone_number",
    "contact_email",
    "address",
    "onboarding_notes"
}

def validate_variable(var_name: str) -> bool:
    """Returns True if the variable is allowed in templates."""
    return var_name in ALLOWED_VARIABLES
