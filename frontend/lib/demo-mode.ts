import { DebriefRecord } from "@/lib/debrief-storage"
import { AnalyticsSnapshot } from "@/lib/analytics-api"
import { CertificationSnapshot } from "@/lib/certification-api"
import { LeaderboardRep } from "@/components/platform/leaderboard-components"

/**
 * Checks if Safe Demo Mode is active.
 * Activated by NEXT_PUBLIC_SEPTIVOLT_DEMO_MODE=true or localStorage flag septivolt_demo_mode === "true".
 * Safe Demo Mode will NOT activate if NEXT_PUBLIC_ALLOW_DEMO_MODE is explicitly "false".
 */
export function isDemoModeActive(): boolean {
  if (typeof window === "undefined") return false

  // Strict safety override check
  if (process.env.NEXT_PUBLIC_ALLOW_DEMO_MODE === "false") {
    return false
  }

  const envFlag = process.env.NEXT_PUBLIC_SEPTIVOLT_DEMO_MODE === "true"
  const localFlag = window.localStorage.getItem("septivolt_demo_mode") === "true"

  return envFlag || localFlag
}

/** Toggles the local storage demo mode flag and reloads the window if necessary */
export function toggleDemoMode(enabled: boolean): void {
  if (typeof window === "undefined") return
  if (enabled) {
    window.localStorage.setItem("septivolt_demo_mode", "true")
  } else {
    window.localStorage.removeItem("septivolt_demo_mode")
  }
}

// ─── Mock Roster ─────────────────────────────────────────────────────────────
export type DemoRep = {
  id: string
  name: string
  email: string
  role: string
  dayProgress: number
  totalDays: number
  lastScore: number
  active: boolean
  needsAttention: boolean
  isDemo: true
  source: "demo"
}

export const DEMO_TEAM_ROSTER: DemoRep[] = [
  { id: "demo-rep-1", name: "Sarah Connor", email: "sarah.connor@septivolt.com", role: "Trainee", dayProgress: 5, totalDays: 7, lastScore: 88, active: true, needsAttention: false, isDemo: true, source: "demo" },
  { id: "demo-rep-2", name: "John Doe", email: "john.doe@septivolt.com", role: "Trainee", dayProgress: 2, totalDays: 7, lastScore: 64, active: true, needsAttention: true, isDemo: true, source: "demo" },
  { id: "demo-rep-3", name: "Maria Rodriguez", email: "maria.r@septivolt.com", role: "Trainee", dayProgress: 6, totalDays: 7, lastScore: 85, active: true, needsAttention: false, isDemo: true, source: "demo" },
  { id: "demo-rep-4", name: "Derek Burns", email: "derek.b@septivolt.com", role: "Trainee", dayProgress: 1, totalDays: 7, lastScore: 52, active: false, needsAttention: true, isDemo: true, source: "demo" },
  { id: "demo-rep-5", name: "Ana Gutierrez", email: "ana.g@septivolt.com", role: "Trainee", dayProgress: 7, totalDays: 7, lastScore: 93, active: true, needsAttention: false, isDemo: true, source: "demo" },
  { id: "demo-rep-6", name: "Marcus Vance", email: "marcus.v@septivolt.com", role: "Trainee", dayProgress: 4, totalDays: 7, lastScore: 78, active: true, needsAttention: false, isDemo: true, source: "demo" },
  { id: "demo-rep-7", name: "Chloe Bennett", email: "chloe.b@septivolt.com", role: "Trainee", dayProgress: 3, totalDays: 7, lastScore: 60, active: true, needsAttention: true, isDemo: true, source: "demo" },
  { id: "demo-rep-8", name: "Hector Espinoza", email: "hector.e@septivolt.com", role: "Trainee", dayProgress: 5, totalDays: 7, lastScore: 89, active: true, needsAttention: false, isDemo: true, source: "demo" },
]

export function getDemoRoster(): DemoRep[] {
  return DEMO_TEAM_ROSTER
}

// ─── Mock Debriefs ───────────────────────────────────────────────────────────
export interface DemoDebriefRecord extends DebriefRecord {
  isDemo: true
  source: "demo"
}

