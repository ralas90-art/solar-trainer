/**
 * Central structured catalog mapping all 58 training modules (mod_1_1 to mod_7_9)
 * to their pre-rendered audio narration assets, voice configurations, and a 
 * selective regeneration queue for script/voice updates.
 */

export type VoiceDefinition = {
  id: string
  name: string
  accent: string
  description: string
}

export type AudioSegmentInventory = {
  id: string // e.g. "mod_1_1_intro"
  title: string
  fileUrl: string
  hasStaticAsset: boolean
  lastSyncedAt?: string
  voiceName?: string
  voiceId?: string
  model?: string
  needsRegeneration?: boolean
  status?: string
  notes?: string
}

export type ModuleAudioInventory = {
  moduleId: string
  defaultVoiceId: string
  segments: AudioSegmentInventory[]
}

export type QueuedRegeneration = {
  moduleId: string
  sectionId: string // e.g. "intro", "segment_1", "transition"
  voiceId: string
  reason: string
  status: "pending" | "processing" | "completed" | "failed"
  priority: "high" | "medium" | "low"
}

// Tom — American, Confident & Persuasive Trainer (matches backend DEFAULT_VOICE_ID)
export const DEFAULT_VOICE_ID = "QO7Mfy7rwYLdxzo4Q3iD"

export const AVAILABLE_VOICES: Record<string, VoiceDefinition> = {
  tom: {
    id: "QO7Mfy7rwYLdxzo4Q3iD",
    name: "Tom (Default)",
    accent: "US Professional",
    description: "Confident, mature sales trainer and coach.",
  },
  rachel: {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    accent: "US Energetic",
    description: "High-energy, supportive training specialist.",
  },
  dom: {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Dom",
    accent: "US Senior Executive",
    description: "Authoritative, seasoned closer and strategist.",
  },
}

/**
 * Auto-generated scaffolding mapping for all 58 curriculum modules.
 * These segments correspond to physical audio files located in public/audio/modules/<moduleId>/
 */
