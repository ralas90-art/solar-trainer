"""
SeptiVolt Training Intelligence — Prediction Rules Engine v1

Pure stateless module. Accepts a RepSnapshotContext dataclass and returns
a list of PredictionResult objects. No database access.

Design principles:
  - Deterministic thresholds. No ML in V1.
  - High confidence when multiple independent signals agree.
  - Bilingual: every output carries _en and _es variants.
  - No side effects. Callers own DB writes and GHL sync.
"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional


# ─── Input Context ────────────────────────────────────────────────────────────

@dataclass
class RepSnapshotContext:
    """
    Pre-assembled snapshot of all training signals for one rep.
    Assembled by training_intelligence_service before calling the engine.
    """
    user_id: str
    company_id: str
    branch_id: Optional[str] = None
    team_id: Optional[str] = None

    # From UserCurriculumProgress (most recent relevant curriculum)
    progress_percentage: float = 0.0   # 0–100
    quiz_average: float = 0.0          # 0–100
    sim_average: float = 0.0           # 0–100
    curriculum_status: str = "not_started"  # not_started | in_progress | completed

    # From SimulationSession history
    recent_sim_scores: List[int] = field(default_factory=list)  # chronological, last 5
    last_activity_date: Optional[datetime] = None
    days_inactive: int = 0
    sim_score_trend: float = 0.0       # slope of recent sim scores (+pos = improving)
    failed_consecutive: int = 0        # consecutive failed simulation sessions

    # From UserStats
    total_score: int = 0
    current_streak: int = 0
    passed_scenarios: int = 0

    # From CoachingFlag
    active_flag_count: int = 0
    high_severity_flag_count: int = 0
    repeated_flag_types: List[str] = field(default_factory=list)  # types that appeared 2+

    # From UserCertification
    has_active_certification: bool = False

    # Company thresholds (from get_company_thresholds())
    thresholds: dict = field(default_factory=lambda: {
        "inactive_days": 7,
        "at_risk_quiz_threshold": 75,
        "at_risk_sim_threshold": 75,
        "certification_eligible_threshold": 82,
    })

    # Company-wide context (for top performer relative scoring)
    company_rep_count: int = 1
    company_rep_rank: int = 1          # lower = better (1st = top)


# ─── Output ───────────────────────────────────────────────────────────────────

@dataclass
class PredictionResult:
    """Output from the rules engine for one prediction signal."""
    prediction_type: str    # one of PRED_* constants
    score: float            # 0.0–100.0
    severity: str           # "high" | "medium" | "low"
    confidence: float       # 0.0–1.0
    explanation_en: str
    explanation_es: str
    recommended_action_en: str
    recommended_action_es: str
    ghl_tags: List[str]     # e.g. ["prediction:churn_risk"]
    ghl_custom_fields: dict # e.g. {"septivolt_prediction_score": "82.0"}


# ─── Helper ───────────────────────────────────────────────────────────────────

def _slope(scores: List[int]) -> float:
    """Simple linear slope of a list of scores. Positive = improving."""
    n = len(scores)
    if n < 2:
        return 0.0
    x_mean = (n - 1) / 2
    y_mean = sum(scores) / n
    num = sum((i - x_mean) * (scores[i] - y_mean) for i in range(n))
    den = sum((i - x_mean) ** 2 for i in range(n))
    return round(num / den, 2) if den != 0 else 0.0


def _build_ghl_fields(pred_type: str, score: float, severity: str, action_en: str) -> dict:
    return {
        "septivolt_prediction_score": str(round(score, 1)),
        "septivolt_prediction_severity": severity,
        "septivolt_recommended_action": action_en[:200],  # GHL field length cap
    }


# ─── Individual Prediction Rules ─────────────────────────────────────────────

def _cert_failure_risk(ctx: RepSnapshotContext) -> Optional[PredictionResult]:
    """
    Certification Failure Risk:
      HIGH   — progress < 60% AND (quiz OR sim) < 75 AND failed_consecutive >= 2
      MEDIUM — progress < 60% AND (quiz OR sim) < 75
      (no low-tier for this type — only fire when it matters)
    """
    quiz_thresh = ctx.thresholds["at_risk_quiz_threshold"]
    sim_thresh = ctx.thresholds["at_risk_sim_threshold"]

    low_progress = ctx.progress_percentage < 60
    low_quiz = ctx.quiz_average > 0 and ctx.quiz_average < quiz_thresh
    low_sim = ctx.sim_average > 0 and ctx.sim_average < sim_thresh
    struggling = low_quiz or low_sim

    if not (low_progress and struggling):
        return None

    if ctx.failed_consecutive >= 2:
        severity = "high"
        score = 85.0 + min(ctx.failed_consecutive * 2.5, 15.0)
        confidence = 0.88
        signal_count = sum([low_progress, low_quiz, low_sim, ctx.failed_consecutive >= 2])
        if signal_count >= 3:
            confidence = 0.93
        action_en = "Schedule manager roleplay session. Assign Objection Crusher curriculum. Send daily simulator practice reminder."
        action_es = "Programa sesión de roleplay con el gerente. Asigna el currículo 'Objection Crusher'. Envía recordatorio diario de práctica en simulador."
        expl_en = (
            f"Rep has {round(ctx.progress_percentage)}% training progress, "
            f"quiz avg {round(ctx.quiz_average)}%, sim avg {round(ctx.sim_average)}%, "
            f"and {ctx.failed_consecutive} consecutive failed simulations. High certification failure risk."
        )
        expl_es = (
            f"El representante tiene {round(ctx.progress_percentage)}% de progreso, "
            f"promedio de quiz {round(ctx.quiz_average)}%, promedio de simulación {round(ctx.sim_average)}%, "
            f"y {ctx.failed_consecutive} simulaciones fallidas consecutivas. Alto riesgo de no certificar."
        )
    else:
        severity = "medium"
        score = 60.0 + (quiz_thresh - ctx.quiz_average if low_quiz else 0) + (sim_thresh - ctx.sim_average if low_sim else 0)
        score = min(score, 84.9)
        confidence = 0.68
        action_en = "Review quiz performance with rep. Assign targeted practice scenarios. Monitor weekly progress."
        action_es = "Revisa el rendimiento del quiz con el representante. Asigna escenarios de práctica específicos. Monitorea el progreso semanalmente."
        expl_en = (
            f"Rep's training is {round(ctx.progress_percentage)}% complete with quiz avg {round(ctx.quiz_average)}% "
            f"and sim avg {round(ctx.sim_average)}% — below certification thresholds."
        )
        expl_es = (
            f"El entrenamiento del representante está {round(ctx.progress_percentage)}% completo con promedio de quiz "
            f"{round(ctx.quiz_average)}% y promedio de simulación {round(ctx.sim_average)}% — por debajo del umbral de certificación."
        )

    return PredictionResult(
        prediction_type="certification_failure_risk",
        score=round(score, 1),
        severity=severity,
        confidence=confidence,
        explanation_en=expl_en,
        explanation_es=expl_es,
        recommended_action_en=action_en,
        recommended_action_es=action_es,
        ghl_tags=["prediction:certification_failure_risk"] + (["alert:high_priority"] if severity == "high" else []),
        ghl_custom_fields=_build_ghl_fields("certification_failure_risk", score, severity, action_en),
    )


def _churn_risk(ctx: RepSnapshotContext) -> Optional[PredictionResult]:
    """
    Churn Risk:
      HIGH   — inactive >= 14 days AND progress < 40%
      MEDIUM — inactive >= 7 days AND (quiz < 60 OR sim < 60)
    """
    inactive_thresh = ctx.thresholds["inactive_days"]
    very_inactive = ctx.days_inactive >= (inactive_thresh * 2)
    inactive = ctx.days_inactive >= inactive_thresh
    low_progress = ctx.progress_percentage < 40
    very_low_scores = (ctx.quiz_average > 0 and ctx.quiz_average < 60) or (ctx.sim_average > 0 and ctx.sim_average < 60)
    no_recent_activity = ctx.days_inactive >= inactive_thresh

    if very_inactive and low_progress:
        severity = "high"
        score = 90.0 + min(ctx.days_inactive * 0.5, 10.0)
        confidence = 0.92
        action_en = "Send immediate login nudge email. Assign manager 1:1 check-in. Notify trainer. Flag for follow-up in 48 hours."
        action_es = "Envía correo de reactivación inmediata. Programa reunión 1:1 con el gerente. Notifica al entrenador. Marca para seguimiento en 48 horas."
        expl_en = (
            f"Rep has been inactive for {ctx.days_inactive} days with only {round(ctx.progress_percentage)}% "
            f"training progress. High risk of full disengagement."
        )
        expl_es = (
            f"El representante lleva {ctx.days_inactive} días inactivo con solo {round(ctx.progress_percentage)}% "
            f"de progreso de entrenamiento. Alto riesgo de abandono total."
        )
    elif inactive and very_low_scores:
        severity = "medium"
        score = 65.0 + max(inactive_thresh - ctx.days_inactive, 0) * 2
        score = min(score, 89.9)
        confidence = 0.72
        action_en = "Send login nudge. Review last session debrief with rep. Assign an easy win scenario to rebuild momentum."
        action_es = "Envía recordatorio de inicio de sesión. Revisa el debrief de la última sesión con el representante. Asigna un escenario fácil para recuperar impulso."
        expl_en = (
            f"Rep has been inactive for {ctx.days_inactive} days with quiz avg {round(ctx.quiz_average)}% "
            f"and sim avg {round(ctx.sim_average)}%. Showing disengagement signals."
        )
        expl_es = (
            f"El representante lleva {ctx.days_inactive} días inactivo con promedio de quiz {round(ctx.quiz_average)}% "
            f"y promedio de simulación {round(ctx.sim_average)}%. Muestra señales de desenganche."
        )
    elif no_recent_activity and ctx.progress_percentage < 20:
        severity = "medium"
        score = 60.0
        confidence = 0.62
        action_en = "Send personalized re-engagement message. Check if rep needs support or has scheduling conflicts."
        action_es = "Envía mensaje personalizado de re-enganche. Verifica si el representante necesita apoyo o tiene conflictos de horario."
        expl_en = f"Rep has been inactive for {ctx.days_inactive} days with minimal training progress ({round(ctx.progress_percentage)}%)."
        expl_es = f"El representante lleva {ctx.days_inactive} días inactivo con mínimo progreso de entrenamiento ({round(ctx.progress_percentage)}%)."
    else:
        return None

    return PredictionResult(
        prediction_type="churn_risk",
        score=round(score, 1),
        severity=severity,
        confidence=confidence,
        explanation_en=expl_en,
        explanation_es=expl_es,
        recommended_action_en=action_en,
        recommended_action_es=action_es,
        ghl_tags=["prediction:churn_risk"] + (["alert:churn_risk", "alert:high_priority"] if severity == "high" else []),
        ghl_custom_fields=_build_ghl_fields("churn_risk", score, severity, action_en),
    )


def _manager_intervention(ctx: RepSnapshotContext) -> Optional[PredictionResult]:
    """
    Manager Intervention Needed:
      HIGH   — repeated same flag type (2+) OR sim score declining 3+ sessions in a row
      MEDIUM — inactive 10+ days with no sim attempts in last 7 days
    """
    has_repeated_flags = len(ctx.repeated_flag_types) > 0
    declining_trend = ctx.sim_score_trend < -5 and len(ctx.recent_sim_scores) >= 3
    stalled = ctx.days_inactive >= 10 and ctx.failed_consecutive == 0

    if has_repeated_flags or declining_trend:
        severity = "high"
        score = 80.0
        confidence = 0.82
        if has_repeated_flags and declining_trend:
            score = 92.0
            confidence = 0.90
        elif declining_trend:
            score = 85.0
            trend_str = f"{abs(round(ctx.sim_score_trend, 1))} points/session"
            action_en = f"Rep's simulator score declining by ~{trend_str}. Schedule immediate coaching review. Roleplay current weak scenarios before next attempt."
            action_es = f"La puntuación del simulador del representante cae ~{trend_str}. Programa revisión de coaching inmediata. Roleplay escenarios débiles antes del próximo intento."
            expl_en = f"Simulator score declining ~{trend_str} over {len(ctx.recent_sim_scores)} recent sessions. Scores: {ctx.recent_sim_scores}."
            expl_es = f"La puntuación del simulador cae ~{trend_str} en {len(ctx.recent_sim_scores)} sesiones recientes. Puntuaciones: {ctx.recent_sim_scores}."
        else:
            flag_str = ", ".join(ctx.repeated_flag_types)
            action_en = f"Same coaching issue recurring ({flag_str}). Direct manager conversation needed. Standard digital nudges are not working."
            action_es = f"El mismo problema de coaching se repite ({flag_str}). Se necesita conversación directa con el gerente. Los recordatorios digitales no están funcionando."
            expl_en = f"Coaching flags of type [{flag_str}] have triggered 2+ times. Pattern indicates systemic issue, not a one-time event."
            expl_es = f"Banderas de coaching del tipo [{flag_str}] se han activado 2+ veces. El patrón indica un problema sistémico, no un evento aislado."

        # Overwrite if both fired
        if has_repeated_flags and declining_trend:
            flag_str = ", ".join(ctx.repeated_flag_types)
            action_en = f"Multiple intervention signals: recurring flags ({flag_str}) AND declining sim scores. Escalate to Branch Manager. Immediate 1:1 required."
            action_es = f"Múltiples señales de intervención: banderas recurrentes ({flag_str}) Y puntuaciones de simulación en descenso. Escalar al gerente de sucursal. Se requiere 1:1 inmediato."
            expl_en = f"Rep shows both recurring coaching flags ({flag_str}) and declining simulator scores ({ctx.recent_sim_scores}). Dual signal indicates urgent need for direct manager intervention."
            expl_es = f"El representante muestra tanto banderas recurrentes ({flag_str}) como puntuaciones de simulador en descenso ({ctx.recent_sim_scores}). Señal dual indica necesidad urgente de intervención."

    elif stalled:
        severity = "medium"
        score = 65.0
        confidence = 0.68
        action_en = "Rep appears stuck. Check in directly to identify blockers: schedule conflicts, technical issues, or motivation gaps."
        action_es = "El representante parece estancado. Comuníquese directamente para identificar bloqueos: conflictos de horario, problemas técnicos o falta de motivación."
        expl_en = f"Rep has been inactive for {ctx.days_inactive} days with no new simulation attempts. Progress appears stalled at {round(ctx.progress_percentage)}%."
        expl_es = f"El representante lleva {ctx.days_inactive} días inactivo sin nuevos intentos de simulación. El progreso parece estancado en {round(ctx.progress_percentage)}%."
    else:
        return None

    return PredictionResult(
        prediction_type="manager_intervention_needed",
        score=round(score, 1),
        severity=severity,
        confidence=confidence,
        explanation_en=expl_en,
        explanation_es=expl_es,
        recommended_action_en=action_en,
        recommended_action_es=action_es,
        ghl_tags=["prediction:manager_intervention_needed"] + (["alert:high_priority"] if severity == "high" else []),
        ghl_custom_fields=_build_ghl_fields("manager_intervention_needed", score, severity, action_en),
    )


def _rapid_improvement(ctx: RepSnapshotContext) -> Optional[PredictionResult]:
    """
    Rapid Improvement (positive signal):
      LOW — sim score trend >= +8 over 3+ sessions AND progress increased
      (Always low severity — this is a positive/informational signal)
    """
    improving_trend = ctx.sim_score_trend >= 8.0 and len(ctx.recent_sim_scores) >= 3
    good_progress = ctx.progress_percentage >= 30

    if not (improving_trend and good_progress):
        return None

    score = 70.0 + min(ctx.sim_score_trend * 2, 30.0)
    confidence = 0.75
    if ctx.sim_score_trend >= 15:
        confidence = 0.85
        score = min(score + 10, 99.0)

    action_en = "Recognize rep for rapid improvement. Encourage certification attempt if eligible. Consider leaderboard spotlight."
    action_es = "Reconoce al representante por su rápida mejora. Aliéntale a intentar la certificación si es elegible. Considera destacarlo en el leaderboard."
    expl_en = (
        f"Rep's simulator score improving ~{abs(round(ctx.sim_score_trend, 1))} points/session "
        f"over {len(ctx.recent_sim_scores)} sessions. Recent scores: {ctx.recent_sim_scores}."
    )
    expl_es = (
        f"La puntuación del simulador del representante mejora ~{abs(round(ctx.sim_score_trend, 1))} puntos/sesión "
        f"en {len(ctx.recent_sim_scores)} sesiones. Puntuaciones recientes: {ctx.recent_sim_scores}."
    )

    return PredictionResult(
        prediction_type="rapid_improvement",
        score=round(score, 1),
        severity="low",
        confidence=confidence,
        explanation_en=expl_en,
        explanation_es=expl_es,
        recommended_action_en=action_en,
        recommended_action_es=action_es,
        ghl_tags=["prediction:rapid_improvement", "achievement:improving"],
        ghl_custom_fields=_build_ghl_fields("rapid_improvement", score, "low", action_en),
    )


def _promotion_ready(ctx: RepSnapshotContext) -> Optional[PredictionResult]:
    """
    Promotion Ready (positive signal):
      LOW — All green: progress >= 95%, quiz >= 85%, sim >= 85%, active cert, no high-severity flags
    """
    cert_thresh = ctx.thresholds["certification_eligible_threshold"]
    all_green = (
        ctx.progress_percentage >= 95
        and ctx.quiz_average >= cert_thresh
        and ctx.sim_average >= cert_thresh
        and ctx.has_active_certification
        and ctx.high_severity_flag_count == 0
    )

    if not all_green:
        return None

    score = 90.0 + min((ctx.quiz_average - cert_thresh) * 0.3, 10.0)
    confidence = 0.90

    action_en = "Rep is fully certified and performing above standards. Recommend advanced certification or leadership track. Notify Dealer Admin."
    action_es = "El representante está completamente certificado y rinde por encima de los estándares. Recomienda certificación avanzada o track de liderazgo. Notifica al Admin del Dealer."
    expl_en = (
        f"Rep has {round(ctx.progress_percentage)}% training completion, quiz avg {round(ctx.quiz_average)}%, "
        f"sim avg {round(ctx.sim_average)}%, active certification, and zero high-severity coaching flags. Ready for promotion."
    )
    expl_es = (
        f"El representante tiene {round(ctx.progress_percentage)}% de completitud, promedio de quiz {round(ctx.quiz_average)}%, "
        f"promedio de simulación {round(ctx.sim_average)}%, certificación activa y cero banderas de coaching de alta gravedad. Listo para promoción."
    )

    return PredictionResult(
        prediction_type="promotion_ready",
        score=round(score, 1),
        severity="low",
        confidence=confidence,
        explanation_en=expl_en,
        explanation_es=expl_es,
        recommended_action_en=action_en,
        recommended_action_es=action_es,
        ghl_tags=["prediction:promotion_ready", "achievement:promotion_ready"],
        ghl_custom_fields=_build_ghl_fields("promotion_ready", score, "low", action_en),
    )


def _top_performer_forecast(ctx: RepSnapshotContext) -> Optional[PredictionResult]:
    """
    Top Performer Forecast (positive signal):
      LOW — In top 15% of company by rank AND streak >= 7 AND sim >= 88
    """
    top_percentile_threshold = max(1, round(ctx.company_rep_count * 0.15))
    in_top = ctx.company_rep_rank <= top_percentile_threshold
    strong_streak = ctx.current_streak >= 7
    strong_sim = ctx.sim_average >= 88

    if not (in_top and strong_streak and strong_sim):
        return None

    score = 80.0 + min((100 - ctx.company_rep_rank * (100 / max(ctx.company_rep_count, 1))) * 0.2, 20.0)
    confidence = 0.72

    action_en = "Rep is forecasted as a top performer. Feature on leaderboard. Offer peer mentoring opportunity. Flag for company spotlight."
    action_es = "Se pronostica que el representante será un top performer. Destácalo en el leaderboard. Ofrece oportunidad de mentoría. Marca para spotlight de la empresa."
    expl_en = (
        f"Rep ranks #{ctx.company_rep_rank} of {ctx.company_rep_count} in company, "
        f"with {ctx.current_streak}-day streak and {round(ctx.sim_average)}% sim average. Top performer trajectory."
    )
    expl_es = (
        f"El representante ocupa el puesto #{ctx.company_rep_rank} de {ctx.company_rep_count} en la empresa, "
        f"con racha de {ctx.current_streak} días y promedio de simulación de {round(ctx.sim_average)}%. Trayectoria de top performer."
    )

    return PredictionResult(
        prediction_type="top_performer_forecast",
        score=round(score, 1),
        severity="low",
        confidence=confidence,
        explanation_en=expl_en,
        explanation_es=expl_es,
        recommended_action_en=action_en,
        recommended_action_es=action_es,
        ghl_tags=["prediction:top_performer", "achievement:top_performer"],
        ghl_custom_fields=_build_ghl_fields("top_performer_forecast", score, "low", action_en),
    )


# ─── Main Engine Entry Point ──────────────────────────────────────────────────

def run_prediction_engine(ctx: RepSnapshotContext) -> List[PredictionResult]:
    """
    Runs all prediction rules against a RepSnapshotContext.
    Returns a list of fired PredictionResult objects (0 to N).
    No database access. Callers handle persistence and GHL sync.
    """
    results: List[PredictionResult] = []

    rule_fns = [
        _cert_failure_risk,
        _churn_risk,
        _manager_intervention,
        _rapid_improvement,
        _promotion_ready,
        _top_performer_forecast,
    ]

    for rule_fn in rule_fns:
        try:
            result = rule_fn(ctx)
            if result is not None:
                results.append(result)
        except Exception as e:
            # Engine errors must never crash the calling service
            print(f"[PREDICTION-ENGINE] Rule {rule_fn.__name__} failed for {ctx.user_id}: {e}")

    return results
