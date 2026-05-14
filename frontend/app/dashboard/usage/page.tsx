'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts'
import { 
  Users, Cpu, DollarSign, Activity, TrendingUp, Sparkles, AlertCircle, Calendar, ArrowRight, User
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAIUsageSummary } from '@/lib/api-client'

interface UsageData {
  monthly_summary: {
    total_simulations: number
    total_tokens: number
    total_cost: number
    active_reps: number
    period: string
  }
  trend: Array<{
    date: string
    simulations: number
    cost: number
  }>
  by_rep: Array<{
    name: string
    simulations: number
    tokens: number
    last_active: string
  }>
  insights: {
    top_performer: string
    least_active: string
  }
}

export default function UsageAnalyticsPage() {
  const [data, setData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartMetric, setChartMetric] = useState<'simulations' | 'cost'>('simulations')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const summary = await getAIUsageSummary()
        setData(summary)
      } catch (err: any) {
        setError(err.message || "Failed to load usage analytics")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 animate-pulse">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl flex items-center gap-4 text-red-400">
          <AlertCircle className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Access Denied or Error</h3>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const kpis = [
    { 
      label: "Total Simulations", 
      value: data.monthly_summary.total_simulations.toLocaleString(), 
      sub: "Success rate: 98%", 
      icon: Activity, 
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    { 
      label: "Total Tokens", 
      value: (data.monthly_summary.total_tokens / 1000).toFixed(1) + "k", 
      sub: "GPT-4o standard", 
      icon: Cpu, 
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    },
    { 
      label: "Estimated Cost", 
      value: `$${data.monthly_summary.total_cost.toFixed(2)}`, 
      sub: "Platform subsidized", 
      icon: DollarSign, 
      color: "text-green-400",
      bg: "bg-green-400/10"
    },
    { 
      label: "Active Reps", 
      value: data.monthly_summary.active_reps.toString(), 
      sub: `Of ${data.by_rep.length} total users`, 
      icon: Users, 
      color: "text-orange-400",
      bg: "bg-orange-400/10"
    },
  ]

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Usage Analytics</h1>
          <p className="text-slate-400 flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            Reporting Period: <span className="text-slate-200 font-medium">{data.monthly_summary.period}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setChartMetric('simulations')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${chartMetric === 'simulations' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Volume
          </button>
          <button 
            onClick={() => setChartMetric('cost')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${chartMetric === 'cost' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Cost
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/40 border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{kpi.value}</h3>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      {kpi.sub}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${kpi.bg}`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Trend Chart */}
      <Card className="bg-slate-900/40 border-white/5 overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            {chartMetric === 'simulations' ? 'Simulations Trend' : 'Estimated Cost Trend'}
          </CardTitle>
          <CardDescription className="text-slate-400">Daily breakdown of AI activity over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  fontSize={12}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartMetric === 'simulations' ? 'simulations' : 'cost'} 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Insights Panel */}
        <div className="space-y-6">
          <Card className="bg-indigo-900/10 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Monthly Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Top Performer</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{data.insights.top_performer}</p>
                    <p className="text-xs text-blue-400 font-medium">Highest engagement</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Least Active</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-slate-300 font-bold">{data.insights.least_active}</p>
                    <p className="text-xs text-slate-500 font-medium">Needs coaching</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-indigo-500 pl-4">
                  "Usage is up 12% compared to last month. {data.insights.top_performer} is leading the team in objection handling mastery."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Usage Table */}
        <Card className="lg:col-span-2 bg-slate-900/40 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Team Performance Activity</CardTitle>
            <CardDescription>AI simulation volume and token consumption per representative</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-slate-500 uppercase tracking-widest font-bold">
                    <th className="pb-4 px-2">Representative</th>
                    <th className="pb-4 px-2">Simulations</th>
                    <th className="pb-4 px-2">Usage (Tokens)</th>
                    <th className="pb-4 px-2">Last Active</th>
                    <th className="pb-4 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.by_rep.length > 0 ? data.by_rep.map((rep, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                            {rep.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-200">{rep.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-white font-bold">{rep.simulations}</td>
                      <td className="py-4 px-2 text-slate-400">{(rep.tokens / 1000).toFixed(1)}k</td>
                      <td className="py-4 px-2 text-slate-500 font-mono text-xs">{rep.last_active}</td>
                      <td className="py-4 px-2 text-right">
                        <Badge variant="outline" className="border-white/10 text-slate-400 bg-slate-950/50">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No team activity recorded yet this month.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-blue-300 transition-colors">
                View Full Report <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
