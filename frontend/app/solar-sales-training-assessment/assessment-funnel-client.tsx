"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
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
  ShieldCheck,
  ChevronRight,
  Loader2,
  Info
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  captureAttribution, 
  trackEvent, 
  saveFunnelProgress, 
  loadFunnelProgress, 
  clearFunnelProgress,
  isAlreadySubmitted,
  setSubmissionLock,
  getAttribution
} from "@/lib/analytics-service"
import { calculateIntelligence, TrackId } from "@/lib/scoring-engine"
import { useEffect } from "react"
import { t, Language, getLanguagePreference, setLanguagePreference } from "@/lib/i18n"

interface QuestionOption {
  id: string
  label: string
  weights: Partial<Record<TrackId, number>>
  isSubQuestion?: boolean
}

interface Question {
  id: string
  text: string
  isOptional?: boolean
  options: QuestionOption[]
}

// --- Funnel Data ---

const QUESTIONS: Question[] = [
  {
    id: "lead_type",
    text: "funnel.questions.lead_type.text",
    options: [
      { id: "rep", label: "funnel.questions.lead_type.options.rep", weights: { individual: 3 } },
      { id: "manager", label: "funnel.questions.lead_type.options.manager", weights: { team: 3 } },
      { id: "owner", label: "funnel.questions.lead_type.options.owner", weights: { enterprise: 4 } },
      { id: "recruiter", label: "funnel.questions.lead_type.options.recruiter", weights: { team: 2, enterprise: 2 } },
    ]
  },
  {
    id: "team_size",
    text: "funnel.questions.team_size.text",
    options: [
      { id: "1", label: "funnel.questions.team_size.options.1", weights: { individual: 4 } },
      { id: "2-5", label: "funnel.questions.team_size.options.2-5", weights: { individual: 2, team: 2 } },
      { id: "6-15", label: "funnel.questions.team_size.options.6-15", weights: { team: 4 } },
      { id: "16-50", label: "funnel.questions.team_size.options.16-50", weights: { enterprise: 3, team: 2 } },
      { id: "50+", label: "funnel.questions.team_size.options.50+", weights: { enterprise: 5 } },
    ]
  },
  {
    id: "experience",
    text: "funnel.questions.experience.text",
    options: [
      { id: "new", label: "funnel.questions.experience.options.new", weights: { individual: 3 } },
      { id: "0-3", label: "funnel.questions.experience.options.0-3", weights: { individual: 3 } },
      { id: "3-12", label: "funnel.questions.experience.options.3-12", weights: { individual: 2, team: 2 } },
      { id: "1y+", label: "funnel.questions.experience.options.1y+", weights: { team: 2 } },
      { id: "mixed", label: "funnel.questions.experience.options.mixed", weights: { team: 3, enterprise: 2 } },
    ]
  },
  {
    id: "gap",
    text: "funnel.questions.gap.text",
    options: [
      { id: "prospecting", label: "funnel.questions.gap.options.prospecting", weights: { individual: 1, team: 1 } },
      { id: "objections", label: "funnel.questions.gap.options.objections", weights: { individual: 1, team: 1 } },
      { id: "bills", label: "funnel.questions.gap.options.bills", weights: { individual: 1, team: 1 } },
      { id: "finance", label: "funnel.questions.gap.options.finance", weights: { individual: 1, team: 1 } },
      { id: "closing", label: "funnel.questions.gap.options.closing", weights: { individual: 1, team: 1, enterprise: 1 } },
      { id: "post-sale", label: "funnel.questions.gap.options.post-sale", weights: { team: 1, enterprise: 1 } },
      { id: "onboarding", label: "funnel.questions.gap.options.onboarding", weights: { team: 2, enterprise: 3 } },
    ]
  },
  {
    id: "language",
    text: "funnel.questions.language.text",
    options: [
      { id: "en", label: "funnel.questions.language.options.en", weights: { individual: 1, team: 1 } },
      { id: "es", label: "funnel.questions.language.options.es", weights: { bilingual: 5 } },
      { id: "both", label: "funnel.questions.language.options.both", weights: { bilingual: 5 } },
    ]
  },
  {
    id: "process",
    text: "funnel.questions.process.text",
    options: [
      { id: "none", label: "funnel.questions.process.options.none", weights: { individual: 2 } },
      { id: "shadowing", label: "funnel.questions.process.options.shadowing", weights: { individual: 1, team: 1 } },
      { id: "pdfs", label: "funnel.questions.process.options.pdfs", weights: { team: 2 } },
      { id: "internal", label: "funnel.questions.process.options.internal", weights: { enterprise: 2 } },
      { id: "need_better", label: "funnel.questions.process.options.need_better", weights: { team: 3, enterprise: 3 } },
    ]
  },
  {
    id: "urgency",
    text: "funnel.questions.urgency.text",
    options: [
      { id: "now", label: "funnel.questions.urgency.options.now", weights: { individual: 1, team: 1, bilingual: 1, enterprise: 1 } },
      { id: "month", label: "funnel.questions.urgency.options.month", weights: { team: 1 } },
      { id: "60d", label: "funnel.questions.urgency.options.60d", weights: { team: 1 } },
      { id: "research", label: "funnel.questions.urgency.options.research", weights: { individual: 1 } },
    ]
  },
  {
    id: "interest",
    text: "funnel.questions.interest.text",
    options: [
      { id: "individual", label: "funnel.questions.interest.options.individual", weights: { individual: 4 } },
      { id: "team", label: "funnel.questions.interest.options.team", weights: { team: 3, enterprise: 2 } },
      { id: "demo", label: "funnel.questions.interest.options.demo", weights: { enterprise: 3, team: 2 } },
      { id: "spanish", label: "funnel.questions.interest.options.spanish", weights: { bilingual: 5 } },
      { id: "white-label", label: "funnel.questions.interest.options.white-label", weights: { enterprise: 5 } },
    ]
  },
  {
    id: "business_intel",
    text: "funnel.questions.business_intel.text",
    isOptional: true,
    options: [
      { id: "crm", label: "funnel.questions.business_intel.options.crm", isSubQuestion: true, weights: {} },
      { id: "volume", label: "funnel.questions.business_intel.options.volume", isSubQuestion: true, weights: {} },
      { id: "structure", label: "funnel.questions.business_intel.options.structure", isSubQuestion: true, weights: {} },
    ]
  }
]

