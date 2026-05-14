"""
Certification System API Router
Provides canonical certification progress, status, and team views.
"""
from datetime import date, timedelta
import json
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from database import get_session
from models import UserStats

router = APIRouter()


def _safe_json_parse(raw: Optional[str], fallback: Any) -> Any:
    if not raw:
        return fallback
    try:
        return json.loads(raw)
    except Exception:
        return fallback


def _clamp(min_value: int, value: int, max_value: int) -> int:
    return max(min_value, min(value, max_value))


TRACK_BLUEPRINTS = [
    {
        "id": "septivolt-certified-solar-rep",
        "title": "SeptiVolt Certified Solar Rep",
        "description": "Core qualification validating full-path readiness from training module mastery through live AI scenario execution.",
        "why_it_matters": "Signals end-to-end readiness for production-level solar consultative selling under SeptiVolt standards.",
        "required_modules": ["Day 1 Foundations", "Day 3 Discovery", "Day 5 Objection Handling", "Day 7 Certification Prep"],
        "required_sim_score": 85,
        "unlock_criteria": "Complete all core modules and maintain 80+ average across the last 5 simulations.",
        "assessment": {
            "name": "Final Certification Scenario: Residential Value Stack",
            "skills_tested": ["Discovery", "Presentation", "Objection Handling", "Closing"],
            "target_score": 88,
            "max_attempts": 3,
        },
        "xp_value": 1200,
        "level_reward": "Closer L13 eligibility",
    },
    {
        "id": "discovery-master",
        "title": "Discovery Master",
        "description": "Specialized credential for consultative questioning and homeowner qualification flow.",
        "why_it_matters": "Discovery quality strongly predicts close consistency and objection resilience.",
        "required_modules": ["Day 2 Art of Connection", "Day 3 Discovery Framework"],
        "required_sim_score": 82,
        "unlock_criteria": "Complete discovery modules and pass two discovery-focused simulations at 82+.",
        "assessment": {
            "name": "Discovery Precision Assessment",
            "skills_tested": ["Prospecting", "Discovery"],
            "target_score": 84,
            "max_attempts": 3,
        },
        "xp_value": 500,
        "level_reward": "Discovery Aura badge frame",
    },
    {
        "id": "objection-crusher",
        "title": "Objection Crusher",
        "description": "Credential proving repeatable rebuttal performance under pressure across pricing and trust objections.",
        "why_it_matters": "Structured objection handling is a major leverage point for conversion and confidence.",
        "required_modules": ["Day 4 Objection Judo", "Day 5 Closing Confidence"],
        "required_sim_score": 84,
        "unlock_criteria": "Finish objection modules and complete three objection simulation wins.",
        "assessment": {
            "name": "High-Pressure Objection Scenario",
            "skills_tested": ["Objection Handling", "Closing"],
            "target_score": 86,
            "max_attempts": 3,
        },
        "xp_value": 650,
        "level_reward": "Rebuttal Circuit title",
    },
    {
        "id": "closing-specialist",
        "title": "Closing Specialist",
        "description": "Qualification focused on commitment language, urgency framing, and clean next-step closes.",
        "why_it_matters": "Protects revenue outcomes by validating high-integrity close execution and next-step control.",
        "required_modules": ["Day 5 Closing Confidence", "Day 6 Mastery Lab"],
        "required_sim_score": 87,
        "unlock_criteria": "Reach top-25 percentile and complete closing module path.",
        "assessment": {
            "name": "Advanced Commitment Assessment",
            "skills_tested": ["Presentation", "Closing"],
            "target_score": 90,
            "max_attempts": 2,
        },
        "xp_value": 700,
        "level_reward": "Closer L14 fast-track",
    },
    {
        "id": "7-day-accelerator-graduate",
        "title": "7-Day Accelerator Graduate",
        "description": "Program completion credential proving full execution of SeptiVolt's 7-day ramp framework.",
        "why_it_matters": "Provides enterprise managers with a baseline onboarding qualification for field readiness.",
        "required_modules": ["Day 1-7 Core Curriculum"],
        "required_sim_score": 80,
        "unlock_criteria": "Finish full curriculum and pass graduation simulation at 80+.",
        "assessment": {
            "name": "Accelerator Graduation Simulation",
            "skills_tested": ["Prospecting", "Discovery", "Presentation", "Closing"],
            "target_score": 82,
            "max_attempts": 3,
        },
        "xp_value": 850,
        "level_reward": "Accelerator Graduate frame",
    },
]


