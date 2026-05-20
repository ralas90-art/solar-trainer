"use client"

import { AppShell } from "@/components/platform/app-shell"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api-client"
import {
  Building2, Sparkles, Link as LinkIcon, CheckCircle, AlertCircle,
  ShieldAlert, Key, Save, RefreshCw, Lock, SlidersHorizontal,
  Eye, Cpu, Layers, Globe, FileText, Check, AlertTriangle,
  Phone, Video, Trash2, Plus, Edit3, BookOpen, ChevronDown, ChevronUp
} from "lucide-react"
import { useState, useEffect } from "react"

type TabType = "profile" | "integrations" | "assets"

interface ProfileData {
  company_id: string
  company_overview?: string
  website_url?: string
  states_served?: string[]
  target_segments?: string[]
  residential_focus?: boolean
  key_products?: string[]
  brand_voice?: string[]
  objections_handled?: string
  completeness_score: number
}

interface IntegrationData {
  id?: string
  provider: string
  auth_type: string
  credentials_preview?: string
  webhook_url?: string
  sync_enabled: boolean
  sync_preferences: Record<string, boolean>
  last_sync_status?: string
}

interface CompanySalesAsset {
  id?: number
  company_id: string
  asset_type: string
  title: string
  language: string
  content: string
  source_profile_version?: string
  status: string
  created_at?: string
  updated_at?: string
}

