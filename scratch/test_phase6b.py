import os
import sys
import json
from datetime import datetime

# Setup path and env variables
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
os.environ["INTEGRATION_ENCRYPTION_KEY"] = "dev_secret_encryption_key_32_bytes_long!"
os.environ["DATABASE_URL"] = "" # Use local SQLite file for testing
os.environ["OPENAI_API_KEY"] = "dummy-openai-key"


from sqlmodel import Session, select
from sqlalchemy import text
from database import engine, create_db_and_tables
from models.user import User, UserRole, Company
from models.company_settings import CompanyProfile, CompanyIntegration
from routers.company_settings import (
    get_company_profile,
    save_company_profile,
    get_company_profile_preview,
    get_company_integrations,
    create_company_integration,
    update_company_integration,
    test_company_integration_endpoint,
    CompanyProfileRequest,
    CompanyIntegrationRequest
)

def run_tests():
    print("=" * 60)
    print("RUNNING PHASE 6B BACKEND VERIFICATION TESTS")
    print("=" * 60)

    # Initialize DB
    create_db_and_tables()

    # Seed test users and companies directly for clean state
    with Session(engine) as session:
        # Cleanup past test records
        session.execute(text("DELETE FROM companyprofile"))
        session.execute(text("DELETE FROM companyintegration"))
        session.execute(text("DELETE FROM \"user\" WHERE username IN ('cresca_admin', 'cresca_rep', 'rival_admin')"))
        session.execute(text("DELETE FROM company WHERE id IN ('cresca_test', 'rival_corp_test')"))
        session.commit()


        # Seed companies
        cresca_company = Company(id="cresca_test", name="Cresca Test Solar")
        rival_company = Company(id="rival_corp_test", name="Rival Corp Solar")
        session.add(cresca_company)
        session.add(rival_company)
        
        # Seed users
        cresca_admin = User(username="cresca_admin", password="hashed_password", role=UserRole.ADMIN, company_id="cresca_test")
        cresca_rep = User(username="cresca_rep", password="hashed_password", role=UserRole.SALES_REP, company_id="cresca_test")
        rival_admin = User(username="rival_admin", password="hashed_password", role=UserRole.ADMIN, company_id="rival_corp_test")
        
        session.add(cresca_admin)
        session.add(cresca_rep)
        session.add(rival_admin)
        session.commit()

    session = Session(engine)

    # --- Test Case 1: GET Profile (non-existent, returns empty default) ---
    print("\nTest Case 1: Get Profile (Non-Existent)")
    profile = get_company_profile(company_id="cresca_test", x_user_id="cresca_admin", session=session)
    assert profile["company_id"] == "cresca_test"
    assert profile["completeness_score"] == 0
    print("  [SUCCESS] GET returned default profile with 0% completeness.")

    # --- Test Case 2: SAVE Profile (cresca_admin writes successfully) ---
    print("\nTest Case 2: Save Profile (Authorized Admin)")
    update_data = CompanyProfileRequest(
        company_overview="We sell high premium solar panels in California.",
        website_url="https://crescatestsolar.com",
        states_served=["CA", "NV"],
        residential_focus=True,
        brand_voice=["consultative", "friendly"]
    )
    res = save_company_profile(company_id="cresca_test", body=update_data, x_user_id="cresca_admin", session=session)
    assert res["status"] == "success"
    # Re-retrieve to verify persistence
    profile = get_company_profile(company_id="cresca_test", x_user_id="cresca_admin", session=session)
    assert profile["company_overview"] == "We sell high premium solar panels in California."
    assert profile["states_served"] == ["CA", "NV"]
    assert profile["completeness_score"] > 0
    print(f"  [SUCCESS] Saved and verified. Completeness score: {profile['completeness_score']}%")

    # --- Test Case 3: Profile Edit Guard (sales_rep cannot edit profile) ---
    print("\nTest Case 3: Profile Edit Guard (Sales Rep)")
    try:
        save_company_profile(company_id="cresca_test", body=update_data, x_user_id="cresca_rep", session=session)
        assert False, "Should have thrown 403"
    except Exception as e:
        assert getattr(e, "status_code", None) == 403
        print("  [SUCCESS] sales_rep edit blocked with HTTP 403.")

    # --- Test Case 4: Profile Tenant Isolation (rival_admin cannot access cresca_test profile) ---
    print("\nTest Case 4: Profile Tenant Isolation")
    try:
        get_company_profile(company_id="cresca_test", x_user_id="rival_admin", session=session)
        assert False, "Should have thrown 403"
    except Exception as e:
        assert getattr(e, "status_code", None) == 403
        print("  [SUCCESS] Cross-tenant profile read blocked with HTTP 403.")

    # --- Test Case 5: Preview AI Context ---
    print("\nTest Case 5: Preview AI Context")
    preview = get_company_profile_preview(company_id="cresca_test", x_user_id="cresca_admin", session=session)
    assert "cresca_test" in preview["context"]
    assert "California" in preview["context"]
    print("  [SUCCESS] AI context preview generated successfully.")

    # --- Test Case 6: Create Integration & Encrypt at Rest ---
    print("\nTest Case 6: Create Integration & Encryption")
    integration_req = CompanyIntegrationRequest(
        provider="custom_webhook",
        auth_type="api_key",
        credentials="secret_webhook_key_12345",
        webhook_url="https://httpbin.org/post",
        sync_enabled=True,
        sync_preferences={"Sync new SeptiVolt users to CRM": True}
    )
    res = create_company_integration(company_id="cresca_test", body=integration_req, x_user_id="cresca_admin", session=session)
    assert res["status"] == "success"
    integration_id = res["id"]
    
    # Verify in DB directly that it is encrypted
    db_record = session.exec(select(CompanyIntegration).where(CompanyIntegration.id == integration_id)).first()
    assert db_record.encrypted_credentials != "secret_webhook_key_12345"
    assert "secret_webhook_key_12345" not in db_record.encrypted_credentials
    print("  [SUCCESS] Integration created. Credentials encrypted at rest.")

    # --- Test Case 7: Read Integrations (masked return verification) ---
    print("\nTest Case 7: Read Integrations Masked")
    integrations_list = get_company_integrations(company_id="cresca_test", x_user_id="cresca_admin", session=session)
    assert len(integrations_list) == 1
    assert integrations_list[0]["credentials_preview"] == "••••••••••••2345"
    print(f"  [SUCCESS] Masked credentials returned to admin: {integrations_list[0]['credentials_preview']}")

    # --- Test Case 8: Integration Read/Write guards (sales_rep fully blocked) ---
    print("\nTest Case 8: Integration Block Reps")
    try:
        get_company_integrations(company_id="cresca_test", x_user_id="cresca_rep", session=session)
        assert False, "Should have thrown 403"
    except Exception as e:
        assert getattr(e, "status_code", None) == 403
        print("  [SUCCESS] Sales rep blocked from integrations read.")

    # --- Test Case 9: Missing Encryption Key Protection ---
    print("\nTest Case 9: Missing Encryption Key Protection")
    # Temporarily remove key
    original_key = os.environ.get("INTEGRATION_ENCRYPTION_KEY")
    os.environ["INTEGRATION_ENCRYPTION_KEY"] = ""
    try:
        create_company_integration(company_id="cresca_test", body=integration_req, x_user_id="cresca_admin", session=session)
        assert False, "Should have thrown 400/500"
    except Exception as e:
        assert getattr(e, "status_code", None) == 400
        assert "INTEGRATION_ENCRYPTION_KEY" in getattr(e, "detail", "")
        print("  [SUCCESS] Blocked credentials save with clear error when encryption key is missing.")
    # Restore key
    os.environ["INTEGRATION_ENCRYPTION_KEY"] = original_key

    # --- Test Case 10: Test connection endpoint (Custom Webhook) ---
    print("\nTest Case 10: Test Webhook connection")
    res = test_company_integration_endpoint(company_id="cresca_test", integration_id=integration_id, x_user_id="cresca_admin", session=session)
    assert res["status"] == "connected"
    print("  [SUCCESS] Webhook test returned success status.")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
