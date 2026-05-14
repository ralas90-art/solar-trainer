"use client"

import { useState } from "react"
import { 
  Mail, 
  MessageSquare, 
  Send, 
  User, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Settings
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"
import { WHITE_LABEL } from "@/lib/white-label.config"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate backend submission / future HighLevel integration
    setTimeout(() => {
      console.log("Contact Form Submitted:", formData)
      setIsSubmitted(true)
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-body selection:bg-[#F97316]/30">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Info */}
            <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-[10px] font-black uppercase tracking-[0.2em] font-display">
                        <MessageSquare className="w-3 h-3 fill-current" /> Support & Inquiries
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] font-display uppercase italic text-white">
                        Connect with<br />
                        <span className="text-[#F97316]">{WHITE_LABEL.companyName}.</span>
                    </h1>
                    <p className="text-xl text-[#94A3B8] max-w-lg leading-relaxed font-light">
                        Our specialized engineering and sales support team is here to assist your {WHITE_LABEL.industry.toLowerCase()} organization.
                    </p>
                </div>

                <div className="space-y-8">
                    {[
                        { icon: Globe, label: "Global Network", desc: `Supporting ${WHITE_LABEL.industry.toLowerCase()} teams across 15+ countries.` },
                        { icon: Settings, label: "Technical Support", desc: "Integration and simulation troubleshooting." },
                        { icon: Zap, label: "Consultation", desc: "Bespoke curriculum design for enterprise clients." }
                    ].map((feature, i) => (
                        <div key={i} className="flex gap-6 items-start">
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#F97316]">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">{feature.label}</h3>
                                <p className="text-sm text-[#94A3B8] font-light">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#F97316] to-[#F59E0B] rounded-[3rem] blur opacity-10"></div>
                
                <div className="relative bg-[#1A1A1A] border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                    {isSubmitted ? (
                        <div className="text-center py-12 space-y-6">
                            <div className="mx-auto w-20 h-20 rounded-full bg-[#F97316]/20 flex items-center justify-center border border-[#F97316]/40">
                                <CheckCircle2 className="w-10 h-10 text-[#F97316]" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Message Sent</h2>
                            <p className="text-[#94A3B8] font-light max-w-xs mx-auto">
                                Thank you for reaching out. An engineer or consultant will respond within 24 hours.
                            </p>
                            <Link href="/">
                                <Button className="btn-outline-solar mt-6 h-12 px-8 text-xs font-black uppercase tracking-widest rounded-xl">
                                    Return Home
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black tracking-tight font-display uppercase italic">Get in Touch</h2>
                                <p className="text-[#64748B] text-[10px] font-black uppercase tracking-widest font-display mt-2">All data transmitted via encrypted pipeline</p>
                            </div>

                            <div className="space-y-4">
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                                        <input 
                                            required
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="john@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#F97316]/50 outline-none transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Subject</label>
                                    <select 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:border-[#F97316]/50 outline-none transition-all"
                                    >
                                        <option value="General Inquiry" className="bg-[#1A1A1A]">General Inquiry</option>
                                        <option value="Technical Support" className="bg-[#1A1A1A]">Technical Support</option>
                                        <option value="Billing" className="bg-[#1A1A1A]">Billing & Payments</option>
                                        <option value="Custom Curriculum" className="bg-[#1A1A1A]">Custom Curriculum</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1 font-display">Message</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        placeholder="How can we assist you?"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-[#F97316]/50 outline-none transition-all placeholder:text-slate-600 resize-none"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-[#F97316] text-[#121212] font-black uppercase tracking-tighter text-xl rounded-2xl hover:shadow-[0_0_35px_rgba(249,115,22,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-display italic group"
                            >
                                {isSubmitting ? "Transmitting..." : (
                                    <>
                                        Send Message
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>

        <Footer />
    </div>
  )
}
