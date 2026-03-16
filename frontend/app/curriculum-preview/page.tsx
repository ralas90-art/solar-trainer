"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    Circle,
    PlayCircle,
    FileText,
    CheckSquare,
    Award,
    BookOpen,
    Download,
    Video,
    ListTodo,
    Menu,
    AlertTriangle
} from "lucide-react";

// Real Data for Day 1 Modules based on curriculum
const DAY_1_MODULES = [
    {
        id: "1.1",
        title: "Welcome & Vision Casting",
        type: "lecture",
        duration: "15 min",
        completed: false
    },
    {
        id: "1.2",
        title: "Administrative Onboarding",
        type: "checklist",
        duration: "45-60 min",
        completed: false
    },
    {
        id: "1.3",
        title: "Company Culture & Expectations",
        type: "lecture",
        duration: "20 min",
        completed: false
    },
    {
        id: "1.4",
        title: "Solar Industry Overview",
        type: "lecture",
        duration: "20 min",
        completed: false
    },
    {
        id: "1.5",
        title: "Solar Technology Fundamentals",
        type: "quiz",
        duration: "25 min",
        completed: false
    },
    {
        id: "1.6",
        title: "Identity Shift: Consultant vs Salesperson",
        type: "interactive",
        duration: "20 min",
        completed: false
    },
    {
        id: "1.7",
        title: "Utility Bill Mastery",
        type: "interactive",
        duration: "25 min",
        completed: false
    },
    {
        id: "1.8",
        title: "Day 1 Wrap-Up & Preview",
        type: "lecture",
        duration: "15 min",
        completed: false
    }
];

