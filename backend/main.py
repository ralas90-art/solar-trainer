from dotenv import load_dotenv
load_dotenv()
# Trigger reload for schema refresh
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Optional
from models import (
    TenantConfig, ChatRequest, ChatResponse, StateProfile, UserStats, 
    User, UserRole, PlanTier, Company
)
from data import TENANT_CONFIGS, STATE_KNOWLEDGE_BASE, SCENARIOS
from services import TrainingService
from database import create_db_and_tables, get_session
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from certificate import generate_certificate_pdf
from voice import text_to_speech_stream
from routers import vapi, analysis, kpis, certifications, analytics_snapshot, billing, enterprise

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
# We allow both the main domain and common variants
cors_origins = os.getenv("CORS_ORIGINS", "").split(",")
allow_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://solar-trainer.vercel.app",
    "https://solar-trainer.vercel.app/",
    "https://solar-trainer-git-main-ralas90-arts-projects.vercel.app", # Potential preview URL
]
# Merge with env origins
for o in cors_origins:
    if o.strip():
        allow_origins.append(o.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://localhost:.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Mount audio files from project root /audio directory
_AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio")
if os.path.isdir(_AUDIO_DIR):
    app.mount("/audio", StaticFiles(directory=_AUDIO_DIR), name="audio")

service = TrainingService()

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "version": "0.2.3", 
        "timestamp": datetime.now().isoformat(),
        "cors_debug": {
            "allowed_origins": allow_origins,
            "regex": "https://.*.vercel.app|https://.*.onrender.com|http://localhost:*"
        }
    }

@app.get("/tenants/{tenant_id}")
def get_tenant(tenant_id: str):
    tenant = TENANT_CONFIGS.get(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@app.get("/states/{state_code}")
def get_state(state_code: str):
    state = STATE_KNOWLEDGE_BASE.get(state_code)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state

# --- Auth Endpoints ---
class UserAuth(BaseModel):
    username: str
    password: str
    role: Optional[UserRole] = UserRole.SALES_REP
    company_id: Optional[str] = "septivolt"
    plan_tier: Optional[PlanTier] = PlanTier.STARTER

@app.post("/signup")
def signup(user_data: UserAuth, session: Session = Depends(get_session)):
    # 1. Ensure Company exists
    company = session.get(Company, user_data.company_id)
    if not company:
        company = Company(
            id=user_data.company_id,
            name=user_data.company_id.capitalize(),
            plan_tier=user_data.plan_tier or PlanTier.STARTER
        )
        session.add(company)
        session.commit()
        session.refresh(company)

    # 2. Create User
    user = User(
        username=user_data.username, 
        password=user_data.password,
        role=user_data.role,
        company_id=user_data.company_id
    )
    try:
        session.add(user)
        session.commit()
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=400, detail="Username already exists")
    
    return {
        "status": "created", 
        "username": user.username,
        "role": user.role,
        "company_id": user.company_id
    }

@app.post("/login")
def login(user_data: UserAuth, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == user_data.username).where(User.password == user_data.password)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Get plan tier from company
    company = session.get(Company, user.company_id)
    plan_tier = company.plan_tier if company else PlanTier.STARTER
    
    return {
        "status": "ok", 
        "username": user.username, 
        "role": user.role,
        "plan_tier": plan_tier,
        "company_id": user.company_id
    }

@app.get("/billing/calculate")
def calculate_billing(company_id: str, session: Session = Depends(get_session)):
    company = session.get(Company, company_id)
    if not company:
        # Default logic for prototype: Starter ($499 + $39/rep)
        platform_fee = 499.0
        per_rep_fee = 39.0
        tier = "starter"
    else:
        tier = company.plan_tier
        if tier == PlanTier.STARTER:
            platform_fee, per_rep_fee = 499.0, 39.0
        elif tier == PlanTier.GROWTH:
            platform_fee, per_rep_fee = 999.0, 59.0
        else: # Enterprise
            return {"tier": "enterprise", "message": "Custom Pricing - Contact Sales"}

    # Count active reps for this company
    statement = select(User).where(User.company_id == company_id).where(User.role == UserRole.SALES_REP)
    reps = session.exec(statement).all()
    rep_count = len(reps)
    
    total_monthly = platform_fee + (rep_count * per_rep_fee)
    
    return {
        "tier": tier,
        "rep_count": rep_count,
        "platform_fee": platform_fee,
        "per_rep_fee": per_rep_fee,
        "total_monthly": total_monthly,
        "currency": "USD"
    }

