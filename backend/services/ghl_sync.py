import requests
from typing import Optional, List
from sqlmodel import Session, select
from models.company_settings import CompanyIntegration
from services.integration_service import IntegrationService

class GHLSyncService:
    @classmethod
    def sync_contact(
        cls,
        db_session: Session,
        user_id: str,
        company_id: str,
        email: str,
        first_name: str,
        last_name: str,
        role: str,
        branch_name: Optional[str] = None,
        team_name: Optional[str] = None,
        training_status: str = "not_started",
        extra_tags: Optional[List[str]] = None
    ) -> bool:
        """
        Synchronizes a user with GoHighLevel.
        Upserts the contact (finds by email or creates a new one) and updates tags.
        """
        # Extract enum values safely if they are Enums
        r_val = role.value if hasattr(role, "value") else str(role)
        c_val = company_id.value if hasattr(company_id, "value") else str(company_id)
        b_val = branch_name.value if hasattr(branch_name, "value") else str(branch_name) if branch_name else "none"
        t_val = team_name.value if hasattr(team_name, "value") else str(team_name) if team_name else "none"
        s_val = training_status.value if hasattr(training_status, "value") else str(training_status)

        # Formulate tags
        tags = [
            f"role:{r_val}",
            f"company:{c_val}",
            f"branch:{b_val}",
            f"team:{t_val}",
            f"training_status:{s_val}"
        ]
        if extra_tags:
            for et in extra_tags:
                if et not in tags:
                    tags.append(et)


        print(f"[GHL-SYNC] Synchronizing user '{user_id}' with status '{training_status}'...")
        print(f"[GHL-SYNC] Generated tags: {tags}")

        # Safe Demo Mode bypass
        if company_id == "sales_accelerator_demo" or company_id.startswith("demo_"):
            print("[GHL-SYNC] Demo Mode: Mock sync succeeded.")
            return True

        # Resolve company GHL integration
        statement = select(CompanyIntegration).where(
            CompanyIntegration.company_id == company_id,
            CompanyIntegration.provider == "gohighlevel"
        )
        integration = db_session.exec(statement).first()

        if not integration or integration.connection_status != "connected":
            print(f"[GHL-SYNC] No active GoHighLevel integration for company '{company_id}'. Fallback to mock log.")
            return True

        sync_type = "onboarding" if training_status == "not_started" else "progress_update"

        try:
            # Decrypt API Key
            api_key = IntegrationService.decrypt_credential(integration.encrypted_credentials)
            location_id = integration.location_id
        except Exception as e:
            error_details = f"Failed to decrypt credentials: {e}"
            print(f"[GHL-SYNC ERROR] {error_details}")
            cls._log_sync_audit(db_session, company_id, user_id, sync_type, "failed", error_details)
            return False

        if not api_key or "sanitized" in api_key or api_key == "sanitized_test_key":
            print("[GHL-SYNC] Active credentials not configured. Mock sync succeeded.")
            return True

        # GHL V2 API Headers
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Version": "2021-04-15",
            "Content-Type": "application/json"
        }

        # Step 1: Lookup contact by email
        search_url = f"https://services.gohighlevel.com/contacts/search?locationId={location_id}&query={email}"
        try:
            search_response = requests.get(search_url, headers=headers, timeout=8)
            contact_id = None
            if search_response.status_code == 200:
                data = search_response.json()
                contacts = data.get("contacts", [])
                if contacts:
                    contact_id = contacts[0].get("id")
            
            payload = {
                "email": email,
                "firstName": first_name,
                "lastName": last_name,
                "tags": tags,
                "customFields": [
                    {"id": "septivolt_user_id", "value": user_id}
                ]
            }

            if contact_id:
                # Update existing contact
                update_url = f"https://services.gohighlevel.com/contacts/{contact_id}"
                print(f"[GHL-SYNC] Updating contact {contact_id} in GHL...")
                res = requests.put(update_url, json=payload, headers=headers, timeout=8)
            else:
                # Create new contact
                create_url = f"https://services.gohighlevel.com/contacts/"
                payload["locationId"] = location_id
                print("[GHL-SYNC] Creating new contact in GHL...")
                res = requests.post(create_url, json=payload, headers=headers, timeout=8)

            if res.status_code in [200, 201]:
                print(f"[GHL-SYNC SUCCESS] Synced contact '{email}' with GHL location '{location_id}'")
                cls._log_sync_audit(db_session, company_id, user_id, sync_type, "success", f"Synced successfully with location {location_id}")
                return True
            else:
                error_details = f"GHL API returned non-success code {res.status_code}: {res.text}"
                print(f"[GHL-SYNC ERROR] {error_details}")
                cls._log_sync_audit(db_session, company_id, user_id, sync_type, "failed", error_details)
                return False

        except Exception as err:
            error_details = f"Failed to connect to GHL: {err}"
            print(f"[GHL-SYNC EXCEPTION] {error_details}")
            cls._log_sync_audit(db_session, company_id, user_id, sync_type, "failed", error_details)
            return False

    @classmethod
    def _log_sync_audit(cls, session: Session, company_id: str, user_id: str, sync_type: str, status: str, details: str):
        try:
            from models.user_invitations import SyncAuditLog
            audit = SyncAuditLog(
                company_id=company_id,
                user_id=user_id,
                sync_type=sync_type,
                status=status,
                details=details
            )
            session.add(audit)
            session.commit()
        except Exception as e:
            print(f"[GHL-SYNC-AUDIT-ERROR] Failed to write sync audit log: {e}")

    @classmethod
    def sync_progress_to_ghl(cls, db_session: Session, username: str) -> bool:
        """
        Calculates training status based on user metrics and syncs with GHL.
        """
        from models.user import User, UserStats
        from models.enterprise_hierarchy import Branch
        import json

        user = db_session.exec(select(User).where(User.username == username)).first()
        if not user:
            print(f"[GHL-SYNC-PROGRESS] User '{username}' not found.")
            return False

        stats = db_session.get(UserStats, username)
        if not stats:
            print(f"[GHL-SYNC-PROGRESS] Stats for user '{username}' not found.")
            return False

        # Calculate status
        try:
            module_progress = json.loads(stats.module_progress or "{}")
        except Exception:
            module_progress = {}
        try:
            scenario_progress = json.loads(stats.scenario_progress or "{}")
        except Exception:
            scenario_progress = {}

        passed_sims = sum(1 for v in scenario_progress.values() if isinstance(v, dict) and v.get("passed"))
        completed_lessons = sum(1 for v in module_progress.values() if isinstance(v, dict) and all(v.values()))

        if passed_sims >= 3 or completed_lessons >= 4:
            training_status = "completed"
        elif passed_sims > 0 or completed_lessons > 0:
            training_status = "in_progress"
        else:
            training_status = "not_started"

        branch_name = None
        if user.branch_id:
            branch = db_session.get(Branch, user.branch_id)
            branch_name = branch.name if branch else user.branch_id

        # Retrieve first/last name
        first_name = username.capitalize()
        last_name = "User"
        email = user.email or f"{username}@company.com"

        # Lookup email invitation to get first/last name if possible
        from models.user_invitations import UserInvitation
        stmt = select(UserInvitation).where(UserInvitation.email == email).order_by(UserInvitation.created_at.desc())
        invite = db_session.exec(stmt).first()
        if invite:
            first_name = invite.first_name
            last_name = invite.last_name

        return cls.sync_contact(
            db_session=db_session,
            user_id=username,
            company_id=user.company_id or "septivolt",
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=user.role,
            branch_name=branch_name,
            team_name=user.team_id,
            training_status=training_status
        )
