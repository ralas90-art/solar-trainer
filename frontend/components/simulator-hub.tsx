"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SimulationWindow } from "@/components/simulation-ui"
import { SCENARIOS as FALLBACK_SCENARIOS } from "@/lib/scenarios"
import { useAuth } from "@/context/AuthContext"
import { loadTrainingModuleProgress } from "@/lib/training-module-progress"
import { canBypassTrainingLocks } from "@/lib/auth-bypass"
import { SCENARIO_LOCK_RULES } from "@/lib/scenario-lock-mapping"
import { getLanguagePreference } from "@/lib/i18n"
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
    requiredModule?: string
}


interface SimulatorHubProps {
    tenant: any
    stateCode: string
    onBack: () => void
}

export function SimulatorHub({ tenant, stateCode, onBack }: SimulatorHubProps) {
    const { user } = useAuth()
    const userId = user?.username || "trainee"
    const userTier = user?.planTier || "starter"
    
    const isAdminBypass = canBypassTrainingLocks(user)
    const lang = getLanguagePreference()
    
    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
    const [scenarioProgress, setScenarioProgress] = useState<Record<string, any>>({})
    const [filter, setFilter] = useState<'all' | 'completed' | 'available' | 'locked'>('all')

    useEffect(() => {
        if (userId) {
            fetchScenarios()
            fetchProgress()
        }
    }, [userId])

    const fetchScenarios = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenarios`)
            if (!response.ok) throw new Error("API returned error")
            const data = await response.json()
            setScenarios(data)
        } catch (error) {
            console.warn("Backend unavailable, using local scenario data:", error)
            setScenarios(Object.values(FALLBACK_SCENARIOS))
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
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
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
                    <div className="flex items-center gap-4">
                        {isAdminBypass && (
                            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-lg">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-amber-300 font-hud text-[10px] uppercase tracking-widest leading-none">
                                    {lang === 'es' ? 'Modo Demo: Todos Desbloqueados' : 'Demo Mode: All Simulations Unlocked'}
                                </span>
                            </div>
                        )}
                        <div className="bg-[#FF5722]/10 border border-[#FF5722]/20 px-4 py-2 rounded-lg text-sm">
                            <span className="text-[#FF5722] font-hud text-[10px] uppercase tracking-widest leading-none">Status: {userTier.toUpperCase()}</span>
                        </div>
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
                        className={filter === 'all' ? 'bg-[#FF5722] hover:bg-[#E64A19] text-white' : 'border-slate-700 text-slate-300'}
                    >
                        All Scenarios
                    </Button>
                    <Button
                        variant={filter === 'available' ? 'default' : 'outline'}
                        onClick={() => setFilter('available')}
                        className={filter === 'available' ? 'bg-[#FF5722] hover:bg-[#E64A19] text-white' : 'border-slate-700 text-slate-300'}
                    >
                        Available
                    </Button>
                    <Button
                        variant={filter === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilter('completed')}
                        className={filter === 'completed' ? 'bg-[#FF5722] hover:bg-[#E64A19] text-white' : 'border-slate-700 text-slate-300'}
                    >
                        Completed
                    </Button>
                </div>

                {/* Scenario Grid Grouped by Difficulty */}
                <div className="space-y-12">
                    {['Easy', 'Medium', 'Hard', 'Expert'].map((difficultyLevel) => {
                        const tierScenarios = filteredScenarios.filter(s => s.difficulty.toLowerCase() === difficultyLevel.toLowerCase());
                        if (tierScenarios.length === 0) return null;

                        return (
                            <div key={difficultyLevel}>
                                <h2 className="text-2xl font-display font-black text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                                    {difficultyLevel} Simulations
                                    {difficultyLevel === 'Hard' && userTier === 'starter' && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-sans font-medium tracking-normal normal-case">Requires Growth Plan</span>}
                                    {difficultyLevel === 'Expert' && userTier === 'starter' && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-sans font-medium tracking-normal normal-case">Requires Enterprise</span>}
                                    {difficultyLevel === 'Expert' && userTier === 'growth' && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-sans font-medium tracking-normal normal-case">Requires Enterprise</span>}
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tierScenarios.map((scenario) => {
                                        const status = getScenarioStatus(scenario.id)
                                        const progress = scenarioProgress[scenario.id]
                                        const isAdvanced = ['Hard', 'Expert'].includes(scenario.difficulty)
                                        
                                        // Locking Logic Based on Tiers
                                        const diff = scenario.difficulty.toLowerCase();
                                        let isLockedByPackage = false;
                                        
                                        if (userTier === "starter" && (diff === "hard" || diff === "expert")) {
                                            isLockedByPackage = true;
                                        } else if (userTier === "growth" && diff === "expert") {
                                            isLockedByPackage = true;
                                        }
                                        
                                        // Gating Logic Based on Curriculum Progress
                                        const lockRule = SCENARIO_LOCK_RULES[scenario.id];
                                        let isLockedByModule = false;
                                        if (lockRule) {
                                            const progress = loadTrainingModuleProgress(lockRule.requiredModuleId);
                                            if (!progress) {
                                                isLockedByModule = true;
                                            } else {
                                                const score = progress.quizPercentage ?? (progress.quizCompleted ? 100 : 0);
                                                isLockedByModule = score < lockRule.requiredQuizThreshold;
                                            }
                                        }
                                        
                                        // Admin/Demo-Admin Bypass
                                        const isLockedAll = !isAdminBypass && (isLockedByPackage || isLockedByModule);

                                        return (
                                            <Card
                                                key={scenario.id}
                                                className={`relative bg-slate-900/50 border-slate-800 transition-all group overflow-hidden ${status === 'completed' ? 'border-green-500/30' : ''} ${!isLockedAll ? 'hover:border-[#FF5722]/50 hover:shadow-[0_4px_20px_rgba(255,87,34,0.1)]' : ''}`}
                                            >
                                                {/* Premium Glassmorphic Lock Overlay */}
                                                {isLockedAll && (
                                                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 text-center z-20 border border-white/5">
                                                        <div className="bg-amber-500/10 p-3 rounded-full border border-amber-500/30 mb-3 animate-pulse">
                                                            <Lock className="w-6 h-6 text-[#FFB300]" />
                                                        </div>
                                                        <h4 className="font-display text-sm font-bold text-white mb-2 tracking-wide uppercase">
                                                            {isLockedByPackage ? (lang === 'es' ? "Actualización Requerida" : "Upgrade Required") : (lang === 'es' ? "Simulador Bloqueado" : "Simulator Locked")}
                                                        </h4>
                                                        <p className="text-xs text-slate-300 leading-relaxed mb-4 max-w-[220px]">
                                                            {isLockedByPackage ? (
                                                                lang === 'es' 
                                                                    ? `Este simulador requiere el plan ${diff === 'expert' ? 'Enterprise' : 'Growth'}.` 
                                                                    : `This simulator requires the ${diff === 'expert' ? 'Enterprise' : 'Growth'} Plan.`
                                                            ) : (
                                                                lockRule ? (
                                                                    lang === 'es'
                                                                        ? `Requiere el cuestionario de ${lockRule.unlockLabel.es} (Mínimo: ${lockRule.requiredQuizThreshold}%).`
                                                                        : `Requires ${lockRule.unlockLabel.en} Quiz (Score: ${lockRule.requiredQuizThreshold}%+).`
                                                                ) : (
                                                                    lang === 'es'
                                                                        ? "Requiere completar el módulo de entrenamiento correspondiente."
                                                                        : "Requires completing the training prerequisite."
                                                                )
                                                            )}
                                                        </p>
                                                        
                                                        {lockRule && !isLockedByPackage && (
                                                            <div className="mb-4 text-[11px] text-[#FF5722] font-hud uppercase tracking-wider">
                                                                {lang === 'es' ? "Habilidad:" : "Skill:"} {lockRule.relatedSkill[lang] || lockRule.relatedSkill.en}
                                                            </div>
                                                        )}

                                                        {!isLockedByPackage ? (
                                                            <Button
                                                                onClick={onBack}
                                                                size="sm"
                                                                className="bg-[#FF5722] hover:bg-[#E64A19] hover:shadow-[0_0_15px_rgba(255,87,34,0.5)] text-white text-xs font-semibold px-4 py-2 rounded-lg"
                                                            >
                                                                {lang === 'es' ? "Aprender Habilidad" : "Learn Skill"}
                                                            </Button>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                                                                {lang === 'es' ? "Contactar Administrador" : "Contact Admin"}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <CardHeader className="relative">
                                                    <div className="flex items-start justify-between mb-2">
                                                        {getStatusIcon(scenario.id)}
                                                        <span className={getDifficultyColor(scenario.difficulty)}>
                                                            {scenario.difficulty}
                                                        </span>
                                                    </div>
                                                    <CardTitle className={`text-lg transition-colors text-white group-hover:text-[#FFB300]`}>
                                                        {scenario.name}
                                                        {isAdvanced && (
                                                            <Award className={`inline-block w-4 h-4 ml-2 text-[#FFD54F]`} />
                                                        )}
                                                    </CardTitle>
                                                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">{scenario.description}</p>
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
                                                        className={`w-full transition-all duration-300 bg-[#FF5722] hover:bg-[#E64A19] hover:shadow-[0_0_15px_rgba(255,87,34,0.5)] text-white`}
                                                    >
                                                        <Play className="w-4 h-4 mr-2" />
                                                        {status === 'completed' ? 'Practice Again' : 'Launch Simulator'}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        );
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
