import os
import base64
from cryptography.fernet import Fernet
from typing import Optional
from fastapi import HTTPException

# Encryption Logic
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

def get_fernet() -> Fernet:
    """Returns a Fernet instance for encryption/decryption."""
    if not ENCRYPTION_KEY:
        if ENVIRONMENT == "production":
            raise HTTPException(
                status_code=500, 
                detail="Security configuration error: ENCRYPTION_KEY is missing in production."
            )
        else:
            # Local development fallback (NOT for production)
            # Using a stable dummy key for local dev to prevent migration issues
            dummy_key = base64.urlsafe_b64encode(b"septivolt_dev_key_32bytes_secret")
            return Fernet(dummy_key)
    
    try:
        return Fernet(ENCRYPTION_KEY.encode())
    except Exception:
        raise HTTPException(status_code=500, detail="Invalid ENCRYPTION_KEY format.")

def encrypt_key(plain_text: str) -> str:
    """Encrypts a plaintext API key."""
    if not plain_text:
        return None
    f = get_fernet()
    return f.encrypt(plain_text.encode()).decode()

def decrypt_key(encrypted_text: Optional[str]) -> Optional[str]:
    """Decrypts an encrypted API key."""
    if not encrypted_text:
        return None
    f = get_fernet()
    try:
        return f.decrypt(encrypted_text.encode()).decode()
    except Exception:
        return None # Return None if decryption fails (e.g. key changed)

def mask_key(key: Optional[str]) -> str:
    """Masks an API key for safe UI display (e.g. sk-****abcd)."""
    if not key:
        return ""
    if len(key) <= 8:
        return "****"
    return f"{key[:4]}****{key[-4:]}"
