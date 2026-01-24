"use client"

import { useState, useEffect, useRef } from "react"
import { getApiUrl } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, Loader2, Volume2, Trophy, Flame, Play, BookOpen, Headphones } from "lucide-react"
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
    const recognitionRef = useRef<any>(null)

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

    // Start Roleplay Logic (Click Mic to Start)
    const handleStartMic = () => {
        setMode('roleplay')

        // 1. Play Opening Line
        const initialMsg = scenario?.opening_line || "Ready to start?"
        setMessages([{ role: "agent", content: initialMsg }])
        speakText(initialMsg)

        // 2. Auto-start listening (user is ready)
        // We delay listening slightly so it doesn't pick up the AI
        setTimeout(() => {
            startListening()
        }, 1000)
    }

    // Text-to-Speech Logic
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
            audio.onended = () => {
                setIsSpeaking(false)
                // Re-enable mic after AI finishes? Optional but good UX
            }
            audio.onerror = () => setIsSpeaking(false)
            audio.play()
        } catch (e) {
            console.error(e)
            const utterance = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(utterance)
            setIsSpeaking(false)
        }
    }

    // Speech-to-Text Logic
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Browser does not support Speech API. Try Chrome.")
            return
        }
        if (isListening) return

        setIsListening(true)
        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = language === "en" ? 'en-US' : 'es-MX'

        recognition.onstart = () => {
            setIsListening(true)
        }

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInput(transcript)
            setIsListening(false)
            // Auto-send if high confidence? For now let user confirm or just fill input
        }
        recognition.onerror = (event: any) => {
            console.error("Speech Error", event)
            setIsListening(false)
        }
        recognition.onend = () => setIsListening(false)
        recognition.start()
        recognitionRef.current = recognition
    }

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsListening(false)
        }
    }

    const toggleMic = () => {
        isListening ? stopListening() : startListening()
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

            if (data.critique) {
                const isPass = data.pass_fail === true
                const badge = isPass ? "✅ PASSED" : "❌ NEEDS IMPROVEMENT"
                let improvementMsg = `${badge}\n\nTRANSCRIPT REVIEW: ${data.critique}`

                if (data.better_response && !isPass) {
                    improvementMsg += `\n\n💡 TRY THIS SCRIPT:\n"${data.better_response}"`
                }

                if (isPass && scenario.id === "exam_1") {
                    improvementMsg += `\n\n🏆 CONGRATULATIONS! You are officially certified.\n\n[DOWNLOAD CERTIFICATE](${API_URL}/certificate/${userId})`
                }

                setMessages(prev => [...prev, {
                    role: "system",
                    content: improvementMsg,
                    isCritique: true,
                    isPass: isPass,
                    showCertificate: isPass && scenario.id === "exam_1"
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
        <Card className="h-[600px] flex flex-col overflow-hidden shadow-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
            {/* Header */}
            <CardHeader className="bg-slate-950/50 text-white shadow-lg z-10 border-b border-white/5">
                <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-xl flex items-center gap-2 font-display">
                        {mode === 'briefing' ? <BookOpen className="w-5 h-5 text-blue-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
                        {mode === 'briefing' ? <span className="text-slate-200">Mission Briefing</span> : <span className="text-white">Live Roleplay: {stateCode}</span>}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm font-bold bg-white/5 p-2 rounded-lg border border-white/10">
                        <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-400" /> {score}</span>
                        <span className="flex items-center gap-1"><Flame className={`w-4 h-4 ${streak > 2 ? 'text-orange-400 animate-pulse' : 'text-slate-400'}`} /> {streak}</span>
                    </div>
                </div>
            </CardHeader>

            {/* Content Area */}
            {mode === 'briefing' ? (
                /* BRIEFING MODE UI */
                <CardContent className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl space-y-8 relative z-10"
                    >
                        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <Headphones className="w-12 h-12 text-blue-400" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold text-white tracking-tight">{scenario?.name || "Loading..."}</h2>
                            <p className="text-slate-400 text-lg">{scenario?.description}</p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-left">
                            <h3 className="font-bold text-blue-300 text-xs uppercase tracking-widest mb-3">Mission Objectives</h3>
                            <p className="text-slate-300 leading-relaxed font-medium">{scenario?.briefing?.split('Key Concepts')[0] || scenario?.briefing}</p>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleStartMic}
                                size="lg"
                                className="w-full h-16 text-xl font-bold shadow-xl shadow-blue-900/40 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all bg-blue-600 hover:bg-blue-500 rounded-2xl group border border-blue-400/20"
                            >
                                <Mic className="w-6 h-6 mr-3 text-white group-hover:scale-110 transition-transform" />
                                Tap Mic to Start
                            </Button>
                            <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest animate-pulse">Ai Agent Standing By...</p>
                        </div>
                    </motion.div>
                </CardContent>
            ) : (
                /* ROLEPLAY MODE UI */
                <>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-900/50">
                        <AnimatePresence mode="popLayout">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                                        max-w-[85%] p-4 rounded-2xl shadow-lg relative overflow-hidden backdrop-blur-md border
                                        ${m.role === 'user' ? 'bg-blue-600/90 text-white rounded-br-sm border-blue-500/30' :
                                            m.role === 'agent' ? 'bg-slate-800/90 text-slate-200 rounded-bl-sm border-white/5' :
                                                'bg-amber-900/20 border-amber-500/30 text-amber-200'}
                                    `}>
                                        <p className="text-[10px] font-bold mb-1 opacity-50 uppercase tracking-widest">
                                            {m.role === 'user' ? 'YOU' : m.role === 'system' ? 'COACH' : 'HOMEOWNER (AI)'}
                                        </p>
                                        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-lg font-medium">{m.content}</p>

                                        {m.showCertificate && (
                                            <div className="mt-4">
                                                <a
                                                    href={`${API_URL}/certificate/${userId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center rounded-lg text-sm font-bold bg-yellow-500 hover:bg-yellow-400 text-black h-12 px-6 w-full shadow-lg shadow-yellow-900/20 transition-transform hover:scale-105"
                                                >
                                                    <Trophy className="mr-2 h-4 w-4" />
                                                    Download Certificate
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-3 rounded-lg"><Loader2 className="animate-spin h-5 w-5 text-blue-400" /></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    <div className="p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex gap-3 items-center">
                        <Button
                            variant={isListening ? "destructive" : "secondary"}
                            size="lg"
                            onClick={toggleMic}
                            className={`h-12 w-12 rounded-full transition-all duration-300 shadow-lg ${isListening ? 'bg-red-500/20 text-red-500 ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                        </Button>
                        <Input
                            className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-600 focus:bg-slate-800 h-11 rounded-xl"
                            placeholder={isListening ? "Listening..." : "Type response..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <Button onClick={handleSend} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white h-11 w-11 rounded-xl shrink-0">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            )}
        </Card>
    )
}