export const DEMO_DEBRIEFS: DemoDebriefRecord[] = [
  {
    id: "debrief-demo-1",
    scenarioId: "mod_5_1",
    scenarioName: "Day 5 Objection Stack: Lease vs Purchase Rebuttal",
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
    passed: false,
    score: 64,
    feedbackSummary: "You reacted defensively to the lease vs purchase comparison, jumping straight to price quotes before validating the customer's utility rate concerns. Anchor value first.",
    toneRating: "Defensive / Rushed",
    toneFeedback: "Spoke with high speed and raised pitch when utility contract lengths were questioned.",
    strengths: ["Clear tone of voice", "Polite opening greeting"],
    improvements: ["Failed to anchor solar value before pricing rebuttal", "Interrupted the customer during lease vs purchase objection"],
    suggestedScript: "Customer: 'I don't want to sign a 25-year lease.'\nRep: 'I completely understand that a 25-year commitment sounds long. The reason it's structured this way is to lock in your energy rate so the utility company can't raise it on you. If you were to sell the home, the agreement transfers to the new owner just like your trash or water bill, but they get a lower electric rate. Does that help clarify how it's designed to protect you?'",
    transcript: [
      { role: "Customer", content: "Look, I don't want to sign a 25-year lease. That's a huge commitment." },
      { role: "You", content: "But it's cheaper than your utility company. You'll save money on day one." },
      { role: "Customer", content: "Still, 25 years is a long time. What if I sell the house?" },
      { role: "You", content: "You just transfer it. It's really easy. We do it all the time." }
    ],
    isDemo: true,
    source: "demo"
  },
  {
    id: "debrief-demo-2",
    scenarioId: "mod_3_1",
    scenarioName: "Day 3 Consultative Discovery Framework",
    completedAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hrs ago
    passed: false,
    score: 60,
    feedbackSummary: "While you identified the utility rate hike, you did not qualify the physical site (roof age) or identify if both spouses need to be present for the design review.",
    toneRating: "Informal",
    toneFeedback: "Tone was highly casual. Try to maintain professional consult structures.",
    strengths: ["Good energy", "Asked about high summer electric bills"],
    improvements: ["Skipped questions about roof age and sun exposure", "Failed to identify financial decision makers"],
    suggestedScript: "Rep: 'To make sure our engineering team design is 100% accurate for your roof, how old is the current shingle layout, and do you know if you have any shade from those trees in the afternoon?'",
    transcript: [
      { role: "You", content: "Hi! How much is your electric bill usually?" },
      { role: "Customer", content: "In the summer it gets up to $350. It's getting ridiculous." },
      { role: "You", content: "Yeah solar will definitely fix that. Let's look at a design. Are you the homeowner?" },
      { role: "Customer", content: "Yes, my wife and I own the house." },
      { role: "You", content: "Great, I'll draw it up right now." }
    ],
    isDemo: true,
    source: "demo"
  },
  {
    id: "debrief-demo-3",
    scenarioId: "mod_4_1",
    scenarioName: "Day 4 Manejo de Objeciones (Spanish)",
    completedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // Yesterday
    passed: true,
    score: 85,
    feedbackSummary: "Manejó la objeción sobre el costo del sistema explicando claramente el modelo de Financiamiento con Ahorro Neto Inmediato en español. Excelente nivel de fluidez y terminología técnica.",
    toneRating: "Empático / Profesional",
    toneFeedback: "Tono calmado, excelente ritmo de habla y pausas oportunas.",
    strengths: ["Excelente empatía y validación inicial", "Buen manejo de la objeción del costo inicial"],
    improvements: ["Podría detallar más el desglose del crédito fiscal federal (ITC)"],
    suggestedScript: "Cliente: 'No tengo $20,000 para poner paneles solares ahora.'\nRepresentante: 'Entiendo perfectamente, $20,000 es una inversión importante. Precisamente por eso, la mayoría de las familias aquí en SeptiVolt eligen el programa de financiamiento sin enganche. En lugar de pagarle a la compañía de luz un pago mensual que siempre sube, usted simplemente reemplaza esa factura por un pago fijo de paneles que es menor y se convierte en su propio dueño. Al final, no está gastando dinero extra, sino redirigiendo lo que ya paga hoy. ¿Tiene sentido ese flujo?'",
    transcript: [
      { role: "Customer", content: "Es que no tengo el dinero para comprar los paneles solares. Es muy caro." },
      { role: "You", content: "Le comprendo, señor García. Pero no requiere pago inicial. Lo que hacemos es sustituir su factura de luz actual." },
      { role: "Customer", content: "¿Cómo que sustituir? ¿No tendré dos facturas entonces?" },
      { role: "You", content: "No, la factura de la compañía eléctrica se reduce casi a cero, y usted solo paga la cuota fija mensual del sistema solar, la cual es menor que lo que paga hoy." }
    ],
    isDemo: true,
    source: "demo"
  },
  {
    id: "debrief-demo-4",
    scenarioId: "mod_7_1",
    scenarioName: "Day 7 Certification Graduation Simulator",
    completedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    passed: true,
    score: 93,
    feedbackSummary: "Flawless performance mapping out the customer's utility escalations and positioning the SeptiVolt battery stack to solve local blackout problems. Complete compliance safety throughout.",
    toneRating: "Confident & Authority-Driven",
    toneFeedback: "Extremely steady speed, clear articulation, and zero hesitation words.",
    strengths: ["Masterful discovery loop", "Clear compliance adherence on solar guarantees", "Strong urgency closing"],
    improvements: ["Slightly rushed transition into pricing presentation"],
    suggestedScript: "Rep: 'Based on what you shared about the medical equipment backup needs during blackouts, the Smart-Storage add-on is indeed a necessity, not just a luxury. Let's lock in the site assessment for this Thursday so we can verify if the electrical panel needs a sub-panel upgrade. Would morning or afternoon work better?'",
    transcript: [
      { role: "Customer", content: "We get power outages here every winter, and my husband has medical equipment that must stay on." },
      { role: "You", content: "I appreciate you sharing that. In that case, we need to design a system with our dual-battery storage backup so that you have continuous power. Let's make sure it's sized correctly." },
      { role: "Customer", content: "That makes me feel a lot better. How long does installation take?" },
      { role: "You", content: "Usually 1 to 2 days, but we manage the entire permitting process with the city so you don't have to worry about anything." }
    ],
    isDemo: true,
    source: "demo"
  },
  {
    id: "debrief-demo-5",
    scenarioId: "mod_5_2",
    scenarioName: "Day 5 Urgency & Commitment Close",
    completedAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
    passed: true,
    score: 89,
    feedbackSummary: "Solid closing pitch with clear next steps. Walked through the utility agreement transitions clearly.",
    toneRating: "Persuasive",
    toneFeedback: "Warm tone, excellent validation of lease transition logistics.",
    strengths: ["Great rapport", "Strong transition to contract terms"],
    improvements: ["Clarify solar loan interest rates earlier"],
    suggestedScript: "Rep: 'Once the utility interconnection agreement is signed, we submit for the final net metering permit. You are protected under our locked pricing agreement. Shall we proceed?'",
    transcript: [
      { role: "You", content: "Everything looks set for the engineering review. We just need to submit the utility permit." },
      { role: "Customer", content: "Okay, sounds good. I'm ready to move forward." }
    ],
    isDemo: true,
    source: "demo"
  }
]

