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
  Phone, Video, Trash2, Plus, Edit3, BookOpen, ChevronDown, ChevronUp, Copy,
  Users, ArrowRight, ChevronLeft
} from "lucide-react"
import { useState, useEffect } from "react"

type TabType = "setup" | "profile" | "integrations" | "assets"

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

interface ReadinessCheckpoint {
  completed: boolean
  score: number
  details: string
}

interface ReadinessData {
  company_id: string
  readiness_score: number
  setup_completed: boolean
  setup_dismissed: boolean
  current_step: number
  checkpoints: {
    profile: ReadinessCheckpoint
    integration: ReadinessCheckpoint
    roster: ReadinessCheckpoint
    assets: ReadinessCheckpoint
  }
  checklist_manual_overrides: Record<string, boolean>
  last_calculated_at?: string
}

interface SetupState {
  company_id: string
  current_step: number
  setup_completed: boolean
  setup_dismissed: boolean
  checklist_manual_overrides: Record<string, boolean>
  readiness_score: number
  last_updated_at?: string
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
  const [activeTab, setActiveTab] = useState<TabType>("setup")
  const [copiedAssetId, setCopiedAssetId] = useState<number | null>(null)

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedAssetId(id)
    setTimeout(() => setCopiedAssetId(null), 2000)
  }


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
  
  // Setup Wizard States
  const [wizardStep, setWizardStep] = useState<number>(1)
  const [readiness, setReadiness] = useState<ReadinessData | null>(null)
  const [setupState, setSetupState] = useState<SetupState | null>(null)
  const [loadingReadiness, setLoadingReadiness] = useState(false)
  const [updatingSetup, setUpdatingSetup] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  
  // Step 6: Member Creation States
  const [newMemberUsername, setNewMemberUsername] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("sales_rep")
  const [newMemberLang, setNewMemberLang] = useState("en")
  const [createdMemberTempCreds, setCreatedMemberTempCreds] = useState<{ username: string; temp_password: string } | null>(null)
  const [creatingMember, setCreatingMember] = useState(false)

  // Step 5: Asset Generation States
  const [generatingAssets, setGeneratingAssets] = useState(false)
  const [duplicateAssetsWarning, setDuplicateAssetsWarning] = useState(false)
  const [existingAssetsList, setExistingAssetsList] = useState<CompanySalesAsset[]>([])
  
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

  // Redirect sales reps away from /settings/company to their scripts library
  useEffect(() => {
    if (user && user.role === "sales_rep") {
      window.location.href = "/my-training/scripts"
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

  const fetchReadinessAndSetup = async () => {
    if (!hasAdminAccess) return
    try {
      setLoadingReadiness(true)
      const readinessData = await api.get<ReadinessData>(`/api/v1/companies/${companyId}/readiness`, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setReadiness(readinessData)

      const setupData = await api.get<SetupState>(`/api/v1/companies/${companyId}/setup`, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setSetupState(setupData)
      
      const params = new URLSearchParams(window.location.search)
      if (!params.has("step")) {
        setWizardStep(setupData.current_step || 1)
      }

      if (!setupData.setup_completed && !localStorage.getItem(`dismissed_welcome_${companyId}`)) {
        setShowWelcomeModal(true)
      }
    } catch (err: any) {
      console.error("Error fetching readiness & setup state:", err)
    } finally {
      setLoadingReadiness(false)
    }
  }

  // Parse URL parameters for deep-linking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")
      const stepParam = params.get("step")
      if (tabParam === "setup" || tabParam === "profile" || tabParam === "integrations" || tabParam === "assets") {
        setActiveTab(tabParam as TabType)
      }
      if (stepParam) {
        const stepNum = parseInt(stepParam, 10)
        if (stepNum >= 1 && stepNum <= 7) {
          setWizardStep(stepNum)
        }
      }
    }
  }, [])

  // Fetch readiness and setup state on mount & companyId changes
  useEffect(() => {
    if (user && hasAdminAccess) {
      fetchReadinessAndSetup()
    }
  }, [user, companyId, hasAdminAccess])

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

  // Setup Wizard Handlers
  const handleWizardStepChange = async (nextStep: number) => {
    try {
      setUpdatingSetup(true)
      await api.post(`/api/v1/companies/${companyId}/setup`, {
        current_step: nextStep
      }, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setWizardStep(nextStep)
      if (setupState) {
        setSetupState({
          ...setupState,
          current_step: nextStep
        })
      }
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.set("tab", "setup")
        url.searchParams.set("step", nextStep.toString())
        window.history.pushState({}, "", url.pathname + url.search)
      }
      await fetchReadinessAndSetup()
    } catch (err) {
      console.error("Failed to update step:", err)
    } finally {
      setUpdatingSetup(false)
    }
  }

  const handleToggleOverride = async (checkpoint: string, currentVal: boolean) => {
    try {
      setUpdatingSetup(true)
      const currentOverrides = readiness?.checklist_manual_overrides || {}
      const updatedOverrides = {
        ...currentOverrides,
        [checkpoint]: !currentVal
      }
      
      await api.post(`/api/v1/companies/${companyId}/setup`, {
        checklist_manual_overrides: updatedOverrides
      }, {
        headers: { "X-User-Id": user?.username || "" }
      })
      await fetchReadinessAndSetup()
    } catch (err: any) {
      console.error("Failed to toggle override:", err)
    } finally {
      setUpdatingSetup(false)
    }
  }

  const handleStep1Save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAdminAccess) return
    try {
      setSavingProfile(true)
      setAlert(null)
      const payload = {
        company_overview: profile.company_overview,
        website_url: profile.website_url
      }
      const updated = await api.put<ProfileData>(`/api/v1/companies/${companyId}/profile`, payload, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setProfile(prev => ({ ...prev, ...updated }))
      setAiContextPreview(null)
      await handleWizardStepChange(2)
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to save: ${err.message}`, `Error al guardar: ${err.message}`)
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleStep2Save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAdminAccess) return
    try {
      setSavingProfile(true)
      setAlert(null)
      const payload = {
        states_served: statesInput.split(",").map(s => s.trim()).filter(Boolean),
        target_segments: segmentsInput.split(",").map(s => s.trim()).filter(Boolean),
        brand_voice: voiceInput.split(",").map(s => s.trim()).filter(Boolean)
      }
      const updated = await api.put<ProfileData>(`/api/v1/companies/${companyId}/profile`, payload, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setProfile(prev => ({ ...prev, ...updated }))
      setAiContextPreview(null)
      await handleWizardStepChange(3)
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to save: ${err.message}`, `Error al guardar: ${err.message}`)
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleStep3Save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAdminAccess) return
    try {
      setSavingProfile(true)
      setAlert(null)
      const payload = {
        key_products: productsInput.split(",").map(s => s.trim()).filter(Boolean),
        objections_handled: profile.objections_handled
      }
      const updated = await api.put<ProfileData>(`/api/v1/companies/${companyId}/profile`, payload, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setProfile(prev => ({ ...prev, ...updated }))
      setAiContextPreview(null)
      await handleWizardStepChange(4)
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to save: ${err.message}`, `Error al guardar: ${err.message}`)
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleStep4Save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAdminAccess) return
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
      const existing = integrationsList.find(i => i.provider === selectedProvider)
      if (existing && existing.id) {
        await api.put(`/api/v1/companies/${companyId}/integrations/${existing.id}`, payload, {
          headers: { "X-User-Id": user?.username || "" }
        })
      } else {
        await api.post(`/api/v1/companies/${companyId}/integrations`, payload, {
          headers: { "X-User-Id": user?.username || "" }
        })
      }
      const integrationsRes = await api.get<IntegrationData[]>(`/api/v1/companies/${companyId}/integrations`, {
        headers: { "X-User-Id": user?.username || "" }
      })
      setIntegrationsList(integrationsRes)
      const newlySaved = integrationsRes.find(i => i.provider === selectedProvider)
      if (newlySaved) {
        setIntegrationCreds(newlySaved.credentials_preview || "")
      }
      await handleWizardStepChange(5)
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to save: ${err.message}`, `Error al guardar: ${err.message}`)
      })
    } finally {
      setSavingIntegration(false)
    }
  }

  const handleGenerateAIScripts = async (force = false) => {
    try {
      setGeneratingAssets(true)
      setAlert(null)
      if (!force) {
        const currentAssets = await api.get<CompanySalesAsset[]>(`/api/v1/companies/${companyId}/assets`, {
          headers: { "X-User-Id": user?.username || "" }
        })
        const hasExisting = currentAssets.some(a => 
          ["door_knock", "cold_call", "objection_library"].includes(a.asset_type)
        )
        if (hasExisting) {
          setExistingAssetsList(currentAssets)
          setDuplicateAssetsWarning(true)
          setGeneratingAssets(false)
          return
        }
      }
      setDuplicateAssetsWarning(false)
      const typesToGenerate = ["door_knock", "cold_call", "objection_library"]
      for (const assetType of typesToGenerate) {
        try {
          await api.post(`/api/v1/companies/${companyId}/assets/generate`, {
            asset_type: assetType,
            language: isSpanish ? "es" : "en"
          }, {
            headers: { "X-User-Id": user?.username || "" }
          })
        } catch (genErr) {
          console.error(`Failed to generate ${assetType}:`, genErr)
        }
      }
      await fetchAssets()
      setAlert({
        type: "success",
        message: t("AI sales scripts generated successfully!", "¡Guiones de ventas de IA generados exitosamente!")
      })
      await handleWizardStepChange(6)
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to generate scripts: ${err.message}`, `Error al generar guiones: ${err.message}`)
      })
    } finally {
      setGeneratingAssets(false)
    }
  }

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAdminAccess) return
    try {
      setCreatingMember(true)
      setAlert(null)
      setCreatedMemberTempCreds(null)
      const payload = {
        username: newMemberUsername.trim(),
        email: newMemberEmail.trim() || undefined,
        role: newMemberRole,
        language_preference: newMemberLang
      }
      const res = await api.post<{ status: string; username: string; temp_password?: string; invite_code?: string }>(
        `/api/v1/companies/${companyId}/members`,
        payload,
        {
          headers: { "X-User-Id": user?.username || "" }
        }
      )
      setAlert({
        type: "success",
        message: t("Member created successfully!", "¡Miembro creado con éxito!")
      })
      if (res.temp_password) {
        setCreatedMemberTempCreds({
          username: res.username,
          temp_password: res.temp_password
        })
      }
      setNewMemberUsername("")
      setNewMemberEmail("")
      fetchReadinessAndSetup()
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to create member: ${err.message}`, `Error al crear miembro: ${err.message}`)
      })
    } finally {
      setCreatingMember(false)
    }
  }

  const handleLaunchCompany = async () => {
    try {
      setUpdatingSetup(true)
      setAlert(null)
      await api.post(`/api/v1/companies/${companyId}/setup`, {
        setup_completed: true,
        current_step: 7
      }, {
        headers: { "X-User-Id": user?.username || "" }
      })
      await fetchReadinessAndSetup()
      setAlert({
        type: "success",
        message: t("Company launched successfully! Training Center is now live.", "¡Empresa lanzada con éxito! El Centro de Entrenamiento ya está activo.")
      })
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (err: any) {
      setAlert({
        type: "error",
        message: t(`Failed to launch company: ${err.message}`, `Error al lanzar la empresa: ${err.message}`)
      })
    } finally {
      setUpdatingSetup(false)
    }
  }

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAdminAccess) return // Guard

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
                  onClick={() => { setActiveTab("setup"); setAlert(null) }}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full whitespace-nowrap shrink-0",
                    activeTab === "setup"
                      ? "bg-[#FF5722]/10 border border-[#FF5722]/30 text-[#FF5722]"
                      : "border border-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <CheckCircle className="h-4 w-4 shrink-0 text-[#FF5722]" />
                  {t("Enterprise Setup Wizard", "Asistente de Configuración")}
                </button>

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


          {/* TAB CONTENT: SETUP WIZARD */}
          {activeTab === "setup" && (
            <div className="space-y-6">
              {/* Wizard Progress Header */}
              <div className="rounded-2xl border border-white/5 bg-[#1B1B1B]/80 backdrop-blur-md p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-black text-2xl text-white flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-[#FF5722]" />
                      {t("Enterprise Setup Wizard", "Asistente de Configuración")}
                    </h3>
                    <p className="text-sm text-[#94A3B8] mt-1">
                      {t("Complete these 7 quick steps to configure your enterprise and launch training.", "Complete estos 7 pasos rápidos para configurar su empresa y lanzar el entrenamiento.")}
                    </p>
                  </div>
                  
                  {/* Premium Onboarding score card */}
                  <div className="bg-[#121212]/90 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="relative h-14 w-14 flex items-center justify-center">
                      <svg className="absolute inset-0 h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-white/5"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#FF5722] transition-all duration-500 ease-out"
                          strokeWidth="3.5"
                          strokeDasharray={`${readiness?.readiness_score || 0}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="font-display font-black text-sm text-white">{readiness?.readiness_score || 0}%</span>
                    </div>
                    <div>
                      <div className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">{t("Readiness Score", "Puntaje de Preparación")}</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {readiness?.readiness_score === 100 
                          ? t("Ready to Launch!", "¡Listo para Lanzar!")
                          : t("Onboarding In Progress", "Configuración en Curso")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7-Step Navigation Indicator */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 border-t border-white/5 pt-6">
                  {[
                    { step: 1, label: t("Basics", "Conceptos"), key: "profile" },
                    { step: 2, label: t("Process", "Proceso"), key: "profile" },
                    { step: 3, label: t("Products", "Productos"), key: "profile" },
                    { step: 4, label: t("CRM", "CRM"), key: "integration" },
                    { step: 5, label: t("AI Gen", "Generación"), key: "assets" },
                    { step: 6, label: t("Invite", "Invitar"), key: "roster" },
                    { step: 7, label: t("Launch", "Lanzamiento"), key: "launch" }
                  ].map((s) => {
                    const isCurrent = wizardStep === s.step
                    const isCompleted = 
                      (s.step === 1 && (profile.company_overview?.length || 0) > 10) ||
                      (s.step === 2 && (statesInput || segmentsInput || voiceInput)) ||
                      (s.step === 3 && (productsInput || profile.objections_handled)) ||
                      (s.step === 4 && readiness?.checkpoints.integration.completed) ||
                      (s.step === 5 && (assets.length > 0 || readiness?.checkpoints.assets.completed)) ||
                      (s.step === 6 && (readiness?.checkpoints.roster.completed)) ||
                      (s.step === 7 && (readiness?.setup_completed))

                    return (
                      <button
                        key={s.step}
                        onClick={() => handleWizardStepChange(s.step)}
                        className={cn(
                          "flex flex-col items-center p-2.5 rounded-xl border text-center transition-all duration-200",
                          isCurrent 
                            ? "bg-[#FF5722]/10 border-[#FF5722] text-white"
                            : isCompleted 
                              ? "bg-emerald-500/5 border-emerald-500/20 text-[#CBD5E1] hover:bg-emerald-500/10"
                              : "bg-[#121212]/50 border-white/5 text-[#94A3B8] hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold mb-1.5",
                          isCurrent 
                            ? "bg-[#FF5722] text-white"
                            : isCompleted 
                              ? "bg-emerald-500 text-white"
                              : "bg-white/5 text-[#94A3B8]"
                        )}>
                          {isCompleted ? <Check className="h-3.5 w-3.5" /> : s.step}
                        </div>
                        <span className="text-xs font-semibold whitespace-nowrap">{s.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step Forms */}
              <div className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-6 space-y-6">
                
                {/* STEP 1: COMPANY BASICS */}
                {wizardStep === 1 && (
                  <form onSubmit={handleStep1Save} className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-[#FF5722]" />
                        {t("Step 1: Company Basics", "Paso 1: Conceptos Básicos")}
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {t("Provide basic information about your company name, website, and an overview of operations.", "Proporcione detalles sobre su empresa, sitio web y visión general de operaciones.")}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                          {t("Company Overview / Pitch", "Visión General / Presentación")}
                        </label>
                        <textarea
                          value={profile.company_overview || ""}
                          onChange={(e) => setProfile({ ...profile, company_overview: e.target.value })}
                          rows={4}
                          className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF5722] focus:outline-none"
                          placeholder={t("e.g. SeptiVolt is a premier residential solar provider specializing in high-efficiency panel packages...", "ej. SeptiVolt es un proveedor líder de energía solar residencial...")}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                          {t("Company Website URL", "Sitio Web de la Empresa")}
                        </label>
                        <input
                          type="url"
                          value={profile.website_url || ""}
                          onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                          className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF5722] focus:outline-none"
                          placeholder="https://septivolt.com"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => handleWizardStepChange(2)}
                        className="text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                      >
                        {t("Skip for now (keeps checkpoint incomplete)", "Omitir por ahora")}
                      </button>
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                      >
                        {savingProfile ? t("Saving...", "Guardando...") : t("Save & Continue", "Guardar y Continuar")}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: SALES PROCESS */}
                {wizardStep === 2 && (
                  <form onSubmit={handleStep2Save} className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-[#FF5722]" />
                        {t("Step 2: Sales Process & Territory", "Paso 2: Proceso de Venta y Territorio")}
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {t("Specify where you sell, who you sell to, and the tone your reps should project.", "Defina dónde vende, a quién le vende y el tono de marca que deben usar sus representantes.")}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                          {t("States Served (comma separated)", "Estados de Servicio (separados por coma)")}
                        </label>
                        <input
                          type="text"
                          value={statesInput}
                          onChange={(e) => setStatesInput(e.target.value)}
                          className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF5722] focus:outline-none"
                          placeholder="CA, TX, FL"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                          {t("Target Customer Segments (comma separated)", "Segmentos de Cliente Objetivo")}
                        </label>
                        <input
                          type="text"
                          value={segmentsInput}
                          onChange={(e) => setSegmentsInput(e.target.value)}
                          className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF5722] focus:outline-none"
                          placeholder="Suburban Homeowners, High-utility payers, NEM 3.0 affected areas"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                          {t("Brand Voice / Tone Traits (comma separated)", "Tono de Marca (separado por coma)")}
                        </label>
                        <input
                          type="text"
                          value={voiceInput}
                          onChange={(e) => setVoiceInput(e.target.value)}
                          className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF5722] focus:outline-none"
                          placeholder="Professional, Educative, Direct, Friendly"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => handleWizardStepChange(1)}
                        className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t("Previous", "Anterior")}
                      </button>
                      
                      <div className="flex gap-4 items-center">
                        <button
                          type="button"
                          onClick={() => handleWizardStepChange(3)}
                          className="text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                        >
                          {t("Skip for now", "Omitir")}
                        </button>
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                        >
                          {savingProfile ? t("Saving...", "Guardando...") : t("Save & Continue", "Guardar y Continuar")}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* STEP 3: PRODUCTS & MARKETS */}
                {wizardStep === 3 && (
                  <form onSubmit={handleStep3Save} className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-[#FF5722]" />
                        {t("Step 3: Products & Objection Handling", "Paso 3: Productos y Manejo de Objeciones")}
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {t("Detail your product catalog and common objections or compliance guidelines.", "Detalle su catálogo de productos y objeciones comunes o directrices de cumplimiento.")}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                          {t("Key Products / Equipment Offered (comma separated)", "Productos Clave / Equipos")}
                        </label>
                        <input
                          type="text"
                          value={productsInput}
                          onChange={(e) => setProductsInput(e.target.value)}
                          className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF5722] focus:outline-none"
                          placeholder="Tesla Powerwall 3, REC Alpha Panels, Enphase Microinverters"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                          {t("Common Objections and Rep Responses", "Objeciones Comunes y Respuestas")}
                        </label>
                        <textarea
                          value={profile.objections_handled || ""}
                          onChange={(e) => setProfile({ ...profile, objections_handled: e.target.value })}
                          rows={4}
                          className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF5722] focus:outline-none"
                          placeholder={t("e.g. When homeowners object that solar is 'too expensive', we emphasize utility bill offset and zero-down financing options...", "ej. Cuando los clientes dicen que es muy costoso, enfatizamos el financiamiento inicial de $0...")}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => handleWizardStepChange(2)}
                        className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t("Previous", "Anterior")}
                      </button>
                      
                      <div className="flex gap-4 items-center">
                        <button
                          type="button"
                          onClick={() => handleWizardStepChange(4)}
                          className="text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                        >
                          {t("Skip for now", "Omitir")}
                        </button>
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                        >
                          {savingProfile ? t("Saving...", "Guardando...") : t("Save & Continue", "Guardar y Continuar")}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* STEP 4: CRM / INTEGRATION SETUP */}
                {wizardStep === 4 && (
                  <form onSubmit={handleStep4Save} className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-[#FF5722]" />
                        {t("Step 4: CRM / Integration Setup", "Paso 4: Configuración de CRM e Integración")}
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {t("Connect SeptiVolt to your CRM (GoHighLevel, HubSpot, Webhooks) to sync user scores, contacts, and logs dynamically.", "Conecte SeptiVolt a su CRM para sincronizar dinámicamente resultados y contactos.")}
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                            {t("Select Integration Provider", "Seleccione Proveedor")}
                          </label>
                          <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white focus:border-[#FF5722] focus:outline-none"
                          >
                            <option value="gohighlevel">GoHighLevel (GHL)</option>
                            <option value="hubspot">HubSpot</option>
                            <option value="custom_webhook">Custom Webhook</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1.5">
                            {selectedProvider === "custom_webhook" 
                              ? t("Webhook URL", "URL de Webhook")
                              : t("API Key / Connection Token", "Clave API / Token de Conexión")}
                          </label>
                          <input
                            type="text"
                            value={selectedProvider === "custom_webhook" ? integrationWebhookUrl : integrationCreds}
                            onChange={(e) => {
                              if (selectedProvider === "custom_webhook") {
                                setIntegrationWebhookUrl(e.target.value)
                              } else {
                                setIntegrationCreds(e.target.value)
                              }
                            }}
                            className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-[#FF5722] focus:outline-none"
                            placeholder={selectedProvider === "custom_webhook" ? "https://yourserver.com/webhook" : "ghl_api_key_..."}
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="wizard-sync-enabled"
                            checked={syncEnabled}
                            onChange={(e) => setSyncEnabled(e.target.checked)}
                            className="h-4.5 w-4.5 rounded border-white/10 bg-[#121212] text-[#FF5722] focus:ring-0"
                          />
                          <label htmlFor="wizard-sync-enabled" className="text-sm font-semibold text-[#CBD5E1]">
                            {t("Enable active background sync", "Activar sincronización en segundo plano")}
                          </label>
                        </div>
                      </div>

                      {/* Sync preferences panel */}
                      <div className="bg-[#121212]/50 border border-white/5 rounded-2xl p-4 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                          {t("Sync Actions", "Acciones de Sincronización")}
                        </span>
                        
                        {Object.entries(syncPreferences).map(([prefName, isEnabled]) => (
                          <div key={prefName} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                            <span className="text-xs text-[#CBD5E1] pr-2">{prefName}</span>
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => {
                                setSyncPreferences({
                                  ...syncPreferences,
                                  [prefName]: !isEnabled
                                })
                              }}
                              className="h-4 w-4 rounded border-white/10 bg-[#121212] text-[#FF5722] focus:ring-0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => handleWizardStepChange(3)}
                        className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t("Previous", "Anterior")}
                      </button>
                      
                      <div className="flex gap-4 items-center">
                        <button
                          type="button"
                          onClick={() => handleWizardStepChange(5)}
                          className="text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                        >
                          {t("Skip for now", "Omitir")}
                        </button>
                        <button
                          type="submit"
                          disabled={savingIntegration}
                          className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                        >
                          {savingIntegration ? t("Connecting...", "Conectando...") : t("Connect & Continue", "Conectar y Continuar")}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* STEP 5: GENERATE SALES ASSETS */}
                {wizardStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#FF5722]" />
                        {t("Step 5: Generate AI Sales Assets & Scripts", "Paso 5: Generar Recursos y Guiones de Venta con IA")}
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {t("Auto-generate localized high-converting scripts based on your profile config.", "Genere guiones localizados de alta conversión basados en su perfil de empresa.")}
                      </p>
                    </div>

                    {/* Warning popup for duplicates */}
                    {duplicateAssetsWarning ? (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-[#F59E0B] space-y-3">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          {t("Scripts Already Exist", "Los Guiones ya Existen")}
                        </div>
                        <p className="text-xs text-[#CBD5E1]">
                          {t("Approved or draft scripts already exist in your script library. Do you want to generate a new draft anyway, or keep existing scripts and proceed?", "Ya existen guiones aprobados o borradores en su biblioteca. ¿Desea generar nuevos borradores de todos modos o conservar los actuales?")}
                        </p>
                        <div className="flex gap-4 pt-1">
                          <button
                            onClick={() => handleGenerateAIScripts(true)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors"
                          >
                            {t("Generate New Draft anyway", "Generar Borrador")}
                          </button>
                          <button
                            onClick={() => handleWizardStepChange(6)}
                            className="bg-[#262626] hover:bg-[#333333] border border-white/5 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors"
                          >
                            {t("Keep Existing & Proceed", "Conservar y Continuar")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#121212]/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                          <Cpu className="h-6 w-6 text-[#FF5722]" />
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-sm">{t("Automated AI Script Scaffolding", "Andamiaje Automatizado de IA")}</h5>
                          <p className="text-xs text-[#94A3B8] max-w-md mt-1">
                            {t("SeptiVolt will create customized scripts for door-knocking, cold calling, and a full objection handling guide tailored specifically to your company profile.", "SeptiVolt creará guiones personalizados para cambaceo, llamadas en frío y manejo de objeciones.")}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={generatingAssets}
                          onClick={() => handleGenerateAIScripts(false)}
                          className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                        >
                          {generatingAssets ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              {t("Generating Enterprise Assets...", "Generando Recursos de Empresa...")}
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              {t("Generate Scripts & Continue", "Generar Guiones y Continuar")}
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => handleWizardStepChange(4)}
                        className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t("Previous", "Anterior")}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleWizardStepChange(6)}
                        className="text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                      >
                        {t("Skip for now", "Omitir")}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: INVITE TEAM MEMBERS */}
                {wizardStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#FF5722]" />
                        {t("Step 6: Invite Team Members & Reps", "Paso 6: Invitar a Miembros del Equipo")}
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {t("Create secure user records for your managers and sales representatives.", "Cree cuentas de usuario seguras para sus gerentes y representantes de ventas.")}
                      </p>
                    </div>

                    {/* Temporary password alert banner */}
                    {createdMemberTempCreds && (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-400 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                          {t("Temporary Password Generated!", "¡Contraseña Temporal Generada!")}
                        </div>
                        <p className="text-xs text-[#CBD5E1]">
                          {t("Please share this temporary password with the user. They will be forced to reset it upon their first sign-in:", "Por favor comparta esta contraseña con el usuario. Se le pedirá cambiarla al iniciar sesión:")}
                        </p>
                        <div className="bg-[#121212] p-3 rounded-lg border border-white/5 font-mono text-xs flex justify-between items-center text-white mt-1">
                          <div>
                            <div><span className="text-[#94A3B8]">{t("Username", "Usuario")}:</span> {createdMemberTempCreds.username}</div>
                            <div className="mt-1"><span className="text-[#94A3B8]">{t("Password", "Contraseña")}:</span> {createdMemberTempCreds.temp_password}</div>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `Username: ${createdMemberTempCreds.username}\nTemporary Password: ${createdMemberTempCreds.temp_password}`
                              )
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white text-xs px-2.5 py-1.5 rounded-md font-semibold transition-colors"
                          >
                            {t("Copy Creds", "Copiar")}
                          </button>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleCreateMember} className="grid gap-6 md:grid-cols-2 bg-[#121212]/40 border border-white/5 rounded-2xl p-5">
                      <div className="space-y-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                          {t("Invite New User", "Invitar Nuevo Usuario")}
                        </span>
                        
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                            {t("Username", "Nombre de Usuario")}
                          </label>
                          <input
                            type="text"
                            value={newMemberUsername}
                            onChange={(e) => setNewMemberUsername(e.target.value)}
                            className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-2.5 text-sm text-white focus:border-[#FF5722] focus:outline-none"
                            placeholder="johndoe"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                            {t("Email (Optional)", "Correo Electrónico (Opcional)")}
                          </label>
                          <input
                            type="email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-2.5 text-sm text-white focus:border-[#FF5722] focus:outline-none"
                            placeholder="john@septivolt.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                          {t("Role & Language Settings", "Configuración de Rol e Idioma")}
                        </span>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                            {t("User Role", "Rol del Usuario")}
                          </label>
                          <select
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                            className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-2.5 text-sm text-white focus:border-[#FF5722] focus:outline-none"
                          >
                            <option value="sales_rep">{t("Sales Rep", "Representante de Ventas")}</option>
                            <option value="manager">{t("Manager", "Gerente")}</option>
                            <option value="admin">{t("Admin", "Administrador")}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                            {t("Language Preference", "Idioma de Preferencia")}
                          </label>
                          <select
                            value={newMemberLang}
                            onChange={(e) => setNewMemberLang(e.target.value)}
                            className="w-full rounded-xl border border-white/5 bg-[#121212] px-4 py-2.5 text-sm text-white focus:border-[#FF5722] focus:outline-none"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                          </select>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={creatingMember}
                            className="w-full flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                          >
                            {creatingMember ? t("Adding Member...", "Agregando Miembro...") : t("Add Team Member", "Agregar Miembro")}
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => handleWizardStepChange(5)}
                        className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t("Previous", "Anterior")}
                      </button>
                      
                      <div className="flex gap-4 items-center">
                        <button
                          type="button"
                          onClick={() => handleWizardStepChange(7)}
                          className="text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                        >
                          {t("Skip for now", "Omitir")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWizardStepChange(7)}
                          className="flex items-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                        >
                          {t("Continue to Launch", "Continuar al Lanzamiento")}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: REVIEW & LAUNCH */}
                {wizardStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        {t("Step 7: Enterprise Launch Readiness", "Paso 7: Lanzamiento y Preparación")}
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        {t("Review each checkpoint status below. You can manually bypass incomplete steps if you want to launch immediately.", "Revise los puntos clave de preparación. Puede omitir manualmente pasos pendientes si desea lanzar ya.")}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Checkpoint list */}
                      {[
                        {
                          id: "profile",
                          title: t("Company Profile", "Perfil de Empresa"),
                          data: readiness?.checkpoints.profile,
                          overrideText: t("Bypass Profile Check", "Omitir Control de Perfil")
                        },
                        {
                          id: "integration",
                          title: t("CRM Integration", "Integración CRM"),
                          data: readiness?.checkpoints.integration,
                          overrideText: t("Bypass Integration Check", "Omitir Control de Integración")
                        },
                        {
                          id: "roster",
                          title: t("Team Roster", "Lista del Equipo"),
                          data: readiness?.checkpoints.roster,
                          overrideText: t("Bypass Roster Check", "Omitir Control de Lista")
                        },
                        {
                          id: "assets",
                          title: t("Sales Assets & Scripts", "Recursos de Venta"),
                          data: readiness?.checkpoints.assets,
                          overrideText: t("Bypass Scripts Check", "Omitir Control de Guiones")
                        }
                      ].map((cp) => {
                        const isOverridden = !!readiness?.checklist_manual_overrides[cp.id]
                        const isOk = cp.data?.completed || isOverridden

                        return (
                          <div
                            key={cp.id}
                            className={cn(
                              "rounded-2xl border p-4.5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-200",
                              isOk 
                                ? "bg-emerald-500/5 border-emerald-500/10 text-white" 
                                : "bg-white/3 border-white/5 text-white"
                            )}
                          >
                            <div className="flex items-start gap-3.5">
                              <div className={cn(
                                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                                isOk ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-[#94A3B8]"
                              )}>
                                {isOk ? <Check className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                              </div>
                              <div>
                                <div className="text-sm font-bold flex items-center gap-2">
                                  {cp.title}
                                  {isOverridden && (
                                    <span className="text-[10px] uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-black">
                                      {t("Bypassed", "Bypass")}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-[#94A3B8] mt-1">{cp.data?.details}</div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleOverride(cp.id, isOverridden)}
                              className={cn(
                                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border shrink-0 text-center",
                                isOverridden
                                  ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20"
                                  : "bg-white/5 border-white/5 text-[#CBD5E1] hover:bg-white/10 hover:text-white"
                              )}
                            >
                              {isOverridden ? t("Enable Checkpoint", "Activar Control") : cp.overrideText}
                            </button>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => handleWizardStepChange(6)}
                        className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white font-semibold transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t("Previous", "Anterior")}
                      </button>
                      
                      <button
                        type="button"
                        disabled={updatingSetup}
                        onClick={handleLaunchCompany}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-emerald-500/10 border border-emerald-400/20"
                      >
                        <Check className="h-4 w-4" />
                        {t("Launch Training Center", "Lanzar Centro de Entrenamiento")}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}


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
                              {asset.asset_type === "objection_library" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
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
                          <div className="px-5 pb-5 pt-3 border-t border-white/5 bg-[#121212]/50 space-y-2">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => asset.id && copyToClipboard(asset.content, asset.id)}
                                className="rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-[10px] font-hud uppercase tracking-wider font-bold text-[#94A3B8] hover:text-white flex items-center gap-1 transition-all"
                              >
                                {copiedAssetId === asset.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-green-400" />
                                    {t("Copied!", "Copiado!")}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5 text-[#FF5722]" />
                                    {t("Copy Script", "Copiar Guión")}
                                  </>
                                )}
                              </button>
                            </div>
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

      {/* FIRST-TIME WELCOME MODAL */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-[#1A1A1A] border border-[#FF5722]/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Ambient gold/orange orb */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#FF5722]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col items-center text-center space-y-4 relative">
              <div className="h-12 w-12 rounded-full bg-[#FF5722]/10 flex items-center justify-center border border-[#FF5722]/20">
                <Sparkles className="h-6 w-6 text-[#FF5722]" />
              </div>
              
              <div>
                <h3 className="font-display font-black text-xl text-white">
                  {t("Welcome to SeptiVolt Enterprise!", "¡Bienvenido a SeptiVolt Enterprise!")}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1.5 max-w-sm">
                  {t("Let's configure your training portal to prepare your sales representatives for high-performance solar sales.", "Configuremos su portal de capacitación para preparar a sus representantes para ventas de alto rendimiento.")}
                </p>
              </div>

              {/* Steps Overview list */}
              <div className="w-full text-left bg-[#121212]/50 border border-white/5 rounded-xl p-4 space-y-3.5 mt-2">
                {[
                  {
                    num: "1",
                    title: t("Profile & Sales Process", "Perfil y Proceso de Ventas"),
                    desc: t("Set up company pitch, target markets, products & voice.", "Defina el tono, los mercados, los productos y el pitch.")
                  },
                  {
                    num: "2",
                    title: t("CRM Integration Setup", "Configuración de Integración CRM"),
                    desc: t("Sync training scores and contact logs to GHL or HubSpot.", "Sincronice puntajes y registros con GHL o HubSpot.")
                  },
                  {
                    num: "3",
                    title: t("AI Script Scaffold", "Andamiaje de Guiones con IA"),
                    desc: t("Generate customized pitch scripts and objection handling guides.", "Genere guiones y guías de manejo de objeciones personalizados.")
                  },
                  {
                    num: "4",
                    title: t("Invite Team & Launch", "Invitar Equipo y Lanzamiento"),
                    desc: t("Register managers/reps and unlock the training simulator.", "Registre gerentes/representantes y active el simulador.")
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="h-5 w-5 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/20 text-[#FF5722] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.num}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.title}</div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex w-full gap-3 pt-4">
                <button
                  onClick={() => {
                    localStorage.setItem(`dismissed_welcome_${companyId}`, "true")
                    setShowWelcomeModal(false)
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[#CBD5E1] text-xs font-bold transition-all"
                >
                  {t("Skip Tour", "Omitir Tour")}
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem(`dismissed_welcome_${companyId}`, "true")
                    setShowWelcomeModal(false)
                    setActiveTab("setup")
                    setWizardStep(1)
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5722]/10"
                >
                  {t("Let's Get Started", "Comenzar")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <option value="objection_library">{t("Objection Library", "Biblioteca de Objeciones")}</option>
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

