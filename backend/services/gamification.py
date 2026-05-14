from typing import Dict, Any

# IMPORTANT: Keep thresholds in sync with frontend/lib/gamification-core.ts and backend/services/gamification.py

def calculate_level(xp: int) -> int:
    """Determine level based on XP thresholds."""
    if xp < 200: return 1
    if xp < 500: return 2
    if xp < 1000: return 3
    if xp < 2000: return 4
    
    # Level 5+ calculation: Scales by 1500 XP per level
    base_l5_xp = 2000
    step_per_level = 1500
    return 5 + ((xp - base_l5_xp) // step_per_level)

def get_level_progress(xp: int) -> Dict[str, Any]:
    """Calculate progress percentage toward the next level."""
    level = calculate_level(xp)
    
    if xp < 200:
        min_xp = 0
        max_xp = 200
    elif xp < 500:
        min_xp = 200
        max_xp = 500
    elif xp < 1000:
        min_xp = 500
        max_xp = 1000
    elif xp < 2000:
        min_xp = 1000
        max_xp = 2000
    else:
        min_xp = 2000 + (level - 5) * 1500
        max_xp = min_xp + 1500
    
    xp_in_level = xp - min_xp
    range_size = max_xp - min_xp
    progress = (xp_in_level / range_size) * 100 if range_size > 0 else 0
    
    return {
        "currentLevel": level,
        "nextLevel": level + 1,
        "progress": round(min(100, max(0, progress))),
        "xpInLevel": xp_in_level,
        "xpToNext": max_xp - xp
    }
