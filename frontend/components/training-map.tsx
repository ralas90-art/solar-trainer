"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Lock, PlayCircle, Gamepad2, Stars, Trophy, Zap, ChevronDown, ChevronRight, Clock, BookOpen, Target, GraduationCap, Compass } from "lucide-react"
import { DAY_MODULES, type DayInfo, type SubModuleInfo } from "@/lib/modules"

interface TrainingMapProps {
    onSelectModule: (moduleId: string) => void
    currentDay: number
    moduleStatuses?: Record<string, "locked" | "active" | "completed">
}

const DAY_ICONS = [Target, Compass, BookOpen, Zap, Trophy, GraduationCap, Stars]

// SeptiVolt — all days use the Volt Cyan/Hyper Lime system with slight hue intensity shifts
const DAY_COLORS = [
    { glow: '0 0 30px rgba(255,87,34,0.15)', border: 'rgba(255,87,34,0.3)', accent: '#FF5722', badgeBg: 'rgba(255,87,34,0.1)' },
    { glow: '0 0 30px rgba(255,87,34,0.15)', border: 'rgba(0,230,255,0.25)', accent: '#00E6F5', badgeBg: 'rgba(0,230,255,0.1)' },
    { glow: '0 0 30px rgba(255,179,0,0.12)', border: 'rgba(255,179,0,0.25)', accent: '#FFB300', badgeBg: 'rgba(255,179,0,0.1)' },
    { glow: '0 0 30px rgba(255,87,34,0.15)', border: 'rgba(255,87,34,0.3)', accent: '#FF5722', badgeBg: 'rgba(255,87,34,0.1)' },
    { glow: '0 0 30px rgba(255,179,0,0.12)', border: 'rgba(255,179,0,0.25)', accent: '#FFB300', badgeBg: 'rgba(255,179,0,0.1)' },
    { glow: '0 0 30px rgba(255,87,34,0.15)', border: 'rgba(255,87,34,0.3)', accent: '#FF5722', badgeBg: 'rgba(255,87,34,0.1)' },
    { glow: '0 0 40px rgba(255,179,0,0.2)', border: 'rgba(255,179,0,0.4)', accent: '#FFB300', badgeBg: 'rgba(255,179,0,0.15)' },
]

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
    content: { label: "Content", color: "badge-solar" },
    activity: { label: "Activity", color: "badge-solar" },
    quiz: { label: "Quiz", color: "badge-amber" },
    simulation: { label: "Simulation", color: "bg-purple-500/10 text-purple-300 border border-purple-500/30 font-hud text-[10px] uppercase tracking-widest px-2 py-0.5 rounded" },
    certification: { label: "Certification", color: "badge-amber" },
    field: { label: "Field", color: "badge-amber" },
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function TrainingMap({ onSelectModule, currentDay }: TrainingMapProps) {
    const [expandedDay, setExpandedDay] = useState<number | null>(null)

    const totalModules = DAY_MODULES.reduce((acc, day) => acc + day.modules.length, 0)
    const simModules = DAY_MODULES.reduce((acc, day) => acc + day.modules.filter(m => m.hasSimulation).length, 0)

    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 py-8"
            >
                {/* SeptiVolt Brand Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-hud text-xs"
                    style={{ background: 'rgba(255,87,34,0.08)', border: '1px solid rgba(255,87,34,0.25)', color: '#FF5722', letterSpacing: '0.12em' }}>
                    <Zap className="w-3.5 h-3.5" style={{ filter: 'drop-shadow(0 0 4px #FF5722)' }} />
                    <span>7-DAY SOLAR SALES ACCELERATOR</span>
                </div>

                <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
                    Training{' '}
                    <span style={{ color: '#FF5722', textShadow: '0 0 30px rgba(255,87,34,0.5)' }}>Roadmap</span>
                </h1>
                <p className="font-body max-w-xl mx-auto text-base" style={{ color: '#94A3B8' }}>
                    Master solar sales in 7 days.
                    <span className="font-hud ml-2" style={{ color: '#FF5722' }}>{totalModules} modules</span>
                    <span style={{ color: '#475569' }}> · </span>
                    <span className="font-hud" style={{ color: '#FFB300' }}>{simModules} AI simulations</span>
                </p>

                {/* Stats Row */}
                <div className="flex justify-center gap-10 pt-2">
                    {[
                        { icon: Trophy, val: '7', label: 'DAYS', color: '#FFB300' },
                        { icon: Zap, val: totalModules.toString(), label: 'MODULES', color: '#FF5722' },
                        { icon: Gamepad2, val: simModules.toString(), label: 'AI SIMS', color: '#FFB300' },
                    ].map(({ icon: Icon, val, label, color }) => (
                        <div key={label} className="text-center">
                            <div className="font-display text-3xl font-black text-white flex items-center justify-center gap-2">
                                <Icon className="w-5 h-5" style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
                                {val}
                            </div>
                            <div className="font-hud text-[9px] mt-1 tracking-widest" style={{ color: '#475569' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Day Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4 max-w-4xl mx-auto px-4"
            >
                {DAY_MODULES.map((day, dayIndex) => {
                    const isExpanded = expandedDay === day.dayNumber
                    const colors = DAY_COLORS[dayIndex % DAY_COLORS.length]
                    const DayIcon = DAY_ICONS[dayIndex % DAY_ICONS.length]
                    const hasSimulations = day.modules.some(m => m.hasSimulation)

                    return (
                        <motion.div variants={item} key={day.dayNumber} className="group">
                            {/* Day Header Card */}
                            <div
                                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                                className="glass-card p-5 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                                style={isExpanded ? {
                                    border: `1px solid ${colors.border}`,
                                    boxShadow: colors.glow,
                                } : {
                                    border: '1px solid rgba(255,87,34,0.08)',
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Day Number Badge — circuit square */}
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg shrink-0"
                                        style={{
                                            background: colors.badgeBg,
                                            border: `1px solid ${colors.border}`,
                                            color: colors.accent,
                                            textShadow: `0 0 12px ${colors.accent}`,
                                        }}>
                                        {day.dayNumber}
                                    </div>

                                    {/* Title & Description */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-display text-lg font-bold text-white truncate">
                                            <span className="font-hud text-xs mr-2" style={{ color: colors.accent }}>DAY {day.dayNumber}</span>
                                            {day.title}
                                        </h3>
                                        <p className="font-body text-sm mt-0.5" style={{ color: '#94A3B8' }}>{day.subtitle}</p>
                                    </div>

                                    {/* Badges */}
                                    <div className="hidden md:flex items-center gap-3 shrink-0">
                                        <span className="font-hud text-xs" style={{ color: '#475569' }}>
                                            {day.modules.length} modules
                                        </span>
                                        {hasSimulations && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-hud text-[10px] uppercase tracking-widest"
                                                style={{ background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.25)', color: '#FFB300' }}>
                                                <Gamepad2 className="w-3 h-3" /> AI Sim
                                            </span>
                                        )}
                                    </div>

                                    {/* Expand chevron */}
                                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                        style={{ color: colors.accent }}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Sub-Module List */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 pb-2 space-y-1.5 pl-4 md:pl-16">
                                            {/* Day Objectives Summary */}
                                            <div className="glass-circuit p-4 rounded-xl mb-3" style={{ borderLeft: '3px solid rgba(255,87,34,0.4)' }}>
                                                <h4 className="font-hud text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#FF5722', letterSpacing: '0.15em' }}>Day {day.dayNumber} Objectives</h4>
                                                <ul className="space-y-1.5">
                                                    {day.objectives.slice(0, 3).map((obj, i) => (
                                                        <li key={i} className="font-body text-sm flex items-start gap-2" style={{ color: '#CBD5E1' }}>
                                                            <span style={{ color: '#FF5722', marginTop: 1 }}>▸</span>
                                                            <span>{obj}</span>
                                                        </li>
                                                    ))}
                                                    {day.objectives.length > 3 && (
                                                        <li className="font-hud text-[10px] pl-4" style={{ color: '#475569' }}>+{day.objectives.length - 3} more objectives</li>
                                                    )}
                                                </ul>
                                            </div>

                                            {/* Module List */}
                                            {day.modules.map((mod, modIndex) => {
                                                const typeBadge = TYPE_BADGES[mod.type] || TYPE_BADGES.content
                                                return (
                                                    <motion.div
                                                        key={mod.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: modIndex * 0.05 }}
                                                        onClick={() => onSelectModule(mod.id)}
                                                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group/mod"
                                                        style={{ borderRadius: '8px' }}
                                                        onMouseEnter={e => {
                                                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,87,34,0.05)'
                                                                ; (e.currentTarget as HTMLElement).style.borderLeft = '2px solid rgba(255,87,34,0.4)'
                                                        }}
                                                        onMouseLeave={e => {
                                                            (e.currentTarget as HTMLElement).style.background = 'transparent'
                                                                ; (e.currentTarget as HTMLElement).style.borderLeft = '2px solid transparent'
                                                        }}
                                                    >
                                                        {/* Module Number */}
                                                        <span className="font-hud text-xs font-bold w-8 shrink-0" style={{ color: colors.accent }}>
                                                            {mod.moduleNumber}
                                                        </span>

                                                        {/* Module Title */}
                                                        <span className="font-body text-sm flex-1 min-w-0 truncate transition-colors" style={{ color: '#94A3B8' }}
                                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94A3B8'}>
                                                            {mod.title}
                                                        </span>

                                                        {/* Badges */}
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            {mod.hasSimulation && (
                                                                <Gamepad2 className="w-3.5 h-3.5" style={{ color: '#FFB300', filter: 'drop-shadow(0 0 4px #FFB300)' }} />
                                                            )}
                                                            <span className={typeBadge.color}>{typeBadge.label}</span>
                                                            <span className="font-hud text-[10px] hidden md:inline" style={{ color: '#475569' }}>
                                                                {mod.duration}
                                                            </span>
                                                            <ChevronRight className="w-4 h-4" style={{ color: '#475569' }} />
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}

                                            {/* Day Homework */}
                                            {day.homework.length > 0 && (
                                                <div className="glass-circuit p-4 rounded-xl mt-3" style={{ borderLeft: '3px solid rgba(255,179,0,0.4)' }}>
                                                    <h4 className="font-hud text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#FFB300', letterSpacing: '0.15em' }}>📚 Homework</h4>
                                                    <ul className="space-y-1.5">
                                                        {day.homework.map((hw, i) => (
                                                            <li key={i} className="font-body text-sm flex items-start gap-2" style={{ color: '#94A3B8' }}>
                                                                <span style={{ color: '#FFB300', marginTop: 1 }}>▸</span>
                                                                <span>{hw}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}
