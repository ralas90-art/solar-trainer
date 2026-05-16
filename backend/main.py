from dotenv import load_dotenv
load_dotenv()
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Optional
from auth_utils import get_password_hash, verify_password, create_access_token
from models import (
    TenantConfig, ChatRequest, ChatResponse, StateProfile, UserStats, 
    User, UserRole, PlanTier, Company, Membership, Invitation
)
from data import TENANT_CONFIGS, STATE_KNOWLEDGE_BASE, SCENARIOS
from services import TrainingService
from database import create_db_and_tables, get_session
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from certificate import generate_certificate_pdf
from voice import text_to_speech_stream
from routers import (
    vapi, analysis, kpis, certifications, analytics_snapshot, 
    billing, enterprise, invites, team, company_settings, 
    preview, ai_usage, webhooks, leaderboard, coaching
)

from routers.analytics_snapshot import invalidate_analytics_cache_for_user
import os
import json
from datetime import datetime, timedelta

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("STARTING SERVER AND SEEDING DATABASE...")
    create_db_and_tables()
    yield

app = FastAPI(title="Solar Sales Trainer API", lifespan=lifespan)

# Enable CORS for Frontend - Robust Configuration
cors_origins = os.getenv("CORS_ORIGINS", "").split(",")
allow_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://solar-trainer.vercel.app",
    "https://solar-trainer.vercel.app/",
    "https://solar-trainer-git-main-ralas90-arts-projects.vercel.app",
    "https://septivolt.com",
    "https://www.septivolt.com"
]
for o in cors_origins:
    if o.strip():
        allow_origins.append(o.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://localhost:.*|https://.*septivolt\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Mount audio files
_AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio")
if os.path.isdir(_AUDIO_DIR):
    app.mount("/audio", StaticFiles(directory=_AUDIO_DIR), name="audio")

service = TrainingService()

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "version": "1.2.0-LEADERBOARD", 
        "timestamp": datetime.now().isoformat()
    }

# --- Auth Endpoints ---
class UserAuth(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    company_id: Optional[str] = "septivolt"
    role: Optional[UserRole] = UserRole.MANAGER

@app.post("/signup")
def signup(user_data: UserAuth, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    company = session.get(Company, user_data.company_id)
    if not company:
        company = Company(
            id=user_data.company_id,
            name=user_data.company_id.capitalize(),
            plan_tier=PlanTier.STARTER
        )
        session.add(company)
        session.commit()
        session.refresh(company)

    user = User(
        email=user_data.email, 
        password=get_password_hash(user_data.password),
        full_name=user_data.full_name
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    membership = Membership(
        user_id=user.id,
        company_id=company.id,
        role=user_data.role or UserRole.MANAGER
    )
    session.add(membership)
    
    stats = UserStats(user_id=user.id)
    session.add(stats)
    
    session.commit()
    
    return {"status": "created", "email": user.email, "company_id": company.id}

@app.post("/login")
def login(user_data: UserAuth, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user_data.email)
    user = session.exec(statement).first()
    
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    m_statement = select(Membership).where(Membership.user_id == user.id)
    membership = session.exec(m_statement).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="No active company membership")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "status": "ok", 
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": membership.role,
            "company_id": membership.company_id
        }
    }

@app.get("/scenarios")
def get_scenarios():
    return list(SCENARIOS.values())

@app.get("/user/{user_id}/stats")
def get_user_stats(user_id: str, session: Session = Depends(get_session)):
    from uuid import UUID
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    stats = session.get(UserStats, user_uuid)
    if not stats:
        stats = UserStats(user_id=user_uuid)
        session.add(stats)
        session.commit()
        session.refresh(stats)
    
    # Life regeneration logic
    if stats.lives < 3 and stats.last_life_lost_at:
        now = datetime.utcnow()
        diff = now - stats.last_life_lost_at
        hours_passed = diff.total_seconds() / 3600
        lives_to_restore = int(hours_passed // 2)
        if lives_to_restore > 0:
            stats.lives = min(3, stats.lives + lives_to_restore)
            stats.last_life_lost_at = None if stats.lives == 3 else stats.last_life_lost_at + timedelta(hours=lives_to_restore * 2)
            session.add(stats)
            session.commit()
            session.refresh(stats)
    return stats

class ProgressRequest(BaseModel):
    module_id: str
    type: str 
    passed: bool
    score: int = 0
    xp: int = 0

@app.post("/user/{user_id}/progress")
def update_progress(user_id: str, request: ProgressRequest, session: Session = Depends(get_session)):
    from uuid import UUID
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    stats = session.get(UserStats, user_uuid)
    if not stats:
        stats = UserStats(user_id=user_uuid)
    
    try:
        progress = json.loads(stats.module_progress)
    except:
        progress = {}
    
    if request.module_id not in progress:
        progress[request.module_id] = {}
    
    progress[request.module_id][request.type] = request.passed
    
    # Engagement Tracking (Phase 2)
    stats.last_interaction_at = datetime.utcnow()
    try:
        log = json.loads(stats.activity_log) if stats.activity_log else []
    except:
        log = []
    
    event_type = f"{request.type}_completed"
    log.append({
        "event": event_type,
        "timestamp": stats.last_interaction_at.isoformat(),
        "date": stats.last_interaction_at.date().isoformat(),
        "module_id": request.module_id,
        "score": request.score
    })
    stats.activity_log = json.dumps(log[-50:])

    if request.passed:
        stats.total_score += request.xp
        stats.current_streak += 1
        if stats.current_streak > stats.highest_streak:
            stats.highest_streak = stats.current_streak
    else:
        stats.current_streak = 0
        if request.type == 'sim':
            if stats.lives > 0:
                stats.lives -= 1
                if stats.lives < 3 and not stats.last_life_lost_at:
                    stats.last_life_lost_at = datetime.utcnow()

    stats.module_progress = json.dumps(progress)
    session.add(stats)
    session.commit()
    session.refresh(stats)
    invalidate_analytics_cache_for_user(user_id)
    return stats

from middleware.auth import get_current_membership, require_role, require_admin

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    request: ChatRequest, 
    session: Session = Depends(get_session),
    membership: Membership = Depends(get_current_membership)
):
    company = session.get(Company, membership.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return service.evaluate_response(request, session, company, membership.user_id)

# Register Routers
app.include_router(leaderboard.router)
app.include_router(vapi.router)
app.include_router(analysis.router)
app.include_router(kpis.router)
app.include_router(certifications.router)
app.include_router(analytics_snapshot.router)
app.include_router(billing.router)
app.include_router(enterprise.router)
app.include_router(invites.router)
app.include_router(team.router)
app.include_router(company_settings.router, prefix="/api/v1/company", tags=["Company Settings"])
app.include_router(preview.router, prefix="/api/v1/preview", tags=["Preview"])
app.include_router(ai_usage.router)
app.include_router(webhooks.router)
app.include_router(coaching.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
