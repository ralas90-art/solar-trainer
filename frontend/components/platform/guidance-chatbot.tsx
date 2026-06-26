"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Loader2, Sparkles, HelpCircle, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  chat_id?: number
  feedback?: "helpful" | "not_helpful"
}

export function GuidanceChatbot() {
  const pathname = usePathname()
  const isTrainingPage = pathname?.includes("/my-training/mod_")
  const { isSpanish } = useLanguage()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const t = (en: string, es: string) => (isSpanish ? es : en)

  // Local Quick-FAQ replies based on language
  const faqReplies: Record<string, { en: string; es: string }> = {
    lives: {
      en: "You have 3 Hearts (lives) maximum. Failing a simulator roleplay subtracts 1 Heart. Lives regenerate automatically at a rate of 1 Heart every 2 hours.",
      es: "Tienes un máximo de 3 Corazones (vidas). Reprobar un juego de rol de simulador resta 1 Corazón. Las vidas se regeneran solas a razón de 1 Corazón cada 2 horas."
    },
    simulator: {
      en: "The AI Simulator evaluates your objection handling using the A.R.T. framework (Acknowledge, Respond, Transition). You must speak or type clearly and get a score of 80+ to pass.",
      es: "El Simulador de IA evalúa tu manejo de objeciones con el marco A.R.T. (Aceptar, Responder, Transicionar). Debes hablar o escribir claro y obtener 80+ puntos para aprobar."
    },
    certificate: {
      en: "To receive your certified PDF certificate, you must complete all Day 1-6 training modules and pass the Module 6 'Final Boss' Exam.",
      es: "Para descargar tu certificado PDF, debes completar todas las lecciones de los Días 1-6 y aprobar el Examen final del Módulo 6."
    },
    kpis: {
      en: "Use the KPI Tracker in the sidebar to log daily activity (doors knocked, proposals shown, contracts signed). This populates your conversion funnel radar HUD.",
      es: "Usa el Registro de KPIs en el menú lateral para ingresar tus actividades diarias (puertas, propuestas, firmas). Esto alimenta tu HUD de conversión de embudo."
    },
    language: {
      en: "You can toggle the language between English (EN) and Spanish (ES) in the Navbar. Toggling translates slides, workbooks, and switches narration voices (Tom V3 / Alberto V3).",
      es: "Puedes alternar el idioma (EN/ES) en el encabezado. Esto traduce las diapositivas, cuadernos y cambia el audio de narración (Tom V3 / Alberto V3) al instante."
    }
  }

  const getContextArea = (path: string | null): string => {
    if (!path) return "general"
    if (path.includes("/ai-simulator")) return "simulator"
    if (path.includes("/my-training")) return "training"
    if (path.includes("/dashboard")) return "dashboard"
    if (path.includes("/settings")) return "settings"
    if (path.includes("/certifications")) return "certifications"
    if (path.includes("/kpis")) return "kpis"
    return "general"
  }

  const quickFaqs = [
    { key: "lives", label: t("Lives & Hearts", "Vidas y Corazones") },
    { key: "simulator", label: t("How Simulator Grades", "Cómo Califica el Simulador") },
    { key: "certificate", label: t("Get Certified", "Obtener Certificación") },
    { key: "kpis", label: t("KPI Tracker Setup", "Rastreador de KPIs") },
    { key: "language", label: t("Spanish Narration Toggles", "Audio en Español") }
  ]

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: t(
          "Hello! I am your SeptiVolt Support Coach. Ask me any question about navigating the trainer, simulation lives, tracking KPIs, or use the quick buttons below!",
          "¡Hola! Soy tu Asesor de Soporte de SeptiVolt. Pregúntame sobre cómo usar el simulador, vidas, registrar tus KPIs, o presiona uno de los botones de abajo."
        )
      }
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpanish])

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Local FAQ click handler with async backend logging
  const handleFaqClick = (key: string, label: string) => {
    const faq = faqReplies[key]
    if (!faq) return

    const userMsgIndex = messages.length
    const assistantMsgIndex = messages.length + 1

    setMessages(prev => [
      ...prev,
      { role: "user", content: label },
      { role: "assistant", content: isSpanish ? faq.es : faq.en }
    ])

    // Concurrently dispatch background logging request to backend to obtain chat_id
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    fetch(`${apiUrl}/api/v1/support/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": user?.token ? `Bearer ${user.token}` : "",
        "X-User-Id": user?.username || ""
      },
      body: JSON.stringify({
        message: label,
        locale: isSpanish ? "es" : "en",
        history: [],
        question_type: "quick_faq",
        context_area: getContextArea(pathname)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to log FAQ")
        return res.json()
      })
      .then(data => {
        if (data.chat_id) {
          setMessages(prev => {
            const next = [...prev]
            if (next[assistantMsgIndex]) {
              next[assistantMsgIndex] = {
                ...next[assistantMsgIndex],
                chat_id: data.chat_id
              }
            }
            return next
          })
        }
      })
      .catch(err => console.error("Quick FAQ logging error:", err))
  }

  // Submit custom text to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue("")
    setIsLoading(true)

    // Add user message to history
    setMessages(prev => [...prev, { role: "user", content: userMessage }])

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${apiUrl}/api/v1/support/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": user?.token ? `Bearer ${user.token}` : "",
          "X-User-Id": user?.username || ""
        },
        body: JSON.stringify({
          message: userMessage,
          locale: isSpanish ? "es" : "en",
          history: messages.map(m => ({ role: m.role, content: m.content })),
          question_type: "ai_custom",
          context_area: getContextArea(pathname)
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to call chat support API")
      }

      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.response, chat_id: data.chat_id }])
    } catch (err: any) {
      console.error("Chatbot error:", err)
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: err.message || t(
            "Sorry, I had trouble reaching the support service. Please check your network and try again.",
            "Lo siento, tuve problemas para conectar con el servicio de soporte. Revisa tu conexión y reintenta."
          )
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle helpful/not_helpful feedback submission
  const handleFeedback = async (chatId: number, value: "helpful" | "not_helpful") => {
    // Optimistically update message rating state in UI
    setMessages(prev =>
      prev.map(m => (m.chat_id === chatId ? { ...m, feedback: value } : m))
    )

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
      const res = await fetch(`${apiUrl}/api/v1/support/chat/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": user?.token ? `Bearer ${user.token}` : "",
          "X-User-Id": user?.username || ""
        },
        body: JSON.stringify({
          chat_id: chatId,
          helpful: value === "helpful"
        })
      })
      if (!res.ok) {
        throw new Error("Feedback request failed")
      }
    } catch (err) {
      console.error("Feedback error:", err)
      // Revert rating state in case of failure
      setMessages(prev =>
        prev.map(m => (m.chat_id === chatId ? { ...m, feedback: undefined } : m))
      )
    }
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed z-50 flex items-center justify-center gap-2 rounded-full lg:rounded-xl bg-[#1A1A1A] hover:bg-[#262626] text-white font-medium text-sm p-4 lg:px-4 lg:py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all cursor-pointer border border-[#FF5722]/30 ${
          isTrainingPage
            ? "bottom-20 right-24 lg:bottom-24 lg:right-52"
            : "bottom-6 right-24 lg:bottom-8 lg:right-52"
        }`}
        aria-label={t("Help Chatbot", "Chat de Ayuda")}
      >
        <MessageSquare className="h-5 w-5 lg:h-4 lg:w-4 text-[#FF5722]" />
        <span className="hidden lg:inline">{t("AI Coach", "Asesor IA")}</span>
      </motion.button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md bg-[#1A1A1A] border-l border-white/10 h-full flex flex-col shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#121212]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <Sparkles className="h-4 w-4 text-[#FF5722]" />
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    {t("SeptiVolt AI Assistant", "Asistente SeptiVolt IA")}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212]/50"
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#FF5722] text-white rounded-tr-none shadow-lg shadow-[#FF5722]/10"
                          : "bg-white/5 border border-white/5 text-slate-300 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {/* Thumbs helpfulness feedback buttons */}
                    {msg.role === "assistant" && msg.chat_id && (
                      <div className="flex items-center gap-1.5 mt-1 px-1 text-xs">
                        {msg.feedback ? (
                          <span className="text-[10px] text-slate-500 italic">
                            {msg.feedback === "helpful" ? t("✓ Helpful", "✓ Útil") : t("✗ Not helpful", "✗ No útil")}
                          </span>
                        ) : (
                          <>
                            <span className="text-[10px] text-[#64748B]">{t("Was this helpful?", "¿Fue útil?")}</span>
                            <button
                              onClick={() => handleFeedback(msg.chat_id!, "helpful")}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-green-400 transition-colors cursor-pointer"
                              title={t("Helpful", "Útil")}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.chat_id!, "not_helpful")}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title={t("Not helpful", "No útil")}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FF5722]" />
                      {t("Thinking...", "Pensando...")}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick FAQs */}
              <div className="p-4 border-t border-white/5 bg-[#121212]/50 space-y-2">
                <p className="text-[10px] font-hud uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  {t("Quick Guidance Prompts", "Preguntas Frecuentes")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickFaqs.map((faq) => (
                    <button
                      key={faq.key}
                      onClick={() => handleFaqClick(faq.key, faq.label)}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:border-[#FF5722]/30 hover:text-white transition-all cursor-pointer"
                    >
                      {faq.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input Form */}
              <form 
                onSubmit={handleSubmit}
                className="p-4 border-t border-white/5 bg-[#1A1A1A] flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  placeholder={t("Ask me how to use the app...", "Pregúntame cómo usar la app...")}
                  className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#64748B] focus:border-[#FF5722]/40 focus:outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5722] hover:bg-[#FF7A47] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
