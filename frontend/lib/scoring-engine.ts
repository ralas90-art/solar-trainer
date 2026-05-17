/**
 * SeptiVolt Scoring Intelligence Engine
 * 
 * Logic for:
 * - Weighted Track Scoring
 * - Maturity Classification
 * - Weakness Detection
 * - Confidence Calculation
 */

export type TrackId = 'individual' | 'team' | 'bilingual' | 'enterprise';

export interface ScoringResult {
  winningTrack: TrackId;
  normalizedScore: number;
  confidenceScore: number;
  maturity: string;
  weaknesses: string[];
  insights: string[];
  allScores: Record<TrackId, number>;
}

export const MATURITY_LEVELS = {
  BEGINNER: "BEGINNER",
  DEVELOPING: "DEVELOPING",
  SCALING: "SCALING",
  ENTERPRISE: "ENTERPRISE",
  BILINGUAL: "BILINGUAL"
};

/**
 * Calculate the full intelligence profile based on funnel answers.
 */
export function calculateIntelligence(
  answers: Record<string, string>, 
  questions: any[]
): ScoringResult {
  const scores: Record<TrackId, number> = {
    individual: 0,
    team: 0,
    bilingual: 0,
    enterprise: 0
  };

  // 1. Calculate Weighted Raw Scores
  Object.entries(answers).forEach(([qId, optId]) => {
    const question = questions.find(q => q.id === qId);
    const option = question?.options.find((o: any) => o.id === optId);
    if (option?.weights) {
      Object.entries(option.weights).forEach(([track, weight]) => {
        scores[track as TrackId] += (weight as number) || 0;
      });
    }
  });

  // 2. Determine Winning Track (with tie-break priority)
  const sortedTracks = (Object.keys(scores) as TrackId[]).sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    const priority = { enterprise: 4, bilingual: 3, team: 2, individual: 1 };
    return priority[b] - priority[a];
  });
  const winningTrack = sortedTracks[0];

  // 3. Normalized Readiness Score
  const maxPossibleScore = 40; // Baseline
  const normalizedScore = Math.min(Math.round((scores[winningTrack] / maxPossibleScore) * 100), 100);

  // 4. Confidence Score (How much higher is the winner vs the average?)
  const otherScores = Object.entries(scores).filter(([t]) => t !== winningTrack).map(([_, v]) => v);
  const avgOthers = otherScores.reduce((a, b) => a + b, 0) / otherScores.length;
  const confidenceScore = Math.min(Math.round(((scores[winningTrack] - avgOthers) / 10) * 100), 100);

  // 5. Maturity Classification
  let maturity = MATURITY_LEVELS.BEGINNER;
  if (winningTrack === 'enterprise') maturity = MATURITY_LEVELS.ENTERPRISE;
  else if (winningTrack === 'bilingual') maturity = MATURITY_LEVELS.BILINGUAL;
  else if (normalizedScore > 75) maturity = MATURITY_LEVELS.SCALING;
  else if (normalizedScore > 40) maturity = MATURITY_LEVELS.DEVELOPING;

  // 6. Weakness Detection
  const weaknesses: string[] = [];
  if (answers.process === 'none' || answers.process === 'shadowing') weaknesses.push("infrastructure");
  if (answers.gap === 'onboarding') weaknesses.push("onboarding");
  if (answers.team_size === '50+' && answers.process !== 'internal') weaknesses.push("scaling");

  // 7. Personalized Insights
  const insights: string[] = [];
  if (winningTrack === 'enterprise') insights.push("white_label");
  if (winningTrack === 'bilingual') insights.push("roi");
  if (normalizedScore < 50) insights.push("closing");

  return {
    winningTrack,
    normalizedScore,
    confidenceScore,
    maturity,
    weaknesses,
    insights,
    allScores: scores
  };
}
