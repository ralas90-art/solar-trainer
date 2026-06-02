import csv
import io
import re
from typing import Dict, Any, List, Optional
from sqlmodel import Session, select
import uuid

from services.invitation_service import InvitationService
from models.user import Team

class BulkInviteService:
    EMAIL_REGEX = re.compile(r"^[^@]+@[^@]+\.[^@]+$")

    @classmethod
    def process_csv(
        cls,
        session: Session,
        csv_content: str,
        company_id: str,
        created_by: str,
        branch_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Parses and triggers invitation creation for a bulk CSV file payload.
        Returns detailed summary of processed rows and failures.
        """
        bulk_upload_id = f"bulk_{uuid.uuid4().hex[:12]}"
        
        successes: List[Dict[str, str]] = []
        failures: List[Dict[str, Any]] = []

        # Read CSV content
        f = io.StringIO(csv_content.strip())
        reader = csv.DictReader(f)

        # Ensure headers exist
        headers = [h.strip().lower() for h in (reader.fieldnames or [])]
        required = {"email", "first_name", "last_name"}
        missing = required - set(headers)
        if missing:
            return {
                "success": False,
                "error": f"CSV is missing required columns: {', '.join(missing)}."
            }

        # Normalize header keys to match our dictionary lookup
        field_mapping = {}
        for original in (reader.fieldnames or []):
            normalized = original.strip().lower()
            field_mapping[normalized] = original

        row_index = 1
        for row in reader:
            row_index += 1
            
            # Extract row values safely
            email = row.get(field_mapping.get("email", "email"), "").strip()
            first_name = row.get(field_mapping.get("first_name", "first_name"), "").strip()
            last_name = row.get(field_mapping.get("last_name", "last_name"), "").strip()
            role = row.get(field_mapping.get("role", "role"), "sales_rep").strip().lower()
            
            # Find team mapping if provided
            team_field = field_mapping.get("team", "team")
            if team_field not in row:
                team_field = field_mapping.get("team_id", "team_id")
            team_input = row.get(team_field, "").strip() if team_field in row else None
            
            # Row level validations
            if not email or not first_name or not last_name:
                failures.append({
                    "row": row_index,
                    "email": email,
                    "reason": "Missing required fields (email, first_name, and last_name are mandatory)"
                })
                continue

            if not cls.EMAIL_REGEX.match(email):
                failures.append({
                    "row": row_index,
                    "email": email,
                    "reason": f"Invalid email format: '{email}'"
                })
                continue

            # Validate role
            valid_roles = {"dealer_admin", "branch_manager", "trainer", "sales_rep", "observer", "admin", "manager"}
            if role not in valid_roles:
                failures.append({
                    "row": row_index,
                    "email": email,
                    "reason": f"Invalid user role: '{role}'. Must be one of: {', '.join(valid_roles)}"
                })
                continue

            # Map legacy role inputs
            if role == "admin":
                role = "dealer_admin"
            elif role == "manager":
                role = "branch_manager"

            # Check if team is defined and maps to a real team in the company
            team_id = None
            if team_input:
                # Try direct get
                team = session.get(Team, team_input)
                if team and team.company_id == company_id:
                    team_id = team.id
                else:
                    # Look up by name
                    stmt = select(Team).where(Team.name == team_input, Team.company_id == company_id)
                    team_by_name = session.exec(stmt).first()
                    if team_by_name:
                        team_id = team_by_name.id
                    else:
                        # Fail row to prevent placing users in invalid contexts
                        failures.append({
                            "row": row_index,
                            "email": email,
                            "reason": f"Team '{team_input}' not found in company roster. Check team spelling."
                        })
                        continue

            # Create invitation
            try:
                invitation, _ = InvitationService.create_invitation(
                    session=session,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    role=role,
                    company_id=company_id,
                    created_by=created_by,
                    branch_id=branch_id,
                    team_id=team_id,
                    bulk_upload_id=bulk_upload_id,
                    ip_address=ip_address,
                    user_agent=user_agent
                )
                successes.append({
                    "email": email,
                    "name": f"{first_name} {last_name}",
                    "role": role,
                    "team_id": team_id or ""
                })
            except Exception as e:
                failures.append({
                    "row": row_index,
                    "email": email,
                    "reason": f"System error generating invitation: {str(e)}"
                })

        return {
            "success": True,
            "bulk_upload_id": bulk_upload_id,
            "success_count": len(successes),
            "failure_count": len(failures),
            "successes": successes,
            "failures": failures
        }
