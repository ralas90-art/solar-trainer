"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Globe,
  Rocket,
  ShieldCheck,
  ChevronRight,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// --- Types ---

type TrackId = 'individual' | 'team' | 'bilingual' | 'enterprise'

interface QuestionOption {
  id: string
  label: string
  weights: Partial<Record<TrackId, number>>
}

interface Question {
  id: string
  text: string
  options: QuestionOption[]
}

// --- Funnel Data ---

const QUESTIONS: Question[] = [
  {
    id: "lead_type",
    text: "How would you describe your current role?",
    options: [
      { id: "rep", label: "Individual Solar Rep", weights: { individual: 3 } },
      { id: "manager", label: "Sales Manager", weights: { team: 3 } },
      { id: "owner", label: "Dealer / EPC Owner", weights: { enterprise: 4 } },
      { id: "recruiter", label: "Recruiting / Onboarding Team", weights: { team: 2, enterprise: 2 } },
    ]
  },
  {
    id: "team_size",
    text: "What is the size of your team?",
    options: [
      { id: "1", label: "Just me", weights: { individual: 4 } },
      { id: "2-5", label: "2–5 reps", weights: { individual: 2, team: 2 } },
      { id: "6-15", label: "6–15 reps", weights: { team: 4 } },
      { id: "16-50", label: "16–50 reps", weights: { enterprise: 3, team: 2 } },
      { id: "50+", label: "50+ reps", weights: { enterprise: 5 } },
    ]
  },
  {
    id: "experience",
    text: "What is your team's average experience level?",
    options: [
      { id: "new", label: "Brand new", weights: { individual: 3 } },
      { id: "0-3", label: "0–3 months", weights: { individual: 3 } },
      { id: "3-12", label: "3–12 months", weights: { individual: 2, team: 2 } },
      { id: "1y+", label: "1+ year", weights: { team: 2 } },
      { id: "mixed", label: "Mixed team", weights: { team: 3, enterprise: 2 } },
    ]
  },
  {
    id: "gap",
    text: "What is your biggest training gap right now?",
    options: [
      { id: "prospecting", label: "Door knocking / Prospecting", weights: { individual: 1, team: 1 } },
      { id: "objections", label: "Handling objections", weights: { individual: 1, team: 1 } },
      { id: "bills", label: "Explaining utility bills", weights: { individual: 1, team: 1 } },
      { id: "finance", label: "Explaining financing", weights: { individual: 1, team: 1 } },
      { id: "closing", label: "Closing deals", weights: { individual: 1, team: 1, enterprise: 1 } },
      { id: "post-sale", label: "Post-sale communication", weights: { team: 1, enterprise: 1 } },
      { id: "onboarding", label: "Recruiting and onboarding", weights: { team: 2, enterprise: 3 } },
    ]
  },
  {
    id: "language",
    text: "What are your primary language needs?",
    options: [
      { id: "en", label: "English", weights: { individual: 1, team: 1 } },
      { id: "es", label: "Spanish", weights: { bilingual: 5 } },
      { id: "both", label: "Both (English & Spanish)", weights: { bilingual: 5 } },
    ]
  },
  {
    id: "process",
    text: "Describe your current training process.",
    options: [
      { id: "none", label: "No formal training", weights: { individual: 2 } },
      { id: "shadowing", label: "Shadowing only", weights: { individual: 1, team: 1 } },
      { id: "pdfs", label: "Zoom calls / PDFs", weights: { team: 2 } },
      { id: "internal", label: "Internal training system", weights: { enterprise: 2 } },
      { id: "need_better", label: "We need a better system", weights: { team: 3, enterprise: 3 } },
    ]
  },
  {
    id: "urgency",
    text: "When are you looking to start training?",
    options: [
      { id: "now", label: "Immediately", weights: { individual: 1, team: 1, bilingual: 1, enterprise: 1 } },
      { id: "month", label: "This month", weights: { team: 1 } },
      { id: "60d", label: "Next 30–60 days", weights: { team: 1 } },
      { id: "research", label: "Just researching", weights: { individual: 1 } },
    ]
  },
  {
    id: "interest",
    text: "What interests you most about SeptiVolt?",
    options: [
      { id: "individual", label: "Individual access", weights: { individual: 4 } },
      { id: "team", label: "Team license", weights: { team: 3, enterprise: 2 } },
      { id: "demo", label: "Demo", weights: { enterprise: 3, team: 2 } },
      { id: "spanish", label: "Spanish training", weights: { bilingual: 5 } },
      { id: "white-label", label: "White-label / company version", weights: { enterprise: 5 } },
    ]
  }
]

