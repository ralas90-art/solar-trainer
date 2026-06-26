from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime, timedelta
from pathlib import Path
from openai import OpenAI
from sqlmodel import Session, select, delete
from database import get_session
from models.user import User
from models.support_analytics import SupportChatAnalytics, SupportChatRateLimit
from auth_utils import verify_signed_token

router = APIRouter()

# Resolve path to docs/septivolt-support-manual.md safely
ROUTER_DIR = Path(__file__).parent
MANUAL_PATH = ROUTER_DIR.parent.parent / "docs" / "septivolt-support-manual.md"

# Safe fallback content in case the manual file cannot be read
FALLBACK_MANUAL_CONTENT = """
# SeptiVolt Platform Guide
- Dashboard: View your stats, current streak, lives (Hearts), XP, and the 7-day training map.
- My Training: Access 7 days of training and 79 modules. Includes workbook inputs.
- AI Simulator: practice client dialogues (A.R.T. Framework: Acknowledge, Respond, Transition). Pass score is 80+.
- Lives System: 3 Hearts max. 1 Heart restores every 2 hours. Locked out of simulation at 0 Hearts.
- Certifications: Complete Day 1-6 modules and pass Module 6 final boss exam to download a PDF certificate.
- KPI Tracker: Log daily doors knocked, contacts made, leads qualified, proposals shown, and contracts signed.
- Settings: Manage profile username, password. Admins manage user invites and custom company settings.
- Language Toggle: Switch EN/ES in Navbar or audio player to translate slides and voice narrations (Tom V3 / Alberto V3).
"""

def load_support_manual() -> str:
    if MANUAL_PATH.exists():
        try:
            return MANUAL_PATH.read_text(encoding="utf-8")
        except Exception as e:
            print(f"[Support Router] Warning: Failed to read manual file: {e}")
    return FALLBACK_MANUAL_CONTENT

# Safely initialize OpenAI client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
try:
    if OPENAI_API_KEY:
        client = OpenAI(api_key=OPENAI_API_KEY)
    else:
        client = None
except Exception as e:
    print(f"[Support Router] OpenAI initialization failed: {e}")
    client = None

# --- Distributed Database-Backed Rate Limiter ---
# NOTE: For high-traffic production environments scaling across many servers,
# a dedicated distributed cache like Redis remains the preferred choice.
def check_rate_limit(session: Session, user_id: str, locale: str = "en", limit_seconds: int = 60, max_requests: int = 10):
    now = datetime.utcnow()
    window_start = now - timedelta(seconds=limit_seconds)
    
    # 1. Self-cleanup of stale rate limit records
    session.exec(delete(SupportChatRateLimit).where(SupportChatRateLimit.created_at < window_start))
    session.commit()
    
    # 2. Count requests in the active window
    stmt = select(SupportChatRateLimit).where(
        SupportChatRateLimit.user_id == user_id,
        SupportChatRateLimit.created_at >= window_start
    )
    request_count = len(session.exec(stmt).all())
    
    if request_count >= max_requests:
        detail = (
            "Límite de velocidad excedido. Por favor, espere antes de hacer otra pregunta."
            if locale == "es"
            else "Rate limit exceeded. Please wait before asking another question."
        )
        raise HTTPException(
            status_code=429,
            detail=detail
        )
    
    # 3. Insert new rate limit record
    rate_entry = SupportChatRateLimit(user_id=user_id, created_at=now)
    session.add(rate_entry)
    session.commit()

# --- Session Authentication Dependency ---
def get_authenticated_user(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    session: Session = Depends(get_session)
) -> User:
    username = None
    has_bearer = False
    
    # 1. Verify Bearer Token in Authorization header
    if authorization and authorization.startswith("Bearer "):
        has_bearer = True
        token = authorization[len("Bearer "):]
        username = verify_signed_token(token)
        
    # 2. Staging Fallback ONLY: check client-provided X-User-Id
    STAGING_AUTH_FALLBACK = os.getenv("STAGING_AUTH_FALLBACK", "false").lower() == "true"
    if not has_bearer and not username and STAGING_AUTH_FALLBACK and x_user_id:
        username = x_user_id
        
    if not username:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Invalid or missing authentication credentials."
        )
        
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Authenticated user not found."
        )
    return user

# --- DTO Schemas ---
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class SupportChatRequest(BaseModel):
    message: str
    locale: str = "en"
    history: List[ChatMessage] = []
    question_type: str = "ai_custom"  # "quick_faq" or "ai_custom"
    context_area: Optional[str] = None

class FeedbackRequest(BaseModel):
    chat_id: int
    helpful: bool