@app.get("/scenarios")
def get_scenarios():
    return list(SCENARIOS.values())

@app.get("/user/{user_id}/stats")
def get_user_stats(user_id: str, session: Session = Depends(get_session)):
    stats = session.get(UserStats, user_id)
    if not stats:
        # Create default stats if none exist
        stats = UserStats(user_id=user_id, total_score=0, current_streak=0, lives=3)
        session.add(stats)
        session.commit()
        session.refresh(stats)
    
    # Check for Life Regeneration
    if stats.lives < 3 and stats.last_life_lost_at:
        now = datetime.utcnow()
        diff = now - stats.last_life_lost_at
        hours_passed = diff.total_seconds() / 3600
        lives_to_restore = int(hours_passed // 2) # 1 life per 2 hours
        
        if lives_to_restore > 0:
            stats.lives = min(3, stats.lives + lives_to_restore)
            if stats.lives == 3:
                stats.last_life_lost_at = None
            else:
                stats.last_life_lost_at += timedelta(hours=lives_to_restore * 2)
            
            session.add(stats)
            session.commit()
            session.refresh(stats)

    return stats

class ProgressRequest(BaseModel):
    module_id: str
    type: str # 'quiz' or 'sim' or 'unlock'
    passed: bool
    score: int = 0
    xp: int = 0

@app.post("/user/{user_id}/progress")
def update_progress(user_id: str, request: ProgressRequest, session: Session = Depends(get_session)):
    stats = session.get(UserStats, user_id)
    if not stats:
        stats = UserStats(user_id=user_id)
    
    # Parse existing progress
    try:
        progress = json.loads(stats.module_progress)
    except:
        progress = {}
    
    # Update specific module
    if request.module_id not in progress:
        progress[request.module_id] = {}
    
    progress[request.module_id][request.type] = request.passed
    
    # Update Stats
    if request.passed:
        stats.total_score += request.xp
        stats.current_streak += 1
        if stats.current_streak > stats.highest_streak:
            stats.highest_streak = stats.current_streak
    else:
        stats.current_streak = 0
        # Deduct Life on Sim Failure
        if request.type == 'sim':
            if stats.lives > 0:
                stats.lives -= 1
                if stats.lives < 3 and not stats.last_life_lost_at:
                    stats.last_life_lost_at = datetime.utcnow()

    # Save back
    stats.module_progress = json.dumps(progress)
    session.add(stats)
    session.commit()
    session.refresh(stats)
    invalidate_analytics_cache_for_user(user_id)
    return stats

@app.get("/leaderboard")
def get_leaderboard(session: Session = Depends(get_session)):
    statement = select(UserStats).order_by(UserStats.total_score.desc()).limit(10)
    results = session.exec(statement).all()
    return results

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, session: Session = Depends(get_session)):
    return service.evaluate_response(request, session)

@app.get("/certificate/{user_id}")
def download_certificate(user_id: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == user_id)).first()
    display_name = user.username if user else user_id
    pdf_buffer = generate_certificate_pdf(display_name)
    filename = f"Certificate_{display_name}.pdf"
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

class SpeakRequest(BaseModel):
    text: str
    voice_id: str = "QO7Mfy7rwYLdxzo4Q3iD" # Tom (Confident Trainer)

@app.post("/speak")
def speak_endpoint(request: SpeakRequest):
    audio_stream = text_to_speech_stream(request.text, request.voice_id)
    return StreamingResponse(audio_stream, media_type="audio/mpeg")

# Register Routers
app.include_router(vapi.router)
app.include_router(analysis.router)
app.include_router(kpis.router)
app.include_router(certifications.router)
app.include_router(analytics_snapshot.router)
app.include_router(billing.router)
app.include_router(enterprise.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
