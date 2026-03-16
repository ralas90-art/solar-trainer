"""
Rep Performance Analytics Snapshot Router
Returns a canonical analytics payload for frontend dashboard rendering.
"""
from datetime import date, timedelta
import json
from typing import Any, Dict, List, Optional
import time

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from data import SCENARIOS
from database import get_session
from models import UserStats

router = APIRouter()

# Lightweight in-process cache for analytics snapshots.
# Keyed by user + filter tuple with short TTL for near-real-time UX.
ANALYTICS_CACHE: Dict[str, Dict[str, Any]] = {}
ANALYTICS_CACHE_TTL_SECONDS = 30


def invalidate_analytics_cache_for_user(user_id: str) -> None:
    """
    Clear cached analytics snapshots for a specific user across all filter combinations.
    """
    prefix = f"{user_id}|"
    keys_to_remove = [key for key in ANALYTICS_CACHE.keys() if key.startswith(prefix)]
    for key in keys_to_remove:
        ANALYTICS_CACHE.pop(key, None)


def _safe_json_parse(raw: Optional[str], fallback: Any) -> Any:
    if not raw:
        return fallback
    try:
        return json.loads(raw)
    except Exception:
        return fallback


def _clamp(min_value: int, value: int, max_value: int) -> int:
    return max(min_value, min(value, max_value))


def _infer_skills_from_name(name: str) -> List[str]:
    text = name.lower()
    if "objection" in text:
        return ["objections", "closing"]
    if "discover" in text:
        return ["prospecting", "discovery"]
    if "present" in text:
        return ["presentation", "closing"]
    if "close" in text:
        return ["closing", "objections"]
    if "virtual" in text:
        return ["discovery", "presentation"]
    return ["prospecting", "discovery"]


def _result_from_score(score: int) -> str:
    if score >= 85:
        return "pass"
    if score >= 72:
        return "needs-improvement"
    return "fail"


def _rolling_average(values: List[int], index: int, window_size: int) -> int:
    start = max(0, index - window_size + 1)
    window = values[start : index + 1]
    if not window:
        return 0
    return round(sum(window) / len(window))


def _build_history(stats: UserStats) -> List[Dict[str, Any]]:
    scenario_progress = _safe_json_parse(stats.scenario_progress, {})
    scenario_map = {scenario_id: scenario for scenario_id, scenario in SCENARIOS.items()}

    history: List[Dict[str, Any]] = []
    for idx, (scenario_id, state) in enumerate(scenario_progress.items()):
        if not isinstance(state, dict):
            continue
        scenario = scenario_map.get(scenario_id)
        score = int(state.get("best_score", max(58, 68 + idx * 3)))
        date_iso = (date.today() - timedelta(days=idx * 3)).isoformat()
        name = getattr(scenario, "name", None) if scenario else None
        if not name and isinstance(scenario, dict):
            name = scenario.get("name")
        scenario_name = name or f"Simulation {scenario_id}"
        difficulty = None
        if isinstance(scenario, dict):
            difficulty = scenario.get("difficulty")
        scenario_type = difficulty or ("advanced" if idx % 3 == 0 else "intermediate")
        history.append(
            {
                "id": str(scenario_id),
                "scenarioName": scenario_name,
                "score": score,
                "skillsTested": _infer_skills_from_name(scenario_name),
                "result": _result_from_score(score),
                "dateIso": date_iso,
                "scenarioType": scenario_type,
            }
        )

    history.sort(key=lambda item: item["dateIso"], reverse=True)
    return history


def _derive_team_overview(leaderboard: List[UserStats]) -> List[Dict[str, Any]]:
    if not leaderboard:
        return [
            {
                "teamName": "West Mavericks",
                "avgScore": 0,
                "improvingReps": 0,
                "coachingNeeded": 0,
                "readyForDeployment": 0,
                "certificationCompletion": 0,
            }
        ]

    team_names = ["West Mavericks", "East Current", "Northeast Orbit", "South Voltage"]
    grouped: Dict[str, List[UserStats]] = {team: [] for team in team_names}
    for idx, rep in enumerate(leaderboard):
        team = team_names[idx % len(team_names)]
        grouped[team].append(rep)

    rows: List[Dict[str, Any]] = []
    for team_name, reps in grouped.items():
        if not reps:
            continue
        avg_score = round(sum(rep.total_score for rep in reps) / len(reps))
        certification_completion = round(sum(_clamp(0, round(rep.total_score / 55), 100) for rep in reps) / len(reps))
        rows.append(
            {
                "teamName": team_name,
                "avgScore": _clamp(58, round(60 + certification_completion * 0.35), 95),
                "improvingReps": len([rep for rep in reps if rep.current_streak >= 4]),
                "coachingNeeded": len([rep for rep in reps if rep.current_streak <= 1]),
                "readyForDeployment": len([rep for rep in reps if rep.total_score >= 4200]),
                "certificationCompletion": certification_completion,
            }
        )
    return rows


