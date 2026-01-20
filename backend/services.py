import json
from sqlmodel import Session
from models import ChatRequest, ChatResponse, StateProfile, Scenario, UserStats
from data import STATE_KNOWLEDGE_BASE, SCENARIOS
from llm_client import LLMClient

class TrainingService:
    def __init__(self):
        self.llm = LLMClient()
        
    def evaluate_response(self, request: ChatRequest, session: Session) -> ChatResponse:
        # 1. Load Context
        state_profile = STATE_KNOWLEDGE_BASE.get(request.state_code)
        scenario = SCENARIOS.get(request.scenario_id)
        
        if not state_profile or not scenario:
            return ChatResponse(agent_message="Error: Invalid State or Scenario ID.")

        # 2. Call LLM for Analysis
        try:
            llm_result_json = self.llm.evaluate_submission(
                user_text=request.user_message,
                state=state_profile,
                scenario=scenario,
                language=request.language
            )
            # Parse the JSON response from LLM
            result = json.loads(llm_result_json)
            
            # 3. Persist Stats
            user_id = request.user_id
            stats = session.get(UserStats, user_id)
            if not stats:
                stats = UserStats(user_id=user_id)
            
            score = result.get("score", 0)
            passed = result.get("pass", False)
            
            stats.total_score += score
            if passed:
                stats.current_streak += 1
                if stats.current_streak > stats.highest_streak:
                    stats.highest_streak = stats.current_streak
            else:
                stats.current_streak = 0
            
            session.add(stats)
            session.commit()
            
            return ChatResponse(
                agent_message=result.get("agent_message", "Processing..."),
                critique=result.get("critique", "No critique provided."),
                pass_fail=passed,
                score=score
            )
        except Exception as e:
            print(f"Service Error: {e}")
            return ChatResponse(
                agent_message="System Error: Could not reach AI Coach.",
                pass_fail=False
            )
