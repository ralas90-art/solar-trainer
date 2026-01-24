import os
from openai import OpenAI
from models import StateProfile, Scenario

# Initialize Client (expects OPENAI_API_KEY in env)
# Initialize Client safely
try:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except:
    client = None

class LLMClient:
    def evaluate_submission(self, user_text: str, state: StateProfile, scenario: Scenario, language: str = "en") -> dict:
        """
        Sends the interaction to the LLM to get a critique and score.
        """
        
        system_prompt = f"""
        You are a Solar Sales Training Coach.
        
        CONTEXT:
        - Scenario: {scenario.name} ("{scenario.description}")
        - State: {state.name} (Metering: {state.metering})
        - Incentives: {', '.join(state.incentives)}
        - Critical Keywords/Concepts: {', '.join(state.critical_keywords)}
        - Language: {language}
        
        TASK:
        Evaluate the Rep's response to the customer's objection: "{scenario.opening_line}"
        
        CRITERIA:
        1. Did the Rep achieve the specific "Goal" listed in the CONTEXT Briefing?
        2. Did they include at least one of the "Key Concepts" or "Valid Responses"?
        3. Was the tone professional and empathetic?
        
        (Ignore "State Incentives" unless the Briefing specifically asks for them. Focus primarily on the Scenario's unique Goal.)

        IMPORTANT: YOU MUST RETURN VALID JSON.
        Include a "better_response" field that rewrites the user's answer into a perfect sales script.

        JSON FORMAT:
        {{
            "pass": boolean,
            "score": integer (0-100),
            "critique": "string (< 50 words) in {language}",
            "better_response": "string (rewritten perfect response) in {language}",
            "agent_message": "string (what the coach says back to the rep) in {language}"
        }}
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"REP RESPONSE: {user_text}"}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            print(f"DEBUG LLM RAW OUTPUT: {content}") # Debugging line
            return content
        except Exception as e:
            print(f"LLM Error: {e}")
            # Fallback for error handling
            return '{"pass": false, "critique": "Error connecting to AI.", "agent_message": "System Offline."}'
