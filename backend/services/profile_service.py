import json
from sqlmodel import Session, select
from models.company_settings import CompanyProfile

class ProfileService:
    @staticmethod
    def calculate_completeness_score(profile: CompanyProfile) -> int:
        """
        Calculates the completeness score (0-100) of the Company Profile based on filled sections.
        """
        if not profile:
            return 0
            
        sections = {
            "basics": [
                profile.company_overview, 
                profile.website_url, 
                profile.states_served != "[]"
            ],
            "offers": [
                profile.products_offered != "[]", 
                profile.financing_options != "[]", 
                profile.equipment_brands
            ],
            "process": [
                profile.sales_model, 
                profile.sales_process_notes
            ],
            "voice": [
                profile.brand_voice != "[]"
            ],
            "compliance": [
                profile.common_objections != "[]", 
                profile.approved_rebuttals != "[]", 
                profile.compliance_notes
            ],
            "training": [
                profile.training_focus != "[]"
            ]
        }
        
        total_items = 0
        filled_items = 0
        
        for key, items in sections.items():
            for item in items:
                total_items += 1
                if isinstance(item, bool):
                    if item:
                        filled_items += 1
                elif item and str(item).strip() and str(item) != "[]" and str(item) != "{}":
                    filled_items += 1
                    
        if total_items == 0:
            return 0
        return int((filled_items / total_items) * 100)

    @staticmethod
    def build_company_training_context(company_id: str, session: Session) -> str:
        """
        Retrieves the CompanyProfile from the DB and generates a structured summary
        for consumption by LLM prompts.
        """
        # Safe Demo Mode bypass
        if company_id == "sales_accelerator_demo" or company_id.startswith("demo_"):
            return (
                "--- COMPANY TRAINING CONTEXT (DEMO MODE) ---\n"
                "Company Name: Sales Accelerator Demo (Mock)\n"
                "Overview: A fast-growing national solar dealer specializing in high-velocity D2D sales.\n"
                "Markets Served: D2D, Virtual Zoom consults.\n"
                "States Served: California, Texas, Florida.\n"
                "Products: Residential Solar, Storage/Battery, and Smart Home packages.\n"
                "Financing Options: Loan, Lease, PPA, and Cash.\n"
                "Preferred Brand Voice: Consultative, educational, high-energy closing.\n"
                "Training Focus: Beginner door-knocking, virtual Zoom consult closing, objection handling.\n"
                "Common Objections & Rebuttals:\n"
                "- 'I need to think about it' -> A.R.T. Rebuttal: Acknowledge the need to think, present immediate net utility saving, transition with a simple calendar invite.\n"
                "Compliance Boundary: No claims of zero-cost solar; avoid saying 'free solar'.\n"
            )

        profile = session.exec(select(CompanyProfile).where(CompanyProfile.company_id == company_id)).first()
        if not profile:
            return "No company intelligence profile configured. Defaulting to general solar sales training."

        # Parse JSON fields safely
        def safe_json_list(val: str) -> list:
            try:
                return json.loads(val or "[]")
            except Exception:
                return []

        markets = safe_json_list(profile.markets_served)
        states = safe_json_list(profile.states_served)
        languages = safe_json_list(profile.languages_supported)
        products = safe_json_list(profile.products_offered)
        financing = safe_json_list(profile.financing_options)
        voice = safe_json_list(profile.brand_voice)
        objections = safe_json_list(profile.common_objections)
        rebuttals = safe_json_list(profile.approved_rebuttals)
        focus = safe_json_list(profile.training_focus)

        context_lines = [
            "--- COMPANY TRAINING CONTEXT ---",
            f"Company ID: {profile.company_id}",
            f"Website: {profile.website_url or 'N/A'}",
            f"Company Overview: {profile.company_overview or 'N/A'}",
            f"Markets Served: {', '.join(markets) if markets else 'N/A'}",
            f"States Served: {', '.join(states) if states else 'N/A'}",
            f"Service Areas: {profile.service_areas or 'N/A'}",
            f"Languages Supported: {', '.join(languages) if languages else 'N/A'}",
            f"Residential Solar: {'Yes' if profile.residential_focus else 'No'}",
            f"Commercial Solar: {'Yes' if profile.commercial_focus else 'No'}",
            f"Products Offered: {', '.join(products) if products else 'N/A'}",
            f"Financing Options: {', '.join(financing) if financing else 'N/A'}",
            f"Utility Programs: {profile.utility_programs or 'N/A'}",
            f"Equipment Brands: {profile.equipment_brands or 'N/A'}",
            f"Warranty Details: {profile.warranty_details or 'N/A'}",
            f"Average Install Timeline: {profile.average_install_timeline or 'N/A'}",
            f"Target Customer: {profile.target_customer or 'N/A'}",
            f"Sales Model: {profile.sales_model or 'N/A'}",
            f"Appointment Type: {profile.appointment_type or 'N/A'}",
            f"Setter/Closer Model Active: {'Yes' if profile.setter_closer_model else 'No'}",
            f"Sales Process Notes: {profile.sales_process_notes or 'N/A'}",
            f"Brand Voice Preference: {', '.join(voice) if voice else 'N/A'}",
            f"Compliance Boundary Notes: {profile.compliance_notes or 'N/A'}",
            f"Words/Claims to Avoid: {profile.words_to_avoid or 'N/A'}",
            f"Script & Pitch Preferences: {profile.script_preferences or 'N/A'}",
            f"Training Focus Areas: {', '.join(focus) if focus else 'N/A'}",
        ]

        if objections:
            context_lines.append("\nCommon Objections:")
            for obj in objections:
                context_lines.append(f"- {obj}")

        if rebuttals:
            context_lines.append("\nApproved Rebuttals:")
            for reb in rebuttals:
                context_lines.append(f"- {reb}")

        context_lines.append("--------------------------------")
        return "\n".join(context_lines)
