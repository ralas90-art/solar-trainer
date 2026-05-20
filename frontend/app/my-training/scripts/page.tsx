"use client"

import { AppShell } from "@/components/platform/app-shell"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/hooks/use-language"
import { api } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Copy,
  Check,
  Search,
  ArrowRight,
  Globe,
  FileText,
  AlertCircle,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

interface SalesAsset {
  id: number
  company_id: string
  asset_type: string
  title: string
  language: string
  content: string
  status: string
}

export default function ScriptLibraryPage() {
  const { user } = useAuth()
  const { language, isSpanish } = useLanguage()
  const t = (en: string, es: string) => (isSpanish ? es : en)

  const [assets, setAssets] = useState<SalesAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [activeType, setActiveType] = useState<string>("all")
  const [activeLang, setActiveLang] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // Sync active language filter with global language state
  useEffect(() => {
    if (language) {
      setActiveLang(language)
    }
  }, [language])

  useEffect(() => {
    if (!user || !user.companyId) return
    const companyId = user.companyId
    const username = user.username

    async function fetchScripts() {
      try {
        setLoading(true)
        // Fetch approved assets for the rep's company
        const data = await api.get<SalesAsset[]>(
          `/api/v1/companies/${encodeURIComponent(companyId)}/assets/approved`,
          { headers: { "X-User-Id": username } }
        )
        setAssets(data || [])
      } catch (err: any) {
        console.error("Failed to load script library:", err)
        setError(err.message || "Failed to load script library.")
      } finally {
        setLoading(false)
      }
    }

    fetchScripts()
  }, [user?.companyId, user?.username])

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filter scripts
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.content.toLowerCase().includes(searchQuery.toLowerCase())
      
    const matchesType = activeType === "all" || asset.asset_type === activeType
    const matchesLang = activeLang === "all" || asset.language === activeLang

    return matchesSearch && matchesType && matchesLang
  })

  // Map script types to simulator scenario parameters
  const getSimulatorUrl = (assetType: string) => {
    if (assetType === "door_knock") return "/ai-simulator?scenarioId=busy_brian"
    if (assetType === "zoom_in_home") return "/ai-simulator?scenarioId=guarded_gloria"
    return "/ai-simulator" // fallback default
  }

  return (
    <AppShell
      heading={t("Sales Script Library", "Biblioteca de Guiones")}
      subheading={t(
        "Study approved company door-knocking hooks, cold outreach scripts, and objections to pass certifications.",
        "Estudie abridores de puertas, guiones de llamadas en frío y objeciones aprobadas."
      )}
    >
      <div className="space-y-6">
        {/* Filters Panel */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("Search scripts & resources...", "Buscar guiones y recursos...")}
              className="w-full rounded-xl border border-white/10 bg-[#121212] pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-[#FF5722]/50 placeholder:text-[#64748B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Type */}
            <div className="flex bg-[#121212] border border-white/10 rounded-xl p-1">
              {[
                { id: "all", labelEn: "All Types", labelEs: "Todos" },
                { id: "door_knock", labelEn: "D2D Door Knocks", labelEs: "Puerta a Puerta" },
                { id: "cold_call", labelEn: "Cold Calls", labelEs: "Llamada en Frío" },
                { id: "zoom_in_home", labelEn: "In-Home Pointers", labelEs: "En Casa/Zoom" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveType(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold font-hud uppercase tracking-wider transition-all",
                    activeType === tab.id
                      ? "bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  )}
                >
                  {t(tab.labelEn, tab.labelEs)}
                </button>
              ))}
            </div>

            {/* Filter by Language */}
            <div className="flex bg-[#121212] border border-white/10 rounded-xl p-1">
              {[
                { id: "all", label: "EN/ES" },
                { id: "en", label: "EN" },
                { id: "es", label: "ES" }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveLang(lang.id)}
                  className={cn(
                    "w-10 py-1.5 rounded-lg text-[10px] font-bold font-hud uppercase tracking-wider text-center transition-all",
                    activeLang === lang.id
                      ? "bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl border border-white/5 bg-[#1A1A1A] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center max-w-md mx-auto">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
            <h4 className="font-bold text-sm text-white mb-1">{t("Failed to load scripts", "Error al cargar guiones")}</h4>
            <p className="text-xs text-[#94A3B8]">{error}</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-12 text-center max-w-md mx-auto">
            <BookOpen className="h-10 w-10 text-[#64748B] mx-auto mb-3" />
            <h4 className="font-bold text-sm text-white mb-1">
              {t("No Approved Scripts Found", "No se encontraron guiones aprobados")}
            </h4>
            <p className="text-xs text-[#94A3B8]">
              {t(
                "Your company administrator hasn't published any approved sales scripts or objection resources yet.",
                "El administrador de su empresa aún no ha publicado guiones de venta aprobados."
              )}
            </p>
          </div>
        ) : (
          /* Scripts Grid */
          <div className="grid gap-6 md:grid-cols-2">
            {filteredAssets.map((script) => (
              <div
                key={script.id}
                className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 flex flex-col justify-between hover:border-white/10 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-base leading-snug">{script.title}</h4>
                      <div className="flex items-center gap-2">
                        {/* Type badge */}
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 font-hud text-[9px] uppercase tracking-wider text-[#94A3B8]">
                          <FileText className="h-2.5 w-2.5" />
                          {script.asset_type === "door_knock"
                            ? t("Door Knock", "Puerta a Puerta")
                            : script.asset_type === "zoom_in_home"
                            ? t("In-Home / Zoom", "En Casa/Zoom")
                            : t("Cold Call", "Llamada en Frío")}
                        </span>
                        {/* Language indicator */}
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/20 px-2 py-0.5 font-hud text-[9px] uppercase tracking-wider text-[#FFB300]">
                          <Globe className="h-2.5 w-2.5 text-[#FF5722]" />
                          {script.language.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(script.id, script.content)}
                      className={cn(
                        "rounded-xl p-2.5 border transition-all duration-200 shrink-0",
                        copiedId === script.id
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-white/5 border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/10"
                      )}
                      title={t("Copy script content", "Copiar contenido")}
                    >
                      {copiedId === script.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Script body preview */}
                  <div className="rounded-xl border border-white/5 bg-[#121212] p-4 h-36 overflow-y-auto custom-scrollbar">
                    <pre className="text-xs text-[#CBD5E1] whitespace-pre-wrap font-sans font-medium leading-relaxed">
                      {script.content}
                    </pre>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-end">
                  <Link
                    href={getSimulatorUrl(script.asset_type)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold font-hud uppercase tracking-wider text-[#FF5722] hover:text-[#FFB300] transition-colors"
                  >
                    {t("Practice Script", "Practicar Guion")}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
