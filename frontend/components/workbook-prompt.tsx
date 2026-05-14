"use client"

import { useState, useEffect, useCallback } from "react"
import { PenLine, CheckSquare, Square, Star } from "lucide-react"
import { type WorkbookPrompt } from "@/lib/modules"
import { saveResponse, getResponse } from "@/lib/workbook-storage"

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

  return (
    <div className="glass-circuit hud-border rounded-xl p-5 space-y-3">
      <label className="block text-sm font-semibold text-white">{prompt.label}</label>
      {isMultiline ? (
        <textarea
          rows={prompt.lines || 3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          placeholder={prompt.placeholder || "Type your response here..."}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          placeholder={prompt.placeholder || "Your answer..."}
          className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-[#E2E8F0] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/35"
        />
      )}
      <div className="flex items-center justify-between gap-3">
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

  useEffect(() => {
    const stored = getResponse(moduleId, prompt.id)
    if (Array.isArray(stored)) {
      setChecked(stored)
      onCompletionChange(prompt.id, requiredCount > 0 ? stored.length >= requiredCount : stored.length > 0)
    } else {
      onCompletionChange(prompt.id, false)
    }
  }, [moduleId, prompt.id, requiredCount, onCompletionChange])

  const toggle = (item: string) => {
    const updated = checked.includes(item) ? checked.filter((c) => c !== item) : [...checked, item]
    setChecked(updated)
    saveResponse(moduleId, prompt.id, updated)
    onCompletionChange(prompt.id, requiredCount > 0 ? updated.length >= requiredCount : updated.length > 0)
  }

  return (
    <div className="glass-circuit hud-border rounded-xl p-5 space-y-3">
      <label className="block text-sm font-semibold text-white">{prompt.label}</label>
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
