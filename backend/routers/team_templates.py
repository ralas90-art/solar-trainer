from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlmodel import Session, select, func
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from database import get_session
from models.user import User, UserRole, Company
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
from services.template_service import TemplateService

router = APIRouter(prefix="/api/v1/team-templates", tags=["team-templates"])

# --- Request / Response DTOs ---

class RuleItem(BaseModel):
    role: str
    curriculum_id: Optional[str] = None
    certification_id: Optional[str] = None
    tag: Optional[str] = None
    workflow_id: Optional[str] = None

class TemplateCreateRequest(BaseModel):
    template_name: str
    description: Optional[str] = None
    target_scope: str = "company"  # company | branch | team
    is_global_template: bool = False
    template_version: int = 1
    parent_template_id: Optional[str] = None
    
    role_rules: List[str] = []  # List of role values
    curriculum_rules: List[Dict[str, str]] = []  # [{"role": "sales_rep", "curriculum_id": "..."}]
    certification_rules: List[Dict[str, str]] = []  # [{"role": "sales_rep", "certification_id": "..."}]
    ghl_rules: List[Dict[str, str]] = []  # [{"role": "sales_rep", "tag": "...", "workflow_id": "..."}]
    team_rules: List[str] = []  # List of team names

class ApplyRequest(BaseModel):
    target_type: str  # company | branch | team
    target_id: str

# --- Helper Guards ---

def _get_requesting_user(session: Session, x_user_id: str) -> User:
    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication header 'X-User-Id'."
        )
    user = session.exec(select(User).where(User.username == x_user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session user not found."
        )
    return user

def _require_manager_or_admin(user: User):
    allowed = {
        UserRole.SUPER_ADMIN,
        UserRole.DEALER_ADMIN,
        UserRole.BRANCH_MANAGER,
        UserRole.TRAINER,
        UserRole.ADMIN,
        UserRole.MANAGER
    }
    if user.role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Manager or Admin permissions required."
        )

# --- Routes ---

