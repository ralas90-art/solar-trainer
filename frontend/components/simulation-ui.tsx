"use client"

import { useState, useEffect, useRef } from "react"
import { getApiUrl } from "@/lib/utils"
// @ts-ignore
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Input } from "@/components/ui/input"
import { Mic, Trophy, Flame, User, Bot, Sparkles, Phone, PhoneOff, BarChart3, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import vapi from "@/lib/vapi"

const API_URL = getApiUrl()

interface SimulationProps {
    tenant: any
    stateCode: string
    scenario: any // Full scenario object
    userId: string
    onComplete?: (score: number) => void
}

export function SimulationWindow({ tenant, stateCode, scenario, userId, onComplete }: SimulationProps) {
    const [mode, setMode] = useState<'briefing' | 'roleplay'>('briefing')

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
                        setMessages(prev => [...prev, { role, content: msg.transcript }])
                    }
                }
            }
        }

        const onError = (err: any) => {
            console.error("Vapi Error:", err)
            setCallStatus("disconnected")
            setMessages(prev => [...prev, { role: "system", content: "Connection Error. Please try again." }])
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

    // 3. Auto-scroll
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
                // 1. Get Ephemeral Assistant Config from Backend
                const res = await fetch(`${API_URL}/api/v1/vapi/assistant`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        system_prompt: `You are a homeowner in ${stateCode}. Scenario: ${scenario.name}. Briefing: ${scenario.briefing}. Be skeptical but open.`,
                        voice_id: "21m00Tcm4TlvDq8ikWAM" // Default or from scenario
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

    return (
        <Card className="h-[650px] flex flex-col overflow-hidden shadow-2xl border border-white/10 bg-slate-950 relative">
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
                                <span className="text-white tracking-wide font-bold">LIVE SIMULATION</span>
                            }
                        </CardTitle>
                    </div>

                    <div className="flex items-center gap-3">
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
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75"></div>
                            <div className="relative w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-700 overflow-hidden">
                                <img src={scenario.avatar || "/images/avatar-placeholder.png"} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{scenario?.name}</h2>
                            <p className="text-slate-400">{scenario?.description}</p>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 text-left shadow-xl relative overflow-hidden">
                            <h3 className="flex items-center gap-2 font-bold text-blue-300 text-xs uppercase tracking-widest mb-4">
                                <Shield className="w-3 h-3" /> Mission Objectives
                            </h3>
                            <p className="text-slate-300 leading-relaxed font-medium text-sm">{scenario?.briefing || "Convince the homeowner to book an appointment."}</p>
                        </div>

                        <Button
                            onClick={handleStartSimulation}
                            className="w-full h-14 text-lg font-bold shadow-lg shadow-blue-500/25 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl"
                        >
                            <Phone className="w-5 h-5 mr-2" /> Start Voice Call
                        </Button>
                    </motion.div>
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
                                        <img
                                            src={scenario.avatar || "/images/avatar-placeholder.png"}
                                            className="w-full h-full object-cover rounded-full border-2 border-slate-700/50"
                                        />

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

                        {/* Transcript Feed */}
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
                            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-4">
                                <Button
                                    onClick={() => {
                                        if (onComplete) onComplete(score)
                                    }}
                                    className="bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-900/50 rounded-full px-8 py-6 text-lg border-2 border-green-400/20"
                                >
                                    Finish Mission & Collect XP
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Card>
    )
}