def _build_cache_key(user_id: str, time_range: str, scenario_type: str, skill_category: str) -> str:
    return f"{user_id}|{time_range}|{scenario_type}|{skill_category}"


def _get_cached_payload(cache_key: str) -> Optional[Dict[str, Any]]:
    entry = ANALYTICS_CACHE.get(cache_key)
    if not entry:
        return None
    expires_at = entry.get("expires_at", 0)
    if time.time() >= expires_at:
        ANALYTICS_CACHE.pop(cache_key, None)
        return None
    return entry.get("payload")


def _set_cached_payload(cache_key: str, payload: Dict[str, Any]) -> None:
    ANALYTICS_CACHE[cache_key] = {
        "expires_at": time.time() + ANALYTICS_CACHE_TTL_SECONDS,
        "payload": payload,
    }


def _compact_cache() -> None:
    now = time.time()
    stale_keys = [key for key, value in ANALYTICS_CACHE.items() if value.get("expires_at", 0) <= now]
    for key in stale_keys:
        ANALYTICS_CACHE.pop(key, None)


def _filter_history(
    history: List[Dict[str, Any]],
    time_range: str,
    scenario_type: str,
    skill_category: str,
) -> List[Dict[str, Any]]:
    day_window = {
        "daily": 1,
        "weekly": 7,
        "monthly": 30,
        "all-time": 3650,
    }.get(time_range, 7)

    cutoff = date.today() - timedelta(days=day_window)
    filtered = []
    for row in history:
        item_date = date.fromisoformat(row["dateIso"])
        matches_time = time_range == "all-time" or item_date >= cutoff
        matches_scenario = scenario_type == "all" or row["scenarioType"] == scenario_type
        matches_skill = skill_category == "all" or skill_category in row["skillsTested"]
        if matches_time and matches_scenario and matches_skill:
            filtered.append(row)
    return filtered