@router.get("", response_model=List[Dict[str, Any]])
def list_templates(
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    # Super Admins see everything. Other managers see Global + their company's templates.
    if user.role == UserRole.SUPER_ADMIN:
        stmt = select(TeamTemplate).where(TeamTemplate.is_active == True)
    else:
        stmt = select(TeamTemplate).where(
            (TeamTemplate.is_active == True) &
            ((TeamTemplate.is_global_template == True) | (TeamTemplate.company_id == company_id))
        )
    
    templates = session.exec(stmt).all()
    
    # Return basic list with rules count for frontend visual badges
    result = []
    for t in templates:
        roles_count = session.exec(select(func.count(TeamTemplateRoleRule.id)).where(TeamTemplateRoleRule.template_id == t.id)).first() or 0
        currs_count = session.exec(select(func.count(TeamTemplateCurriculumRule.id)).where(TeamTemplateCurriculumRule.template_id == t.id)).first() or 0
        certs_count = session.exec(select(func.count(TeamTemplateCertificationRule.id)).where(TeamTemplateCertificationRule.template_id == t.id)).first() or 0
        teams_count = session.exec(select(func.count(TeamTemplateTeamRule.id)).where(TeamTemplateTeamRule.template_id == t.id)).first() or 0

        result.append({
            "id": t.id,
            "company_id": t.company_id,
            "template_name": t.template_name,
            "description": t.description,
            "target_scope": t.target_scope,
            "is_global_template": t.is_global_template,
            "template_version": t.template_version,
            "is_active": t.is_active,
            "parent_template_id": t.parent_template_id,
            "created_by": t.created_by,
            "created_at": t.created_at.isoformat(),
            "updated_at": t.updated_at.isoformat(),
            "roles_count": roles_count,
            "curriculums_count": currs_count,
            "certifications_count": certs_count,
            "teams_count": teams_count
        })

    return result

@router.post("", status_code=201)
def create_template(
    body: TemplateCreateRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    # Only Super Admin can mark a template as global
    if body.is_global_template and user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only Super Admins can create global templates."
        )

    # Resolve parent mapping
    if body.parent_template_id:
        parent = session.get(TeamTemplate, body.parent_template_id)
        if not parent:
            raise HTTPException(status_code=404, detail="Parent template not found.")
        # Ensure tenant boundary check for parent
        if not parent.is_global_template and parent.company_id != company_id and user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(status_code=403, detail="Parent template belongs to another company.")

    template_id = f"temp_{uuid.uuid4().hex[:16]}"
    
    new_template = TeamTemplate(
        id=template_id,
        company_id=None if body.is_global_template else company_id,
        template_name=body.template_name,
        description=body.description,
        target_scope=body.target_scope,
        is_global_template=body.is_global_template,
        template_version=body.template_version,
        is_active=True,
        parent_template_id=body.parent_template_id,
        created_by=user.username
    )
    session.add(new_template)

    # Create Role rules
    for r in body.role_rules:
        role_rule = TeamTemplateRoleRule(template_id=template_id, role=r)
        session.add(role_rule)

    # Create Curriculum rules
    for c in body.curriculum_rules:
        curr_rule = TeamTemplateCurriculumRule(
            template_id=template_id,
            role=c["role"],
            curriculum_id=c["curriculum_id"]
        )
        session.add(curr_rule)

    # Create Certification rules
    for ct in body.certification_rules:
        cert_rule = TeamTemplateCertificationRule(
            template_id=template_id,
            role=ct["role"],
            certification_id=ct["certification_id"]
        )
        session.add(cert_rule)

    # Create GHL rules
    for g in body.ghl_rules:
        ghl_rule = TeamTemplateGHLRule(
            template_id=template_id,
            role=g["role"],
            tag=g["tag"],
            workflow_id=g.get("workflow_id")
        )
        session.add(ghl_rule)

    # Create Team rules
    for t_name in body.team_rules:
        team_rule = TeamTemplateTeamRule(
            template_id=template_id,
            team_name=t_name
        )
        session.add(team_rule)

    session.commit()
    return {"status": "created", "template_id": template_id}

@router.get("/{id}", response_model=Dict[str, Any])
def get_template_details(
    id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    t = session.get(TeamTemplate, id)
    if not t or not t.is_active:
        raise HTTPException(status_code=404, detail="Template not found.")

    # Isolation check
    if not t.is_global_template and t.company_id != company_id and user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Access denied: Template belongs to another company.")

    roles = session.exec(select(TeamTemplateRoleRule).where(TeamTemplateRoleRule.template_id == id)).all()
    currs = session.exec(select(TeamTemplateCurriculumRule).where(TeamTemplateCurriculumRule.template_id == id)).all()
    certs = session.exec(select(TeamTemplateCertificationRule).where(TeamTemplateCertificationRule.template_id == id)).all()
    ghl_rules = session.exec(select(TeamTemplateGHLRule).where(TeamTemplateGHLRule.template_id == id)).all()
    teams = session.exec(select(TeamTemplateTeamRule).where(TeamTemplateTeamRule.template_id == id)).all()

    return {
        "id": t.id,
        "company_id": t.company_id,
        "template_name": t.template_name,
        "description": t.description,
        "target_scope": t.target_scope,
        "is_global_template": t.is_global_template,
        "template_version": t.template_version,
        "parent_template_id": t.parent_template_id,
        "created_by": t.created_by,
        "created_at": t.created_at.isoformat(),
        "updated_at": t.updated_at.isoformat(),
        "role_rules": [r.role for r in roles],
        "curriculum_rules": [{"role": c.role, "curriculum_id": c.curriculum_id} for c in currs],
        "certification_rules": [{"role": c.role, "certification_id": c.certification_id} for c in certs],
        "ghl_rules": [{"role": g.role, "tag": g.tag, "workflow_id": g.workflow_id} for g in ghl_rules],
        "team_rules": [tm.team_name for tm in teams]
    }

@router.put("/{id}")
def update_template(
    id: str,
    body: TemplateCreateRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    t = session.get(TeamTemplate, id)
    if not t or not t.is_active:
        raise HTTPException(status_code=404, detail="Template not found.")

    # Isolation check
    if not t.is_global_template and t.company_id != company_id and user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Access denied: Template belongs to another company.")

    # Global write check
    if t.is_global_template and user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Only Super Admins can update global templates.")

    # Update basic details
    t.template_name = body.template_name
    t.description = body.description
    t.target_scope = body.target_scope
    t.template_version = body.template_version
    t.updated_at = datetime.utcnow()
    session.add(t)

    # Purge old rules for replacing
    session.exec(select(TeamTemplateRoleRule).where(TeamTemplateRoleRule.template_id == id)).all()
    for rule in session.exec(select(TeamTemplateRoleRule).where(TeamTemplateRoleRule.template_id == id)).all():
        session.delete(rule)
    for rule in session.exec(select(TeamTemplateCurriculumRule).where(TeamTemplateCurriculumRule.template_id == id)).all():
        session.delete(rule)
    for rule in session.exec(select(TeamTemplateCertificationRule).where(TeamTemplateCertificationRule.template_id == id)).all():
        session.delete(rule)
    for rule in session.exec(select(TeamTemplateGHLRule).where(TeamTemplateGHLRule.template_id == id)).all():
        session.delete(rule)
    for rule in session.exec(select(TeamTemplateTeamRule).where(TeamTemplateTeamRule.template_id == id)).all():
        session.delete(rule)
    session.flush()

    # Re-insert rules
    for r in body.role_rules:
        session.add(TeamTemplateRoleRule(template_id=id, role=r))
    for c in body.curriculum_rules:
        session.add(TeamTemplateCurriculumRule(template_id=id, role=c["role"], curriculum_id=c["curriculum_id"]))
    for ct in body.certification_rules:
        session.add(TeamTemplateCertificationRule(template_id=id, role=ct["role"], certification_id=ct["certification_id"]))
    for g in body.ghl_rules:
        session.add(TeamTemplateGHLRule(template_id=id, role=g["role"], tag=g["tag"], workflow_id=g.get("workflow_id")))
    for t_name in body.team_rules:
        session.add(TeamTemplateTeamRule(template_id=id, team_name=t_name))

    session.commit()
    return {"status": "updated"}

@router.delete("/{id}")
def delete_template(
    id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    t = session.get(TeamTemplate, id)
    if not t or not t.is_active:
        raise HTTPException(status_code=404, detail="Template not found.")

    # Isolation check
    if not t.is_global_template and t.company_id != company_id and user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Access denied: Template belongs to another company.")

    if t.is_global_template and user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Only Super Admins can delete global templates.")

    # Safe delete: flag as inactive
    t.is_active = False
    t.updated_at = datetime.utcnow()
    session.add(t)
    session.commit()
    return {"status": "deleted"}

@router.post("/{id}/preview")
def preview_template_apply(
    id: str,
    body: ApplyRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    # Enforce scoping rules
    if body.target_type == "company" and body.target_id != company_id:
        if user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(status_code=403, detail="Cross-company access blocked.")
    elif body.target_type == "branch":
        branch = session.get(Branch, body.target_id)
        if not branch or branch.company_id != company_id:
            if user.role != UserRole.SUPER_ADMIN:
                raise HTTPException(status_code=403, detail="Target branch belongs to another company.")
    elif body.target_type == "team":
        team = session.get(Team, body.target_id)
        if not team or team.company_id != company_id:
            if user.role != UserRole.SUPER_ADMIN:
                raise HTTPException(status_code=403, detail="Target team belongs to another company.")

    try:
        preview_data = TemplateService.preview_template(
            session=session,
            template_id=id,
            target_type=body.target_type,
            target_id=body.target_id,
            company_id=company_id
        )
        return preview_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{id}/apply")
def apply_template(
    id: str,
    body: ApplyRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
):
    user = _get_requesting_user(session, x_user_id)
    _require_manager_or_admin(user)
    company_id = user.company_id or "septivolt"

    # Enforce scoping rules
    if body.target_type == "company" and body.target_id != company_id:
        if user.role != UserRole.SUPER_ADMIN:
            raise HTTPException(status_code=403, detail="Cross-company access blocked.")
    elif body.target_type == "branch":
        branch = session.get(Branch, body.target_id)
        if not branch or branch.company_id != company_id:
            if user.role != UserRole.SUPER_ADMIN:
                raise HTTPException(status_code=403, detail="Target branch belongs to another company.")
    elif body.target_type == "team":
        team = session.get(Team, body.target_id)
        if not team or team.company_id != company_id:
            if user.role != UserRole.SUPER_ADMIN:
                raise HTTPException(status_code=403, detail="Target team belongs to another company.")

    try:
        apply_result = TemplateService.apply_template(
            session=session,
            template_id=id,
            target_type=body.target_type,
            target_id=body.target_id,
            company_id=company_id,
            applied_by=user.username
        )
        return apply_result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
