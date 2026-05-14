import json
from sqlmodel import Session
from models import ChatRequest, ChatResponse, StateProfile, Scenario, UserStats, Company
from data import STATE_KNOWLEDGE_BASE, SCENARIOS
from llm_client import LLMClient
from services.billing import BillingService
from uuid import UUID
from typing import Optional

class TrainingService:
    def __init__(self):
        self.llm = LLMClient()
        
    def evaluate_response(
        self, 
        request: ChatRequest, 
        session: Session, 
        company: Company,
        user_id_uuid: Optional[UUID] = None
    ) -> ChatResponse:
        # 0. Check Billing Limits
        can_sim, reason = BillingService.check_simulation_limit(company, session)
        if not can_sim:
            return ChatResponse(
                agent_message=f"Access Suspended: {reason}",
                pass_fail=False,
                critique="Plan limit reached."
            )

        # 1. Load Context
        scenario = SCENARIOS.get(request.scenario_id)
        
        # Fallback for state profile if missing (e.g. for test users)
        state_code = request.state_code or "CA"
        state_profile = STATE_KNOWLEDGE_BASE.get(state_code)
        
        if not state_profile or not scenario:
            debug_info = f"Received: scenario_id='{request.scenario_id}', state_code='{state_code}'. Available IDs: {list(SCENARIOS.keys())}"
            print(debug_info)
            return ChatResponse(agent_message=f"Error: Invalid ID. {debug_info}")

        # 2. Call LLM for Analysis
        try:
            llm_result_json = self.llm.evaluate_submission(
                user_text=request.user_message,
                state=state_profile,
                scenario=scenario,
                company=company,
                user_id=user_id_uuid,
                language=request.language
            )
            # Parse the JSON response from LLM
            result = json.loads(llm_result_json)
            
            # 3. Persist Stats
            stats = session.get(UserStats, user_id_uuid)
            if not stats:
                stats = UserStats(user_id=user_id_uuid)
            
            score = result.get("score", 0)
            passed = result.get("pass", False)
            
            stats.total_score += score
            if passed:
                stats.current_streak += 1
                if stats.current_streak > stats.highest_streak:
                    stats.highest_streak = stats.current_streak
            else:
                stats.current_streak = 0
            
            # Engagement Tracking (Phase 2)
            from datetime import datetime
            stats.last_interaction_at = datetime.utcnow()
            
            try:
                log = json.loads(stats.activity_log) if stats.activity_log else []
            except:
                log = []
            
            log.append({
                "event": "simulation_complete",
                "timestamp": stats.last_interaction_at.isoformat(),
                "date": stats.last_interaction_at.date().isoformat(),
                "score": score,
                "passed": passed,
                "scenario_id": request.scenario_id
            })
            # Keep log concise
            stats.activity_log = json.dumps(log[-50:])
            
            from models import SimulationResult
            
            # Create Simulation Result record
            sim_result = SimulationResult(
                user_id=user_id_uuid,
                company_id=company.id,
                scenario_id=request.scenario_id,
                scenario_name=scenario.name,
                score=score,
                passed=passed,
                transcript_json=json.dumps([
                    {"role": "user", "content": request.user_message},
                    {"role": "agent", "content": result.get("agent_message")}
                ]),
                feedback_json=json.dumps({
                    "critique": result.get("critique"),
                    "pros": result.get("pros", []),
                    "cons": result.get("cons", []),
                    "summary": result.get("summary")
                })
            )
            session.add(sim_result)
            session.commit()
            
            session.add(stats)
            session.commit()
            
            # Fallback if LLM misses the key
            better_resp = result.get("better_response")
            if not better_resp:
                better_resp = f"Try this: 'I understand the concern, but in {request.state_code}, incentives like {state_profile.incentives[0]} can significantly reduce your net cost.'"

            return ChatResponse(
                agent_message=result.get("agent_message", "Processing..."),
                critique=result.get("critique", "No critique provided."),
                better_response=better_resp,
                pass_fail=passed,
                score=score,
                summary=result.get("summary"),
                pros=result.get("pros", []),
                cons=result.get("cons", [])
            )
        except Exception as e:
            print(f"Service Error: {e}")
            return ChatResponse(
                agent_message="System Error: Could not reach AI Coach.",
                pass_fail=False
            )

    @staticmethod
    def get_curriculum_progress(stats: UserStats) -> dict:
        """
        Calculate unified curriculum progress from module_progress JSON.
        Single source of truth for all dashboards.
        """
        try:
            module_progress = json.loads(stats.module_progress) if stats.module_progress else {}
        except:
            module_progress = {}
            
        completed_steps = 0
        total_steps = 21 # 7 modules * 3 steps (Theory, Quiz, Simulation)
        
        # Track completion state per module
        modules_completed = []
        modules_in_progress = []
        
        for mod_id, mod_data in module_progress.items():
            if not isinstance(mod_data, dict):
                continue
            
            steps_done = sum(1 for v in mod_data.values() if v is True)
            completed_steps += steps_done
            
            if steps_done >= 3:
                modules_completed.append(mod_id)
            elif steps_done > 0:
                modules_in_progress.append(mod_id)
                
        percent = min(100, round((completed_steps / total_steps) * 100))
        
        return {
            "percent": percent,
            "completedSteps": completed_steps,
            "totalSteps": total_steps,
            "modulesCompleted": modules_completed,
            "modulesInProgress": modules_in_progress,
            "isFullyCompleted": percent >= 100
        }
