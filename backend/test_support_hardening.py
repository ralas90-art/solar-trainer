import os
import sys
import time
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlmodel import Session, select, SQLModel

# Configure database URL before importing app to avoid polluting main db
TEST_DB_FILE = "test_support_hardening.db"
if os.path.exists(TEST_DB_FILE):
    try:
        os.remove(TEST_DB_FILE)
    except Exception:
        pass

os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_FILE}"
os.environ["STAGING_AUTH_FALLBACK"] = "false"  # Default false

# Add backend dir to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from database import engine, get_session
from main import app
from models.user import User, Company, PlanTier
from models.support_analytics import SupportChatAnalytics, SupportChatRateLimit
from auth_utils import generate_signed_token

client = TestClient(app)

def override_get_session():
    with Session(engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

def setup_db():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Create staging company
        company = Company(id="septivolt", name="SeptiVolt Solar", plan_tier=PlanTier.GROWTH)
        session.add(company)
        
        # Create staging test users
        user1 = User(username="test_trainee_1", password="hashed_password", role="sales_rep", company_id="septivolt")
        user2 = User(username="test_trainee_2", password="hashed_password", role="sales_rep", company_id="septivolt")
        session.add(user1)
        session.add(user2)
        session.commit()

def test_missing_bearer_token_rejected():
    payload = {
        "message": "Hello",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    response = client.post("/api/v1/support/chat", json=payload)
    assert response.status_code == 401
    assert "Invalid or missing authentication credentials" in response.json()["detail"]

def test_malformed_token_rejected():
    payload = {
        "message": "Hello",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": "Bearer malformedtoken"})
    assert response.status_code == 401
    assert "Invalid or missing authentication credentials" in response.json()["detail"]

def test_expired_token_rejected():
    # Generate token with negative expiry
    token = generate_signed_token("test_trainee_1", expires_in=-10)
    payload = {
        "message": "Hello",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
    assert "Invalid or missing authentication credentials" in response.json()["detail"]

def test_tampered_token_rejected():
    token = generate_signed_token("test_trainee_1")
    parts = token.split(".")
    # Tamper with base64 payload or signature
    tampered_sig = parts[1][:-5] + "aaaaa"
    tampered_token = f"{parts[0]}.{tampered_sig}"
    
    payload = {
        "message": "Hello",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {tampered_token}"})
    assert response.status_code == 401
    assert "Invalid or missing authentication credentials" in response.json()["detail"]

def test_valid_token_accepted():
    token = generate_signed_token("test_trainee_1")
    payload = {
        "message": "Hello",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["chat_id"] is not None

def test_spoofed_x_user_id_does_not_override_bearer():
    # Send a valid token for trainee 1, but spoof X-User-Id as trainee 2
    token1 = generate_signed_token("test_trainee_1")
    payload = {
        "message": "Who is Nematode?",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    response = client.post("/api/v1/support/chat", json=payload, headers={
        "Authorization": f"Bearer {token1}",
        "X-User-Id": "test_trainee_2"
    })
    assert response.status_code == 200
    data = response.json()
    
    # Check that in DB, the owner of the request is still trainee 1 (from Bearer)
    with Session(engine) as session:
        record = session.get(SupportChatAnalytics, data["chat_id"])
        assert record.user_id == "test_trainee_1"

    # Send a tampered token for trainee 1, but send X-User-Id test_trainee_2.
    # Because bearer token is present but invalid, it should NOT fall back to X-User-Id.
    parts = token1.split(".")
    tampered_sig = parts[1][:-5] + "aaaaa"
    tampered_token = f"{parts[0]}.{tampered_sig}"
    response = client.post("/api/v1/support/chat", json=payload, headers={
        "Authorization": f"Bearer {tampered_token}",
        "X-User-Id": "test_trainee_2"
    })
    assert response.status_code == 401

def test_x_user_id_fallback_gating():
    payload = {
        "message": "Hello",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    
    # 1. Fallback should fail when STAGING_AUTH_FALLBACK=false (default)
    os.environ["STAGING_AUTH_FALLBACK"] = "false"
    response = client.post("/api/v1/support/chat", json=payload, headers={"X-User-Id": "test_trainee_1"})
    assert response.status_code == 401
    
    # 2. Fallback should succeed when STAGING_AUTH_FALLBACK=true
    os.environ["STAGING_AUTH_FALLBACK"] = "true"
    response = client.post("/api/v1/support/chat", json=payload, headers={"X-User-Id": "test_trainee_1"})
    assert response.status_code == 200
    
    # Reset env var
    os.environ["STAGING_AUTH_FALLBACK"] = "false"

def test_feedback_ownership():
    # Create chat under trainee 1
    token1 = generate_signed_token("test_trainee_1")
    payload = {
        "message": "Lives query",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {token1}"})
    chat_id = response.json()["chat_id"]
    
    feedback_payload = {
        "chat_id": chat_id,
        "helpful": True
    }
    
    # Trainee 2 trying to update trainee 1's feedback should fail
    token2 = generate_signed_token("test_trainee_2")
    response2 = client.post("/api/v1/support/chat/feedback", json=feedback_payload, headers={"Authorization": f"Bearer {token2}"})
    assert response2.status_code == 403
    
    # Trainee 1 should succeed
    response1 = client.post("/api/v1/support/chat/feedback", json=feedback_payload, headers={"Authorization": f"Bearer {token1}"})
    assert response1.status_code == 200
    assert response1.json()["status"] == "success"

def test_database_limiter_blocks_and_purges():
    token = generate_signed_token("test_trainee_1")
    payload = {
        "message": "Custom message",
        "locale": "en",
        "history": [],
        "question_type": "ai_custom"
    }
    
    # Clear rate limit table
    with Session(engine) as session:
        # Clean up
        from sqlmodel import delete
        session.exec(delete(SupportChatRateLimit))
        session.commit()
        
    # 1. Trigger 10 requests successfully
    for i in range(10):
        response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        
    # 2. 11th request should trigger HTTP 429
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.json()["detail"]
    
    # 3. Clean up and set up specific active / stale count
    with Session(engine) as session:
        session.exec(delete(SupportChatRateLimit))
        session.commit()
        
        now = datetime.utcnow()
        # Add 5 active entries
        for i in range(5):
            session.add(SupportChatRateLimit(user_id="test_trainee_1", created_at=now))
        # Add 3 stale entries (older than 60 seconds)
        stale_time = now - timedelta(seconds=75)
        for i in range(3):
            session.add(SupportChatRateLimit(user_id="test_trainee_1", created_at=stale_time))
        session.commit()
        
    # Request should succeed because active count = 5 < 10, and the stale 3 should be purged during this call
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    
    # Verify database has purged the stale rows (only active rows remain)
    with Session(engine) as session:
        stale_rows = session.exec(
            select(SupportChatRateLimit).where(SupportChatRateLimit.created_at < now - timedelta(seconds=60))
        ).all()
        assert len(stale_rows) == 0

def test_quick_faq_logs_without_llm():
    # Make sure we mock client to None to verify no LLM call is made,
    # yet it still works and logs to database.
    import routers.support
    original_client = routers.support.client
    routers.support.client = None
    
    token = generate_signed_token("test_trainee_1")
    payload = {
        "message": "Nematode query",
        "locale": "en",
        "history": [],
        "question_type": "quick_faq"
    }
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["response"] == ""
    assert data["chat_id"] is not None
    
    # Restore client
    routers.support.client = original_client

def test_ai_custom_fallback():
    # Force OpenAI client to None
    import routers.support
    original_client = routers.support.client
    routers.support.client = None
    
    token = generate_signed_token("test_trainee_1")
    payload = {
        "message": "Custom guidance query",
        "locale": "en",
        "history": [],
        "question_type": "ai_custom"
    }
    response = client.post("/api/v1/support/chat", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["fallback_used"] is True
    assert "AI Support Chat is currently offline" in data["response"]
    
    # Restore
    routers.support.client = original_client

if __name__ == "__main__":
    setup_db()
    try:
        test_missing_bearer_token_rejected()
        test_malformed_token_rejected()
        test_expired_token_rejected()
        test_tampered_token_rejected()
        test_valid_token_accepted()
        test_spoofed_x_user_id_does_not_override_bearer()
        test_x_user_id_fallback_gating()
        test_feedback_ownership()
        test_database_limiter_blocks_and_purges()
        test_quick_faq_logs_without_llm()
        test_ai_custom_fallback()
        print("\nAll SeptiVolt Phase 2C support hardening integration tests PASSED successfully!")
    finally:
        # Cleanup test DB
        if os.path.exists(TEST_DB_FILE):
            try:
                os.remove(TEST_DB_FILE)
            except Exception:
                pass