export function getDemoDebriefs(): DemoDebriefRecord[] {
  return DEMO_DEBRIEFS
}

// ─── Mock Leaderboards ────────────────────────────────────────────────────────
export function getDemoLeaderboard(currentUsername?: string): LeaderboardRep[] {
  const baseReps: LeaderboardRep[] = [
    {
      id: "demo-rep-5",
      name: "Ana Gutierrez",
      company: "SeptiVolt Energy",
      team: "West Mavericks",
      score: 4920,
      simulationsCompleted: 112,
      currentStreak: 21,
      badgesEarned: 14,
      xpTotal: 19680,
      level: 15,
      weeklyProgress: 95,
      skillScores: { prospecting: 92, discovery: 94, presentation: 95, objections: 89, closing: 93 },
      skillSimulationCount: { prospecting: 25, discovery: 24, presentation: 22, objections: 21, closing: 20 },
      achievements: ["Closing Specialist", "7-Day Accelerator Graduate", "Discovery Master"]
    },
    {
      id: "demo-rep-8",
      name: "Hector Espinoza",
      company: "SeptiVolt Energy",
      team: "East Current",
      score: 4790,
      simulationsCompleted: 104,
      currentStreak: 18,
      badgesEarned: 12,
      xpTotal: 19160,
      level: 14,
      weeklyProgress: 90,
      skillScores: { prospecting: 88, discovery: 90, presentation: 91, objections: 87, closing: 89 },
      skillSimulationCount: { prospecting: 22, discovery: 21, presentation: 20, objections: 21, closing: 20 },
      achievements: ["Objection Crusher", "7-Day Accelerator Graduate"]
    },
    {
      id: "demo-rep-1",
      name: "Sarah Connor",
      company: "SeptiVolt Energy",
      team: "West Mavericks",
      score: 4610,
      simulationsCompleted: 98,
      currentStreak: 15,
      badgesEarned: 11,
      xpTotal: 18440,
      level: 13,
      weeklyProgress: 88,
      skillScores: { prospecting: 86, discovery: 88, presentation: 89, objections: 84, closing: 87 },
      skillSimulationCount: { prospecting: 20, discovery: 20, presentation: 19, objections: 19, closing: 20 },
      achievements: ["Presentation Pro", "7-Day Accelerator Graduate"]
    },
    {
      id: "demo-rep-3",
      name: "Maria Rodriguez",
      company: "SeptiVolt Energy",
      team: "East Current",
      score: 4430,
      simulationsCompleted: 92,
      currentStreak: 12,
      badgesEarned: 9,
      xpTotal: 17720,
      level: 12,
      weeklyProgress: 85,
      skillScores: { prospecting: 84, discovery: 85, presentation: 86, objections: 82, closing: 84 },
      skillSimulationCount: { prospecting: 19, discovery: 18, presentation: 18, objections: 18, closing: 19 },
      achievements: ["Discovery Master"]
    },
    {
      id: "demo-rep-6",
      name: "Marcus Vance",
      company: "SeptiVolt Energy",
      team: "South Voltage",
      score: 4180,
      simulationsCompleted: 85,
      currentStreak: 9,
      badgesEarned: 8,
      xpTotal: 16720,
      level: 11,
      weeklyProgress: 80,
      skillScores: { prospecting: 80, discovery: 82, presentation: 83, objections: 78, closing: 81 },
      skillSimulationCount: { prospecting: 17, discovery: 17, presentation: 17, objections: 17, closing: 17 },
      achievements: ["7-Day Accelerator Graduate"]
    },
    {
      id: "demo-rep-2",
      name: "John Doe",
      company: "SeptiVolt Energy",
      team: "West Mavericks",
      score: 3820,
      simulationsCompleted: 78,
      currentStreak: 4,
      badgesEarned: 6,
      xpTotal: 15280,
      level: 10,
      weeklyProgress: 72,
      skillScores: { prospecting: 74, discovery: 76, presentation: 78, objections: 72, closing: 75 },
      skillSimulationCount: { prospecting: 16, discovery: 15, presentation: 16, objections: 15, closing: 16 },
      achievements: []
    },
    {
      id: "demo-rep-7",
      name: "Chloe Bennett",
      company: "SeptiVolt Energy",
      team: "South Voltage",
      score: 3640,
      simulationsCompleted: 70,
      currentStreak: 3,
      badgesEarned: 5,
      xpTotal: 14560,
      level: 9,
      weeklyProgress: 68,
      skillScores: { prospecting: 72, discovery: 73, presentation: 75, objections: 70, closing: 72 },
      skillSimulationCount: { prospecting: 14, discovery: 14, presentation: 14, objections: 14, closing: 14 },
      achievements: []
    },
    {
      id: "demo-rep-4",
      name: "Derek Burns",
      company: "SeptiVolt Energy",
      team: "Northeast Orbit",
      score: 3120,
      simulationsCompleted: 62,
      currentStreak: 0,
      badgesEarned: 4,
      xpTotal: 12480,
      level: 8,
      weeklyProgress: 55,
      skillScores: { prospecting: 68, discovery: 69, presentation: 70, objections: 65, closing: 67 },
      skillSimulationCount: { prospecting: 13, discovery: 12, presentation: 12, objections: 12, closing: 13 },
      achievements: []
    }
  ]

  // Add the current logged-in user at Rank 4 dynamically
  if (currentUsername) {
    const userIndex = baseReps.findIndex((r) => r.id === currentUsername)
    if (userIndex === -1) {
      const userRep: LeaderboardRep = {
        id: currentUsername,
        name: `${currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1)} (You)`,
        company: "SeptiVolt Energy",
        team: "West Mavericks",
        score: 4520,
        simulationsCompleted: 11, // Matching overall completed count
        currentStreak: 3,
        badgesEarned: 4,
        xpTotal: 17000,
        level: 9,
        weeklyProgress: 82,
        skillScores: { prospecting: 84, discovery: 87, presentation: 88, objections: 80, closing: 85 },
        skillSimulationCount: { prospecting: 3, discovery: 2, presentation: 2, objections: 2, closing: 2 },
        achievements: ["Discovery Master"]
      }
      // Insert user so they fit in the sorted ranks
      const insertAt = baseReps.findIndex((r) => r.score < userRep.score)
      if (insertAt !== -1) {
        baseReps.splice(insertAt, 0, userRep)
      } else {
        baseReps.push(userRep)
      }
    }
  }

  // Tag every item
  return baseReps.map((r) => ({
    ...r,
    isDemo: true,
    source: "demo"
  })) as (LeaderboardRep & { isDemo: boolean; source: string })[]
}

