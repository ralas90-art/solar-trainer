"use client"

import { useState, useEffect, useRef } from "react"
import { getApiUrl } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, Loader2, Volume2, Trophy, Flame, Play, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const API_URL = getApiUrl()

interface SimulationProps {
    tenant: any
    stateCode: string
    scenario: any // Full scenario object
    userId: string
}

export function SimulationWindow({ tenant, stateCode, scenario, userId }: SimulationProps) {
    const [mode, setMode] = useState<'briefing' | 'roleplay'>('briefing')

    // Chat State
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [language, setLanguage] = useState("en") // 'en' or 'es'

    // Gamification State
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Reset when scenario changes
    useEffect(() => {
        setMode('briefing') // Always start with briefing
        setMessages([])
        setInput("")
    }, [scenario?.id, stateCode])

    // Load User Stats on Mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
                const res = await fetch(`${url}/user/${userId}/stats`)
                if (res.ok) {
                    const data = await res.json()
                    setScore(data.total_score)
                    setStreak(data.current_streak)
                }
            } catch (e) {
                console.error("Failed to load stats", e)
            }
        }
        fetchStats()
    }, [userId])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Start Roleplay Logic
    const startRoleplay = () => {
        setMode('roleplay')
        // Teacher/AI speaks first!
        const initialMsg = scenario?.opening_line || "Ready to start?"
        setMessages([{ role: "agent", content: initialMsg }])
        speakText(initialMsg)
    }

    // Text-to-Speech Logic
    // Text-to-Speech Logic (ElevenLabs)
    const speakText = async (text: string) => {
        setIsSpeaking(true)
        try {
            const res = await fetch(`${API_URL}/speak`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            })

            if (!res.ok) throw new Error("TTS Failed")

            const blob = await res.blob()
            const audio = new Audio(URL.createObjectURL(blob))
            audio.onended = () => setIsSpeaking(false)
            audio.onerror = () => setIsSpeaking(false)
            audio.play()
        } catch (e) {
            console.error(e)
            // Fallback to browser TTS
            const utterance = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(utterance)
            setIsSpeaking(false)
        }
    }

    // Speech-to-Text Logic
    const toggleMic = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Browser does not support Speech API. Try Chrome.")
            return
        }
        if (isListening) {
            setIsListening(false)
            return
        }
        setIsListening(true)
        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = language === "en" ? 'en-US' : 'es-MX'
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInput(transcript)
            setIsListening(false)
        }
        recognition.onerror = (event: any) => {
            console.error("Speech Error", event)
            setIsListening(false)
        }
        recognition.onend = () => setIsListening(false)
        recognition.start()
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg = { role: "user", content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    tenant_id: tenant.id || "1",
                    state_code: stateCode,
                    scenario_id: scenario?.id,
                    user_message: userMsg.content,
                    language: language
                })
            })

            if (!res.ok) throw new Error("API Error")
            const data = await res.json()

            if (data.score) setScore(prev => prev + data.score)
            if (data.pass_fail) {
                setStreak(prev => prev + 1)
            } else {
                setStreak(0)
            }

            setMessages(prev => [...prev, {
                role: "system",
                content: data.agent_message,
                isCritique: data.pass_fail !== undefined
            }])

            speakText(data.agent_message)

            // ADDED: Combined Critique & Script Suggestion
            if (data.critique) {
                const isPass = data.pass_fail === true
                const badge = isPass ? "✅ PASSED" : "❌ NEEDS IMPROVEMENT"

                let improvementMsg = `${badge}\n\nTRANSCRIPT REVIEW: ${data.critique}`

                if (data.better_response && !isPass) {
                    improvementMsg += `\n\n💡 TRY THIS SCRIPT:\n"${data.better_response}"`
                }

                // ADDED: Certificate Download Link
                if (isPass && scenario.id === "exam_1") {
                    improvementMsg += `\n\n🏆 CONGRATULATIONS! You are officially certified.\n\n[DOWNLOAD CERTIFICATE](${API_URL}/certificate/${userId})`
                }

                setMessages(prev => [...prev, {
                    role: "system",
                    content: improvementMsg,
                    isCritique: true,
                    isPass: isPass,
                    showCertificate: isPass && scenario.id === "exam_1" // Logic flag
                }])
            }

        } catch (err) {
            console.error(err)
            setMessages(prev => [...prev, { role: "system", content: "Error: Could not reach the AI Coach." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="h-[600px] flex flex-col overflow-hidden shadow-2xl border border-white/10 bg-white/80 backdrop-blur-xl">
            {/* Header */}
            <CardHeader className={`${tenant.brand_color || 'bg-slate-900'} text-white shadow-lg z-10 bg-opacity-95 backdrop-blur-md`}>
                <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                        {mode === 'briefing' ? <BookOpen className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        {mode === 'briefing' ? 'Mission Briefing' : `Live Roleplay: ${stateCode}`}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                        <span className="flex items-center gap-1" title="Total Score"><Trophy className="w-4 h-4 text-yellow-400" /> {score}</span>
                        <span className="flex items-center gap-1" title="Current Streak"><Flame className={`w-4 h-4 ${streak > 2 ? 'text-orange-400 animate-pulse' : 'text-slate-300'}`} /> {streak}</span>
                    </div>
                </div>
            </CardHeader>

            {/* Content Area */}
            {mode === 'briefing' ? (
                /* BRIEFING MODE UI */
                <CardContent className="flex-1 overflow-y-auto p-8 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl space-y-6"
                    >
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                            <BookOpen className="w-10 h-10 text-blue-600" />
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900">{scenario?.name || "Loading..."}</h2>

                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/50 text-left">
                            <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wide mb-2">Scenario Goal</h3>
                            <p className="text-slate-800 leading-relaxed mb-6 font-medium">{scenario?.description}</p>

                            {scenario?.briefing && (
                                <>
                                    <div className="h-px bg-slate-200 my-4"></div>
                                    <h3 className="font-bold text-primary text-sm uppercase tracking-wide mb-2">Lesson & Pro-Tips</h3>
                                    <p className="text-slate-600 whitespace-pre-wrap text-sm">{scenario.briefing}</p>
                                </>
                            )}
                        </div>

                        <Button onClick={startRoleplay} size="lg" className="w-full text-lg font-bold shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all bg-primary hover:bg-primary/90">
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            I'm Ready - Start Roleplay
                        </Button>
                    </motion.div>
                </CardContent>
            ) : (
                /* ROLEPLAY MODE UI */
                <>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30 scroll-smooth">
                        <AnimatePresence mode="popLayout">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                                        max-w-[85%] p-4 rounded-2xl shadow-sm relative overflow-hidden backdrop-blur-sm
                                        ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm shadow-blue-500/10' :
                                            m.role === 'agent' ? 'bg-white/90 text-slate-800 border-none shadow-md rounded-bl-sm' :
                                                m.isCritique ? 'bg-amber-50/90 border-l-4 border-amber-500 text-amber-900 shadow-amber-500/10' : 'bg-slate-100/90 text-slate-800'}
                                    `}>
                                        <p className="text-[10px] font-bold mb-1 opacity-60 uppercase tracking-widest">
                                            {m.role === 'user' ? 'YOU' : m.role === 'system' ? 'COACH' : 'HOMEOWNER (AI)'}
                                        </p>
                                        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{m.content}</p>

                                        {/* Render Certificate Button if flag is set */}
                                        {m.showCertificate && (
                                            <div className="mt-4">
                                                <a
                                                    href={`${API_URL}/certificate/${userId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full shadow-lg animate-bounce"
                                                >
                                                    <Trophy className="mr-2 h-4 w-4" />
                                                    Download Official Certificate
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/80 backdrop-blur p-3 rounded-lg border shadow-sm"><Loader2 className="animate-spin h-5 w-5 text-primary" /></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    <div className="p-4 border-t border-white/20 bg-white/60 backdrop-blur-md flex gap-2">
                        <Button
                            variant={isListening ? "destructive" : "outline"}
                            size="icon"
                            onClick={toggleMic}
                            className={`transition-all duration-300 ${isListening ? 'ring-2 ring-red-400 scale-110' : 'bg-white/50 border-slate-300'}`}
                        >
                            <Mic className={`h-4 w-4`} />
                        </Button>
                        <Input
                            className="bg-white/50 border-slate-200 focus:bg-white transition-colors"
                            placeholder="Type your response..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading} className="bg-primary hover:bg-primary/90">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </>
            )}
        </Card>
    )
}
