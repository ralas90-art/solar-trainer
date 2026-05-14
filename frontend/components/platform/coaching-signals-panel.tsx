"use client"

import { AlertCircle, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react"
import { WidgetCard, SectionEyebrow } from "./dashboard-widgets"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"

export interface CoachingSignal {
  type: string
  label: string
  translation_key?: string
  severity: "low" | "medium" | "high"
  trend: "improving" | "stable" | "declining"
  reason: string
  recommendedAction: string
  relatedModuleId?: string
  generatedAt: string
}

interface CoachingSignalsPanelProps {
  signals: CoachingSignal[]
}

export function CoachingSignalsPanel({ signals }: CoachingSignalsPanelProps) {
  const { t } = useLanguage();

  if (signals.length === 0) {
    return (
      <WidgetCard className="bg-green-500/5 border-green-500/10">
        <SectionEyebrow label={t("coaching_intel", { en: "Coaching Intelligence", es: "Inteligencia de Coaching" })} />
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="text-white font-bold mb-1">
            {t("no_flags", { en: "No Red Flags", es: "Sin Alertas" })}
          </h3>
          <p className="text-sm text-slate-400 max-w-[200px]">
            {t("no_flags_desc", { 
              en: "Rep is showing consistent training behavior. No immediate coaching required.", 
              es: "El representante muestra un comportamiento de capacitación constante. No se requiere coaching inmediato." 
            })}
          </p>
        </div>
      </WidgetCard>
    )
  }

  return (
    <WidgetCard>
      <SectionEyebrow 
        label={t("active_signals", { en: "Active Coaching Signals", es: "Señales de Coaching Activas" })} 
        action={t("signals_count", { en: `${signals.length} Signals`, es: `${signals.length} Señales` })} 
      />
      <div className="space-y-4 mt-4">
        {signals.map((signal, idx) => (
          <div 
            key={idx} 
            className={cn(
              "p-4 rounded-2xl border transition-all hover:bg-white/5",
              signal.severity === 'high' ? "bg-red-500/5 border-red-500/20" : 
              signal.severity === 'medium' ? "bg-orange-500/5 border-orange-500/20" : 
              "bg-blue-500/5 border-blue-500/20"
            )}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1">
                <span className={cn(
                  "text-xs font-hud uppercase tracking-widest",
                  signal.severity === 'high' ? "text-red-400" : 
                  signal.severity === 'medium' ? "text-orange-400" : 
                  "text-blue-400"
                )}>
                  {t(signal.translation_key || signal.type, {
                    en: signal.label,
                    es: getSignalLabelEs(signal.type)
                  })}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-tight">
                  {new Date(signal.generatedAt).toLocaleDateString()}
                </span>
              </div>
              <TrendIndicator trend={signal.trend} />
            </div>

            <p className="text-sm text-white font-medium mb-3 leading-relaxed">
              {signal.reason}
            </p>

            <div className="pt-3 border-t border-white/5">
              <div className="flex items-start gap-2 group">
                <div className="mt-1 h-4 w-4 rounded bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center">
                   <ArrowRight className="h-2 w-2 text-[#FF5722]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-1">
                    {t("rec_action", { en: "Recommended Action", es: "Acción Recomendada" })}
                  </p>
                  <p className="text-xs text-[#CBD5E1] group-hover:text-white transition-colors">
                    {t(`rec_${signal.type}`, {
                       en: signal.recommendedAction,
                       es: getRecActionEs(signal.type)
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function TrendIndicator({ trend }: { trend: "improving" | "stable" | "declining" }) {
  const { t } = useLanguage();
  
  const config = {
    improving: {
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
      icon: TrendingUp,
      label: { en: "Improving", es: "Mejorando" }
    },
    declining: {
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      icon: TrendingDown,
      label: { en: "Declining", es: "Declinando" }
    },
    stable: {
      color: "text-slate-400",
      bg: "bg-white/5",
      border: "border-white/10",
      icon: Minus,
      label: { en: "Stable", es: "Estable" }
    }
  }[trend];

  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1 text-[10px] font-hud uppercase tracking-widest px-2 py-0.5 rounded-full border", config.color, config.bg, config.border)}>
      <Icon className="h-3 w-3" />
      {t(`trend_${trend}`, config.label)}
    </div>
  )
}

function getSignalLabelEs(type: string) {
  const map: Record<string, string> = {
    "practice_avoidance": "Evasión de Práctica",
    "low_retention": "Patrón de Baja Retención",
    "falling_behind": "Retraso en el Progreso"
  };
  return map[type] || type;
}

function getRecActionEs(type: string) {
  const map: Record<string, string> = {
    "practice_avoidance": "Asigne un módulo de simulación específico o programe un juego de roles en vivo.",
    "low_retention": "Revise la sección de 'Teoría' de este módulo con el representante.",
    "falling_behind": "Consulte con el representante para asegurarse de que tenga tiempo dedicado a la capacitación."
  };
  return map[type] || "";
}
