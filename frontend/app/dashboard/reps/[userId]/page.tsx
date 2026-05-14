'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/platform/app-shell';
import { WHITE_LABEL } from '@/lib/white-label.config';
import { 
  Users, 
  TrendingUp, 
  Award, 
  History, 
  MessageSquare, 
  ChevronLeft,
  Activity,
  CheckCircle2,
  XCircle,
  FileText,
  Save,
  Loader2,
  Calendar,
  Zap,
  Target,
  RefreshCw
} from 'lucide-react';
import { StatCard, WidgetCard, SectionEyebrow, ProgressCard, NotificationPill } from '@/components/platform/dashboard-widgets';
import { CoachingSignalsPanel, CoachingSignal } from '@/components/platform/coaching-signals-panel';
import { ActivityTimeline, ActivityEvent } from '@/components/platform/activity-timeline';
import { useLanguage } from '@/context/language-context';

interface Simulation {
  simulation_id: string;
  scenario_name: string;
  score: number;
  passed: boolean;
  created_at: string;
  transcript_available: boolean;
  feedback_available: boolean;
  transcript: any[];
  feedback: any;
}

interface RepPerformance {
  total_score: number;
  current_streak: number;
  highest_streak: number;
  level: number;
  level_progress: number;
  xp_to_next_level: number;
  curriculum_completion_percent: number;
  lives: number;
  simulations_completed: number;
  average_score: number;
  last_active: string;
  last_synced_at: string;
}

interface RepProfile {
  profile: {
    user_id: string;
    name: string;
    email: string;
    role: string;
    company_id: string;
  };
  performance: RepPerformance;
  coaching_signals: CoachingSignal[];
  activity_log: ActivityEvent[];
  simulation_history: Simulation[];
  ai_feedback_summary: {
    strengths: string[];
    weaknesses: string[];
    recommended_next_steps: string[];
  };
  coaching_notes: any[];
}

