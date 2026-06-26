import os
from datetime import datetime
from sqlmodel import Session, select
from database import engine
from models.curriculum import Curriculum
from models.certifications import Certification
from models.team_template import (
    TeamTemplate,
    TeamTemplateRoleRule,
    TeamTemplateCurriculumRule,
    TeamTemplateCertificationRule,
    TeamTemplateGHLRule,
    TeamTemplateTeamRule
)

def seed_templates():
    print("=" * 60)
    print("SEEDING DEFAULT TEAM ONBOARDING TEMPLATES")
    print("=" * 60)

    with Session(engine) as session:
        # 1. Ensure core Curriculums and Certifications exist in DB
        curriculums = {
            "solar_fundamentals_v1": {
                "name": "Solar Fundamentals RAMPER v1",
                "description": "Core consultative selling, discovery questioning, and utility locking mechanics."
            },
            "objection_crusher_v1": {
                "name": "Objection Crusher Mastery",
                "description": "High-pressure pricing, finance, and lease objections handling curriculum."
            },
            "simulator_basics": {
                "name": "Simulator Basics",
                "description": "Basic simulator navigation, vocal tone guidelines, and pitch structure."
            },
            "manager_command_center_mastery": {
                "name": "Manager Command Center Mastery",
                "description": "How to monitor reps progress, review coaching flags, and print reports."
            },
            "coaching_review_process": {
                "name": "Coaching Review Process",
                "description": "Reviewing simulator transcripts, analyzing cons, and writing manager notes."
            },
            "certification_approval_workflow": {
                "name": "Certification Approval Workflow",
                "description": "Auditing completed assessments and issuing badge certifications."
            }
        }

        for cid, details in curriculums.items():
            curr = session.get(Curriculum, cid)
            if not curr:
                curr = Curriculum(id=cid, name=details["name"], description=details["description"])
                session.add(curr)
                session.flush()
                print(f"[SEED] Created Curriculum: {cid}")

        certifications = {
            "septivolt_certified_rep": {
                "name": "SeptiVolt Certified Solar Rep",
                "curriculum_id": "solar_fundamentals_v1"
            },
            "objection_master_rep": {
                "name": "Objection Crusher Specialist",
                "curriculum_id": "objection_crusher_v1"
            }
        }

        for certid, details in certifications.items():
            cert = session.get(Certification, certid)
            if not cert:
                cert = Certification(id=certid, name=details["name"], curriculum_id=details["curriculum_id"])
                session.add(cert)
                session.flush()
                print(f"[SEED] Created Certification: {certid}")

        # 2. Seed Solar Rep Onboarding Template
        rep_template_id = "temp_solar_rep_onboarding"
        rep_template = session.get(TeamTemplate, rep_template_id)
        if not rep_template:
            rep_template = TeamTemplate(
                id=rep_template_id,
                template_name="Solar Rep Onboarding Template",
                description="Core training stack for new solar reps, covering fundamentals, objection handling, and simulator runs.",
                target_scope="company",
                is_global_template=True,
                template_version=1,
                is_active=True,
                created_by="system"
            )
            session.add(rep_template)
            session.flush()

            # Role rules
            session.add(TeamTemplateRoleRule(template_id=rep_template_id, role="sales_rep", is_active=True))

            # Curriculums rules
            for curr_id in ["solar_fundamentals_v1", "objection_crusher_v1", "simulator_basics"]:
                session.add(TeamTemplateCurriculumRule(template_id=rep_template_id, role="sales_rep", curriculum_id=curr_id))

            # Certification rules
            session.add(TeamTemplateCertificationRule(template_id=rep_template_id, role="sales_rep", certification_id="septivolt_certified_rep"))

            # GHL rules
            session.add(TeamTemplateGHLRule(template_id=rep_template_id, role="sales_rep", tag="role:sales_rep"))
            print(f"[SEED] Seeded global template: {rep_template_id}")

        # 3. Seed Manager Enablement Template
        mgr_template_id = "temp_manager_enablement"
        mgr_template = session.get(TeamTemplate, mgr_template_id)
        if not mgr_template:
            mgr_template = TeamTemplate(
                id=mgr_template_id,
                template_name="Manager Enablement Template",
                description="Training stack for trainers and branch managers to master the command center and coaching audit pipeline.",
                target_scope="company",
                is_global_template=True,
                template_version=1,
                is_active=True,
                created_by="system"
            )
            session.add(mgr_template)
            session.flush()

            # Role rules
            session.add(TeamTemplateRoleRule(template_id=mgr_template_id, role="branch_manager", is_active=True))
            session.add(TeamTemplateRoleRule(template_id=mgr_template_id, role="trainer", is_active=True))

            # Curriculums rules
            session.add(TeamTemplateCurriculumRule(template_id=mgr_template_id, role="branch_manager", curriculum_id="manager_command_center_mastery"))
            session.add(TeamTemplateCurriculumRule(template_id=mgr_template_id, role="branch_manager", curriculum_id="coaching_review_process"))
            session.add(TeamTemplateCurriculumRule(template_id=mgr_template_id, role="trainer", curriculum_id="coaching_review_process"))
            session.add(TeamTemplateCurriculumRule(template_id=mgr_template_id, role="trainer", curriculum_id="certification_approval_workflow"))

            # GHL rules
            session.add(TeamTemplateGHLRule(template_id=mgr_template_id, role="branch_manager", tag="role:branch_manager"))
            session.add(TeamTemplateGHLRule(template_id=mgr_template_id, role="trainer", tag="role:trainer"))
            print(f"[SEED] Seeded global template: {mgr_template_id}")

        # 4. Seed New Era Solar Standard Template
        newera_template_id = "temp_new_era_solar_standard"
        newera_template = session.get(TeamTemplate, newera_template_id)
        if not newera_template:
            newera_template = TeamTemplate(
                id=newera_template_id,
                template_name="New Era Solar Standard Template",
                description="The default organizational blueprint for New Era Solar. Automatically generates standard office offices and sets up rep, manager, and trainer tracks.",
                target_scope="company",
                is_global_template=True,
                template_version=1,
                is_active=True,
                created_by="system"
            )
            session.add(newera_template)
            session.flush()

            # Team rules
            session.add(TeamTemplateTeamRule(template_id=newera_template_id, team_name="Miami Office"))
            session.add(TeamTemplateTeamRule(template_id=newera_template_id, team_name="Orlando Office"))

            # Role rules
            session.add(TeamTemplateRoleRule(template_id=newera_template_id, role="sales_rep", is_active=True))
            session.add(TeamTemplateRoleRule(template_id=newera_template_id, role="branch_manager", is_active=True))
            session.add(TeamTemplateRoleRule(template_id=newera_template_id, role="trainer", is_active=True))

            # Curriculums rules
            session.add(TeamTemplateCurriculumRule(template_id=newera_template_id, role="sales_rep", curriculum_id="solar_fundamentals_v1"))
            session.add(TeamTemplateCurriculumRule(template_id=newera_template_id, role="sales_rep", curriculum_id="objection_crusher_v1"))
            session.add(TeamTemplateCurriculumRule(template_id=newera_template_id, role="branch_manager", curriculum_id="manager_command_center_mastery"))
            session.add(TeamTemplateCurriculumRule(template_id=newera_template_id, role="branch_manager", curriculum_id="coaching_review_process"))
            session.add(TeamTemplateCurriculumRule(template_id=newera_template_id, role="trainer", curriculum_id="coaching_review_process"))
            session.add(TeamTemplateCurriculumRule(template_id=newera_template_id, role="trainer", curriculum_id="certification_approval_workflow"))

            # Certification rules
            session.add(TeamTemplateCertificationRule(template_id=newera_template_id, role="sales_rep", certification_id="septivolt_certified_rep"))

            # GHL rules
            session.add(TeamTemplateGHLRule(template_id=newera_template_id, role="sales_rep", tag="role:sales_rep"))
            session.add(TeamTemplateGHLRule(template_id=newera_template_id, role="sales_rep", tag="company:new_era"))
            session.add(TeamTemplateGHLRule(template_id=newera_template_id, role="branch_manager", tag="role:branch_manager"))
            session.add(TeamTemplateGHLRule(template_id=newera_template_id, role="trainer", tag="role:trainer"))
            print(f"[SEED] Seeded global template: {newera_template_id}")

        session.commit()
        print("[SUCCESS] Template seeding complete.")

if __name__ == "__main__":
    seed_templates()