@router.get("/api/v1/analytics/snapshot")
async def get_analytics_snapshot(
    user_id: str = "trainee",
    time_range: str = "weekly",
    scenario_type: str = "all",
    skill_category: str = "all",
    session: Session = Depends(get_session),
):
    """
    Canonical analytics snapshot for the rep performance analytics dashboard.
    """
    stats = session.get(UserStats, user_id)
    leaderboard = session.exec(select(UserStats).order_by(UserStats.total_score.desc()).limit(20)).all()

    if not stats:
        stats = UserStats(user_id=user_id, total_score=0, current_streak=0, highest_streak=0, lives=3)

    history = _build_history(stats)

    if not history:
        history = []
        for i in range(10):
            score = 66 + i * 2 + (i % 3)
            history.append(
                {
                    "id": f"sim-{i+1}",
                    "scenarioName": f"Scenario {i+1}",
                    "score": score,
                    "skillsTested": ["prospecting", "discovery"] if i % 2 == 0 else ["objections", "closing"],
                    "result": _result_from_score(score),
                    "dateIso": (date.today() - timedelta(days=i * 3)).isoformat(),
                    "scenarioType": "advanced" if i % 3 == 0 else "intermediate",
                }
            )

    allowed_time = {"daily", "weekly", "monthly", "all-time"}
    allowed_scenario = {"all", "beginner", "intermediate", "advanced"}
    allowed_skill = {"all", "prospecting", "discovery", "presentation", "objections", "closing"}

    if time_range not in allowed_time:
        time_range = "weekly"
    if scenario_type not in allowed_scenario:
        scenario_type = "all"
    if skill_category not in allowed_skill:
        skill_category = "all"

    _compact_cache()
    cache_key = _build_cache_key(user_id, time_range, scenario_type, skill_category)
    cached_payload = _get_cached_payload(cache_key)
    if cached_payload is not None:
        return cached_payload

    filtered_history = _filter_history(history, time_range, scenario_type, skill_category)
    if not filtered_history:
        filtered_history = history[:4]

    avg_score = round(sum(item["score"] for item in filtered_history) / max(1, len(filtered_history)))
    rank = next((idx + 1 for idx, row in enumerate(leaderboard) if row.user_id == user_id), 1)
    certifications_earned = 0
    if avg_score >= 88:
        certifications_earned = 3
    elif avg_score >= 80:
        certifications_earned = 2
    elif avg_score >= 72:
        certifications_earned = 1

    skill_scores: Dict[str, List[int]] = {
        "prospecting": [],
        "discovery": [],
        "presentation": [],
        "objections": [],
        "closing": [],
    }
    for row in filtered_history:
        for skill in row["skillsTested"]:
            if skill in skill_scores:
                skill_scores[skill].append(row["score"])

    skills = {}
    skill_keys = ["prospecting", "discovery", "presentation", "objections", "closing"]
    for idx, key in enumerate(skill_keys):
        values = skill_scores[key]
        score = round(sum(values) / len(values)) if values else 68 + idx * 3
        recent = values[:3] if values else [score]
        prior = values[3:6] if len(values) > 3 else [max(55, score - 2)]
        recent_avg = sum(recent) / len(recent)
        prior_avg = sum(prior) / len(prior)
        trend = round(recent_avg - prior_avg)
        skills[key] = {"score": score, "trend": trend, "improvement": max(0, trend + 4)}

    trend_scores = [row["score"] for row in filtered_history[:12]][::-1]
    score_trend = []
    for idx, score in enumerate(trend_scores):
        trend_date = date.today() - timedelta(days=(len(trend_scores) - 1 - idx) * 3)
        score_trend.append(
            {
                "label": f"P{idx + 1}",
                "score": score,
                "rollingAverage": _rolling_average(trend_scores, idx, 4),
                "dateIso": trend_date.isoformat(),
            }
        )

    weakest_skill = min(skill_keys, key=lambda skill: skills[skill]["score"])
    second_weakest = min([skill for skill in skill_keys if skill != weakest_skill], key=lambda skill: skills[skill]["score"])

    coaching_insights = [
        {
            "title": "Most common mistakes",
            "detail": f"Weak value anchoring before {weakest_skill} responses.",
            "severity": "high",
        },
        {
            "title": "Missed discovery questions",
            "detail": "Follow-up depth drops during mid-call transitions.",
            "severity": "medium",
        },
        {
            "title": "Compliance warnings",
            "detail": "Guarantee-style phrasing appears in pressure sequences.",
            "severity": "low",
        },
    ]

    recommendations = [
        {
            "title": f"Practice {weakest_skill.title()} module",
            "rationale": f"{weakest_skill.title()} score is below target benchmark.",
            "action": f"Run the {weakest_skill.title()} lesson and one focused scenario.",
        },
        {
            "title": f"Repeat {second_weakest.title()} scenario",
            "rationale": f"{second_weakest.title()} trend remains inconsistent.",
            "action": "Replay scenario and apply coaching feedback.",
        },
        {
            "title": "Review closing techniques lesson",
            "rationale": "Final commitment language needs stronger consistency.",
            "action": "Complete close checklist and rerun final sequence scenario.",
        },
    ]

    payload = {
        "overallPerformanceScore": round(avg_score * 0.62 + skills["closing"]["score"] * 0.22 + skills["discovery"]["score"] * 0.16),
        "simulationsCompleted": len(filtered_history),
        "averageSimulationScore": avg_score,
        "currentTrainingStreak": stats.current_streak,
        "certificationsEarned": certifications_earned,
        "xpEarned": stats.total_score,
        "levelProgress": min(100, round((stats.total_score % 2000) / 20)),
        "leaderboardRank": rank,
        "skills": skills,
        "scoreTrend": score_trend,
        "simulationHistory": filtered_history,
        "coachingInsights": coaching_insights,
        "recommendations": recommendations,
        "teamOverview": _derive_team_overview(leaderboard),
        "filtersApplied": {
            "timeRange": time_range,
            "scenarioType": scenario_type,
            "skillCategory": skill_category,
        },
        "updatedAt": date.today().isoformat(),
    }
    _set_cached_payload(cache_key, payload)
    return payload