export default function CurriculumPreview() {
    const [activeModuleId, setActiveModuleId] = useState("1.1");
    const [modules, setModules] = useState(DAY_1_MODULES);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const activeModule = modules.find(m => m.id === activeModuleId);

    const handleMarkComplete = () => {
        setModules(prev => prev.map(m =>
            m.id === activeModuleId ? { ...m, completed: true } : m
        ));

        // Auto-advance
        const currentIndex = modules.findIndex(m => m.id === activeModuleId);
        if (currentIndex < modules.length - 1) {
            setActiveModuleId(modules[currentIndex + 1].id);
        }
    };

    const progressPercentage = Math.round((modules.filter(m => m.completed).length / modules.length) * 100);

    const renderContent = () => {
        if (!activeModule) return null;

        if (activeModule.id === "1.1") {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="aspect-video glass-card bg-slate-950/80 rounded-xl flex items-center justify-center relative shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                        <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-primary cursor-pointer transition-all group-hover:scale-110 relative z-10 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                        <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                            <h2 className="text-2xl font-bold mb-2 text-glow">The Path to $100K+</h2>
                            <p className="text-slate-300">Top Performer Spotlight (Optional Video)</p>
                        </div>
                    </div>

                    <Card className="glass-card bg-slate-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Trainer Script</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-300">
                            <p className="italic font-medium border-l-4 border-primary pl-4 bg-primary/5 p-3 rounded-r-lg shadow-inner">
                                "Welcome to Day 1 of the Solar Sales Accelerator. By Day 7, you won’t just be a trainee, you will be field-ready, capable of running a full appointment cycle independently. But first, we need to cast a vision."
                            </p>
                            <p>
                                "This industry isn't just about money, but the money is real if you put in the work. Let me break down a realistic path to $100K+ in your first year:"
                            </p>
                            <ul className="list-none space-y-3 mt-4">
                                <li className="flex gap-3 bg-slate-950/50 p-3 rounded-lg border border-white/5 shadow-inner">
                                    <span className="text-primary font-bold">Month 1:</span>
                                    <span className="text-slate-400">$3,000 to $5,000. You are learning the curve. This is 'the dip'.</span>
                                </li>
                                <li className="flex gap-3 bg-slate-950/50 p-3 rounded-lg border border-white/5 shadow-inner">
                                    <span className="text-primary font-bold">Month 3:</span>
                                    <span className="text-slate-400">$8,000 to $12,000. Competence sets in. The math starts working for you.</span>
                                </li>
                                <li className="flex gap-3 bg-slate-950/50 p-3 rounded-lg border border-white/5 shadow-inner">
                                    <span className="text-primary font-bold">Month 6+:</span>
                                    <span className="text-slate-400">$15,000 to $25,000+. This is mastery.</span>
                                </li>
                            </ul>
                            <p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-400">
                                "We want you at mastery. But to get there, you must survive the 4 Stages of Competence. Right now, you are in 'Unconscious Incompetence'. Soon, you will hit 'Conscious Incompetence'—the dip where it gets hard. Push through that, and you reach mastery."
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="glass-card bg-primary/5 border-primary/20 relative overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.05)]">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-[0_0_15px_rgba(56,189,248,1)]" />
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2 text-glow">
                                <BookOpen className="w-5 h-5" />
                                Trainee Workbook
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-200">My Financial Goal for Month 6 is:</label>
                                <input type="text" className="w-full p-3 rounded-md bg-slate-950/50 border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 shadow-inner" placeholder="$..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-200">The 4 Stages of Competence are: Unconscious Incompetence, Conscious Incompetence (the Dip), __________, and __________.</label>
                                <input type="text" className="w-full p-3 rounded-md bg-slate-950/50 border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 shadow-inner" placeholder="Your answer..." />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (activeModule.id === "1.2") {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass-card bg-slate-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-100">Administrative Onboarding Checklist</CardTitle>
                            <CardDescription className="text-slate-400">The quickest way to fail in sales is to have administrative chaos. Complete these items before moving forward.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    "W-9/1099 or W-2 paperwork signed",
                                    "Independent contractor agreement",
                                    "Direct deposit setup completed",
                                    "Compliance & background check forms",
                                    "Photo for agent profile (headshot)",
                                    "CRM account created & login verified",
                                    "Design software (Aurora/HelioScope) access verified",
                                    "Company email/Slack/communication tools installed",
                                    "Business cards ordered",
                                    "Uniform/swag kit issued"
                                ].map((item, i) => (
                                    <label key={i} className="flex items-center space-x-4 p-4 border border-white/5 rounded-lg bg-slate-950/50 hover:bg-slate-800/80 hover:border-white/10 cursor-pointer transition-all group shadow-sm">
                                        <div className="relative flex items-center justify-center">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-slate-900 transition-colors cursor-pointer" />
                                        </div>
                                        <span className="font-medium text-slate-300 group-hover:text-slate-100 transition-colors">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (activeModule.id === "1.3") {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass-card bg-slate-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Company Culture & Expectations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-slate-300">
                            <p className="italic font-medium border-l-4 border-primary pl-4 bg-primary/5 p-3 rounded-r-lg shadow-inner">
                                "Culture is defined by what we tolerate. Here is the daily standard:"
                            </p>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="p-5 bg-slate-950/60 border border-white/5 rounded-xl shadow-inner">
                                    <h4 className="font-bold text-slate-400 mb-2">8:00 AM - 10:00 AM</h4>
                                    <p className="text-sm text-slate-500">Admin time, following up, routing your day.</p>
                                </div>
                                <div className="p-5 bg-slate-950/60 border border-white/5 rounded-xl shadow-inner">
                                    <h4 className="font-bold text-slate-400 mb-2">10:00 AM - 12:00 PM</h4>
                                    <p className="text-sm text-slate-500">Team calls and training sessions.</p>
                                </div>
                                <div className="p-5 bg-primary/10 border border-primary/30 rounded-xl relative overflow-hidden group shadow-lg">
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-[30px] rounded-full pointer-events-none" />
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-primary mb-2 text-glow">2:00 PM - 7:00 PM</h4>
                                        <p className="text-sm font-medium text-primary/90">The Golden Hours. Non-negotiable prospecting time.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-white/10 pt-8">
                                <h3 className="text-lg font-bold mb-5 text-slate-200">Weekly KPIs</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col p-4 border border-white/5 rounded-xl bg-slate-950/40 shadow-inner">
                                        <span className="text-sm font-medium text-slate-500 mb-1">Doors Knocked/Calls Made</span>
                                        <span className="font-bold text-2xl text-slate-200">100 - 150</span>
                                    </div>
                                    <div className="flex flex-col p-4 border border-white/5 rounded-xl bg-slate-950/40 shadow-inner">
                                        <span className="text-sm font-medium text-slate-500 mb-1">Appointments Set</span>
                                        <span className="font-bold text-2xl text-slate-200">10 - 15</span>
                                    </div>
                                    <div className="flex flex-col p-4 border border-white/5 rounded-xl bg-slate-950/40 shadow-inner">
                                        <span className="text-sm font-medium text-slate-500 mb-1">Sits</span>
                                        <span className="font-bold text-2xl text-slate-200">5 - 8</span>
                                    </div>
                                    <div className="flex flex-col p-4 border border-green-500/30 rounded-xl bg-green-500/10 relative overflow-hidden shadow-[0_0_20px_rgba(74,222,128,0.05)]">
                                        <div className="absolute right-0 bottom-0 top-0 w-1 bg-green-500/50 shadow-[0_0_10px_rgba(74,222,128,1)]" />
                                        <span className="text-sm font-medium text-green-500/70 mb-1">Closes (by Week 3)</span>
                                        <span className="font-bold text-2xl text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">1 - 3</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        if (activeModule.id === "1.4") {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass-card bg-slate-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Solar Industry Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 text-slate-300">
                            <p>
                                "Welcome back. Why solar? And why <em className="text-primary not-italic font-bold">now</em>? U.S. residential solar is exploding because utility bills are inflating at an average of 6-8% annually."
                            </p>
                            <p>
                                "Homeowners go solar for three reasons: Utility inflation protection, energy independence, and increasing their home value."
                            </p>

                            <div className="bg-destructive/10 p-5 rounded-xl border border-destructive/30 my-6 flex gap-4 items-start relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive shadow-[0_0_10px_rgba(239,68,68,1)]" />
                                <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                                <div>
                                    <h4 className="font-bold text-destructive-foreground tracking-wide mb-1">COMPLIANCE WARNING: THE 30% ITC</h4>
                                    <p className="text-sm text-destructive-foreground/80 leading-relaxed">
                                        It extends through 2032. It is a <strong>tax liability offset</strong>, NOT a stimulus check. If you promise a guaranteed cash return, you will be terminated.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-950/50 p-5 border border-white/5 rounded-xl text-sm text-slate-400 shadow-inner">
                                <h4 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" /> Mythbusting
                                </h4>
                                <p className="leading-relaxed">
                                    "Let's debunk some myths: 'Solar doesn't work locally because of clouds.' False, Germany leads the world in solar and has the climate of Alaska. 'It's too expensive.' False, it is zero down—a bill swap."
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        if (activeModule.id === "1.5") {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="mb-6 glass-card bg-slate-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Trainer Script: Tech Fundamentals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-slate-300">
                            <p className="leading-relaxed">
                                "Here is the simple flow you will explain to homeowners. Photons hit the panel, generating Direct Current (DC) electricity. The Inverter converts that DC to Alternating Current (AC), which is what powers the home. Excess power goes to the grid, banking net metering credits. At night, the grid supplies power back."
                            </p>
                            <p className="leading-relaxed text-slate-400">
                                "Panel efficiency is usually 16-22%. They degrade at 0.5% to 1% a year—this is factored into the savings."
                            </p>
                            <div className="p-5 bg-slate-950/60 border border-white/5 rounded-xl mt-6 shadow-inner">
                                <h4 className="font-bold mb-3 text-slate-200">What Solar Does NOT Do:</h4>
                                <ul className="list-disc pl-5 space-y-2 text-slate-400 marker:text-red-500/70">
                                    <li>It won't eliminate the connection fee entirely.</li>
                                    <li>It won't power their home in an outage without a battery.</li>
                                    <li>It won't pay them cash monthly (unless in an SREC state).</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-primary/20 relative overflow-hidden bg-slate-950/80 shadow-[0_0_30px_rgba(56,189,248,0.05)]">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70 shadow-[0_0_15px_rgba(56,189,248,1)]" />
                        <CardHeader className="pt-8">
                            <CardTitle className="text-2xl text-primary flex items-center gap-3 text-glow">
                                <CheckSquare className="w-6 h-6" />
                                Tech & Industry Literacy Quiz
                            </CardTitle>
                            <CardDescription className="text-slate-400">Target: 80% passing grade required.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg text-slate-200">1. What is the current federal ITC percentage and when does it step down/sunset (under current IRA)?</h3>
                                    <div className="space-y-3">
                                        {[
                                            "26% through 2024",
                                            "30% through 2032 (offsets liability)",
                                            "It's a flat $5,000 rebate check",
                                            "50% through 2025"
                                        ].map((opt, i) => (
                                            <label key={i} className="flex items-center space-x-4 p-4 border border-white/5 rounded-lg bg-slate-900/50 hover:bg-slate-800 hover:border-white/10 cursor-pointer transition-all">
                                                <input type="radio" name="q1" className="w-4 h-4 text-primary bg-slate-950 border-slate-700 focus:ring-primary focus:ring-offset-slate-900" />
                                                <span className="text-slate-300">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg text-slate-200">2. What is the primary difference between a string inverter and a microinverter?</h3>
                                    <div className="space-y-3">
                                        {[
                                            "String inverters act like old Christmas lights (single point of failure); microinverters optimize each panel independently.",
                                            "Microinverters only work at night.",
                                            "String inverters produce DC, microinverters produce AC.",
                                            "There is no difference."
                                        ].map((opt, i) => (
                                            <label key={i} className="flex items-center space-x-4 p-4 border border-white/5 rounded-lg bg-slate-900/50 hover:bg-slate-800 hover:border-white/10 cursor-pointer transition-all">
                                                <input type="radio" name="q2" className="w-4 h-4 text-primary bg-slate-950 border-slate-700 focus:ring-primary focus:ring-offset-slate-900" />
                                                <span className="text-slate-300">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-medium text-lg text-slate-200">3. True or False: Solar panels degrade at approximately 0.5% to 1% per year.</h3>
                                    <div className="flex gap-4">
                                        <label className="flex items-center space-x-4 p-4 border border-white/5 rounded-lg bg-slate-900/50 hover:bg-slate-800 hover:border-white/10 w-full cursor-pointer transition-all justify-center">
                                            <input type="radio" name="q3" className="w-4 h-4 text-primary bg-slate-950 border-slate-700 focus:ring-primary focus:ring-offset-slate-900" />
                                            <span className="text-slate-300 font-medium">True</span>
                                        </label>
                                        <label className="flex items-center space-x-4 p-4 border border-white/5 rounded-lg bg-slate-900/50 hover:bg-slate-800 hover:border-white/10 w-full cursor-pointer transition-all justify-center">
                                            <input type="radio" name="q3" className="w-4 h-4 text-primary bg-slate-950 border-slate-700 focus:ring-primary focus:ring-offset-slate-900" />
                                            <span className="text-slate-300 font-medium">False</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        if (activeModule.id === "1.6") {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass-card bg-slate-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Identity Shift: Consultant vs Salesperson</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 text-slate-300">
                            <div className="p-8 bg-slate-950/80 border border-white/5 rounded-xl shadow-inner text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent group-hover:via-primary transition-all duration-700" />
                                <div className="absolute inset-0 bg-primary/5 blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <p className="font-bold text-xl text-slate-200 italic relative z-10 drop-shadow-md">
                                    "I am not selling panels. I am restructuring utility spending and protecting families from inflation."
                                </p>
                            </div>

                            <p className="leading-relaxed text-slate-400">
                                "A salesperson chases commission and pushes products. A consultant diagnoses problems and prescribes solutions. You will face rejection. Top reps hear 'no' 100 times a week. 'No' means 'not right now' or 'I don't understand yet'. Do not take it personally."
                            </p>

                            <div className="bg-primary/5 border border-primary/20 p-8 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.05)]">
                                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3 text-glow">
                                    <Award className="w-6 h-6" /> The Integrity Pledge
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-start gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-lg cursor-pointer hover:bg-slate-900/60 transition-colors shadow-sm">
                                        <input type="checkbox" className="w-5 h-5 rounded mt-0.5 bg-slate-900 border-slate-600 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                                        <span className="text-slate-300 font-medium">I commit to the Golden Hours (2-7 PM).</span>
                                    </label>
                                    <label className="flex items-start gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-lg cursor-pointer hover:bg-slate-900/60 transition-colors shadow-sm">
                                        <input type="checkbox" className="w-5 h-5 rounded mt-0.5 bg-slate-900 border-slate-600 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                                        <span className="text-slate-300 font-medium">I will not promise free solar or guaranteed tax cash-returns.</span>
                                    </label>
                                    <label className="flex items-start gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-lg cursor-pointer hover:bg-slate-900/60 transition-colors shadow-sm">
                                        <input type="checkbox" className="w-5 h-5 rounded mt-0.5 bg-slate-900 border-slate-600 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                                        <span className="text-slate-300 font-medium">I will qualify aggressively using utility data.</span>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        if (activeModule.id === "1.7") {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass-card bg-slate-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Utility Bill Mastery</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-slate-300">
                            <p className="text-lg text-slate-400">
                                "The utility bill is the homeowner's pain point. It is our diagnostic tool."
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-green-950/20 border border-green-500/20 p-6 rounded-xl shadow-inner">
                                    <h4 className="font-bold mb-4 text-green-400 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                                        <CheckCircle2 className="w-5 h-5" /> Qualification Criteria
                                    </h4>
                                    <ul className="list-none space-y-3 text-slate-300 text-sm">
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-500/50 shadow-[0_0_5px_rgba(74,222,128,0.8)]" /> Monthly Usage: 600+ kWh</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-500/50 shadow-[0_0_5px_rgba(74,222,128,0.8)]" /> Monthly Bill: $100+</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-500/50 shadow-[0_0_5px_rgba(74,222,128,0.8)]" /> Seasonal consistency</li>
                                    </ul>
                                </div>
                                <div className="bg-red-950/20 border border-red-500/20 p-6 rounded-xl shadow-inner">
                                    <h4 className="font-bold mb-4 text-red-400 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]">
                                        <AlertTriangle className="w-5 h-5" /> Red Flags (Disqualifiers)
                                    </h4>
                                    <ul className="list-none space-y-3 text-slate-300 text-sm">
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50 shadow-[0_0_5px_rgba(248,113,113,0.8)]" /> Past-due balances &gt; $500 (Credit risk)</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50 shadow-[0_0_5px_rgba(248,113,113,0.8)]" /> Budget billing (Hides true usage)</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50 shadow-[0_0_5px_rgba(248,113,113,0.8)]" /> Low usage in huge home (Renting/Moving)</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500/50 shadow-[0_0_5px_rgba(248,113,113,0.8)]" /> Account holder not on title</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-12 border-t border-white/10 pt-10 relative">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-3 text-primary text-glow">
                                    <Video className="w-6 h-6" /> Interactive Drill: Bill Analysis
                                </h3>
                                <p className="mb-8 text-sm text-slate-400">Analyze the details below and make a qualification decision.</p>

                                <div className="bg-slate-950/80 border border-white/10 shadow-2xl p-8 rounded-xl text-center mb-6 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none group-hover:from-white/10 transition-colors" />
                                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-[50px] pointer-events-none" />
                                    <div className="relative z-10">
                                        <div className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-4">CONFIDENTIAL</div>
                                        <div className="font-bold text-3xl mb-3 text-slate-200 drop-shadow-md">Sample Bill A</div>
                                        <div className="text-slate-400 mb-4 text-lg">Total Monthly Usage: <strong className="text-white">850 kWh</strong></div>

                                        <div className="text-red-400 font-bold mb-8 bg-red-500/10 p-4 rounded-lg inline-block border border-red-500/20 shadow-[0_0_15px_rgba(248,113,113,0.1)]">
                                            Past Due Balance: $1,250
                                        </div>

                                        <div className="flex justify-center gap-6 mt-4">
                                            <Button variant="outline" className="h-12 border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 w-40 shadow-[0_0_15px_rgba(74,222,128,0.1)] transition-all glass-card">QUALIFY</Button>
                                            <Button variant="outline" className="h-12 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-40 shadow-[0_0_15px_rgba(248,113,113,0.1)] transition-all glass-card">DISQUALIFY</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            )
        }

        if (activeModule.id === "1.8") {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="glass-card bg-slate-900/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Day 1 Wrap-Up & Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-slate-300">
                            <p className="text-lg leading-relaxed text-slate-300">
                                "You stayed locked in today. Great work. You are administratively onboarded. You understand the tech, you can read a bill, and you know your identity is a Consultant."
                            </p>

                            <div className="bg-primary/5 border border-primary/20 p-8 rounded-xl mt-8 shadow-[0_0_20px_rgba(56,189,248,0.05)]">
                                <h3 className="font-bold text-primary mb-6 text-xl text-glow flex items-center gap-3">
                                    <ListTodo className="w-6 h-6" /> Mandatory Homework Assignments
                                </h3>
                                <ul className="space-y-5">
                                    <li className="flex gap-5 p-5 bg-slate-950/50 border border-white/5 rounded-lg hover:border-white/10 transition-colors shadow-inner">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                            <PlayCircle className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200 text-lg">1. Watch</p>
                                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">Two YouTube videos detailing real-world Net Metering explanations.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5 p-5 bg-slate-950/50 border border-white/5 rounded-lg hover:border-white/10 transition-colors shadow-inner">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                            <BookOpen className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200 text-lg">2. Read</p>
                                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">Top 5 Objections Guide (Familiarize yourself, we practice later).</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5 p-5 bg-slate-950/50 border border-white/5 rounded-lg hover:border-white/10 transition-colors shadow-inner">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                            <Video className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200 text-lg">3. Record</p>
                                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">Use your phone to record a 60-second video of yourself explaining "How Solar Works" to a theoretical 5-year-old. Assume the guise of a Consultant.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        // Generic fallback for other modules
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/20 border-dashed border-white/20">
                    <BookOpen className="w-16 h-16 text-slate-600 mb-6 drop-shadow-md" />
                    <h2 className="text-2xl font-bold mb-3 text-slate-300">{activeModule.title}</h2>
                    <p className="text-slate-500 max-w-md leading-relaxed">
                        This module contains lecture material, slides, and interactive elements designed specifically for {activeModule.title}.
                    </p>
                </Card>
            </div>
        )
    };

    return (
        <div className="min-h-screen flex flex-col pt-16 selection:bg-primary/30">
            {/* Top Navigation Bar */}
            <header className="glass-card border-b border-white/10 h-16 flex items-center px-6 justify-between shrink-0 sticky top-0 z-30 bg-background/60">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-slate-400 hover:text-white hover:bg-white/10">
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] text-glow">
                            S
                        </div>
                        <h1 className="font-bold text-lg hidden sm:block text-slate-100 placeholder:text-glow tracking-tight">Accelerator Program</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-400">Day 1 Progress</span>
                        <div className="w-32 h-2.5 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-primary text-glow">{progressPercentage}%</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Module Navigation */}
                <aside className={`${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} transition-all duration-300 shrink-0 glass-card bg-slate-950/40 border-r border-white/10 overflow-y-auto lg:translate-x-0 lg:static fixed inset-y-16 left-0 z-20`}>
                    <div className="p-6">
                        <div className="flex items-center gap-3 text-sm font-bold text-primary mb-8 uppercase tracking-wider text-glow bg-primary/5 p-3 rounded-lg border border-primary/20">
                            <Award className="w-5 h-5" />
                            Day 1: Foundation
                        </div>

                        <div className="space-y-2 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-white/10">
                            {modules.map((module, idx) => {
                                const isActive = module.id === activeModuleId;
                                return (
                                    <button
                                        key={module.id}
                                        onClick={() => setActiveModuleId(module.id)}
                                        className={`w-full text-left p-3 rounded-xl transition-all relative flex gap-4 group ${isActive
                                                ? 'bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(56,189,248,0.05)]'
                                                : 'hover:bg-white/5 border border-transparent'
                                            }`}
                                    >
                                        <div className={`relative z-10 rounded-full mt-0.5 shadow-md flex-shrink-0 border transition-all duration-300 ${isActive ? 'bg-slate-900 border-primary/50' : 'bg-slate-900 border-white/10'}`}>
                                            {renderIconWrapper(module.type, module.completed, isActive)}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Module {module.id}</span>
                                                <Badge variant="secondary" className="bg-slate-900/50 text-slate-400 text-[9px] uppercase font-bold tracking-widest rounded-full h-5 border-white/5 group-hover:bg-slate-800 transition-colors">
                                                    {module.duration}
                                                </Badge>
                                            </div>
                                            <h3 className={`font-medium text-sm leading-snug truncate transition-colors ${isActive ? 'text-primary font-bold text-glow' : 'text-slate-300 group-hover:text-white'}`}>
                                                {module.title}
                                            </h3>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none opacity-50" />

                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-100 tracking-tight">
                                    <span className="text-primary mr-2 opacity-50">Module {activeModule?.id}:</span>
                                    {activeModule?.title}
                                </h1>
                                <p className="text-slate-400 flex items-center gap-3">
                                    <Badge variant="outline" className="uppercase tracking-widest text-xs border-slate-700 text-slate-300 bg-slate-900/50 px-3 py-1">
                                        {activeModule?.type}
                                    </Badge>
                                    <span className="text-slate-600">•</span>
                                    <span className="font-medium">{activeModule?.duration}</span>
                                </p>
                            </div>

                            <Button variant="outline" className="hidden sm:flex items-center gap-2 glass-card hover:bg-white/10 border-white/10 text-slate-300 hover:text-white shadow-lg">
                                <Download className="w-4 h-4" />
                                Download PDFs
                            </Button>
                        </div>

                        {/* Module Content */}
                        {renderContent()}

                        {/* Navigation Footer */}
                        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between bg-slate-900/20 -mx-6 lg:-mx-10 px-6 lg:px-10 pb-6 rounded-b-xl">
                            <div className="flex-1 max-w-4xl mx-auto flex items-center justify-between">
                                {!activeModule?.completed && (
                                    <Button onClick={handleMarkComplete} size="lg" className="w-[280px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all font-bold tracking-wide h-12">
                                        Mark as Complete & Continue
                                    </Button>
                                )}
                                {activeModule?.completed && (
                                    <div className="flex items-center gap-3 text-green-400 font-bold h-12 bg-green-500/10 px-6 rounded-lg border border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.05)]">
                                        <CheckCircle2 className="w-6 h-6 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                        Module Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function renderIconWrapper(type: string, completed: boolean, isActive: boolean) {
    if (completed) {
        return <CheckCircle2 className="w-8 h-8 text-green-400 fill-slate-900 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]" />;
    }

    let Icon = FileText;
    let colorClass = "text-slate-500";

    if (isActive) colorClass = "text-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]";

    switch (type) {
        case 'lecture': Icon = PlayCircle; break;
        case 'checklist': Icon = ListTodo; break;
        case 'quiz': Icon = CheckSquare; break;
        case 'interactive': Icon = Video; break;
    }

    return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-primary/10 text-primary' : 'bg-transparent text-slate-500'}`}>
            <Icon className={`w-4 h-4 transition-colors ${colorClass}`} />
        </div>
    );
}
