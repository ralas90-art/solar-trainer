"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/platform/app-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, ExternalLink, Zap, Users, BarChart3, ShieldCheck } from "lucide-react"
import { getBillingStatus, createCheckoutSession, createPortalSession } from "@/lib/api-client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { WHITE_LABEL } from "@/lib/white-label.config"

export default function BillingPage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchBillingStatus()
  }, [])

  async function fetchBillingStatus() {
    try {
      setLoading(true)
      const data = await getBillingStatus()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch billing status:", error)
      toast.error("Failed to load billing information")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpgrade(tier: string) {
    try {
      setActionLoading(tier)
      const { url } = await createCheckoutSession(tier)
      window.location.href = url
    } catch (error) {
      toast.error("Failed to initiate upgrade")
      setActionLoading(null)
    }
  }

  async function handleManageBilling() {
    try {
      setActionLoading("portal")
      const { url } = await createPortalSession()
      window.location.href = url
    } catch (error) {
      toast.error("Failed to open billing portal")
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <AppShell heading="Billing & Plans" subheading="Manage your subscription and usage limits">
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF5722] border-t-transparent" />
        </div>
      </AppShell>
    )
  }

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$499",
      description: "Perfect for small solar teams starting out.",
      features: [
        "50 AI Simulations / mo",
        "Up to 3 Sales Reps",
        "Basic White-Labeling",
        "Email Support",
      ],
      current: status?.plan_name === "starter",
    },
    {
      id: "growth",
      name: "Growth",
      price: "$999",
      description: "Scale your training with advanced features.",
      features: [
        "250 AI Simulations / mo",
        "Up to 15 Sales Reps",
        "Full White-Labeling",
        "Manager Analytics Dashboard",
        "Custom API Keys allowed",
        "Priority Support",
      ],
      current: status?.plan_name === "growth",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      description: "Full power for large solar organizations.",
      features: [
        "Unlimited Simulations",
        "Unlimited Sales Reps",
        "Everything in Growth",
        "Custom Feature Development",
        "Dedicated Account Manager",
        "SLA & Premium Support",
      ],
      current: status?.plan_name === "enterprise",
    },
  ]

  return (
    <AppShell heading="Billing & Plans" subheading="Manage your subscription and usage limits">
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Usage Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-[#1A1A1A] border-white/5 brand-glow-subtle">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#FF5722]" />
                    AI Simulations
                  </CardTitle>
                  <CardDescription>Monthly usage reset on the 1st</CardDescription>
                </div>
                <Badge variant="outline" className="border-[#FF5722]/30 text-[#FF5722] bg-[#FF5722]/10">
                  {status?.usage.simulations.used} / {status?.usage.simulations.limit}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress 
                value={(status?.usage.simulations.used / status?.usage.simulations.limit) * 100} 
                className="h-2 bg-white/5"
              />
              <p className="mt-4 text-sm text-slate-400">
                You have used <strong>{Math.round((status?.usage.simulations.used / status?.usage.simulations.limit) * 100)}%</strong> of your monthly simulation allowance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-white/5 brand-glow-subtle">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#22D3EE]" />
                    Team Capacity
                  </CardTitle>
                  <CardDescription>Active sales representative accounts</CardDescription>
                </div>
                <Badge variant="outline" className="border-[#22D3EE]/30 text-[#22D3EE] bg-[#22D3EE]/10">
                  {status?.usage.reps.used} / {status?.usage.reps.limit}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress 
                value={(status?.usage.reps.used / status?.usage.reps.limit) * 100} 
                className="h-2 bg-white/5"
              />
              <p className="mt-4 text-sm text-slate-400">
                You have <strong>{status?.usage.reps.limit - status?.usage.reps.used}</strong> seats remaining on your current plan.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Plan Summary */}
        <Card className="bg-[#1A1A1A] border-white/5 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF5722]/20 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-[#FF5722] flex items-center justify-center shadow-[0_0_20px_rgba(255,87,34,0.4)]">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-hud text-[10px] uppercase tracking-[0.24em] text-[#FF5722]">Current Active Plan</p>
                <h2 className="text-3xl font-black text-white uppercase">{status?.plan_name} PLAN</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn(
                    status?.subscription_status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {status?.subscription_status.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-slate-400">Next billing date: June 1, 2026</span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2"
              onClick={handleManageBilling}
              disabled={!!actionLoading}
            >
              {actionLoading === "portal" ? "Loading..." : (
                <>
                  <CreditCard className="h-4 w-4" /> Manage Payment Method
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Plan Selection */}
        <div className="pt-8 pb-4">
          <h2 className="text-2xl font-black text-white">Upgrade Your Experience</h2>
          <p className="text-slate-400">Choose the best plan to unlock more simulations and enterprise features.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={cn(
                "bg-[#1A1A1A] border-white/5 flex flex-col relative overflow-hidden",
                plan.popular && "border-[#FF5722]/30 shadow-[0_0_30px_rgba(255,87,34,0.1)]",
                plan.current && "border-[#22D3EE]/30"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#FF5722] text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  Recommended
                </div>
              )}
              {plan.current && (
                <div className="absolute top-0 left-0 bg-[#22D3EE] text-black text-[10px] font-black uppercase px-3 py-1 rounded-br-xl tracking-wider">
                  Your Current Plan
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-white text-xl font-black">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-slate-400 text-sm">/mo</span>}
                </div>
                <CardDescription className="mt-4">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-[#FF5722] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={cn(
                    "w-full rounded-xl font-bold uppercase tracking-tight",
                    plan.current ? "bg-white/5 text-slate-400 hover:bg-white/5 cursor-default" : 
                    plan.popular ? "bg-[#FF5722] hover:bg-[#F4511E] text-white" : 
                    "bg-white text-black hover:bg-slate-200"
                  )}
                  disabled={plan.current || !!actionLoading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.current ? "Current Plan" : 
                   actionLoading === plan.id ? "Processing..." : 
                   plan.id === "enterprise" ? "Contact Sales" : "Upgrade Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Link */}
        <div className="flex items-center justify-center pt-8 text-sm text-slate-500 gap-2">
          Questions about our plans? 
          <a href={`mailto:${WHITE_LABEL.supportEmail}`} className="text-[#FF5722] hover:underline flex items-center gap-1">
            Talk to an expert <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </AppShell>
  )
}
