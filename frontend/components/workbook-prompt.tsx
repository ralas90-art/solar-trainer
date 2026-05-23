"use client"

import { useState, useEffect, useCallback } from "react"
import { PenLine, CheckSquare, Square, Star, Lightbulb, FileDown, AlertTriangle } from "lucide-react"
import { type WorkbookPrompt } from "@/lib/modules"
import { saveResponse, getResponse } from "@/lib/workbook-storage"
import { EXPERT_PRO_TIPS, DYNAMIC_PLACEHOLDERS } from "@/lib/workbook-expert-tips"
import { jsPDF } from "jspdf"
import { useLanguage } from "@/hooks/use-language"

interface WorkbookPromptBlockProps {
  moduleId: string
  prompts: WorkbookPrompt[]
  onProgressChange?: (summary: { completed: number; total: number; complete: boolean }) => void
}

export function WorkbookPromptBlock({ moduleId, prompts, onProgressChange }: WorkbookPromptBlockProps) {
  const [completionState, setCompletionState] = useState<Record<string, boolean>>({})

  const handlePromptCompletion = useCallback((promptId: string, completed: boolean) => {
    setCompletionState((prev) => ({ ...prev, [promptId]: completed }))
  }, [])

  useEffect(() => {
    const next: Record<string, boolean> = {}
    prompts.forEach((prompt) => {
      const stored = getResponse(moduleId, prompt.id)
      if (prompt.type === "checklist") {
        const selectedCount = Array.isArray(stored) ? stored.length : 0
        const requiredCount = prompt.items?.length ?? 0
        next[prompt.id] = requiredCount > 0 ? selectedCount >= requiredCount : selectedCount > 0
      } else if (prompt.type === "rating") {
        next[prompt.id] = typeof stored === "number" && stored > 0
      } else {
        next[prompt.id] = typeof stored === "string" && stored.trim().length > 0
      }
    })
    setCompletionState(next)
  }, [moduleId, prompts])

  useEffect(() => {
    if (!onProgressChange) return
    const total = prompts.length
    const completed = prompts.filter((prompt) => completionState[prompt.id]).length
    onProgressChange({ completed, total, complete: total > 0 ? completed >= total : true })
  }, [completionState, prompts, onProgressChange])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#FFB300]/35" />
        <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-[#FFE6B3]">
          <PenLine className="h-5 w-5" /> Workbook Practice
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FFB300]/35" />
      </div>
      <p className="text-center text-sm text-[#94A3B8]">
        Responses are saved and can be resumed later.
      </p>

      <div className="space-y-4">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            moduleId={moduleId}
            prompt={prompt}
            onCompletionChange={handlePromptCompletion}
          />
        ))}
      </div>
    </div>
  )
}

function PromptCard({
  moduleId,
  prompt,
  onCompletionChange,
}: {
  moduleId: string
  prompt: WorkbookPrompt
  onCompletionChange: (promptId: string, completed: boolean) => void
}) {
  switch (prompt.type) {
    case "open_response":
    case "fill_blank":
      return <TextPrompt moduleId={moduleId} prompt={prompt} onCompletionChange={onCompletionChange} />
    case "checklist":
      return <ChecklistPrompt moduleId={moduleId} prompt={prompt} onCompletionChange={onCompletionChange} />
    case "rating":
      return <RatingPrompt moduleId={moduleId} prompt={prompt} onCompletionChange={onCompletionChange} />
    default:
      return null
  }
}

