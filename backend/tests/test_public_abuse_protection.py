import pytest
import models
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from fastapi.testclient import TestClient

import main
from database import get_session
from rate_limiter import _RATE_LIMIT_STORE

local_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

SQLModel.metadata.create_all(local_engine)
client = TestClient(main.app)

@pytest.fixture(name="session", autouse=True)
def setup_db():
    main.app.dependency_overrides[get_session] = lambda: Session(local_engine)
    _RATE_LIMIT_STORE.clear()
    with Session(local_engine) as session:
        # Clear tables content instead of drop_all
        session.exec(models.EnterpriseInquiry.__table__.delete())
        session.commit()
    yield
    main.app.dependency_overrides.clear()


# ─── PUBLIC SIMULATION ABUSE PROTECTION ───────────────────────────────────────

def test_public_simulation_turn_normal_request_allowed():
    res = client.post(
        "/api/v1/simulation/turn",
        json={
            "scenario_id": "d2d_1",
            "difficulty": "medium",
            "state_code": "CA",
            "transcript": [{"role": "user", "content": "How is the roof installed?"}],
            "latest_rep_message": "How is the roof installed?"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert "homeowner_reply" in data


def test_public_simulation_turn_oversized_message_rejected():
    oversized_msg = "A" * 2005
    res = client.post(
        "/api/v1/simulation/turn",
        json={
            "scenario_id": "d2d_1",
            "difficulty": "medium",
            "state_code": "CA",
            "transcript": [],
            "latest_rep_message": oversized_msg
        }
    )
    assert res.status_code == 400


def test_public_simulation_turn_oversized_transcript_rejected():
    oversized_transcript = [{"role": "user", "content": "Hello"} for _ in range(55)]
    res = client.post(
        "/api/v1/simulation/turn",
        json={
            "scenario_id": "d2d_1",
            "difficulty": "medium",
            "state_code": "CA",
            "transcript": oversized_transcript,
            "latest_rep_message": "Hello"
        }
    )
    assert res.status_code == 400


def test_public_simulation_turn_rate_limited():
    _RATE_LIMIT_STORE.clear()
    payload = {
        "scenario_id": "d2d_1",
        "difficulty": "medium",
        "state_code": "CA",
        "transcript": [{"role": "user", "content": "Hello"}],
        "latest_rep_message": "Hello"
    }
    for _ in range(30):
        res = client.post("/api/v1/simulation/turn", json=payload)
        assert res.status_code == 200

    res = client.post("/api/v1/simulation/turn", json=payload)
    assert res.status_code == 429
    assert "Too many requests" in res.json()["detail"]


# ─── VAPI ASSISTANT ABUSE PROTECTION ──────────────────────────────────────────

def test_vapi_assistant_normal_request_allowed():
    res = client.post(
        "/api/v1/vapi/assistant",
        json={
            "name": "Solar Homeowner",
            "system_prompt": "You are a friendly homeowner."
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert "model" in data
    assert "voice" in data


def test_vapi_assistant_oversized_prompt_rejected():
    oversized_prompt = "X" * 10005
    res = client.post(
        "/api/v1/vapi/assistant",
        json={
            "name": "Solar Homeowner",
            "system_prompt": oversized_prompt
        }
    )
    assert res.status_code == 400


# ─── ENTERPRISE INQUIRY FORM SPAM PROTECTION ─────────────────────────

def test_enterprise_inquiry_normal_submission_allowed():
    res = client.post(
        "/enterprise/inquiry",
        json={
            "name": "John Solar",
            "email": "john@solardomain.com",
            "company": "Solar Inc",
            "teamSize": 25,
            "useCase": "Sales rep onboarding"
        }
    )
    assert res.status_code == 200
    assert res.json()["status"] == "received"
    assert res.json()["id"] > 0


def test_enterprise_inquiry_invalid_email_rejected():
    res = client.post(
        "/enterprise/inquiry",
        json={
            "name": "John Solar",
            "email": "invalid_email_no_at_symbol",
            "company": "Solar Inc",
            "teamSize": 25,
            "useCase": "Sales rep onboarding"
        }
    )
    assert res.status_code == 400
    assert "Invalid email address format" in res.json()["detail"]


def test_enterprise_inquiry_honeypot_silently_dropped():
    res = client.post(
        "/enterprise/inquiry",
        json={
            "name": "Spam Bot",
            "email": "bot@spamdomain.com",
            "company": "Spam LLC",
            "teamSize": 100,
            "useCase": "Spamming",
            "website": "http://spam-link.com"
        }
    )
    assert res.status_code == 200
    assert res.json()["id"] == 0


def test_enterprise_inquiry_duplicate_prevented():
    payload = {
        "name": "Alice Solar",
        "email": "alice@solardomain.com",
        "company": "Solar World",
        "teamSize": 10,
        "useCase": "Training"
    }
    res1 = client.post("/enterprise/inquiry", json=payload)
    assert res1.status_code == 200
    id1 = res1.json()["id"]

    res2 = client.post("/enterprise/inquiry", json=payload)
    assert res2.status_code == 200
    id2 = res2.json()["id"]

    assert id1 == id2


def test_enterprise_inquiry_rate_limited():
    _RATE_LIMIT_STORE.clear()
    for i in range(5):
        res = client.post(
            "/enterprise/inquiry",
            json={
                "name": f"User {i}",
                "email": f"user{i}@solardomain.com",
                "company": "Solar Inc",
                "teamSize": 5,
                "useCase": "Demo"
            }
        )
        assert res.status_code == 200

    res = client.post(
        "/enterprise/inquiry",
        json={
            "name": "User 6",
            "email": "user6@solardomain.com",
            "company": "Solar Inc",
            "teamSize": 5,
            "useCase": "Demo"
        }
    )
    assert res.status_code == 429


# ─── PROTECTED VS PUBLIC ISOLATION VERIFICATION ───────────────────────────────

def test_protected_endpoint_still_requires_jwt():
    res = client.get("/api/v1/admin/integration-status")
    assert res.status_code == 401


def test_public_endpoint_still_reachable_without_jwt():
    res = client.get("/api/v1/simulation/health")
    assert res.status_code == 200
    assert res.json()["fallback_available"] is True
