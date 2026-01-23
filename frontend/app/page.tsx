"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/login-ui"
import { SimulationWindow } from "@/components/simulation-ui"
import { LeaderboardUI } from "@/components/leaderboard-ui"
import { CertificateUI } from "@/components/certificate-ui"
import { DashboardHeader } from "@/components/dashboard-header"
import { TrainingMap } from "@/components/training-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // Keep for sidebar access
import { ArrowLeft } from "lucide-react"

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

    // Scenarios
    const [scenarios, setScenarios] = useState<any[]>([])
    const [selectedScenario, setSelectedScenario] = useState<string>("d2d_1")

    // Load Scenarios on Mount
    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        fetch(`${API_URL}/scenarios`)
            .then(res => res.json())
            .then(data => setScenarios(data))
            .catch(err => console.error("Failed to load scenarios", err))
    }, [])

    // Fetch User Stats when user is logged in
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
                        streak: data.streak || 3
                    }))
                })
                .catch(console.error)
        }
    }, [user])

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <AuthForm onLogin={setUser} />
            </div>
        )
    }

    const tenant = user.tenant

    const handleLogout = () => {
        setUser(null)
        setStateProfile(null)
        setStats({ total_score: 0 })
        setView('dashboard')
    }

    const handleModuleSelect = (moduleId: string) => {
        console.log("Selected module:", moduleId)
        setActiveModuleId(moduleId)

        // Route all known modules to the Content View first
        const contentModules = [
            "module_1_mindset", "module_2_connection", "module_3_presentation",
            "module_4_objections", "module_5_closing", "module_6_technical",
            "module_7_math", "module_8_referrals", "module_9_territory",
            "module_10_inhome", "module_11_virtual"
        ]

        if (contentModules.includes(moduleId)) {
            setView('content')
            return
        }

        // Fallback for simulation-only scenarios or mismatched IDs
        const moduleToScenarioMap: Record<string, string> = {
            "module_2_connection": "d2d_1",
            "module_4_objections": "lease_1",
            "module_5_closing": "eng_1",
            "module_10_inhome": "exam_1"
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

    if (view === 'content') {
        return (
            <TrainingContent
                moduleId={activeModuleId}
                onBack={() => setView('dashboard')}
                onComplete={() => {
                    setStats((prev: any) => ({ ...prev, xp: prev.xp + 500 }))
                    setView('dashboard')
                }}
            />
        )
    }

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <DashboardHeader
                user={user}
                tenant={tenant}
                userLevel={userLevel}
                xp={stats.xp}
                streak={stats.streak}
                onLogout={handleLogout}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {view === 'dashboard' ? (
                    <div className="space-y-8">
                        {/* Hero Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/2">
                                <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#FFFFFF" d="M45.7,-70.5C58.9,-62.5,69.3,-49.4,75.9,-34.7C82.5,-20,85.4,-3.7,82.4,11.5C79.4,26.7,70.6,40.8,58.9,52.4C47.2,64,32.7,73.1,17.2,76.5C1.7,79.9,-14.8,77.6,-29.4,70.9C-44,64.2,-56.7,53.1,-65.4,39.6C-74.1,26.1,-78.8,10.2,-77.3,-4.9C-75.8,-20,-68.1,-34.3,-56.3,-44.6C-44.5,-54.9,-28.6,-61.2,-13.4,-63.9C1.8,-66.6,17,-65.7,32.5,-78.5L45.7,-70.5Z" transform="translate(100 100)" />
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <div className="uppercase tracking-wider text-sm font-medium text-blue-200 mb-2">Current Mission</div>
                                <h2 className="text-3xl font-bold mb-4">Module 1: The Solar Mindset</h2>
                                <p className="text-blue-100 max-w-2xl mb-6 text-lg">
                                    Success isn't just about what you know; it's about who you are. Build the foundation of a 7-figure solar professional.
                                </p>
                                <Button onClick={() => handleModuleSelect('module_1_mindset')} size="lg" className="bg-white text-blue-700 hover:bg-blue-50 border-0 font-bold">
                                    Start Training
                                </Button>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Training Map */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">🗺️</span>
                                        Training Roadmap
                                    </h3>
                                    <TrainingMap onSelectModule={handleModuleSelect} currentDay={2} />
                                </div>
                            </div>

                            {/* Right: Sidebar Stats */}
                            <div className="space-y-6">
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
                            className="text-slate-500 hover:text-slate-900 pl-0"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Config Sidebar in Simulation Mode */}
                            <div className="md:col-span-1 space-y-6">
                                <Card>
                                    <CardHeader><CardTitle>Territory</CardTitle></CardHeader>
                                    <CardContent>
                                        <select
                                            className="w-full p-2 border rounded-md"
                                            value={stateProfile?.code || ""}
                                            onChange={(e) => setStateProfile({ code: e.target.value })}
                                        >
                                            <option value="">-- Choose --</option>
                                            {tenant.allowed_states.map((st: string) => (
                                                <option key={st} value={st}>{st}</option>
                                            ))}
                                        </select>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle>Scenarios</CardTitle></CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {scenarios.map((s: any) => (
                                                <li
                                                    key={s.id}
                                                    onClick={() => setSelectedScenario(s.id)}
                                                    className={`p-2 rounded cursor-pointer text-sm transition-all ${selectedScenario === s.id ? 'bg-blue-100 text-blue-800 font-bold border-l-4 border-blue-600' : 'hover:bg-slate-100 text-slate-700'}`}
                                                >
                                                    <div className="font-medium">{s.name}</div>
                                                    <div className="text-xs opacity-75">{s.difficulty}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Simulation Window */}
                            <div className="md:col-span-3">
                                {stateProfile ? (
                                    <SimulationWindow
                                        tenant={tenant}
                                        stateCode={stateProfile.code}
                                        scenario={scenarios.find(s => s.id === selectedScenario)}
                                        userId={user.username}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-96 bg-white rounded-xl border-2 border-dashed">
                                        <p className="text-slate-400">Select a State to Start Training</p>
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
