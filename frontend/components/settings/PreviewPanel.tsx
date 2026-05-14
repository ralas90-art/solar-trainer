"use client"

import { useState } from "react"
import { renderPreview } from "@/lib/api-client"
import { Play, Loader2, AlertCircle } from "lucide-react"

interface PreviewPanelProps {
  formValues: any // Unsaved form values to be used as overrides
}

export function PreviewPanel({ formValues }: PreviewPanelProps) {
  const [inputText, setInputText] = useState("Welcome to {{company_name}}!\\n\\nLog into {{crm_name}} to track your {{door_knocking_tool}} leads, and generate quotes using {{proposal_tool}}.")
  const [renderedOutput, setRenderedOutput] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefresh = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await renderPreview(inputText, formValues)
      setRenderedOutput(response.rendered_output)
    } catch (err: any) {
      setError(err.message || "Failed to render preview.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col h-full">
      <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
        <Play className="w-4 h-4 text-lime-400" />
        Live Variable Preview
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Test how your white-label settings will appear in the curriculum and AI simulation prompts.
      </p>

      <div className="flex flex-col gap-3 mb-4">
        <label className="text-sm font-medium text-gray-300">Sample Template Text</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-32 bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-lime-500/50 resize-none font-mono"
          placeholder="Type text with {{variables}} here..."
        />
      </div>

      <button
        onClick={handleRefresh}
        disabled={isLoading || !inputText}
        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg text-sm font-medium transition-colors border border-white/10 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh Rendered Output"}
      </button>

      <div className="flex-grow flex flex-col">
        <label className="text-sm font-medium text-gray-300 mb-2">Rendered Result</label>
        {error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : (
          <div className="flex-grow p-4 bg-black border border-white/5 rounded-lg overflow-y-auto whitespace-pre-wrap text-sm text-lime-100/90 font-mono">
            {renderedOutput || <span className="text-gray-600">Click refresh to generate output...</span>}
          </div>
        )}
      </div>
    </div>
  )
}
