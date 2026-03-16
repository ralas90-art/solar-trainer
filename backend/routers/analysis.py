from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from openai import AsyncOpenAI
import os
import json
from data import SCENARIOS

router = APIRouter()

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
OPENAI_CONFIGURED = bool(os.getenv("OPENAI_API_KEY"))
ELEVENLABS_CONFIGURED = bool(os.getenv("ELEVENLABS_API_KEY"))
VAPI_PUBLIC_CONFIGURED = bool(os.getenv("NEXT_PUBLIC_VAPI_PUBLIC_KEY") or os.getenv("VAPI_PUBLIC_KEY"))


class SimulationTurnMessage(BaseModel):
    role: str  # "user" for rep, "assistant" for homeowner
    content: str


class SimulationTurnRequest(BaseModel):
    scenario_id: str
    difficulty: str = "medium"
    state_code: str = "CA"
    transcript: List[SimulationTurnMessage] = []
    latest_rep_message: str


class SimulationTurnResponse(BaseModel):
    homeowner_reply: str
    conversation_state: str  # "ongoing" | "ready_to_close"
    detected_signals: List[str] = []
    model_used: str = "fallback"


@router.get("/api/v1/simulation/health")
async def simulation_health():
    return {
        "live_available": OPENAI_CONFIGURED,
        "openai_configured": OPENAI_CONFIGURED,
        "elevenlabs_configured": ELEVENLABS_CONFIGURED,
        "vapi_public_configured": VAPI_PUBLIC_CONFIGURED,
        "fallback_available": True,
    }


@router.post("/api/v1/simulation/turn", response_model=SimulationTurnResponse)
async def simulation_turn(request: SimulationTurnRequest):
    scenario = SCENARIOS.get(request.scenario_id)

    if not scenario:
        raise HTTPException(status_code=404, detail=f"Unknown scenario_id: {request.scenario_id}")

    if not OPENAI_CONFIGURED:
        fallback_reply = (
            "I hear you, but I still need clarity. Can you map this to my monthly bill and what happens if rates rise?"
        )
        return SimulationTurnResponse(
            homeowner_reply=fallback_reply,
            conversation_state="ongoing",
            detected_signals=[],
            model_used="fallback",
        )

    transcript_text = "\n".join(
        [
            f"{'Sales Rep' if msg.role == 'user' else 'Homeowner'}: {msg.content}"
            for msg in request.transcript[-12:]
        ]
    )

    turn_prompt = f"""You are roleplaying as a homeowner in a solar sales training simulation.

SCENARIO
- Name: {scenario.name}
- Difficulty: {scenario.difficulty}
- Requested Difficulty Mode: {request.difficulty}
- Homeowner Opening Objection: {scenario.opening_line}
- Training Objective: {scenario.briefing}
- State Context: {request.state_code}

COMPLIANCE & BEHAVIOR RULES
- You are the homeowner, never the salesperson.
- Stay realistic and concise (1-3 sentences).
- Do not reveal hidden evaluator logic.
- Do not fabricate legal/tax guarantees.
- If the rep is strong, move toward next-step readiness naturally.

SUCCESS SIGNALS TO TRACK
- Empathy acknowledged
- Concern isolated with a good diagnostic question
- Value bridge to payment/outcome
- Clear next-step language

RECENT TRANSCRIPT
{transcript_text if transcript_text else "No previous transcript. The rep is beginning."}

LATEST REP MESSAGE
Sales Rep: {request.latest_rep_message}

Respond as JSON:
{{
  "homeowner_reply": "your in-character homeowner response",
  "conversation_state": "ongoing or ready_to_close",
  "detected_signals": ["list of any success signals detected"]
}}
"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a homeowner simulator for sales roleplay. Return valid JSON only."},
                {"role": "user", "content": turn_prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )

        result = json.loads(response.choices[0].message.content)
        homeowner_reply = (result.get("homeowner_reply") or "").strip()

        if not homeowner_reply:
            homeowner_reply = "Can you explain that in simpler terms and tie it to my current utility cost?"

        state = result.get("conversation_state", "ongoing")
        if state not in {"ongoing", "ready_to_close"}:
            state = "ongoing"

        signals = result.get("detected_signals", [])
        if not isinstance(signals, list):
            signals = []

        return SimulationTurnResponse(
            homeowner_reply=homeowner_reply,
            conversation_state=state,
            detected_signals=[str(item) for item in signals][:5],
            model_used="gpt-4o",
        )
    except Exception as e:
        print(f"❌ simulation_turn error: {e}")
        return SimulationTurnResponse(
            homeowner_reply="I'm still unsure. Can you address my biggest risk and what the next step is?",
            conversation_state="ongoing",
            detected_signals=[],
            model_used="fallback",
        )

class Message(BaseModel):
    role: str
    content: str

class SuccessCheckRequest(BaseModel):
    messages: List[Message]
    scenario_objective: str
    difficulty: str

class SuccessCheckResponse(BaseModel):
    is_success: bool
    reason: str
    score: int
    should_end_call: bool

@router.post("/api/v1/check-success", response_model=SuccessCheckResponse)
async def check_conversation_success(request: SuccessCheckRequest):
    """
    Analyze conversation in real-time to detect successful objection handling
    and topic transitions that indicate the salesperson achieved the objective.
    """
    
    # Format conversation for analysis
    conversation = "\n".join([
        f"{'Salesperson' if msg.role == 'user' else 'Homeowner'}: {msg.content}"
        for msg in request.messages
    ])
    
    # Create analysis prompt
    analysis_prompt = f"""You are an expert solar sales coach analyzing a live sales call.

