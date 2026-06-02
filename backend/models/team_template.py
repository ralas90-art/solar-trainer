from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid

class TeamTemplate(SQLModel, table=True):
    __tablename__ = "team_templates"

    id: str = Field(
        default_factory=lambda: f"temp_{uuid.uuid4().hex[:16]}",
        primary_key=True
    )
    company_id: Optional[str] = Field(default=None, index=True, foreign_key="company.id", nullable=True)
    template_name: str
    description: Optional[str] = None
    target_scope: str = Field(default="company")  # company | branch | team
    is_global_template: bool = Field(default=False, index=True)
    template_version: int = Field(default=1)
    is_active: bool = Field(default=True, index=True)
    parent_template_id: Optional[str] = Field(default=None, index=True, foreign_key="team_templates.id", nullable=True)
    created_by: str = Field(index=True)  # username
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TeamTemplateRoleRule(SQLModel, table=True):
    __tablename__ = "team_template_role_rules"

    id: Optional[int] = Field(default=None, primary_key=True)
    template_id: str = Field(index=True, foreign_key="team_templates.id")
    role: str = Field(index=True)  # e.g. sales_rep, branch_manager, trainer, observer
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeamTemplateCurriculumRule(SQLModel, table=True):
    __tablename__ = "team_template_curriculum_rules"

    id: Optional[int] = Field(default=None, primary_key=True)
    template_id: str = Field(index=True, foreign_key="team_templates.id")
    role: str = Field(index=True)  # role to assign this curriculum to
    curriculum_id: str = Field(foreign_key="curriculums.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeamTemplateCertificationRule(SQLModel, table=True):
    __tablename__ = "team_template_certification_rules"

    id: Optional[int] = Field(default=None, primary_key=True)
    template_id: str = Field(index=True, foreign_key="team_templates.id")
    role: str = Field(index=True)  # role to assign this certification to
    certification_id: str = Field(foreign_key="certifications.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeamTemplateGHLRule(SQLModel, table=True):
    __tablename__ = "team_template_ghl_rules"

    id: Optional[int] = Field(default=None, primary_key=True)
    template_id: str = Field(index=True, foreign_key="team_templates.id")
    role: str = Field(index=True)
    tag: str  # tag to apply, e.g. "role:sales_rep"
    workflow_id: Optional[str] = Field(default=None)  # optional onboarding workflow trigger
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeamTemplateTeamRule(SQLModel, table=True):
    """
    Specifies teams that should be automatically created under the scope if missing.
    """
    __tablename__ = "team_template_team_rules"

    id: Optional[int] = Field(default=None, primary_key=True)
    template_id: str = Field(index=True, foreign_key="team_templates.id")
    team_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeamTemplateDefaultAssignmentRule(SQLModel, table=True):
    """
    Ties a template to a company, branch, or team target scope so future users are configured automatically.
    """
    __tablename__ = "team_template_default_assignment_rules"

    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(index=True, foreign_key="company.id")
    target_type: str = Field(index=True)  # company | branch | team
    target_id: str = Field(index=True)    # company_id | branch_id | team_id
    template_id: str = Field(index=True, foreign_key="team_templates.id")
    is_active: bool = Field(default=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TeamTemplateApplicationLog(SQLModel, table=True):
    """
    Tracks audit logs of when a template was applied, what was affected, and status.
    """
    __tablename__ = "team_template_application_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    template_id: str = Field(index=True, foreign_key="team_templates.id")
    company_id: str = Field(index=True, foreign_key="company.id")
    target_type: str = Field(index=True)  # company | branch | team
    target_id: str = Field(index=True)
    applied_by: str = Field(index=True)  # username
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="success")  # success | failed
    details: str = Field(default="{}")  # JSON string summarizing actions taken
