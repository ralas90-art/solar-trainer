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

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="Solar Sales Trainer API", lifespan=lifespan)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
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

@app.get("/leaderboard")
def get_leaderboard(session: Session = Depends(get_session)):
    statement = select(UserStats).order_by(UserStats.total_score.desc()).limit(10)
    results = session.exec(statement).all()
    return results

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, session: Session = Depends(get_session)):
    return service.evaluate_response(request, session)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
