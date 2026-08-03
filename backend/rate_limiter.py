import time
import re
import logging
from collections import defaultdict
from typing import Dict, List, Optional
from fastapi import Request, HTTPException, status

logger = logging.getLogger("rate_limiter")

# ─── In-Memory Storage for Rate Limiting ────────────────────────────────────
# IP -> list of timestamps
_RATE_LIMIT_STORE: Dict[str, Dict[str, List[float]]] = defaultdict(lambda: defaultdict(list))


def get_client_ip(request: Request) -> str:
    """Extract client IP address from X-Forwarded-For or Request."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # First IP in X-Forwarded-For is the real client IP behind proxies (Render/Cloudflare)
        return forwarded_for.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


def check_rate_limit(
    request: Request,
    key_prefix: str,
    max_requests: int = 30,
    window_seconds: int = 60
):
    """
    Sliding window rate-limiter per IP and route prefix.
    Raises HTTP 429 if request limit exceeded.
    """
    ip = get_client_ip(request)
    now = time.time()
    cutoff = now - window_seconds

    ip_store = _RATE_LIMIT_STORE[key_prefix][ip]
    # Filter out timestamps older than window
    valid_timestamps = [ts for ts in ip_store if ts > cutoff]
    _RATE_LIMIT_STORE[key_prefix][ip] = valid_timestamps

    if len(valid_timestamps) >= max_requests:
        logger.warning(f"[RATE LIMIT BLOCKED] IP: {ip} for route prefix: {key_prefix} ({len(valid_timestamps)} reqs in {window_seconds}s)")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many requests. Limit is {max_requests} requests per {window_seconds} seconds. Please try again later.",
            headers={"Retry-After": str(window_seconds)}
        )

    _RATE_LIMIT_STORE[key_prefix][ip].append(now)


def validate_transcript_limits(
    messages: list,
    max_messages: int = 50,
    max_msg_len: int = 2000,
    max_total_len: int = 20000
):
    """
    Validates transcript message counts and string lengths to prevent prompt bloat and AI token exhaustion.
    """
    if len(messages) > max_messages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Transcript exceeds maximum allowed message count of {max_messages} messages."
        )

    total_len = 0
    for msg in messages:
        content = getattr(msg, "content", "") if hasattr(msg, "content") else str(msg.get("content", "") if isinstance(msg, dict) else "")
        if len(content) > max_msg_len:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Individual message content exceeds maximum allowed length of {max_msg_len} characters."
            )
        total_len += len(content)

    if total_len > max_total_len:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Total transcript length exceeds maximum allowed limit of {max_total_len} characters."
        )


def validate_email_format(email: str) -> bool:
    """Validates basic RFC-compliant email structure."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email.strip()))