# --- Endpoints ---

@router.post("/api/v1/support/chat")
async def support_chat(
    request: SupportChatRequest,
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session)
):
    preview = request.message[:200]
    
    # 1. Handle Quick FAQs instantly without calling LLM
    if request.question_type == "quick_faq":
        analytics = SupportChatAnalytics(
            user_id=user.username,
            role=user.role,
            locale=request.locale,
            question_type="quick_faq",
            question_preview=preview,
            fallback_used=False,
            context_area=request.context_area,
            created_at=datetime.utcnow()
        )
        session.add(analytics)
        session.commit()
        session.refresh(analytics)
        return {
            "response": "",
            "fallback_used": False,
            "chat_id": analytics.id
        }

    # 2. Run database-backed rate limiter for custom AI requests
    check_rate_limit(session, user.username, request.locale)

    # 3. Add message & history length capping (token usage control)
    if len(request.message) > 500:
        detail = (
            "El mensaje es demasiado largo. Por favor, limítelo a 500 caracteres o menos."
            if request.locale == "es"
            else "Message is too long. Please limit to 500 characters or less."
        )
        raise HTTPException(status_code=400, detail=detail)

    # Truncate history to last 6 messages and limit individual messages to 300 characters
    capped_history = []
    for msg in request.history[-6:]:
        capped_history.append(
            ChatMessage(
                role=msg.role,
                content=msg.content[:300]
            )
        )

    # 4. Load manual context
    manual_context = load_support_manual()
    
    # 5. Check if OpenAI client is available & invoke completion
    fallback_used = False
    response_text = ""
    
    if not client:
        fallback_used = True
        response_text = (
            "El chat de soporte con IA está actualmente sin conexión. Por favor, consulte el Manual de Soporte en `docs/` o utilice las preguntas rápidas frecuentes."
            if request.locale == "es"
            else "AI Support Chat is currently offline. Please refer to the Support Manual in `docs/` or use the quick FAQ buttons."
        )
    else:
        # Construct system instructions
        system_prompt = f"""
You are the SeptiVolt AI Assistant, a helpful and concise support coach for trainees in the SeptiVolt Solar Sales Trainer platform.
Your task is to answer user questions about using the application, how features work, and where to find settings based on the SUPPORT MANUAL below.

SUPPORT MANUAL CONTEXT:
{manual_context}

RULES FOR YOUR RESPONSES:
- Keep answers extremely concise and clear (1-3 sentences or short bullet points).
- Strictly align with the manual context. If a question is unrelated to the platform or solar training, politely decline to answer.
- Answer in the same language as the user's request (e.g., if locale is "es" or input is in Spanish, respond in Spanish; otherwise English).
- Do not mention implementation details, API keys, or raw code paths.
- Be supportive, consultative, and encourage the trainee to succeed.
"""
        messages = [{"role": "system", "content": system_prompt}]
        for msg in capped_history:
            messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": request.message})

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.4,
                max_tokens=250
            )
            response_text = response.choices[0].message.content.strip()
        except Exception as e:
            print(f"[Support Router] Error during OpenAI completion: {e}")
            fallback_used = True
            response_text = (
                "Lo siento, tuve un problema al conectarme al servicio de IA. Inténtalo de nuevo en unos momentos."
                if request.locale == "es"
                else "Sorry, I encountered an issue connecting to the AI service. Please try again in a few moments."
            )

    # 6. Log Custom AI Analytics interaction to database
    analytics = SupportChatAnalytics(
        user_id=user.username,
        role=user.role,
        locale=request.locale,
        question_type="ai_custom",
        question_preview=preview,
        fallback_used=fallback_used,
        context_area=request.context_area,
        created_at=datetime.utcnow()
    )
    session.add(analytics)
    session.commit()
    session.refresh(analytics)

    return {
        "response": response_text,
        "fallback_used": fallback_used,
        "chat_id": analytics.id
    }

@router.post("/api/v1/support/chat/feedback")
async def support_chat_feedback(
    request: FeedbackRequest,
    user: User = Depends(get_authenticated_user),
    session: Session = Depends(get_session)
):
    # Retrieve analytics record
    analytics = session.get(SupportChatAnalytics, request.chat_id)
    if not analytics:
        raise HTTPException(
            status_code=404,
            detail="Chat record not found."
        )
    
    # Verify record belongs to the current authenticated user
    if analytics.user_id != user.username:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: This chat record does not belong to you."
        )
        
    # Update helpfulness rating
    analytics.helpful = request.helpful
    session.add(analytics)
    session.commit()
    
    return {"status": "success"}
