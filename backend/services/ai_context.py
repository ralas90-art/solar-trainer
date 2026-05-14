from services.whitelabel_engine import WhiteLabelEngine
from models.user import Company

class AIContextService:
    @staticmethod
    def get_company_context_block(company: Company) -> str:
        """
        Generates a rendered markdown block of company settings for AI prompts.
        Uses WhiteLabelEngine to resolve variables and fallbacks.
        """
        
        raw_template = """
### COMPANY_CONTEXT
- Company Name: {{company_name}}
- CRM Tool: {{crm_name}}
- Proposal Tool: {{proposal_tool}}
- Door Knocking App: {{door_knocking_tool}}
- Financing Options: {{financing_options}}
- Support Contact: {{contact_email}}

### OPERATIONAL_NOTES
{{onboarding_notes}}
"""
        
        # Render the template using the WhiteLabelEngine
        # This automatically handles company fields and global fallbacks
        rendered_block = WhiteLabelEngine.render_content(raw_template, company)
        
        return rendered_block.strip()

    @staticmethod
    def inject_context(system_prompt: str, company: Company) -> str:
        """Appends the company context block to a system prompt."""
        context_block = AIContextService.get_company_context_block(company)
        
        # Combine them cleanly
        return f"{system_prompt}\n\n{context_block}"