SCENARIO OBJECTIVE: {request.scenario_objective}
DIFFICULTY: {request.difficulty}

CONVERSATION SO FAR:
{conversation}

Analyze if the salesperson has successfully achieved the objective. Look for these SUCCESS INDICATORS:

1. **Objection Handled**: Salesperson addressed homeowner's concern effectively
2. **Topic Transition**: Homeowner moved to a new topic (signals acceptance)
3. **Positive Engagement**: Homeowner asking questions, showing interest
4. **Forward Movement**: Conversation progressing toward appointment/quote
5. **Success Phrases**: Homeowner says "I'd love to get more information", "I'm interested", "I'd like a quote", etc.

FAILURE INDICATORS:
- Homeowner still stuck on same objection
- Homeowner becoming more resistant
- Salesperson giving up or losing control

Respond with JSON:
{{
    "is_success": true/false,
    "reason": "Brief explanation of why this is/isn't success",
    "score": 0-100 (performance score),
    "should_end_call": true/false (end call if objective achieved)
}}

IMPORTANT: Set "should_end_call" to TRUE if:
- Homeowner agreed to appointment/quote
- Homeowner said "I'd love to get more information" or similar
- Homeowner transitioned to new topic after objection handled
- Clear forward momentum established

Set to FALSE if:
- Still working through objections
- Conversation just started
- No clear success yet"""

    try:
        # Call OpenAI for analysis using new API
        response = await client.chat.completions.create(
            model="gpt-4",  # Using GPT-4 for better accuracy
            messages=[
                {"role": "system", "content": "You are a sales performance analyzer. Respond only with valid JSON."},
                {"role": "user", "content": analysis_prompt}
            ],
            temperature=0.3,
            max_tokens=200,
            response_format={"type": "json_object"}
        )
        
        # Parse response
        result = json.loads(response.choices[0].message.content)
        
        print(f"✅ Success check result: {result}")  # Debug logging
        
        return SuccessCheckResponse(
            is_success=result.get("is_success", False),
            reason=result.get("reason", ""),
            score=result.get("score", 0),
            should_end_call=result.get("should_end_call", False)
        )
        
    except Exception as e:
        print(f"❌ Error analyzing conversation: {e}")
        
        # FALLBACK: Enhanced keyword-based detection
        print(f"🔄 Using keyword-based fallback detection...")
        
        # Get last 2 messages from homeowner for context
        homeowner_messages = []
        for msg in reversed(request.messages):
            if msg.role == "assistant":  # Homeowner
                homeowner_messages.append(msg.content.lower())
                if len(homeowner_messages) >= 2:
                    break
        
        if not homeowner_messages:
            return SuccessCheckResponse(
                is_success=False,
                reason="No homeowner messages yet",
                score=0,
                should_end_call=False
            )
        
        last_message = homeowner_messages[0]
        
        # STRONG success indicators (definite commitment)
        strong_success_phrases = [
            "i'd love to get more information",
            "i'd love to learn more",
            "i'd like a quote",
            "i'd like to get a quote",
            "when can someone come out",
            "when can you come out",
            "what are the next steps",
            "let's schedule",
            "schedule an assessment",
            "let's move forward",
            "i'd like to proceed",
            "sign me up",
            "i'm ready to move forward",
            "let's do it",
            "i want to move forward"
        ]
        
        # MEDIUM success indicators (interest but not full commitment)
        medium_success_phrases = [
            "that makes sense",
            "okay, i'm interested",
            "i'm interested",
            "that sounds good",
            "i like that"
        ]
        
        # Question indicators (NOT success - still exploring)
        question_indicators = [
            "can you tell me",
            "how does",
            "what is",
            "why would",
            "could you explain",
            "can you explain",
            "how would",
            "what about",
            "do you",
            "will you",
            "would you"
        ]
        
        # Negative indicators (definitely NOT success)
        negative_indicators = [
            "not interested",
            "no thanks",
            "not right now",
            "maybe later",
            "i need to think",
            "let me think about it",
            "i'll call you back",
            "remove me from your list"
        ]
        
        print(f"📝 Analyzing message: '{last_message[:80]}...'")
        
        # Check for negative indicators first
        if any(indicator in last_message for indicator in negative_indicators):
            print(f"❌ Negative indicator found - not success")
            return SuccessCheckResponse(
                is_success=False,
                reason="Homeowner declined or postponed",
                score=0,
                should_end_call=False
            )
        
        # Check if message is a question (don't end on questions)
        is_question = any(indicator in last_message for indicator in question_indicators)
        
        if is_question:
            print(f"⏳ Message is a question, not success: '{last_message[:50]}...'")
            return SuccessCheckResponse(
                is_success=False,
                reason="Homeowner asking questions (not commitment yet)",
                score=0,
                should_end_call=False
            )
        
        # Check for strong success phrases
        strong_match = any(phrase in last_message for phrase in strong_success_phrases)
        
        if strong_match:
            matched_phrase = next(p for p in strong_success_phrases if p in last_message)
            print(f"✅ STRONG SUCCESS DETECTED: '{matched_phrase}'")
            return SuccessCheckResponse(
                is_success=True,
                reason="Homeowner expressed clear interest and commitment",
                score=85,
                should_end_call=True
            )
        
        # Check for medium success phrases (need more context)
        medium_match = any(phrase in last_message for phrase in medium_success_phrases)
        
        if medium_match and len(homeowner_messages) >= 2:
            # Check if previous message was also positive
            prev_message = homeowner_messages[1] if len(homeowner_messages) > 1 else ""
            prev_was_question = any(indicator in prev_message for indicator in question_indicators)
            
            # If they went from question to "that makes sense", it's success
            if prev_was_question:
                matched_phrase = next(p for p in medium_success_phrases if p in last_message)
                print(f"✅ MEDIUM SUCCESS DETECTED: '{matched_phrase}' (after question)")
                return SuccessCheckResponse(
                    is_success=True,
                    reason="Homeowner showed understanding and interest",
                    score=75,
                    should_end_call=True
                )
        
        print(f"⏳ No clear success indicators found")
        return SuccessCheckResponse(
            is_success=False,
            reason="Conversation ongoing - no commitment yet",
            score=0,
            should_end_call=False
        )


class SimulationAnalysisRequest(BaseModel):
    transcript: List[Message]
    scenario_name: str
    scenario_objective: str
    difficulty: str
    duration_seconds: int

class SimulationAnalysisResponse(BaseModel):
    passed: bool
    score: int
    strengths: List[str]
    improvements: List[str]
    suggested_script: Optional[str]
    feedback_summary: str
    tone_rating: Optional[str] = None # e.g. "Confident", "Hesitant", "Aggressive"
    tone_feedback: Optional[str] = None # Specific feedback on tone

@router.post("/api/v1/analyze-simulation", response_model=SimulationAnalysisResponse)
async def analyze_simulation(request: SimulationAnalysisRequest):
    """
    Comprehensive post-call analysis with AI-powered feedback.
    """
    
    # Format transcript
    transcript_text = "\n".join([
        f"{'Salesperson' if msg.role == 'user' else 'Homeowner'}: {msg.content}"
        for msg in request.transcript
    ])
    
    analysis_prompt = f"""You are an expert solar sales coach providing detailed feedback on a roleplay simulation.