// ─── Mock Analytics Snapshot ──────────────────────────────────────────────────
export const DEMO_ANALYTICS_SNAPSHOT: AnalyticsSnapshot & { isDemo: boolean; source: string } = {
  overallPerformanceScore: 84,
  simulationsCompleted: 142,
  averageSimulationScore: 82,
  currentTrainingStreak: 12,
  certificationsEarned: 3,
  xpEarned: 19850,
  levelProgress: 65,
  leaderboardRank: 3,
  skills: {
    prospecting: { score: 82, trend: 4, improvement: 8 },
    discovery: { score: 85, trend: 3, improvement: 7 },
    presentation: { score: 88, trend: 5, improvement: 9 },
    objections: { score: 79, trend: -1, improvement: 3 },
    closing: { score: 84, trend: 2, improvement: 6 },
  },
  scoreTrend: Array.from({ length: 12 }, (_, index) => {
    const score = 70 + Math.floor(index * 1.5) + (index % 3)
    return {
      label: `W${index + 1}`,
      score,
      rollingAverage: score - 1,
      dateIso: new Date(Date.now() - (11 - index) * 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    }
  }),
  simulationHistory: [
    { id: "sim-demo-1", scenarioName: "Day 5 Objection Handling: Lease vs Purchase Rebuttal", score: 64, skillsTested: ["objections", "closing"], result: "needs-improvement", dateIso: new Date(Date.now() - 7200000).toISOString().slice(0, 10), scenarioType: "intermediate" },
    { id: "sim-demo-2", scenarioName: "Day 3 Consultative Discovery Framework", score: 60, skillsTested: ["discovery"], result: "needs-improvement", dateIso: new Date(Date.now() - 18000000).toISOString().slice(0, 10), scenarioType: "beginner" },
    { id: "sim-demo-3", scenarioName: "Day 4 Manejo de Objeciones (Spanish)", score: 85, skillsTested: ["objections"], result: "pass", dateIso: new Date(Date.now() - 86400000).toISOString().slice(0, 10), scenarioType: "intermediate" },
    { id: "sim-demo-4", scenarioName: "Day 7 Certification Graduation Simulator", score: 93, skillsTested: ["prospecting", "discovery", "presentation", "closing"], result: "pass", dateIso: new Date(Date.now() - 172800000).toISOString().slice(0, 10), scenarioType: "advanced" },
    { id: "sim-demo-5", scenarioName: "Day 5 Urgency & Commitment Close", score: 89, skillsTested: ["closing"], result: "pass", dateIso: new Date(Date.now() - 259200000).toISOString().slice(0, 10), scenarioType: "intermediate" }
  ],
  coachingInsights: [
    { title: "Lease vs Buy Friction", detail: "Reps struggle to pivot lease objections into utility price-lock discussions.", severity: "high" },
    { title: "Federal Tax Credit (ITC) Explanation", detail: "Spanish-speaking reps require clearer outlines of tax eligibility terms in Spanish.", severity: "medium" },
    { title: "Site Assessment Qualification", detail: "Discovery checklists show missing questions regarding tree shading and roof age.", severity: "low" }
  ],
  recommendations: [
    { title: "Run Objection Stack Simulation", rationale: "Team objections score averages 79%, lowest of all focus areas.", action: "Complete the Day 5 lease objection lesson." },
    { title: "Review Spanish ITC Explainer Slide", rationale: "Maria and Hector both noted lack of clear Spanish tax credit terms in chats.", action: "Open Day 4 resources and review the localized ITC slide." }
  ],
  teamOverview: [
    { teamName: "West Mavericks", avgScore: 84, improvingReps: 3, coachingNeeded: 1, readyForDeployment: 2, certificationCompletion: 85 },
    { teamName: "East Current", avgScore: 81, improvingReps: 2, coachingNeeded: 0, readyForDeployment: 2, certificationCompletion: 80 },
    { teamName: "South Voltage", avgScore: 78, improvingReps: 2, coachingNeeded: 2, readyForDeployment: 1, certificationCompletion: 70 },
    { teamName: "Northeast Orbit", avgScore: 75, improvingReps: 1, coachingNeeded: 1, readyForDeployment: 0, certificationCompletion: 60 },
  ],
  isDemo: true,
  source: "demo"
}

export function getDemoAnalyticsSnapshot(): AnalyticsSnapshot {
  return DEMO_ANALYTICS_SNAPSHOT
}

// ─── Mock Certification Snapshot ──────────────────────────────────────────────
export const DEMO_CERTIFICATION_SNAPSHOT: CertificationSnapshot & { isDemo: boolean; source: string } = {
  tracks: [
    {
      id: "septivolt-certified-solar-rep",
      title: "SeptiVolt Certified Solar Rep",
      description: "Core qualification validating full-path readiness from training module mastery through live AI scenario execution.",
      whyItMatters: "This flagship credential signals a rep can move from discovery to close using SeptiVolt standards and compliance-safe communication.",
      status: "in-progress",
      progress: 85,
      requiredModules: ["Day 1 Foundations", "Day 3 Discovery", "Day 5 Objection Handling", "Day 7 Certification Prep"],
      requiredSimulationScore: 85,
      unlockCriteria: "Complete all core modules and maintain 80+ average across the last 5 simulations.",
      requirements: [
        { id: "m1", label: "Complete required lesson modules", complete: true },
        { id: "m2", label: "Pass required simulation with target score 85+", complete: true },
        { id: "m3", label: "Maintain compliance threshold above 92%", complete: true },
        { id: "m4", label: "Complete final certification assessment", complete: false },
      ],
      assessment: {
        name: "Final Certification Scenario: Residential Value Stack",
        skillsTested: ["Discovery", "Presentation", "Objection Handling", "Closing"],
        targetScore: 88,
        currentScore: 82,
        passed: false,
        attemptsUsed: 1,
        maxAttempts: 3,
      },
      earnedDate: null,
      xpValue: 1200,
      levelReward: "Closer L13 eligibility",
      credentialId: null,
      statusHistory: [
        { date: "2026-05-10", event: "Track unlocked", actor: "System" },
        { date: "2026-05-12", event: "Simulation prerequisite met", actor: "AI Evaluator" },
        { date: "2026-05-15", event: "Assessment attempt completed", actor: "AI Evaluator" },
      ],
    },
    {
      id: "discovery-master",
      title: "Discovery Master",
      description: "Specialized credential for high-performance consultative questioning and homeowner qualification flow.",
      whyItMatters: "Teams with stronger discovery metrics close more deals with fewer late-stage objections. This cert validates that discovery discipline.",
      status: "certified",
      progress: 100,
      requiredModules: ["Day 2 Art of Connection", "Day 3 Discovery Framework"],
      requiredSimulationScore: 82,
      unlockCriteria: "Complete discovery modules and pass two discovery-focused simulations at 82+.",
      requirements: [
        { id: "d1", label: "Complete required lesson modules", complete: true },
        { id: "d2", label: "Pass required simulation with target score 82+", complete: true },
        { id: "d3", label: "Maintain compliance threshold above 90%", complete: true },
        { id: "d4", label: "Complete final assessment", complete: true },
      ],
      assessment: {
        name: "Discovery Precision Assessment",
        skillsTested: ["Prospecting", "Discovery"],
        targetScore: 84,
        currentScore: 91,
        passed: true,
        attemptsUsed: 1,
        maxAttempts: 3,
      },
      earnedDate: "2026-05-11",
      xpValue: 500,
      levelReward: "Discovery Aura badge frame",
      credentialId: "SV-DM-2026-0511-014",
      statusHistory: [
        { date: "2026-05-05", event: "Track unlocked", actor: "System" },
        { date: "2026-05-10", event: "Assessment passed", actor: "AI Evaluator" },
        { date: "2026-05-11", event: "Credential issued", actor: "Manager Review Queue" },
      ],
    },
    {
      id: "objection-crusher",
      title: "Objection Crusher",
      description: "Credential proving repeatable rebuttal performance under pressure across pricing, trust, and timing objections.",
      whyItMatters: "Objection handling quality is a leading indicator for close rate and customer trust. This cert ensures reps stay structured under friction.",
      status: "ready",
      progress: 92,
      requiredModules: ["Day 4 Objection Judo", "Day 5 Closing Confidence"],
      requiredSimulationScore: 84,
      unlockCriteria: "Finish objection track modules and complete three objection simulation wins.",
      requirements: [
        { id: "o1", label: "Complete required lesson modules", complete: true },
        { id: "o2", label: "Pass required simulation with target score 84+", complete: true },
        { id: "o3", label: "Maintain compliance threshold above 90%", complete: true },
        { id: "o4", label: "Complete final assessment", complete: false },
      ],
      assessment: {
        name: "High-Pressure Objection Scenario",
        skillsTested: ["Objection Handling", "Closing"],
        targetScore: 86,
        currentScore: null,
        passed: null,
        attemptsUsed: 0,
        maxAttempts: 3,
      },
      earnedDate: null,
      xpValue: 650,
      levelReward: "Rebuttal Circuit title",
      credentialId: null,
      statusHistory: [
        { date: "2026-05-08", event: "Track unlocked", actor: "System" },
        { date: "2026-05-14", event: "Module prerequisites complete", actor: "System" },
        { date: "2026-05-16", event: "Ready for assessment", actor: "AI Evaluator" },
      ],
    }
  ],
  teamProgress: [
    { teamName: "West Mavericks", repsCertified: 8, repsInProgress: 4, repsAtRisk: 1, overallCompletion: 85, managerSignoffPending: 2 },
    { teamName: "East Current", repsCertified: 6, repsInProgress: 5, repsAtRisk: 0, overallCompletion: 80, managerSignoffPending: 1 },
    { teamName: "South Voltage", repsCertified: 5, repsInProgress: 6, repsAtRisk: 2, overallCompletion: 70, managerSignoffPending: 3 },
    { teamName: "Northeast Orbit", repsCertified: 4, repsInProgress: 6, repsAtRisk: 1, overallCompletion: 60, managerSignoffPending: 2 },
  ],
  activeTrackId: "septivolt-certified-solar-rep",
  userId: "demo-user",
  isDemo: true,
  source: "demo"
}

export function getDemoCertificationSnapshot(): CertificationSnapshot {
  return DEMO_CERTIFICATION_SNAPSHOT
}