// --- Main Component ---

export function AssessmentFunnelClient() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  })

  const totalSteps = QUESTIONS.length + 1 // +1 for lead form

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, 300)
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  const scoring = useMemo(() => {
    const scores: Record<TrackId, number> = {
      individual: 0,
      team: 0,
      bilingual: 0,
      enterprise: 0
    }

    Object.entries(answers).forEach(([qId, optId]) => {
      const question = QUESTIONS.find(q => q.id === qId)
      const option = question?.options.find(o => o.id === optId)
      if (option?.weights) {
        Object.entries(option.weights).forEach(([track, weight]) => {
          scores[track as TrackId] += weight || 0
        })
      }
    })

    // Tie-break priority: enterprise > bilingual > team > individual
    const sortedTracks = (Object.keys(scores) as TrackId[]).sort((a, b) => {
      if (scores[b] !== scores[a]) return scores[b] - scores[a]
      const priority = { enterprise: 4, bilingual: 3, team: 2, individual: 1 }
      return priority[b] - priority[a]
    })

    const winningTrack = sortedTracks[0]
    const maxPossibleScore = 40 // Estimated max
    const rawScore = scores[winningTrack]
    const normalizedScore = Math.min(Math.round((rawScore / maxPossibleScore) * 100), 100)

    return { winningTrack, normalizedScore, scores }
  }, [answers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      tags: [
        "SeptiVolt - Funnel Lead",
        "SeptiVolt - Assessment Completed",
        `SeptiVolt - ${scoring.winningTrack.charAt(0).toUpperCase() + scoring.winningTrack.slice(1)}`
      ],
      customFields: {
        septivolt_lead_type: answers.lead_type,
        septivolt_team_size: answers.team_size,
        septivolt_training_gap: answers.gap,
        septivolt_language_need: answers.language,
        septivolt_experience_level: answers.experience,
        septivolt_training_urgency: answers.urgency,
        septivolt_recommended_track: scoring.winningTrack,
        septivolt_score: scoring.normalizedScore,
        septivolt_funnel_completed: true,
        septivolt_company_name: formData.company,
        septivolt_source: "solar-sales-training-assessment"
      },
      pipeline: "SeptiVolt Enrollment Pipeline",
      pipelineStage: "Assessment Completed"
    }

    try {
      const res = await fetch("/api/assessment-submit", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      })

      if (!res.ok) throw new Error("Submission failed")
      
      setIsSubmitted(true)
      setCurrentStep(currentStep + 1)
    } catch (err) {
      setError("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Render Helpers ---

  const renderProgressBar = () => {
    const progress = (currentStep / totalSteps) * 100
    return (
      <div className="w-full h-1 bg-white/5 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] shadow-[0_0_10px_rgba(249,115,22,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
      </div>
    )
  }

  const renderQuestion = () => {
    const q = QUESTIONS[currentStep]
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F97316] font-display">
            Module {currentStep + 1} / {totalSteps}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight leading-tight uppercase italic">
            {q.text}
          </h2>
        </div>
        <div className="grid gap-3">
          {q.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOptionSelect(q.id, opt.id)}
              className={cn(
                "group relative w-full text-left p-6 glass-card border border-white/10 hover:border-[#F97316]/50 transition-all duration-300 hud-border hud-corner-tl hud-corner-br",
                answers[q.id] === opt.id ? "bg-[#F97316]/10 border-[#F97316]/60" : "hover:bg-white/5"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{opt.label}</span>
                <ChevronRight className={cn(
                  "w-5 h-5 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-[#F97316]",
                  answers[q.id] === opt.id && "text-[#F97316] translate-x-1"
                )} />
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderLeadForm = () => {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] font-display">
            Final Step: Lead Activation
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight leading-tight uppercase italic">
            Who should we send the results to?
          </h2>
          <p className="text-slate-400 font-light">
            Enter your details to generate your performance score and custom training path.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">Last Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                required
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">Company Name (Optional)</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="text"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 btn-primary flex items-center justify-center gap-3 mt-4 italic"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>GENERATE RESULTS <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    )
  }

  const renderResult = () => {
    const { winningTrack, normalizedScore } = scoring

    const trackDetails = {
      individual: {
        title: "Individual Performance Track",
        desc: "Optimized for solo representatives seeking elite closing mastery and objection handling precision.",
        cta1: { label: "GET INDIVIDUAL ACCESS", href: "/pricing" },
        cta2: { label: "LEARN MORE", href: "/pricing" },
        icon: User
      },
      team: {
        title: "Strategic Team Accelerator",
        desc: "Designed for sales managers requiring structural training deployment and high-fidelity analytics.",
        cta1: { label: "BOOK TEAM DEMO", href: "/enterprise" },
        cta2: { label: "REQUEST TEAM LICENSE", href: "/enterprise?tier=team" },
        icon: Users
      },
      bilingual: {
        title: "Bilingual Growth Track",
        desc: "Full Spanish-enabled curriculum mapping for teams operating in diverse, high-growth markets.",
        cta1: { label: "BOOK STRATEGY CALL", href: "/enterprise" },
        cta2: { label: "SPANISH TRAINING INTEREST", href: "/enterprise?interest=spanish" },
        icon: Globe
      },
      enterprise: {
        title: "Enterprise Ecosystem",
        desc: "Custom white-label infrastructure for Dealer/EPC owners managing multi-state organizations.",
        cta1: { label: "REQUEST CUSTOM QUOTE", href: "/enterprise?tier=enterprise" },
        cta2: { label: "BOOK STRATEGY CALL", href: "/enterprise" },
        icon: Building2
      }
    }[winningTrack]

    return (
      <div className="space-y-12 py-10">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-[#F97316]/20 blur-2xl rounded-full scale-150 animate-pulse" />
             <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#F97316]/30 flex items-center justify-center mx-auto bg-[#121212] overflow-hidden hud-border">
                <span className="text-4xl md:text-5xl font-black metrics-font text-[#F97316] italic">{normalizedScore}%</span>
             </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 font-display">Readiness Assessment Complete</h2>
            <h1 className="text-4xl md:text-6xl font-black font-display uppercase italic tracking-tighter leading-[0.9]">
              Your Optimal <span className="text-[#F97316]">Path</span>
            </h1>
          </div>
        </div>

        <div className="glass-card hud-border p-8 md:p-12 hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F97316]/5 blur-[80px] rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-[#F97316]">
              <trackDetails.icon className="w-10 h-10" />
            </div>
            <div className="space-y-4 flex-1">
              <h3 className="text-3xl font-black uppercase tracking-tight italic font-display">{trackDetails.title}</h3>
              <p className="text-slate-400 font-light text-lg leading-relaxed max-w-xl">
                {trackDetails.desc}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-6 justify-center md:justify-start">
                <Link href={trackDetails.cta1.href} className="w-full sm:w-auto">
                  <button className="w-full btn-primary px-8 py-4 text-[10px] italic">
                    {trackDetails.cta1.label}
                  </button>
                </Link>
                <Link href={trackDetails.cta2.href} className="w-full sm:w-auto">
                  <button className="w-full px-8 py-4 text-[10px] border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-display font-black uppercase tracking-widest italic">
                    {trackDetails.cta2.label}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Profile", val: winningTrack.toUpperCase(), icon: User },
             { label: "Urgency", val: answers.urgency?.toUpperCase() || "HIGH", icon: Zap },
             { label: "Gap", val: answers.gap?.split('-')[0].toUpperCase() || "NONE", icon: BarChart3 },
             { label: "Status", val: "ACTIVE", icon: CheckCircle2 }
           ].map((stat, i) => (
             <div key={i} className="glass-card p-6 border border-white/5 text-center space-y-2">
                <stat.icon className="w-4 h-4 text-slate-500 mx-auto" />
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-display">{stat.label}</div>
                <div className="metrics-font font-bold text-white text-sm tracking-tighter italic">{stat.val}</div>
             </div>
           ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-32">
      {currentStep < totalSteps && renderProgressBar()}
      
      <div className="mt-12 relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {currentStep < QUESTIONS.length ? (
            <motion.div
              key={`q-${currentStep}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              {renderQuestion()}
            </motion.div>
          ) : currentStep === QUESTIONS.length && !isSubmitted ? (
            <motion.div
              key="lead-form"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              {renderLeadForm()}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "circOut" }}
            >
              {renderResult()}
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep > 0 && currentStep <= QUESTIONS.length && !isSubmitted && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleBack}
            className="absolute -bottom-20 left-0 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest font-display"
          >
            <ArrowLeft className="w-3 h-3" /> PREVIOUS STEP
          </motion.button>
        )}
      </div>
    </div>
  )
}
