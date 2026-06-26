import os
import sys
import argparse
from sqlmodel import Session, select

# Adjust path to backend root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from models.user import Company, PlanTier, Team
from models.enterprise_hierarchy import Branch
from models.curriculum import Curriculum
from models.certifications import Certification
from services.invitation_service import InvitationService

DEFAULT_CONFIG = {
    "company_id": "new_era_solar",
    "company_name": "New Era Solar",
    "plan_tier": "enterprise",
    "admin_email": "owner@newerasolar.com",
    "admin_first_name": "Marcus",
    "admin_last_name": "Vance",
    "template_id": "temp_new_era_solar_standard",
    "branches": [
        {"id": "miami_branch", "name": "Miami Office"},
        {"id": "orlando_branch", "name": "Orlando Office"}
    ],
    "teams": [
        {"id": "miami_closers", "name": "Miami Closers", "branch_id": "miami_branch"},
        {"id": "orlando_rampers", "name": "Orlando Rampers", "branch_id": "orlando_branch"}
    ],
    "curriculums": [
        {
            "id": "solar_fundamentals_v1",
            "name": "Solar Fundamentals RAMPER v1",
            "description": "Core consultative selling, discovery questioning, and utility locking mechanics."
        },
        {
            "id": "objection_crusher_v1",
            "name": "Objection Crusher Mastery",
            "description": "High-pressure pricing, finance, and lease objections handling curriculum."
        }
    ],
    "certifications": [
        {
            "id": "septivolt_certified_rep",
            "name": "SeptiVolt Certified Solar Rep",
            "curriculum_id": "solar_fundamentals_v1"
        },
        {
            "id": "objection_master_rep",
            "name": "Objection Crusher Specialist",
            "curriculum_id": "objection_crusher_v1"
        }
    ]
}

def bootstrap_whitelabel(config: dict):
    print("=" * 60)
    print(f"BOOTSTRAPPING WHITE-LABEL DEPLOYMENT: {config['company_name']}")
    print("=" * 60)

    with Session(engine) as session:
        # 1. Create Company
        cid = config["company_id"]
        company = session.get(Company, cid)
        if not company:
            company = Company(
                id=cid,
                name=config["company_name"],
                plan_tier=PlanTier(config["plan_tier"]),
                payment_status="active"
            )
            session.add(company)
            session.flush()
            print(f"[BOOTSTRAP] Created Company: {cid}")
        else:
            print(f"[BOOTSTRAP] Company '{cid}' already exists. Skipping.")

        # 2. Create Branches
        for branch_info in config.get("branches", []):
            bid = branch_info["id"]
            branch = session.get(Branch, bid)
            if not branch:
                branch = Branch(
                    id=bid,
                    name=branch_info["name"],
                    company_id=cid
                )
                session.add(branch)
                session.flush()
                print(f"[BOOTSTRAP] Created Branch: {bid} ({branch_info['name']})")
            else:
                print(f"[BOOTSTRAP] Branch '{bid}' already exists. Skipping.")

        # 3. Create Teams
        for team_info in config.get("teams", []):
            tid = team_info["id"]
            team = session.get(Team, tid)
            if not team:
                team = Team(
                    id=tid,
                    name=team_info["name"],
                    company_id=cid,
                    branch_id=team_info["branch_id"]
                )
                session.add(team)
                session.flush()
                print(f"[BOOTSTRAP] Created Team: {tid} ({team_info['name']})")
            else:
                print(f"[BOOTSTRAP] Team '{tid}' already exists. Skipping.")

        # 4. Create Curriculums
        for curr_info in config.get("curriculums", []):
            currid = curr_info["id"]
            curriculum = session.get(Curriculum, currid)
            if not curriculum:
                curriculum = Curriculum(
                    id=currid,
                    name=curr_info["name"],
                    description=curr_info["description"]
                )
                session.add(curriculum)
                session.flush()
                print(f"[BOOTSTRAP] Created Curriculum: {currid}")
            else:
                print(f"[BOOTSTRAP] Curriculum '{currid}' already exists. Skipping.")

        # 5. Create Certifications
        for cert_info in config.get("certifications", []):
            certid = cert_info["id"]
            cert = session.get(Certification, certid)
            if not cert:
                cert = Certification(
                    id=certid,
                    name=cert_info["name"],
                    curriculum_id=cert_info["curriculum_id"]
                )
                session.add(cert)
                session.flush()
                print(f"[BOOTSTRAP] Created Certification: {certid}")
            else:
                print(f"[BOOTSTRAP] Certification '{certid}' already exists. Skipping.")

        # 5.5 Apply default template if configured
        template_id = config.get("template_id")
        if template_id:
            from services.template_service import TemplateService
            print(f"[BOOTSTRAP] Auto-applying template '{template_id}' to company '{cid}'...")
            try:
                # Seed templates first just in case
                from seed_templates import seed_templates
                seed_templates()
                
                # Apply template
                res = TemplateService.apply_template(
                    session=session,
                    template_id=template_id,
                    target_type="company",
                    target_id=cid,
                    company_id=cid,
                    applied_by="system_bootstrap"
                )
                print(f"[BOOTSTRAP SUCCESS] Template '{template_id}' applied: {res}")
            except Exception as template_err:
                print(f"[BOOTSTRAP WARNING] Failed to apply template '{template_id}': {template_err}")

        session.commit()

        # 6. Generate Dealer Admin Invitation
        admin_email = config["admin_email"]
        print(f"[BOOTSTRAP] Auto-provisioning dealer_admin invitation for {admin_email}...")
        try:
            invite, raw_token = InvitationService.create_invitation(
                session=session,
                first_name=config["admin_first_name"],
                last_name=config["admin_last_name"],
                email=admin_email,
                role="dealer_admin",
                company_id=cid,
                created_by="system_bootstrap"
            )
            print(f"[SUCCESS] Bootstrapped successfully!")
            print(f"Company ID: {cid}")
            print(f"Admin Email: {admin_email}")
            print(f"Invitation ID: {invite.id}")
            print(f"Onboarding Magic Link URL Token: {raw_token}")
        except Exception as e:
            print(f"[ERROR] Failed to generate admin invite: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Bootstrap new White-label Partner in SeptiVolt")
    parser.add_argument("--config", type=str, help="Path to config JSON file")
    args = parser.parse_args()

    config = DEFAULT_CONFIG
    if args.config and os.path.exists(args.config):
        import json
        with open(args.config, "r") as f:
            config = json.load(f)
            
    bootstrap_whitelabel(config)
