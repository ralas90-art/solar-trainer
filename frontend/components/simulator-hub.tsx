"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SimulationWindow } from "@/components/simulation-ui"
import {
    Trophy,
    Lock,
    Play,
    CheckCircle,
    Clock,
    Target,
    Zap,
    Award,
    ArrowLeft
} from "lucide-react"

interface Scenario {
    id: string
    name: string
    description: string
    difficulty: string
    opening_line: string
}

interface SimulatorHubProps {
    userId: string
    tenant: any
    stateCode: string
    onBack: () => void
}

export function SimulatorHub({ userId, tenant, stateCode, onBack }: SimulatorHubProps) {
    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
    const [scenarioProgress, setScenarioProgress] = useState<Record<string, any>>({})
    const [filter, setFilter] = useState<'all' | 'completed' | 'available' | 'locked'>('all')

    useEffect(() => {
        fetchScenarios()
        fetchProgress()
    }, [])

    const fetchScenarios = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenarios`)
            const data = await response.json()
            setScenarios(data)
        } catch (error) {
            console.error("Failed to fetch scenarios:", error)
        }
    }

    const fetchProgress = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/stats`)
            const data = await response.json()
            if (data.scenario_progress) {
                setScenarioProgress(JSON.parse(data.scenario_progress))
            }
        } catch (error) {
            console.error("Failed to fetch progress:", error)
        }
    }

    const getScenarioStatus = (scenarioId: string) => {
        const progress = scenarioProgress[scenarioId]
        if (!progress) return 'available'
        if (progress.passed) return 'completed'
        return 'attempted'
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
            case 'moderate':
                return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'medium':
            case 'hard':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'advanced':
            case 'expert':
                return 'bg-red-500/20 text-red-400 border-red-500/30'
            default:
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        }
    }

    const getStatusIcon = (scenarioId: string) => {
        const status = getScenarioStatus(scenarioId)
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-400" />
            case 'attempted':
                return <Clock className="w-5 h-5 text-yellow-400" />
            case 'available':
                return <Target className="w-5 h-5 text-blue-400" />
            default:
                return <Lock className="w-5 h-5 text-slate-600" />
        }
    }

    const filteredScenarios = scenarios.filter(scenario => {
        const status = getScenarioStatus(scenario.id)
        if (filter === 'all') return true
        if (filter === 'completed') return status === 'completed'
        if (filter === 'available') return status === 'available' || status === 'attempted'
        return true
    })

    const stats = {
        total: scenarios.length,
        completed: scenarios.filter(s => getScenarioStatus(s.id) === 'completed').length,
        available: scenarios.filter(s => getScenarioStatus(s.id) === 'available' || getScenarioStatus(s.id) === 'attempted').length
    }

    if (selectedScenario) {
        return (
            <div className="min-h-screen">
                <SimulationWindow
                    tenant={tenant}
                    stateCode={stateCode}
                    userId={userId}
                    scenario={selectedScenario}
                    onComplete={() => {
                        setSelectedScenario(null)
                        fetchProgress()
                    }}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="text-slate-400 hover:text-white hover:bg-white/5 gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Button>
                        <div className="h-6 w-px bg-slate-700" />
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Zap className="w-6 h-6 text-blue-500" />
                            AI Simulator Hub
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg text-sm">
                            <span className="text-slate-400">Completed:</span>
                            <span className="text-white font-bold ml-2">{stats.completed}/{stats.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-blue-500/20 p-3 rounded-full">
                                <Target className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Total Scenarios</p>
                                <p className="text-3xl font-bold text-white">{stats.total}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-green-500/20 p-3 rounded-full">
                                <Trophy className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Completed</p>
                                <p className="text-3xl font-bold text-white">{stats.completed}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-yellow-500/20 p-3 rounded-full">
                                <Zap className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Available</p>
                                <p className="text-3xl font-bold text-white">{stats.available}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-8">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-500' : 'border-slate-700 text-slate-300'}
                    >
                        All Scenarios
                    </Button>
                    <Button
                        variant={filter === 'available' ? 'default' : 'outline'}
                        onClick={() => setFilter('available')}
                        className={filter === 'available' ? 'bg-blue-600 hover:bg-blue-500' : 'border-slate-700 text-slate-300'}
                    >
                        Available
                    </Button>
                    <Button
                        variant={filter === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilter('completed')}
                        className={filter === 'completed' ? 'bg-blue-600 hover:bg-blue-500' : 'border-slate-700 text-slate-300'}
                    >
                        Completed
                    </Button>
                </div>

                {/* Scenario Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScenarios.map((scenario) => {
                        const status = getScenarioStatus(scenario.id)
                        const progress = scenarioProgress[scenario.id]
                        const isAdvanced = scenario.id.includes('misinformed') ||
                            scenario.id.includes('rushed') ||
                            scenario.id.includes('skeptical') ||
                            scenario.id.includes('grieving') ||
                            scenario.id.includes('hoa') ||
                            scenario.id.includes('procrastinator') ||
                            scenario.id.includes('competitor') ||
                            scenario.id.includes('referral_gatekeeper') ||
                            scenario.id.includes('analytical') ||
                            scenario.id.includes('transition')

                        return (
                            <Card
                                key={scenario.id}
                                className={`bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all group ${status === 'completed' ? 'border-green-500/30' : ''
                                    }`}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        {getStatusIcon(scenario.id)}
                                        <span className={getDifficultyColor(scenario.difficulty)}>
                                            {scenario.difficulty}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                                        {scenario.name}
                                        {isAdvanced && (
                                            <Award className="inline-block w-4 h-4 ml-2 text-amber-500" />
                                        )}
                                    </CardTitle>
                                    <p className="text-sm text-slate-400 mt-2">{scenario.description}</p>
                                </CardHeader>
                                <CardContent>
                                    {progress && (
                                        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-400">Best Score:</span>
                                                <span className="text-white font-bold">{progress.best_score || 0}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Attempts:</span>
                                                <span className="text-white font-bold">{progress.attempts || 0}</span>
                                            </div>
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => setSelectedScenario(scenario)}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        {status === 'completed' ? 'Practice Again' : 'Launch Simulator'}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {filteredScenarios.length === 0 && (
                    <div className="text-center py-20">
                        <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 mb-2">No scenarios found</h3>
                        <p className="text-slate-500">Try changing your filter or complete more modules to unlock scenarios.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