export default function CompanySettingsPage() {
  const { user } = useAuth()
  const { isSpanish } = useLanguage()
  const [activeTab, setActiveTab] = useState<TabType>("profile")


  // Profile Form States
  const [profile, setProfile] = useState<ProfileData>({
    company_id: "",
    company_overview: "",
    website_url: "",
    states_served: [],
    target_segments: [],
    residential_focus: true,
    key_products: [],
    brand_voice: [],
    objections_handled: "",
    completeness_score: 0
  })

  // Inputs for arrays
  const [statesInput, setStatesInput] = useState("")
  const [segmentsInput, setSegmentsInput] = useState("")
  const [productsInput, setProductsInput] = useState("")
  const [voiceInput, setVoiceInput] = useState("")

  // Integrations States
  const [selectedProvider, setSelectedProvider] = useState<string>("gohighlevel")
  const [integrationCreds, setIntegrationCreds] = useState("")
  const [integrationWebhookUrl, setIntegrationWebhookUrl] = useState("")
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [syncPreferences, setSyncPreferences] = useState<Record<string, boolean>>({
    "Sync new SeptiVolt users to CRM": true,
    "Post simulation scores to CRM contact profile": true,
    "Sync coaching notes to GHL notes": false
  })
  
  // Existing Integrations List
  const [integrationsList, setIntegrationsList] = useState<IntegrationData[]>([])

  // UI status states
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingIntegration, setSavingIntegration] = useState(false)
  const [testingConnection, setTestingConnection] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<{ id: string; status: "success" | "error"; message: string } | null>(null)
  
  // Alerts
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // AI Training Context Preview
  const [aiContextPreview, setAiContextPreview] = useState<string | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Assets states
  const [assets, setAssets] = useState<CompanySalesAsset[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [isEditingAsset, setIsEditingAsset] = useState<CompanySalesAsset | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAssetModal, setShowAssetModal] = useState(false)
  
  // Form states for manual asset creation / edit / generation
  const [assetTitle, setAssetTitle] = useState("")
  const [assetType, setAssetType] = useState("door_knock")
  const [assetLanguage, setAssetLanguage] = useState("en")
  const [assetContent, setAssetContent] = useState("")
  const [assetStatus, setAssetStatus] = useState("draft")
  const [expandedAssetId, setExpandedAssetId] = useState<number | null>(null)

  const t = (en: string, es: string) => (isSpanish ? es : en)

  const isAdmin = user?.role === "admin"
  const isManager = user?.role === "manager"
  const hasAdminAccess = isAdmin || isManager
  const hasAccess = user !== null
  const companyId = user?.companyId || "cresca_test"

  // If user is sales rep, default tab is assets
  useEffect(() => {
    if (user && user.role === "sales_rep") {
      setActiveTab("assets")
    }
  }, [user])

  // Fetch company sales assets
  const fetchAssets = async () => {
    try {
      setLoadingAssets(true)
      const res = await api.get<CompanySalesAsset[]>(`/api/v1/companies/${companyId}/assets`, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setAssets(res)
    } catch (err: any) {
      console.error("Error loading assets:", err)
      setAlert({
        type: "error",
        message: t(`Failed to load sales assets: ${err.message}`, `Error al cargar recursos de ventas: ${err.message}`)
      })
    } finally {
      setLoadingAssets(false)
    }
  }

  // Fetch initial profile & integrations data (only for admin/manager)
  useEffect(() => {
    if (!user || !hasAccess) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        if (hasAdminAccess) {
          // 1. Fetch Profile
          const profileRes = await api.get<ProfileData>(`/api/v1/companies/${companyId}/profile`, {
            headers: { "X-User-Id": user?.username || "" }
          })
          setProfile(profileRes)
          setStatesInput(profileRes.states_served?.join(", ") || "")
          setSegmentsInput(profileRes.target_segments?.join(", ") || "")
          setProductsInput(profileRes.key_products?.join(", ") || "")
          setVoiceInput(profileRes.brand_voice?.join(", ") || "")

          // 2. Fetch Integrations
          const integrationsRes = await api.get<IntegrationData[]>(`/api/v1/companies/${companyId}/integrations`, {
            headers: { "X-User-Id": user?.username || "" }
          })
          setIntegrationsList(integrationsRes)

          // Set form values if selected provider already exists
          const matched = integrationsRes.find(i => i.provider === selectedProvider)
          if (matched) {
            setIntegrationCreds(matched.credentials_preview || "")
            setIntegrationWebhookUrl(matched.webhook_url || "")
            setSyncEnabled(matched.sync_enabled)
            if (matched.sync_preferences) {
              setSyncPreferences(matched.sync_preferences)
            }
          } else {
            setIntegrationCreds("")
            setIntegrationWebhookUrl("")
            setSyncEnabled(true)
          }
        }
        
        // Fetch assets if we are on the assets tab
        if (activeTab === "assets") {
          await fetchAssets()
        }
      } catch (err: any) {
        console.error("Error loading company settings:", err)
        setAlert({
          type: "error",
          message: t(
            `Failed to load settings: ${err.message}`,
            `Error al cargar la configuración: ${err.message}`
          )
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, companyId, selectedProvider, activeTab, hasAdminAccess])

  // Separate hook to refresh assets when tab shifts to assets
  useEffect(() => {
    if (user && activeTab === "assets") {
      fetchAssets()
    }
  }, [user, activeTab, companyId])

  // Save Asset (manual or edit)
  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAdminAccess) return

    try {
      setAlert(null)
      const payload = {
        title: assetTitle,
        asset_type: assetType,
        language: assetLanguage,
        content: assetContent,
        status: assetStatus
      }

      if (isEditingAsset && isEditingAsset.id) {
        await api.put(`/api/v1/companies/${companyId}/assets/${isEditingAsset.id}`, payload, {
          headers: { "X-User-Id": user?.username || "" }
        })
        setAlert({
          type: "success",
          message: t("Asset updated successfully!", "¡Recurso de venta actualizado exitosamente!")
        })
      } else {
        await api.post(`/api/v1/companies/${companyId}/assets`, payload, {
          headers: { "X-User-Id": user?.username || "" }
        })
        setAlert({
          type: "success",
          message: t("Asset created successfully!", "¡Recurso de venta creado exitosamente!")
        })
      }

      setShowAssetModal(false)
      setIsEditingAsset(null)
      setAssetTitle("")
      setAssetContent("")
      fetchAssets()
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to save asset: ${err.message}`, `Error al guardar recurso: ${err.message}`)
      })
    }
  }

  // Generate Asset via AI
  const handleGenerateAsset = async () => {
    if (!hasAdminAccess) return
    try {
      setIsGenerating(true)
      setAlert(null)

      const res = await api.post<{ title: string; content: string; asset_type: string; language: string }>(
        `/api/v1/companies/${companyId}/assets/generate`,
        {
          asset_type: assetType,
          language: assetLanguage
        },
        { headers: { "X-User-Id": user?.username || "" } }
      )

      setAssetTitle(res.title)
      setAssetContent(res.content)
      setAssetStatus("draft")

      setAlert({
        type: "success",
        message: t("AI Script generated successfully! Review below.", "¡Guión de IA generado con éxito! Revíselo a continuación.")
      })
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to generate asset: ${err.message}`, `Error al generar recurso: ${err.message}`)
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Delete/Archive Asset
  const handleDeleteAsset = async (id: number) => {
    if (!hasAdminAccess) return
    if (!confirm(t("Are you sure you want to delete this asset?", "¿Está seguro de que desea eliminar este recurso?"))) return

    try {
      setAlert(null)
      await api.delete(`/api/v1/companies/${companyId}/assets/${id}`, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setAlert({
        type: "success",
        message: t("Asset deleted successfully.", "Recurso de venta eliminado con éxito.")
      })
      fetchAssets()
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to delete asset: ${err.message}`, `Error al eliminar recurso: ${err.message}`)
      })
    }
  }


  // Sync selected provider inputs when tab or provider selector shifts
  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    const matched = integrationsList.find(i => i.provider === provider)
    if (matched) {
      setIntegrationCreds(matched.credentials_preview || "")
      setIntegrationWebhookUrl(matched.webhook_url || "")
      setSyncEnabled(matched.sync_enabled)
      if (matched.sync_preferences) {
        setSyncPreferences(matched.sync_preferences)
      }
    } else {
      setIntegrationCreds("")
      setIntegrationWebhookUrl("")
      setSyncEnabled(true)
      setSyncPreferences({
        "Sync new SeptiVolt users to CRM": true,
        "Post simulation scores to CRM contact profile": true,
        "Sync coaching notes to GHL notes": false
      })
    }
    setTestResult(null)
  }

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return // Guard

    try {
      setSavingProfile(true)
      setAlert(null)

      const payload = {
        company_overview: profile.company_overview,
        website_url: profile.website_url,
        states_served: statesInput.split(",").map(s => s.trim()).filter(Boolean),
        target_segments: segmentsInput.split(",").map(s => s.trim()).filter(Boolean),
        residential_focus: profile.residential_focus,
        key_products: productsInput.split(",").map(s => s.trim()).filter(Boolean),
        brand_voice: voiceInput.split(",").map(s => s.trim()).filter(Boolean),
        objections_handled: profile.objections_handled
      }

      const updated = await api.put<ProfileData>(`/api/v1/companies/${companyId}/profile`, payload, {
        headers: { "X-User-Id": user?.username || "" }
      })

      setProfile(updated)
      setAlert({
        type: "success",
        message: t("Company profile updated successfully!", "¡Perfil de empresa actualizado con éxito!")
      })
      // Clear AI context preview if it was loaded so it forces refresh
      setAiContextPreview(null)
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to save profile: ${err.message}`, `Error al guardar perfil: ${err.message}`)
      })
    } finally {
      setSavingProfile(false)
    }
  }

  // Handle Preview AI context
  const handleLoadPreview = async () => {
    try {
      setLoadingPreview(true)
      const res = await api.get<{ context: string }>(`/api/v1/companies/${companyId}/profile/preview`, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setAiContextPreview(res.context)
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to load AI context preview: ${err.message}`, `Error al generar vista previa del contexto IA: ${err.message}`)
      })
    } finally {
      setLoadingPreview(false)
    }
  }

  // Save Integration
  const handleSaveIntegration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return

    try {
      setSavingIntegration(true)
      setAlert(null)

      const payload = {
        provider: selectedProvider,
        auth_type: selectedProvider === "custom_webhook" ? "webhook" : "api_key",
        credentials: integrationCreds,
        webhook_url: integrationWebhookUrl,
        sync_enabled: syncEnabled,
        sync_preferences: syncPreferences
      }

      // Check if integration already exists
      const existing = integrationsList.find(i => i.provider === selectedProvider)

      let res: any
      if (existing && existing.id) {
        res = await api.put(`/api/v1/companies/${companyId}/integrations/${existing.id}`, payload, {
          headers: {
            "X-User-Id": user?.username || ""
          }
        })
      } else {
        res = await api.post(`/api/v1/companies/${companyId}/integrations`, payload, {
          headers: {
            "X-User-Id": user?.username || ""
          }
        })
      }

      // Refresh integrations list
      const integrationsRes = await api.get<IntegrationData[]>(`/api/v1/companies/${companyId}/integrations`, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setIntegrationsList(integrationsRes)
      
      // Update form credentials preview
      const newlySaved = integrationsRes.find(i => i.provider === selectedProvider)
      if (newlySaved) {
        setIntegrationCreds(newlySaved.credentials_preview || "")
      }

      setAlert({
        type: "success",
        message: t("Integration settings saved securely!", "¡Configuración de integración guardada de forma segura!")
      })
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to save integration: ${err.message}`, `Error al guardar la integración: ${err.message}`)
      })
    } finally {
      setSavingIntegration(false)
    }
  }

  // Test Connection
  const handleTestConnection = async (provider: string) => {
    if (!isAdmin) return
    const matched = integrationsList.find(i => i.provider === provider)
    if (!matched || !matched.id) {
      setAlert({
        type: "error",
        message: t("Please save integration settings before testing.", "Guarde la configuración de integración antes de realizar la prueba.")
      })
      return
    }

    try {
      setTestingConnection(provider)
      setTestResult(null)

      const res = await api.post<{ status: string; message?: string }>(
        `/api/v1/companies/${companyId}/integrations/${matched.id}/test`,
        {},
        { headers: { "X-User-Id": user?.username || "" } }
      )

      if (res.status === "connected") {
        setTestResult({
          id: provider,
          status: "success",
          message: t("Connected successfully!", "¡Conexión exitosa!")
        })
      } else {
        setTestResult({
          id: provider,
          status: "error",
          message: res.message || t("Verification failed.", "Falló la verificación.")
        })
      }
    } catch (err: any) {
      setTestResult({
        id: provider,
        status: "error",
        message: err.message || t("Connection error occurred.", "Ocurrió un error de conexión.")
      })
    } finally {
      setTestingConnection(null)
    }
  }

  if (loading) {
    return (
      <AppShell
        heading={t("Company Intelligence Settings", "Configuración de Inteligencia")}
        subheading={t("Loading company intelligence profiles and sync configs...", "Cargando perfiles de inteligencia de empresa...")}
      >
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-8 w-8 text-[#FF5722] animate-spin" />
        </div>
      </AppShell>
    )
  }

  // Unauthorized page
  if (!user) {
    return (
      <AppShell
        heading={t("Access Restricted", "Acceso Restringido")}
        subheading={t("Please sign in to access settings.", "Por favor inicie sesión para acceder a la configuración.")}
      >
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center max-w-2xl mx-auto my-12">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="font-display font-black text-xl text-white mb-2">{t("Access Restricted", "Acceso Restringido")}</h2>
          <p className="text-sm text-[#94A3B8] mb-6">
            {t(
              "Please sign in with a valid user account to access settings.",
              "Inicie sesión con una cuenta de usuario válida para acceder a la configuración."
            )}
          </p>
        </div>
      </AppShell>
    )
  }


  return (
    <AppShell
      heading={t("Company Settings", "Configuración de Empresa")}
      subheading={t(
        "Manage company profile contexts, brand guidelines, and CRM/webhook API integration hubs.",
        "Gestione el perfil de la empresa, pautas de marca y conexiones de integración de CRM y webhooks."
      )}
    >
      <div className="space-y-6 max-w-6xl">
        
        {/* Alerts Banner */}
        {alert && (
          <div className={cn(
            "rounded-xl border p-4 flex gap-3 items-start",
            alert.type === "success" 
              ? "border-green-500/30 bg-green-500/5 text-green-400" 
              : "border-red-500/30 bg-red-500/5 text-red-400"
          )}>
            {alert.type === "success" ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span className="text-sm">{alert.message}</span>
          </div>
        )}

        {/* Top Overview Bar */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FFB300] flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.25)]">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl text-white">
                {companyId === "cresca_test" ? "Cresca Test Solar" : "Rival Corp Solar"}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                {t("Workspace Profile & Enterprise Integration Hub", "Perfil de espacio de trabajo y centro de integraciones")}
              </p>
            </div>
          </div>

          {/* Completeness Score Card */}
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl border border-white/10 px-5 py-3 shrink-0 w-full md:w-auto">
            {/* Visual Ring */}
            <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="#FF5722" strokeWidth="4" 
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - (profile.completeness_score || 0) / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="font-hud font-bold text-xs text-white">{profile.completeness_score || 0}%</span>
            </div>
            <div>
              <p className="font-hud text-[10px] uppercase tracking-wider text-[#64748B]">{t("Profile Completeness", "Completitud del Perfil")}</p>
              <p className="text-xs text-[#CBD5E1] mt-0.5">
                {profile.completeness_score >= 100 
                  ? t("100% complete. Ready for training!", "100% completo. ¡Listo para entrenar!")
                  : t("Add more info to boost AI context personalization.", "Agregue información para personalizar la IA.")
                }
              </p>
            </div>
          </div>
        </div>

        {/* Tab Bar Navigation */}
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="flex flex-row lg:flex-col gap-1 rounded-2xl border border-white/5 bg-[#1A1A1A] p-2 h-fit overflow-x-auto lg:overflow-visible">
            {hasAdminAccess && (
              <>
                <button
                  onClick={() => { setActiveTab("profile"); setAlert(null) }}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full whitespace-nowrap shrink-0",
                    activeTab === "profile"
                      ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]"
                      : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4 shrink-0" />
                  {t("Company Profile", "Perfil de Empresa")}
                </button>

                <button
                  onClick={() => { setActiveTab("integrations"); setAlert(null) }}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full whitespace-nowrap shrink-0",
                    activeTab === "integrations"
                      ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]"
                      : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Cpu className="h-4 w-4 shrink-0" />
                  {t("Integrations Hub", "Centro de Conexiones")}
                </button>
              </>
            )}

            <button
              onClick={() => { setActiveTab("assets"); setAlert(null) }}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full whitespace-nowrap shrink-0",
                activeTab === "assets"
                  ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]"
                  : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
              )}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              {t("Sales Assets & Scripts", "Recursos de Venta")}
            </button>
          </div>


          {/* TAB CONTENT: PROFILE */}
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 space-y-6">
              <div>
                <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#FF5722]" />
                  {t("Company Intelligence Profile", "Perfil de Inteligencia Comercial")}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {t(
                    "Teach SeptiVolt's AI generator how you sell, what you offer, and who your reps pitch.",
                    "Instruya al generador de IA sobre sus técnicas de venta, ofertas y clientes objetivo."
                  )}
                </p>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                    {t("Company Overview", "Resumen de la Empresa")}
                  </label>
                  <textarea
                    value={profile.company_overview || ""}
                    disabled={!isAdmin}
                    onChange={e => setProfile({ ...profile, company_overview: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 disabled:opacity-60"
                    placeholder={t("Brief description of your business model, products, and culture...", "Breve descripción de su modelo de negocio, productos y cultura...")}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      {t("Website URL", "Sitio Web")}
                    </label>
                    <input
                      type="url"
                      value={profile.website_url || ""}
                      disabled={!isAdmin}
                      onChange={e => setProfile({ ...profile, website_url: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 disabled:opacity-60"
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      {t("Focus Sector", "Sector de Enfoque")}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={!isAdmin}
                        onClick={() => setProfile({ ...profile, residential_focus: true })}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-xs font-bold transition-all disabled:opacity-60",
                          profile.residential_focus 
                            ? "border-[#FF5722] bg-[#FF5722]/10 text-white"
                            : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
                        )}
                      >
                        {t("Residential Focus", "Enfoque Residencial")}
                      </button>
                      <button
                        type="button"
                        disabled={!isAdmin}
                        onClick={() => setProfile({ ...profile, residential_focus: false })}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-xs font-bold transition-all disabled:opacity-60",
                          !profile.residential_focus 
                            ? "border-[#FF5722] bg-[#FF5722]/10 text-white"
                            : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
                        )}
                      >
                        {t("Commercial Focus", "Enfoque Comercial")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      {t("States Served (comma separated)", "Estados Servidos (separados por coma)")}
                    </label>
                    <input
                      type="text"
                      value={statesInput}
                      disabled={!isAdmin}
                      onChange={e => setStatesInput(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 disabled:opacity-60"
                      placeholder="CA, NV, TX, FL"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      {t("Target Customer Segments (comma separated)", "Segmentos de Cliente (separados por coma)")}
                    </label>
                    <input
                      type="text"
                      value={segmentsInput}
                      disabled={!isAdmin}
                      onChange={e => setSegmentsInput(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 disabled:opacity-60"
                      placeholder="Homeowners, Suburbs, High Electricity Bills"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      {t("Key Solar Offerings / Products (comma separated)", "Productos / Ofertas Clave (separados por coma)")}
                    </label>
                    <input
                      type="text"
                      value={productsInput}
                      disabled={!isAdmin}
                      onChange={e => setProductsInput(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 disabled:opacity-60"
                      placeholder="SunPower panels, Tesla Powerwall, PPA contracts"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                      {t("Brand Voice Guidelines (comma separated)", "Voz y Estilo de la Marca (separados por coma)")}
                    </label>
                    <input
                      type="text"
                      value={voiceInput}
                      disabled={!isAdmin}
                      onChange={e => setVoiceInput(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 disabled:opacity-60"
                      placeholder="consultative, educational, friendly, scientific"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                    {t("Top Objections Handled", "Manejo de Objeciones Clave")}
                  </label>
                  <textarea
                    value={profile.objections_handled || ""}
                    disabled={!isAdmin}
                    onChange={e => setProfile({ ...profile, objections_handled: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 disabled:opacity-60"
                    placeholder={t("Instructions on how reps should handle price concerns, PPA myths, and competitor comparison...", "Instrucciones sobre cómo deben manejar los representantes las preocupaciones de precios, mitos de PPA...")}
                  />
                </div>

                {isAdmin && (
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-primary px-5 py-3 text-xs inline-flex items-center gap-2"
                  >
                    {savingProfile ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {savingProfile ? t("Saving Profile...", "Guardando Perfil...") : t("Save Profile settings", "Guardar configuración")}
                  </button>
                )}
              </form>

              {/* Training Context Preview Button */}
              <div className="h-px bg-white/5 w-full pt-2" />

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-display font-black text-sm text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#FFB300]" />
                      {t("AI Training Context Preview", "Vista Previa del Contexto de IA")}
                    </h4>
                    <p className="text-[11px] text-[#94A3B8]">
                      {t(
                        "Click to view the exact structured context built from this profile and injected into AI roleplay simulations.",
                        "Haga clic para ver el contexto estructurado exacto que se inyecta en las simulaciones de IA."
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadPreview}
                    disabled={loadingPreview}
                    className="rounded-xl border border-[#FFB300]/40 bg-[#FFB300]/10 px-4 py-2 text-xs font-bold text-[#FFD54F] hover:bg-[#FFB300]/20 flex items-center gap-2"
                  >
                    {loadingPreview && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    {t("Preview AI Context", "Ver Contexto de IA")}
                  </button>
                </div>

                {aiContextPreview && (
                  <div className="rounded-xl border border-white/5 bg-[#121212] p-4 font-mono text-[11px] leading-relaxed text-[#94A3B8] max-h-80 overflow-y-auto whitespace-pre-wrap">
                    {aiContextPreview}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: INTEGRATIONS */}
          {activeTab === "integrations" && (
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 space-y-6">
              <div>
                <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-[#FF5722]" />
                  {t("Company Integration Hub", "Centro de Integraciones")}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {t(
                    "Connect and synchronize training results and rep list with external CRM and workflow webhooks.",
                    "Conecte y sincronice los resultados de entrenamiento y representantes con su CRM y webhooks."
                  )}
                </p>
              </div>

              <div className="h-px bg-white/5 w-full" />

              {/* Provider Grid Selector */}
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                {[
                  { id: "gohighlevel", name: "GoHighLevel (GHL)", icon: LinkIcon, active: true },
                  { id: "custom_webhook", name: "Custom Webhook", icon: Cpu, active: true },
                  { id: "cresca_crm", name: "Cresca CRM", icon: Layers, active: true },
                  { id: "hubspot", name: "HubSpot", icon: Globe, active: false },
                ].map(({ id, name, icon: Icon, active }) => {
                  const isConnected = integrationsList.some(i => i.provider === id && i.sync_enabled)
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleProviderChange(id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all relative flex flex-col justify-between h-28",
                        !active 
                          ? "border-white/5 bg-white/5 opacity-40 cursor-not-allowed" 
                          : selectedProvider === id 
                            ? "border-[#FF5722] bg-[#FF5722]/5 text-white" 
                            : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
                      )}
                    >
                      {isConnected && active && (
                        <span className="absolute top-2 right-2 bg-green-500/20 text-green-400 border border-green-500/30 text-[9px] px-1.5 py-0.5 rounded font-hud font-bold uppercase tracking-wide">
                          {t("Connected", "Conectado")}
                        </span>
                      )}
                      <Icon className="h-6 w-6 text-[#FF5722]" />
                      <div>
                        <p className="font-bold text-xs text-white">{name}</p>
                        <p className="text-[10px] text-[#64748B] mt-0.5">
                          {active ? t("API Connect", "Conexión API") : t("Enterprise Only", "Enterprise")}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Provider Form (Inactive provider blocker) */}
              {(selectedProvider === "hubspot") ? (
                <div className="rounded-2xl border border-[#FFB300]/25 bg-[#FFB300]/5 p-6 text-center">
                  <ShieldAlert className="h-8 w-8 text-[#FFB300] mx-auto mb-2" />
                  <p className="font-display font-bold text-white text-sm">
                    {t("HubSpot Integration — Enterprise Only", "Integración HubSpot — Solo Enterprise")}
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-1 max-w-md mx-auto">
                    {t(
                      "Bidirectional HubSpot CRM integrations require active Enterprise tier subscription plans.",
                      "Las integraciones bidireccionales con HubSpot CRM requieren una suscripción Enterprise activa."
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveIntegration} className="space-y-4">
                  {/* API Key / Url Inputs */}
                  {selectedProvider === "custom_webhook" ? (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                        {t("Webhook Target Endpoint URL", "URL de Endpoint de Webhook")}
                      </label>
                      <input
                        type="url"
                        value={integrationWebhookUrl}
                        disabled={isManager || !isAdmin}
                        onChange={e => setIntegrationWebhookUrl(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 font-mono disabled:opacity-60"
                        placeholder="https://yourserver.com/webhooks/septivolt"
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                        {t("API Auth Credentials / Bearer Token", "Credenciales de Autenticación / Token Bearer")}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={integrationCreds}
                          disabled={isManager || !isAdmin}
                          onChange={e => setIntegrationCreds(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#121212] pl-10 pr-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 font-mono disabled:opacity-60"
                          placeholder={t("Bearer token or raw API Secret...", "Token bearer o secreto API...")}
                          required
                        />
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
                      </div>
                    </div>
                  )}

                  {/* Sync Settings preferences */}
                  <div className="space-y-2">
                    <p className="font-hud text-[10px] uppercase tracking-wider text-[#64748B]">
                      {t("Synchronization Triggers", "Disparadores de Sincronización")}
                    </p>
                    <div className="space-y-2">
                      {Object.keys(syncPreferences).map(key => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                          <span className="text-xs text-[#CBD5E1]">{key}</span>
                          <button
                            type="button"
                            disabled={isManager || !isAdmin}
                            onClick={() => setSyncPreferences({
                              ...syncPreferences,
                              [key]: !syncPreferences[key]
                            })}
                            className={cn(
                              "w-10 h-5 rounded-full p-0.5 transition-colors duration-200 relative shrink-0",
                              syncPreferences[key] ? "bg-[#FF5722]" : "bg-white/10"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                              syncPreferences[key] ? "translate-x-5" : "translate-x-0"
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Sync Hub Status */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                    <div>
                      <p className="text-xs font-bold text-white">{t("Enable Sync Pipeline", "Habilitar Canal de Sincronización")}</p>
                      <p className="text-[10px] text-[#94A3B8]">{t("If disabled, all outbound webhooks/calls are halted.", "Si se inhabilita, se detienen todas las llamadas/webhooks salientes.")}</p>
                    </div>
                    <button
                      type="button"
                      disabled={isManager || !isAdmin}
                      onClick={() => setSyncEnabled(!syncEnabled)}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-colors duration-200 relative shrink-0",
                        syncEnabled ? "bg-[#FF5722]" : "bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                        syncEnabled ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  {/* Submit actions & testing buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {isAdmin && (
                      <button
                        type="submit"
                        disabled={savingIntegration}
                        className="btn-primary px-5 py-3 text-xs inline-flex items-center gap-2"
                      >
                        {savingIntegration ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {savingIntegration ? t("Saving Settings...", "Guardando Configuración...") : t("Save connection parameters", "Guardar parámetros de conexión")}
                      </button>
                    )}

                    {integrationsList.some(i => i.provider === selectedProvider) && (
                      <button
                        type="button"
                        onClick={() => handleTestConnection(selectedProvider)}
                        disabled={testingConnection !== null || isManager}
                        className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-[#CBD5E1] hover:bg-white/10 inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {testingConnection === selectedProvider ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 text-green-400" />
                        )}
                        {testingConnection === selectedProvider ? t("Testing...", "Probando...") : t("Test Connection", "Probar Conexión")}
                      </button>
                    )}

                    {/* Test result status indicators */}
                    {testResult && testResult.id === selectedProvider && (
                      <div className={cn(
                        "rounded-xl border px-4 py-2.5 text-xs font-semibold inline-flex items-center gap-2",
                        testResult.status === "success" 
                          ? "border-green-500/30 bg-green-500/5 text-green-400" 
                          : "border-red-500/30 bg-red-500/5 text-red-400"
                      )}>
                        {testResult.status === "success" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        <span>{testResult.message}</span>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT: SALES ASSETS */}
          {activeTab === "assets" && (
            <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#FF5722]" />
                    {t("Company Sales Assets & Scripts", "Recursos de Venta y Guiones")}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {t(
                      "Access corporate approved scripts, door openers, and rebuttals synced with the AI training engine.",
                      "Acceda a guiones corporativos aprobados, abridores y objeciones de la empresa sincronizados con la IA."
                    )}
                  </p>
                </div>
                
                {hasAdminAccess && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingAsset(null);
                        setAssetTitle("");
                        setAssetContent("");
                        setAssetType("door_knock");
                        setAssetLanguage("en");
                        setAssetStatus("draft");
                        setShowAssetModal(true);
                      }}
                      className="rounded-xl bg-[#FF5722] hover:bg-[#E64A19] px-4 py-2.5 text-xs font-bold text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all animate-pulse"
                    >
                      <Plus className="h-4 w-4" />
                      {t("Create Asset", "Crear Recurso")}
                    </button>
                  </div>
                )}
              </div>

              {!hasAdminAccess && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3 text-blue-400">
                  <Eye className="h-5 w-5 shrink-0" />
                  <p className="text-xs">
                    {t(
                      "You are viewing approved corporate scripts. These assets are dynamically loaded into your AI roleplay simulations to help you practice team-specific rebuttals and guidelines.",
                      "Está viendo los guiones corporativos aprobados. Estos recursos se cargan dinámicamente en sus simulaciones de IA."
                    )}
                  </p>
                </div>
              )}

              <div className="h-px bg-white/5 w-full" />

              {loadingAssets ? (
                <div className="flex h-48 items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-[#FF5722] animate-spin" />
                </div>
              ) : assets.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-[#121212] p-12 text-center">
                  <BookOpen className="h-12 w-12 text-[#475569] mx-auto mb-4" />
                  <h4 className="font-display font-black text-white text-base">
                    {t("No Assets Published", "Sin Recursos Publicados")}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                    {t(
                      "Your company has not uploaded or generated any custom sales assets yet. AI simulations will fall back to general solar training context.",
                      "Su empresa aún no ha publicado recursos de venta personalizados. Las simulaciones usarán el contexto general."
                    )}
                  </p>
                  {hasAdminAccess && (
                    <button
                      type="button"
                      onClick={() => setShowAssetModal(true)}
                      className="mt-4 rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/10 px-4 py-2 text-xs font-bold text-[#FF5722] hover:bg-[#FF5722]/20"
                    >
                      {t("Add Your First Asset", "Agregar Primer Recurso")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {assets.map((asset) => {
                    const isExpanded = expandedAssetId === asset.id;
                    return (
                      <div
                        key={asset.id}
                        className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden transition-all duration-200"
                      >
                        <div className="p-5 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                              {asset.asset_type === "door_knock" && <Building2 className="h-5 w-5 text-[#FFB300]" />}
                              {asset.asset_type === "cold_call" && <Phone className="h-5 w-5 text-[#FF5722]" />}
                              {asset.asset_type === "zoom_in_home" && <Video className="h-5 w-5 text-blue-400" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                {asset.title}
                                <span className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded font-hud font-bold uppercase tracking-wide shrink-0",
                                  asset.language === "es" 
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                )}>
                                  {asset.language.toUpperCase()}
                                </span>
                                {hasAdminAccess && (
                                  <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded font-hud font-bold uppercase tracking-wide shrink-0",
                                    asset.status === "approved" 
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                      : asset.status === "draft"
                                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        : "bg-white/5 text-[#94A3B8] border border-white/10"
                                  )}>
                                    {asset.status}
                                  </span>
                                )}
                              </h4>
                              <p className="text-[10px] text-[#64748B] mt-0.5 uppercase tracking-wider font-hud">
                                {asset.asset_type.replace("_", " ")} &bull; {asset.source_profile_version === "manual" ? t("Manual Entry", "Entrada Manual") : t("AI Generated", "Generado por IA")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                              type="button"
                              onClick={() => setExpandedAssetId(isExpanded ? null : (asset.id || null))}
                              className="rounded-xl bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-bold text-white flex items-center gap-1.5"
                            >
                              {isExpanded ? t("Hide Script", "Ocultar Guión") : t("View Script", "Ver Guión")}
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>

                            {hasAdminAccess && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsEditingAsset(asset);
                                    setAssetTitle(asset.title);
                                    setAssetContent(asset.content);
                                    setAssetType(asset.asset_type);
                                    setAssetLanguage(asset.language);
                                    setAssetStatus(asset.status);
                                    setShowAssetModal(true);
                                  }}
                                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-white"
                                  title={t("Edit Asset", "Editar Recurso")}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => asset.id && handleDeleteAsset(asset.id)}
                                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                                  title={t("Delete Asset", "Eliminar Recurso")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 border-t border-white/5 bg-[#121212]/50">
                            <div className="rounded-xl border border-white/5 bg-[#121212] p-4 text-xs leading-relaxed text-[#94A3B8] whitespace-pre-wrap font-sans">
                              {asset.content}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ASSET CREATION / EDIT MODAL */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-display font-black text-lg text-white">
                {isEditingAsset ? t("Edit Sales Asset", "Editar Recurso de Venta") : t("Create Sales Asset", "Crear Recurso de Venta")}
              </h3>
              <button
                type="button"
                onClick={() => setShowAssetModal(false)}
                className="text-[#64748B] hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSaveAsset} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* AI Auto Generation Box */}
              {!isEditingAsset && (
                <div className="rounded-xl border border-[#FF5722]/30 bg-[#FF5722]/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#FF5722]" />
                    <span className="text-xs font-bold text-white">
                      {t("AI Smart Script Generator", "Generador Inteligente de Guiones")}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    {t(
                      "Generate a custom sales script instantly using your Company Intelligence Profile context, tone guidelines, products, and compliance requirements.",
                      "Genere un guión adaptado al perfil, tono, productos y reglas de cumplimiento de su empresa."
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateAsset}
                    disabled={isGenerating}
                    className="w-full rounded-xl bg-[#FF5722]/20 hover:bg-[#FF5722]/30 border border-[#FF5722]/40 py-2.5 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
                  >
                    {isGenerating ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-[#FFD54F]" />
                    )}
                    {isGenerating ? t("Generating AI Script...", "Generando Guión...") : t("Auto-Generate Content", "Auto-Generar Contenido")}
                  </button>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  {t("Asset Title", "Título del Recurso")}
                </label>
                <input
                  type="text"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                  placeholder={t("e.g. Standard D2D Opener", "ej. Abridor D2D Estándar")}
                  required
                />
              </div>

              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                    {t("Asset Type", "Tipo de Recurso")}
                  </label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                  >
                    <option value="door_knock">{t("Door Knock", "Puerta Fría")}</option>
                    <option value="cold_call">{t("Cold Call", "Llamada Fría")}</option>
                    <option value="zoom_in_home">{t("Zoom In-Home", "Presentación In-Home")}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                    {t("Language", "Idioma")}
                  </label>
                  <select
                    value={assetLanguage}
                    onChange={(e) => setAssetLanguage(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                  >
                    <option value="en">{t("English", "Inglés")}</option>
                    <option value="es">{t("Spanish", "Español")}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                    {t("Status", "Estado")}
                  </label>
                  <select
                    value={assetStatus}
                    onChange={(e) => setAssetStatus(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#121212] px-3 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50"
                  >
                    <option value="draft">{t("Draft", "Borrador")}</option>
                    <option value="approved">{t("Approved", "Aprobado")}</option>
                    <option value="archived">{t("Archived", "Archivado")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                  {t("Script Content (Markdown Supported)", "Contenido del Guión (Soporta Markdown)")}
                </label>
                <textarea
                  value={assetContent}
                  onChange={(e) => setAssetContent(e.target.value)}
                  rows={10}
                  className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-[#CBD5E1] outline-none focus:border-[#FF5722]/50 font-mono"
                  placeholder={t("Write script content here or use the generator above...", "Escriba el guión aquí o use el generador de arriba...")}
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAssetModal(false)}
                  className="rounded-xl border border-white/15 bg-transparent px-5 py-3 text-xs font-bold text-[#CBD5E1] hover:bg-white/5"
                >
                  {t("Cancel", "Cancelar")}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FF5722] hover:bg-[#E64A19] px-5 py-3 text-xs font-bold text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]"
                >
                  {t("Save Asset", "Guardar Recurso")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}

