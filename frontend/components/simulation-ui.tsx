"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, Loader2, Volume2, Trophy, Flame } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export function SimulationWindow({ tenant, stateCode, scenarioId, userId }: { tenant: any, stateCode: string, scenarioId: string, userId: string }) {
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [language, setLanguage] = useState("en") // 'en' or 'es'

    // Gamification State
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)

    // Reset chat when scenario changes
    useEffect(() => {
        setMessages([{ role: "agent", content: `(Simulating ${stateCode}): "Start the conversation..."` }])
    }, [scenarioId, stateCode])

    // Load User Stats on Mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
                const res = await fetch(`${API_URL}/user/${userId}/stats`)
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

    // Text-to-Speech Logic
    const speakText = (text: string) => {
        if (!('speechSynthesis' in window)) return

        // Cancel any current speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language === "en" ? 'en-US' : 'es-MX'
        utterance.rate = 1.0 // Normal speed

        // Attempt to pick a decent voice preferably not the default robot if possible
        const voices = window.speechSynthesis.getVoices()

        // Filter by language first
        const langVoices = voices.filter(v => v.lang.startsWith(language === "en" ? 'en' : 'es'))

        // Try to find a "Google" voice or just take the first matching lang voice
        const preferredVoice = langVoices.find(v => v.name.includes("Google")) || langVoices[0]

        if (preferredVoice) utterance.voice = preferredVoice

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
    }

    // Speech-to-Text Logic
    const toggleMic = () => {
        // Basic Browser Speech Recognition Support (Chrome/Edge)
        if (!('webkitSpeechRecognition' in window)) {
            alert("Browser does not support Speech API. Try Chrome.")
            return
        }

        if (isListening) {
            setIsListening(false)
            // Note: The 'end' event would specificially be triggered by the recognition engine
            return
        }

        setIsListening(true)
        // @ts-ignore - legacy webkit support
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

        recognition.onend = () => {
            setIsListening(false)
        }

        recognition.start()
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        // 1. Add User Message
        const userMsg = { role: "user", content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            // 2. Call Backend API
            const res = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    tenant_id: tenant.id || "1",
                    state_code: stateCode,
                    scenario_id: scenarioId,
                    user_message: userMsg.content,
                    language: language
                })
            })

            if (!res.ok) throw new Error("API Error")

            const data = await res.json()

            // Update Score & Streak
            if (data.score) {
                setScore(prev => prev + data.score)
            }
            if (data.pass_fail) {
                setStreak(prev => prev + 1)
            } else {
                setStreak(0)
            }

            // 3. Add Agent Response
            setMessages(prev => [...prev, {
                role: "system",
                content: data.agent_message,
                isCritique: data.pass_fail !== undefined // Show as critique/feedback
            }])

            // 4. Speak the Response
            speakText(data.agent_message)

            if (data.critique) {
                setMessages(prev => [...prev, {
                    role: "system",
                    content: `CRITIQUE: ${data.critique}`,
                    isCritique: true
                }])
            }

        } catch (err) {
            console.error(err)
            setMessages(prev => [...prev, { role: "system", content: "Error: Could not reach the AI Coach. Is the backend running locally?" }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className={`${tenant.brand_color || 'bg-blue-600'} text-white rounded-t-lg`}>
                <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-xl">Live Roleplay: {stateCode}</CardTitle>
                    <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                        <span className="flex items-center gap-1" title="Total Score"><Trophy className="w-4 h-4 text-yellow-300" /> {score}</span>
                        <span className="flex items-center gap-1" title="Current Streak"><Flame className={`w-4 h-4 ${streak > 2 ? 'text-orange-400 animate-pulse' : 'text-slate-300'}`} /> {streak}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs opacity-80 flex items-center gap-2">
                        {isSpeaking && <Volume2 className="animate-pulse w-4 h-4" />}
                        {isSpeaking ? "Speaking..." : "Ready"}
                    </span>
                    <select
                        className="bg-white/20 text-xs border-none rounded px-2 py-1 text-white cursor-pointer hover:bg-white/30 transition-colors"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="en" className="text-black">🇬🇧 English</option>
                        <option value="es" className="text-black">🇲🇽 Español</option>
                    </select>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
              max-w-[80%] p-3 rounded-lg shadow-sm
              ${m.role === 'user' ? 'bg-blue-600 text-white' :
                                m.isCritique ? 'bg-amber-50 border-l-4 border-amber-500 text-amber-900' : 'bg-slate-100 text-slate-800'}
            `}>
                            <p className="text-xs font-semibold mb-1 opacity-75 uppercase tracking-wide">
                                {m.role === 'user' ? 'YOU' : m.role === 'system' ? 'COACH' : 'PROSPECT'}
                            </p>
                            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 p-3 rounded-lg"><Loader2 className="animate-spin h-5 w-5 text-slate-500" /></div>
                    </div>
                )}
            </CardContent>

            <div className="p-4 border-t bg-slate-50 flex gap-2">
                <Button
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    onClick={toggleMic}
                    className={`transition-all duration-300 ${isListening ? 'ring-2 ring-red-400 scale-110' : ''}`}
                    title="Click to Speak"
                >
                    <Mic className={`h-4 w-4`} />
                </Button>
                <Input
                    className="bg-white"
                    placeholder={isListening ? "Listening..." : "Type your response..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading} className={tenant.brand_color ? tenant.brand_color.replace('bg-', 'hover:bg-').replace('600', '700') : ''}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    )
}
