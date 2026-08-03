import bcrypt
import hmac
import hashlib
import json
import base64
import os
import time
import logging
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status, Depends
from sqlmodel import Session, select
from database import get_session

logger = logging.getLogger("auth_utils")

class CustomCryptContext:
    def __init__(self, schemes=None, deprecated=None):
        pass
        
    def hash(self, secret: str) -> str:
        if isinstance(secret, str):
            secret_bytes = secret.encode("utf-8")
        else:
            secret_bytes = secret
        hashed = bcrypt.hashpw(secret_bytes, bcrypt.gensalt())
        return hashed.decode("utf-8")
        
    def verify(self, secret: str, hash_val: str) -> bool:
        if not hash_val:
            return False
        if isinstance(secret, str):
            secret_bytes = secret.encode("utf-8")
        else:
            secret_bytes = secret
        if isinstance(hash_val, str):
            hash_bytes = hash_val.encode("utf-8")
        else:
            hash_bytes = hash_val
        try:
            return bcrypt.checkpw(secret_bytes, hash_bytes)
        except Exception:
            return False

# Drop-in replacement for passlib CryptContext
CryptContext = CustomCryptContext
pwd_context = CustomCryptContext()

# --- Secure HMAC Token Authentication ---
AUTH_TOKEN_SECRET_RAW = os.getenv("AUTH_TOKEN_SECRET")
IS_PRODUCTION = os.getenv("ENV") == "production"

if IS_PRODUCTION and not AUTH_TOKEN_SECRET_RAW:
    AUTH_TOKEN_SECRET = None
else:
    AUTH_TOKEN_SECRET = AUTH_TOKEN_SECRET_RAW or "septivolt_auth_production_secret_key_987654321"

def generate_signed_token(
    username: str,
    role: Optional[str] = None,
    company_id: Optional[str] = None,
    expires_in: int = 86400
) -> str:
    """
    Generates a secure HMAC-SHA256 signed token with:
    - sub: username
    - role: user role (optional claim)
    - company_id: company ID (optional claim)
    - iat: issued-at timestamp (int)
    - exp: expiration timestamp (int)
    - type: "access"
    """
    if not AUTH_TOKEN_SECRET:
        raise RuntimeError("Security Configuration Error: AUTH_TOKEN_SECRET is missing in production.")
    now = int(time.time())
    payload: Dict[str, Any] = {
        "sub": username,
        "iat": now,
        "exp": now + expires_in,
        "type": "access"
    }
    if role:
        payload["role"] = str(role)
    if company_id:
        payload["company_id"] = str(company_id)

    payload_json = json.dumps(payload, separators=(',', ':'))
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode("utf-8")).decode("utf-8")
    
    # Sign the base64-encoded payload
    sig = hmac.new(AUTH_TOKEN_SECRET.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{sig}"

def verify_signed_token_payload(token: str) -> Optional[Dict[str, Any]]:
    """
    Verifies token signature, expiration, and format.
    Returns the parsed payload dict if valid, otherwise None.
    """
    if not AUTH_TOKEN_SECRET:
        return None
    try:
        if not token or "." not in token:
            return None
        parts = token.split(".", 1)
        if len(parts) != 2:
            return None
        payload_b64, sig = parts
        
        # Verify HMAC signature in constant time to prevent timing attacks
        expected_sig = hmac.new(AUTH_TOKEN_SECRET.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig.encode("utf-8"), expected_sig.encode("utf-8")):
            return None
            
        # Decode and parse payload
        payload_json = base64.urlsafe_b64decode(payload_b64.encode("utf-8")).decode("utf-8")
        payload = json.loads(payload_json)
        
        # Verify fields
        if payload.get("type") != "access":
            return None
        if "exp" not in payload or "sub" not in payload:
            return None
            
        # Verify expiration
        now = int(time.time())
        if now > payload["exp"]:
            return None
            
        return payload
    except Exception:
        pass
    return None

def verify_signed_token(token: str) -> Optional[str]:
    """
    Verifies token signature and expiration.
    Returns the username (sub) if valid, otherwise None.
    Preserved for backward compatibility.
    """
    payload = verify_signed_token_payload(token)
    if payload and "sub" in payload:
        return str(payload["sub"])
    return None


# --- Centralized FastAPI Authentication Dependencies ---

def get_current_user(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    session: Session = Depends(get_session)
):
    """
    Dependency: Authenticates the user via Bearer JWT token in Authorization header.
    Validates token signature, expiration, and loads verified user record from DB.
    """
    return _resolve_user_from_auth_header(authorization, session)

def _resolve_user_from_auth_header(
    authorization: Optional[str],
    session: Session
):
    from models.user import User

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header. Bearer token required.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = authorization[len("Bearer "):].strip()
    payload = verify_signed_token_payload(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims: subject missing.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user no longer exists.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user

def require_current_user(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    session: Session = Depends()
):
    """Alias for get_current_user."""
    return get_current_user(authorization=authorization, session=session)

def require_same_company(user, target_company_id: str) -> None:
    """
    Ensures requesting user belongs to the target company (tenant isolation).
    super_admin is allowed cross-company access.
    """
    user_role = getattr(user, "role", "")
    role_str = getattr(user_role, "value", str(user_role)).lower()
    
    if role_str == "super_admin":
        return

    user_company = getattr(user, "company_id", None)
    if user_company != target_company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: cross-tenant access is prohibited."
        )

def require_super_admin(user=Depends(get_current_user)):
    """Enforces that the authenticated user is a platform super_admin."""
    user_role = getattr(user, "role", "")
    role_str = getattr(user_role, "value", str(user_role)).lower()
    if role_str != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Super admin access required."
        )
    return user

def require_company_admin_or_super_admin(user=Depends(get_current_user)):
    """Enforces that the authenticated user is an admin, dealer_admin, or super_admin."""
    user_role = getattr(user, "role", "")
    role_str = getattr(user_role, "value", str(user_role)).lower()
    if role_str not in ("admin", "dealer_admin", "super_admin", "manager", "branch_manager"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Administrative privileges required."
        )
    return user
