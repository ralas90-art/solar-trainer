import bcrypt
import hmac
import hashlib
import json
import base64
import os
import time
from typing import Optional

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

def generate_signed_token(username: str, expires_in: int = 86400) -> str:
    """
    Generates a secure HMAC-SHA256 signed token with:
    - sub: username
    - iat: issued-at timestamp (int)
    - exp: expiration timestamp (int)
    - type: "access"
    """
    if not AUTH_TOKEN_SECRET:
        raise RuntimeError("Security Configuration Error: AUTH_TOKEN_SECRET is missing in production.")
    now = int(time.time())
    payload = {
        "sub": username,
        "iat": now,
        "exp": now + expires_in,
        "type": "access"
    }
    payload_json = json.dumps(payload, separators=(',', ':'))
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode("utf-8")).decode("utf-8")
    
    # Sign the base64-encoded payload
    sig = hmac.new(AUTH_TOKEN_SECRET.encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{sig}"

def verify_signed_token(token: str) -> Optional[str]:
    """
    Verifies token signature, expiration, and format.
    Returns the username (sub) if valid, otherwise None.
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
            
        return payload["sub"]
    except Exception:
        pass
    return None
