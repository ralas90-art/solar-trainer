"use client"

import { useState, useEffect } from "react"
import { SimulationWindow } from "@/components/simulation-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Play, Lock, ArrowRight, Trophy } from "lucide-react"
import { getScenariosByIds } from "@/lib/scenarios"

interface SequentialSimulationProps {
    moduleId: string
    scenarioIds: string[]
    userId: string
    tenant: any
    stateCode: string
    onComplete: () => void
    onBack: () => void
}

export function SequentialSimulation({
    moduleId,
    scenarioIds,
    userId,
    tenant,
    stateCode,
    onComplete,
    onBack
}: SequentialSimulationProps) {
    const [scenarios, setScenarios] = useState<any[]>([])
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
    const [completedScenarios, setCompletedScenarios] = useState<string[]>([])
    const [isSimulating, setIsSimulating] = useState(false)
    const [moduleProgress, setModuleProgress] = useState<any>(null)

    useEffect(() => {
        fetchScenarios()
        fetchProgress()
    }, [])

    const fetchScenarios = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenarios`)
            if (!response.ok) throw new Error("API returned error")
            const allScenarios = await response.json()
            // Filter to only scenarios in this module
            const moduleScenarios = allScenarios.filter((s: any) =>
                scenarioIds.includes(s.id)
            )
            // Sort by the order in scenarioIds
            const sortedScenarios = scenarioIds
                .map(id => moduleScenarios.find((s: any) => s.id === id))
                .filter(Boolean)
            setScenarios(sortedScenarios)
        } catch (error) {
            console.warn("Backend unavailable, using local scenario data:", error)
            // Fallback: use embedded frontend scenario data
            const fallbackScenarios = getScenariosByIds(scenarioIds)
            setScenarios(fallbackScenarios)
        }
    }

    const fetchProgress = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/stats`)
            const data = await response.json()
            if (data.module_progress) {
                const progress = JSON.parse(data.module_progress)
                const moduleData = progress[moduleId] || {}
                setModuleProgress(moduleData)

                // Set completed scenarios and current index
                const completed = moduleData.scenarios_completed || []
                setCompletedScenarios(completed)
                setCurrentScenarioIndex(completed.length)
            }
        } catch (error) {
            console.error("Failed to fetch progress:", error)
        }
    }

    const handleScenarioComplete = async (passed: boolean) => {
        if (!passed) {
            // Allow retry
            setIsSimulating(false)
            return
        }

        const currentScenario = scenarios[currentScenarioIndex]
        const newCompleted = [...completedScenarios, currentScenario.id]
        setCompletedScenarios(newCompleted)

        // Update backend progress
        try {
            const updatedProgress = {
                ...moduleProgress,
                scenarios_completed: newCompleted,
                current_scenario_index: currentScenarioIndex + 1,
                all_scenarios_passed: newCompleted.length === scenarioIds.length
            }

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    module_id: moduleId,
                    progress_data: updatedProgress
                })
            })

            setModuleProgress(updatedProgress)
        } catch (error) {
            console.error("Failed to update progress:", error)
        }

        // Check if all scenarios completed
        if (newCompleted.length === scenarioIds.length) {
            setIsSimulating(false)
            // Module simulation complete
            onComplete()
        } else {
            // Move to next scenario
            setCurrentScenarioIndex(currentScenarioIndex + 1)
            setIsSimulating(false)
        }
    }

    const allScenariosCompleted = completedScenarios.length === scenarioIds.length

    if (isSimulating && scenarios[currentScenarioIndex]) {
        return (
            <div className="min-h-screen">
                <SimulationWindow
                    tenant={tenant}
                    stateCode={stateCode}
                    userId={userId}
                    scenario={scenarios[currentScenarioIndex]}
                    onComplete={() => handleScenarioComplete(true)}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-4xl mx-auto px-6 pt-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        {allScenariosCompleted ? "🎉 All Scenarios Complete!" : "AI Simulator"}
                    </h2>
                    <p className="text-slate-400">
                        {allScenariosCompleted
                            ? "You've mastered all scenarios in this module. Complete the quiz to finish!"
                            : `Progress: ${completedScenarios.length} of ${scenarioIds.length} scenarios completed`
                        }
                    </p>
                </div>

                {/* Scenario Progress */}
                <div className="space-y-4 mb-8">
                    {scenarios.map((scenario, index) => {
                        const isCompleted = completedScenarios.includes(scenario.id)
                        const isCurrent = index === currentScenarioIndex
                        const isLocked = index > currentScenarioIndex

                        return (
                            <Card
                                key={scenario.id}
                                className={`
                                    bg-slate-900/50 border-slate-800 transition-all
                                    ${isCompleted ? 'border-green-500/30' : ''}
                                    ${isCurrent ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : ''}
                                    ${isLocked ? 'opacity-50' : ''}
                                `}
                            >
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center
                                            ${isCompleted ? 'bg-green-500/20 text-green-400' : ''}
                                            ${isCurrent ? 'bg-blue-500/20 text-blue-400' : ''}
                                            ${isLocked ? 'bg-slate-800 text-slate-600' : ''}
                                        `}>
                                            {isCompleted && <CheckCircle className="w-6 h-6" />}
                                            {isCurrent && <Play className="w-6 h-6" />}
                                            {isLocked && <Lock className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {scenario.name}
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                {scenario.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isCurrent && !isCompleted && (
                                        <Button
                                            onClick={() => setIsSimulating(true)}
                                            className="bg-blue-600 hover:bg-blue-500 text-white"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Launch
                                        </Button>
                                    )}
                                    {isCompleted && (
                                        <Button
                                            onClick={() => {
                                                setCurrentScenarioIndex(index)
                                                setIsSimulating(true)
                                            }}
                                            variant="outline"
                                            className="border-slate-700 text-slate-300"
                                        >
                                            Practice Again
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="border-slate-700 text-slate-300"
                    >
                        Back to Module
                    </Button>
                    {allScenariosCompleted && (
                        <Button
                            onClick={onComplete}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                        >
                            <Trophy className="w-4 h-4 mr-2" />
                            Continue to Quiz
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
