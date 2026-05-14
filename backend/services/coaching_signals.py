from typing import List, Dict, Any, Optional
import json
from datetime import datetime, timedelta
from uuid import UUID
from sqlmodel import Session, select

from models import UserStats, SimulationResult
from data import SCENARIOS

class CoachingSignalsService:
    @staticmethod
    def get_signals(user_id: UUID, session: Session) -> List[Dict[str, Any]]:
        """
        Analyze UserStats and SimulationResults to generate professional coaching signals.
        Implements cooldown logic, trend awareness, and refined triggering rules.
        """
        stats = session.get(UserStats, user_id)
        if not stats:
            return []

        # 1. Fetch recent simulation history (limit 20 for trend analysis)
        sims = session.exec(
            select(SimulationResult)
            .where(SimulationResult.user_id == user_id)
            .order_by(SimulationResult.created_at.desc())
            .limit(20)
        ).all()

        # 2. Get Curriculum Progress (Single Source of Truth)
        from services.training import TrainingService
        progress = TrainingService.get_curriculum_progress(stats)
        
        try:
            signals_state = json.loads(stats.coaching_signals_state) if stats.coaching_signals_state else {}
        except:
            signals_state = {}

        raw_signals = []
        now = datetime.utcnow()

        # --- SIGNAL 1: Practice Avoidance ---
        # Refined: Only trigger if lessons completed > 5 AND no simulations in 7 days AND not fully completed
        lessons_completed = progress["completedSteps"] # Total steps (Theory/Quiz)
        sim_count_recent = len([s for s in sims if s.created_at > now - timedelta(days=7)])
        
        if lessons_completed > 5 and sim_count_recent == 0 and not progress["isFullyCompleted"]:
            raw_signals.append({
                "type": "practice_avoidance",
                "label": "Practice Avoidance",
                "translation_key": "SIGNAL_PRACTICE_AVOIDANCE",
                "severity": "high",
                "reason": f"Rep completed {lessons_completed} training steps but has 0 simulations in the last 7 days.",
                "recommendedAction": "Assign a specific simulation module or schedule a live roleplay."
            })

        # --- SIGNAL 2: Low Retention Pattern ---
        # Refined: Score normalization (already 0-100) + trend awareness
        scenario_attempts: Dict[str, List[int]] = {}
        for sim in sims:
            if sim.scenario_id not in scenario_attempts:
                scenario_attempts[sim.scenario_id] = []
            scenario_attempts[sim.scenario_id].append(sim.score)
        
        for scenario_id, scores in scenario_attempts.items():
            # If 3+ attempts and average/recent is low
            if len(scores) >= 3 and all(s < 75 for s in scores[:3]):
                scenario_name = SCENARIOS.get(scenario_id).name if scenario_id in SCENARIOS else scenario_id
                raw_signals.append({
                    "type": "low_retention",
                    "label": "Low Retention Pattern",
                    "translation_key": "SIGNAL_LOW_RETENTION",
                    "severity": "medium",
                    "reason": f"Rep failed to improve score on '{scenario_name}' after {len(scores)} attempts.",
                    "recommendedAction": "Review the 'Theory' section of this module with the rep.",
                    "relatedModuleId": scenario_id
                })

        # --- SIGNAL 3: Falling Behind ---
        # Refined: Only trigger if incomplete modules exist AND no activity in 3 days
        if not progress["isFullyCompleted"]:
            last_activity = stats.last_interaction_at or (sims[0].created_at if sims else None)
            if not last_activity or last_activity < now - timedelta(days=3):
                raw_signals.append({
                    "type": "falling_behind",
                    "label": "Falling Behind",
                    "translation_key": "SIGNAL_FALLING_BEHIND",
                    "severity": "medium",
                    "reason": "No training activity recorded in the last 3 days despite incomplete curriculum.",
                    "recommendedAction": "Check in with the rep to ensure they have dedicated time for training."
                })

        # --- FINAL PROCESSING: Cooldown, Trends, and Persistence ---
        final_signals = []
        updated_state = signals_state.copy()
        
        # Calculate overall score trend
        trend = CoachingSignalsService._calculate_trend(sims)

        for rs in raw_signals:
            sig_type = rs["type"]
            last_trigger_str = signals_state.get(sig_type)
            last_severity = signals_state.get(f"{sig_type}_severity", "low")
            
            should_trigger = True
            if last_trigger_str:
                last_trigger = datetime.fromisoformat(last_trigger_str)
                # 24h cooldown UNLESS severity increased
                if now - last_trigger < timedelta(hours=24) and rs["severity"] == last_severity:
                    should_trigger = False
            
            if should_trigger:
                rs["generatedAt"] = now.isoformat()
                rs["trend"] = trend
                final_signals.append(rs)
                updated_state[sig_type] = now.isoformat()
                updated_state[f"{sig_type}_severity"] = rs["severity"]

        # Save updated state back to stats
        if final_signals:
            stats.coaching_signals_state = json.dumps(updated_state)
            session.add(stats)
            session.commit()

        # Return active signals (if no new ones, return the most recent persistent ones for visibility)
        # In a real system, we might want to return all current "active" signals regardless of cooldown
        # But here we follow the "only re-trigger after cooldown" rule for notifications/alerts.
        return final_signals

    @staticmethod
    def _calculate_trend(sims: List[SimulationResult]) -> str:
        """Helper to determine score direction: improving, declining, or stable."""
        if len(sims) < 3:
            return "stable"
        
        recent_scores = [s.score for s in sims[:5]] # Most recent 5
        if len(recent_scores) < 3:
            return "stable"
            
        # Very basic trend: compare first half to second half of the recent window
        # sims are ordered desc (newest first), so reverse for chronological
        chron_scores = recent_scores[::-1]
        
        first_avg = sum(chron_scores[:2]) / 2
        last_avg = sum(chron_scores[-2:]) / 2
        
        if last_avg > first_avg + 5:
            return "improving"
        elif last_avg < first_avg - 5:
            return "declining"
        return "stable"
