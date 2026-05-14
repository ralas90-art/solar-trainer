import { WHITE_LABEL } from './white-label.config';

export interface DemoRep {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Top Performer' | 'Needs Attention' | 'At Risk' | 'Recently Inactive';
  performance: {
    total_score: number;
    level: number;
    curriculum_completion_percent: number;
    average_score: number;
    current_streak: number;
    last_active: string;
  };
  coaching_signals: any[];
  activity_log: any[];
  simulation_history: any[];
}

const INITIAL_DEMO_REPS: DemoRep[] = [
  {
    id: 'demo-sarah',
    name: 'Sarah Sun',
    email: 'sarah.sun@ai-sales.demo',
    role: 'sales_rep',
    status: 'Top Performer',
    performance: {
      total_score: 12540,
      level: 12,
      curriculum_completion_percent: 95,
      average_score: 92,
      current_streak: 14,
      last_active: new Date().toISOString(),
    },
    coaching_signals: [],
    activity_log: [
      { id: 'a1', type: 'certification', title: 'Certified: Objection Handling', detail: 'Passed with 98%', timestamp: new Date().toISOString() },
      { id: 'a2', type: 'simulation', title: 'Discovery Call', detail: 'Score: 95%', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ],
    simulation_history: [
      {
        simulation_id: 'sim-sarah-1',
        scenario_name: 'Objection Handling: Cost',
        score: 98,
        passed: true,
        created_at: new Date().toISOString(),
        transcript: [
          { role: 'coach', content: "The customer says: 'It's just too expensive.'" },
          { role: 'user', content: "I totally understand that cost is a factor. Let's look at the long-term ROI and how the tax credits offset the initial investment." }
        ],
        feedback: {
          pros: ['Strong empathy', 'Excellent ROI explanation'],
          cons: ['None'],
          critique: 'Perfect handling of price objections.'
        }
      }
    ]
  },
  {
    id: 'demo-alex',
    name: 'Alex Drift',
    email: 'alex.drift@ai-sales.demo',
    role: 'sales_rep',
    status: 'Needs Attention',
    performance: {
      total_score: 5420,
      level: 6,
      curriculum_completion_percent: 45,
      average_score: 78,
      current_streak: 2,
      last_active: new Date(Date.now() - 86400000).toISOString(),
    },
    coaching_signals: [
      {
        type: 'low_retention',
        title: 'Falling Behind',
        description: 'Score consistency is dropping in discovery modules.',
        severity: 'medium',
        status: 'active',
        created_at: new Date().toISOString(),
        recommended_actions: ['Schedule 1-on-1 review', 'Assign practice module 3.4']
      }
    ],
    activity_log: [
      { id: 'a3', type: 'simulation', title: 'Discovery Call', detail: 'Score: 72%', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ],
    simulation_history: [
      {
        simulation_id: 'sim-alex-1',
        scenario_name: 'Discovery Phase',
        score: 72,
        passed: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        transcript: [
          { role: 'coach', content: "Ask about their current utility bill." },
          { role: 'user', content: "Uh, how much do you pay for electricity?" }
        ],
        feedback: {
          pros: ['Asked the question'],
          cons: ['Lacks confidence', 'Didn\'t explain why we need the info'],
          critique: 'Need to work on building rapport before diving into numbers.'
        }
      }
    ]
  },
  {
    id: 'demo-mark',
    name: 'Mark Stall',
    email: 'mark.stall@ai-sales.demo',
    role: 'sales_rep',
    status: 'At Risk',
    performance: {
      total_score: 2100,
      level: 3,
      curriculum_completion_percent: 15,
      average_score: 65,
      current_streak: 0,
      last_active: new Date(Date.now() - 259200000).toISOString(),
    },
    coaching_signals: [
      {
        type: 'practice_avoidance',
        title: 'Practice Avoidance',
        description: 'Has not completed a simulation in 3 days despite being active.',
        severity: 'high',
        status: 'active',
        created_at: new Date().toISOString(),
        recommended_actions: ['Immediate manager intervention', 'Mandatory simulation block']
      },
      {
        type: 'falling_behind',
        title: 'Critical Retention Gap',
        description: 'Consistently failing Objection Handling quiz.',
        severity: 'high',
        status: 'active',
        created_at: new Date().toISOString(),
        recommended_actions: ['Review foundation modules']
      }
    ],
    activity_log: [
      { id: 'a4', type: 'login', title: 'Logged In', detail: 'Session duration: 2m', timestamp: new Date(Date.now() - 259200000).toISOString() }
    ],
    simulation_history: []
  }
];

let demoReps = [...INITIAL_DEMO_REPS];

export const getDemoReps = () => {
  // Always return fresh relative timestamps
  return demoReps.map(rep => ({
    ...rep,
    company_name: WHITE_LABEL.companyName
  }));
};

export const getDemoRepById = (id: string) => {
  const rep = demoReps.find(r => r.id === id);
  if (!rep) return null;
  
  return {
    profile: {
      user_id: rep.id,
      name: rep.name,
      email: rep.email,
      role: rep.role,
      company_id: 'demo-company'
    },
    performance: {
      ...rep.performance,
      highest_streak: rep.performance.current_streak + 5,
      level_progress: 45,
      xp_to_next_level: 500,
      lives: 3,
      simulations_completed: rep.simulation_history.length,
      last_synced_at: new Date().toISOString()
    },
    coaching_signals: rep.coaching_signals,
    activity_log: rep.activity_log,
    simulation_history: rep.simulation_history,
    ai_feedback_summary: {
      strengths: rep.status === 'Top Performer' ? ['Confidence', 'Closing'] : ['Willingness to learn'],
      weaknesses: rep.status === 'At Risk' ? ['Consistency', 'Technical knowledge'] : [],
      recommended_next_steps: ['Continue to Level ' + (rep.performance.level + 1)]
    },
    coaching_notes: []
  };
};

export const resetDemoData = () => {
  demoReps = JSON.parse(JSON.stringify(INITIAL_DEMO_REPS));
  return true;
};
