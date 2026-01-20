"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/login-ui"
import { SimulationWindow } from "@/components/simulation-ui"
import { LeaderboardUI } from "@/components/leaderboard-ui"
import { CertificateUI } from "@/components/certificate-ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Dashboard() {
    // Current User State (Auth)
    const [user, setUser] = useState<any>(null)

    // Stats for Certificate
    const [stats, setStats] = useState<any>({ total_score: 0 })

    // Training State
    const [stateProfile, setStateProfile] = useState<any>(null)
    const [userLevel, setUserLevel] = useState<string>("Beginner")

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
                .then(data => setStats(data))
                .catch(console.error)
        }
    }, [user])

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <AuthForm onLogin={setUser} />
            </div>
        )
    }

    const tenant = user.tenant // Using mock tenant attached during login

    const handleLogout = () => {
        setUser(null)
        setStateProfile(null)
        setStats({ total_score: 0 })
    }

    return (
        <div className="min-h-screen p-8 bg-slate-50">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{tenant.name} Training Portal</h1>
                    <p className="text-slate-500">Welcome, {user.name} | Authorized Territory: {tenant.allowed_states.join(", ")}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="font-medium">Rep Level: </span>
                        <span className="text-blue-600">{userLevel}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar: Config */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Territory</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <label className="block text-sm font-medium mb-2">Select State</label>
                            <select
                                className="w-full p-2 border rounded-md"
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
                        <CardHeader>
                            <CardTitle>Scenarios</CardTitle>
                        </CardHeader>
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

                    <LeaderboardUI />

                    <CertificateUI user={user} score={stats.total_score} tenant={tenant} />
                </div>

                {/* Main: Simulation */}
                <div className="md:col-span-2">
                    {stateProfile ? (
                        <SimulationWindow
                            tenant={tenant}
                            stateCode={stateProfile.code}
                            scenarioId={selectedScenario}
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
    )
}
