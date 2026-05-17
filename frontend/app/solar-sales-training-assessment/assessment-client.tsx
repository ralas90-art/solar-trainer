"use client"

import { useState } from "react"
import { 
  Zap, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  Trophy,
  Target,
  User,
  Mail,
  Phone,
  Globe
} from "lucide-react"
import Link from "next/link"

type ResultTrack = "beginner" | "advanced" | "bilingual" | "enterprise";

export default function AssessmentClient() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultTrack, setResultTrack] = useState<ResultTrack | null>(null)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    experience: "",
    primaryGoal: "",
    bilingual: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  // Basic Scoring Logic
  const calculateResult = (): ResultTrack => {
    if (formData.experience === "Building a team" || formData.primaryGoal === "Scaling an agency") {
      return "enterprise"
    }
    if (formData.bilingual === "Yes") {
      return "bilingual"
    }
    if (formData.experience === "Just starting out") {
      return "beginner"
    }
    return "advanced"
  }

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => Math.max(0, s - 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const track = calculateResult()
    
    // Calculate a mock score for demo purposes (0-100)
    let score = 50;
    if (track === "advanced") score = 85;
    if (track === "enterprise") score = 95;
    if (track === "bilingual") score = 80;

    const payload = {
      lead_source: "septivolt_public_assessment",
      assessment_variant: "solar_sales_readiness_v1",
      funnel_type: "public_qualification",
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      
      score: score,
      maturity_class: track,
      recommended_path: track,
      
      bilingual_interest: formData.bilingual === "Yes",
      enterprise_interest: track === "enterprise",
      
      summary: `Exp: ${formData.experience} | Goal: ${formData.primaryGoal} | Bilingual: ${formData.bilingual}`
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

      setResultTrack(track)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (resultTrack) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8 bg-[#121212] border border-white/10 p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#F97316] to-[#F59E0B]" />
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/30 mb-6">
              <Trophy className="w-10 h-10 text-[#F59E0B]" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic font-display">Assessment Complete</h1>
            <p className="text-[#94A3B8] font-light text-lg">
              Based on your profile, we have identified the perfect training track to accelerate your solar sales career.
            </p>
          </div>

          <div className="p-8 bg-white/5 rounded-3xl border border-[#F97316]/30 space-y-4 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F97316] font-display">Recommended Track</div>
            <h2 className="text-3xl font-bold">
              {resultTrack === "beginner" && "Foundations: Zero to Close"}
              {resultTrack === "advanced" && "Advanced Closer Mastery"}
              {resultTrack === "bilingual" && "Bilingual Elite Closer"}
              {resultTrack === "enterprise" && "Enterprise OS"}
            </h2>
            <p className="text-[#94A3B8] text-sm">
              {resultTrack === "beginner" && "Master the basics of door knocking, lead gen, and closing your first deals."}
              {resultTrack === "advanced" && "Scale your closing ratio with advanced psychology and handling complex objections."}
              {resultTrack === "bilingual" && "Dominate the Hispanic market with dual-language training and specialized cultural scripts."}
              {resultTrack === "enterprise" && "Scale your agency with team-wide training models and private instances."}
            </p>
          </div>

          <div className="pt-6">
            <Link 
              href={resultTrack === "enterprise" ? "/enterprise" : "/pricing"} 
              className="w-full py-5 bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-[#121212] font-black uppercase tracking-tighter text-xl rounded-2xl hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 font-display italic"
            >
              Unlock Your Training <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalSteps = 4;

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
      <div className="relative bg-[#121212] border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl min-h-[500px] flex flex-col justify-between">
        
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-3 font-display">
            <span>Step {step === 0 ? "1" : step} of {totalSteps}</span>
            <span className="text-[#F97316]">
              {step === 0 && "Welcome"}
              {step === 1 && "Experience"}
              {step === 2 && "Goals"}
              {step === 3 && "Market"}
              {step === 4 && "Finalize"}
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] transition-all duration-500 ease-out"
              style={{ width: `${Math.max(5, (step / totalSteps) * 100)}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {/* STEP 0: INTRO */}
          {step === 0 && (
            <div className="space-y-8 animate-in fade-in duration-500 flex-1 flex flex-col justify-center">
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-[10px] font-black uppercase tracking-[0.2em] font-display mx-auto">
                  <Zap className="w-3 h-3 fill-current" /> Free Diagnostic
                </div>
                <h1 className="text-4xl md:text-6xl font-black font-display uppercase italic">Sales Readiness Assessment</h1>
                <p className="text-[#94A3B8] font-light max-w-xl mx-auto text-lg">Answer a few quick questions so we can map out your optimal path to becoming a top 1% solar closer.</p>
              </div>
              
              <button 
                onClick={handleNext}
                className="w-full md:w-2/3 mx-auto py-5 bg-white/5 border border-[#F97316]/50 text-white font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-[#F97316] hover:text-[#121212] transition-all flex items-center justify-center gap-2 font-display italic mt-8"
              >
                Begin Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 1: EXPERIENCE */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-black font-display uppercase italic">What is your solar sales experience?</h2>
              </div>
              
              <div className="grid gap-4 max-w-2xl mx-auto w-full flex-1">
                {[
                  "Just starting out",
                  "Closing 1-3 deals per month",
                  "Closing 4+ deals per month",
                  "Building a team"
                ].map((exp) => (
                  <button
                    key={exp}
                    onClick={() => {
                      setFormData({ ...formData, experience: exp })
                      handleNext()
                    }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F97316]/50 hover:bg-white/10 transition-all text-left flex items-center gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center group-hover:border-[#F97316]/50 group-hover:text-[#F97316] shrink-0">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg">{exp}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: GOALS */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-black font-display uppercase italic">What is your primary goal right now?</h2>
              </div>
              
              <div className="grid gap-4 max-w-2xl mx-auto w-full flex-1">
                {[
                  "Mastering the basics of door knocking",
                  "Overcoming objections to close more",
                  "Generating my own leads consistently",
                  "Scaling an agency"
                ].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      setFormData({ ...formData, primaryGoal: goal })
                      handleNext()
                    }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F97316]/50 hover:bg-white/10 transition-all text-left flex items-center gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center group-hover:border-[#F97316]/50 group-hover:text-[#F97316] shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg">{goal}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: BILINGUAL */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
              <div className="space-y-3 text-center">
                <h2 className="text-3xl font-black font-display uppercase italic">Are you interested in the Hispanic market?</h2>
                <p className="text-[#94A3B8]">SeptiVolt offers specialized bilingual training tracks.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full flex-1">
                {["Yes", "No"].map((ans) => (
                  <button
                    key={ans}
                    onClick={() => {
                      setFormData({ ...formData, bilingual: ans })
                      handleNext()
                    }}
                    className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F97316]/50 hover:bg-white/10 transition-all text-center flex flex-col items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center group-hover:border-[#F97316]/50 group-hover:text-[#F97316]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-2xl">{ans}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: LEAD FORM */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col max-w-2xl mx-auto w-full">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black font-display uppercase italic">Get Your Results</h2>
                <p className="text-[#94A3B8] font-light">Where should we send your customized curriculum map?</p>
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 focus:border-[#F97316]/50 outline-none transition-all"
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 focus:border-[#F97316]/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 focus:border-[#F97316]/50 outline-none transition-all"
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 focus:border-[#F97316]/50 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-[#121212] font-black uppercase tracking-tighter text-xl rounded-2xl hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-display italic mt-8"
              >
                {isSubmitting ? "Calculating Results..." : (
                  <>
                    Show My Results <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back Button */}
        {step > 0 && !resultTrack && (
          <button 
            onClick={handlePrev}
            className="absolute top-6 left-6 md:top-12 md:left-12 text-[#64748B] hover:text-white flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors font-display"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}

      </div>
    </main>
  )
}