const ASSESSMENT_VARIANT = "solar_sales_readiness_v2"

// Note: Bilingual Architecture Foundation
// We will use a translation mapping in Phase 3. 
// For now, the structure supports { id, text, options } which will be mapped to { id, text: { en, es } }

// GHL tag mapping keyed by URL type param
const GHL_TAG_MAP: Record<string, string> = {
  rep_basic:    "septivolt_rep_basic_interest",
  rep_voice_pro:"septivolt_voice_pro_interest",
  partner_rep:  "septivolt_partner_rep_access",
  dealer_pilot: "septivolt_dealer_pilot_interest",
  team_growth:  "septivolt_team_growth_interest",
  enterprise:   "septivolt_enterprise_interest",
}

// Pre-population map: urlType → { lead_type, team_size }
const PREFILL_MAP: Record<string, { lead_type: string; team_size: string }> = {
  rep_basic:    { lead_type: "rep",     team_size: "1" },
  rep_voice_pro:{ lead_type: "rep",     team_size: "1" },
  partner_rep:  { lead_type: "rep",     team_size: "1" },
  dealer_pilot: { lead_type: "manager", team_size: "2-5" },
  team_growth:  { lead_type: "manager", team_size: "6-15" },
  enterprise:   { lead_type: "owner",   team_size: "50+" },
}

// Human-readable plan labels for the pre-fill banner
const PLAN_LABEL_MAP: Record<string, string> = {
  rep_basic:    "Rep Basic",
  rep_voice_pro:"Rep Voice Pro",
  partner_rep:  "Partner Onboarding",
  dealer_pilot: "Founding Dealer Pilot",
  team_growth:  "Team Growth",
  enterprise:   "Enterprise",
}

