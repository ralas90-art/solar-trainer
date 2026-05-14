import sys
import os
from uuid import uuid4
from sqlmodel import Session, select

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "solar-trainer", "backend"))

from database import engine
from models.user import Company, Membership, User, UserRole, AIUsageLog
from services.ai_keys import encrypt_key, decrypt_key
from services.ai_context import AIContextService
from services.whitelabel_engine import WhiteLabelEngine
from services.ai_usage import AIUsageService

def test_phase_5():
    print("Starting Phase 5 Verification...")
    
    with Session(engine) as session:
        # 1. Setup Test Company
        test_id = f"test-{str(uuid4())[:8]}"
        company = Company(
            id=test_id,
            name="Test Solar Corp",
            crm_name="SolarCRM",
            proposal_tool="SolarCalc"
        )
        session.add(company)
        session.commit()
        session.refresh(company)
        print(f"Created Company: {company.name} (ID: {company.id})")

        # 2. Test Encryption
        test_key = "sk-test-12345"
        encrypted = encrypt_key(test_key)
        company.openai_api_key_encrypted = encrypted
        company.use_custom_ai_keys = True
        session.add(company)
        session.commit()
        
        decrypted = decrypt_key(company.openai_api_key_encrypted)
        assert decrypted == test_key, "Encryption/Decryption failed!"
        print("Encryption/Decryption Verified.")

        # 3. Test Context Generation
        context = AIContextService.inject_context("Analyze this response.", company)
        assert "Test Solar Corp" in context, "Company name missing from context!"
        assert "SolarCRM" in context, "CRM name missing from context!"
        print("Context Injection Verified.")

        # 4. Test Usage Logging
        AIUsageService.log_usage(
            company_id=company.id,
            user_id=None,
            provider="openai",
            model="gpt-4o",
            input_tokens=100,
            output_tokens=50,
            status="success"
        )
        
        # Verify log exists
        log = session.exec(select(AIUsageLog).where(AIUsageLog.company_id == company.id)).first()
        assert log is not None, "Usage log not created!"
        assert log.estimated_cost > 0, "Cost estimation failed!"
        print(f"Usage Logging Verified. Estimated Cost: ${log.estimated_cost}")

        # Cleanup
        session.delete(log)
        session.delete(company)
        session.commit()
        
    print("\nAll Phase 5 backend components verified successfully!")

if __name__ == "__main__":
    test_phase_5()