export default function RepCoachingPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const { t } = useLanguage();
  
  const [data, setData] = useState<RepProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [selectedSim, setSelectedSim] = useState<Simulation | null>(null);

  useEffect(() => {
    fetchRepData();
  }, [userId]);

  const fetchRepData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/v1/reps/${userId}/coaching-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        if (res.status === 403) throw new Error(t("err_forbidden", { en: "You don't have permission to view this profile.", es: "No tienes permiso para ver este perfil." }));
        if (res.status === 404) throw new Error(t("err_not_found", { en: "Rep not found.", es: "Representante no encontrado." }));
        throw new Error(t("err_generic", { en: "Failed to load rep data.", es: "Error al cargar los datos del representante." }));
      }
      
      const json = await res.json();
      setData(json);
      if (json.simulation_history.length > 0) {
        setSelectedSim(json.simulation_history[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/v1/reps/${userId}/coaching-notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newNote })
      });
      
      if (res.ok) {
        setNewNote('');
        fetchRepData(); // Refresh to show new note
      }
    } catch (err) {
      console.error("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <AppShell 
        heading={t("syncing", { en: "Syncing...", es: "Sincronizando..." })} 
        subheading={t("retrieving_metrics", { en: "Retrieving performance metrics", es: "Recuperando métricas de rendimiento" })}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AppShell>
    );
  }

  if (error || !data) {
    return (
      <AppShell heading="Error" subheading={t("access_denied", { en: "Unable to access rep profile", es: "No se puede acceder al perfil del representante" })}>
        <div className="max-w-4xl mx-auto p-8 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">{t("access_denied_title", { en: "Access Denied", es: "Acceso Denegado" })}</h1>
            <p className="text-slate-400 mb-6">{error || "Something went wrong."}</p>
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> {t("go_back", { en: "Go Back", es: "Regresar" })}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

    const { 
    profile, 
    performance, 
    coaching_signals, 
    activity_log, 
    simulation_history, 
    coaching_notes 
  } = data;

  return (
    <AppShell 
        heading={t("rep_coaching", { en: "Rep Coaching", es: "Coaching de Rep" })} 
        subheading={t("rep_coaching_sub", { en: "Performance analysis and session review", es: "Análisis de rendimiento y revisión de sesiones" })}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                  {profile.name}
                </h1>
                <NotificationPill 
                  label={profile.role === 'sales_rep' ? (t("solar_rep", { en: `${WHITE_LABEL.industry} Rep`, es: `Vendedor de ${WHITE_LABEL.industry}` })) : profile.role} 
                  tone={profile.role === 'manager' ? 'lime' : 'cyan'} 
                />
              </div>
              <p className="text-[#64748B] font-hud text-xs uppercase tracking-widest mt-1">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="font-hud text-[10px] text-[#64748B] uppercase tracking-[0.2em]">
                    {t("last_active", { en: "Last Active", es: "Última Actividad" })}
                </p>
                <p className="text-white font-bold">{new Date(performance.last_active).toLocaleDateString()} {new Date(performance.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             </div>
             <div className="h-10 w-px bg-white/10" />
             <div className="text-right">
                <p className="font-hud text-[10px] text-[#64748B] uppercase tracking-[0.2em]">
                    {t("sync_status", { en: "Sync Status", es: "Estado Sinc" })}
                </p>
                <div className="flex items-center gap-2 justify-end">
                   <span className="h-1.5 w-1.5 rounded-full bg-green-500 brand-glow" />
                   <p className="text-white font-bold uppercase text-[10px] tracking-widest">
                       {t("status_live", { en: "Live", es: "Vivo" })}
                   </p>
                </div>
             </div>
             <button 
                onClick={fetchRepData}
                className="p-2 h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#64748B] hover:text-[#FF5722] hover:border-[#FF5722]/50 transition-all"
                title={t("force_refresh", { en: "Force Refresh", es: "Forzar Actualización" })}
             >
                <RefreshCw className="h-4 w-4" />
             </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard 
            label={t("curriculum_progress", { en: "Curriculum Progress", es: "Progreso Curricular" })} 
            value={`${performance.curriculum_completion_percent}%`}
            progress={performance.curriculum_completion_percent}
            detail={t("overall_completion", { en: "Overall Completion", es: "Completado Total" })}
          />
          <StatCard 
            label={t("training_level", { en: "Training Level", es: "Nivel de Capacitación" })} 
            value={`${t("level", { en: "Level", es: "Nivel" })} ${performance.level}`} 
            change={t("xp_to_go", { en: `${performance.xp_to_next_level} XP to go`, es: `${performance.xp_to_next_level} XP faltantes` })}
            icon={Zap} 
            accent="lime"
          />
          <StatCard 
            label={t("current_streak", { en: "Current Streak", es: "Racha Actual" })} 
            value={`${performance.current_streak} ${t("days", { en: "Days", es: "Días" })}`} 
            change={`${t("high", { en: "High", es: "Máx" })}: ${performance.highest_streak}`}
            icon={Activity} 
          />
          <StatCard 
            label={t("total_xp", { en: "Total XP", es: "XP Total" })} 
            value={performance.total_score.toLocaleString()} 
            change={t("lifetime_achievement", { en: "Lifetime Achievement", es: "Logro de Vida" })}
            icon={Award} 
            accent="lime"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: History & Notes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Simulation History */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" /> {t("sim_history", { en: "Simulation History", es: "Historial de Simulación" })}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
                      <th className="px-6 py-3 font-medium">{t("scenario", { en: "Scenario", es: "Escenario" })}</th>
                      <th className="px-6 py-3 font-medium">{t("date", { en: "Date", es: "Fecha" })}</th>
                      <th className="px-6 py-3 font-medium text-center">{t("score", { en: "Score", es: "Puntuación" })}</th>
                      <th className="px-6 py-3 font-medium text-center">{t("status", { en: "Status", es: "Estado" })}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {simulation_history.length > 0 ? simulation_history.map((sim) => (
                      <tr 
                        key={sim.simulation_id}
                        onClick={() => setSelectedSim(sim)}
                        className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedSim?.simulation_id === sim.simulation_id ? 'bg-blue-500/5' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{sim.scenario_name}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">
                          {new Date(sim.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-bold ${sim.score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {sim.score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {sim.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          {t("no_simulations", { en: "No simulations recorded yet.", es: "No hay simulaciones registradas aún." })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transcript & Feedback Panel (Mobile/Tablet visible if selected) */}
            {selectedSim && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" /> {t("session_review", { en: "Session Review", es: "Revisión de Sesión" })}: {selectedSim.scenario_name}
                  </h2>
                  <span className="text-xs text-slate-400">
                    {new Date(selectedSim.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Transcript */}
                  <div className="p-6 border-b md:border-b-0 md:border-r border-slate-800 max-h-[500px] overflow-y-auto">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> {t("transcript", { en: "Transcript", es: "Transcripción" })}
                    </h3>
                    <div className="space-y-4">
                      {selectedSim.transcript.map((msg, idx) => (
                        <div key={idx} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500/10 ml-4 border-l-2 border-blue-500' : 'bg-slate-800 mr-4 border-l-2 border-slate-500'}`}>
                          <p className="text-xs text-slate-500 mb-1 font-bold">
                              {msg.role === 'user' ? t("rep_label", { en: 'REP', es: 'REPRESENTANTE' }) : t("coach_label", { en: 'AI COACH', es: 'COACH IA' })}
                          </p>
                          <p className="text-slate-200 text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Feedback */}
                  <div className="p-6 max-h-[500px] overflow-y-auto bg-slate-800/10">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" /> {t("ai_feedback", { en: "AI Feedback", es: "Feedback de IA" })}
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-bold text-green-400 uppercase mb-2">{t("strengths", { en: "Strengths", es: "Fortalezas" })}</p>
                        <ul className="space-y-1">
                          {selectedSim.feedback.pros?.map((p: string, idx: number) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-400 uppercase mb-2">{t("areas_improvement", { en: "Areas for Improvement", es: "Áreas de Mejora" })}</p>
                        <ul className="space-y-1">
                          {selectedSim.feedback.cons?.map((c: string, idx: number) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                        <p className="text-xs font-bold text-purple-400 uppercase mb-2">{t("ai_critique", { en: "AI Critique", es: "Crítica de IA" })}</p>
                        <p className="text-sm text-slate-300 italic">"{selectedSim.feedback.critique}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Summary & Coaching Notes */}
          <div className="space-y-8">
            {/* Coaching Intelligence */}
            <CoachingSignalsPanel signals={coaching_signals} />

            {/* Activity Timeline */}
            <ActivityTimeline events={activity_log} />

            {/* Manager Notes */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 bg-slate-800/30">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" /> {t("manager_notes", { en: "Manager Notes", es: "Notas del Gerente" })}
                </h2>
              </div>
              <div className="p-4 space-y-4 flex-grow overflow-y-auto max-h-[300px]">
                {coaching_notes.length > 0 ? coaching_notes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-slate-300 text-sm mb-2">{note.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-400 font-bold uppercase">{note.manager_name}</span>
                      <span className="text-[10px] text-slate-500">{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    {t("no_notes", { en: "No notes yet. Add your first coaching note below.", es: "No hay notas aún. Agrega tu primera nota de coaching abajo." })}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-800/20">
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={t("note_placeholder", { en: "Add a coaching observation...", es: "Agrega una observación de coaching..." })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none mb-3"
                  rows={3}
                />
                <button 
                  onClick={handleAddNote}
                  disabled={savingNote || !newNote.trim()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t("save_note", { en: "Save Coaching Note", es: "Guardar Nota de Coaching" })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
