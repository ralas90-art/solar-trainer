"""
White-Label Customization Engine (V2)
Handles variable injection, validation, and content processing.
"""
import re
import logging
from typing import Dict, Any, Optional
from sqlmodel import Session
from models.user import Company, GlobalSettings
from .registry import validate_variable

logger = logging.getLogger(__name__)

# Compile regex once at module level. Matches {{ variable_name }}
PLACEHOLDER_PATTERN = re.compile(r'\{\{\s*([a-zA-Z0-9_]+)\s*\}\}')

class WhiteLabelEngine:
    def __init__(self, session: Optional[Session] = None):
        self.session = session
        self.global_settings = self._load_global_settings() if session else {}

    def _load_global_settings(self) -> Dict[str, str]:
        """Fetch global fallbacks from database."""
        if not self.session:
            return {}
        settings = self.session.get(GlobalSettings, 1)
        return settings.fallback_variables if settings else {}

    @classmethod
    def render_content(cls, content: str, company: Company, session: Optional[Session] = None) -> str:
        """
        Static-friendly entry point.
        Parses text and replaces {{variable_name}} with company data or fallbacks.
        """
        engine = cls(session)
        return engine._render(content, company)

    def _render(self, content: str, company: Company) -> str:
        if not content or "{{" not in content:
            return content

        company_context = company.model_dump()
        # Map 'name' to 'company_name' since the model field is 'name'
        if "name" in company_context:
            company_context["company_name"] = company_context["name"]

        def replacer(match) -> str:
            var_name = match.group(1).strip()
            
            if not validate_variable(var_name):
                logger.warning(f"Unknown variable encountered: {var_name}")
                return match.group(0)

            # 1. Company value
            val = company_context.get(var_name)
            if val is not None and str(val).strip() != "":
                return str(val)
                
            # 2. Global fallback
            fallback_val = self.global_settings.get(var_name)
            if fallback_val is not None:
                return str(fallback_val)
                
            # 3. Unresolved
            return match.group(0)

        return PLACEHOLDER_PATTERN.sub(replacer, content)

    def render_structured_blocks(self, data: Any, company: Company) -> Any:
        """Process structured JSON block content recursively."""
        if isinstance(data, str):
            return self._render(data, company)
            
        if isinstance(data, dict):
            rendered = {}
            for key, value in data.items():
                rendered[key] = self.render_structured_blocks(value, company)
            return rendered
            
        if isinstance(data, list):
            return [self.render_structured_blocks(item, company) for item in data]
            
        return data
