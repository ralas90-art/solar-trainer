"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api-client"
import { WHITE_LABEL } from "@/lib/white-label.config"
import { AppShell } from "@/components/platform/app-shell"
import { WidgetCard, SectionEyebrow, StatCard, NotificationPill } from "@/components/platform/dashboard-widgets"
import { 
    Users, 
    UserPlus, 
    Trash2, 
    Mail, 
    Shield, 
    Clock, 
    CheckCircle2, 
    X,
    Send,
    ExternalLink
} from "lucide-react"

export default function TeamHubPage() {
    const { user } = useAuth()
    const [members, setMembers] = useState<any[]>([])
    const [invites, setInvites] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState("sales_rep")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        try {
            const [membersData, invitesData] = await Promise.all([
                api.get<any[]>("/api/v1/team/members"),
                api.get<any[]>("/api/v1/team/invites")
            ])
            setMembers(membersData)
            setInvites(invitesData)
        } catch (err) {
            console.error("Failed to fetch team data", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage({ text: "", type: "" })

        try {
            await api.post("/api/v1/invites/", {
                email: inviteEmail,
                role: inviteRole
            })
            setMessage({ text: "Invitation sent successfully!", type: "success" })
            setInviteEmail("")
            fetchData()
            setTimeout(() => setShowInviteModal(false), 2000)
        } catch (err: any) {
            setMessage({ text: err.message || "Failed to send invitation", type: "error" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRemoveMember = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this team member?")) return

        try {
            await api.delete(`/api/v1/team/members/${userId}`)
            fetchData()
        } catch (err: any) {
            alert(err.message || "Failed to remove member")
        }
    }

    const copyInviteLink = (token: string) => {
        const url = `${window.location.origin}/onboarding/${token}`
        navigator.clipboard.writeText(url)
        alert("Invite link copied to clipboard!")
    }

    return (
        <AppShell 
            heading="Team Hub" 
            subheading={`Coordinate your ${WHITE_LABEL.industry.toLowerCase()} sales force and manage team growth.`}
        >
            <div className="space-y-6">
                {/* Stats Overview */}
                <section className="grid gap-6 md:grid-cols-3">
                    <StatCard 
                        label="Total Active Reps" 
                        value={members.length.toString()} 
                        change="Synced live" 
                        icon={Users} 
                        accent="cyan"
                    />
                    <StatCard 
                        label="Pending Invites" 
                        value={invites.length.toString()} 
                        change="Awaiting activation" 
                        icon={Clock} 
                        accent="lime"
                    />
                    <StatCard 
                        label="Company ID" 
                        value={user?.companyId?.toUpperCase() || "..."} 
                        change="Active Tenant" 
                        icon={Shield} 
                    />
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Team Members List */}
                    <div className="lg:col-span-2 space-y-6">
                        <WidgetCard>
                            <SectionEyebrow 
                                label="Active Team Members" 
                                action="Manage Roles"
                            />
                            
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                                            <th className="pb-3 pl-2">Name / Email</th>
                                            <th className="pb-3">Role</th>
                                            <th className="pb-3">Joined</th>
                                            <th className="pb-3 text-right pr-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {members.map((member) => (
                                            <tr key={member.id} className="group">
                                                <td className="py-4 pl-2">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white">{member.full_name || "New User"}</span>
                                                        <span className="text-xs text-[#64748B]">{member.email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <NotificationPill 
                                                        label={member.role} 
                                                        tone={member.role === 'manager' ? 'lime' : 'slate'} 
                                                    />
                                                </td>
                                                <td className="py-4 text-xs text-[#64748B]">
                                                    {new Date(member.joined_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 text-right pr-2">
                                                    {member.id !== user?.id && (
                                                        <button 
                                                            onClick={() => handleRemoveMember(member.id)}
                                                            className="p-2 text-[#64748B] hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {members.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-[#64748B] text-sm">
                                                    No active members found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </WidgetCard>
                    </div>

                    {/* Actions & Pending Invites */}
                    <div className="space-y-6">
                        <WidgetCard className="bg-[#FF5722]/5 border-[#FF5722]/20">
                            <h3 className="font-display font-black text-white italic uppercase tracking-tighter text-xl mb-4">
                                Grow Your Team
                            </h3>
                            <p className="text-sm text-[#94A3B8] mb-6">
                                Invite new sales representatives to join your organization's training environment.
                            </p>
                            <button 
                                onClick={() => setShowInviteModal(true)}
                                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                            >
                                <UserPlus className="h-5 w-5" />
                                <span>SEND INVITATION</span>
                            </button>
                        </WidgetCard>

                        <WidgetCard>
                            <SectionEyebrow label="Pending Invitations" />
                            <div className="mt-4 space-y-3">
                                {invites.map((invite) => (
                                    <div key={invite.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-white truncate max-w-[140px]">{invite.email}</span>
                                            <NotificationPill label={invite.role} tone="slate" />
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-[#64748B] uppercase tracking-widest">
                                            <span>Expires {new Date(invite.expires_at).toLocaleDateString()}</span>
                                            <button 
                                                onClick={() => copyInviteLink(invite.token)}
                                                className="text-[#FF5722] hover:text-white transition-colors flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                COPY LINK
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {invites.length === 0 && (
                                    <p className="text-center py-4 text-xs text-[#475569]">No pending invites</p>
                                )}
                            </div>
                        </WidgetCard>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1A1A1A] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-8 relative">
                        <button 
                            onClick={() => setShowInviteModal(false)}
                            className="absolute top-6 right-6 text-[#64748B] hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center text-[#FF5722]">
                                <Send className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Invite Team Member</h2>
                        </div>

                        <form onSubmit={handleSendInvite} className="space-y-5">
                            {message.text && (
                                <div className={`p-4 rounded-xl text-sm border ${
                                    message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B]">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                    <input 
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        required
                                        placeholder={`rep@${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '')}.com`}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B]">Assign Role</label>
                                <select 
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#FF5722]/50 transition-colors"
                                >
                                    <option value="sales_rep">Sales Representative</option>
                                    <option value="manager">Manager / Team Lead</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary h-14 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? "Processing..." : "SEND INVITE NOW"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AppShell>
    )
}
