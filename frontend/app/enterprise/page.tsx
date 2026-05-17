"use client"

import { useState } from "react"
import { 
  Zap, 
  Shield, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Users,
  Building2,
  Mail,
  User,
  Phone,
  Target,
  Database,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"

const enterpriseFeatures = [
  {
    title: "Team Analytics",
    description: "Deep insights into performance metrics.",
    icon: BarChart3,
    color: "text-[#F97316]"
  },
  {
    title: "Custom Tracks",
    description: "Build bespoke training paths.",
    icon: Shield,
    color: "text-[#F59E0B]"
  },
  {
    title: "Private Instance",
    description: "Your own dedicated environment.",
    icon: Zap,
    color: "text-[#F97316]"
  }
]

export default function EnterprisePage() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    teamSize: "10-25",
    primaryChallenge: "",
    currentStack: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  })

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => Math.max(0, s - 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const payload = {
      lead_source: "septivolt_enterprise_fit_check",
      assessment_variant: "enterprise_training_fit_check",
      funnel_type: "enterprise_qualification",
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.company,
      team_size: parseInt(formData.teamSize.split('-')[0]) || 10,
      enterprise_interest: true,
      requested_demo: true,
      high_intent: true, // Enterprise leads are assumed high-intent if they finish
      summary: `Challenge: ${formData.primaryChallenge} | Stack: ${formData.currentStack}`,
    }

    try {
      const res = await fetch("/api/ghl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to submit. Please try again.")
      }

      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-white/5 border border-[#F59E0B]/30 p-12 rounded-[2.5rem] shadow-[0_0_30px_rgba(249,115,22,0.1)]">
          <div className="mx-auto w-20 h-20 rounded-full bg-[#F59E0B]/20 flex items-center justify-center border border-[#F59E0B]/40">
            <CheckCircle2 className="w-10 h-10 text-[#F59E0B]" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Fit-Check Complete</h1>
          <p className="text-[#94A3B8] font-light">
            Your enterprise profile has been secured. Our partnership team will contact you within 24 hours to orchestrate a pilot deployment.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-[#F97316] font-display text-sm font-black hover:gap-3 transition-all">
            RETURN TO DASHBOARD <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-body selection:bg-[#F97316]/30 pb-20">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <main className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 grid lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Branding / Context */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-[10px] font-black uppercase tracking-[0.2em] font-display">
              <Zap className="w-3 h-3 fill-current" /> Enterprise Fit-Check
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] font-display uppercase italic">
              Scale Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#F59E0B]">Solar Sales</span>
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-md leading-relaxed font-light">
              Answer 3 quick questions to see if your organization qualifies for a private SeptiVolt instance.
            </p>
          </div>

          <div className="space-y-4 hidden lg:block">
            {enterpriseFeatures.map((feature, i) => (
              <div key={i} className="flex gap-4 items-center opacity-80">
                <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${feature.color}`}>
                  <feature.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{feature.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Funnel */}
        <div className="lg:col-span-7 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#F97316] to-[#F59E0B] rounded-[3rem] blur opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-[#121212] border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl min-h-[500px] flex flex-col justify-between">
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-3 font-display">
                <span>Step {step === 0 ? "1" : step} of 4</span>
                <span className="text-[#F97316]">
                  {step === 0 && "Overview"}
                  {step === 1 && "Team"}
                  {step === 2 && "Challenges"}
                  {step === 3 && "Stack"}
                  {step === 4 && "Final Details"}
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(5, (step / 4) * 100)}%` }}
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                {error}
              </div>
            )}

            {/* STEP 0: INTRO */}
            {step === 0 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
                <div className="space-y-3">
                  <h2 className="text-3xl font-black font-display uppercase italic">Qualification Criteria</h2>
                  <p className="text-[#94A3B8] font-light">SeptiVolt Enterprise is designed specifically for scaling solar teams generating at least $5M/yr in revenue or managing 10+ active reps. Does this sound like your organization?</p>
                </div>
                
                <button 
                  onClick={handleNext}
                  className="w-full py-5 bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-[#121212] font-black uppercase tracking-tighter text-xl rounded-2xl hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 font-display italic mt-auto"
                >
                  Yes, Start Fit-Check
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* STEP 1: TEAM SIZE */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
                <div className="space-y-3">
                  <h2 className="text-3xl font-black font-display uppercase italic">How large is your active sales team?</h2>
                  <p className="text-[#94A3B8] font-light">Include field reps, closers, and appointment setters.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  {["1-9", "10-25", "26-50", "50-100", "100+"].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setFormData({ ...formData, teamSize: size })
                        handleNext()
                      }}
                      className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F97316]/50 hover:bg-white/10 transition-all text-left flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center group-hover:border-[#F97316]/50 group-hover:text-[#F97316]">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-lg">{size} Reps</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: PRIMARY CHALLENGE */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
                <div className="space-y-3">
                  <h2 className="text-3xl font-black font-display uppercase italic">What is the #1 challenge limiting your growth?</h2>
                  <p className="text-[#94A3B8] font-light">Select the most pressing issue in your current operations.</p>
                </div>
                
                <div className="grid gap-3 flex-1">
                  {[
                    "New rep onboarding takes too long",
                    "Inconsistent closing ratios across the team",
                    "High rep turnover / retention issues",
                    "Poor lead utilization / burning through leads",
                    "Lack of systemic training infrastructure"
                  ].map((challenge) => (
                    <button
                      key={challenge}
                      onClick={() => {
                        setFormData({ ...formData, primaryChallenge: challenge })
                        handleNext()
                      }}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F97316]/50 hover:bg-white/10 transition-all text-left flex items-center gap-4 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center group-hover:border-[#F97316]/50 group-hover:text-[#F97316] shrink-0">
                        <Target className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-sm md:text-base">{challenge}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: TECH STACK */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
                <div className="space-y-3">
                  <h2 className="text-3xl font-black font-display uppercase italic">What CRM are you currently running?</h2>
                  <p className="text-[#94A3B8] font-light">We integrate seamlessly with major industry standard tools.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {[
                    "HubSpot",
                    "Salesforce",
                    "GoHighLevel",
                    "Zoho",
                    "Pipedrive",
                    "Custom / Other"
                  ].map((stack) => (
                    <button
                      key={stack}
                      onClick={() => {
                        setFormData({ ...formData, currentStack: stack })
                        handleNext()
                      }}
                      className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F97316]/50 hover:bg-white/10 transition-all text-left flex items-center gap-4 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center group-hover:border-[#F97316]/50 group-hover:text-[#F97316]">
                        <Database className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm">{stack}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: CONTACT INFO */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-display uppercase italic">Where should we send your access?</h2>
                  <p className="text-[#94A3B8] font-light text-sm">Your answers qualify you for an executive demonstration.</p>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                        <input 
                          required
                          type="text" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          placeholder="John"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                        <input 
                          required
                          type="text" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          placeholder="Doe"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@solarcorp.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                      <input 
                        required
                        type="text" 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Mega Solar Tech"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-[#121212] font-black uppercase tracking-tighter text-lg rounded-2xl hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-display italic mt-4"
                >
                  {isSubmitting ? "Processing..." : (
                    <>
                      Complete Fit-Check <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back Button */}
            {step > 0 && (
              <button 
                onClick={handlePrev}
                className="absolute -top-12 left-0 text-[#64748B] hover:text-white flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors font-display"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