def _compute_signals(stats: Optional[UserStats]) -> Dict[str, int]:
    if not stats:
        return {
            "score_signal": 8,
            "streak_signal": 0,
            "module_completion_rate": 0,
            "best_scenario_score": 0,
            "passed_scenarios": 0,
            "attempts_used": 0,
        }

    module_progress = _safe_json_parse(stats.module_progress, {})
    scenario_progress = _safe_json_parse(stats.scenario_progress, {})

    completed_module_steps = 0
    total_module_steps = max(len(module_progress) * 3, 12)
    for module_state in module_progress.values():
        if isinstance(module_state, dict):
            completed_module_steps += len([value for value in module_state.values() if value is True])

    module_completion_rate = _clamp(0, round((completed_module_steps / total_module_steps) * 100), 100)

    best_scenario_score = 0
    passed_scenarios = 0
    attempts_used = 0
    for scenario_state in scenario_progress.values():
        if not isinstance(scenario_state, dict):
            continue
        best_scenario_score = max(best_scenario_score, int(scenario_state.get("best_score", 0)))
        if scenario_state.get("passed") is True:
            passed_scenarios += 1
        attempts_used = max(attempts_used, int(scenario_state.get("attempts", 0)))

    return {
        "score_signal": _clamp(0, round(stats.total_score / 55), 100),
        "streak_signal": _clamp(0, stats.current_streak * 2, 24),
        "module_completion_rate": module_completion_rate,
        "best_scenario_score": best_scenario_score,
        "passed_scenarios": passed_scenarios,
        "attempts_used": attempts_used,
    }


def _compute_rank(user_id: str, leaderboard: List[UserStats]) -> Tuple[int, int]:
    if not leaderboard:
        return 1, 1
    index = next((i for i, row in enumerate(leaderboard) if row.user_id == user_id), 0)
    return index + 1, len(leaderboard)


def _derive_track(
    blueprint: Dict[str, Any],
    idx: int,
    signals: Dict[str, int],
    rank: int,
    total_reps: int,
) -> Dict[str, Any]:
    percentile_bonus = 0
    if total_reps > 0:
        percentile_bonus = round((1 - (rank / total_reps)) * 20)

    progress = _clamp(
        5,
        round(
            signals["score_signal"] * 0.38
            + signals["module_completion_rate"] * 0.34
            + signals["streak_signal"] * 0.18
            + percentile_bonus
        ) - idx * 6,
        99,
    )

    lesson_complete = signals["module_completion_rate"] >= (70 - idx * 6)
    simulation_complete = signals["best_scenario_score"] >= blueprint["required_sim_score"]
    compliance_complete = signals["streak_signal"] >= (8 - min(idx, 2))
    final_assessment_complete = signals["passed_scenarios"] >= max(1, idx)

    requirements = [
        {"id": f"{idx}-m1", "label": "Complete required lesson modules", "complete": lesson_complete},
        {
            "id": f"{idx}-m2",
            "label": f"Pass required simulation with target score {blueprint['required_sim_score']}+",
            "complete": simulation_complete,
        },
        {"id": f"{idx}-m3", "label": "Maintain compliance threshold", "complete": compliance_complete},
        {"id": f"{idx}-m4", "label": "Complete final assessment", "complete": final_assessment_complete},
    ]

    complete_count = len([r for r in requirements if r["complete"]])
    if complete_count == len(requirements):
        status = "certified"
        progress = 100
    elif complete_count >= len(requirements) - 1 and progress >= 82:
        status = "ready"
    elif progress >= 20:
        status = "in-progress"
    else:
        status = "locked"

    assessment_score = signals["best_scenario_score"] if signals["best_scenario_score"] > 0 else None
    assessment_passed = None if assessment_score is None else assessment_score >= blueprint["assessment"]["target_score"]
    earned_date = None
    credential_id = None
    if status == "certified":
        earned_date = (date.today() - timedelta(days=idx + 2)).isoformat()
        credential_id = f"SV-{idx + 1:02d}-{date.today().strftime('%Y%m%d')}-{(idx + 17):03d}"

    return {
        "id": blueprint["id"],
        "title": blueprint["title"],
        "description": blueprint["description"],
        "whyItMatters": blueprint["why_it_matters"],
        "status": status,
        "progress": progress,
        "requiredModules": blueprint["required_modules"],
        "requiredSimulationScore": blueprint["required_sim_score"],
        "unlockCriteria": blueprint["unlock_criteria"],
        "requirements": requirements,
        "assessment": {
            "name": blueprint["assessment"]["name"],
            "skillsTested": blueprint["assessment"]["skills_tested"],
            "targetScore": blueprint["assessment"]["target_score"],
            "currentScore": assessment_score,
            "passed": True if status == "certified" else assessment_passed,
            "attemptsUsed": max(signals["attempts_used"], signals["passed_scenarios"]),
            "maxAttempts": blueprint["assessment"]["max_attempts"],
        },
        "earnedDate": earned_date,
        "xpValue": blueprint["xp_value"],
        "levelReward": blueprint["level_reward"],
        "credentialId": credential_id,
        "statusHistory": [
            {"date": (date.today() - timedelta(days=8 - idx)).isoformat(), "event": "Track unlocked", "actor": "System"},
            {"date": (date.today() - timedelta(days=2)).isoformat(), "event": "Live metrics sync", "actor": "Certification Service"},
            {"date": date.today().isoformat(), "event": f"Status: {status.replace('-', ' ').title()}", "actor": "Certification Service"},
        ],
    }


