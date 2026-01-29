from dotenv import load_dotenv
load_dotenv()
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from pydantic import BaseModel
from models import TenantConfig, ChatRequest, ChatResponse, StateProfile, UserStats, User
from data import TENANT_CONFIGS, STATE_KNOWLEDGE_BASE, SCENARIOS
from services import TrainingService
from database import create_db_and_tables, get_session
from fastapi.responses import StreamingResponse
from certificate import generate_certificate_pdf
from voice import text_to_speech_stream
from routers import vapi # Vapi is the only valid router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="Solar Sales Trainer API", lifespan=lifespan)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = TrainingService()

@app.get("/")
def read_root():
    return {"status": "online", "version": "0.1"}

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

@app.post("/signup")
def signup(user_data: UserAuth, session: Session = Depends(get_session)):
    user = User(username=user_data.username, password=user_data.password)
    try:
        session.add(user)
        session.commit()
    except:
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"status": "created", "username": user.username}

@app.post("/login")
def login(user_data: UserAuth, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == user_data.username).where(User.password == user_data.password)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"status": "ok", "username": user.username}

@app.get("/scenarios")
def get_scenarios():
    return list(SCENARIOS.values())

@app.get("/user/{user_id}/stats")
def get_user_stats(user_id: str, session: Session = Depends(get_session)):
    stats = session.get(UserStats, user_id)
    if not stats:
        return UserStats(user_id=user_id, total_score=0, current_streak=0)
    return stats

class ProgressRequest(BaseModel):
    module_id: str
    type: str # 'quiz' or 'sim' or 'unlock'
    passed: bool

@app.post("/user/{user_id}/progress")
def update_progress(user_id: str, request: ProgressRequest, session: Session = Depends(get_session)):
    import json
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
    
    # Save back
    stats.module_progress = json.dumps(progress)
    session.add(stats)
    session.commit()
    session.refresh(stats)
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
    # 1. Get User Name
    # Try finding in User table first
    user = session.exec(select(User).where(User.username == user_id)).first()
    
    # Fallback to UserStats or just ID if not found
    display_name = user.username if user else user_id
    
    # 2. Check if they actually passed (Optional, but good for security)
    stats = session.get(UserStats, user_id)
    # We can be lenient for the prototype and just generate it
    
    # 3. Generate PDF
    pdf_buffer = generate_certificate_pdf(display_name)
    
    # 4. Return as File
    filename = f"Certificate_{display_name}.pdf"
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

class SpeakRequest(BaseModel):
    text: str
    voice_id: str = "21m00Tcm4TlvDq8ikWAM" # Rachel

@app.post("/speak")
def speak_endpoint(request: SpeakRequest):
    audio_stream = text_to_speech_stream(request.text, request.voice_id)
    return StreamingResponse(audio_stream, media_type="audio/mpeg")

# Register Routers
app.include_router(vapi.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