const normalizeResultKey = (value: string) =>
  value?.toLowerCase().trim().replace(/\s+/g, "_");

// --- Main Component ---
export function AssessmentFunnelClient() {
  const searchParams = useSearchParams()
  const urlType   = searchParams.get('type')   ?? ""
  const urlSource = searchParams.get('source') ?? ""
  const urlReps   = searchParams.get('reps')   ?? ""

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  const [prefillApplied, setPrefillApplied] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  })

  // Attribution & Progress Lifecycle
  useEffect(() => {
    captureAttribution();
    
    // Set initial language
    const lang = getLanguagePreference();
    setLanguage(lang);

    const saved = loadFunnelProgress();
    if (saved && saved.currentStep > 0 && !isSubmitted) {
      // Existing session detected — show resume prompt, do NOT apply URL pre-fill
      setShowResumePrompt(true);
    } else if (urlType && PREFILL_MAP[urlType]) {
      // No saved session — apply URL-based pre-fill
      const prefill = PREFILL_MAP[urlType];
      setAnswers({ lead_type: prefill.lead_type, team_size: prefill.team_size });
      setCurrentStep(2); // skip lead_type (step 0) and team_size (step 1)
      setPrefillApplied(true);
    }
    
    // Initial page view event
    trackEvent('funnel_view', { 
      step: 0, 
      lang,
      language_preference: lang,
      assessment_variant: ASSESSMENT_VARIANT,
      url_type: urlType,
      url_source: urlSource,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageSwitch = (newLang: Language) => {
    setLanguage(newLang);
    setLanguagePreference(newLang);
    trackEvent('language_switch', { 
      from: language, 
      to: newLang,
      language_preference: newLang,
      assessment_variant: ASSESSMENT_VARIANT
    });
  }

  const totalSteps = QUESTIONS.length + 1 // +1 for lead form

  const handleOptionSelect = (questionId: string, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    
    trackEvent('funnel_step_complete', { 
      step: currentStep, 
      questionId, 
      optionId,
      lang: language,
      language_preference: language,
      assessment_variant: ASSESSMENT_VARIANT
    });
    
    saveFunnelProgress({ currentStep, answers: newAnswers });
    
    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, 300)
  }

  const handleResume = () => {
    const saved = loadFunnelProgress();
    if (saved) {
      setAnswers(saved.answers);
      setCurrentStep(saved.currentStep);
    }
    setShowResumePrompt(false);
    trackEvent('funnel_resume', { 
      step: saved?.currentStep,
      lang: language,
      language_preference: language,
      assessment_variant: ASSESSMENT_VARIANT
    });
  }

  const handleStartFresh = () => {
    clearFunnelProgress();
    // When starting fresh, re-apply URL pre-fill if present (don't lose context)
    if (urlType && PREFILL_MAP[urlType]) {
      const prefill = PREFILL_MAP[urlType];
      setAnswers({ lead_type: prefill.lead_type, team_size: prefill.team_size });
      setCurrentStep(2);
      setPrefillApplied(true);
    } else {
      setCurrentStep(0);
      setAnswers({});
      setPrefillApplied(false);
    }
    setShowResumePrompt(false);
    trackEvent('funnel_restart', {
      lang: language,
      language_preference: language,
      assessment_variant: ASSESSMENT_VARIANT
    });
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  // Advanced Scoring via Intelligence Engine
  const intelligence = calculateIntelligence(answers, QUESTIONS);
  const { winningTrack, normalizedScore, maturity, weaknesses, insights, confidenceScore } = intelligence;

  const translatedMaturity = t(`funnel.results.maturity_levels.${normalizeResultKey(maturity)}`, language);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (isAlreadySubmitted(formData.email)) {
      setError(t("funnel.already_submitted", language));
      setTimeout(() => setIsSubmitted(true), 1500);
      return;
    }

    const attribution = getAttribution();

    // 1. Resolve primary track by stripping "bilingual" (treat as modifier only)
    let primaryTrack = winningTrack;
    if (primaryTrack === "bilingual") {
      const nonBilingualTracks: ('individual' | 'team' | 'enterprise')[] = ['enterprise', 'team', 'individual'];
      const allScores = intelligence.allScores || { individual: 0, team: 0, bilingual: 0, enterprise: 0 };
      nonBilingualTracks.sort((a, b) => {
        if (allScores[b] !== allScores[a]) return allScores[b] - allScores[a];
        const priority = { enterprise: 3, team: 2, individual: 1 };
        return priority[b] - priority[a];
      });
      primaryTrack = nonBilingualTracks[0];
    }

    // 2. Determine final path based on answers priority override
    let finalPath = "";
    
    // Check user explicit answers first
    const isExplicitIndividual = answers.lead_type === "rep" && (answers.team_size === "1" || !answers.team_size);
    const isExplicitEnterprise = (answers.lead_type === "owner" && answers.team_size === "50+") ||
      (answers.lead_type !== "rep" && (answers.team_size === "50+" || answers.interest === "white-label" || answers.interest === "demo" || answers.process === "internal"));
    const isExplicitTeam = !isExplicitIndividual && !isExplicitEnterprise && 
      ((answers.lead_type && answers.lead_type !== "rep") || (answers.team_size && answers.team_size !== "1"));

    if (isExplicitIndividual) {
      finalPath = "individual";
    } else if (isExplicitEnterprise) {
      finalPath = "enterprise";
    } else if (isExplicitTeam) {
      finalPath = "team";
    } else {
      // Priority 2: CTA query context if answers are ambiguous
      if (urlType === "rep_basic" || urlType === "rep_voice_pro" || urlType === "partner_rep") {
        finalPath = "individual";
      } else if (urlType === "dealer_pilot" || urlType === "team_growth") {
        finalPath = "team";
      } else if (urlType === "enterprise") {
        finalPath = "enterprise";
      } else {
        // Priority 3: score/winningTrack fallback
        if (primaryTrack === "individual" || primaryTrack === "team" || primaryTrack === "enterprise") {
          finalPath = primaryTrack;
        } else {
          // Priority 4: Safe default
          finalPath = "individual";
        }
      }
    }

    // 3. Determine final plan
    let finalPlan = "";
    if (finalPath === "enterprise") {
      finalPlan = "enterprise";
    } else if (finalPath === "team") {
      if (answers.team_size === "2-5") {
        finalPlan = "dealer_pilot";
      } else {
        finalPlan = "team_growth";
      }
    } else {
      // Individual path
      if (urlType === "rep_basic" || urlType === "rep_voice_pro" || urlType === "partner_rep") {
        finalPlan = urlType;
      } else {
        finalPlan = "rep_basic"; // Safe default
      }
    }

    // 4. Build aligned GHL tags array (prevent conflicts)
    const finalTags: string[] = [
      "SeptiVolt - Funnel Lead",
      "SeptiVolt - Assessment Completed"
    ];

    if (finalPath === "individual") {
      finalTags.push("SeptiVolt - Individual");
    } else if (finalPath === "team") {
      finalTags.push("SeptiVolt - Team");
    } else if (finalPath === "enterprise") {
      finalTags.push("SeptiVolt - Enterprise");
    }

    finalTags.push(`SeptiVolt - ${maturity}`);

    if (finalPlan === "rep_basic") {
      finalTags.push("septivolt_rep_basic_interest");
    } else if (finalPlan === "rep_voice_pro") {
      finalTags.push("septivolt_voice_pro_interest");
    } else if (finalPlan === "partner_rep") {
      finalTags.push("septivolt_partner_rep_access");
    } else if (finalPlan === "dealer_pilot") {
      finalTags.push("septivolt_dealer_pilot_interest");
    } else if (finalPlan === "team_growth") {
      finalTags.push("septivolt_team_growth_interest");
    } else if (finalPlan === "enterprise") {
      finalTags.push("septivolt_enterprise_interest");
    }

    if (answers.language === "es" || answers.language === "both") {
      finalTags.push("septivolt_bilingual_interest");
    }

    const teamSizeNum = answers.team_size
      ? (answers.team_size === "50+" ? 50 : parseInt(answers.team_size) || 0)
      : (urlReps ? parseInt(urlReps) || 0 : 0);

    const payload = {
      lead_source: urlSource ? `septivolt_cta_${urlSource}` : "septivolt_public_assessment",
      assessment_variant: ASSESSMENT_VARIANT,
      funnel_type: "public_qualification",
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.company || "",
      role: answers.lead_type || "",
      team_size: teamSizeNum,
      language_preference: language,
      score: normalizedScore,
      maturity_class: maturity,
      recommended_path: finalPath,
      recommended_plan: finalPlan,
      enterprise_interest: finalPath === "enterprise" || finalPlan === "enterprise",
      requested_demo: finalPath === "enterprise" || finalPath === "team" || finalPlan === "enterprise" || finalPlan === "team_growth" || finalPlan === "dealer_pilot",
      high_intent: normalizedScore > 80 || finalPlan === "enterprise" || finalPlan === "team_growth" || finalPlan === "dealer_pilot",
      bilingual_interest: answers.language === "es" || answers.language === "both",
      cta_source: urlSource || "direct",
      cta_type: urlType || "general",
      cta_reps: urlReps || "",
      tags: finalTags,
      summary: `Score: ${normalizedScore}% | Track: ${finalPath} | Plan: ${finalPlan} | Source: ${urlSource || 'direct'} | Reps: ${urlReps || 'n/a'} | Weaknesses: ${weaknesses.length} | Insights: ${insights.length}`
    };

    try {
      const res = await fetch("/api/ghl", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      })

      if (!res.ok) throw new Error("Submission failed")
      
      setSubmissionLock(formData.email);
      clearFunnelProgress();
      setIsSubmitted(true)
      setCurrentStep(currentStep + 1)
      trackEvent('funnel_complete', { 
        track: winningTrack, 
        score: normalizedScore,
        lang: language,
        language_preference: language,
        assessment_variant: ASSESSMENT_VARIANT
      });
    } catch (err) {
      setError(t("funnel.error_generic", language))
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
    const showPrefillBanner = prefillApplied && currentStep <= 2 && urlType && PLAN_LABEL_MAP[urlType]
    return (
      <div className="space-y-8">
        {showPrefillBanner && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-xs font-body leading-relaxed">
              We started you on the <strong>{PLAN_LABEL_MAP[urlType]}</strong> path based on the page you came from.
              {" "}You can change this anytime — just select a different answer below.
            </p>
          </div>
        )}
        {/* Partner rep notice */}
        {urlType === "partner_rep" && currentStep === 0 && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 text-[#F59E0B]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-xs font-body leading-relaxed">
              Free onboarding access is for <strong>approved partner and internal reps</strong> only (Rob's direct reps & Erick Sanchez's recruits). All others will be shown the appropriate paid plan.
            </p>
          </div>
        )}
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F97316] font-display">
            {t("funnel.module", language)} {currentStep + 1} / {totalSteps}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight leading-tight uppercase italic">
            {t(q.text, language)}
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
                <span className="text-lg font-medium">{t(opt.label, language)}</span>
                <ChevronRight className={cn(
                  "w-5 h-5 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-[#F97316]",
                  answers[q.id] === opt.id && "text-[#F97316] translate-x-1"
                )} />
              </div>
            </button>
          ))}
        </div>

        {(q.isOptional || answers[q.id]) && (
          <div className="flex justify-end pt-4">
            <button 
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="group flex items-center gap-2 text-[#F97316] font-black uppercase tracking-[0.2em] italic text-sm hover:translate-x-1 transition-all"
            >
              {t("funnel.cta.next", language)} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderLeadForm = () => {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] font-display">
            {t("funnel.final_step.title", language)}
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight leading-tight uppercase italic">
            {t("funnel.final_step.subtitle", language)}
          </h2>
          <p className="text-slate-400 font-light">
            {t("funnel.final_step.description", language)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">{t("funnel.form.first_name", language)}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="text"
                  placeholder={t("funnel.form.first_name_placeholder", language)}
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">{t("funnel.form.last_name", language)}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="text"
                  placeholder={t("funnel.form.last_name_placeholder", language)}
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">{t("funnel.form.email", language)}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                required
                type="email"
                placeholder={t("funnel.form.email_placeholder", language)}
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">{t("funnel.form.phone", language)}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  required
                  type="tel"
                  placeholder={t("funnel.form.phone_placeholder", language)}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 font-display">{t("funnel.form.company", language)}</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="text"
                  placeholder={t("funnel.form.company_placeholder", language)}
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
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t("funnel.cta.generate", language)} <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    )
  }

  const renderResult = () => {
    const trackDetails = {
      individual: {
        title: t("funnel.results.tracks.individual.title", language),
        desc: t("funnel.results.tracks.individual.desc", language, { maturity: translatedMaturity }),
        cta1: { label: t("funnel.cta.individual_access", language), href: "/pricing" },
        cta2: { label: t("funnel.cta.learn_more", language), href: "/pricing" },
        icon: User
      },
      team: {
        title: t("funnel.results.tracks.team.title", language),
        desc: t("funnel.results.tracks.team.desc", language, { maturity: translatedMaturity }),
        cta1: { label: t("funnel.cta.book_demo", language), href: "/enterprise" },
        cta2: { label: t("funnel.cta.team_license", language), href: "/enterprise?tier=team" },
        icon: Users
      },
      bilingual: {
        title: t("funnel.results.tracks.bilingual.title", language),
        desc: t("funnel.results.tracks.bilingual.desc", language, { maturity: translatedMaturity }),
        cta1: { label: t("funnel.cta.strategy_call", language), href: "/enterprise" },
        cta2: { label: t("funnel.cta.spanish_interest", language), href: "/enterprise?interest=spanish" },
        icon: Globe
      },
      enterprise: {
        title: t("funnel.results.tracks.enterprise.title", language),
        desc: t("funnel.results.tracks.enterprise.desc", language, { maturity: translatedMaturity }),
        cta1: { label: t("funnel.cta.custom_quote", language), href: "/enterprise?tier=enterprise" },
        cta2: { label: t("funnel.cta.strategy_call", language), href: "/enterprise" },
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
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 font-display">{t("funnel.results.complete", language)}</h2>
            <h1 className="text-4xl md:text-6xl font-black font-display uppercase italic tracking-tighter leading-[0.9]">
              {t("funnel.results.your_path", language)}
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
             { label: t("funnel.results.maturity_label", language), val: translatedMaturity.toUpperCase(), sub: t(`funnel.results.maturity_explanations.${normalizeResultKey(maturity)}`, language), icon: ShieldCheck },
             { label: t("funnel.results.confidence_label", language), val: `${confidenceScore}%`, icon: Zap },
             { label: t("funnel.results.gaps_label", language), val: `${weaknesses.length} ${t("funnel.results.detected", language)}`, icon: BarChart3 },
             { label: t("funnel.results.status_label", language), val: t("funnel.results.verified", language), icon: CheckCircle2 }
           ].map((stat, i) => (
             <div key={i} className="glass-card p-6 border border-white/5 text-center space-y-2 flex flex-col justify-between">
                <div>
                  <stat.icon className="w-4 h-4 text-slate-500 mx-auto mb-2" />
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-display">{stat.label}</div>
                  <div className="metrics-font font-bold text-white text-sm tracking-tighter italic">{stat.val}</div>
                </div>
                {stat.sub && (
                  <div className="text-[9px] text-slate-400 font-light mt-2 leading-tight uppercase tracking-tighter">
                    {stat.sub}
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* Key Weaknesses & Opportunities Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-8 border border-white/10 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#F97316]/30 group-hover:bg-[#F97316] transition-colors" />
            <h4 className="text-sm font-black uppercase tracking-widest text-[#F97316] font-display flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> {t("funnel.results.gaps_label", language)}
            </h4>
            <ul className="space-y-4">
              {weaknesses.length > 0 ? weaknesses.map((w, i) => (
                <li key={i} className="text-slate-300 text-sm flex gap-3 items-start animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="text-[#F97316] mt-1">•</span>
                  <span className="font-light leading-relaxed">{t(`funnel.results.weaknesses.${normalizeResultKey(w)}`, language)}</span>
                </li>
              )) : (
                <li className="text-slate-500 text-sm italic">{t("funnel.results.no_weaknesses", language)}</li>
              )}
            </ul>
          </div>
          <div className="glass-card p-8 border border-white/10 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#F59E0B]/30 group-hover:bg-[#F59E0B] transition-colors" />
            <h4 className="text-sm font-black uppercase tracking-widest text-[#F59E0B] font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> {t("funnel.results.insights_label", language)}
            </h4>
            <ul className="space-y-4">
              {insights.length > 0 ? insights.map((ins, i) => (
                <li key={i} className="text-slate-300 text-sm flex gap-3 items-start animate-in slide-in-from-left duration-500" style={{ animationDelay: `${(i + weaknesses.length) * 100}ms` }}>
                  <span className="text-[#F59E0B] mt-1">→</span>
                  <span className="font-light leading-relaxed">{t(`funnel.results.insights.${normalizeResultKey(ins)}`, language)}</span>
                </li>
              )) : (
                <li className="text-slate-500 text-sm italic">{t("funnel.results.no_insights", language)}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-32">
      {/* Language Switcher UI */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F97316] flex items-center justify-center font-black text-white italic text-lg hud-border">
            S
          </div>
          <span className="font-display font-black tracking-tighter uppercase italic text-xl text-white">
            Septivolt
          </span>
        </div>
      </div>

      {/* Funnel Intro Header — only shown before any questions are answered */}
      {currentStep === 0 && !isSubmitted && (
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black font-display uppercase italic tracking-tighter leading-tight">
            Find the Right SeptiVolt Path
            <br />
            <span className="text-[#F97316]">for You or Your Solar Team</span>
          </h1>
          <p className="text-slate-400 font-body font-light max-w-2xl mx-auto text-base leading-relaxed">
            Answer a few questions and SeptiVolt will recommend the right training, AI simulation, or team readiness plan based on your role, team size, and sales process.
          </p>
          <p className="text-slate-500 text-sm font-body">
            ⏱ Takes about 2 minutes. Your answers help us recommend the right SeptiVolt path for your role, team size, and sales process.
          </p>
        </div>
      )}



      {/* Language switcher — positioned absolutely top-right on the page */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-1 bg-[#121212]/90 backdrop-blur-sm p-1 border border-white/10 hud-border hud-corner-tl hud-corner-br">
        <button
          onClick={() => handleLanguageSwitch('en')}
          className={cn(
            "px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all",
            language === 'en' ? "bg-[#F97316] text-white" : "text-slate-500 hover:text-white"
          )}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageSwitch('es')}
          className={cn(
            "px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all",
            language === 'es' ? "bg-[#F97316] text-white" : "text-slate-500 hover:text-white"
          )}
        >
          ES
        </button>
      </div>

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
            <ArrowLeft className="w-3 h-3" /> {t("funnel.cta.previous", language)}
          </motion.button>
        )}
      </div>
      {showResumePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-md w-full p-8 border border-white/10 text-center space-y-6 hud-border"
          >
            <div className="w-16 h-16 rounded-full bg-[#F97316]/20 flex items-center justify-center mx-auto border border-[#F97316]/40">
              <Sparkles className="w-8 h-8 text-[#F97316]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic font-display">{t("funnel.resume.title", language)}</h3>
              <p className="text-slate-400 font-light">{t("funnel.resume.description", language)}</p>
            </div>
            <div className="grid gap-3 pt-4">
              <button 
                onClick={handleResume}
                className="btn-primary py-4 italic"
              >
                {t("funnel.resume.cta_resume", language)}
              </button>
              <button 
                onClick={handleStartFresh}
                className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                {t("funnel.resume.cta_fresh", language)}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
