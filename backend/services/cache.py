"""
In-Memory Render Cache Service
High-performance caching for structured content and templates.
Easily migratable to Redis.
"""
import hashlib
from typing import Optional, Dict, Any

RENDER_CACHE: Dict[str, Any] = {}

def get_cache_key(company_id: str, content_id: str, content_version: int, profile_version: int) -> str:
    """Generate a unique cache key based on versions."""
    key_string = f"{company_id}:{content_id}:{content_version}:{profile_version}"
    return hashlib.md5(key_string.encode()).hexdigest()

def get_cached_render(cache_key: str) -> Optional[Any]:
    """Retrieve rendered payload if available."""
    return RENDER_CACHE.get(cache_key)

def set_cached_render(cache_key: str, rendered_payload: Any):
    """Store rendered payload in cache."""
    RENDER_CACHE[cache_key] = rendered_payload
    
def clear_cache():
    """Clear all cache. Useful for tests or manual invalidation."""
    RENDER_CACHE.clear()
