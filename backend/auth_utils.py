import bcrypt

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
