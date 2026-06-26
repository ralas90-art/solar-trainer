"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, BookOpen, Sparkles, Trophy, Settings, Heart, Globe, X, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function TraineeWalkthrough() {
  const { isSpanish } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const t = (en: string, es: string) => (isSpanish ? es : en)

  const steps = [
    {
      icon: <Zap className="h-10 w-10 text-[#FF5722]" />,
      title: t("Welcome to SeptiVolt!", "¡Bienvenido a SeptiVolt!"),
      description: t(
        "Welcome to your Solar Sales Trainer command center. Over the next 7 days, you will build elite sales skills using interactive tools. Let's take a quick tour of your workspace.",
        "Bienvenido al centro de control del Acelerador Solar. Durante los próximos 7 días, construirás habilidades de ventas de élite. Hagamos un recorrido rápido."
      )
    },
    {
      icon: <Heart className="h-10 w-10 text-[#FFB300]" />,
      title: t("Trainee HUD & Lives", "HUD de Rep y Vidas"),
      description: t(
        "Your top header displays your XP, current streak, and Heart count. You have 3 lives maximum. Failing a simulation loses 1 Heart, which restores automatically every 2 hours.",
        "Tu encabezado muestra tu XP, racha y Corazones de vida. Tienes un máximo de 3 vidas. Reprobar una simulación descuenta 1 corazón, el cual se regenera cada 2 horas."
      )
    },
    {
      icon: <BookOpen className="h-10 w-10 text-cyan-400" />,
      title: t("Training Curriculum Map", "Mapa del Plan de Estudios"),
      description: t(
        "Navigate the 7-day training progression. Click module cards to view slides, answer reflection workbook prompts, and play high-fidelity English/Spanish narrated audio lessons.",
        "Navega en tu plan de 7 días. Haz clic en las tarjetas de módulos para ver diapositivas, responder reflexiones de trabajo y escuchar narraciones en inglés/español."
      )
    },
    {
      icon: <Sparkles className="h-10 w-10 text-purple-400" />,
      title: t("AI Objection Simulator", "Simulador de Objeciones de IA"),
      description: t(
        "Launch interactive, voice-based simulation roleplays with virtual homeowners. Your rebuttals are graded from 0 to 100 based on the A.R.T. (Acknowledge, Respond, Transition) sales framework.",
        "Inicia juegos de rol de simulación interactiva por voz con propietarios virtuales. Tus respuestas se califican de 0 a 100 según el marco A.R.T. (Aceptar, Responder, Transicionar)."
      )
    },
    {
      icon: <Trophy className="h-10 w-10 text-amber-500" />,
      title: t("KPI Tracker & Rankings", "Registro de KPIs y Rankings"),
      description: t(
        "Log your daily prospecting activities (doors knocked, proposals shown, contracts signed) to visualize your conversion funnel. Rank against peers on the global XP leaderboard.",
        "Registra tus KPIs diarios (puertas, propuestas, cierres) para visualizar tu embudo. Compite con otros representantes en la tabla de clasificación de XP."
      )
    },
    {
      icon: <Globe className="h-10 w-10 text-green-400" />,
      title: t("Settings & Localization", "Ajustes y Localización"),
      description: t(
        "Configure your profile settings and toggle between English and Spanish. Toggling the language updates slide translation texts and switches narration voices instantly.",
        "Configura tu perfil y cambia el idioma del sistema. Alternar el selector traduce las diapositivas y cambia las voces de narración (Tom V3 / Alberto V3) al instante."
      )
    }
  ]

  // Auto-launch check on mount
  useEffect(() => {
    const tourCompleted = localStorage.getItem("septivolt_tour_completed")
    if (tourCompleted !== "true") {
      setIsOpen(true)
    }
  }, [])

  // Listen for custom relaunch event
  useEffect(() => {
    const handleRelaunch = () => {
      setCurrentStep(0)
      setIsOpen(true)
    }
    window.addEventListener("septivolt_relaunch_tour", handleRelaunch)
    return () => window.removeEventListener("septivolt_relaunch_tour", handleRelaunch)
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleFinish = () => {
    localStorage.setItem("septivolt_tour_completed", "true")
    setIsOpen(false)
  }

  const handleSkip = () => {
    handleFinish()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-full max-w-lg bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative brand-glow-subtle space-y-6"
          >
            {/* Skip Button in Top Right */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              aria-label={t("Skip Tour", "Omitir Recorrido")}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Step Content */}
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                {steps[currentStep].icon}
              </div>
              <h3 className="font-display font-black text-2xl text-white tracking-wide">
                {steps[currentStep].title}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Navigation & Progress Dots */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              {/* Back Button */}
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all ${
                  currentStep === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("Back", "Atrás")}
              </button>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? "w-5 bg-[#FF5722] shadow-[0_0_8px_rgba(255,87,34,0.5)]"
                        : "w-2 bg-white/20 hover:bg-white/45"
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next/Finish Button */}
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#FF5722] hover:bg-[#FF7A47] text-white shadow-lg shadow-[#FF5722]/10 transition-all cursor-pointer"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    {t("Finish", "Finalizar")}
                    <Check className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    {t("Next", "Siguiente")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
