"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getCompanySettings, updateCompanySettings } from "@/lib/api-client"
import { PreviewPanel } from "@/components/settings/PreviewPanel"
import { Loader2, Save, ArrowLeft, CheckCircle2, Shield, Brain, Info } from "lucide-react"
import Link from "next/link"

const companySettingsSchema = z.object({
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color").optional().or(z.literal("")),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color").optional().or(z.literal("")),
  accent_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color").optional().or(z.literal("")),
  contact_email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  phone_number: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  crm_name: z.string().optional().or(z.literal("")),
  proposal_tool: z.string().optional().or(z.literal("")),
  door_knocking_tool: z.string().optional().or(z.literal("")),
  financing_options: z.string().optional().or(z.literal("")),
  onboarding_notes: z.string().optional().or(z.literal("")),
  // AI Configuration (Phase 5)
  use_custom_ai_keys: z.boolean().optional(),
  openai_api_key: z.string().optional().or(z.literal("")),
  vapi_api_key: z.string().optional().or(z.literal("")),
})

type CompanySettingsFormValues = z.infer<typeof companySettingsSchema>

export default function CompanySettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      logo_url: "",
      primary_color: "",
      secondary_color: "",
      accent_color: "",
      contact_email: "",
      phone_number: "",
      address: "",
      crm_name: "",
      proposal_tool: "",
      door_knocking_tool: "",
      financing_options: "",
      onboarding_notes: "",
      use_custom_ai_keys: false,
      openai_api_key: "",
      vapi_api_key: ""
    }
  })

  const formValues = form.watch()

  useEffect(() => {
    if (user && user.role !== "manager" && user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    const loadSettings = async () => {
      try {
        const data = await getCompanySettings()
        form.reset({
          logo_url: data.logo_url || "",
          primary_color: data.primary_color || "",
          secondary_color: data.secondary_color || "",
          accent_color: data.accent_color || "",
          contact_email: data.contact_email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          crm_name: data.crm_name || "",
          proposal_tool: data.proposal_tool || "",
          door_knocking_tool: data.door_knocking_tool || "",
          financing_options: data.financing_options || "",
          onboarding_notes: data.onboarding_notes || "",
          use_custom_ai_keys: data.use_custom_ai_keys || false,
          openai_api_key: data.openai_api_key || "",
          vapi_api_key: data.vapi_api_key || ""
        })
      } catch (err: any) {
        setError("Failed to load company settings.")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadSettings()
    }
  }, [user, router, form])

  const onSubmit = async (data: CompanySettingsFormValues) => {
    setIsSaving(true)
    setSaveSuccess(false)
    setError(null)
    
    try {
      await updateCompanySettings(data)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update settings.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-lime-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/settings" className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-3xl font-light text-white tracking-tight">Company Settings</h1>
          </div>
          <p className="text-gray-400 max-w-2xl ml-10">
            Configure your white-label branding, operational tools, and AI infrastructure.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-lime-400 bg-lime-400/10 px-3 py-1.5 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Saved successfully
            </div>
          )}
          <button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-black px-6 py-2.5 rounded-full font-medium transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Configuration Section */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-16 h-16 text-lime-400" />
            </div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-lime-400" />
              <h2 className="text-xl font-medium text-white">AI Configuration</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <h3 className="text-sm font-medium text-white">Use Custom API Keys</h3>
                  <p className="text-xs text-gray-400">By-pass platform billing and use your own OpenAI & Vapi accounts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => form.setValue("use_custom_ai_keys", !formValues.use_custom_ai_keys)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formValues.use_custom_ai_keys ? 'bg-lime-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formValues.use_custom_ai_keys ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {formValues.use_custom_ai_keys && (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormField 
                    label="OpenAI API Key" 
                    error={form.formState.errors.openai_api_key?.message}
                    helper="Keys are encrypted at rest. Masked after saving."
                  >
                    <input 
                      {...form.register("openai_api_key")} 
                      type="password" 
                      placeholder="sk-..." 
                      className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50 font-mono" 
                    />
                  </FormField>
                  <FormField 
                    label="Vapi Public Key (Optional)" 
                    error={form.formState.errors.vapi_api_key?.message}
                    helper="Required if you want to use your own Vapi account."
                  >
                    <input 
                      {...form.register("vapi_api_key")} 
                      placeholder="vapi-..." 
                      className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50 font-mono" 
                    />
                  </FormField>
                </div>
              )}
            </div>
          </div>

          {/* Visual Branding */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-medium text-white mb-6">Visual Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Logo URL" error={form.formState.errors.logo_url?.message}>
                <input {...form.register("logo_url")} type="url" placeholder="https://..." className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50" />
              </FormField>
              <FormField label="Primary Color (Hex)" error={form.formState.errors.primary_color?.message}>
                <input {...form.register("primary_color")} placeholder="#000000" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50 font-mono" />
              </FormField>
              <FormField label="Secondary Color (Hex)" error={form.formState.errors.secondary_color?.message}>
                <input {...form.register("secondary_color")} placeholder="#000000" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50 font-mono" />
              </FormField>
              <FormField label="Accent Color (Hex)" error={form.formState.errors.accent_color?.message}>
                <input {...form.register("accent_color")} placeholder="#000000" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50 font-mono" />
              </FormField>
            </div>
          </div>

          {/* Operational Tools */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-medium text-white mb-6">Operational Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="CRM Name" error={form.formState.errors.crm_name?.message}>
                <input {...form.register("crm_name")} placeholder="e.g. HubSpot, GoHighLevel" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50" />
              </FormField>
              <FormField label="Proposal Tool" error={form.formState.errors.proposal_tool?.message}>
                <input {...form.register("proposal_tool")} placeholder="e.g. Solo, Aurora" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50" />
              </FormField>
              <FormField label="Door Knocking Tool" error={form.formState.errors.door_knocking_tool?.message}>
                <input {...form.register("door_knocking_tool")} placeholder="e.g. SalesRabbit, Spotio" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50" />
              </FormField>
              <FormField label="Financing Options" error={form.formState.errors.financing_options?.message}>
                <input {...form.register("financing_options")} placeholder="e.g. GoodLeap, Mosaic" className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-lime-500/50" />
              </FormField>
            </div>
            
            <div className="mt-6">
              <FormField label="Onboarding Notes" error={form.formState.errors.onboarding_notes?.message}>
                <textarea {...form.register("onboarding_notes")} rows={3} placeholder="Important information for new hires..." className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-lime-500/50 resize-y" />
              </FormField>
            </div>
          </div>
          
        </div>

        <div className="lg:col-span-1 h-[600px] sticky top-8">
          <PreviewPanel formValues={formValues} />
        </div>
      </div>
    </div>
  )
}

function FormField({ label, error, helper, children }: { label: string, error?: string, helper?: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {helper && (
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-gray-500 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black border border-white/10 rounded-lg text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {helper}
            </div>
          </div>
        )}
      </div>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
