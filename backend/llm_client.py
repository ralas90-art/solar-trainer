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
        You are an expert Solar Sales Manager and Roleplay Partner.
        
        CONTEXT:
        - Scenario: {scenario.name} ("{scenario.description}")
        - State: {state.name} (Context only. Do NOT mention specific regulations like NEM 3.0 unless the User brings them up.)
        - Objective: {scenario.briefing}
        - Language: {language}
        
        TASK:
        Evaluate the Rep's response to the customer's objection: "{scenario.opening_line}"
        
        EVALUATION FRAMEWORK (The "A.R.T." of Sales):
        1. Acknowledge: Did they validate the customer's feeling? (e.g., "I understand how you feel...")
        2. Respond: Did they directly address the concern with logic or value?
        3. Transition: Did they end with a question to keep control? (e.g., "Does that make sense?")
        
        STRICT RULES:
        - Do NOT give generic advice about "State Incentives" or "Tax Credits" unless it fits the specific scenario.
        - If the Rep misses the "Transition", fail them.
        - The "better_response" must be natural, conversational, and follow the A.R.T. framework.
        
        IMPORTANT: YOU MUST RETURN VALID JSON.
        
        JSON FORMAT:
        {{
            "pass": boolean,
            "score": integer (0-100),
            "critique": "string (< 50 words). Focus on what part of A.R.T. they missed.",
            "better_response": "string (The perfect A.R.T. response).",
            "agent_message": "string (Short feedback as the coach)."
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
