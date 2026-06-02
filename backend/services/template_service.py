import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select, func
import uuid

from models import User, UserRole, Team, Company, Branch
from models.curriculum import Curriculum, CurriculumAssignment
from models.progress import UserCurriculumProgress
from models.certifications import Certification, UserCertification
from models.team_template import (
    TeamTemplate,
    TeamTemplateRoleRule,
    TeamTemplateCurriculumRule,
    TeamTemplateCertificationRule,
    TeamTemplateGHLRule,
    TeamTemplateTeamRule,
    TeamTemplateDefaultAssignmentRule,
    TeamTemplateApplicationLog,
)
from services.ghl_sync import GHLSyncService

class TemplateService:
    @classmethod
    def preview_template(
        cls,
        session: Session,
        template_id: str,
        target_type: str,  # company | branch | team
        target_id: str,
        company_id: str
    ) -> Dict[str, Any]:
        """
        Calculates a dry-run of changes that would occur if the template was applied.
        No database modifications are committed.
        """
        # 1. Fetch Template and check active
        template = session.get(TeamTemplate, template_id)
        if not template or not template.is_active:
            raise ValueError(f"Active template with ID '{template_id}' not found.")

        # Ensure tenant safety
        if not template.is_global_template and template.company_id != company_id:
            raise PermissionError("Access denied: Template does not belong to this tenant.")

        # Fetch all rules
        role_rules = session.exec(select(TeamTemplateRoleRule).where(TeamTemplateRoleRule.template_id == template_id, TeamTemplateRoleRule.is_active == True)).all()
        curr_rules = session.exec(select(TeamTemplateCurriculumRule).where(TeamTemplateCurriculumRule.template_id == template_id)).all()
        cert_rules = session.exec(select(TeamTemplateCertificationRule).where(TeamTemplateCertificationRule.template_id == template_id)).all()
        ghl_rules = session.exec(select(TeamTemplateGHLRule).where(TeamTemplateGHLRule.template_id == template_id)).all()
        team_rules = session.exec(select(TeamTemplateTeamRule).where(TeamTemplateTeamRule.template_id == template_id)).all()

        active_roles = {r.role for r in role_rules}

        # 2. Scope Users
        affected_users = []
        if target_type == "company":
            users = session.exec(select(User).where(User.company_id == target_id, User.is_active == True)).all()
        elif target_type == "branch":
            users = session.exec(select(User).where(User.branch_id == target_id, User.is_active == True)).all()
        elif target_type == "team":
            users = session.exec(select(User).where(User.team_id == target_id, User.is_active == True)).all()
        else:
            raise ValueError(f"Invalid target scope type: {target_type}")

        # Filter users by roles defined in the template
        for u in users:
            u_role = u.role.value if hasattr(u.role, "value") else str(u.role)
            if u_role in active_roles:
                affected_users.append(u)

        # 3. Determine Teams to create
        teams_to_create = []
        if target_type in ["company", "branch"]:
            for tr in team_rules:
                # Check if team name already exists under the company
                stmt = select(Team).where(Team.company_id == company_id, Team.name == tr.team_name)
                if target_type == "branch":
                    stmt = stmt.where(Team.branch_id == target_id)
                existing_team = session.exec(stmt).first()
                if not existing_team:
                    teams_to_create.append(tr.team_name)

        # 4. Determine Curriculum Assignments
        curriculums_to_assign = []
        for u in affected_users:
            u_role = u.role.value if hasattr(u.role, "value") else str(u.role)
            role_currs = [cr for cr in curr_rules if cr.role == u_role]
            for rc in role_currs:
                # Check if user already assigned
                existing_progress = session.exec(
                    select(UserCurriculumProgress).where(
                        UserCurriculumProgress.user_id == u.username,
                        UserCurriculumProgress.curriculum_id == rc.curriculum_id
                    )
                ).first()
                
                currid_name = rc.curriculum_id.replace("_", " ").title()
                curr_obj = session.get(Curriculum, rc.curriculum_id)
                curr_name = curr_obj.name if curr_obj else currid_name

                curriculums_to_assign.append({
                    "username": u.username,
                    "email": u.email,
                    "role": u_role,
                    "curriculum_id": rc.curriculum_id,
                    "curriculum_name": curr_name,
                    "is_already_assigned": existing_progress is not None
                })

        # 5. Determine Certifications Configuration
        certifications_to_configure = []
        for cr in cert_rules:
            cert_obj = session.get(Certification, cr.certification_id)
            cert_name = cert_obj.name if cert_obj else cr.certification_id.replace("_", " ").title()
            certifications_to_configure.append({
                "role": cr.role,
                "certification_id": cr.certification_id,
                "certification_name": cert_name
            })

        # 6. Determine GHL tags to apply
        ghl_tags_to_sync = []
        for u in affected_users:
            u_role = u.role.value if hasattr(u.role, "value") else str(u.role)
            role_ghl = [gr for gr in ghl_rules if gr.role == u_role]
            tags = [gr.tag for gr in role_ghl]
            if tags:
                ghl_tags_to_sync.append({
                    "username": u.username,
                    "email": u.email,
                    "role": u_role,
                    "tags": tags
                })

        return {
            "template_id": template_id,
            "template_name": template.template_name,
            "template_version": template.template_version,
            "target_type": target_type,
            "target_id": target_id,
            "teams_to_create": teams_to_create,
            "curriculums_to_assign": curriculums_to_assign,
            "certifications_to_configure": certifications_to_configure,
            "ghl_tags_to_sync": ghl_tags_to_sync,
            "affected_users_count": len(affected_users)
        }

    @classmethod
    def apply_template(
        cls,
        session: Session,
        template_id: str,
        target_type: str,
        target_id: str,
        company_id: str,
        applied_by: str
    ) -> Dict[str, Any]:
        """
        Commits all template rules to the target scope.
        Idempotent: updates only missing data and tracks operations in audit log.
        """
        # Fetch template details (preview dry-run resolves references)
        preview = cls.preview_template(session, template_id, target_type, target_id, company_id)
        template = session.get(TeamTemplate, template_id)

        # 1. Spawn missing teams
        created_team_ids = []
        if target_type in ["company", "branch"]:
            team_rules = session.exec(select(TeamTemplateTeamRule).where(TeamTemplateTeamRule.template_id == template_id)).all()
            for tr in team_rules:
                stmt = select(Team).where(Team.company_id == company_id, Team.name == tr.team_name)
                if target_type == "branch":
                    stmt = stmt.where(Team.branch_id == target_id)
                existing_team = session.exec(stmt).first()
                
                if not existing_team:
                    new_team = Team(
                        name=tr.team_name,
                        company_id=company_id,
                        branch_id=target_id if target_type == "branch" else None
                    )
                    session.add(new_team)
                    session.flush()
                    created_team_ids.append(new_team.id)

        # 2. Register Template Default Assignment Rule for future users
        # Deactivate old ones for target to avoid conflicts
        old_rules = session.exec(
            select(TeamTemplateDefaultAssignmentRule).where(
                TeamTemplateDefaultAssignmentRule.company_id == company_id,
                TeamTemplateDefaultAssignmentRule.target_type == target_type,
                TeamTemplateDefaultAssignmentRule.target_id == target_id,
                TeamTemplateDefaultAssignmentRule.is_active == True
            )
        ).all()
        for orule in old_rules:
            orule.is_active = False
            orule.updated_at = datetime.utcnow()
            session.add(orule)

        default_assignment = TeamTemplateDefaultAssignmentRule(
            company_id=company_id,
            target_type=target_type,
            target_id=target_id,
            template_id=template_id,
            is_active=True
        )
        session.add(default_assignment)

        # 3. Create missing Curriculums and user progress
        curr_rules = session.exec(select(TeamTemplateCurriculumRule).where(TeamTemplateCurriculumRule.template_id == template_id)).all()
        cert_rules = session.exec(select(TeamTemplateCertificationRule).where(TeamTemplateCertificationRule.template_id == template_id)).all()
        ghl_rules = session.exec(select(TeamTemplateGHLRule).where(TeamTemplateGHLRule.template_id == template_id)).all()
        role_rules = session.exec(select(TeamTemplateRoleRule).where(TeamTemplateRoleRule.template_id == template_id, TeamTemplateRoleRule.is_active == True)).all()
        active_roles = {r.role for r in role_rules}

        # Query all users in scope
        if target_type == "company":
            users = session.exec(select(User).where(User.company_id == target_id, User.is_active == True)).all()
        elif target_type == "branch":
            users = session.exec(select(User).where(User.branch_id == target_id, User.is_active == True)).all()
        elif target_type == "team":
            users = session.exec(select(User).where(User.team_id == target_id, User.is_active == True)).all()

        assigned_curriculums_count = 0
        synced_ghl_users = []

        # Ensure certifications in rules exist
        for cr in cert_rules:
            cert = session.get(Certification, cr.certification_id)
            if not cert:
                # Resolve curriculum mapping from template or fall back to default
                matching_curr = next((cur.curriculum_id for cur in curr_rules if cur.role == cr.role), "solar_fundamentals_v1")
                cert = Certification(
                    id=cr.certification_id,
                    name=cr.certification_id.replace("_", " ").title(),
                    curriculum_id=matching_curr
                )
                session.add(cert)
                session.flush()

        for u in users:
            u_role = u.role.value if hasattr(u.role, "value") else str(u.role)
            if u_role not in active_roles:
                continue

            # Assign role curriculums
            user_currs = [rc for rc in curr_rules if rc.role == u_role]
            for rc in user_currs:
                # Ensure Curriculum object exists
                curr = session.get(Curriculum, rc.curriculum_id)
                if not curr:
                    curr = Curriculum(
                        id=rc.curriculum_id,
                        name=rc.curriculum_id.replace("_", " ").title(),
                        description="Auto-generated by template application."
                    )
                    session.add(curr)
                    session.flush()

                # Add Assignment row at target level if not already present
                existing_assign = session.exec(
                    select(CurriculumAssignment).where(
                        CurriculumAssignment.company_id == company_id,
                        CurriculumAssignment.curriculum_id == rc.curriculum_id,
                        CurriculumAssignment.target_type == target_type,
                        CurriculumAssignment.target_id == target_id
                    )
                ).first()
                if not existing_assign:
                    new_assign = CurriculumAssignment(
                        company_id=company_id,
                        curriculum_id=rc.curriculum_id,
                        target_type=target_type,
                        target_id=target_id,
                        assigned_by=applied_by
                    )
                    session.add(new_assign)

                # Add assignment at user level if not present
                user_assign = session.exec(
                    select(CurriculumAssignment).where(
                        CurriculumAssignment.company_id == company_id,
                        CurriculumAssignment.curriculum_id == rc.curriculum_id,
                        CurriculumAssignment.target_type == "user",
                        CurriculumAssignment.target_id == u.username
                    )
                ).first()
                if not user_assign:
                    new_u_assign = CurriculumAssignment(
                        company_id=company_id,
                        curriculum_id=rc.curriculum_id,
                        target_type="user",
                        target_id=u.username,
                        assigned_by=applied_by
                    )
                    session.add(new_u_assign)

                # Ensure UserCurriculumProgress exists
                progress = session.exec(
                    select(UserCurriculumProgress).where(
                        UserCurriculumProgress.user_id == u.username,
                        UserCurriculumProgress.curriculum_id == rc.curriculum_id
                    )
                ).first()
                if not progress:
                    progress = UserCurriculumProgress(
                        user_id=u.username,
                        company_id=company_id,
                        curriculum_id=rc.curriculum_id,
                        status="not_started",
                        progress_percentage=0.0
                    )
                    session.add(progress)
                    assigned_curriculums_count += 1

            # Determine extra GHL tags to apply
            user_ghl = [gr for gr in ghl_rules if gr.role == u_role]
            extra_tags = [gr.tag for gr in user_ghl]

            if extra_tags:
                try:
                    # Resolve branch name
                    branch_name = None
                    if u.branch_id:
                        br = session.get(Branch, u.branch_id)
                        branch_name = br.name if br else u.branch_id

                    # Run background GHL sync
                    GHLSyncService.sync_contact(
                        db_session=session,
                        user_id=u.username,
                        company_id=company_id,
                        email=u.email or f"{u.username}@company.com",
                        first_name=u.username,
                        last_name="Trainee",
                        role=u.role,
                        branch_name=branch_name,
                        team_name=u.team_id,
                        training_status="not_started",
                        extra_tags=extra_tags
                    )
                    synced_ghl_users.append(u.username)
                except Exception as ghl_err:
                    print(f"[GHL-SYNC WARNING] Silent failure during template apply: {ghl_err}")

        # 4. Write Audit Log
        summary_log = {
            "created_teams": created_team_ids,
            "assigned_curriculums_count": assigned_curriculums_count,
            "synced_ghl_users": synced_ghl_users,
            "target_type": target_type,
            "target_id": target_id
        }

        log = TeamTemplateApplicationLog(
            template_id=template_id,
            company_id=company_id,
            target_type=target_type,
            target_id=target_id,
            applied_by=applied_by,
            status="success",
            details=json.dumps(summary_log)
        )
        session.add(log)
        session.commit()

        return {
            "status": "success",
            "created_teams": created_team_ids,
            "assigned_curriculums": assigned_curriculums_count,
            "ghl_synced_users": len(synced_ghl_users)
        }

    @classmethod
    def apply_template_to_new_user(cls, session: Session, user: User) -> bool:
        """
        Checks default assignment rules for user's team, branch, or company.
        If found, auto-provisions their curriculums, certifications, and GHL tags.
        Returns True if a template was found and applied, False otherwise.
        """
        company_id = user.company_id or "septivolt"
        u_role = user.role.value if hasattr(user.role, "value") else str(user.role)

        # 1. Resolve active assignment rule with fallback priority: team -> branch -> company
        rule = None
        if user.team_id:
            rule = session.exec(
                select(TeamTemplateDefaultAssignmentRule).where(
                    TeamTemplateDefaultAssignmentRule.company_id == company_id,
                    TeamTemplateDefaultAssignmentRule.target_type == "team",
                    TeamTemplateDefaultAssignmentRule.target_id == user.team_id,
                    TeamTemplateDefaultAssignmentRule.is_active == True
                )
            ).first()

        if not rule and user.branch_id:
            rule = session.exec(
                select(TeamTemplateDefaultAssignmentRule).where(
                    TeamTemplateDefaultAssignmentRule.company_id == company_id,
                    TeamTemplateDefaultAssignmentRule.target_type == "branch",
                    TeamTemplateDefaultAssignmentRule.target_id == user.branch_id,
                    TeamTemplateDefaultAssignmentRule.is_active == True
                )
            ).first()

        if not rule:
            rule = session.exec(
                select(TeamTemplateDefaultAssignmentRule).where(
                    TeamTemplateDefaultAssignmentRule.company_id == company_id,
                    TeamTemplateDefaultAssignmentRule.target_type == "company",
                    TeamTemplateDefaultAssignmentRule.target_id == company_id,
                    TeamTemplateDefaultAssignmentRule.is_active == True
                )
            ).first()

        if not rule:
            print(f"[TEMPLATE-SERVICE] No default assignment rule configured for user '{user.username}' under target filters. Fallback.")
            return False

        template_id = rule.template_id
        template = session.get(TeamTemplate, template_id)
        if not template or not template.is_active:
            print(f"[TEMPLATE-SERVICE] Assignment template '{template_id}' is inactive or not found. Fallback.")
            return False

        # 2. Match role rules
        role_rule = session.exec(
            select(TeamTemplateRoleRule).where(
                TeamTemplateRoleRule.template_id == template_id,
                TeamTemplateRoleRule.role == u_role,
                TeamTemplateRoleRule.is_active == True
            )
        ).first()

        if not role_rule:
            print(f"[TEMPLATE-SERVICE] Role '{u_role}' is not configured in template '{template_id}'. Skipping assignments.")
            return True # Successfully resolved, but nothing to apply

        # 3. Assign Curriculums
        curr_rules = session.exec(
            select(TeamTemplateCurriculumRule).where(
                TeamTemplateCurriculumRule.template_id == template_id,
                TeamTemplateCurriculumRule.role == u_role
            )
        ).all()

        for cr in curr_rules:
            # Ensure curriculum exists
            curr = session.get(Curriculum, cr.curriculum_id)
            if not curr:
                curr = Curriculum(
                    id=cr.curriculum_id,
                    name=cr.curriculum_id.replace("_", " ").title(),
                    description="Auto-generated by template auto-provisioning."
                )
                session.add(curr)
                session.flush()

            # Create User assignment row
            existing_assign = session.exec(
                select(CurriculumAssignment).where(
                    CurriculumAssignment.company_id == company_id,
                    CurriculumAssignment.curriculum_id == cr.curriculum_id,
                    CurriculumAssignment.target_type == "user",
                    CurriculumAssignment.target_id == user.username
                )
            ).first()

            if not existing_assign:
                new_assign = CurriculumAssignment(
                    company_id=company_id,
                    curriculum_id=cr.curriculum_id,
                    target_type="user",
                    target_id=user.username,
                    assigned_by=f"template_auto_{template_id}"
                )
                session.add(new_assign)

            # Ensure UserCurriculumProgress
            progress = session.exec(
                select(UserCurriculumProgress).where(
                    UserCurriculumProgress.user_id == user.username,
                    UserCurriculumProgress.curriculum_id == cr.curriculum_id
                )
            ).first()
            if not progress:
                progress = UserCurriculumProgress(
                    user_id=user.username,
                    company_id=company_id,
                    curriculum_id=cr.curriculum_id,
                    status="not_started",
                    progress_percentage=0.0
                )
                session.add(progress)

        # 4. Retrieve certifications to verify they exist
        cert_rules = session.exec(
            select(TeamTemplateCertificationRule).where(
                TeamTemplateCertificationRule.template_id == template_id,
                TeamTemplateCertificationRule.role == u_role
            )
        ).all()
        for cr in cert_rules:
            cert = session.get(Certification, cr.certification_id)
            if not cert:
                matching_curr = next((cur.curriculum_id for cur in curr_rules), "solar_fundamentals_v1")
                cert = Certification(
                    id=cr.certification_id,
                    name=cr.certification_id.replace("_", " ").title(),
                    curriculum_id=matching_curr
                )
                session.add(cert)
                session.flush()

        # 5. Fetch template specific tags
        ghl_rules = session.exec(
            select(TeamTemplateGHLRule).where(
                TeamTemplateGHLRule.template_id == template_id,
                TeamTemplateGHLRule.role == u_role
            )
        ).all()
        extra_tags = [gr.tag for gr in ghl_rules]

        # 6. GHL sync with extra tags
        try:
            branch_name = None
            if user.branch_id:
                br = session.get(Branch, user.branch_id)
                branch_name = br.name if br else user.branch_id

            GHLSyncService.sync_contact(
                db_session=session,
                user_id=user.username,
                company_id=company_id,
                email=user.email or f"{user.username}@company.com",
                first_name=user.username,
                last_name="Trainee",
                role=user.role,
                branch_name=branch_name,
                team_name=user.team_id,
                training_status="not_started",
                extra_tags=extra_tags
            )
        except Exception as ghl_err:
            print(f"[GHL-SYNC WARNING] Background auto-sync failed silently: {ghl_err}")

        session.commit()
        print(f"[TEMPLATE-SERVICE] Auto-provisioned user '{user.username}' using template '{template_id}' successfully.")
        return True
