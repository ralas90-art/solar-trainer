"use client"

import { useState } from "react"
import { api } from "@/lib/api-client"
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Settings, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Users,
  Building2,
  Mail,
  User
} from "lucide-react"
import Link from "next/link"

const enterpriseFeatures = [
  {
    title: "Team Performance Analytics",
    description: "Deep insights into individual and team-wide sales performance metrics.",
    icon: BarChart3,
    color: "text-[#F97316]"
  },
  {
    title: "Custom Certification Tracks",
    description: "Build bespoke training paths tailored to your specific solar products.",
    icon: Shield,
    color: "text-[#F59E0B]"
  },
  {
    title: "Private Platform Instance",
    description: "Your own dedicated environment with secure single sign-on (SSO).",
    icon: Settings,
    color: "text-[#F97316]"
  }
]

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: 50,
    useCase: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await api.post("/enterprise/inquiry", formData)
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
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Inquiry Received</h1>
          <p className="text-[#94A3B8] font-light">
            Your request has been prioritized based on your profile. A consultant will reach out via email shortly with a calendar invite.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-[#F97316] font-display text-sm font-black hover:gap-3 transition-all">
            RETURN TO PRICING <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-body selection:bg-[#F97316]/30">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <main className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Value Prop */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-[10px] font-black uppercase tracking-[0.2em] font-display">
              <Zap className="w-3 h-3 fill-current" /> Enterprise Solutions
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] font-display uppercase italic">
              Scale Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#F59E0B]">Solar Sales</span><br />
              Acceleration
            </h1>
            <p className="text-xl text-[#94A3B8] max-w-lg leading-relaxed font-light">
              Equip your entire organization with AI-driven training models designed for the high-stake solar industry.
            </p>
          </div>

          <div className="space-y-6">
            {enterpriseFeatures.map((feature, i) => (
              <div key={i} className="group relative bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-[#F97316]/40 transition-all hover:translate-x-2">
                <div className="flex gap-6 items-start">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                    <p className="text-sm text-[#94A3B8] font-light">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#121212] bg-slate-800" />
              ))}
            </div>
            <p className="text-sm text-[#94A3B8] font-light">
              Joined by over <span className="text-white font-bold">50+ Mega-Teams</span> globally
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#F97316] to-[#F59E0B] rounded-[3rem] blur opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-[#121212] border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight font-display uppercase italic">Request Access</h2>
              <p className="text-[#64748B] text-[10px] font-black uppercase tracking-widest font-display">Connect with an Enterprise Consultant</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@solarcorp.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                  <input 
                    required
                    type="text" 
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Mega Solar Tech"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 flex items-center gap-2 font-display">
                    <Users className="w-3 h-3" /> Team Size
                  </label>
                  <span className="text-2xl font-black text-[#F97316] font-display italic">{formData.teamSize === 500 ? "500+" : formData.teamSize}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value)})}
                  className="w-full accent-[#F97316] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Your Objective / Goals</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.useCase}
                  onChange={(e) => setFormData({...formData, useCase: e.target.value})}
                  placeholder="How can we help your team scale?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#F97316]/50 outline-none transition-all placeholder:text-slate-600 resize-none font-body"
                />
              </div>

              <div className="p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F59E0B] font-display">
                  <Calendar className="w-3 h-3" /> Select Preferred Demo Time
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"].map((time, i) => (
                    <button key={i} type="button" className="py-2 text-[10px] font-black border border-white/10 rounded-xl hover:bg-[#F59E0B] hover:text-[#121212] transition-colors uppercase font-display">
                      {time}
                    </button>
                  ))}
                  <button type="button" className="py-2 text-[10px] font-black border border-white/10 rounded-xl hover:bg-[#F59E0B] hover:text-[#121212] transition-colors uppercase col-span-2 font-display">
                    Other / Custom
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-[#121212] font-black uppercase tracking-tighter text-xl rounded-2xl hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-display italic"
              >
                {isSubmitting ? "Sending Inquiry..." : (
                  <>
                    Initiate Enterprise Request
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[9px] text-[#475569] font-black uppercase tracking-[0.3em] font-display">
              Security Protocol: AES-256 Encrypted Transmission
            </p>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
        <h1 className="font-display text-xl font-black tracking-tight flex items-center gap-2 uppercase italic">
          SeptiVolt <span className="text-[#F97316]">OS</span>
        </h1>
        <div className="text-[10px] font-black uppercase tracking-widest flex flex-wrap gap-x-8 gap-y-4 justify-center font-display">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/acceptable-use" className="hover:text-white transition-colors">Acceptable Use</Link>
          <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
          <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookies</Link>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest font-display">© 2026 Global Sales Accelerator</p>
      </footer>
    </div>
  )
}
