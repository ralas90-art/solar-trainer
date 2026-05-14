/**
 * PLATFORM GAMIFICATION CORE
 * 
 * This file is the single source of truth for XP, Leveling, and Streak logic.
 * It is used across /my-training, /dashboard, /analytics, and /leaderboards.
 */

export interface XpAward {
  id: string; // unique award ID to prevent duplicates
  amount: number;
  reason: string;
  timestamp: string;
}

export interface UserGamification {
  totalXp: number;
  currentStreak: number;
  lastStreakDate: string | null;
  totalTrainingDays: number; // Renamed from "unique days"
  xpAwards: Record<string, boolean>; // Registry of unique awards already given
  activityLog: Array<{
    type: string;
    timestamp: string;
    data?: any;
  }>;
}

// XP REWARD DEFINITIONS
export const XP_REWARDS = {
  LESSON_COMPLETED: 50,
  QUIZ_COMPLETED: 75,
  SIMULATION_COMPLETED: 100,
  PERFECT_QUIZ_BONUS: 25,
} as const;

// LEVEL THRESHOLDS (Dynamic)
// Level 1: 0 - 199
// Level 2: 200 - 499
// Level 3: 500 - 999
// Level 4: 1000 - 1999
// Level 5+: Scales by 1500 XP per level
export const calculateLevel = (totalXp: number) => {
  if (totalXp < 200) return 1;
  if (totalXp < 500) return 2;
  if (totalXp < 1000) return 3;
  if (totalXp < 2000) return 4;
  
  // Level 5+ calculation
  const baseL5Xp = 2000;
  const stepPerLevel = 1500;
  return 5 + Math.floor((totalXp - baseL5Xp) / stepPerLevel);
};

export const getLevelProgress = (totalXp: number) => {
  let minXp = 0;
  let maxXp = 200;

  if (totalXp < 200) {
    minXp = 0;
    maxXp = 200;
  } else if (totalXp < 500) {
    minXp = 200;
    maxXp = 500;
  } else if (totalXp < 1000) {
    minXp = 500;
    maxXp = 1000;
  } else if (totalXp < 2000) {
    minXp = 1000;
    maxXp = 2000;
  } else {
    const level = calculateLevel(totalXp);
    minXp = 2000 + (level - 5) * 1500;
    maxXp = minXp + 1500;
  }

  const progress = ((totalXp - minXp) / (maxXp - minXp)) * 100;
  return Math.min(100, Math.max(0, progress));
};

export const getXpToNextLevel = (totalXp: number) => {
  if (totalXp < 200) return 200 - totalXp;
  if (totalXp < 500) return 500 - totalXp;
  if (totalXp < 1000) return 1000 - totalXp;
  if (totalXp < 2000) return 2000 - totalXp;
  
  const level = calculateLevel(totalXp);
  const nextLevelXp = 2000 + (level - 4) * 1500;
  return nextLevelXp - totalXp;
};

/**
 * Validates if an activity is "meaningful" for streak calculation
 */
export const isMeaningfulActivity = (type: string) => {
  const meaningfulTypes = [
    'module_completed',
    'quiz_completed',
    'simulation_completed',
    'roleplay_completed'
  ];
  return meaningfulTypes.includes(type);
};

export interface LevelInfo {
  level: number;
  currentXpInLevel: number;
  targetXpForNextLevel: number;
  totalXp: number;
  progress: number;
}

export const getLevelInfo = (totalXp: number): LevelInfo => {
  const level = calculateLevel(totalXp);
  const progress = getLevelProgress(totalXp);
  
  let minXp = 0;
  let maxXp = 200;

  if (totalXp < 200) {
    minXp = 0;
    maxXp = 200;
  } else if (totalXp < 500) {
    minXp = 200;
    maxXp = 500;
  } else if (totalXp < 1000) {
    minXp = 500;
    maxXp = 1000;
  } else if (totalXp < 2000) {
    minXp = 1000;
    maxXp = 2000;
  } else {
    minXp = 2000 + (level - 5) * 1500;
    maxXp = minXp + 1500;
  }

  return {
    level,
    currentXpInLevel: totalXp - minXp,
    targetXpForNextLevel: maxXp - minXp,
    totalXp,
    progress
  };
};

export const getMotivationalMessage = (level: number, progress: number, locale: string = 'en') => {
  const messages = {
    en: [
      `Keep pushing, you're becoming a ${WHITE_LABEL.industry.toLowerCase()} master!`,
      "Great progress! Next level is just around the corner.",
      "Consistency is key. You're on a roll!",
      "New skills unlocked! Keep dominating the curriculum.",
      `${WHITE_LABEL.industry} expertise rising. Level up soon!`
    ],
    es: [
      `¡Sigue adelante, te estás convirtiendo en un maestro de ${WHITE_LABEL.industry.toLowerCase()}!`,
      "¡Gran progreso! El siguiente nivel está a la vuelta de la esquina.",
      "La consistencia es clave. ¡Vas por buen camino!",
      "¡Nuevas habilidades desbloqueadas! Sigue dominando el currículo.",
      `Tu experiencia en ${WHITE_LABEL.industry.toLowerCase()} está creciendo. ¡Sube de nivel pronto!`
    ]
  };
  
  const langMessages = messages[locale as keyof typeof messages] || messages.en;
  const index = (level + Math.floor(progress / 20)) % langMessages.length;
  return langMessages[index];
};

import { WHITE_LABEL } from "./white-label.config";

const GAMIFICATION_KEY = `${WHITE_LABEL.companyName.toLowerCase().replace(/\s+/g, '_')}_user_gamification`;

export function loadUserGamification(): UserGamification {
  const fallback: UserGamification = { 
    totalXp: 0, 
    currentStreak: 0, 
    lastStreakDate: null, 
    totalTrainingDays: 0,
    xpAwards: {}, 
    activityLog: [] 
  };
  
  if (typeof window === "undefined") return fallback;
  
  const raw = window.localStorage.getItem(GAMIFICATION_KEY);
  if (!raw) return fallback;
  
  try {
    const data = JSON.parse(raw);
    // Migration: Handle old xpAwards array format if it exists
    if (Array.isArray(data.xpAwards)) {
      const registry: Record<string, boolean> = {};
      data.xpAwards.forEach((id: string) => registry[id] = true);
      data.xpAwards = registry;
    }
    return { ...fallback, ...data };
  } catch {
    return fallback;
  }
}

export function saveUserGamification(data: UserGamification) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
}

/**
 * Awards XP for a specific action if not already awarded.
 */
export function awardXp(awardId: string, amount: number): number {
  const g = loadUserGamification();
  if (g.xpAwards[awardId]) return g.totalXp;

  g.totalXp += amount;
  g.xpAwards[awardId] = true;
  saveUserGamification(g);
  return g.totalXp;
}

/**
 * Updates streak based on daily meaningful activity.
 */
export function checkStreak() {
  const g = loadUserGamification();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  if (g.lastStreakDate === today) return; // Already updated today

  const lastDateStr = g.lastStreakDate;
  
  if (lastDateStr) {
    const lastDate = new Date(lastDateStr);
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      g.currentStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      g.currentStreak = 1;
    }
  } else {
    // First ever streak action
    g.currentStreak = 1;
  }

  g.lastStreakDate = today;
  g.totalTrainingDays = (g.totalTrainingDays || 0) + 1;
  saveUserGamification(g);
}
