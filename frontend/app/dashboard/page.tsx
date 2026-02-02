"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/login-ui"
import { SimulationWindow } from "@/components/simulation-ui"
import { LeaderboardUI } from "@/components/leaderboard-ui"
import { CertificateUI } from "@/components/certificate-ui"
import { DashboardHeader } from "@/components/dashboard-header"
import { TrainingMap } from "@/components/training-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Map, Settings, PlayCircle } from "lucide-react"

import { TrainingContent } from "@/components/training-content"

export default function Dashboard() {
    // Current User State (Auth)
    const [user, setUser] = useState<any>(null)
    const [view, setView] = useState<'dashboard' | 'simulation' | 'content'>('dashboard')
    const [activeModuleId, setActiveModuleId] = useState<string>("")

    // Stats for Certificate & Gamification
    const [stats, setStats] = useState<any>({ total_score: 0, xp: 1250, streak: 3 })

    // Training State
    const [stateProfile, setStateProfile] = useState<any>(null)
    const [userLevel, setUserLevel] = useState<string>("Rookie")
    const [moduleProgress, setModuleProgress] = useState<any>({})

    // Scenarios
    const [scenarios, setScenarios] = useState<any[]>([])
    const [selectedScenario, setSelectedScenario] = useState<string>("d2d_1")

    // Feature Flag for Strict Locking (Option A vs B)
    const STRICT_LOCKING = false

    // Load Scenarios
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        fetch(`${API_URL}/scenarios`)
            .then(res => res.json())
            .then(data => setScenarios(data))
            .catch(err => console.error("Failed to load scenarios", err))
    }, [])

    // Load User
    useEffect(() => {
        const storedUser = localStorage.getItem("solar_user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse stored user", e)
                localStorage.removeItem("solar_user")
            }
        }
    }, [])

    // Fetch User Stats & Progress
    useEffect(() => {
        if (user) {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            fetch(`${API_URL}/user/${user.username}/stats`)
                .then(res => res.json())
                .then(data => {
                    setStats((prev: any) => ({
                        ...prev,
                        ...data,
                        xp: data.xp || 450,
                        streak: data.streak || 3,
                    }))
                    // Parse module_progress JSON
                    try {
                        const progress = typeof data.module_progress === 'string'
                            ? JSON.parse(data.module_progress)
                            : data.module_progress || {}
                        setModuleProgress(progress)
                    } catch (e) {
                        console.error("Failed to parse progress", e)
                    }
                })
                .catch(console.error)
        }
    }, [user])

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
                <AuthForm onLogin={(u) => {
                    localStorage.setItem("solar_user", JSON.stringify(u))
                    setUser(u)
                }} />
            </div>
        )
    }

    const tenant = user.tenant

    const handleLogout = () => {
        localStorage.removeItem("solar_user")
        setUser(null)
        setStateProfile(null)
        setStats({ total_score: 0 })
        setView('dashboard')
    }

    // --- Locking Logic ---
    const getModuleStatus = (day: number, moduleId: string) => {
        if (!STRICT_LOCKING) return "active" // Option B: Open Access

        // Day 1 always open
        if (day === 1) {
            return moduleProgress[moduleId]?.quiz ? "completed" : "active"
        }

        // Check previous day
        const prevDayId = `day_${day - 1}_${getDayName(day - 1)}`
        const prevDayProgress = moduleProgress[prevDayId]

        // Locked if previous day not fully done
        // Hack: Day 1 has no sim, all others do.
        const prevHasSim = (day - 1) !== 1

        const quizDone = prevDayProgress?.quiz
        const simDone = prevHasSim ? prevDayProgress?.sim : true

        if (!quizDone || !simDone) return "locked"

        // Active or Completed
        return moduleProgress[moduleId]?.quiz ? "completed" : "active"
    }

    const getDayName = (d: number) => {
        const map: any = { 1: "foundation", 2: "prospecting", 3: "discovery", 4: "presentation", 5: "closing", 6: "mastery" }
        return map[d]
    }

    const handleModuleSelect = (moduleId: string) => {
        console.log("Selected module:", moduleId)
        setActiveModuleId(moduleId)

        const contentModules = [
            "day_1_foundation", "day_2_prospecting", "day_3_discovery",
            "day_4_presentation", "day_5_closing", "day_6_mastery"
        ]

        if (contentModules.includes(moduleId)) {
            setView('content')
            return
        }

        // Fallback for simulation-only scenarios
        const moduleToScenarioMap: Record<string, string> = {
            "day_2_prospecting": "d2d_1",
            "day_4_presentation": "lease_1",
            "day_5_closing": "eng_1",
            "day_6_mastery": "exam_1"
        }

        const targetScenarioId = moduleToScenarioMap[moduleId]

        if (targetScenarioId) {
            setSelectedScenario(targetScenarioId)
            if (!stateProfile && tenant.allowed_states.length > 0) {
                setStateProfile({ code: tenant.allowed_states[0] })
            }
            setView('simulation')
        }
    }

    const updateProgress = async (moduleId: string, type: 'quiz' | 'sim') => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        try {
            await fetch(`${API_URL}/user/${user.username}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ module_id: moduleId, type, passed: true })
            })
            // Optimistic update
            setModuleProgress((prev: any) => ({
                ...prev,
                [moduleId]: { ...prev[moduleId], [type]: true }
            }))
        } catch (e) {
            console.error("Failed to update progress", e)
        }
    }

    if (view === 'content') {
        return (
            <TrainingContent
                moduleId={activeModuleId}
                onBack={() => setView('dashboard')}
                onComplete={() => {
                    setStats((prev: any) => ({ ...prev, xp: prev.xp + 500 }))
                    updateProgress(activeModuleId, 'quiz')
                    setView('dashboard')
                }}
            />
        )
    }

    return (
        <div className="min-h-screen font-sans text-foreground selection:bg-blue-500/30">
            <DashboardHeader
                user={user}
                tenant={tenant}
                userLevel={userLevel}
                xp={stats.xp}
                streak={stats.streak}
                onLogout={handleLogout}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {view === 'dashboard' ? (
                    <div className="space-y-12">
                        {/* Hero Section */}
                        <div className="relative group rounded-3xl p-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>
                            <div className="relative bg-slate-950 rounded-[22px] overflow-hidden p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">

                                {/* Background Patterns */}
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <div className="flex-1 relative z-10 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest">
                                        <PlayCircle className="w-3 h-3" /> Current Mission
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200">
                                        Day 1: The Foundation
                                    </h2>
                                    <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
                                        Success isn't just about what you know; it's about who you are. Build the foundation of a 7-figure solar professional.
                                    </p>
                                    <Button onClick={() => handleModuleSelect('day_1_foundation')} size="lg" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 font-bold px-8 h-12 rounded-xl border border-blue-400/20">
                                        Resume Training
                                    </Button>
                                </div>

                                {/* Decorative Icon/Graphic */}
                                <div className="hidden md:block w-48 h-48 relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full opacity-20 animate-pulse"></div>
                                    <svg className="w-full h-full text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Training Map */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="pl-2 border-l-4 border-blue-500">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        Training Roadmap
                                    </h3>
                                    <p className="text-slate-400 text-sm">Your journey to certification</p>
                                </div>
                                {/* Calculated Statuses */}
                                <TrainingMap
                                    onSelectModule={handleModuleSelect}
                                    currentDay={2}
                                    moduleStatuses={{
                                        "day_1_foundation": getModuleStatus(1, "day_1_foundation"),
                                        "day_2_prospecting": getModuleStatus(2, "day_2_prospecting"),
                                        "day_3_discovery": getModuleStatus(3, "day_3_discovery"),
                                        "day_4_presentation": getModuleStatus(4, "day_4_presentation"),
                                        "day_5_closing": getModuleStatus(5, "day_5_closing"),
                                        "day_6_mastery": getModuleStatus(6, "day_6_mastery"),
                                    }}
                                />
                            </div>

                            {/* Right: Sidebar Stats */}
                            <div className="space-y-8">
                                <LeaderboardUI />
                                <CertificateUI user={user} score={stats.total_score} tenant={tenant} />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Simulation View */
                    <div className="space-y-6">
                        <Button
                            variant="ghost"
                            onClick={() => setView('dashboard')}
                            className="text-slate-400 hover:text-white hover:bg-white/5 pl-0 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Config Sidebar in Simulation Mode */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="glass-card p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-4 text-slate-300 font-bold text-sm uppercase tracking-wide">
                                        <Map className="w-4 h-4 text-blue-500" /> Territory
                                    </div>
                                    <select
                                        className="w-full p-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                                        value={stateProfile?.code || ""}
                                        onChange={(e) => setStateProfile({ code: e.target.value })}
                                    >
                                        <option value="">-- Choose --</option>
                                        {tenant.allowed_states.map((st: string) => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="glass-card p-4 rounded-xl">
                                    <div className="flex items-center gap-2 mb-4 text-slate-300 font-bold text-sm uppercase tracking-wide">
                                        <Settings className="w-4 h-4 text-purple-500" /> Quick Select
                                    </div>
                                    <ul className="space-y-1">
                                        {scenarios.map((s: any) => (
                                            <li
                                                key={s.id}
                                                onClick={() => setSelectedScenario(s.id)}
                                                className={`p-2.5 rounded-lg cursor-pointer text-sm transition-all border border-transparent ${selectedScenario === s.id ? 'bg-blue-600/20 text-blue-200 border-blue-500/30' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                                            >
                                                <div className="font-medium">{s.name}</div>
                                                <div className="text-[10px] opacity-60 uppercase mt-0.5">{s.difficulty}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Simulation Window */}
                            <div className="md:col-span-3">
                                {stateProfile ? (
                                    <SimulationWindow
                                        tenant={tenant}
                                        stateCode={stateProfile.code}
                                        scenario={scenarios.find(s => s.id === selectedScenario)}
                                        userId={user.username}
                                        onComplete={(score) => {
                                            if (activeModuleId) {
                                                updateProgress(activeModuleId, 'sim')
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-96 glass-card rounded-2xl border-2 border-dashed border-white/10 text-center p-8">
                                        <Map className="w-12 h-12 text-slate-600 mb-4" />
                                        <h3 className="text-xl font-bold text-slate-300">Select a Territory</h3>
                                        <p className="text-slate-500 mt-2">Choose the state you want to train in to begin the simulation.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