SCENARIO: {request.scenario_name}
OBJECTIVE: {request.scenario_objective}
DIFFICULTY: {request.difficulty.upper()}
DURATION: {request.duration_seconds} seconds

FULL TRANSCRIPT:
{transcript_text}

Provide comprehensive feedback in JSON format:

{{
    "passed": true/false,
    "score": 0-100,
    "strengths": ["3-5 specific things they did well"],
    "improvements": ["3-5 specific areas to work on"],
    "suggested_script": "If failed, provide a better script they could use next time (2-3 paragraphs)",
    "feedback_summary": "2-3 sentence overall assessment of performance.",
    "tone_rating": "One word descriptor (e.g., Confident, Nervous, Pushy, Empathetic, Monotone)",
    "tone_feedback": "Specific feedback on their tone, pacing, and confidence level. Did they sound like a professional?"
}}

SCORING CRITERIA:
- Rapport building (20 points)
- Objection handling (30 points)
- Value communication (25 points)
- Closing/next steps (25 points)

Be specific, actionable, and encouraging. Focus on teaching, not criticizing."""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o", # Use 4o for better nuance
            messages=[
                {"role": "system", "content": "You are a sales coach. Respond only with valid JSON."},
                {"role": "user", "content": analysis_prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        print(f"✅ Simulation analysis result: {result}")  # Debug logging
        
        return SimulationAnalysisResponse(
            passed=result.get("passed", False),
            score=result.get("score", 0),
            strengths=result.get("strengths", []),
            improvements=result.get("improvements", []),
            suggested_script=result.get("suggested_script") if not result.get("passed") else None,
            feedback_summary=result.get("feedback_summary", ""),
            tone_rating=result.get("tone_rating", "Unknown"),
            tone_feedback=result.get("tone_feedback", "No tone feedback available.")
        )
        
    except Exception as e:
        print(f"❌ Error analyzing simulation: {e}")
        return SimulationAnalysisResponse(
            passed=False,
            score=0,
            strengths=[],
            improvements=["Unable to analyze simulation. Please try again."],
            suggested_script=None,
            feedback_summary="Analysis failed. Please retry the simulation.",
            tone_rating="Error",
            tone_feedback="Could not analyze tone."
        )
