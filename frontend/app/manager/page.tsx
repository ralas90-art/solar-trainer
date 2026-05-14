'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/platform/app-shell';
import { WHITE_LABEL } from '@/lib/white-label.config';
import { getDemoReps, resetDemoData } from '@/lib/demo-data';
import { 
  Users, 
  TrendingUp, 
  Zap, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { WidgetCard, SectionEyebrow, StatCard, NotificationPill } from '@/components/platform/dashboard-widgets';
import Link from 'next/link';

export default function ManagerDashboard() {
  const [reps, setReps] = useState(getDemoReps());
  
  const handleReset = () => {
    if (confirm("Are you sure you want to reset the demo data? All temporary progress will be lost.")) {
      resetDemoData();
      setReps(getDemoReps());
      // Small delay to ensure state updates before visual feedback
      setTimeout(() => alert("Demo data reset successfully."), 100);
    }
  };

  return (
    <AppShell 
      heading={`${WHITE_LABEL.companyName} Command Center`}
      subheading="Sales Performance & Coaching Intelligence"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Demo Status Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 p-6 bg-[#FF5722]/10 border border-[#FF5722]/20 rounded-3xl backdrop-blur-md brand-glow-subtle gap-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#FF5722]/20 flex items-center justify-center border border-[#FF5722]/30">
                    <ShieldCheck className="text-[#FF5722] w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-white font-display font-bold text-lg flex items-center gap-2">
                        Demo Environment Active
                        <span className="text-[10px] bg-[#FF5722] text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Read Only</span>
                    </h2>
                    <p className="text-slate-400 text-sm">Persistence layer is locked. All actions are simulated for the demo experience.</p>
                </div>
            </div>
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF5722]/30 text-white rounded-2xl transition-all font-display font-bold text-sm group"
            >
                <RefreshCw className="w-4 h-4 text-[#FF5722] group-hover:rotate-180 transition-transform duration-500" /> 
                Reset Demo State
            </button>
        </div>

        {/* Executive Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard 
                label="Team Training XP" 
                value="24,850" 
                change="+18% this week" 
                icon={Zap} 
                accent="lime"
            />
            <StatCard 
                label="Managed Seats" 
                value={reps.length.toString()} 
                change="Full availability" 
                icon={Users} 
            />
            <StatCard 
                label="Simulation Mastery" 
                value="82%" 
                change="Above average" 
                icon={TrendingUp} 
                accent="lime"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team Roster (Main Column) */}
            <div className="lg:col-span-2 space-y-8">
                <WidgetCard>
                    <SectionEyebrow label="Team Performance Roster" action="Sort by Score" />
                    <div className="space-y-4 mt-8">
                        {reps.map(rep => (
                            <Link key={rep.id} href={`/dashboard/reps/${rep.id}`} className="block group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#FF5722]/40 hover:bg-white/[0.05] transition-all gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className={`h-14 w-14 rounded-2xl border-2 flex items-center justify-center font-display font-black text-xl shadow-lg
                                            ${rep.status === 'Top Performer' ? 'border-lime-500/50 text-lime-400 bg-lime-500/10' : 
                                              rep.status === 'At Risk' ? 'border-red-500/50 text-red-400 bg-red-500/10' : 
                                              'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'}
                                        `}>
                                            {rep.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-display font-bold text-lg group-hover:text-[#FF5722] transition-colors">{rep.name}</h3>
                                            <p className="text-slate-500 text-xs tracking-wide">{rep.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Level</p>
                                            <p className="text-white font-display font-black text-xl">{rep.performance.level}</p>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Score</p>
                                            <p className="text-white font-display font-black text-xl">{rep.performance.average_score}%</p>
                                        </div>
                                        <div className="min-w-[140px] text-right">
                                            <NotificationPill 
                                                label={rep.status} 
                                                tone={rep.status === 'Top Performer' ? 'lime' : rep.status === 'At Risk' ? 'cyan' : 'slate'} 
                                            />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </WidgetCard>
            </div>

            {/* Coaching Intelligence (Sidebar) */}
            <div className="space-y-8">
                <WidgetCard>
                    <SectionEyebrow label="Coaching Signals" />
                    <div className="mt-6 space-y-4">
                        {reps.filter(r => r.coaching_signals.length > 0).flatMap(r => r.coaching_signals).map((signal, idx) => (
                            <div key={idx} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-4 hover:border-red-500/30 transition-colors">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm leading-tight">{signal.title}</h4>
                                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{signal.description}</p>
                                </div>
                            </div>
                        ))}
                        
                        {reps.filter(r => r.coaching_signals.length > 0).length === 0 && (
                            <div className="py-12 text-center">
                                <ShieldCheck className="w-12 h-12 text-lime-500/20 mx-auto mb-4" />
                                <p className="text-slate-500 text-sm">No critical signals detected.</p>
                            </div>
                        )}
                    </div>
                </WidgetCard>

                <div className="p-6 bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-white/5 rounded-3xl">
                    <h4 className="text-[#FFB300] font-hud text-[11px] uppercase tracking-[0.2em] mb-4">Manager Playbook</h4>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-xs text-slate-300">
                            <span className="text-[#FF5722]">•</span>
                            Review Alex Drift's objection handling sessions.
                        </li>
                        <li className="flex gap-3 text-xs text-slate-300">
                            <span className="text-[#FF5722]">•</span>
                            Congratulate Sarah Sun on hitting Master level.
                        </li>
                        <li className="flex gap-3 text-xs text-slate-300">
                            <span className="text-[#FF5722]">•</span>
                            Intervene with Mark Stall regarding activity lapse.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </AppShell>
  );
}