export const MODULE_AUDIO_CATALOG: Record<string, ModuleAudioInventory> = {
  // --- Day 1 (8 Modules) ---
  mod_1_1: {
    moduleId: "mod_1_1",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_1_1_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_1/mod_1_1_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_1_segment_1", title: "Identity and Mindset", fileUrl: "/audio/modules/mod_1_1/mod_1_1_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_1_segment_2", title: "Role Definitions", fileUrl: "/audio/modules/mod_1_1/mod_1_1_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_1_segment_3", title: "Daily Rhythms", fileUrl: "/audio/modules/mod_1_1/mod_1_1_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_1_segment_4", title: "Goal Settings", fileUrl: "/audio/modules/mod_1_1/mod_1_1_segment_4.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_1_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_1_1/mod_1_1_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_1_2: {
    moduleId: "mod_1_2",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_1_2_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_2/mod_1_2_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_2_segment_1", title: "The SeptiVolt Value Prop", fileUrl: "/audio/modules/mod_1_2/mod_1_2_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_2_segment_2", title: "Tools & Systems Setup", fileUrl: "/audio/modules/mod_1_2/mod_1_2_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_2_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_1_2/mod_1_2_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_1_3: {
    moduleId: "mod_1_3",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_1_3_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_3/mod_1_3_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_3_segment_1", title: "Door-to-Door Mindset", fileUrl: "/audio/modules/mod_1_3/mod_1_3_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_3_segment_2", title: "Weekly KPIs", fileUrl: "/audio/modules/mod_1_3/mod_1_3_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_3_segment_3", title: "Manager Support Structure", fileUrl: "/audio/modules/mod_1_3/mod_1_3_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_3_segment_4", title: "Compensation Deep Dive", fileUrl: "/audio/modules/mod_1_3/mod_1_3_segment_4.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_3_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_1_3/mod_1_3_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_1_4: {
    moduleId: "mod_1_4",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_1_4_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_4/mod_1_4_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_4_segment_1", title: "Setting Boundaries", fileUrl: "/audio/modules/mod_1_4/mod_1_4_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_4_segment_2", title: "The Federal Tax Credit", fileUrl: "/audio/modules/mod_1_4/mod_1_4_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_4_segment_3", title: "Common Solar Myths", fileUrl: "/audio/modules/mod_1_4/mod_1_4_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_4_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_1_4/mod_1_4_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_1_5: {
    moduleId: "mod_1_5",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_1_5_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_5/mod_1_5_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_5_segment_1", title: "Product Technicals", fileUrl: "/audio/modules/mod_1_5/mod_1_5_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_5_segment_2", title: "System Components", fileUrl: "/audio/modules/mod_1_5/mod_1_5_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_5_segment_3", title: "Warranties You Must Know", fileUrl: "/audio/modules/mod_1_5/mod_1_5_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_5_segment_4", title: "What Solar Does NOT Do", fileUrl: "/audio/modules/mod_1_5/mod_1_5_segment_4.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_5_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_1_5/mod_1_5_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_1_6: {
    moduleId: "mod_1_6",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_1_6_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_6/mod_1_6_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_6_segment_1", title: "Local Market Fit", fileUrl: "/audio/modules/mod_1_6/mod_1_6_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_6_segment_2", title: "The Integrity Creed", fileUrl: "/audio/modules/mod_1_6/mod_1_6_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_6_segment_3", title: "Reframing Rejection", fileUrl: "/audio/modules/mod_1_6/mod_1_6_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_6_segment_4", title: "Energy Management", fileUrl: "/audio/modules/mod_1_6/mod_1_6_segment_4.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_6_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_1_6/mod_1_6_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_1_7: {
    moduleId: "mod_1_7",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_1_7_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_7/mod_1_7_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_7_segment_1", title: "Platform Compliance", fileUrl: "/audio/modules/mod_1_7/mod_1_7_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_7_segment_2", title: "Qualification Thresholds", fileUrl: "/audio/modules/mod_1_7/mod_1_7_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_7_segment_3", title: "Red Flags on a Bill", fileUrl: "/audio/modules/mod_1_7/mod_1_7_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_7_segment_4", title: "Understanding Offset Percentage", fileUrl: "/audio/modules/mod_1_7/mod_1_7_segment_4.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_7_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_1_7/mod_1_7_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_1_8: {
    moduleId: "mod_1_8",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_1_8_intro", title: "Introduction", fileUrl: "/audio/modules/mod_1_8/mod_1_8_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_8_segment_1", title: "Curriculum Graduation", fileUrl: "/audio/modules/mod_1_8/mod_1_8_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_1_8_segment_2", title: "Tonight's Homework", fileUrl: "/audio/modules/mod_1_8/mod_1_8_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_8_segment_3", title: "Tomorrow's Preview", fileUrl: "/audio/modules/mod_1_8/mod_1_8_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_1_8_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_1_8/mod_1_8_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },

  // --- Day 2 (11 Modules) ---
  mod_2_1: {
    moduleId: "mod_2_1",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_1_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_1/mod_2_1_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_1_segment_1", title: "Sales Telemetry", fileUrl: "/audio/modules/mod_2_1/mod_2_1_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_1_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_1/mod_2_1_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_1_segment_3", title: "Segment", fileUrl: "/audio/modules/mod_2_1/mod_2_1_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_1_segment_4", title: "Segment", fileUrl: "/audio/modules/mod_2_1/mod_2_1_segment_4.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_1_segment_5", title: "Segment", fileUrl: "/audio/modules/mod_2_1/mod_2_1_segment_5.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_1_segment_6", title: "Segment", fileUrl: "/audio/modules/mod_2_1/mod_2_1_segment_6.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_1_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_1/mod_2_1_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_2: {
    moduleId: "mod_2_2",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_2_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_2/mod_2_2_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_2_segment_1", title: "First 10 Seconds", fileUrl: "/audio/modules/mod_2_2/mod_2_2_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_2_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_2/mod_2_2_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_2_segment_3", title: "Segment", fileUrl: "/audio/modules/mod_2_2/mod_2_2_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_2_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_2/mod_2_2_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_3: {
    moduleId: "mod_2_3",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_3_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_3/mod_2_3_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_3_segment_1", title: "Door-to-Door Rapport", fileUrl: "/audio/modules/mod_2_3/mod_2_3_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_3_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_3/mod_2_3_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_3_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_3/mod_2_3_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_4: {
    moduleId: "mod_2_4",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_4_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_4/mod_2_4_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_4_segment_1", title: "Discovery Blueprint", fileUrl: "/audio/modules/mod_2_4/mod_2_4_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_4_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_4/mod_2_4_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_4_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_4/mod_2_4_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_5: {
    moduleId: "mod_2_5",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_5_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_5/mod_2_5_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_5_segment_1", title: "Balk Handling", fileUrl: "/audio/modules/mod_2_5/mod_2_5_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_5_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_5/mod_2_5_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_5_segment_3", title: "Segment", fileUrl: "/audio/modules/mod_2_5/mod_2_5_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_5_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_5/mod_2_5_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_6: {
    moduleId: "mod_2_6",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_6_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_6/mod_2_6_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_6_segment_1", title: "Transition to Pitch", fileUrl: "/audio/modules/mod_2_6/mod_2_6_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_6_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_6/mod_2_6_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_6_segment_3", title: "Segment", fileUrl: "/audio/modules/mod_2_6/mod_2_6_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_6_segment_4", title: "Segment", fileUrl: "/audio/modules/mod_2_6/mod_2_6_segment_4.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_6_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_6/mod_2_6_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_7: {
    moduleId: "mod_2_7",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_7_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_7/mod_2_7_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_7_segment_1", title: "Calendar Booking", fileUrl: "/audio/modules/mod_2_7/mod_2_7_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_7_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_7/mod_2_7_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_7_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_7/mod_2_7_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_8: {
    moduleId: "mod_2_8",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_8_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_8/mod_2_8_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_8_segment_1", title: "Utility Bill Collection", fileUrl: "/audio/modules/mod_2_8/mod_2_8_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_8_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_8/mod_2_8_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_8_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_8/mod_2_8_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_9: {
    moduleId: "mod_2_9",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_9_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_9/mod_2_9_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_9_segment_1", title: "Hand-off Protocols", fileUrl: "/audio/modules/mod_2_9/mod_2_9_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_9_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_2_9/mod_2_9_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_2_9_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_9/mod_2_9_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_10: {
    moduleId: "mod_2_10",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_10_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_10/mod_2_10_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_10_segment_1", title: "CRM Telemetry Settings", fileUrl: "/audio/modules/mod_2_10/mod_2_10_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_10_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_10/mod_2_10_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_2_11: {
    moduleId: "mod_2_11",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_2_11_intro", title: "Introduction", fileUrl: "/audio/modules/mod_2_11/mod_2_11_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_11_segment_1", title: "High-Volume Canvassing", fileUrl: "/audio/modules/mod_2_11/mod_2_11_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_2_11_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_2_11/mod_2_11_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },

  // --- Day 3 (10 Modules) ---
  mod_3_1: {
    moduleId: "mod_3_1",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_1_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_1/mod_3_1_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_1_segment_1", title: "Virtual Presentations", fileUrl: "/audio/modules/mod_3_1/mod_3_1_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_1_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_3_1/mod_3_1_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_1_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_1/mod_3_1_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_2: {
    moduleId: "mod_3_2",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_2_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_2/mod_3_2_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_2_segment_1", title: "Bilingual Presentation Design", fileUrl: "/audio/modules/mod_3_2/mod_3_2_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_2_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_3_2/mod_3_2_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_2_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_2/mod_3_2_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_3: {
    moduleId: "mod_3_3",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_3_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_3/mod_3_3_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_3_segment_1", title: "Pre-call Prep", fileUrl: "/audio/modules/mod_3_3/mod_3_3_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_3_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_3_3/mod_3_3_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_3_segment_3", title: "Segment", fileUrl: "/audio/modules/mod_3_3/mod_3_3_segment_3.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_3_segment_4", title: "Segment", fileUrl: "/audio/modules/mod_3_3/mod_3_3_segment_4.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_3_segment_5", title: "Segment", fileUrl: "/audio/modules/mod_3_3/mod_3_3_segment_5.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_3_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_3/mod_3_3_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_4: {
    moduleId: "mod_3_4",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_4_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_4/mod_3_4_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_4_segment_1", title: "Rapport in Pitch", fileUrl: "/audio/modules/mod_3_4/mod_3_4_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_4_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_3_4/mod_3_4_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_4_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_4/mod_3_4_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_5: {
    moduleId: "mod_3_5",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_5_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_5/mod_3_5_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_5_segment_1", title: "Discovery Mastery", fileUrl: "/audio/modules/mod_3_5/mod_3_5_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_5_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_3_5/mod_3_5_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_5_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_5/mod_3_5_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_6: {
    moduleId: "mod_3_6",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_6_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_6/mod_3_6_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_6_segment_1", title: "Storytelling Frameworks", fileUrl: "/audio/modules/mod_3_6/mod_3_6_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_6_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_3_6/mod_3_6_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_6_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_6/mod_3_6_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_7: {
    moduleId: "mod_3_7",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_7_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_7/mod_3_7_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_7_segment_1", title: "Overcoming Reluctance", fileUrl: "/audio/modules/mod_3_7/mod_3_7_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_7_segment_2", title: "Segment", fileUrl: "/audio/modules/mod_3_7/mod_3_7_segment_2.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom" },
      { id: "mod_3_7_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_7/mod_3_7_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_8: {
    moduleId: "mod_3_8",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_8_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_8/mod_3_8_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_8_segment_1", title: "Virtual Closes", fileUrl: "/audio/modules/mod_3_8/mod_3_8_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_8_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_8/mod_3_8_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_9: {
    moduleId: "mod_3_9",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_9_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_9/mod_3_9_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_9_segment_1", title: "Post-Close Friction", fileUrl: "/audio/modules/mod_3_9/mod_3_9_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_9_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_9/mod_3_9_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },
  mod_3_10: {
    moduleId: "mod_3_10",
    defaultVoiceId: DEFAULT_VOICE_ID,
    segments: [
      { id: "mod_3_10_intro", title: "Introduction", fileUrl: "/audio/modules/mod_3_10/mod_3_10_intro.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_10_segment_1", title: "Platform Booking Settings", fileUrl: "/audio/modules/mod_3_10/mod_3_10_segment_1.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
      { id: "mod_3_10_transition", title: "Transition to Simulator", fileUrl: "/audio/modules/mod_3_10/mod_3_10_transition.mp3", hasStaticAsset: true, voiceName: "Tom", voiceId: "QO7Mfy7rwYLdxzo4Q3iD", model: "eleven_v3", needsRegeneration: false, status: "keep", notes: "regenerated from Rachel to Tom"  },
    ]
  },

  // Fallback scaffolding definitions for remaining modules (mod_4_1 to mod_7_9)
  // initialized with Tom as default voice ID
}

// Populate the remaining Day 4 to Day 7 items dynamically for clean indexing
const remainingModuleGroups = [
  { prefix: "mod_4_", count: 7 },
  { prefix: "mod_5_", count: 6 },
  { prefix: "mod_6_", count: 7 },
  { prefix: "mod_7_", count: 9 },
]

for (const group of remainingModuleGroups) {
  for (let i = 1; i <= group.count; i++) {
    const moduleId = `${group.prefix}${i}`
    if (!MODULE_AUDIO_CATALOG[moduleId]) {
      MODULE_AUDIO_CATALOG[moduleId] = {
        moduleId,
        defaultVoiceId: DEFAULT_VOICE_ID,
        segments: [
          { id: `${moduleId}_intro`, title: "Introduction", fileUrl: `/audio/modules/${moduleId}/${moduleId}_intro.mp3`, hasStaticAsset: true },
          { id: `${moduleId}_segment_1`, title: "Core Strategy", fileUrl: `/audio/modules/${moduleId}/${moduleId}_segment_1.mp3`, hasStaticAsset: true },
          { id: `${moduleId}_transition`, title: "Transition to Simulator", fileUrl: `/audio/modules/${moduleId}/${moduleId}_transition.mp3`, hasStaticAsset: true },
        ]
      }
    }
  }
}

/**
 * Structured Audio Narration Selective Regeneration Queue
 * Tracks mismatch voice configurations or English script updates that need ElevenLabs regeneration.
 */
export const AUDIO_REGENERATION_QUEUE: QueuedRegeneration[] = [
  {
    moduleId: "mod_1_1",
    sectionId: "intro",
    voiceId: AVAILABLE_VOICES.tom.id,
    reason: "Intro script updated to match localized Spanish layout greetings",
    status: "pending",
    priority: "medium",
  },
  {
    moduleId: "mod_2_3",
    sectionId: "segment_1",
    voiceId: AVAILABLE_VOICES.tom.id,
    reason: "Updated objection threshold response tone to sound more authoritative",
    status: "pending",
    priority: "high",
  },
  {
    moduleId: "mod_3_2",
    sectionId: "segment_1",
    voiceId: AVAILABLE_VOICES.dom.id,
    reason: "Requires executive closing pitch voice alignment",
    status: "pending",
    priority: "medium",
  },
  {
    moduleId: "mod_5_4",
    sectionId: "transition",
    voiceId: AVAILABLE_VOICES.tom.id,
    reason: "Telemetry parameters script change alignment",
    status: "pending",
    priority: "low",
  }
]

/**
 * Resolves a module's audio assets inventory if mapped.
 */
export function getModuleAudioInventory(moduleId: string): ModuleAudioInventory | null {
  return MODULE_AUDIO_CATALOG[moduleId] ?? null
}

/**
 * Checks if a specific segment is queued for real-time ElevenLabs selective regeneration.
 */
export function getQueuedRegeneration(moduleId: string, sectionId: string): QueuedRegeneration | null {
  return AUDIO_REGENERATION_QUEUE.find(
    (q) => q.moduleId === moduleId && q.sectionId === sectionId
  ) ?? null
}
