"""
Rep Performance Analytics Snapshot Router
Returns a canonical analytics payload for frontend dashboard rendering.
"""
from datetime import date, datetime, timedelta
import json
from typing import Any, Dict, List, Optional
import time
import os

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from data import SCENARIOS
from database import get_session
from models import UserStats
from models.kpi import KPIDefinition, KPIEntry
from routers.kpis import get_analytics

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


def _calculate_kpi_streak(session: Session, user_id: str) -> int:
    """
    Calculate real consecutive-day activity streak by grouping KPIEntry.date values
    and tracking adjacent calendar days.
    """
    statement = select(KPIEntry.date).where(KPIEntry.user_id == user_id).distinct()
    dates = sorted(session.exec(statement).all(), reverse=True)
    if not dates:
        return 0
        
    today = date.today()
    yesterday = today - timedelta(days=1)
    
    # Check if user was active today or yesterday to continue/start the streak
    if dates[0] not in (today, yesterday):
        return 0
        
    streak = 1
    for i in range(len(dates) - 1):
        diff = dates[i] - dates[i + 1]
        if diff == timedelta(days=1):
            streak += 1
        elif diff > timedelta(days=1):
            break # streak broken
    return streak


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
    is_demo = os.getenv("DEMO_MODE", "false").lower() in ("true", "1") or user_id in ("trainee", "test_user", "admin")

    # If it is empty simulation history but we are in demo mode, inject realistic simulator history
    if not history and is_demo:
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
    if not filtered_history and history:
        filtered_history = history[:4]

    # 1. Simulator Performance Calculations
    total_sims = len(filtered_history)
    avg_score = round(sum(item["score"] for item in filtered_history) / max(1, total_sims)) if total_sims > 0 else 0
    
    # 2. Sim Win Rate: Percentage of simulation attempts with score >= 85
    if total_sims > 0:
        passing_sims = len([item for item in filtered_history if item["score"] >= 85])
        sim_win_rate = round((passing_sims / total_sims) * 100)
    else:
        sim_win_rate = 0

    # 3. KPI / Goal Setting Calculations
    period_map = {
        "daily": "week",
        "weekly": "week",
        "monthly": "month",
        "all-time": "quarter"
    }
    kpi_period = period_map.get(time_range, "week")
    
    try:
        kpi_analytics = await get_analytics(period=kpi_period, session=session, user_id=user_id)
        kpi_list = kpi_analytics.kpis
        kpi_conversions = kpi_analytics.conversion_rates or {
            "signal_to_lock": 0.0,
            "lock_to_acquisition": 0.0,
            "signal_to_acquisition": 0.0
        }
    except Exception as e:
        print(f"Error calling get_analytics for snap: {e}")
        kpi_list = []
        kpi_conversions = {
            "signal_to_lock": 0.0,
            "lock_to_acquisition": 0.0,
            "signal_to_acquisition": 0.0
        }

    # Inject mock KPI data if empty and is_demo is active
    if not kpi_list and is_demo:
        kpi_list = [
            {
                "label": "Knocks",
                "total": 45,
                "average": 9.0,
                "target": 50,
                "daily_target": 10,
                "target_weekly": 50,
                "target_monthly": 200,
                "target_quarterly": 600,
                "achievement": 90.0,
                "trend": "up",
                "daily_values": [8, 10, 7, 9, 11]
            },
            {
                "label": "Conversations",
                "total": 12,
                "average": 2.4,
                "target": 15,
                "daily_target": 3,
                "target_weekly": 15,
                "target_monthly": 60,
                "target_quarterly": 180,
                "achievement": 80.0,
                "trend": "down",
                "daily_values": [3, 2, 2, 3, 2]
            },
            {
                "label": "Appointments Set",
                "total": 4,
                "average": 0.8,
                "target": 5,
                "daily_target": 1,
                "target_weekly": 5,
                "target_monthly": 20,
                "target_quarterly": 60,
                "achievement": 80.0,
                "trend": "stable",
                "daily_values": [1, 1, 0, 1, 1]
            },
            {
                "label": "Closes",
                "total": 1,
                "average": 0.2,
                "target": 2,
                "daily_target": 0,
                "target_weekly": 2,
                "target_monthly": 8,
                "target_quarterly": 24,
                "achievement": 50.0,
                "trend": "stable",
                "daily_values": [0, 0, 1, 0, 0]
            }
        ]
        kpi_conversions = {
            "signal_to_lock": 8.9,
            "lock_to_acquisition": 25.0,
            "signal_to_acquisition": 2.2
        }

    # Calculate fieldGoalAchievement
    if kpi_list:
        achievements = [kpi.get("achievement", 0) for kpi in kpi_list]
        field_goal_achievement = round(sum(achievements) / len(achievements), 1)
    else:
        field_goal_achievement = 0.0

    # 4. Blended Performance Score Calculation (Weighted blend of simulator and KPI achievement)
    sims_active = total_sims > 0
    kpis_active = len(kpi_list) > 0
    
    if sims_active and kpis_active:
        overall_score = round(avg_score * 0.5 + field_goal_achievement * 0.5)
    elif sims_active:
        overall_score = round(avg_score)
    elif kpis_active:
        overall_score = round(field_goal_achievement)
    else:
        overall_score = 69 if is_demo else 0

    # 5. Streak logic (Field streak falls back to simulator streak)
    kpi_streak = _calculate_kpi_streak(session, user_id)
    current_streak = kpi_streak if kpi_streak > 0 else stats.current_streak

    rank = next((idx + 1 for idx, row in enumerate(leaderboard) if row.user_id == user_id), 1)
    certifications_earned = 0
    if overall_score >= 88:
        certifications_earned = 3
    elif overall_score >= 80:
        certifications_earned = 2
    elif overall_score >= 72:
        certifications_earned = 1

    # 6. Skill scores mapping
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
        score = round(sum(values) / len(values)) if values else (68 + idx * 3 if is_demo else 0)
        recent = values[:3] if values else [score]
        prior = values[3:6] if len(values) > 3 else [max(0, score - 2)]
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

    # 7. TAILORED DYNAMIC COACHING INSIGHTS (Bottleneck Logic)
    total_knocks = 0
    total_conversations = 0
    total_appointments = 0
    total_closes = 0
    knocks_weekly_target = 0

    for kpi in kpi_list:
        label = kpi["label"].lower()
        total_val = kpi["total"]
        
        if "knock" in label or "lead" in label or "signal" in label:
            total_knocks += total_val
            if kpi.get("target_weekly"):
                knocks_weekly_target += kpi["target_weekly"]
            elif kpi.get("daily_target"):
                knocks_weekly_target += kpi["daily_target"] * 5
                
        if "conversation" in label or "talk" in label or "contact" in label:
            total_conversations += total_val
            
        if "appointment" in label or "set" in label or "lock" in label or "sit" in label:
            total_appointments += total_val
            
        if "close" in label or "sale" in label or "acquisition" in label or "install" in label:
            total_closes += total_val

    coaching_insights = []
    
    # Stale field check
    recent_entry = session.exec(
        select(KPIEntry).where(KPIEntry.user_id == user_id).order_by(KPIEntry.date.desc())
    ).first()
    
    if recent_entry:
        days_since_last = (date.today() - recent_entry.date).days
        if days_since_last >= 3:
            coaching_insights.append({
                "title": "Stale Activity Warning",
                "detail": f"No field entries logged in the last {days_since_last} days. Maintain consistent entry discipline.",
                "severity": "high"
            })
    else:
        # User has no entries whatsoever
        if not kpis_active:
            if not is_demo:
                coaching_insights.append({
                    "title": "Setup Sales Goals",
                    "detail": "Set up your target definitions in the Goal Setting Wizard to start mapping your path.",
                    "severity": "medium"
                })
        else:
            if not is_demo:
                coaching_insights.append({
                    "title": "Log Your First Day",
                    "detail": "Keep momentum high. Enter today's knobs, appointments, and closes in the tracker.",
                    "severity": "medium"
                })

    # Volume bottleneck check
    if knocks_weekly_target > 0 and total_knocks < knocks_weekly_target:
        coaching_insights.append({
            "title": "Low Volume Bottleneck",
            "detail": f"Activity shortfall: total Knocks ({total_knocks}) are currently below weekly goal of {knocks_weekly_target}.",
            "severity": "high"
        })

    # Knock-to-Conversation bottleneck check
    if total_knocks > 0:
        ratio = total_conversations / total_knocks
        if ratio < 0.15:
            coaching_insights.append({
                "title": "Knock-to-Conversation Bottleneck",
                "detail": f"Prospecting opener warning: set-to-conversation conversion is {ratio * 100:.1f}% (benchmark >= 15%).",
                "severity": "high"
            })

    # Conversation-to-Appointment bottleneck check
    if total_conversations > 0:
        ratio = total_appointments / total_conversations
        if ratio < 0.20:
            coaching_insights.append({
                "title": "Conversation-to-Appointment Bottleneck",
                "detail": f"Value building warning: conversation-to-appointment set is {ratio * 100:.1f}% (benchmark >= 20%).",
                "severity": "high"
            })

    # Appointment-to-Close bottleneck check
    if total_appointments > 0:
        ratio = total_closes / total_appointments
        if ratio < 0.25:
            coaching_insights.append({
                "title": "Appointment-to-Close Bottleneck",
                "detail": f"Closing ratio warning: appointment-to-close conversion is {ratio * 100:.1f}% (benchmark >= 25%).",
                "severity": "high"
            })

    # No bottlenecks detected fallback
    if not coaching_insights:
        coaching_insights.append({
            "title": "No coaching flags yet",
            "detail": "Excellent field execution! Funnel conversion ratios and activity volume look healthy.",
            "severity": "low"
        })

    # 8. RECOMMENDATIONS
    recommendations = []
    
    if recent_entry and (date.today() - recent_entry.date).days >= 3:
        recommendations.append({
            "title": "Log Daily Field Activity",
            "rationale": "Consistent recording enables highly tailored pipeline diagnostic coaching.",
            "action": "Open the KPI Entry panel and log your activity for today."
        })
        
    if not kpis_active and not is_demo:
        recommendations.append({
            "title": "Set Custom Sales Goals",
            "rationale": "Goal setting unlocks targeted analytics dashboards and active feedback structures.",
            "action": "Complete the Goal Setting Wizard to initialize your personal milestones."
        })
        
    if knocks_weekly_target > 0 and total_knocks < knocks_weekly_target:
        recommendations.append({
            "title": "Increase Prospecting Volume",
            "rationale": "Opening volume is insufficient to reliably meet your weekly contract targets.",
            "action": "Allocate an additional 90 minutes to field door-knocking tomorrow."
        })
        
    if total_knocks > 0 and (total_conversations / total_knocks) < 0.15:
        recommendations.append({
            "title": "Practice Pitch Opener Drills",
            "rationale": " Opener transition is dropping too early, indicating rapport barriers.",
            "action": "Run the Door Opener simulation to master rapid trust-building."
        })
        
    if total_conversations > 0 and (total_appointments / total_conversations) < 0.20:
        recommendations.append({
            "title": "Sharpen Value Presentation",
            "rationale": "Rapport is built but fails to convert to appointments, implying weak value anchor.",
            "action": "Study presentation curriculum deck and rerun Discovery simulation."
        })
        
    if total_appointments > 0 and (total_closes / total_appointments) < 0.25:
        recommendations.append({
            "title": "Master Closing Objections",
            "rationale": "High drop-off rate on sits indicates difficulty handling closing price pressure.",
            "action": "Complete Objection Stack lesson and practice price-matching sims."
        })

    # Always ensure 3 high-value recommendations
    default_recs = [
        {
            "title": "Complete Today's AI Challenge",
            "rationale": "Maintain your daily streak momentum and claim daily XP boosts.",
            "action": "Run today's curriculum challenge in the simulator queue."
        },
        {
            "title": "Review Spanish Pitch Assets",
            "rationale": "Bilingual reps reach broader client demographics and close 34% more contracts.",
            "action": "Open Spanish Slides inside active module presentations."
        },
        {
            "title": "Practice Price Pressure Scenario",
            "rationale": "Reps anchoring with strong price objections see immediate conversion uplift.",
            "action": "Load high-severity objection simulation modules."
        }
    ]

    for rec in default_recs:
        if len(recommendations) >= 3:
            break
        recommendations.append(rec)

    payload = {
        "overallPerformanceScore": overall_score,
        "simulationsCompleted": total_sims,
        "averageSimulationScore": avg_score,
        "currentTrainingStreak": current_streak,
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
        # New telemetry metrics
        "fieldGoalAchievement": field_goal_achievement,
        "simWinRate": sim_win_rate,
        "kpis": kpi_list,
        "conversionRates": kpi_conversions,
        "kpiStreak": kpi_streak
    }
    _set_cached_payload(cache_key, payload)
    return payload

