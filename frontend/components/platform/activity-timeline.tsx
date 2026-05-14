"use client"

import { BookOpen, HelpCircle, Mic2, Star, Clock } from "lucide-react"
import { WidgetCard, SectionEyebrow } from "./dashboard-widgets"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"

export interface ActivityEvent {
  type: "lesson_completed" | "quiz_completed" | "simulation_completed" | "perfect_score" | string
  timestamp: string
  moduleId?: string
  moduleName?: string
  score?: number
  xpAwarded?: number
}

interface ActivityTimelineProps {
  events: ActivityEvent[]
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const { t } = useLanguage();

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 10) // Show last 10 activities

  if (sortedEvents.length === 0) {
    return (
      <WidgetCard>
        <SectionEyebrow label={t("activity_history", { en: "Activity History", es: "Historial de Actividad" })} />
        <p className="text-center py-8 text-sm text-slate-500">
          {t("no_activity", { en: "No recent activity recorded.", es: "No se ha registrado actividad reciente." })}
        </p>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard>
      <SectionEyebrow 
        label={t("recent_activity", { en: "Recent Activity", es: "Actividad Reciente" })} 
        action={t("last_10", { en: "Last 10 Actions", es: "Últimas 10 Acciones" })} 
      />
      <div className="mt-6 relative">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-[#FF5722]/50 via-white/5 to-transparent" />
        
        <div className="space-y-6">
          {sortedEvents.map((event, idx) => (
            <div key={idx} className="relative pl-10 group">
              {/* Icon Node */}
              <div className={cn(
                "absolute left-0 top-0 h-8 w-8 rounded-xl flex items-center justify-center border z-10 transition-transform group-hover:scale-110",
                getEventTheme(event.type)
              )}>
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF5722] transition-colors">
                    {formatEventTitle(event, t)}
                  </h4>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {formatTime(event.timestamp)}
                    </span>
                    {event.xpAwarded && (
                      <span className="text-[10px] font-hud text-[#FFB300] mt-1">+{event.xpAwarded} XP</span>
                    )}
                  </div>
                </div>
                
                {event.moduleName && (
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-[0.05em]">
                    {event.moduleName}
                  </p>
                )}
                
                {event.score !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 w-24 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className={cn("h-full", event.score >= 80 ? "bg-green-500" : "bg-yellow-500")} 
                        style={{ width: `${event.score}%` }} 
                      />
                    </div>
                    <span className={cn("text-[10px] font-bold", event.score >= 80 ? "text-green-400" : "text-yellow-400")}>
                      {event.score}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  )
}

function getEventIcon(type: string) {
  switch (type) {
    case 'lesson_completed': return <BookOpen className="h-4 w-4" />
    case 'quiz_completed': return <HelpCircle className="h-4 w-4" />
    case 'simulation_completed': return <Mic2 className="h-4 w-4" />
    case 'perfect_score': return <Star className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

function getEventTheme(type: string) {
  switch (type) {
    case 'lesson_completed': return "bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
    case 'quiz_completed': return "bg-orange-500/10 border-orange-500/20 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]"
    case 'simulation_completed': return "bg-purple-500/10 border-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
    case 'perfect_score': return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
    default: return "bg-white/5 border-white/10 text-slate-400"
  }
}

function formatEventTitle(event: ActivityEvent, t: any) {
  switch (event.type) {
    case 'lesson_completed': return t("evt_lesson", { en: "Lesson Completed", es: "Lección Completada" })
    case 'quiz_completed': return t("evt_quiz", { en: "Quiz Passed", es: "Examen Aprobado" })
    case 'simulation_completed': return t("evt_sim", { en: "Roleplay Finished", es: "Juego de Roles Finalizado" })
    case 'perfect_score': return t("evt_perfect", { en: "Perfect Score Bonus", es: "Bono de Puntuación Perfecta" })
    default: return event.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
