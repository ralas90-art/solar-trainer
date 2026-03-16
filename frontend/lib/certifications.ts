export type CertificationStatus = "locked" | "in-progress" | "ready" | "certified"

export type RequirementItem = {
  id: string
  label: string
  complete: boolean
}

export type CertificationAssessment = {
  name: string
  skillsTested: string[]
  targetScore: number
  currentScore: number | null
  passed: boolean | null
  attemptsUsed: number
  maxAttempts: number
}

export type CertificationHistoryItem = {
  date: string
  event: string
  actor: string
}

export type CertificationTrack = {
  id: string
  title: string
  description: string
  whyItMatters: string
  status: CertificationStatus
  progress: number
  requiredModules: string[]
  requiredSimulationScore: number
  unlockCriteria: string
  requirements: RequirementItem[]
  assessment: CertificationAssessment
  earnedDate: string | null
  xpValue: number
  levelReward: string
  credentialId: string | null
  statusHistory: CertificationHistoryItem[]
}

export type TeamCertificationProgress = {
  teamName: string
  repsCertified: number
  repsInProgress: number
  repsAtRisk: number
  overallCompletion: number
  managerSignoffPending: number
}

export const certificationTracks: CertificationTrack[] = [
  {
    id: "septivolt-certified-solar-rep",
    title: "SeptiVolt Certified Solar Rep",
    description: "Core qualification validating full-path readiness from training module mastery through live AI scenario execution.",
    whyItMatters:
      "This flagship credential signals a rep can move from discovery to close using SeptiVolt standards and compliance-safe communication.",
    status: "in-progress",
    progress: 78,
    requiredModules: ["Day 1 Foundations", "Day 3 Discovery", "Day 5 Objection Handling", "Day 7 Certification Prep"],
    requiredSimulationScore: 85,
    unlockCriteria: "Complete all core modules and maintain 80+ average across the last 5 simulations.",
    requirements: [
      { id: "m1", label: "Complete required lesson modules", complete: true },
      { id: "m2", label: "Pass required simulation with target score 85+", complete: true },
      { id: "m3", label: "Maintain compliance threshold above 92%", complete: false },
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
      { date: "2026-02-22", event: "Track unlocked", actor: "System" },
      { date: "2026-02-28", event: "Simulation prerequisite met", actor: "AI Evaluator" },
      { date: "2026-03-08", event: "Assessment attempt failed", actor: "AI Evaluator" },
    ],
  },
  {
    id: "discovery-master",
    title: "Discovery Master",
    description: "Specialized credential for high-performance consultative questioning and homeowner qualification flow.",
    whyItMatters:
      "Teams with stronger discovery metrics close more deals with fewer late-stage objections. This cert validates that discovery discipline.",
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
    earnedDate: "2026-03-02",
    xpValue: 500,
    levelReward: "Discovery Aura badge frame",
    credentialId: "SV-DM-2026-0302-014",
    statusHistory: [
      { date: "2026-02-25", event: "Track unlocked", actor: "System" },
      { date: "2026-03-01", event: "Assessment passed", actor: "AI Evaluator" },
      { date: "2026-03-02", event: "Credential issued", actor: "Manager Review Queue" },
    ],
  },
  {
    id: "objection-crusher",
    title: "Objection Crusher",
    description: "Credential proving repeatable rebuttal performance under pressure across pricing, trust, and timing objections.",
    whyItMatters:
      "Objection handling quality is a leading indicator for close rate and customer trust. This cert ensures reps stay structured under friction.",
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
      { date: "2026-02-26", event: "Track unlocked", actor: "System" },
      { date: "2026-03-07", event: "Module prerequisites complete", actor: "System" },
      { date: "2026-03-10", event: "Ready for assessment", actor: "AI Evaluator" },
    ],
  },
  {
    id: "closing-specialist",
    title: "Closing Specialist",
    description: "Qualification focused on commitment language, urgency framing, and execution of clean next-step closes.",
    whyItMatters:
      "Elite closing behavior compounds pipeline outcomes. This credential identifies reps who convert momentum without pressure-heavy tactics.",
    status: "locked",
    progress: 18,
    requiredModules: ["Day 5 Closing Confidence", "Day 6 Mastery Lab"],
    requiredSimulationScore: 87,
    unlockCriteria: "Reach top-25 percentile on leaderboard and complete closing module path.",
    requirements: [
      { id: "c1", label: "Complete required lesson modules", complete: false },
      { id: "c2", label: "Pass required simulation with target score 87+", complete: false },
      { id: "c3", label: "Maintain compliance threshold above 93%", complete: false },
      { id: "c4", label: "Complete final assessment", complete: false },
    ],
    assessment: {
      name: "Advanced Commitment Assessment",
      skillsTested: ["Presentation", "Closing"],
      targetScore: 90,
      currentScore: null,
      passed: null,
      attemptsUsed: 0,
      maxAttempts: 2,
    },
    earnedDate: null,
    xpValue: 700,
    levelReward: "Closer L14 fast-track",
    credentialId: null,
    statusHistory: [{ date: "2026-03-10", event: "Track locked - waiting unlock criteria", actor: "System" }],
  },
  {
    id: "7-day-accelerator-graduate",
    title: "7-Day Accelerator Graduate",
    description: "Program completion credential proving full execution of SeptiVolt's 7-day ramp framework.",
    whyItMatters:
      "The accelerator credential provides managers and enterprise clients a baseline qualification for onboarding and field deployment readiness.",
    status: "certified",
    progress: 100,
    requiredModules: ["Day 1-7 Core Curriculum"],
    requiredSimulationScore: 80,
    unlockCriteria: "Finish the full 7-day curriculum and pass graduation simulation with 80+.",
    requirements: [
      { id: "a1", label: "Complete required lesson modules", complete: true },
      { id: "a2", label: "Pass required simulation with target score 80+", complete: true },
      { id: "a3", label: "Maintain compliance threshold above 88%", complete: true },
      { id: "a4", label: "Complete final assessment", complete: true },
    ],
    assessment: {
      name: "Accelerator Graduation Simulation",
      skillsTested: ["Prospecting", "Discovery", "Presentation", "Closing"],
      targetScore: 82,
      currentScore: 88,
      passed: true,
      attemptsUsed: 1,
      maxAttempts: 3,
    },
    earnedDate: "2026-03-05",
    xpValue: 850,
    levelReward: "Accelerator Graduate frame",
    credentialId: "SV-7D-2026-0305-004",
    statusHistory: [
      { date: "2026-02-24", event: "Track unlocked", actor: "System" },
      { date: "2026-03-04", event: "Final assessment passed", actor: "AI Evaluator" },
      { date: "2026-03-05", event: "Credential issued", actor: "Manager Review Queue" },
    ],
  },
]

export const teamCertificationProgress: TeamCertificationProgress[] = [
  {
    teamName: "West Mavericks",
    repsCertified: 8,
    repsInProgress: 4,
    repsAtRisk: 1,
    overallCompletion: 82,
    managerSignoffPending: 2,
  },
  {
    teamName: "East Current",
    repsCertified: 6,
    repsInProgress: 5,
    repsAtRisk: 2,
    overallCompletion: 74,
    managerSignoffPending: 3,
  },
  {
    teamName: "Northeast Orbit",
    repsCertified: 7,
    repsInProgress: 6,
    repsAtRisk: 1,
    overallCompletion: 79,
    managerSignoffPending: 2,
  },
  {
    teamName: "South Voltage",
    repsCertified: 5,
    repsInProgress: 6,
    repsAtRisk: 3,
    overallCompletion: 67,
    managerSignoffPending: 4,
  },
]

export const loggedInCertificationId = "septivolt-certified-solar-rep"
