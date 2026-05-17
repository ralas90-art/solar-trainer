import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, BarChart3, Radio, Crosshair, Flag, ArrowRight, Sparkles, AlertTriangle, Target } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface KPIDefinition {
    id: string
    label: string
    description: string | null
    target_value: number | null
    display_order: number
    is_active: boolean
}

interface KPIAnalyticsData {
    period: string
    kpis: Array<{
        label: string
        total: number
        average: number
        target: number | null
        daily_target?: number | null
        target_weekly?: number | null
        target_monthly?: number | null
        target_quarterly?: number | null
        achievement: number
        trend: 'up' | 'down' | 'stable'
        daily_values: number[]
    }>
    conversion_rates?: {
        signal_to_lock: number
        lock_to_acquisition: number
        signal_to_acquisition: number
    }
}

// ... existing components

// ... imports

interface KPIAnalyticsProps {
    kpiDefinitions: KPIDefinition[]
}

export function KPIAnalytics({ kpiDefinitions }: KPIAnalyticsProps) {
    const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('week')
    const [analytics, setAnalytics] = useState<KPIAnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    const [isGeneratingReport, setIsGeneratingReport] = useState(false)
    const [reportData, setReportData] = useState<any>(null)
    const [showReportModal, setShowReportModal] = useState(false)

    useEffect(() => {
        loadAnalytics()
    }, [period, kpiDefinitions])

    const loadAnalytics = async () => {
        setLoading(true)
        try {
            // Calculate start/end dates based on period
            const now = new Date()
            const end = now.toISOString().split('T')[0]
            let start = new Date()

            if (period === 'week') {
                start.setDate(now.getDate() - 7)
            } else if (period === 'month') {
                start.setDate(now.getDate() - 30)
            } else if (period === 'quarter') {
                start.setDate(now.getDate() - 90)
            }

            const startDate = start.toISOString().split('T')[0]

            const response = await fetch(
                `${API_URL}/api/v1/kpis/analytics?start_date=${startDate}&end_date=${end}&period=${period}`,
                { credentials: 'include' }
            )

            if (response.ok) {
                const data = await response.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error("Failed to load analytics", error)
        } finally {
            setLoading(false)
        }
    }

    const generateReport = async () => {
        setIsGeneratingReport(true)
        try {
            // Hardcode userId for now or get from context if available
            // Assuming this component is used where user context is available or we pass it
            // For now, let's default to "test_user" if not available, but ideally pass it in props
            // The user_id is handled by the backend dependency injection usually, but the request body needs it if we defined it that way.
            // Actually, `KPIReportRequest` has optional `user_id`. The backend `get_user_id` dependency will handle the auth/user context.
            const res = await fetch(`${API_URL}/api/v1/kpis/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    period: period === 'week' ? 'week' : 'month'
                })
            })
            if (res.ok) {
                const data = await res.json()
                setReportData(data)
                setShowReportModal(true)
            }
        } catch (e) {
            console.error("Failed to generate report", e)
        } finally {
            setIsGeneratingReport(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header with Generate Report Button */}
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex gap-2">
                    {/* Period Toggles */}
                    {['week', 'month', 'quarter'].map((p) => (
                        <Button
                            key={p}
                            variant={period === p ? "default" : "outline"}
                            onClick={() => setPeriod(p as any)}
                            className={`capitalize ${period === p ? 'bg-blue-600' : 'border-slate-700 text-slate-400'}`}
                        >
                            {p}
                        </Button>
                    ))}
                </div>

                <Button
                    onClick={generateReport}
                    disabled={isGeneratingReport}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                >
                    {isGeneratingReport ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate AI Report
                        </>
                    )}
                </Button>
            </div>

            {/* Report Modal */}
            <AnimatePresence>
                {showReportModal && reportData && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                        onClick={() => setShowReportModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-indigo-900/20">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="w-5 h-5 text-indigo-400" />
                                        <h2 className="text-xl font-bold text-white">Performance Analysis</h2>
                                    </div>
                                    <p className="text-slate-400 text-sm capitalize">Period: {reportData.period}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white">{reportData.score}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider">Score</div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Summary */}
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Executive Summary</h3>
                                    <p className="text-slate-300 leading-relaxed">{reportData.summary}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Strengths */}
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 text-green-400 font-bold border-b border-white/5 pb-2">
                                            <TrendingUp className="w-4 h-4" /> Top Strengths
                                        </h3>
                                        <ul className="space-y-2">
                                            {reportData.strengths.map((s: string, i: number) => (
                                                <li key={i} className="flex gap-2 text-slate-300 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Weaknesses */}
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 text-red-400 font-bold border-b border-white/5 pb-2">
                                            <AlertTriangle className="w-4 h-4" /> Focus Areas
                                        </h3>
                                        <ul className="space-y-2">
                                            {reportData.weaknesses.map((w: string, i: number) => (
                                                <li key={i} className="flex gap-2 text-slate-300 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                    {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Action Plan */}
                                <div className="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20">
                                    <h3 className="flex items-center gap-2 text-blue-400 font-bold mb-4">
                                        <Target className="w-5 h-5" /> Recommended Action Plan
                                    </h3>
                                    <div className="grid gap-3">
                                        {reportData.action_plan.map((plan: string, i: number) => (
                                            <div key={i} className="flex gap-3 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                                                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {i + 1}
                                                </div>
                                                <span className="text-slate-200 text-sm font-medium">{plan}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button onClick={() => setShowReportModal(false)} className="w-full bg-slate-800 hover:bg-slate-700">
                                    Close Report
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                                Performance Analytics
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                {analytics?.period || 'Loading...'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : analytics && analytics.kpis.length > 0 ? (
                        <div className="space-y-6">
                            {/* KPI Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {analytics.kpis.map((kpi) => {
                                    // Determine correct target based on period
                                    let activeTarget = kpi.target;

                                    // The backend sends 'target' as a processed value, but let's be explicit if we have specific fields in the future
                                    // For now, relies on backend logic in `get_analytics` to send the correct target for the requested period
                                    // OR we calculate it here if the backend sends all targets.
                                    // Ideally, the backend's `get_analytics` should be updated to return the correct `target` dynamically.
                                    // Let's assume the backend endpoint handles the logic to returning a single "target" relevant to the requested period.
                                    // Wait, I didn't update the backend `get_analytics` logic to switch targets yet! 
                                    // I only updated the model. I need to update backend logic too.
                                    // For now, I will blindly display what the backend sends, assuming I will fix the backend logic next.

                                    return (
                                        <Card key={kpi.label} className="bg-slate-950 border-slate-800">
                                            <CardContent className="pt-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-400">{kpi.label}</span>
                                                        {kpi.trend === 'up' ? (
                                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                                        ) : kpi.trend === 'down' ? (
                                                            <TrendingDown className="w-4 h-4 text-red-400" />
                                                        ) : null}
                                                    </div>
                                                    <div className="text-2xl font-bold text-white">{kpi.total}</div>
                                                    <div className="text-sm text-slate-500">
                                                        Avg: {kpi.average}/day
                                                        {activeTarget && ` (Goal: ${activeTarget})`}
                                                    </div>
                                                    {activeTarget && (
                                                        <div className="pt-2">
                                                            <div className="flex justify-between text-xs mb-1 text-slate-400">
                                                                <span>Achievement</span>
                                                                <span className="font-medium text-white">{kpi.achievement}%</span>
                                                            </div>
                                                            <div className="w-full bg-slate-800 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${kpi.achievement >= 100
                                                                        ? 'bg-green-500'
                                                                        : kpi.achievement >= 75
                                                                            ? 'bg-blue-500'
                                                                            : kpi.achievement >= 50
                                                                                ? 'bg-yellow-500'
                                                                                : 'bg-red-500'
                                                                        }`}
                                                                    style={{ width: `${Math.min(kpi.achievement, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Daily Trends Breakdown */}
                            <div className="space-y-6 pt-6 border-t border-slate-800/60">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-purple-400" />
                                        Daily Trends Breakdown
                                    </h3>
                                    <div className="flex gap-4 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <div className="w-2.5 h-2.5 rounded bg-purple-500/80" />
                                            <span>Progress</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <div className="w-2.5 h-2.5 rounded bg-green-500/80" />
                                            <span>Target Met</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {analytics.kpis.map((kpi) => {
                                        const dailyTarget = kpi.daily_target || 0;
                                        const maxValue = Math.max(...kpi.daily_values, dailyTarget, 1);
                                        return (
                                            <div key={kpi.label} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-4 hover:border-slate-700/60 transition-all duration-300">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="font-semibold text-slate-200 text-sm">{kpi.label}</span>
                                                        {dailyTarget > 0 ? (
                                                            <span className="text-[11px] text-slate-500 block mt-0.5">Daily Goal: {dailyTarget}</span>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-500 block mt-0.5">No Daily Goal Set</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[11px] text-slate-400 font-medium block">
                                                            {kpi.daily_values.length} Days Logged
                                                        </span>
                                                        <span className="text-xs text-purple-400 font-bold block mt-0.5">
                                                            Avg: {kpi.average}/day
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="h-24 flex items-end gap-1 pt-2 px-1 relative border-b border-slate-800/60">
                                                    {/* Daily target reference line */}
                                                    {dailyTarget > 0 && (
                                                        <div 
                                                            className="absolute left-0 right-0 border-t border-dashed border-red-500/30 z-0 pointer-events-none"
                                                            style={{ bottom: `${(dailyTarget / maxValue) * 100}%` }}
                                                            title={`Daily Target: ${dailyTarget}`}
                                                        />
                                                    )}
                                                    
                                                    {kpi.daily_values.length > 0 ? (
                                                        kpi.daily_values.map((val, idx) => {
                                                            const pct = (val / maxValue) * 100;
                                                            const meetsTarget = dailyTarget > 0 && val >= dailyTarget;
                                                            return (
                                                                <div key={idx} className="flex-1 group relative h-full flex items-end z-10">
                                                                    <div 
                                                                        className={`w-full rounded-t transition-all duration-300 ${
                                                                            meetsTarget 
                                                                                ? 'bg-gradient-to-t from-green-600/50 to-green-400/80 group-hover:from-green-500 group-hover:to-green-300' 
                                                                                : 'bg-gradient-to-t from-purple-600/40 to-purple-400/70 group-hover:from-purple-500 group-hover:to-purple-300'
                                                                        }`}
                                                                        style={{ height: `${Math.max(pct, 6)}%` }}
                                                                    />
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 border border-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap z-20 font-mono">
                                                                        <div className="font-semibold text-slate-300">Day {idx + 1}</div>
                                                                        <div className="text-white text-xs mt-0.5 font-bold">
                                                                            Logged: <span className="text-purple-300">{val}</span>
                                                                        </div>
                                                                        {dailyTarget > 0 && (
                                                                            <div className="text-[9px] text-slate-400 mt-0.5">
                                                                                Pacing: <span className={meetsTarget ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>
                                                                                    {meetsTarget ? "Target Met!" : `${Math.round((val / dailyTarget) * 100)}%`}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 italic">
                                                            No daily logs recorded in this period.
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex justify-between text-[9px] text-slate-500 font-mono pt-1">
                                                    <span>Start of Period</span>
                                                    <span>Today</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            No analytics data available for this period.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
