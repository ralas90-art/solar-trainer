"use client"

import { AppShell } from "@/components/platform/app-shell"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"
import { isDemoModeActive } from "@/lib/demo-mode"
import {
  Users, Zap, Award, BarChart3, AlertTriangle,
  MessageSquare, Target, TrendingUp, Clock,
  ChevronRight, CheckCircle, History, Plus, Trash2, Edit, Save, 
  ShieldCheck, Loader2, FileText, Send, UserCheck, Mail, ArrowUpRight, Printer
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function ManagerCommandCenterPage() {
  const { user } = useAuth()
  const { isSpanish } = useLanguage()
  const t = (en: string, es: string) => isSpanish ? es : en

  // Tabs
  const [activeTab, setActiveTab] = useState<"executive" | "branches" | "teams" | "roster" | "alerts" | "actions" | "templates" | "credentials">("executive")

  // Shared Data States
  const [execData, setExecData] = useState<any>(null)
  const [branches, setBranches] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [reps, setReps] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])

  // Loaders
  const [loadingExec, setLoadingExec] = useState(false)
  const [loadingBranches, setLoadingBranches] = useState(false)
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [loadingReps, setLoadingReps] = useState(false)
  const [loadingAlerts, setLoadingAlerts] = useState(false)
  const [loadingInvites, setLoadingInvites] = useState(false)

  // Filters for Roster
  const [rosterFilter, setRosterFilter] = useState<"all" | "needs_coaching" | "certification_ready" | "inactive" | "top_performers">("all")
  const [selectedRep, setSelectedRep] = useState<any>(null)
  const [savingNotes, setSavingNotes] = useState(false)
  const [notesText, setNotesText] = useState("")

  // Single Invite Form States
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteFirstName, setInviteFirstName] = useState("")
  const [inviteLastName, setInviteLastName] = useState("")
  const [inviteRole, setInviteRole] = useState("sales_rep")
  const [inviteBranchId, setInviteBranchId] = useState("")
  const [inviteTeamId, setInviteTeamId] = useState("")
  const [isSendingInvite, setIsSendingInvite] = useState(false)

  // Bulk Assign Form States
  const [assignType, setAssignType] = useState("user")
  const [assignId, setAssignId] = useState("")
  const [assignCurriculum, setAssignCurriculum] = useState("solar_fundamentals_v1")
  const [assignCert, setAssignCert] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)

  // CSV Bulk Upload Form
  const [csvContent, setCsvContent] = useState("")
  const [bulkStatus, setBulkStatus] = useState<any>(null)
  const [isUploadingBulk, setIsUploadingBulk] = useState(false)

  // Templates States
  const [templates, setTemplates] = useState<any[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [previewData, setPreviewData] = useState<any>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [applyTargetType, setApplyTargetType] = useState<"company" | "branch" | "team">("company")
  const [applyTargetId, setApplyTargetId] = useState("")
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Create template form states
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDesc, setNewTemplateDesc] = useState("")
  const [newTemplateScope, setNewTemplateScope] = useState("company")
  const [newTemplateIsGlobal, setNewTemplateIsGlobal] = useState(false)
  const [newTemplateRoles, setNewTemplateRoles] = useState<string[]>(["sales_rep"])
  const [newTemplateCurrs, setNewTemplateCurrs] = useState<any[]>([
    { role: "sales_rep", curriculum_id: "solar_fundamentals_v1" }
  ])
  const [newTemplateCerts, setNewTemplateCerts] = useState<any[]>([
    { role: "sales_rep", certification_id: "septivolt_certified_rep" }
  ])
  const [newTemplateGhl, setNewTemplateGhl] = useState<any[]>([
    { role: "sales_rep", tag: "role:sales_rep" }
  ])
  const [newTemplateTeams, setNewTemplateTeams] = useState<string[]>([])
  const [newTeamInput, setNewTeamInput] = useState("")
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  const [newTemplateParentId, setNewTemplateParentId] = useState("")
  const [newTemplateVersion, setNewTemplateVersion] = useState(1)

  // Credentials Management States
  const [credCerts, setCredCerts] = useState<any[]>([])
  const [loadingCreds, setLoadingCreds] = useState(false)
  const [credFilter, setCredFilter] = useState("")
  const [credStatusFilter, setCredStatusFilter] = useState("")
  const [revokeTarget, setRevokeTarget] = useState<any>(null)
  const [revokeReason, setRevokeReason] = useState("")
  const [isRevoking, setIsRevoking] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRenewing, setIsRenewing] = useState(false)
  const [credActionMsg, setCredActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Training Intelligence Prediction States
  const [predictions, setPredictions] = useState<any[]>([])
  const [loadingPredictions, setLoadingPredictions] = useState(false)
  const [isRefreshingPredictions, setIsRefreshingPredictions] = useState(false)
  const [predTypeFilter, setPredTypeFilter] = useState("")
  const [predSeverityFilter, setPredSeverityFilter] = useState("")
  const [predActionMsg, setPredActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [predSummary, setPredSummary] = useState<any>(null)

  const isDemo = isDemoModeActive() || !user

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  const fetchExecutiveData = async () => {
    if (isDemo) {
      setExecData({
        total_users: 18,
        active_users: 14,
        pending_invitations: 4,
        courses_assigned: 15,
        courses_completed: 9,
        completion_rate: 60.0,
        certification_rate: 53.3,
        avg_quiz_score: 82.4,
        avg_sim_score: 79.1,
        leaderboard: [
          { username: "sarah_connor", email: "sarah@septivolt.com", total_score: 4800, streak: 7 },
          { username: "ana_gutierrez", email: "ana@septivolt.com", total_score: 4100, streak: 5 },
          { username: "tommy_lee", email: "tommy@septivolt.com", total_score: 3200, streak: 3 },
          { username: "maria_rodriguez", email: "maria@septivolt.com", total_score: 2900, streak: 0 },
          { username: "john_doe", email: "john@septivolt.com", total_score: 1850, streak: 1 }
        ]
      })
      return
    }
    setLoadingExec(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/command-center/executive`, {
        headers: { "X-User-Id": user.username },
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setExecData(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingExec(false)
    }
  }

  const fetchBranchData = async () => {
    if (isDemo) {
      setBranches([
        { branch_id: "b1", branch_name: "Florida Regional Office", users: 8, completion_rate: 78.5, avg_quiz_score: 84.1, avg_sim_score: 81.2, certification_rate: 62.5, training_velocity_days: 4.2, health_score: 83.2, branch_ranking: 1 },
        { branch_id: "b2", branch_name: "Texas Regional Office", users: 6, completion_rate: 64.0, avg_quiz_score: 79.8, avg_sim_score: 76.5, certification_rate: 50.0, training_velocity_days: 5.8, health_score: 74.5, branch_ranking: 2 },
        { branch_id: "b3", branch_name: "Nevada Office", users: 4, completion_rate: 42.0, avg_quiz_score: 71.0, avg_sim_score: 68.4, certification_rate: 25.0, training_velocity_days: 7.5, health_score: 61.2, branch_ranking: 3 }
      ])
      return
    }
    setLoadingBranches(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/command-center/branches`, {
        headers: { "X-User-Id": user.username },
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setBranches(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingBranches(false)
    }
  }

  const fetchTeamData = async () => {
    if (isDemo) {
      setTeams([
        { team_id: "t1", team_name: "West Mavericks", manager: "sarah_connor", users: 5, completion_rate: 85.0, certification_rate: 80.0, avg_sim_score: 84.5, health_score: 86.2 },
        { team_id: "t2", team_name: "East Current", manager: "ana_gutierrez", users: 4, completion_rate: 70.0, certification_rate: 50.0, avg_sim_score: 78.0, health_score: 76.0 },
        { team_id: "t3", team_name: "South Voltage", manager: "tommy_lee", users: 5, completion_rate: 55.0, certification_rate: 40.0, avg_sim_score: 72.4, health_score: 67.8 },
        { team_id: "t4", team_name: "Northeast Orbit", manager: "Unassigned", users: 4, completion_rate: 30.0, certification_rate: 0.0, avg_sim_score: 60.5, health_score: 48.2 }
      ])
      return
    }
    setLoadingTeams(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/command-center/teams`, {
        headers: { "X-User-Id": user.username },
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setTeams(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTeams(false)
    }
  }

  const fetchRepsData = async () => {
    if (isDemo) {
      const mockReps = [
        { username: "sarah_connor", email: "sarah@septivolt.com", role: "sales_rep", team_name: "West Mavericks", progress_percentage: 100, quiz_average: 92, sim_average: 89, certifications_count: 2, last_activity: "2026-06-01T15:30:00Z", risk_score: 0, coaching_score: 0, active_flags_count: 0 },
        { username: "john_doe", email: "john@septivolt.com", role: "sales_rep", team_name: "West Mavericks", progress_percentage: 45, quiz_average: 68, sim_average: 64, certifications_count: 0, last_activity: "2026-05-30T10:15:00Z", risk_score: 70, coaching_score: 50, active_flags_count: 1 },
        { username: "maria_rodriguez", email: "maria@septivolt.com", role: "sales_rep", team_name: "East Current", progress_percentage: 96, quiz_average: 84, sim_average: 82, certifications_count: 0, last_activity: "2026-05-28T09:00:00Z", risk_score: 0, coaching_score: 10, active_flags_count: 1 },
        { username: "derek_burns", email: "derek@septivolt.com", role: "sales_rep", team_name: "South Voltage", progress_percentage: 20, quiz_average: 54, sim_average: 52, certifications_count: 0, last_activity: "2026-05-20T11:45:00Z", risk_score: 100, coaching_score: 100, active_flags_count: 2 },
        { username: "ana_gutierrez", email: "ana@septivolt.com", role: "sales_rep", team_name: "East Current", progress_percentage: 100, quiz_average: 94, sim_average: 91, certifications_count: 3, last_activity: "2026-06-01T16:20:00Z", risk_score: 0, coaching_score: 0, active_flags_count: 0 }
      ]
      
      // Filter logic locally for Demo
      if (rosterFilter === "needs_coaching") {
        setReps(mockReps.filter(r => r.risk_score >= 60 || r.active_flags_count > 0))
      } else if (rosterFilter === "certification_ready") {
        setReps(mockReps.filter(r => r.progress_percentage >= 95 && r.quiz_average >= 80 && r.certifications_count === 0))
      } else if (rosterFilter === "inactive") {
        setReps(mockReps.filter(r => r.risk_score >= 30))
      } else if (rosterFilter === "top_performers") {
        setReps(mockReps.filter(r => r.quiz_average >= 85 && r.sim_average >= 85))
      } else {
        setReps(mockReps)
      }
      return
    }
    setLoadingReps(true)
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/command-center/reps`)
      if (rosterFilter !== "all") {
        url.searchParams.append("filter_type", rosterFilter)
      }
      const res = await fetch(url.toString(), {
        headers: { "X-User-Id": user.username },
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setReps(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingReps(false)
    }
  }

  const fetchAlertsData = async () => {
    if (isDemo) {
      setAlerts([
        { id: "a1", user_id: "john_doe", flag_type: "low_score", severity: "medium", title: "Low Quiz Performance", reason: "Overall quiz average is 68%, which is below the 75% threshold.", recommended_actions: ["Schedule 10m review huddle", "Recommend retaking foundations quiz"], created_at: new Date().toISOString() },
        { id: "a2", user_id: "derek_burns", flag_type: "at_risk", severity: "high", title: "Simulator Obstacle", reason: "Failed scenario 'residential_objections_v1' 3 consecutive times.", recommended_actions: ["Provide direct 1-on-1 objection roleplay", "Verify shadow-shading concept knowledge"], created_at: new Date().toISOString() },
        { id: "a3", user_id: "maria_rodriguez", flag_type: "custom", severity: "low", title: "Certification Eligible", reason: "Passed all required modules with 84% avg. Ready for certification issue.", recommended_actions: ["Review final assessment transcripts", "Issue certified solar badge L1"], created_at: new Date().toISOString() }
      ])
      return
    }
    setLoadingAlerts(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/command-center/coaching`, {
        headers: { "X-User-Id": user.username },
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setAlerts(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAlerts(false)
    }
  }

  const fetchInvitations = async () => {
    if (isDemo) {
      setInvitations([
        { id: "i1", email: "recruit1@solarcorp.com", first_name: "Tommy", last_name: "Lee", role: "sales_rep", status: "pending", expires_at: new Date(Date.now() + 86400000).toISOString() },
        { id: "i2", email: "recruit2@solarcorp.com", first_name: "Sarah", last_name: "Connor", role: "sales_rep", status: "accepted", expires_at: new Date().toISOString() }
      ])
      return
    }
    setLoadingInvites(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/invitations`, {
        headers: { "X-User-Id": user.username },
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setInvitations(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingInvites(false)
    }
  }

  const fetchTemplatesData = async () => {
    if (isDemo) {
      setTemplates([
        {
          id: "temp_solar_rep_onboarding",
          company_id: null,
          template_name: "Solar Rep Onboarding Template",
          description: "Core training stack for new solar reps, covering fundamentals, objection handling, and simulator runs.",
          target_scope: "company",
          is_global_template: true,
          template_version: 1,
          is_active: true,
          roles_count: 1,
          curriculums_count: 3,
          certifications_count: 1,
          teams_count: 0
        },
        {
          id: "temp_manager_enablement",
          company_id: null,
          template_name: "Manager Enablement Template",
          description: "Training stack for trainers and branch managers to master the command center and coaching audit pipeline.",
          target_scope: "company",
          is_global_template: true,
          template_version: 1,
          is_active: true,
          roles_count: 2,
          curriculums_count: 4,
          certifications_count: 0,
          teams_count: 0
        },
        {
          id: "temp_new_era_solar_standard",
          company_id: "new_era_solar",
          template_name: "New Era Solar Standard Template",
          description: "The default blueprint for New Era Solar. Automatically generates offices and sets up rep, manager, and trainer tracks.",
          target_scope: "company",
          is_global_template: false,
          template_version: 1,
          is_active: true,
          roles_count: 3,
          curriculums_count: 6,
          certifications_count: 1,
          teams_count: 2
        }
      ])
      return
    }
    setLoadingTemplates(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/team-templates`, {
        headers: { "X-User-Id": user.username },
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setTemplates(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTemplates(false)
    }
  }

  const handlePreviewTemplate = async (templateId: string) => {
    let targetId = ""
    if (applyTargetType === "company") {
      targetId = user?.companyId || "septivolt"
    } else {
      targetId = applyTargetId
    }

    if (!targetId) {
      alert("Please enter a Target ID (Branch ID or Team ID).")
      return
    }

    if (isDemo) {
      setPreviewData({
        template_id: templateId,
        template_name: "Mock Preview Template",
        template_version: 1,
        target_type: applyTargetType,
        target_id: targetId,
        teams_to_create: applyTargetType === "company" ? ["Miami Office", "Orlando Office"] : [],
        curriculums_to_assign: [
          { username: "john_doe", email: "john@septivolt.com", role: "sales_rep", curriculum_id: "solar_fundamentals_v1", curriculum_name: "Solar Fundamentals RAMPER v1", is_already_assigned: false },
          { username: "maria_rodriguez", email: "maria@septivolt.com", role: "sales_rep", curriculum_id: "solar_fundamentals_v1", curriculum_name: "Solar Fundamentals RAMPER v1", is_already_assigned: true }
        ],
        certifications_to_configure: [
          { role: "sales_rep", certification_id: "septivolt_certified_rep", certification_name: "SeptiVolt Certified Solar Rep" }
        ],
        ghl_tags_to_sync: [
          { username: "john_doe", email: "john@septivolt.com", role: "sales_rep", tags: ["role:sales_rep"] }
        ],
        affected_users_count: 2
      })
      setShowPreviewModal(true)
      return
    }

    setLoadingPreview(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/team-templates/${templateId}/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.username
        },
        body: JSON.stringify({
          target_type: applyTargetType,
          target_id: targetId
        }),
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setPreviewData(data)
        setShowPreviewModal(true)
      } else {
        const errData = await res.json()
        alert(`Preview failed: ${errData.detail || "Unknown error"}`)
      }
    } catch (err) {
      console.error(err)
      alert("Error contacting preview API.")
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleApplyTemplate = async (templateId: string) => {
    let targetId = ""
    if (applyTargetType === "company") {
      targetId = user?.companyId || "septivolt"
    } else {
      targetId = applyTargetId
    }

    if (!targetId) {
      alert("Please enter a Target ID.")
      return
    }

    if (isDemo) {
      alert("Demo Mode: Template successfully applied (simulated).")
      setShowPreviewModal(false)
      return
    }

    setIsApplyingTemplate(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/team-templates/${templateId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.username
        },
        body: JSON.stringify({
          target_type: applyTargetType,
          target_id: targetId
        }),
        credentials: "include"
      })
      if (res.ok) {
        alert("Template applied successfully! Teams, curriculum assignments, and GHL rules are active.")
        setShowPreviewModal(false)
        fetchTemplatesData()
      } else {
        const errData = await res.json()
        alert(`Apply failed: ${errData.detail || "Unknown error"}`)
      }
    } catch (err) {
      console.error(err)
      alert("Error applying template.")
    } finally {
      setIsApplyingTemplate(false)
    }
  }

  const handleSaveTemplate = async (e: any) => {
    e.preventDefault()
    if (!newTemplateName) {
      alert("Template name is required.")
      return
    }

    const payload = {
      template_name: newTemplateName,
      description: newTemplateDesc,
      target_scope: newTemplateScope,
      is_global_template: newTemplateIsGlobal,
      template_version: newTemplateVersion,
      parent_template_id: newTemplateParentId || null,
      role_rules: newTemplateRoles,
      curriculum_rules: newTemplateCurrs,
      certification_rules: newTemplateCerts,
      ghl_rules: newTemplateGhl,
      team_rules: newTemplateTeams
    }

    if (isDemo) {
      alert("Demo Mode: New template created successfully (simulated).")
      setShowCreateModal(false)
      return
    }

    setIsSavingTemplate(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/team-templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.username
        },
        body: JSON.stringify(payload),
        credentials: "include"
      })
      if (res.ok) {
        alert("Template saved successfully.")
        setShowCreateModal(false)
        fetchTemplatesData()
      } else {
        const errData = await res.json()
        alert(`Failed to save: ${errData.detail || "Unknown error"}`)
      }
    } catch (err) {
      console.error(err)
      alert("Error saving template.")
    } finally {
      setIsSavingTemplate(false)
    }
  }


  // Load appropriate data when tab or roster filter updates
  useEffect(() => {
    if (activeTab === "executive") fetchExecutiveData()
    if (activeTab === "branches") fetchBranchData()
    if (activeTab === "teams") fetchTeamData()
    if (activeTab === "roster") fetchRepsData()
    if (activeTab === "alerts") { fetchAlertsData(); fetchPredictions() }
    if (activeTab === "actions") {
      fetchInvitations()
      fetchTeamData()
      fetchBranchData()
    }
    if (activeTab === "templates") {
      fetchTemplatesData()
      fetchBranchData()
      fetchTeamData()
    }
  }, [activeTab, rosterFilter])

  // ─── Training Intelligence Handlers ─────────────────────────────────────────

  const fetchPredictions = async () => {
    if (isDemo) {
      setPredictions([
        { id: "pred_demo1", userId: "john_doe", teamId: "t1", predictionType: "certification_failure_risk", severity: "high", score: 87.5, confidence: 0.88, explanationEn: "Progress 45% with quiz avg 68% and sim avg 64% — trending to fail certification.", recommendedActionEn: "Schedule manager roleplay session. Assign Objection Crusher curriculum. Send daily simulator practice reminder.", status: "active", generatedAt: new Date().toISOString(), ghlSynced: true },
        { id: "pred_demo2", userId: "derek_burns", teamId: "t3", predictionType: "churn_risk", severity: "high", score: 94.0, confidence: 0.92, explanationEn: "Rep has been inactive for 12 days with only 20% training progress. High risk of full disengagement.", recommendedActionEn: "Send immediate login nudge email. Assign manager 1:1 check-in. Notify trainer.", status: "active", generatedAt: new Date().toISOString(), ghlSynced: false },
        { id: "pred_demo3", userId: "sarah_connor", teamId: "t1", predictionType: "promotion_ready", severity: "low", score: 92.1, confidence: 0.90, explanationEn: "Rep has 100% training completion, quiz avg 92%, sim avg 89%, active certification, and zero high-severity flags.", recommendedActionEn: "Recommend advanced certification or leadership track. Notify Dealer Admin.", status: "active", generatedAt: new Date().toISOString(), ghlSynced: false },
        { id: "pred_demo4", userId: "maria_rodriguez", teamId: "t2", predictionType: "rapid_improvement", severity: "low", score: 76.0, confidence: 0.75, explanationEn: "Simulator score improving ~11 points/session over 3 sessions. Recent scores: [68, 79, 91].", recommendedActionEn: "Recognize rep for rapid improvement. Encourage certification attempt if eligible.", status: "active", generatedAt: new Date().toISOString(), ghlSynced: false },
      ])
      setPredSummary({ atRiskRepCount: 1, churnRiskRepCount: 1, interventionQueueCount: 0, promotionReadyCount: 1 })
      return
    }
    setLoadingPredictions(true)
    try {
      const [predsRes, summaryRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/training-intelligence/predictions`, {
          headers: { "X-User-Id": user?.username || "" },
          credentials: "include"
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/training-intelligence/summary`, {
          headers: { "X-User-Id": user?.username || "" },
          credentials: "include"
        })
      ])
      if (predsRes.ok) {
        const data = await predsRes.json()
        setPredictions(data.predictions || [])
      }
      if (summaryRes.ok) {
        const data = await summaryRes.json()
        setPredSummary(data)
      }
    } catch (err) {
      console.error("[Predictions] fetch error:", err)
    } finally {
      setLoadingPredictions(false)
    }
  }

  const handleRefreshPredictions = async () => {
    if (isDemo) { alert("Demo Mode: Predictions refreshed."); return }
    setIsRefreshingPredictions(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/training-intelligence/refresh`, {
        method: "POST",
        headers: { "X-User-Id": user?.username || "" },
        credentials: "include"
      })
      if (res.ok) {
        setPredActionMsg({ type: "success", text: "Predictions refreshed successfully." })
        await fetchPredictions()
      }
    } catch { setPredActionMsg({ type: "error", text: "Refresh failed." }) }
    finally { setIsRefreshingPredictions(false); setTimeout(() => setPredActionMsg(null), 3500) }
  }

  const handleDismissPrediction = async (predId: string) => {
    if (isDemo) { setPredictions(prev => prev.filter(p => p.id !== predId)); return }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/training-intelligence/${predId}/dismiss`, {
        method: "POST", headers: { "X-User-Id": user?.username || "", "Content-Type": "application/json" },
        credentials: "include", body: "{}"
      })
      if (res.ok) { setPredictions(prev => prev.filter(p => p.id !== predId)); setPredActionMsg({ type: "success", text: "Prediction dismissed." }) }
      else setPredActionMsg({ type: "error", text: "Failed to dismiss." })
    } catch { setPredActionMsg({ type: "error", text: "Request failed." }) }
    finally { setTimeout(() => setPredActionMsg(null), 3000) }
  }

  const handleResolvePrediction = async (predId: string) => {
    if (isDemo) { setPredictions(prev => prev.filter(p => p.id !== predId)); return }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/training-intelligence/${predId}/resolve`, {
        method: "POST", headers: { "X-User-Id": user?.username || "", "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ notes: "Resolved by manager." })
      })
      if (res.ok) { setPredictions(prev => prev.filter(p => p.id !== predId)); setPredActionMsg({ type: "success", text: "Prediction resolved." }) }
      else setPredActionMsg({ type: "error", text: "Failed to resolve." })
    } catch { setPredActionMsg({ type: "error", text: "Request failed." }) }
    finally { setTimeout(() => setPredActionMsg(null), 3000) }
  }

  const handleSyncGHL = async (predId: string) => {
    if (isDemo) { setPredActionMsg({ type: "success", text: "Demo: GHL sync simulated." }); setTimeout(() => setPredActionMsg(null), 3000); return }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/training-intelligence/${predId}/sync-ghl`, {
        method: "POST", headers: { "X-User-Id": user?.username || "" }, credentials: "include"
      })
      if (res.ok) { setPredActionMsg({ type: "success", text: "Synced to GHL." }); await fetchPredictions() }
      else setPredActionMsg({ type: "error", text: "GHL sync failed." })
    } catch { setPredActionMsg({ type: "error", text: "Request failed." }) }
    finally { setTimeout(() => setPredActionMsg(null), 3000) }
  }

  // ─── Actions Center Handlers ────────────────────────────────────────────────

  const handleSingleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemo) {
      alert("Demo Mode: Mock Invitation Generated")
      setInvitations(prev => [{
        id: `mock_${Date.now()}`,
        email: inviteEmail,
        first_name: inviteFirstName,
        last_name: inviteLastName,
        role: inviteRole,
        status: "pending",
        expires_at: new Date(Date.now() + 86400000).toISOString()
      }, ...prev])
      setInviteEmail("")
      setInviteFirstName("")
      setInviteLastName("")
      return
    }
    setIsSendingInvite(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.username
        },
        body: JSON.stringify({
          email: inviteEmail,
          first_name: inviteFirstName,
          last_name: inviteLastName,
          role: inviteRole,
          branch_id: inviteBranchId || null,
          team_id: inviteTeamId || null
        }),
        credentials: "include"
      })
      if (res.ok) {
        alert(t("Invitation email sent successfully!", "¡Correo de invitación enviado con éxito!"))
        setInviteEmail("")
        setInviteFirstName("")
        setInviteLastName("")
        fetchInvitations()
      } else {
        const err = await res.json()
        alert(err.detail || "Failed to invite.")
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSendingInvite(false)
    }
  }

  const handleRemindNudge = async (username: string) => {
    if (isDemo) {
      alert(`Demo Mode: Nudge sent to ${username}`)
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/command-center/actions/remind`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.username
        },
        body: JSON.stringify({ username }),
        credentials: "include"
      })
      if (res.ok) {
        alert(t("Reminder nudge sent successfully!", "¡Recordatorio enviado con éxito!"))
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemo) {
      alert("Demo Mode: Mock Assignment Applied.")
      return
    }
    setIsAssigning(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/command-center/actions/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.username
        },
        body: JSON.stringify({
          target_type: assignType,
          target_id: assignId,
          curriculum_id: assignCurriculum || null,
          certification_id: assignCert || null
        }),
        credentials: "include"
      })
      if (res.ok) {
        alert(t("Assignment processed successfully!", "¡Asignación completada con éxito!"))
        setAssignId("")
        setAssignCert("")
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleBulkCSVUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!csvContent.trim()) return
    if (isDemo) {
      alert("Demo Mode: Mock CSV processed successfully")
      setBulkStatus({ success_count: 4, failure_count: 0 })
      setCsvContent("")
      return
    }
    setIsUploadingBulk(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/invitations/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user.username
        },
        body: JSON.stringify({
          csv_content: csvContent,
          branch_id: inviteBranchId || null
        }),
        credentials: "include"
      })
      if (res.ok) {
        const data = await res.json()
        setBulkStatus(data)
        alert(t("Bulk CSV upload processed!", "¡CSV procesado con éxito!"))
        setCsvContent("")
        fetchInvitations()
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsUploadingBulk(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedRep) return
    if (isDemo) {
      alert("Notes saved successfully (Demo Mode)")
      setSelectedRep({ ...selectedRep, coaching_notes: notesText })
      return
    }
    setSavingNotes(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/user/${encodeURIComponent(selectedRep.username)}/coaching-note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": user.username
          },
          body: JSON.stringify({ notes: notesText }),
          credentials: "include"
        }
      )
      if (res.ok) {
        setSelectedRep({ ...selectedRep, coaching_notes: notesText })
        alert(t("Coaching notes saved!", "¡Notas de coaching guardadas con éxito!"))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingNotes(false)
    }
  }

  // ─── Export Report File Download ───────────────────────────────────────────

  const handleExportCSV = async (type: string) => {
    if (isDemo) {
      alert("Demo Mode: CSV Export started")
      return
    }
    try {
      window.open(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/command-center/reports/export?report_type=${type}`, "_blank")
    } catch (err) {
      console.error(err)
    }
  }

  const triggerPrint = () => {
    window.print()
  }

  return (
    <AppShell 
      heading={t("Enterprise Manager Command Center", "Centro de Control de Gestión")} 
      subheading={t("Real-time operational view of training progress, certifications, simulator performance, and team readiness.", "Vista operativa en tiempo real del progreso, certificaciones y rendimiento.")}
    >
      
      {/* ── Tabs Navigation ── */}
      <div className="flex border-b border-white/5 mb-8 overflow-x-auto gap-2 no-print">
        {[
          { id: "executive", label: t("Executive", "Ejecutivo"), icon: BarChart3 },
          { id: "branches", label: t("Branches", "Sucursales"), icon: TrendingUp },
          { id: "teams", label: t("Teams", "Equipos"), icon: Users },
          { id: "roster", label: t("Rep Roster", "Roster de Representantes"), icon: Award },
          { id: "alerts", label: t("AI Alerts", "Alertas de IA"), icon: AlertTriangle },
          { id: "actions", label: t("Action Center", "Acciones"), icon: Zap },
          { id: "templates", label: t("Templates", "Plantillas"), icon: FileText },
          { id: "credentials", label: t("Credentials", "Credenciales"), icon: ShieldCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any)
              setSelectedRep(null)
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-4 border-b-2 font-medium text-sm transition-all outline-none shrink-0",
              activeTab === tab.id 
                ? "border-[#F97316] text-[#F97316] bg-[#F97316]/5" 
                : "border-transparent text-slate-400 hover:text-white hover:border-white/10"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Print Header (Only visible in Print) ── */}
      <div className="hidden print-block mb-6">
        <h1 className="text-2xl font-black uppercase text-black">SeptiVolt Manager Report</h1>
        <p className="text-sm text-gray-600">Company ID: {user?.companyId || "septivolt"} | Date: {new Date().toLocaleDateString()}</p>
        <hr className="my-4 border-gray-400" />
      </div>

      {/* ── Quick Print Trigger (No-print) ── */}
      <div className="flex justify-end mb-4 gap-2 no-print">
        <button 
          onClick={triggerPrint}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          {t("Print / Save PDF", "Imprimir / Guardar PDF")}
        </button>
      </div>

      {/* ─── TAB 1: EXECUTIVE DASHBOARD ──────────────────────────────────────── */}
      {activeTab === "executive" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {loadingExec && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>}
          
          {execData && (
            <>
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t("Total Users", "Usuarios Totales"), val: execData.total_users, desc: t("Active roster counts", "Roster activo"), icon: Users },
                  { label: t("Active Users", "Usuarios Activos"), val: execData.active_users, desc: t("Active last 30 days", "Últimos 30 días"), icon: Zap, highlight: true },
                  { label: t("Completion Rate", "Tasa de Finalización"), val: `${execData.completion_rate}%`, desc: t("Curriculum assigned vs done", "Asignados vs finalizados"), icon: CheckCircle },
                  { label: t("Certification Rate", "Tasa de Certificación"), val: `${execData.certification_rate}%`, desc: t("Certified representatives", "Reps certificados"), icon: Award }
                ].map((kpi, idx) => (
                  <div key={idx} className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all">
                    <div className="absolute top-4 right-4 text-slate-600">
                      <kpi.icon className={cn("w-5 h-5", kpi.highlight && "text-[#F97316]")} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{kpi.label}</p>
                    <h2 className="text-3xl font-black mt-2 tracking-tight">{kpi.val}</h2>
                    <p className="text-[10px] text-slate-500 mt-1">{kpi.desc}</p>
                  </div>
                ))}
              </div>

              {/* Progress Detail Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Score Summary */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl text-[#F97316]">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{t("Performance Averages", "Promedios de Rendimiento")}</h3>
                      <p className="text-xs text-slate-400">{t("Computed across all completed progress items", "Calculado sobre progresos completados")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t("Average Quiz", "Exámenes Promedio")}</p>
                      <h3 className="text-2xl font-black mt-1 text-slate-200">{execData.avg_quiz_score}%</h3>
                    </div>
                    <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t("Average Simulation", "Simuladores Promedio")}</p>
                      <h3 className="text-2xl font-black mt-1 text-[#F97316]">{execData.avg_sim_score}%</h3>
                    </div>
                  </div>
                </div>

                {/* Company Leaderboard Summary */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{t("Top Performers", "Reps Destacados")}</h3>
                    <Link href="/leaderboards" className="text-xs text-[#F97316] hover:underline flex items-center gap-1 font-semibold">
                      {t("View Rankings", "Ver Clasificaciones")} <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                  
                  <div className="space-y-3">
                    {execData.leaderboard.map((rep: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-500 w-4">#{idx+1}</span>
                          <div>
                            <p className="text-sm font-bold text-slate-200">{rep.username}</p>
                            <p className="text-[10px] text-slate-500">{rep.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-[#F59E0B]">{rep.total_score} XP</span>
                          <p className="text-[10px] text-slate-500">{rep.streak} {t("day streak", "días de racha")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {/* ─── TAB 2: BRANCH PERFORMANCE ───────────────────────────────────────── */}
      {activeTab === "branches" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center no-print">
            <h3 className="font-bold text-lg">{t("Branch Leaderboard Rankings", "Clasificación de Sucursales")}</h3>
            <button 
              onClick={() => handleExportCSV("branches")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#F97316] hover:bg-[#F97316]/95 text-slate-900 rounded-xl transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              {t("Export CSV Report", "Exportar Informe CSV")}
            </button>
          </div>

          {loadingBranches && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>}

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs text-slate-400 uppercase font-hud">
                  <th className="p-4">{t("Rank", "Rango")}</th>
                  <th className="p-4">{t("Branch Office", "Sucursal")}</th>
                  <th className="p-4 text-center">{t("Reps Count", "Representantes")}</th>
                  <th className="p-4 text-center">{t("Completion Rate", "Finalización")}</th>
                  <th className="p-4 text-center">{t("Avg Quiz", "Avg Examen")}</th>
                  <th className="p-4 text-center">{t("Avg Sim", "Avg Simulador")}</th>
                  <th className="p-4 text-center">{t("Certified %", "Certificados %")}</th>
                  <th className="p-4 text-center">{t("Velocity (Days)", "Velocidad (Días)")}</th>
                  <th className="p-4 text-center">{t("Health Score", "Puntuación de Salud")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {branches.map((branch, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-black text-[#F97316]">#{branch.branch_ranking}</td>
                    <td className="p-4 font-bold text-slate-200">{branch.branch_name}</td>
                    <td className="p-4 text-center">{branch.users}</td>
                    <td className="p-4 text-center">
                      <span className="font-semibold text-slate-300">{branch.completion_rate}%</span>
                    </td>
                    <td className="p-4 text-center">{branch.avg_quiz_score}%</td>
                    <td className="p-4 text-center text-[#F59E0B] font-bold">{branch.avg_sim_score}%</td>
                    <td className="p-4 text-center">{branch.certification_rate}%</td>
                    <td className="p-4 text-center text-slate-400">{branch.training_velocity_days}d</td>
                    <td className="p-4 text-center font-black text-emerald-400">{branch.health_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: TEAM PERFORMANCE ─────────────────────────────────────────── */}
      {activeTab === "teams" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center no-print">
            <h3 className="font-bold text-lg">{t("Team Operational Health Rankings", "Clasificación de Salud de Equipos")}</h3>
            <button 
              onClick={() => handleExportCSV("teams")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#F97316] hover:bg-[#F97316]/95 text-slate-900 rounded-xl transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              {t("Export CSV Report", "Exportar Informe CSV")}
            </button>
          </div>

          {loadingTeams && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>}

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs text-slate-400 uppercase font-hud">
                  <th className="p-4">{t("Rank", "Rango")}</th>
                  <th className="p-4">{t("Team Name", "Nombre del Equipo")}</th>
                  <th className="p-4">{t("Manager", "Gerente")}</th>
                  <th className="p-4 text-center">{t("Reps Count", "Reps")}</th>
                  <th className="p-4 text-center">{t("Completion Rate", "Finalización")}</th>
                  <th className="p-4 text-center">{t("Avg Sim Score", "Avg Simulador")}</th>
                  <th className="p-4 text-center">{t("Certified Rate", "Certificados")}</th>
                  <th className="p-4 text-center">{t("Health Score", "Puntuación de Salud")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {teams.map((team, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-black text-slate-500">#{idx + 1}</td>
                    <td className="p-4 font-bold text-slate-200">{team.team_name}</td>
                    <td className="p-4 text-slate-400">@{team.manager}</td>
                    <td className="p-4 text-center">{team.users}</td>
                    <td className="p-4 text-center">{team.completion_rate}%</td>
                    <td className="p-4 text-center text-[#F59E0B] font-bold">{team.avg_sim_score}%</td>
                    <td className="p-4 text-center">{team.certification_rate}%</td>
                    <td className="p-4 text-center font-black text-emerald-400">{team.health_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 4: REP ROSTER PERFORMANCE ───────────────────────────────────── */}
      {activeTab === "roster" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: t("All Reps", "Todos") },
                { id: "needs_coaching", label: t("Needs Coaching", "Requiere Coaching") },
                { id: "certification_ready", label: t("Cert Ready", "Listo para Certificación") },
                { id: "inactive", label: t("Inactive 7+ Days", "Inactivo 7+ días") },
                { id: "top_performers", label: t("Top Performers", "Mejores") }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setRosterFilter(f.id as any)
                    setSelectedRep(null)
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all outline-none",
                    rosterFilter === f.id
                      ? "bg-[#F97316] border-[#F97316] text-slate-900"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handleExportCSV("roster")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#F97316] hover:bg-[#F97316]/95 text-slate-900 rounded-xl transition-all self-end md:self-auto"
            >
              <FileText className="w-3.5 h-3.5" />
              {t("Export Roster Report", "Exportar Roster")}
            </button>
          </div>

          {loadingReps && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Table Area */}
            <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs text-slate-400 uppercase font-hud">
                    <th className="p-4">{t("Rep Name", "Representante")}</th>
                    <th className="p-4">{t("Team", "Equipo")}</th>
                    <th className="p-4 text-center">{t("Progress", "Progreso")}</th>
                    <th className="p-4 text-center">{t("Quiz Avg", "Quiz Avg")}</th>
                    <th className="p-4 text-center">{t("Sim Avg", "Sim Avg")}</th>
                    <th className="p-4 text-center">{t("Certifications", "Certs")}</th>
                    <th className="p-4 text-center">{t("Risk Score", "Riesgo")}</th>
                    <th className="p-4 text-center no-print">{t("Action", "Acción")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {reps.map((rep, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => {
                        setSelectedRep(rep)
                        setNotesText(rep.coaching_notes || "")
                      }}
                      className={cn(
                        "hover:bg-white/5 cursor-pointer transition-colors",
                        selectedRep?.username === rep.username && "bg-white/10"
                      )}
                    >
                      <td className="p-4">
                        <div className="font-bold text-slate-200">@{rep.username}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Last: {new Date(rep.last_activity).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">{rep.team_name}</td>
                      <td className="p-4">
                        <div className="w-16 mx-auto">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>{rep.progress_percentage}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#F59E0B]" style={{ width: `${rep.progress_percentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">{rep.quiz_average}%</td>
                      <td className="p-4 text-center text-[#F97316] font-bold">{rep.sim_average}%</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-hud font-bold px-2 py-0.5 rounded-md">
                          {rep.certifications_count}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs",
                          rep.risk_score >= 60 ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          rep.risk_score >= 30 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        )}>
                          {rep.risk_score}
                        </span>
                      </td>
                      <td className="p-4 text-center no-print">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemindNudge(rep.username)
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-[#F97316]/10 text-slate-400 hover:text-[#F97316] border border-white/10 transition-all"
                          title={t("Send Nudge Reminder", "Enviar Recordatorio")}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rep Detail / Notes Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl min-h-[400px]">
              {selectedRep ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-slate-100">@{selectedRep.username}</h3>
                      <p className="text-xs text-slate-500 font-mono">Scope: {selectedRep.team_name || "Unassociated"}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold font-hud",
                      selectedRep.risk_score >= 60 ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    )}>
                      {selectedRep.risk_score >= 60 ? t("Risk: High", "Riesgo: Alto") : t("Status: Healthy", "Estado: Saludable")}
                    </span>
                  </div>

                  <hr className="border-white/5" />

                  {/* Flag Indicators */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Active flags", "Banderas de Atención")}</p>
                    {selectedRep.active_flags_count > 0 ? (
                      <div className="p-4 bg-amber-500/5 border border-amber-500/20 text-amber-400 rounded-2xl flex items-start gap-2.5 text-xs leading-relaxed">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="font-bold">{t("Performance drop detected", "Caída de rendimiento")}</p>
                          <p className="text-[#94A3B8] mt-1">{t("Rep has failed Objections and quiz metrics are below compliance.", "El representante ha fallado la pila de objeciones y está por debajo del promedio.")}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-2 text-xs">
                        <CheckCircle className="w-4 h-4" />
                        <span>{t("No active alerts for this trainee.", "No hay alertas activas para este rep.")}</span>
                      </div>
                    )}
                  </div>

                  {/* Manager Notes Notepad */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Private Coaching Notes", "Notas Privadas de Coaching")}</label>
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder={t("Write coaching milestones, weaknesses observed during simulated roleplay, and focus targets here. Not visible to the sales rep.", "Escriba observaciones, metas y debilidades. Privado.")}
                      className="w-full min-h-[120px] bg-[#121212] border border-white/10 focus:border-[#F97316]/50 rounded-2xl p-4 text-xs text-slate-200 outline-none resize-none transition-all leading-relaxed"
                    />
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="w-full py-3 bg-[#F97316] hover:bg-[#F97316]/95 disabled:opacity-50 text-slate-900 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      {savingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      {t("Save Notes", "Guardar Notas")}
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-8 space-y-3">
                  <Users className="w-12 h-12 text-slate-700" />
                  <p className="text-sm font-bold">{t("No representative selected", "Ningún representante seleccionado")}</p>
                  <p className="text-xs max-w-xs">{t("Click on any row in the roster table to view detail telemetry flags and save private manager notes.", "Haga clic en una fila del roster para ver detalles y guardar notas.")}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ─── TAB 5: AI COACHING ALERTS + PREDICTIONS PANEL ───────────────────── */}
      {activeTab === "alerts" && (
        <div className="space-y-8 animate-in fade-in duration-300">

          {/* ═══ PREDICTIONS PANEL ═══════════════════════════════════════════ */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 no-print">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
                  {t("Training Intelligence Predictions", "Predicciones de Inteligencia de Entrenamiento")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{t("Proactive forecasts — act before problems become failures.", "Pronósticos proactivos — actúa antes de que los problemas se conviertan en fallas.")}</p>
              </div>
              <button
                onClick={handleRefreshPredictions}
                disabled={isRefreshingPredictions}
                className="flex items-center gap-1.5 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 px-4 py-2 border border-[#8B5CF6]/30 rounded-xl text-xs font-bold text-[#8B5CF6] transition-all disabled:opacity-50"
              >
                {isRefreshingPredictions ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {t("Refresh Intelligence", "Actualizar Inteligencia")}
              </button>
            </div>

            {/* Prediction Action Message */}
            {predActionMsg && (
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm font-semibold border",
                predActionMsg.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
              )}>
                {predActionMsg.text}
              </div>
            )}

            {/* KPI Summary Bar */}
            {predSummary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-black text-red-400">{predSummary.atRiskRepCount ?? 0}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{t("Cert Risk", "Riesgo Cert")}</div>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-black text-amber-400">{predSummary.churnRiskRepCount ?? 0}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{t("Churn Risk", "Riesgo de Fuga")}</div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-black text-blue-400">{predSummary.interventionQueueCount ?? 0}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{t("Intervention", "Intervención")}</div>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-black text-emerald-400">{predSummary.promotionReadyCount ?? 0}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{t("Promotion Ready", "Listo para Promover")}</div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 no-print">
              {[
                { value: "", label: t("All Types", "Todos los Tipos") },
                { value: "certification_failure_risk", label: t("Cert Risk", "Riesgo Cert") },
                { value: "churn_risk", label: t("Churn Risk", "Fuga") },
                { value: "manager_intervention_needed", label: t("Intervention", "Intervención") },
                { value: "rapid_improvement", label: t("Improving", "Mejorando") },
                { value: "promotion_ready", label: t("Promotion Ready", "Listo") },
              ].map(f => (
                <button key={f.value} onClick={() => setPredTypeFilter(f.value)}
                  className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                    predTypeFilter === f.value
                      ? "bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#8B5CF6]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20")}>
                  {f.label}
                </button>
              ))}
              <select value={predSeverityFilter} onChange={e => setPredSeverityFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
                <option value="">{t("All Severities", "Todos")}</option>
                <option value="high">{t("High", "Alta")}</option>
                <option value="medium">{t("Medium", "Media")}</option>
                <option value="low">{t("Low", "Baja")}</option>
              </select>
            </div>

            {/* Prediction Cards */}
            {loadingPredictions && <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" /></div>}

            {!loadingPredictions && (() => {
              const filtered = predictions.filter(p =>
                (predTypeFilter === "" || p.predictionType === predTypeFilter) &&
                (predSeverityFilter === "" || p.severity === predSeverityFilter)
              )
              if (filtered.length === 0) return (
                <div className="text-center py-10 bg-white/5 border border-white/10 rounded-3xl text-slate-500 space-y-2">
                  <TrendingUp className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="font-bold text-sm">{t("No active predictions", "Sin predicciones activas")}</p>
                  <p className="text-xs">{t("Click Refresh Intelligence to run a scan.", "Haz clic en Actualizar Inteligencia para escanear.")}</p>
                </div>
              )
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((pred) => {
                    const typeConfig: Record<string, { icon: string; color: string; bg: string; border: string }> = {
                      certification_failure_risk: { icon: "🎓", color: "text-red-400",     bg: "bg-red-500/5",     border: "border-red-500/20" },
                      churn_risk:                { icon: "⚠️", color: "text-amber-400",   bg: "bg-amber-500/5",   border: "border-amber-500/20" },
                      manager_intervention_needed:{ icon: "🔔", color: "text-blue-400",    bg: "bg-blue-500/5",    border: "border-blue-500/20" },
                      rapid_improvement:         { icon: "📈", color: "text-emerald-400", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
                      promotion_ready:           { icon: "🏆", color: "text-yellow-400",  bg: "bg-yellow-500/5",  border: "border-yellow-500/20" },
                      top_performer_forecast:    { icon: "⭐", color: "text-purple-400",  bg: "bg-purple-500/5",  border: "border-purple-500/20" },
                    }
                    const cfg = typeConfig[pred.predictionType] || { icon: "🔹", color: "text-slate-400", bg: "bg-white/5", border: "border-white/10" }
                    const typeLabel = pred.predictionType.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
                    const confidencePct = Math.round((pred.confidence || 0) * 100)

                    return (
                      <div key={pred.id} className={cn("border rounded-3xl p-5 flex flex-col gap-4 hover:shadow-lg transition-all", cfg.bg, cfg.border)}>
                        {/* Header */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{cfg.icon}</span>
                            <div>
                              <p className={cn("text-xs font-bold uppercase tracking-wider", cfg.color)}>{typeLabel}</p>
                              <p className="font-bold text-slate-200 text-sm">@{pred.userId}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                            pred.severity === "high"   ? "bg-red-500/10 border-red-500/30 text-red-400" :
                            pred.severity === "medium" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                            "bg-slate-500/10 border-slate-500/30 text-slate-400"
                          )}>{pred.severity}</span>
                        </div>

                        {/* Confidence Meter */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>{t("Confidence", "Confianza")}</span>
                            <span className="font-bold text-slate-300">{confidencePct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all", cfg.color.replace("text-", "bg-"))}
                              style={{ width: `${confidencePct}%` }} />
                          </div>
                        </div>

                        {/* Explanation */}
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {isSpanish ? (pred.explanationEs || pred.explanationEn) : pred.explanationEn}
                        </p>

                        {/* Recommended Action */}
                        <div className="bg-white/5 rounded-2xl p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-1.5">{t("Recommended Action", "Acción Recomendada")}</p>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {isSpanish ? (pred.recommendedActionEs || pred.recommendedActionEn) : pred.recommendedActionEn}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 no-print pt-1">
                          <button onClick={() => handleRemindNudge(pred.userId)}
                            className="flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-[#F97316]/10 text-slate-400 hover:text-[#F97316] border border-white/10 rounded-xl text-xs font-bold transition-all">
                            <Send className="w-3 h-3" /> {t("Nudge", "Recordatorio")}
                          </button>
                          {!pred.ghlSynced && (
                            <button onClick={() => handleSyncGHL(pred.id)}
                              className="flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-[#8B5CF6]/10 text-slate-400 hover:text-[#8B5CF6] border border-white/10 rounded-xl text-xs font-bold transition-all">
                              <Zap className="w-3 h-3" /> {t("Push GHL", "Sync GHL")}
                            </button>
                          )}
                          {pred.ghlSynced && (
                            <span className="flex items-center gap-1 px-3 py-2 text-emerald-500 text-xs font-bold">
                              <CheckCircle className="w-3 h-3" /> {t("GHL Synced", "Sync GHL ✓")}
                            </span>
                          )}
                          <button onClick={() => handleDismissPrediction(pred.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-slate-300 border border-white/10 rounded-xl text-xs font-bold transition-all">
                            {t("Dismiss", "Descartar")}
                          </button>
                          <button onClick={() => handleResolvePrediction(pred.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold transition-all">
                            <CheckCircle className="w-3 h-3" /> {t("Resolve", "Resolver")}
                          </button>
                        </div>

                        {/* Metadata */}
                        <p className="text-[10px] text-slate-600">{t("Generated", "Generado")} {new Date(pred.generatedAt).toLocaleDateString()}</p>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          {/* ═══ DIVIDER ═══════════════════════════════════════════════════════ */}
          <div className="border-t border-white/5 pt-6">
            <div className="flex justify-between items-center no-print">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                {t("AI-Generated Coaching Flags", "Banderas de Atención de IA")}
              </h3>
              <button
                onClick={fetchAlertsData}
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-4 py-2 border border-white/10 rounded-xl text-xs font-bold transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                {t("Refresh Scans", "Escanear de Nuevo")}
              </button>
            </div>

            {loadingAlerts && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>}

            {alerts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {alerts.map((alert, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between shadow-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-hud border",
                          alert.severity === "high" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                          alert.severity === "medium" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                          "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        )}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-500">{new Date(alert.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-200">@{alert.user_id} - {alert.title}</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{alert.reason}</p>
                    </div>
                    {alert.recommended_actions.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] font-hud mb-2">{t("Intervention recommendations", "Intervenciones recomendadas")}</p>
                        <ul className="space-y-1 text-xs text-[#CBD5E1]">
                          {alert.recommended_actions.map((act: string, i: number) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-[#F97316] font-bold">•</span>
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="pt-4 flex gap-2 no-print">
                      <button onClick={() => handleRemindNudge(alert.user_id)}
                        className="flex-1 py-2.5 bg-white/5 hover:bg-[#F97316]/10 text-slate-300 hover:text-[#F97316] border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                        <Send className="w-3.5 h-3.5" />
                        {t("Send Nudge Reminder", "Enviar Recordatorio")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white/5 border border-white/10 rounded-3xl text-slate-500 space-y-3 mt-4">
                <Users className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="font-bold text-sm">{t("Roster is Healthy", "Todo Saludable")}</p>
                <p className="text-xs max-w-xs mx-auto">{t("Coaching scanner checks returned no performance drops or idle reps requiring alerts.", "El escaneo no detectó reps en inactividad o con bajo rendimiento.")}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 6: MANAGER ACTION CENTER ────────────────────────────────────── */}
      {activeTab === "actions" && (
        <div className="space-y-8 animate-in fade-in duration-300 no-print">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Assign Curriculum Form */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl text-[#F97316]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t("Assign Curriculum & Certifications", "Asignar Currículo y Certificaciones")}</h3>
                  <p className="text-xs text-slate-400">{t("Bulk push courses or issue certifications.", "Asignar cursos o emitir insignias.")}</p>
                </div>
              </div>

              <form onSubmit={handleAssignSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Target Scope", "Objetivo")}</label>
                    <select
                      value={assignType}
                      onChange={(e) => {
                        setAssignType(e.target.value)
                        setAssignId("")
                      }}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    >
                      <option value="user">{t("Single User", "Usuario Único")}</option>
                      <option value="team">{t("Team", "Equipo")}</option>
                      <option value="branch">{t("Branch", "Sucursal")}</option>
                      <option value="company">{t("Company-wide", "Toda la Empresa")}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Target ID", "ID Objetivo")}</label>
                    {assignType === "user" ? (
                      <input
                        required
                        type="text"
                        value={assignId}
                        onChange={(e) => setAssignId(e.target.value)}
                        placeholder="john_doe"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                      />
                    ) : assignType === "team" ? (
                      <select
                        required
                        value={assignId}
                        onChange={(e) => setAssignId(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                      >
                        <option value="">{t("Select Team", "Seleccionar Equipo")}</option>
                        {teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
                      </select>
                    ) : assignType === "branch" ? (
                      <select
                        required
                        value={assignId}
                        onChange={(e) => setAssignId(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                      >
                        <option value="">{t("Select Branch", "Seleccionar Sucursal")}</option>
                        {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>)}
                      </select>
                    ) : (
                      <input
                        disabled
                        type="text"
                        value="All Company Users"
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-500 outline-none opacity-50"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Assign Curriculum Course", "Asignar Curso de Currículo")}</label>
                  <select
                    value={assignCurriculum}
                    onChange={(e) => {
                      setAssignCurriculum(e.target.value)
                      if (e.target.value) setAssignCert("")
                    }}
                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                  >
                    <option value="">{t("None", "Ninguno")}</option>
                    <option value="solar_fundamentals_v1">Solar Fundamentals RAMPER v1</option>
                    <option value="solar_advanced_v2">Advanced Solar closer Master v2</option>
                  </select>
                </div>

                {assignType === "user" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("OR Direct Issue Certification", "O Emitir Certificación Directa")}</label>
                    <select
                      value={assignCert}
                      onChange={(e) => {
                        setAssignCert(e.target.value)
                        if (e.target.value) setAssignCurriculum("")
                      }}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    >
                      <option value="">{t("Select Certification Badge", "Seleccionar Insignia")}</option>
                      <option value="septivolt-certified-solar-rep">SeptiVolt Certified Solar Rep</option>
                      <option value="discovery-master">Discovery Master Badge</option>
                      <option value="objection-crusher">Objection Crusher Badge</option>
                      <option value="closing-specialist">Closing Specialist Badge</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAssigning}
                  className="w-full py-3 bg-[#F97316] hover:bg-[#F97316]/95 text-slate-900 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-1.5 mt-4"
                >
                  {isAssigning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                  {t("Execute Assignment", "Ejecutar Asignación")}
                </button>
              </form>
            </div>

            {/* Single Invitation Form */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl text-[#F97316]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t("Send Invitation & Magic Link", "Enviar Invitación y Enlace Mágico")}</h3>
                  <p className="text-xs text-slate-400">{t("Invite new hires into the company sandbox.", "Invitar nuevos reps.")}</p>
                </div>
              </div>

              <form onSubmit={handleSingleInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Email Address", "Dirección de Correo")}</label>
                  <input
                    required
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="rep@solarcorp.com"
                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("First Name", "Nombre")}</label>
                    <input
                      required
                      type="text"
                      value={inviteFirstName}
                      onChange={(e) => setInviteFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Last Name", "Apellido")}</label>
                    <input
                      required
                      type="text"
                      value={inviteLastName}
                      onChange={(e) => setInviteLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Role", "Rol")}</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    >
                      <option value="sales_rep">{t("Sales Rep", "Sales Rep")}</option>
                      <option value="trainer">{t("Trainer", "Trainer")}</option>
                      <option value="branch_manager">{t("Branch Manager", "Branch Mgr")}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Branch", "Sucursal")}</label>
                    <select
                      value={inviteBranchId}
                      onChange={(e) => setInviteBranchId(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    >
                      <option value="">{t("None", "Ninguna")}</option>
                      {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Team", "Equipo")}</label>
                    <select
                      value={inviteTeamId}
                      onChange={(e) => setInviteTeamId(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                    >
                      <option value="">{t("None", "Ninguno")}</option>
                      {teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingInvite}
                  className="w-full py-3 bg-[#F97316] hover:bg-[#F97316]/95 text-slate-900 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-1.5 mt-4"
                >
                  {isSendingInvite ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {t("Send Magic Invite", "Enviar Enlace Mágico")}
                </button>
              </form>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Bulk CSV Upload */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl text-[#F97316]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t("Bulk CSV Invite Upload", "Subida Masiva de Invitaciones por CSV")}</h3>
                  <p className="text-xs text-slate-400">{t("Paste comma-separated rows matching: email,first_name,last_name,role", "Pegar filas separadas por comas.")}</p>
                </div>
              </div>

              <form onSubmit={handleBulkCSVUpload} className="space-y-4">
                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="email,first_name,last_name,role&#10;jane@solarcorp.com,Jane,Doe,sales_rep&#10;bob@solarcorp.com,Bob,Vance,trainer"
                  className="w-full min-h-[120px] bg-[#121212] border border-white/10 focus:border-[#F97316]/50 rounded-2xl p-4 text-xs text-slate-200 outline-none font-mono resize-none transition-all"
                />
                
                {bulkStatus && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-2xl leading-relaxed">
                    <p className="font-bold">Bulk CSV Report:</p>
                    <p className="mt-1">Success Upload Count: {bulkStatus.success_count || bulkStatus.successes?.length || 0}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploadingBulk || !csvContent.trim()}
                  className="w-full py-3 bg-[#F97316] hover:bg-[#F97316]/95 text-slate-900 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-1.5"
                >
                  {isUploadingBulk ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {t("Process Bulk CSV Upload", "Procesar CSV")}
                </button>
              </form>
            </div>

            {/* Pending Invitations list */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-200">{t("Pending Invites", "Invitaciones Pendientes")}</h3>
              
              {loadingInvites && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-[#F97316]" /></div>}

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {invitations.filter(i => i.status === "pending").map((inv, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-2xl text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{inv.first_name} {inv.last_name}</p>
                      <p className="text-[10px] text-slate-500">{inv.email}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-hud uppercase tracking-widest font-black">
                      {inv.status}
                    </span>
                  </div>
                ))}
                {invitations.filter(i => i.status === "pending").length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">{t("No pending invitations", "No hay invitaciones pendientes")}</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── TAB 7: TEAM TEMPLATES SYSTEM ────────────────────────────────────── */}
      {activeTab === "templates" && (
        <div className="space-y-8 animate-in fade-in duration-300 no-print">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-hud font-black uppercase text-slate-200 tracking-wide">
                {t("Team Onboarding Templates", "Plantillas de Configuración")}
              </h2>
              <p className="text-xs text-slate-400">
                {t("Create and apply reusable templates of default teams, curriculums, certifications, and GHL tags.", "Cree y aplique plantillas reutilizables de equipos, cursos, certificaciones y etiquetas.")}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider font-hud bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl transition-all shadow-lg shadow-[#F97316]/20"
            >
              <Plus className="w-4 h-4" />
              {t("Create Custom Template", "Crear Nueva Plantilla")}
            </button>
          </div>

          {loadingTemplates && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
            </div>
          )}

          {!loadingTemplates && templates.length === 0 && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400 font-bold mb-2">{t("No Templates Configured", "No hay plantillas configuradas")}</p>
              <p className="text-xs text-slate-500">{t("Create your first template to quickly bootstrap teams and roles.", "Cree su primera plantilla para configurar equipos y roles rápidamente.")}</p>
            </div>
          )}

          {!loadingTemplates && templates.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {templates.map((temp) => (
                <div key={temp.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-hud uppercase tracking-widest font-black",
                        temp.is_global_template
                          ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      )}>
                        {temp.is_global_template ? t("Global", "Global") : t("Company Local", "Local")}
                      </span>
                      <div className="flex gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[9px] font-bold uppercase tracking-wider font-hud">
                          v{temp.template_version}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[9px] font-hud uppercase tracking-wider">
                          {temp.target_scope}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-hud font-black text-lg text-slate-200 uppercase tracking-wide">{temp.template_name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{temp.description || t("No description provided.", "Sin descripción.")}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                        <p className="text-lg font-black font-hud text-[#F97316]">{temp.teams_count}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t("Teams Created", "Equipos")}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                        <p className="text-lg font-black font-hud text-[#F97316]">{temp.curriculums_count}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t("Courses", "Cursos")}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center col-span-2">
                        <p className="text-[10px] text-slate-400 font-semibold">
                          {t("Configured Roles:", "Roles configurados:")} <span className="font-hud text-xs text-slate-200 font-black tracking-wider uppercase ml-1">{temp.roles_count}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Target Scope", "Objetivo")}</label>
                        <select
                          value={applyTargetType}
                          onChange={(e) => {
                            setApplyTargetType(e.target.value as any)
                            setApplyTargetId("")
                          }}
                          className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                        >
                          <option value="company">{t("Company-wide", "Toda la Empresa")}</option>
                          <option value="branch">{t("Branch Office", "Sucursal")}</option>
                          <option value="team">{t("Sales Team", "Equipo")}</option>
                        </select>
                      </div>

                      {applyTargetType !== "company" && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">
                            {applyTargetType === "branch" ? t("Branch ID", "ID Sucursal") : t("Team ID", "ID Equipo")}
                          </label>
                          <select
                            value={applyTargetId}
                            onChange={(e) => setApplyTargetId(e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                          >
                            <option value="">{t("-- Select target --", "-- Seleccionar --")}</option>
                            {applyTargetType === "branch"
                              ? branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>)
                              : teams.map(tm => <option key={tm.team_id} value={tm.team_id}>{tm.team_name}</option>)
                            }
                          </select>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handlePreviewTemplate(temp.id)}
                      className="w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[#F97316] font-bold text-xs uppercase tracking-wider font-hud rounded-xl py-3 transition-all"
                    >
                      {t("Preview & Apply", "Previsualizar y Aplicar")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PREVIEW MODAL */}
          {showPreviewModal && previewData && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-2xl w-full p-8 max-h-[85vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-hud font-black text-xl text-slate-200 uppercase tracking-wide">{t("Template Application Preview", "Vista Previa de Aplicación")}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t("Review changes before configuring target.", "Revise los cambios antes de configurar el objetivo.")}</p>
                  </div>
                  <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-white p-2 text-lg font-bold">✕</button>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t("Template Name", "Nombre Plantilla")}</p>
                      <p className="text-sm font-bold text-slate-200">{previewData.template_name} (v{previewData.template_version})</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t("Target Scope", "Objetivo de Destino")}</p>
                      <p className="text-sm font-hud font-black text-[#F97316] uppercase tracking-wider">{previewData.target_type} ({previewData.target_id})</p>
                    </div>
                  </div>

                  {/* Teams list */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-slate-300 font-hud uppercase tracking-wide">{t("Teams to Create", "Equipos a Crear")}</h4>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
                      {previewData.teams_to_create.map((tm: string, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-300 font-semibold">
                          <span>{tm}</span>
                          <span className="text-[10px] text-[#F97316] uppercase tracking-wider font-bold">New team</span>
                        </div>
                      ))}
                      {previewData.teams_to_create.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-2">{t("No new teams will be created", "No se crearán equipos nuevos")}</p>
                      )}
                    </div>
                  </div>

                  {/* Curriculum list */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-slate-300 font-hud uppercase tracking-wide">{t("Curriculums to Assign", "Asignación de Currículos")}</h4>
                    <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/5 text-slate-400 font-hud uppercase text-[9px] tracking-wider">
                            <th className="p-3 font-semibold">{t("Username", "Usuario")}</th>
                            <th className="p-3 font-semibold">{t("Role", "Rol")}</th>
                            <th className="p-3 font-semibold">{t("Curriculum Course", "Curso")}</th>
                            <th className="p-3 font-semibold text-right">{t("Status", "Estado")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.curriculums_to_assign.map((curr: any, idx: number) => (
                            <tr key={idx} className="border-b border-white/5 text-slate-300">
                              <td className="p-3 font-bold">{curr.username}</td>
                              <td className="p-3 text-slate-400 font-hud uppercase tracking-wider text-[10px]">{curr.role}</td>
                              <td className="p-3">{curr.curriculum_name}</td>
                              <td className="p-3 text-right">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-bold font-hud tracking-wider uppercase",
                                  curr.is_already_assigned
                                    ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                )}>
                                  {curr.is_already_assigned ? t("Active", "Activo") : t("Pending", "Pendiente")}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {previewData.curriculums_to_assign.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-xs text-slate-500">{t("No user curriculum assignments found.", "No hay asignaciones curriculares.")}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Certifications and GHL rule preview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-slate-300 font-hud uppercase tracking-wide">{t("Certification Paths", "Rutas de Certificación")}</h4>
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-xs space-y-2">
                        {previewData.certifications_to_configure.map((cert: any, idx: number) => (
                          <div key={idx} className="text-slate-300">
                            <span className="font-bold font-hud uppercase tracking-wider text-[10px] text-[#F97316] mr-1">{cert.role}:</span>
                            <span>{cert.certification_name}</span>
                          </div>
                        ))}
                        {previewData.certifications_to_configure.length === 0 && (
                          <p className="text-slate-500 text-center">{t("None", "Ninguna")}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-slate-300 font-hud uppercase tracking-wide">{t("GHL Tags to Sync", "Etiquetas GHL")}</h4>
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-xs space-y-2">
                        {previewData.ghl_tags_to_sync.map((ghl: any, idx: number) => (
                          <div key={idx} className="text-slate-300">
                            <span className="font-bold text-slate-200">{ghl.username}</span>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {ghl.tags.map((tg: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-[9px] font-hud uppercase tracking-wider">{tg}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                        {previewData.ghl_tags_to_sync.length === 0 && (
                          <p className="text-slate-500 text-center">{t("None", "Ninguna")}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-5 py-3 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl text-xs uppercase tracking-wider font-hud font-bold transition-all"
                  >
                    {t("Cancel", "Cancelar")}
                  </button>
                  <button
                    onClick={() => handleApplyTemplate(previewData.template_id)}
                    disabled={isApplyingTemplate}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl text-xs uppercase tracking-wider font-hud font-bold transition-all disabled:opacity-50"
                  >
                    {isApplyingTemplate ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {t("Applying...", "Aplicando...")}
                      </>
                    ) : (
                      t("Apply Template", "Aplicar Plantilla")
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CREATE MODAL */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-xl w-full p-8 max-h-[85vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-hud font-black text-xl text-slate-200 uppercase tracking-wide">{t("Create Custom Template", "Crear Plantilla")}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t("Design a default onboarding track for roles & teams.", "Diseñe un camino de onboarding por defecto.")}</p>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-2 text-lg font-bold">✕</button>
                </div>

                <form onSubmit={handleSaveTemplate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Template Name", "Nombre")}</label>
                    <input
                      type="text"
                      required
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="e.g. West Coast Sales Standard"
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-[#F97316]/50 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Description", "Descripción")}</label>
                    <textarea
                      value={newTemplateDesc}
                      onChange={(e) => setNewTemplateDesc(e.target.value)}
                      placeholder="Summary of this blueprint..."
                      className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none h-16 resize-none focus:border-[#F97316]/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Scope Scope", "Ámbito")}</label>
                      <select
                        value={newTemplateScope}
                        onChange={(e) => setNewTemplateScope(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                      >
                        <option value="company">{t("Company-wide", "Toda la Empresa")}</option>
                        <option value="branch">{t("Branch", "Sucursal")}</option>
                        <option value="team">{t("Team", "Equipo")}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Version (int)", "Versión")}</label>
                      <input
                        type="number"
                        min="1"
                        value={newTemplateVersion}
                        onChange={(e) => setNewTemplateVersion(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  {user?.role === "super_admin" && (
                    <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                      <input
                        type="checkbox"
                        id="isGlobal"
                        checked={newTemplateIsGlobal}
                        onChange={(e) => setNewTemplateIsGlobal(e.target.checked)}
                        className="rounded accent-[#F97316]"
                      />
                      <label htmlFor="isGlobal" className="text-xs text-slate-300 font-bold uppercase tracking-wide font-hud cursor-pointer">
                        {t("Make Global Template", "Hacer Plantilla Global")}
                      </label>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Default Roles Rules", "Roles Configurados")}</label>
                    <div className="flex gap-2 flex-wrap bg-[#121212] border border-white/10 p-3 rounded-xl">
                      {["sales_rep", "branch_manager", "trainer", "observer"].map((r) => (
                        <div key={r} className="flex items-center gap-1.5 mr-2">
                          <input
                            type="checkbox"
                            id={`role-${r}`}
                            checked={newTemplateRoles.includes(r)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTemplateRoles([...newTemplateRoles, r])
                              } else {
                                setNewTemplateRoles(newTemplateRoles.filter(role => role !== r))
                              }
                            }}
                            className="accent-[#F97316]"
                          />
                          <label htmlFor={`role-${r}`} className="text-xs text-slate-300 capitalize cursor-pointer font-semibold">{r.replace("_", " ")}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-hud">{t("Teams to Spawn", "Equipos a Generar")}</label>
                    <div className="flex gap-2 bg-[#121212] border border-white/10 rounded-xl p-2.5">
                      <input
                        type="text"
                        value={newTeamInput}
                        onChange={(e) => setNewTeamInput(e.target.value)}
                        placeholder="e.g. Sales Closers"
                        className="flex-1 bg-transparent text-xs text-slate-200 outline-none px-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTeamInput && !newTemplateTeams.includes(newTeamInput)) {
                            setNewTemplateTeams([...newTemplateTeams, newTeamInput])
                            setNewTeamInput("")
                          }
                        }}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#F97316] font-bold"
                      >
                        {t("Add Team", "Añadir")}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {newTemplateTeams.map(t => (
                        <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-[10px] font-hud uppercase tracking-widest font-black">
                          {t}
                          <button type="button" onClick={() => setNewTemplateTeams(newTemplateTeams.filter(tm => tm !== t))} className="ml-1 text-slate-400 hover:text-white">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-5 py-3 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl text-xs uppercase tracking-wider font-hud font-bold transition-all"
                    >
                      {t("Cancel", "Cancelar")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingTemplate}
                      className="flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl text-xs uppercase tracking-wider font-hud font-bold transition-all disabled:opacity-50"
                    >
                      {isSavingTemplate ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          {t("Saving...", "Guardando...")}
                        </>
                      ) : (
                        t("Save Template", "Guardar")
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 8: CREDENTIALS MANAGEMENT ────────────────────────────────────── */}
      {activeTab === "credentials" && (
        <div className="space-y-6 animate-in fade-in duration-300 no-print">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-hud font-black uppercase text-slate-200 tracking-wide">
                {t("Credential Management", "Gestión de Credenciales")}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t("Approve, revoke, renew, and verify issued certifications across your organization.", "Apruebe, revoque, renueve y verifique certificaciones emitidas en su organización.")}
              </p>
            </div>
            <button
              onClick={() => {
                if (!user || isDemo) return
                setLoadingCreds(true)
                setCredActionMsg(null)
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
                const params = new URLSearchParams()
                if (credStatusFilter) params.set("filter_status", credStatusFilter)
                if (credFilter) params.set("filter_username", credFilter)
                fetch(`${apiUrl}/api/v1/certifications/list?${params.toString()}`, {
                  headers: { "X-User-Id": user.username }
                })
                  .then(r => r.json())
                  .then(data => setCredCerts(data.certifications || []))
                  .catch(() => setCredActionMsg({ type: "error", text: "Failed to load credentials." }))
                  .finally(() => setLoadingCreds(false))
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider font-hud bg-[#F97316] hover:bg-[#F97316]/80 text-white rounded-xl transition-all shadow-lg shadow-[#F97316]/20"
            >
              <ShieldCheck className="w-4 h-4" />
              {t("Load Credentials", "Cargar Credenciales")}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder={t("Filter by username...", "Filtrar por usuario...")}
              value={credFilter}
              onChange={e => setCredFilter(e.target.value)}
              className="px-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 outline-none focus:border-[#F97316]/40 w-52"
            />
            <select
              value={credStatusFilter}
              onChange={e => setCredStatusFilter(e.target.value)}
              className="px-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-slate-200 outline-none focus:border-[#F97316]/40"
            >
              <option value="">{t("All Statuses", "Todos los estados")}</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="EXPIRED">Expired</option>
              <option value="REVOKED">Revoked</option>
            </select>
            <button
              onClick={() => {
                if (!credCerts.length) return
                const headers = ["ID", "User", "Certification", "Status", "Issued At", "Expires At", "Approved By", "Revoked By", "Revoked Reason", "Verification Hash"]
                const rows = credCerts.map(c => [
                  c.id, c.userId, c.certificationName, c.status,
                  c.issuedAt || "", c.expiresAt || "", c.approvedBy || "",
                  c.revokedBy || "", c.revokedReason || "", c.verificationHash
                ])
                const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
                const blob = new Blob([csv], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url; a.download = "credentials_export.csv"; a.click()
                URL.revokeObjectURL(url)
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-slate-300"
            >
              <FileText className="w-3.5 h-3.5" />
              {t("Export CSV", "Exportar CSV")}
            </button>
          </div>

          {/* Action Message */}
          {credActionMsg && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${
              credActionMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
                : "bg-red-500/10 border-red-400/20 text-red-300"
            }`}>
              {credActionMsg.text}
            </div>
          )}

          {/* Revoke Reason Modal */}
          {revokeTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="bg-[#1a1a1e] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-2">{t("Revoke Certification", "Revocar Certificación")}</h3>
                <p className="text-sm text-slate-400 mb-4">{t("You are revoking certification for", "Está revocando la certificación de")} <span className="text-white font-bold">{revokeTarget.userId}</span>. {t("Please provide a reason.", "Por favor proporcione una razón.")}</p>
                <textarea
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 outline-none focus:border-red-400/40 resize-none mb-4"
                  rows={3}
                  placeholder={t("Reason for revocation...", "Razón de revocación...")}
                  value={revokeReason}
                  onChange={e => setRevokeReason(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setRevokeTarget(null); setRevokeReason("") }}
                    className="flex-1 py-2.5 text-xs font-bold border border-white/10 rounded-xl text-slate-400 hover:bg-white/5 transition-all"
                  >
                    {t("Cancel", "Cancelar")}
                  </button>
                  <button
                    disabled={isRevoking || !revokeReason.trim()}
                    onClick={async () => {
                      if (!user || !revokeTarget) return
                      setIsRevoking(true)
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
                      try {
                        const res = await fetch(`${apiUrl}/api/v1/certifications/${revokeTarget.id}/revoke`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json", "X-User-Id": user.username },
                          body: JSON.stringify({ reason: revokeReason })
                        })
                        const data = await res.json()
                        if (res.ok) {
                          setCredActionMsg({ type: "success", text: `Revoked: ${revokeTarget.certificationName} for ${revokeTarget.userId}` })
                          setCredCerts(prev => prev.map(c => c.id === revokeTarget.id ? { ...c, status: "REVOKED", revokedBy: user.username, revokedReason: revokeReason } : c))
                        } else {
                          setCredActionMsg({ type: "error", text: data?.detail || "Failed to revoke." })
                        }
                      } catch { setCredActionMsg({ type: "error", text: "Network error." }) }
                      finally { setIsRevoking(false); setRevokeTarget(null); setRevokeReason("") }
                    }}
                    className="flex-1 py-2.5 text-xs font-bold bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all disabled:opacity-50"
                  >
                    {isRevoking ? t("Revoking...", "Revocando...") : t("Confirm Revoke", "Confirmar Revocación")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Credentials Table */}
          {loadingCreds ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
            </div>
          ) : credCerts.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
              <ShieldCheck className="w-12 h-12 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400 text-sm">{t("No credentials loaded. Click \"Load Credentials\" to fetch.", "No hay credenciales. Haga clic en \"Cargar Credenciales\".")}</p>
            </div>
          ) : (
            <div className="bg-white/3 border border-white/8 rounded-3xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left px-5 py-4 font-hud text-[10px] uppercase tracking-widest text-slate-500">{t("Rep", "Rep")}</th>
                    <th className="text-left px-5 py-4 font-hud text-[10px] uppercase tracking-widest text-slate-500">{t("Certification", "Certificación")}</th>
                    <th className="text-left px-5 py-4 font-hud text-[10px] uppercase tracking-widest text-slate-500">{t("Status", "Estado")}</th>
                    <th className="text-left px-5 py-4 font-hud text-[10px] uppercase tracking-widest text-slate-500">{t("Issued", "Emitido")}</th>
                    <th className="text-left px-5 py-4 font-hud text-[10px] uppercase tracking-widest text-slate-500">{t("Expires", "Expira")}</th>
                    <th className="text-left px-5 py-4 font-hud text-[10px] uppercase tracking-widest text-slate-500">{t("Views", "Vistas")}</th>
                    <th className="text-right px-5 py-4 font-hud text-[10px] uppercase tracking-widest text-slate-500">{t("Actions", "Acciones")}</th>
                  </tr>
                </thead>
                <tbody>
                  {credCerts.map(cert => (
                    <tr key={cert.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4 text-white font-medium">{cert.userId}</td>
                      <td className="px-5 py-4 text-slate-300">{cert.certificationName}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          cert.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20" :
                          cert.status === "PENDING_APPROVAL" ? "bg-blue-500/15 text-blue-300 border border-blue-400/20" :
                          cert.status === "EXPIRED" ? "bg-amber-500/15 text-amber-300 border border-amber-400/20" :
                          "bg-red-500/15 text-red-300 border border-red-400/20"
                        }`}>
                          {cert.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "-"}</td>
                      <td className="px-5 py-4 text-slate-400">{cert.expiresAt ? new Date(cert.expiresAt).toLocaleDateString() : "Never"}</td>
                      <td className="px-5 py-4 text-slate-400">{cert.verificationViews ?? 0}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end flex-wrap">
                          {/* Verify link */}
                          <a
                            href={`/verify/${cert.verificationHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition-all"
                          >
                            {t("Verify", "Verificar")}
                          </a>
                          {/* Approve (for PENDING or EXPIRED) */}
                          {(cert.status === "PENDING_APPROVAL" || cert.status === "EXPIRED") && (
                            <button
                              disabled={isApproving}
                              onClick={async () => {
                                if (!user) return
                                setIsApproving(true)
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
                                try {
                                  const res = await fetch(`${apiUrl}/api/v1/certifications/${cert.id}/approve`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json", "X-User-Id": user.username },
                                    body: JSON.stringify({})
                                  })
                                  const data = await res.json()
                                  if (res.ok) {
                                    setCredActionMsg({ type: "success", text: `Approved: ${cert.certificationName} for ${cert.userId}` })
                                    setCredCerts(prev => prev.map(c => c.id === cert.id ? { ...c, status: "ACTIVE", approvedBy: user.username } : c))
                                  } else {
                                    setCredActionMsg({ type: "error", text: data?.detail || "Approval failed." })
                                  }
                                } catch { setCredActionMsg({ type: "error", text: "Network error." }) }
                                finally { setIsApproving(false) }
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/20 rounded-lg text-emerald-300 transition-all disabled:opacity-50"
                            >
                              {t("Approve", "Aprobar")}
                            </button>
                          )}
                          {/* Renew (for EXPIRED or REVOKED) */}
                          {(cert.status === "EXPIRED" || cert.status === "REVOKED") && (
                            <button
                              disabled={isRenewing}
                              onClick={async () => {
                                if (!user) return
                                setIsRenewing(true)
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
                                try {
                                  const res = await fetch(`${apiUrl}/api/v1/certifications/${cert.id}/renew`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json", "X-User-Id": user.username }
                                  })
                                  const data = await res.json()
                                  if (res.ok) {
                                    setCredActionMsg({ type: "success", text: `Renewed: ${cert.certificationName} for ${cert.userId}` })
                                    setCredCerts(prev => prev.map(c => c.id === cert.id ? { ...c, status: "ACTIVE", approvedBy: user.username } : c))
                                  } else {
                                    setCredActionMsg({ type: "error", text: data?.detail || "Renewal failed." })
                                  }
                                } catch { setCredActionMsg({ type: "error", text: "Network error." }) }
                                finally { setIsRenewing(false) }
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/20 rounded-lg text-blue-300 transition-all disabled:opacity-50"
                            >
                              {t("Renew", "Renovar")}
                            </button>
                          )}
                          {/* Revoke (for ACTIVE or PENDING) */}
                          {(cert.status === "ACTIVE" || cert.status === "PENDING_APPROVAL") && (
                            <button
                              onClick={() => setRevokeTarget(cert)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-red-500/15 hover:bg-red-500/25 border border-red-400/20 rounded-lg text-red-300 transition-all"
                            >
                              {t("Revoke", "Revocar")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── PRINT CSS STYLING OVERRIDE ─── */}
      <style jsx global>{`
        @media print {
          /* Hide non-report layout elements */
          body {
            background: white !important;
            color: black !important;
          }
          .no-print, header, aside, button, footer {
            display: none !important;
          }
          .print-block {
            display: block !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          table {
            border: 1px solid #e2e8f0 !important;
            color: black !important;
            width: 100% !important;
          }
          th {
            background-color: #f1f5f9 !important;
            color: black !important;
            border-bottom: 2px solid #cbd5e1 !important;
          }
          td {
            color: black !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }
          /* Custom layout tweaks */
          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>

    </AppShell>
  )
}