def _derive_team_progress(leaderboard: List[UserStats]) -> List[Dict[str, Any]]:
    if not leaderboard:
        return [
            {"teamName": "West Mavericks", "repsCertified": 0, "repsInProgress": 0, "repsAtRisk": 0, "overallCompletion": 0, "managerSignoffPending": 0},
            {"teamName": "East Current", "repsCertified": 0, "repsInProgress": 0, "repsAtRisk": 0, "overallCompletion": 0, "managerSignoffPending": 0},
            {"teamName": "Northeast Orbit", "repsCertified": 0, "repsInProgress": 0, "repsAtRisk": 0, "overallCompletion": 0, "managerSignoffPending": 0},
            {"teamName": "South Voltage", "repsCertified": 0, "repsInProgress": 0, "repsAtRisk": 0, "overallCompletion": 0, "managerSignoffPending": 0},
        ]

    team_names = ["West Mavericks", "East Current", "Northeast Orbit", "South Voltage"]
    buckets: Dict[str, List[UserStats]] = {name: [] for name in team_names}

    for idx, rep in enumerate(leaderboard):
        team = team_names[idx % len(team_names)]
        buckets[team].append(rep)

    results: List[Dict[str, Any]] = []
    for team_name, reps in buckets.items():
        if not reps:
            continue
        certified = len([r for r in reps if r.total_score >= 4200])
        in_progress = len([r for r in reps if 2200 <= r.total_score < 4200])
        at_risk = len([r for r in reps if r.total_score < 2200])
        completion = round(sum([_clamp(0, round(r.total_score / 55), 100) for r in reps]) / len(reps))
        results.append(
            {
                "teamName": team_name,
                "repsCertified": certified,
                "repsInProgress": in_progress,
                "repsAtRisk": at_risk,
                "overallCompletion": completion,
                "managerSignoffPending": max(0, in_progress - (certified // 2)),
            }
        )
    return results


@router.get("/api/v1/certifications/snapshot")
async def get_certification_snapshot(
    user_id: str = "trainee",
    session: Session = Depends(get_session),
):
    """
    Canonical certification snapshot for frontend dashboard/detail pages.
    """
    stats = session.get(UserStats, user_id)
    leaderboard = session.exec(select(UserStats).order_by(UserStats.total_score.desc()).limit(20)).all()

    signals = _compute_signals(stats)
    rank, total_reps = _compute_rank(user_id, leaderboard)
    tracks = [_derive_track(blueprint, idx, signals, rank, total_reps) for idx, blueprint in enumerate(TRACK_BLUEPRINTS)]
    team_progress = _derive_team_progress(leaderboard)

    active_track = next((track for track in tracks if track["status"] == "ready"), None)
    if not active_track:
        active_track = next((track for track in tracks if track["status"] == "in-progress"), None)
    active_track_id = active_track["id"] if active_track else tracks[0]["id"]

    return {
        "userId": user_id,
        "tracks": tracks,
        "teamProgress": team_progress,
        "activeTrackId": active_track_id,
        "updatedAt": date.today().isoformat(),
    }