function TextPrompt({
  moduleId,
  prompt,
  onCompletionChange,
}: {
  moduleId: string
  prompt: WorkbookPrompt
  onCompletionChange: (promptId: string, completed: boolean) => void
}) {
  const [value, setValue] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = getResponse(moduleId, prompt.id)
    if (typeof stored === "string") {
      setValue(stored)
      onCompletionChange(prompt.id, stored.trim().length > 0)
    } else {
      onCompletionChange(prompt.id, false)
    }
  }, [moduleId, prompt.id, onCompletionChange])

  const handleSave = useCallback(() => {
    saveResponse(moduleId, prompt.id, value)
    onCompletionChange(prompt.id, value.trim().length > 0)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, [moduleId, prompt.id, value, onCompletionChange])

  const isMultiline = prompt.type === "open_response" && (prompt.lines || 3) > 1
  const proTip = EXPERT_PRO_TIPS[prompt.id]
  const customPlaceholder = DYNAMIC_PLACEHOLDERS[prompt.id] || prompt.placeholder

  return (
    <div className="glass-circuit hud-border rounded-xl p-5 space-y-3">
      <label className="block text-sm font-semibold text-white">{prompt.label}</label>
      {isMultiline ? (
        <textarea
          rows={prompt.lines || 3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          placeholder={customPlaceholder || "Type your response here..."}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          placeholder={customPlaceholder || "Your answer..."}
          className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
        />
      )}
      
      {proTip && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200/90 leading-relaxed shadow-[inset_0_0_12px_rgba(245,158,11,0.03)] transition-all duration-300 hover:border-amber-500/35">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400 animate-pulse" />
          <div>
            <span className="font-semibold text-amber-300">Expert Pro Tip: </span>
            {proTip}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg border border-[#FF5722]/25 bg-[#FF5722]/10 px-3 py-1.5 text-xs font-hud uppercase tracking-[0.12em] text-[#FFD54F]"
        >
          Save response
        </button>
        {saved ? <span className="text-xs text-[#FFB300]">Saved</span> : null}
      </div>
    </div>
  )
}

function ChecklistPrompt({
  moduleId,
  prompt,
  onCompletionChange,
}: {
  moduleId: string
  prompt: WorkbookPrompt
  onCompletionChange: (promptId: string, completed: boolean) => void
}) {
  const [checked, setChecked] = useState<string[]>([])
  const requiredCount = prompt.items?.length ?? 0

  const { language } = useLanguage()
  const isEs = language === "es"
  const isPledge = prompt.id === "wb_1_1_3"

  const [printedName, setPrintedName] = useState("")
  const [signature, setSignature] = useState("")
  const [signedDate, setSignedDate] = useState("")
  const [showCompletionMsg, setShowCompletionMsg] = useState(false)
  const [pdfError, setPdfError] = useState(false)

  const uiText = {
    en: {
      printedName: "Printed Name",
      printedNamePlaceholder: "Type your printed name...",
      signature: "Signature",
      signaturePlaceholder: "Type your name to sign...",
      date: "Date",
      downloadButton: "Download Signed Pledge",
      completeMsg: "Pledge signed. Your commitment has been saved for this session.",
      validationError: "Please check all boxes, enter your printed name, and sign to download.",
      fallbackMsg: "We couldn’t generate the signed version. You can download the blank pledge instead.",
      downloadBlank: "Download Blank Pledge (PDF)",
      integrityTitle: "Solar Integrity Creed & Pledge"
    },
    es: {
      printedName: "Nombre Impreso",
      printedNamePlaceholder: "Escribe tu nombre impreso...",
      signature: "Firma",
      signaturePlaceholder: "Escribe tu nombre para firmar...",
      date: "Fecha",
      downloadButton: "Descargar Compromiso Firmado",
      completeMsg: "Compromiso firmado. Su compromiso ha sido guardado para esta sesión.",
      validationError: "Por favor marque todas las casillas, ingrese su nombre impreso y firme para descargar.",
      fallbackMsg: "No pudimos generar la versión firmada. Puede descargar el compromiso en blanco en su lugar.",
      downloadBlank: "Descargar Compromiso en Blanco (PDF)",
      integrityTitle: "Pacto de Integridad y Compromiso"
    }
  }
  const t = isEs ? uiText.es : uiText.en

  // Load pledge state from localStorage on mount
  useEffect(() => {
    if (!isPledge) return
    const raw = localStorage.getItem("septivolt_integrity_pledge_wb_1_1_3")
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed.printedName) setPrintedName(parsed.printedName)
        if (parsed.signature) setSignature(parsed.signature)
        if (parsed.signedDate) {
          setSignedDate(parsed.signedDate)
        } else {
          setSignedDate(new Date().toLocaleDateString())
        }
      } catch (e) {
        setSignedDate(new Date().toLocaleDateString())
      }
    } else {
      setSignedDate(new Date().toLocaleDateString())
    }
  }, [isPledge])

  // Save pledge state function
  const savePledgeState = (updatedChecked: string[], name: string, sig: string, date: string) => {
    localStorage.setItem("septivolt_integrity_pledge_wb_1_1_3", JSON.stringify({
      checked: updatedChecked,
      printedName: name,
      signature: sig,
      signedDate: date
    }))
  }

  // Load checklist progress
  useEffect(() => {
    const stored = getResponse(moduleId, prompt.id)
    if (Array.isArray(stored)) {
      setChecked(stored)
      if (isPledge) {
        const rawPledge = localStorage.getItem("septivolt_integrity_pledge_wb_1_1_3")
        let name = ""
        let sig = ""
        if (rawPledge) {
          try {
            const parsed = JSON.parse(rawPledge)
            name = parsed.printedName || ""
            sig = parsed.signature || ""
          } catch {}
        }
        const isComplete = stored.length >= requiredCount && name.trim().length > 0 && sig.trim().length > 0
        onCompletionChange(prompt.id, isComplete)
        if (isComplete) setShowCompletionMsg(true)
      } else {
        onCompletionChange(prompt.id, requiredCount > 0 ? stored.length >= requiredCount : stored.length > 0)
      }
    } else {
      onCompletionChange(prompt.id, false)
    }
  }, [moduleId, prompt.id, requiredCount, onCompletionChange, isPledge])

  const toggle = (item: string) => {
    const updated = checked.includes(item) ? checked.filter((c) => c !== item) : [...checked, item]
    setChecked(updated)
    saveResponse(moduleId, prompt.id, updated)

    if (isPledge) {
      savePledgeState(updated, printedName, signature, signedDate)
      const isComplete = updated.length >= requiredCount && printedName.trim().length > 0 && signature.trim().length > 0
      onCompletionChange(prompt.id, isComplete)
      if (isComplete) setShowCompletionMsg(true)
      else setShowCompletionMsg(false)
    } else {
      onCompletionChange(prompt.id, requiredCount > 0 ? updated.length >= requiredCount : updated.length > 0)
    }
  }

  const handleNameChange = (val: string) => {
    setPrintedName(val)
    if (isPledge) {
      savePledgeState(checked, val, signature, signedDate)
      const isComplete = checked.length >= requiredCount && val.trim().length > 0 && signature.trim().length > 0
      onCompletionChange(prompt.id, isComplete)
      if (isComplete) setShowCompletionMsg(true)
      else setShowCompletionMsg(false)
    }
  }

  const handleSignatureChange = (val: string) => {
    setSignature(val)
    if (isPledge) {
      savePledgeState(checked, printedName, val, signedDate)
      const isComplete = checked.length >= requiredCount && printedName.trim().length > 0 && val.trim().length > 0
      onCompletionChange(prompt.id, isComplete)
      if (isComplete) setShowCompletionMsg(true)
      else setShowCompletionMsg(false)
    }
  }

  const downloadSignedPledge = async () => {
    try {
      setPdfError(false)
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      const contentWidth = pageWidth - margin * 2
      let y = margin

      // Title & Branding
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(230, 92, 0) // SeptiVolt orange
      doc.text("SeptiVolt Solar Sales Accelerator", pageWidth / 2, y, { align: "center" })
      y += 10

      doc.setFontSize(16)
      doc.setTextColor(50, 50, 50)
      doc.text(isEs ? "Pacto de Integridad y Compromiso" : "Solar Integrity Creed & Pledge", pageWidth / 2, y, { align: "center" })
      y += 12

      // Module Reference
      doc.setFontSize(9)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(120, 120, 120)
      doc.text("Module 1.1 — Welcome & Vision Casting / Módulo 1.1 — Bienvenida y Visión del Futuro", pageWidth / 2, y, { align: "center" })
      y += 8

      // Divider line
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 10

      // Creed/Preamble text
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(isEs ? "PREÁMBULO" : "PREAMBLE", margin, y)
      y += 6

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      const preambleText = isEs 
        ? "SeptiVolt se basa en una cultura de integridad, profesionalismo y servicio. No competimos con el engaño. Competimos con experiencia, confianza y la entrega genuina de valor a los propietarios. Cada acción tomada en el campo es un reflejo directo de la reputación de esta organización. Los estándares a continuación no son pautas opcionales — son la base mínima para continuar la representación de SeptiVolt y su misión."
        : "SeptiVolt is built on a culture of integrity, professionalism, and service. We do not compete on deception. We compete on expertise, trust, and the genuine delivery of value to homeowners. Every action taken in the field is a direct reflection of this organization's reputation. The standards below are not optional guidelines — they are the minimum baseline for continued representation of SeptiVolt and its mission."

      const preambleLines = doc.splitTextToSize(preambleText, contentWidth)
      doc.text(preambleLines, margin, y)
      y += preambleLines.length * 5 + 8

      // Commitments title
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text(isEs ? "COMPROMISOS DEL REPRESENTANTE" : "REPRESENTATIVE COMMITMENTS", margin, y)
      y += 6

      // Checked Commitments
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      
      const commitments = prompt.items || []
      commitments.forEach((item) => {
        if (y > 250) {
          doc.addPage()
          y = margin
        }
        const isChecked = checked.includes(item)
        const prefix = isChecked ? "[X] " : "[ ] "
        const lines = doc.splitTextToSize(`${prefix}${item}`, contentWidth)
        doc.text(lines, margin, y)
        y += lines.length * 5 + 3
      })

      y += 10

      // Agreement Acknowledgement
      doc.setFont("helvetica", "bold")
      doc.text(isEs ? "RECONOCIMIENTO Y ACUERDO" : "ACKNOWLEDGEMENT & AGREEMENT", margin, y)
      y += 6

      doc.setFont("helvetica", "normal")
      const agreementText = isEs
        ? "Yo, el abajo firmante, he leído y entendido completamente los compromisos establecidos en este Pacto de Integridad. Acepto este acuerdo de forma voluntaria, y entiendo que el incumplimiento de estos estándares puede resultar en medidas disciplinarias, la terminación de mi acuerdo o la remoción del programa de SeptiVolt a la entera discreción de la gerencia."
        : "I, the undersigned, have read and fully understood the commitments set forth in this Integrity Creed. I enter into this agreement voluntarily, and I understand that failure to uphold these standards may result in disciplinary action, termination of my agreement, or removal from SeptiVolt's sales program at the sole discretion of management."

      const agreementLines = doc.splitTextToSize(agreementText, contentWidth)
      doc.text(agreementLines, margin, y)
      y += agreementLines.length * 5 + 15

      if (y > 250) {
        doc.addPage()
        y = margin
      }

      // Signature Block Table
      doc.setFont("helvetica", "bold")
      doc.text(isEs ? "Firma del Representante:" : "Rep Signature:", margin, y)
      doc.setFont("helvetica", "normal")
      doc.text(signature, margin + 45, y)
      
      // Draw signature line
      doc.line(margin + 45, y + 1, margin + 120, y + 1)
      y += 10

      doc.setFont("helvetica", "bold")
      doc.text(isEs ? "Nombre Impreso:" : "Printed Name:", margin, y)
      doc.setFont("helvetica", "normal")
      doc.text(printedName, margin + 45, y)
      y += 10

      doc.setFont("helvetica", "bold")
      doc.text(isEs ? "Fecha:" : "Date:", margin, y)
      doc.setFont("helvetica", "normal")
      doc.text(signedDate || new Date().toLocaleDateString(), margin + 45, y)
      y += 20

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(isEs ? "Generado digitalmente por SeptiVolt" : "Generated by SeptiVolt Onboarding Program", pageWidth / 2, 287, { align: "center" })

      // Save PDF
      doc.save(`SeptiVolt_Signed_Pledge_${printedName.replace(/\s+/g, "_")}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
      setPdfError(true)
    }
  }

  const isComplete = checked.length >= requiredCount && printedName.trim().length > 0 && signature.trim().length > 0

  return (
    <div className="glass-circuit hud-border rounded-xl p-5 space-y-4">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
      `}} />
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-white">{prompt.label}</label>
        {isPledge && (
          <span className="block text-[10px] text-indigo-300 uppercase tracking-widest font-hud">
            {t.integrityTitle}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {prompt.items?.map((item, i) => {
          const isChecked = checked.includes(item)
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(item)}
              className={`w-full min-h-[52px] rounded-lg border p-3 text-left text-sm transition-all ${
                isChecked
                  ? "border-[#FFB300]/30 bg-[#FFB300]/10 text-[#FFE6B3]"
                  : "border-white/10 bg-white/5 text-[#CBD5E1] hover:border-[#FF5722]/25"
              }`}
            >
              <span className="flex items-start gap-3">
                {isChecked ? (
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#FFB300]" />
                ) : (
                  <Square className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]" />
                )}
                <span>{item}</span>
              </span>
            </button>
          )
        })}
      </div>

      {isPledge && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Printed Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">{t.printedName}</label>
              <input
                type="text"
                value={printedName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={t.printedNamePlaceholder}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
              />
            </div>

            {/* Signature */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">{t.signature}</label>
              <input
                type="text"
                value={signature}
                onChange={(e) => handleSignatureChange(e.target.value)}
                placeholder={t.signaturePlaceholder}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
                style={{ fontFamily: signature ? "'Caveat', cursive" : undefined, fontSize: signature ? "1.25rem" : undefined }}
              />
            </div>
          </div>

          {/* Read-only Date */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t.date}:</span>
            <span className="font-mono text-white bg-white/5 px-2.5 py-1 rounded-md">{signedDate || new Date().toLocaleDateString()}</span>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={downloadSignedPledge}
              disabled={!isComplete}
              className={`w-full flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold tracking-wide transition-all ${
                isComplete
                  ? "border-[#FF5722]/35 bg-[#FF5722]/15 text-[#FFD54F] hover:bg-[#FF5722]/25 shadow-[0_0_15px_rgba(255,87,34,0.15)] cursor-pointer"
                  : "border-white/5 bg-white/[0.02] text-slate-500 cursor-not-allowed"
              }`}
            >
              <FileDown className="h-4 w-4" />
              {t.downloadButton}
            </button>

            {/* Validation warning */}
            {!isComplete && (
              <p className="text-center text-[11px] text-slate-500 italic">
                {t.validationError}
              </p>
            )}

            {/* Signed status message */}
            {isComplete && showCompletionMsg && (
              <p className="text-center text-xs text-emerald-400 font-medium">
                {t.completeMsg}
              </p>
            )}

            {/* Fallback download error */}
            {pdfError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200 space-y-1.5 animate-fadeIn">
                <p className="flex items-start gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{t.fallbackMsg}</span>
                </p>
                <a
                  href="/downloads/solar_integrity_pledge.pdf"
                  download="solar_integrity_pledge.pdf"
                  className="inline-block text-amber-300 hover:text-amber-400 font-semibold underline"
                >
                  {t.downloadBlank}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function RatingPrompt({
  moduleId,
  prompt,
  onCompletionChange,
}: {
  moduleId: string
  prompt: WorkbookPrompt
  onCompletionChange: (promptId: string, completed: boolean) => void
}) {
  const max = prompt.maxRating || 5
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  useEffect(() => {
    const stored = getResponse(moduleId, prompt.id)
    if (typeof stored === "number") {
      setRating(stored)
      onCompletionChange(prompt.id, stored > 0)
    } else {
      onCompletionChange(prompt.id, false)
    }
  }, [moduleId, prompt.id, onCompletionChange])

  const handleRate = (value: number) => {
    setRating(value)
    saveResponse(moduleId, prompt.id, value)
    onCompletionChange(prompt.id, value > 0)
  }

  return (
    <div className="glass-circuit hud-border rounded-xl p-5 space-y-3">
      <label className="block text-sm font-semibold text-white">{prompt.label}</label>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleRate(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-1.5 transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                n <= (hover || rating) ? "fill-[#FFB300] text-[#FFB300]" : "text-[#475569]"
              }`}
            />
          </button>
        ))}
        {rating > 0 ? <span className="ml-2 self-center text-sm text-[#94A3B8]">{rating}/{max}</span> : null}
      </div>
    </div>
  )
}
