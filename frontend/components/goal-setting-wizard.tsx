import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ChevronRight, Calculator, Target, X, Save } from "lucide-react"

interface GoalSettingWizardProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    kpiDefinitions: any[]
    onComplete: () => void
}

export function GoalSettingWizard({ open, onOpenChange, kpiDefinitions, onComplete }: GoalSettingWizardProps) {
    const [goals, setGoals] = useState<Record<string, { daily: number, weekly: number, monthly: number, quarterly: number }>>({})
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (kpiDefinitions.length > 0) {
            const initialGoals: any = {}
            kpiDefinitions.forEach(kpi => {
                initialGoals[kpi.id] = {
                    daily: kpi.target_value || 0,
                    weekly: kpi.target_weekly || (kpi.target_value ? kpi.target_value * 5 : 0),
                    monthly: kpi.target_monthly || (kpi.target_value ? kpi.target_value * 21 : 0),
                    quarterly: kpi.target_quarterly || (kpi.target_value ? kpi.target_value * 63 : 0)
                }
            })
            setGoals(initialGoals)
        }
    }, [kpiDefinitions])

    const handleGoalChange = (kpiId: string, period: 'daily' | 'weekly' | 'monthly' | 'quarterly', value: string) => {
        const numValue = parseInt(value) || 0
        setGoals(prev => ({
            ...prev,
            [kpiId]: {
                ...prev[kpiId],
                [period]: numValue
            }
        }))
    }

    const autoCalculate = (kpiId: string) => {
        const daily = goals[kpiId].daily || 0
        if (daily > 0) {
            setGoals(prev => ({
                ...prev,
                [kpiId]: {
                    daily,
                    weekly: daily * 5, // Assuming 5 work days
                    monthly: daily * 21, // Avg work days in month
                    quarterly: daily * 63 // Avg work days in quarter
                }
            }))
        }
    }

    const saveGoals = async () => {
        setLoading(true)
        try {
            // Update each KPI
            const updates = kpiDefinitions.map(kpi => {
                const kpiGoals = goals[kpi.id]
                return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/kpis/definitions/${kpi.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        target_value: kpiGoals.daily,
                        target_weekly: kpiGoals.weekly,
                        target_monthly: kpiGoals.monthly,
                        target_quarterly: kpiGoals.quarterly
                    })
                })
            })

            await Promise.all(updates)
            onComplete()
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to save goals", error)
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-950 border border-slate-800 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Target className="w-6 h-6 text-purple-400" />
                            {step === 1 ? "Set Your Sales Goals" : "Review & Confirm"}
                        </h2>
                        <p className="text-slate-400 mt-1">
                            {step === 1
                                ? "Define your targets for each period. Auto-calculate based on your daily goal."
                                : "Check your targets before finalizing."}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {kpiDefinitions.map((kpi) => (
                            <Card key={kpi.id} className="bg-slate-900/50 border-slate-800">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20">
                                                {kpi.display_order + 1}
                                            </div>
                                            <h3 className="font-semibold text-lg text-slate-200">{kpi.label}</h3>
                                        </div>
                                        {step === 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => autoCalculate(kpi.id)}
                                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20"
                                            >
                                                <Calculator className="w-4 h-4 mr-2" />
                                                Auto-Calculate form Daily
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Daily Goal</Label>
                                            <Input
                                                type="number"
                                                disabled={step === 2}
                                                value={goals[kpi.id]?.daily || ''}
                                                onChange={(e) => handleGoalChange(kpi.id, 'daily', e.target.value)}
                                                className="bg-slate-950 border-slate-700 text-white focus:border-purple-500 font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Weekly Goal</Label>
                                            <Input
                                                type="number"
                                                disabled={step === 2}
                                                value={goals[kpi.id]?.weekly || ''}
                                                onChange={(e) => handleGoalChange(kpi.id, 'weekly', e.target.value)}
                                                className="bg-slate-950 border-slate-700 text-white focus:border-purple-500 font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Monthly Goal</Label>
                                            <Input
                                                type="number"
                                                disabled={step === 2}
                                                value={goals[kpi.id]?.monthly || ''}
                                                onChange={(e) => handleGoalChange(kpi.id, 'monthly', e.target.value)}
                                                className="bg-slate-950 border-slate-700 text-white focus:border-purple-500 font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Quarterly Goal</Label>
                                            <Input
                                                type="number"
                                                disabled={step === 2}
                                                value={goals[kpi.id]?.quarterly || ''}
                                                onChange={(e) => handleGoalChange(kpi.id, 'quarterly', e.target.value)}
                                                className="bg-slate-950 border-slate-700 text-white focus:border-purple-500 font-mono"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex justify-between items-center">
                        {step === 1 ? (
                            <>
                                <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                                <Button onClick={() => setStep(2)} className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Review Goals <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => setStep(1)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                    Back to Edit
                                </Button>
                                <Button onClick={saveGoals} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]">
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    {loading ? "Saving..." : "Confirm & Save"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
