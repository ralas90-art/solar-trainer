"use client"

import { useState, useEffect, useRef } from "react"
import { getApiUrl } from "@/lib/utils"
import { WHITE_LABEL } from "@/lib/white-label.config"
// @ts-ignore
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Input } from "@/components/ui/input"
import { Mic, Trophy, Flame, User, Bot, Sparkles, Phone, PhoneOff, BarChart3, Shield, Heart, Clock, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import vapi from "@/lib/vapi"
import { AudioVisualizer } from "@/components/audio-visualizer"
import { SimulationFeedback } from "@/components/simulation-feedback"
import { saveDebrief } from "@/lib/debrief-storage"
import { useLanguage } from "@/hooks/use-language"

const API_URL = getApiUrl()

interface SimulationProps {
    tenant: any
    stateCode: string
    scenario: any // Full scenario object
    userId: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    onComplete?: (score: number) => void
}

const getInitialTime = (diff: string) => {
    switch (diff) {
        case 'advanced': return 45
        case 'intermediate': return 60
        case 'beginner':
        default: return 90
    }
}

export function SimulationWindow({ tenant, stateCode, scenario, userId, difficulty = 'beginner', onComplete }: SimulationProps) {
    const { isSpanish } = useLanguage()
    const t = (en: string, es: string) => isSpanish ? es : en

    const getAvatarGradient = (style?: string) => {
        switch (style) {
            case 'hostile':
                return 'from-rose-600 to-red-950 text-rose-100 border-rose-500/30 ring-red-500/10'
            case 'analytical':
                return 'from-amber-600 to-yellow-950 text-amber-100 border-amber-500/30 ring-amber-500/10'
            case 'reluctant':
                return 'from-teal-600 to-emerald-950 text-teal-100 border-teal-500/30 ring-teal-500/10'
            case 'friendly':
                return 'from-sky-600 to-indigo-950 text-sky-100 border-sky-500/30 ring-sky-500/10'
            default:
                return 'from-blue-600 to-indigo-950 text-blue-100 border-blue-500/30 ring-blue-500/10'
        }
    }

    const getInitials = (nameStr?: string) => {
        if (!nameStr) return "?"
        const parts = nameStr.trim().split(/\s+/)
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    }

    if (!scenario) {
        return (
            <div className="h-[650px] flex items-center justify-center bg-slate-950 border border-white/10 rounded-xl">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm">Loading simulation...</p>
                </div>
            </div>
        )
    }

    const [mode, setMode] = useState<'briefing' | 'roleplay' | 'feedback'>('briefing')
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedbackData, setFeedbackData] = useState<any>(null)

    // Vapi State
    const [callStatus, setCallStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
    const [isMuted, setIsMuted] = useState(false)
    const [volumeLevel, setVolumeLevel] = useState(0)

    // Chat/Transcript State
    const [messages, setMessages] = useState<any[]>([])
    const [partialTranscript, setPartialTranscript] = useState("")

    // Gamification State
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)
    const [lives, setLives] = useState(3)
    const [lastLifeLostAt, setLastLifeLostAt] = useState<string | null>(null)
    const [showRules, setShowRules] = useState(true) // Show rules on mount

    // Timer State (Moved up)
    const [timeLeft, setTimeLeft] = useState(60)
    // Feedback State (Moved up)
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)

    // Handlers (Moved up for auto-success access)
    const handleFinishMission = async () => {
        if (callStatus === 'connected' || callStatus === 'connecting') {
            vapi.stop()
        }

        setIsLoadingFeedback(true)
        setMode('feedback') // Switch immediately

        try {
            const response = await fetch(`${API_URL}/api/v1/analyze-simulation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: messages.filter(m => m.role !== 'system').map(m => ({
                        role: m.role === 'agent' ? 'assistant' : m.role,
                        content: m.content
                    })),
                    scenario_name: scenario.name,
                    scenario_objective: scenario.objective || scenario.briefing,
                    difficulty: difficulty,
                    duration_seconds: getInitialTime(difficulty) - timeLeft
                })
            })

            if (response.ok) {
                const data = await response.json()
                setFeedbackData(data)

                // Persist debrief to localStorage for history page
                saveDebrief({
                    scenarioId: scenario.id ?? "unknown",
                    scenarioName: scenario.name ?? "Unnamed Scenario",
                    completedAt: new Date().toISOString(),
                    passed: !!data.passed,
                    score: data.score ?? 0,
                    feedbackSummary: data.summary ?? data.feedback_summary,
                    toneRating: data.tone_rating,
                    toneFeedback: data.tone_feedback,
                    strengths: data.pros ?? data.strengths ?? [],
                    improvements: data.cons ?? data.improvements ?? [],
                    suggestedScript: data.better_response ?? data.suggested_script ?? data.suggestedScript,
                    transcript: messages
                        .filter((m) => m.role !== "system")
                        .map((m) => ({ role: m.role === "agent" ? "Homeowner" : "You", content: m.content })),
                })

                // If passed, update user stats/progress
                if (data.passed) {
                    const xpGained = Math.round(data.score * 10) // Simple XP formula

                    try {
                        await fetch(`${API_URL}/user/${userId}/progress`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                module_id: scenario.id,
                                type: 'sim',
                                passed: true,
                                score: data.score,
                                xp: xpGained
                            })
                        })
                        // Update local state to show immediate feedback
                        setScore(prev => prev + xpGained)
                        setStreak(prev => prev + 1)
                    } catch (err) {
                        console.error("Failed to save progress", err)
                    }

                    if (onComplete) onComplete(data.score)
                }
            } else {
                console.error("Failed to analyze simulation")
            }
        } catch (e) {
            console.error("Error fetching feedback:", e)
        } finally {
            setIsLoadingFeedback(false)
        }
    }

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // 1. Load User Stats on Mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
                const res = await fetch(`${url}/user/${userId}/stats`)
                if (res.ok) {
                    const data = await res.json()
                    setScore(data.total_score)
                    setStreak(data.current_streak)
                    setLives(data.lives ?? 3)
                    setLastLifeLostAt(data.last_life_lost_at)
                }
            } catch (e) {
                console.error("Failed to load stats", e)
            }
        }
        fetchStats()
    }, [userId])

    // 2. Vapi Event Listeners
    useEffect(() => {
        const onCallStart = () => {
            console.log("Vapi Call connected")
            setCallStatus("connected")
            // System message
            setMessages(prev => [...prev, { role: "system", content: "Call connected. Speak naturally..." }])
        }

        const onCallEnd = () => {
            console.log("Vapi Call ended")
            setCallStatus("disconnected")
            setMessages(prev => [...prev, { role: "system", content: "Call ended." }])
        }

        const onVolumeLevel = (level: number) => {
            setVolumeLevel(level)
        }

        const onMessage = (msg: any) => {
            if (msg.type === "transcript") {
                if (msg.transcriptType === "partial") {
                    setPartialTranscript(msg.transcript)
                } else if (msg.transcriptType === "final") {
                    setPartialTranscript("")
                    const role = msg.role === "assistant" ? "agent" : "user"
                    if (msg.transcript && msg.transcript.length > 0) {
                        setMessages(prev => {
                            // Prevent duplicates - check if last message is identical
                            const lastMsg = prev[prev.length - 1]
                            if (lastMsg && lastMsg.role === role && lastMsg.content === msg.transcript) {
                                return prev
                            }
                            return [...prev, { role, content: msg.transcript }]
                        })
                    }
                }
            }
        }

        const onError = (err: any) => {
            console.error("Vapi Error:", err)
            setCallStatus("disconnected")
            setMessages(prev => [...prev, { role: "system", content: "Connection Error: " + (err?.message || JSON.stringify(err) || "Unknown error") }])
        }

        vapi.on("call-start", onCallStart)
        vapi.on("call-end", onCallEnd)
        vapi.on("volume-level", onVolumeLevel)
        vapi.on("message", onMessage)
        vapi.on("error", onError)

        return () => {
            vapi.stop()
            vapi.removeAllListeners()
        }
    }, [])

    // 3. Auto-Success Detection - Check conversation progress
    useEffect(() => {
        if (callStatus !== 'connected' || messages.length < 4) {
            return; // Need at least 4 messages to analyze
        }

        // Only check after agent messages (not user or system messages)
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role !== 'agent') {
            return; // Only check after AI responds
        }

        const checkSuccess = async () => {
            console.log('🔍 Checking for success... Messages:', messages.length);

            try {
                const response = await fetch(`${API_URL}/api/v1/check-success`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: messages.filter(m => m.role !== 'system').map(m => ({
                            role: m.role === 'agent' ? 'assistant' : m.role,
                            content: m.content
                        })),
                        scenario_objective: scenario.objective || scenario.briefing,
                        difficulty: difficulty
                    })
                });

                console.log('📡 Success check response status:', response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Success check result:', result);

                    if (result.should_end_call) {
                        console.log('🎉 SUCCESS DETECTED! Ending call...', result.reason);
                        setMessages(prev => [...prev, {
                            role: 'system',
                            content: `✅ Success! ${result.reason}`
                        }]);
                        setTimeout(() => {
                            console.log('📞 Stopping Vapi call and finishing mission...');
                            handleFinishMission(); // Auto-trigger success workflow
                        }, 2000);
                    } else {
                        console.log('⏳ Not successful yet, continuing call...');
                    }
                } else {
                    console.error('❌ Success check failed with status:', response.status);
                }
            } catch (e) {
                console.error('❌ Error checking success:', e);
            }
        };

        // Check after each agent message
        checkSuccess();
    }, [callStatus, messages, scenario, difficulty]);

    // 4. Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, partialTranscript])


    // 4. Handlers
    const handleStartSimulation = async () => {
        setMode('roleplay')
        // Auto-start call after transition
        setTimeout(() => {
            toggleCall()
        }, 800)
    }

    const toggleCall = async () => {
        if (callStatus === "connected" || callStatus === "connecting") {
            vapi.stop()
        } else {
            setCallStatus("connecting")
            try {
                // 1. Get difficulty-based personality
                const getDifficultyPrompt = () => {
                    const personaName = isSpanish ? (scenario.personaNameEs || scenario.personaNameEn || scenario.name) : (scenario.personaNameEn || scenario.name);
                    const buyerType = isSpanish ? (scenario.buyerTypeEs || scenario.buyerTypeEn) : scenario.buyerTypeEn;
                    const emotionalState = isSpanish ? (scenario.emotionalStateEs || scenario.emotionalStateEn) : scenario.emotionalStateEn;
                    const objectionStyle = isSpanish ? (scenario.objectionStyleEs || scenario.objectionStyleEn) : scenario.objectionStyleEn;
                    const commStyle = isSpanish ? (scenario.communicationStyleEs || scenario.communicationStyleEn) : scenario.communicationStyleEn;
                    const escalations = isSpanish ? (scenario.personaEscalationEs || scenario.personaEscalationEn) : scenario.personaEscalationEn;
                    const stage = isSpanish ? (scenario.salesStageEs || scenario.salesStageEn) : scenario.salesStageEn;

                    let basePrompt = "";
                    if (isSpanish) {
                        basePrompt = `Eres un propietario de una casa en ${stateCode}. Un vendedor de la industria de ${WHITE_LABEL.industry.toLowerCase()} te está llamando por teléfono.

Escenario: ${scenario.name}
Descripción: ${scenario.description}
Instrucciones: ${scenario.briefing}

IMPORTANTE: Eres el PROPIETARIO de la casa, NO el vendedor. El usuario que te llama es el vendedor que intenta ofrecerte ${WHITE_LABEL.productName.toLowerCase()}.

RESTRICCIONES NEGATIVAS CRÍTICAS:
- NO eres un profesional de la industria. Eres un propietario común y corriente.
- BAJO NINGUNA CIRCUNSTANCIA debes identificarte como representante de una empresa de ${WHITE_LABEL.industry.toLowerCase()}.
- Si el usuario se presenta como vendedor, DEBES responder como cliente potencial.
- NO generes discursos de venta. Eres quien recibe la oferta.

TU CONTEXTO:
1. Tienes una objeción específica: "${scenario.opening_line}"
2. Comenzarás la conversación con esta objeción.
3. Tu objetivo es ver si el vendedor puede manejarla de manera efectiva.`;

                        if (personaName) {
                            basePrompt += `

DETALLES DE TU PERSONAJE (Asegúrate de actuar exactamente bajo esta personalidad):
- Nombre: ${personaName}
- Tipo de Comprador: ${buyerType || "Normal"}
- Estado Emocional: ${emotionalState || "Escéptico"}
- Estilo de Objeción: ${objectionStyle || "Pasivo"}
- Estilo de Comunicación: ${commStyle || "Normal"}
- Nivel de Confianza Inicial: ${scenario.trustLevel || 50}/100
- Nivel de Dificultad: ${scenario.difficultyWeight || 5}/10
${escalations ? `- Objeciones Secundarias / Disparadores: ${escalations.join(', ')}` : ''}
- Etapa de Venta: ${stage || "Descubrimiento"}`;
                        }

                        if (difficulty === 'beginner') {
                            return `${basePrompt}

DIFICULTAD: PRINCIPIANTE (Fácil)
PERSONALIDAD:
- Amigable y receptivo.
- Grado de amabilidad: ALTO.
- Si el vendedor responde a tu duda con lógica o valor, ACEPTA de inmediato.
- No seas difícil ni agregues objeciones interminables.
- Si responden bien, di algo como: "Eso tiene sentido. Cuéntame más." o "Está bien, ¿cuándo pueden venir?"

IMPORTANTE: Cuando el vendedor explique claramente los beneficios y responda bien tus dudas, di una de estas frases de éxito y QUÉDATE EN SILENCIO (no digas nada más):
- "¡Esto suena excelente! Me gustaría recibir más información."
- "Tiene sentido. ¿Cuándo puede venir alguien a revisar mi casa?"
- "De acuerdo, me interesa. ¿Cuáles son los siguientes pasos?"`;
                        } else if (difficulty === 'intermediate') {
                            return `${basePrompt}

DIFICULTAD: INTERMEDIO (Medio)
PERSONALIDAD:
- Escéptico pero razonable.
- Grado de amabilidad: MODERADO.
- Necesitas datos claros y números.
- No aceptes de inmediato; pregunta "¿Cómo funciona eso?" o "¿Estás seguro?".
- Si la lógica es sólida, admítelo: "Entiendo tu punto."

OBJECIONES A PLANTEAR SI NO SE MENCIONAN:
1. "¿No es esto muy caro?"
2. "¿Qué pasa si me mudo en unos años?"
3. "He escuchado que el mantenimiento es complicado."

IMPORTANTE: Si el vendedor maneja las objeciones profesionalmente, responde con una de estas frases de éxito y QUÉDATE EN SILENCIO (no digas nada más):
- "Bien, respondiste mis dudas. Me gustaría una cotización."
- "Tiene sentido. ¿Cuándo programamos la inspección?"
- "De acuerdo, estoy interesado. ¿Cuál es el siguiente paso?"`;
                        } else {
                            return `${basePrompt}

DIFICULTAD: AVANZADO (Difícil)
PERSONALIDAD:
- Muy ocupado, cínico y difícil de convencer.
- Grado de amabilidad: BAJO.
- Sospechas que esto es una estafa o pérdida de tiempo.
- Interrumpe al vendedor si habla demasiado o se desvía del tema.
- Sé directo: "No te creo" o "Pruébalo".

OBJECIONES FUERTES:
1. "No tengo tiempo para esto."
2. "Esto de la energía es una estafa."
3. "Estoy conforme con mi factura de luz actual."
4. "Quítame de tu lista de llamadas."

IMPORTANTE: Solo acepta si el vendedor:
- Maneja el rechazo profesionalmente (sin ponerse nervioso).
- Genera confianza genuina a pesar de tu resistencia.
- Proporciona valor específico y convincente.

Si lo logra (lo cual es raro), di una de estas frases de éxito y QUÉDATE EN SILENCIO:
- "Bien. Te has ganado mi atención. Cuéntame más."
- "De acuerdo, te doy 2 minutos. Sé breve."`;
                        }
                    } else {
                        basePrompt = `You are a homeowner in ${stateCode}. A ${WHITE_LABEL.industry.toLowerCase()} salesperson is calling you.

Scenario: ${scenario.name}
Description: ${scenario.description}
Briefing: ${scenario.briefing}

IMPORTANT: You are the HOMEOWNER, NOT the salesperson. The user calling you is the salesperson trying to sell you ${WHITE_LABEL.productName.toLowerCase()}.

CRITICAL NEGATIVE CONSTRAINTS:
- You are NOT a ${WHITE_LABEL.industry.toLowerCase()} professional. You are a regular homeowner.
- UNDER NO CIRCUMSTANCES should you identify yourself as a representative of a ${WHITE_LABEL.industry.toLowerCase()} company.
- If the user introduces themselves as a salesperson, YOU MUST respond as the prospective customer.
- Do NOT generate sales pitches. You are the one BEING pitched to.

YOUR CONTEXT:
1. You have a specific objection: "${scenario.opening_line}"
2. You will start the conversation with this objection.
3. Your goal is to see if the salesperson can handle it.`;

                        if (personaName) {
                            basePrompt += `

YOUR PERSONA DETAILS (Make sure to stay strictly in character):
- Name: ${personaName}
- Buyer Type: ${buyerType || "Standard"}
- Emotional State: ${emotionalState || "Skeptical"}
- Objection Style: ${objectionStyle || "Passive"}
- Communication Style: ${commStyle || "Standard"}
- Starting Trust: ${scenario.trustLevel || 50}/100
- Difficulty Rating: ${scenario.difficultyWeight || 5}/10
${escalations ? `- Secondary Objections / Escalations: ${escalations.join(', ')}` : ''}
- Sales Stage: ${stage || "Discovery"}`;
                        }

                        if (difficulty === 'beginner') {
                            return `${basePrompt}

DIFFICULTY: BEGINNER (Easy)
PERSONALITY:
- Friendly and open-minded.
- Agreeableness: HIGH. 
- If the salesperson addresses your concern with logic or value, ACCEPT IT immediately.
- Do NOT be difficult. Do NOT bring up new objections endlessly.
- If they answer your objection well, say: "That makes sense to me. I'd like to hear more." or "Okay, when can you come by?"

Start by stating your objection clearly.

IMPORTANT: When the salesperson explains ${WHITE_LABEL.industry.toLowerCase()} benefits clearly and answers your questions well, respond with ONE of these phrases and STOP TALKING:
- "This sounds great! I'd love to get more information about ${WHITE_LABEL.industry.toLowerCase()}."
- "That makes sense. When can someone come out to assess my home?"
- "Okay, I'm interested. What are the next steps?"

After saying this success phrase, DO NOT continue the conversation. The simulation will end automatically.`;
                        } else if (difficulty === 'intermediate') {
                            return `${basePrompt}

DIFFICULTY: INTERMEDIATE (Medium)
PERSONALITY:
- Skeptical but reasonable.
- Agreeableness: MODERATE.
- You need clear facts and numbers.
- Don't just agree; ask "How does that work?" or "Are you sure?"
- However, if the logic is sound, admit it. "Okay, I see your point."

OBJECTIONS TO RAISE IF NOT ADDRESSED:
1. "Isn't ${WHITE_LABEL.industry.toLowerCase()} really expensive?"
2. "What if I move in a few years?"
3. "I've heard maintenance is a hassle"

IMPORTANT: If the salesperson handles your objections professionally, respond with ONE of these phrases and STOP TALKING:
- "Okay, you've addressed my concerns. I'd like to get a quote."
- "That makes sense. When can we schedule an assessment?"
- "Alright, I'm interested. What's the next step?"

After saying this success phrase, DO NOT continue the conversation. The simulation will end automatically.`;
                        } else { // advanced
                            return `${basePrompt}

DIFFICULTY: ADVANCED (Hard)
PERSONALITY:
- Very busy, cynical, and difficult.
- Agreeableness: LOW.
- You suspect this is a scam or a waste of time.
- Interrupt the salesperson if they are rambling.
- Be blunt: "I don't believe you." or "Prove it."

STRONG OBJECTIONS:
1. "I don't have time for this"
2. "${WHITE_LABEL.industry} is a scam"
3. "I'm happy with my current ${WHITE_LABEL.billName.toLowerCase()}"
4. "Remove me from your list"

IMPORTANT: Only agree if the salesperson:
- Handles rejection professionally (doesn't get flustered)
- Builds genuine rapport despite resistance
- Provides compelling, specific value

If they achieve this (rare), respond with ONE phrase and STOP TALKING:
- "Fine. You've earned my attention. Tell me more."
- "Alright, I'll give you 2 minutes. Make it quick."

After saying this success phrase, DO NOT continue the conversation. The simulation will end automatically.`;
                        }
                    }
                };

                // 2. Get Ephemeral Assistant Config from Backend
                const res = await fetch(`${API_URL}/api/v1/vapi/assistant`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_prompt: getDifficultyPrompt(),
                        voice_id: "21m00Tcm4TlvDq8ikWAM", // Default or from scenario
                        first_message: scenario.opening_line || "Hello? Who is this?"
                    })
                })

                if (!res.ok) throw new Error("Failed to configure assistant")

                const assistantConfig = await res.json()

                // 2. Start Vapi with config
                await vapi.start(assistantConfig)

            } catch (e) {
                console.error(e)
                setCallStatus("disconnected")
                setMessages(prev => [...prev, { role: "system", content: "Could not start voice simulation." }])
            }
        }
    }

    const toggleMute = () => {
        const newMuted = !isMuted
        setIsMuted(newMuted)
        vapi.setMuted(newMuted)
    }



    // Timer State


    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (callStatus === 'connected' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Time's up!
                        handleTimeOut()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [callStatus, timeLeft])

    // Reset timer on retry
    const handleRetry = () => {
        setMode('briefing')
        setMessages([])
        setFeedbackData(null)
        setCallStatus('disconnected')
        setTimeLeft(60)
    }

    const handleTimeOut = () => {
        vapi.stop()
        setCallStatus('disconnected')
        setMode('feedback')

        // Auto-fail feedback
        const timeoutPayload = {
            passed: false,
            score: 0,
            feedback_summary: "Time's Up! You took too long to overcome the objection. In sales, speed and precision matter. Keep your response under 60 seconds.",
            strengths: [],
            improvements: ["Time Management", "Conciseness"],
            suggested_script: "Focus on the '3 Reasons' framework to answer quicker.",
        }
        setFeedbackData(timeoutPayload)

        // Persist timeout debrief
        saveDebrief({
            scenarioId: scenario.id ?? "unknown",
            scenarioName: scenario.name ?? "Unnamed Scenario",
            completedAt: new Date().toISOString(),
            passed: false,
            score: 0,
            feedbackSummary: timeoutPayload.feedback_summary,
            strengths: [],
            improvements: timeoutPayload.improvements,
            suggestedScript: timeoutPayload.suggested_script,
            transcript: messages
                .filter((m) => m.role !== "system")
                .map((m) => ({ role: m.role === "agent" ? "Homeowner" : "You", content: m.content })),
        })
    }

    const handleContinue = () => {
        if (onComplete) {
            onComplete(feedbackData?.score || 0)
        }
    }

    // Format time for display
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatRegenTime = () => {
        if (!lastLifeLostAt || lives >= 3) return null

        const lastLost = new Date(lastLifeLostAt).getTime()
        const now = new Date().getTime()
        const diff = now - lastLost
        const twoHours = 2 * 60 * 60 * 1000
        const timeLeft = Math.max(0, twoHours - diff)

        // Return MM:SS
        const totalSeconds = Math.floor(timeLeft / 1000)
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        // If > 60 mins, show HH:MM
        if (mins > 60) {
            const hours = Math.floor(mins / 60)
            const remainingMins = mins % 60
            return `${hours}h ${remainingMins}m`
        }
        return `${mins}m ${secs}s`
    }

    return (
        <Card className="min-h-[580px] h-[calc(100vh-120px)] md:h-[650px] flex flex-col overflow-hidden shadow-2xl border border-white/10 bg-slate-950 relative">
            {/* Rules Overlay */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6 text-center"
                        >
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-blue-500/10">
                                <Shield className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Mission Rules</h3>
                                <p className="text-slate-400">Review the rules before you start.</p>
                            </div>

                            <div className="grid gap-3 text-left">
                                <div className="bg-slate-800/50 p-3 rounded-lg flex items-center gap-3 border border-white/5">
                                    <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
                                    <div>
                                        <div className="font-bold text-slate-200">3 Lives</div>
                                        <div className="text-xs text-slate-400">Fail a mission, lose a life.</div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-lg flex items-center gap-3 border border-white/5">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <div className="font-bold text-slate-200">Regeneration</div>
                                        <div className="text-xs text-slate-400">+1 Life every 2 hours.</div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-lg flex items-center gap-3 border border-white/5">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    <div>
                                        <div className="font-bold text-slate-200">Time Limit</div>
                                        <div className="text-xs text-slate-400">Beat the timer or fail automatically.</div>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={() => setShowRules(false)} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500">
                                I Understand
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lockout Overlay */}
            {lives <= 0 && !showRules && (
                <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-6">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="relative"
                    >
                        {/* Placeholder for Sad Sun pixel art */}
                        <div className="w-32 h-32 rounded-full bg-yellow-600/20 border-4 border-yellow-600/50 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
                            <div className="text-6xl">😢</div>
                        </div>
                    </motion.div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-red-400">Out of Lives!</h3>
                        <p className="text-slate-400 max-w-xs mx-auto">You've used all your attempts. Take a break and review the training materials.</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Next Life In</span>
                        <div className="font-mono text-2xl text-blue-400 font-bold">{formatRegenTime()}</div>
                    </div>
                </div>
            )}

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                }}>
            </div>

            {/* Header */}
            <CardHeader className="bg-slate-900/80 backdrop-blur-md text-white shadow-lg z-10 border-b border-white/5 p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${callStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></div>
                        <CardTitle className="text-lg flex items-center gap-2 font-display">
                            {mode === 'briefing' ?
                                <span className="text-blue-300 tracking-wide font-bold">MISSION BRIEFING</span> :
                                mode === 'feedback' ?
                                    <span className="text-purple-300 tracking-wide font-bold">MISSION DEBRIEF</span> :
                                    <span className="text-white tracking-wide font-bold">LIVE SIMULATION</span>
                            }
                        </CardTitle>

                        {/* TIMER DISPLAY */}
                        {mode === 'roleplay' && (
                            <div className={`ml-4 px-3 py-1 rounded-md font-mono font-bold text-sm border ${timeLeft <= 10
                                ? 'bg-red-900/50 text-red-400 border-red-500 animate-pulse'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}>
                                {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* LIVES DISPLAY */}
                        <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
                            {[1, 2, 3].map((i) => (
                                <Heart
                                    key={i}
                                    className={`w-4 h-4 transition-all ${i <= lives
                                        ? 'text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                        : 'text-slate-700 fill-slate-800'
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-white/5">
                            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="text-xs font-bold text-yellow-100">{score} XP</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Content Area */}
            {mode === 'briefing' ? (
                /* BRIEFING MODE UI */
                <CardContent className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-lg w-full space-y-6"
                    >
                        {/* Avatar */}
                        <div className="relative mx-auto w-32 h-32">
                            <div className={`absolute inset-0 rounded-full animate-ping opacity-25 bg-gradient-to-r ${
                                scenario.avatarStyle === 'hostile' ? 'from-red-500 to-rose-500' :
                                scenario.avatarStyle === 'analytical' ? 'from-amber-500 to-yellow-500' :
                                scenario.avatarStyle === 'reluctant' ? 'from-teal-500 to-emerald-500' :
                                'from-blue-500 to-indigo-500'
                            }`}></div>
                            <div className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 overflow-hidden bg-gradient-to-br ${getAvatarGradient(scenario.avatarStyle)}`}>
                                {scenario.avatar && !scenario.avatar.includes("placeholder") ? (
                                    <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-2">
                                        <div className="text-4xl font-extrabold tracking-wider">
                                            {getInitials(isSpanish ? (scenario.personaNameEs || scenario.personaNameEn || scenario.name) : (scenario.personaNameEn || scenario.name))}
                                        </div>
                                        {scenario.buyerTypeEn && (
                                            <div className="text-[9px] uppercase font-bold tracking-widest mt-1 opacity-80 leading-none">
                                                {isSpanish ? (scenario.buyerTypeEs || scenario.buyerTypeEn) : scenario.buyerTypeEn}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{scenario?.name}</h2>
                            <p className="text-slate-400 text-sm">{scenario?.description}</p>
                        </div>

                        {/* Persona Dossier Grid */}
                        {(scenario.personaNameEn || scenario.buyerTypeEn) && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left bg-slate-900/60 p-4 rounded-xl border border-white/5 text-xs">
                                <div className="space-y-0.5">
                                    <span className="text-[#64748B] block uppercase tracking-wider font-semibold text-[9px]">{t("Name", "Nombre")}</span>
                                    <span className="text-white font-bold text-sm">
                                        {isSpanish ? (scenario.personaNameEs || scenario.personaNameEn) : (scenario.personaNameEn)}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[#64748B] block uppercase tracking-wider font-semibold text-[9px]">{t("Buyer Profile", "Perfil")}</span>
                                    <span className={`font-bold text-sm ${
                                        scenario.avatarStyle === 'hostile' ? 'text-rose-400' :
                                        scenario.avatarStyle === 'analytical' ? 'text-amber-400' :
                                        scenario.avatarStyle === 'reluctant' ? 'text-teal-400' :
                                        'text-blue-400'
                                    }`}>
                                        {isSpanish ? (scenario.buyerTypeEs || scenario.buyerTypeEn) : (scenario.buyerTypeEn)}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[#64748B] block uppercase tracking-wider font-semibold text-[9px]">{t("Sales Stage", "Etapa de Venta")}</span>
                                    <span className="text-slate-200 font-bold text-sm">
                                        {isSpanish ? (scenario.salesStageEs || scenario.salesStageEn || "Descubrimiento") : (scenario.salesStageEn || "Discovery")}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[#64748B] block uppercase tracking-wider font-semibold text-[9px]">{t("Emotional State", "Estado Emocional")}</span>
                                    <span className="text-slate-200 font-bold text-sm">
                                        {isSpanish ? (scenario.emotionalStateEs || scenario.emotionalStateEn) : (scenario.emotionalStateEn)}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[#64748B] block uppercase tracking-wider font-semibold text-[9px]">{t("Starting Trust", "Confianza Inicial")}</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    (scenario.trustLevel ?? 50) < 40 ? 'bg-red-500' :
                                                    (scenario.trustLevel ?? 50) < 60 ? 'bg-amber-500' :
                                                    'bg-green-500'
                                                }`} 
                                                style={{ width: `${scenario.trustLevel ?? 50}%` }}
                                            />
                                        </div>
                                        <span className="text-slate-200 font-bold text-[10px]">{scenario.trustLevel ?? 50}%</span>
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-[#64748B] block uppercase tracking-wider font-semibold text-[9px]">{t("Objection Level", "Nivel Objeción")}</span>
                                    <span className="text-slate-200 font-bold text-sm">
                                        {scenario.difficultyWeight ?? 5}/10
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 text-left shadow-xl relative overflow-hidden space-y-4">
                            {scenario.objectionStyleEn && (
                                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                                    <div>
                                        <span className="text-[#64748B] block uppercase tracking-wider font-semibold text-[9px] mb-0.5">{t("Objection Style", "Estilo de Objeción")}</span>
                                        <p className="text-slate-300 font-semibold text-xs leading-tight">
                                            {isSpanish ? (scenario.objectionStyleEs || scenario.objectionStyleEn) : scenario.objectionStyleEn}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[#64748B] block uppercase tracking-wider font-semibold text-[9px] mb-0.5">{t("Comm. Style", "Estilo de Comunicación")}</span>
                                        <p className="text-slate-300 font-semibold text-xs leading-tight">
                                            {isSpanish ? (scenario.communicationStyleEs || scenario.communicationStyleEn) : scenario.communicationStyleEn}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-blue-300 text-xs uppercase tracking-widest mb-2">
                                    <Shield className="w-3 h-3" /> {t("Mission Objectives", "Objetivos de la Misión")}
                                </h3>
                                <p className="text-slate-300 leading-relaxed font-medium text-sm">{scenario?.briefing || t("Convince the homeowner to book an appointment.", "Convince al propietario de programar una cita.")}</p>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <h3 className="flex items-center gap-2 font-bold text-indigo-300 text-xs uppercase tracking-widest mb-2">
                                    <Bot className="w-3 h-3" /> {t("Homeowner's Opening Context", "Contexto de Apertura")}
                                </h3>
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-indigo-500/20">
                                    <p className="text-indigo-200 italic font-medium text-sm">
                                        "{scenario?.opening_line || "Hello? Who is this?"}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleStartSimulation}
                            className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-500/25 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl"
                        >
                            <Phone className="w-5 h-5 mr-2" /> {t("Start Voice Call", "Iniciar Llamada de Voz")}
                        </Button>
                    </motion.div>
                </CardContent>
            ) : mode === 'feedback' ? (
                /* FEEDBACK MODE UI */
                <CardContent className="flex-1 overflow-y-auto w-full p-4 space-y-6 scroll-smooth z-10">
                    {isLoadingFeedback ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-blue-300 font-medium animate-pulse">Analyzing Performance...</p>
                        </div>
                    ) : feedbackData ? (
                        <SimulationFeedback
                            passed={feedbackData.passed}
                            score={feedbackData.score}
                            transcript={messages.filter(m => m.role !== 'system').map(m => ({
                                role: m.role === 'agent' ? 'Homeowner' : 'You',
                                content: m.content
                            }))}
                            strengths={feedbackData.pros || feedbackData.strengths}
                            improvements={feedbackData.cons || feedbackData.improvements}
                            suggestedScript={feedbackData.better_response || feedbackData.suggested_script || feedbackData.suggestedScript}
                            feedbackSummary={feedbackData.summary || feedbackData.feedback_summary}
                            toneRating={feedbackData.tone_rating}
                            toneFeedback={feedbackData.tone_feedback}
                            onRetry={handleRetry}
                            onContinue={handleContinue}
                        />
                    ) : (
                        <div className="text-center text-red-400">
                            <p>Failed to load feedback.</p>
                            <Button onClick={handleRetry} variant="outline" className="mt-4">Back</Button>
                        </div>
                    )}
                </CardContent>
            ) : (
                /* ROLEPLAY MODE UI */
                <>
                    <CardContent className="flex-1 overflow-y-auto w-full p-4 space-y-6 scroll-smooth z-10">
                        {/* Voice 2.0 Visualizer Area */}
                        <div className="flex flex-col items-center justify-center py-8 border-b border-white/5 bg-slate-900/30 -mx-4 -mt-4 mb-4 relative overflow-hidden">
                            {/* Ambient Glow */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full transition-opacity duration-700 ${callStatus === 'connected' ? 'opacity-100' : 'opacity-0'}`} />

                            <div className="relative z-10 flex flex-col items-center gap-6">
                                {/* Avatar Container */}
                                <div className="relative">
                                    {/* Ripple Effect ring */}
                                    {callStatus === 'connected' && (
                                        <>
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute inset-0 rounded-full border border-indigo-500/30"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                                className="absolute inset-0 rounded-full border border-indigo-500/20"
                                            />
                                        </>
                                    )}

                                    <div className={`relative w-28 h-28 rounded-full transition-all duration-500 ${callStatus === 'connected' ? 'shadow-[0_0_40px_rgba(79,70,229,0.4)] ring-4 ring-indigo-500/20' : 'grayscale opacity-60'}`}>
                                        {scenario.avatar && !scenario.avatar.includes("placeholder") ? (
                                            <img
                                                src={scenario.avatar}
                                                className="w-full h-full object-cover rounded-full border-2 border-slate-700/50"
                                                alt={scenario.name}
                                            />
                                        ) : (
                                            <div className={`w-full h-full rounded-full flex flex-col items-center justify-center border-2 border-slate-700/50 bg-gradient-to-br ${getAvatarGradient(scenario.avatarStyle)}`}>
                                                <span className="text-3xl font-extrabold tracking-wider">
                                                    {getInitials(isSpanish ? (scenario.personaNameEs || scenario.personaNameEn || scenario.name) : (scenario.personaNameEn || scenario.name))}
                                                </span>
                                            </div>
                                        )}

                                        {/* Speaking Overlay (Pulsing Glow when volume is high) */}
                                        <motion.div
                                            animate={{ opacity: volumeLevel > 0.05 ? 0.6 : 0 }}
                                            className="absolute inset-0 rounded-full bg-indigo-500 mix-blend-overlay"
                                        />
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-lg ${callStatus === 'connected'
                                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-900/20'
                                        : 'bg-slate-700 border-slate-600 text-slate-400'
                                        }`}>
                                        {callStatus === 'connected' ? 'Live' : 'Offline'}
                                    </div>
                                </div>

                                {/* Audio Waveform Visualizer */}
                                <div className="h-12 flex items-center justify-center gap-1.5 w-64">
                                    {callStatus === 'connected' ? (
                                        // Generate 12 bars for the waveform
                                        Array.from({ length: 12 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                // Animate height based on volume + pseudo-randomness for "wave" look
                                                animate={{
                                                    height: Math.max(4, volumeLevel * 150 * (Math.sin(i) + 1.5) * Math.random()),
                                                    opacity: Math.max(0.3, volumeLevel * 3)
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className="w-1.5 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                            />
                                        ))
                                    ) : (
                                        // Idle State (Flat line)
                                        <div className="w-full h-[1px] bg-slate-700/50 flex items-center justify-center gap-2">
                                            <span className="text-xs text-slate-600 font-mono">WAITING FOR CONNECTION...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Transcript Feed - Hidden during active call */}
                        {callStatus === 'connected' ? (
                            /* Show Audio Visualizer during call */
                            <AudioVisualizer isActive={true} isMuted={isMuted} />
                        ) : (
                            /* Show transcript when call is not active */
                            <AnimatePresence mode="popLayout">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`
                                            max-w-[85%] px-4 py-2 text-sm leading-relaxed rounded-2xl
                                            ${m.role === 'user'
                                                ? 'bg-blue-600/90 text-white rounded-tr-none'
                                                : m.role === 'agent'
                                                    ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                                                    : 'bg-transparent text-slate-500 w-full text-center text-xs' // System
                                            }
                                        `}>
                                            {m.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {/* Partial Transcript */}
                                {partialTranscript && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex w-full justify-end"
                                    >
                                        <div className="max-w-[85%] px-4 py-2 text-sm leading-relaxed rounded-2xl bg-blue-600/30 text-blue-200/70 rounded-tr-none border border-blue-500/30 italic">
                                            {partialTranscript}...
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Controls */}
                    <div className="p-4 border-t border-white/10 bg-slate-900/90 backdrop-blur-md flex justify-center gap-6 z-20">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleMute}
                                disabled={callStatus !== 'connected'}
                                className={`rounded-full h-12 w-12 border ${isMuted ? 'bg-red-900/20 border-red-500/50 text-red-500' : 'border-slate-700 hover:bg-slate-800 text-slate-400'}`}
                            >
                                <Mic className="w-5 h-5" />
                            </Button>

                            <Button
                                onClick={toggleCall}
                                className={`h-16 w-16 rounded-full shadow-xl transition-all hover:scale-105 ${callStatus === 'connected'
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-900/30'
                                    : 'bg-green-600 hover:bg-green-700 shadow-green-900/30'
                                    }`}
                            >
                                {callStatus === 'connected' ? <PhoneOff className="w-8 h-8 text-white" /> : <Phone className="w-8 h-8 text-white" />}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-12 w-12 border border-slate-700 hover:bg-slate-800 text-slate-400"
                            >
                                <BarChart3 className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Finish Mission Button */}
                        {callStatus === 'disconnected' && messages.length > 2 && (
                            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-4 w-auto max-w-[95%] flex justify-center">
                                <Button
                                    onClick={handleFinishMission}
                                    className="bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-900/50 rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-lg border-2 border-green-400/20 whitespace-nowrap"
                                >
                                    {t("Finish Mission & Collect XP", "Finalizar Misión y Cobrar XP")}
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Card>
    )
}
