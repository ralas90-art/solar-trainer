/**
 * Core Sales Foundation — Curriculum Content
 * ==========================================
 * Universal sales methodology applicable across all verticals.
 * This is the base layer that every trainee uses before learning specific verticals.
 *
 * Status: PREVIEW / ENABLED (via Company Settings)
 * Prefix: core_
 */

import type { ModuleContent, DayInfo } from "@/lib/modules"

export const CORE_SALES_DAY_MODULES: DayInfo[] = [
  {
    dayNumber: 1,
    dayId: "core_day_1",
    title: "Direct Sales Mindset & Field Readiness",
    subtitle: "Build the foundational mindset, work ethic, and professional presence required for field success.",
    objectives: [
      "Understand the consultant identity and the value of consultative selling.",
      "Overcome the fear of rejection and build resilience.",
      "Prepare daily schedules, map territories, and optimize canvassing hours.",
      "Master professional body language, presence, and tone at the door."
    ],
    modules: [
      { id: "core_1_1", moduleNumber: "1.1", title: "What Direct Sales Really Is", duration: "20 min", type: "content" },
      { id: "core_1_2", moduleNumber: "1.2", title: "The Field Rep Mindset", duration: "25 min", type: "content" },
      { id: "core_1_3", moduleNumber: "1.3", title: "Territory, Timing, and Daily Preparation", duration: "30 min", type: "activity" },
      { id: "core_1_4", moduleNumber: "1.4", title: "Professional Presence at the Door", duration: "25 min", type: "content" }
    ],
    deliverables: [
      "Mindset self-assessment completed.",
      "Canvassing daily schedule mapped out.",
      "Introductory presence drill recorded."
    ],
    homework: [
      "Practice professional posture and direct eye contact in front of a mirror.",
      "Define your personal 'Why' for entering direct sales."
    ]
  },
  {
    dayNumber: 2,
    dayId: "core_day_2",
    title: "Opening the Conversation",
    subtitle: "Learn how to hook attention, lower homeowner defenses, and build initial trust within the first minute.",
    objectives: [
      "Capture positive attention in the first 10 seconds without sounding like a salesperson.",
      "Use permission-based openers that respect the homeowner's boundary.",
      "Avoid over-explaining or pitch-slapping early in the interaction.",
      "Correctly read verbal and non-verbal homeowner cues at the door."
    ],
    modules: [
      { id: "core_2_1", moduleNumber: "2.1", title: "The First 10 Seconds", duration: "20 min", type: "content" },
      { id: "core_2_2", moduleNumber: "2.2", title: "Permission-Based Openers", duration: "25 min", type: "content" },
      { id: "core_2_3", moduleNumber: "2.3", title: "Building Trust Without Over-Talking", duration: "30 min", type: "activity" },
      { id: "core_2_4", moduleNumber: "2.4", title: "Reading Homeowner Signals", duration: "25 min", type: "content" }
    ],
    deliverables: [
      "First 10 seconds opener script customized.",
      "Three permission-based openers drafted.",
      "Signals classification grid completed."
    ],
    homework: [
      "Deliver your custom opener to a colleague or family member and receive feedback.",
      "Observe 3 different people's non-verbal reactions today."
    ]
  },
  {
    dayNumber: 3,
    dayId: "core_day_3",
    title: "Discovery & Qualification",
    subtitle: "Transition from chatting to diagnosing problems, uncovering true priorities, and sorting fit.",
    objectives: [
      "Examine customer circumstances before suggesting any product solution.",
      "Assess pain, budget priorities, timing constraints, and decision-making authority.",
      "Draft open-ended calibrated questions that let the homeowner explain their situation.",
      "Identify red flags and disqualify prospects early to save time."
    ],
    modules: [
      { id: "core_3_1", moduleNumber: "3.1", title: "Discovery Before Pitching", duration: "25 min", type: "content" },
      { id: "core_3_2", moduleNumber: "3.2", title: "Pain, Priority, Timing, and Authority", duration: "30 min", type: "content" },
      { id: "core_3_3", moduleNumber: "3.3", title: "Asking Better Questions", duration: "30 min", type: "activity" },
      { id: "core_3_4", moduleNumber: "3.4", title: "When to Disqualify", duration: "20 min", type: "content" }
    ],
    deliverables: [
      "Custom discovery questionnaire drafted.",
      "Disqualification red-flags checklist completed.",
      "Roleplay discovery session recorded."
    ],
    homework: [
      "Ask a friend about a recent purchase using only open-ended questions.",
      "Refine your list of 5 key deal-breakers/red flags."
    ]
  },
  {
    dayNumber: 4,
    dayId: "core_day_4",
    title: "Objections & Value Framing",
    subtitle: "Deconstruct why objections occur, classify them accurately, and reframe value without arguing.",
    objectives: [
      "Understand objections as requests for clarification rather than rejections.",
      "Differentiate logical, emotional, and tactical objections.",
      "Reframe price and trust objections using supportive language.",
      "Formulate soft reverse questions that clarify underlying hesitations."
    ],
    modules: [
      { id: "core_4_1", moduleNumber: "4.1", title: "Why Objections Happen", duration: "20 min", type: "content" },
      { id: "core_4_2", moduleNumber: "4.2", title: "Price, Trust, Timing, and Partner Objections", duration: "30 min", type: "content" },
      { id: "core_4_3", moduleNumber: "4.3", title: "Reframing Without Arguing", duration: "25 min", type: "activity" },
      { id: "core_4_4", moduleNumber: "4.4", title: "Turning Resistance Into Next Steps", duration: "25 min", type: "content" }
    ],
    deliverables: [
      "Objection matrix with custom responses drafted.",
      "Value reframing exercise completed.",
      "Reverse objection handling roleplay finished."
    ],
    homework: [
      "Review your script for any terms that trigger artificial logical objections.",
      "Practice the negative reverse response on 3 common customer comments."
    ]
  },
  {
    dayNumber: 5,
    dayId: "core_day_5",
    title: "Ethical Close & Follow-Up",
    subtitle: "Complete the transaction with absolute integrity, lock down next steps, and build a referrals system.",
    objectives: [
      "Secure commitments through confirmation closing without manipulation.",
      "Create clear next-step expectations to lower post-purchase anxiety.",
      "Design a systematic follow-up calendar for pipeline prospects.",
      "Maintain a personal scorecard to measure daily efforts and conversion metrics."
    ],
    modules: [
      { id: "core_5_1", moduleNumber: "5.1", title: "The Ethical Close", duration: "25 min", type: "content" },
      { id: "core_5_2", moduleNumber: "5.2", title: "Setting the Next Step", duration: "20 min", type: "content" },
      { id: "core_5_3", moduleNumber: "5.3", title: "Follow-Up Discipline", duration: "25 min", type: "activity" },
      { id: "core_5_4", moduleNumber: "5.4", title: "Personal Scorecard and Daily Improvement", duration: "30 min", type: "content" }
    ],
    deliverables: [
      "Confirmation close script prepared.",
      "Post-close checklist drafted.",
      "Canvassing score card system set up."
    ],
    homework: [
      "Draft a follow-up template for prospects who weren't ready immediately.",
      "Log your metrics for today's practice drills on your scorecard."
    ]
  }
]

export const CORE_SALES_MODULES: Record<string, ModuleContent> = {
  core_1_1: {
    id: "core_1_1",
    title: "Module 1.1: What Direct Sales Really Is",
    subtitle: "Shift from transactional vendor to trusted consultant. Learn the math and science of direct sales.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Understand that modern direct sales is a process of diagnostic matchmaking, not high-pressure persuasion. Your goal is to identify if a genuine alignment exists between a homeowner's needs and your solution, establishing yourself as a consultant from the very first interaction.",
        narration: "Welcome to Module one point one. Today's objective is simple: shift your perspective from being a transactional salesperson to a trusted consultant. Your primary goal at the door is diagnostic matchmaking—not pressure."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Salespeople who pitch products immediately are viewed as untrustworthy interruptions. Consultants who ask questions, understand boundaries, and seek problems are welcomed. Elevating your identity to a professional consultant doubles customer receptivity and protects your long-term reputation.",
        narration: "Why does this matter? Homeowners are naturally defensive when an unsolicited visitor knocks. If you immediately pitch, you trigger their rejection response. If you ask open-ended questions to diagnose problems, you separate yourself from generic solicitors."
      },
      {
        title: "Field Framework: The Diagnostic Hierarchy",
        type: "list",
        content: "Successful direct sales follows a clear, sequential path. Never jump steps:",
        items: [
          "1. Separation: Position yourself differently than generic solicitors within the first 10 seconds.",
          "2. Diagnostic Discovery: Ask questions to identify actual household inefficiencies or goals.",
          "3. Qualification: Confirm the household meets technical, structural, and financial criteria.",
          "4. Tailored Prescription: Only present solutions that directly solve the discovered problems.",
          "5. Confirmation: Verify the homeowner is comfortable with the terms and understands next steps."
        ],
        narration: "Our field framework is the Diagnostic Hierarchy. First, separate yourself from standard salespeople. Second, run diagnostic discovery. Third, qualify technical and financial fit. Fourth, prescribe solutions. Fifth, secure comfortable confirmation."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Rookie Approach: 'Hi! I'm here to sell you on our new energy solutions and save you tons of money today! Can I come in and show you our brochures?'\n\nConsultant Approach: 'Good afternoon. I'm talking with a few homeowners on the block about utility rate adjustments. We're verifying which homes are affected by the recent tier changes. The goal isn't to change anything today; it's simply to see if your utility bill has jumped into the high-rate bracket, and then determine if there is an option that makes sense for you.'",
        narration: "Listen to the difference between a rookie and a pro. The rookie begs for entry and promises immediate savings. The consultant establishes local context, lowers pressure by stating no decision is being made today, and focuses on verification."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Pitching too early.",
        comparison: {
          rookie: "Begins listing features, specs, and prices before knowing anything about the homeowner's utility usage, budget, or future plans.",
          pro: "Asks structured questions, listens, and takes notes. Refuses to make any product suggestions until the homeowner's current situation is completely clear."
        },
        narration: "A very common mistake is pitching too early. Rookies list product specs right away. Pros wait, ask calibrated questions, and take notes. Do not prescribe a solution before you have fully diagnosed the problem."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Write down the difference between a product feature (e.g., '25-year warranty') and the actual customer benefit (e.g., 'financial peace of mind and protection against unexpected expenses'). Practice converting 3 features into customer benefits out loud.",
        narration: "Here is your practice drill: take three product features from your catalog. Translate them into emotional or financial customer benefits. Practice saying the benefits out loud until they sound natural and conversational."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Never claim to be representing the local utility company, city administration, or any government agency. Always state your name and company name clearly. Never guarantee savings or rates. Present realistic projections with standard disclaimers.",
        narration: "Remember your compliance guidelines: always state your name and company name clearly. Never claim association with the utility company, city, or government. Present realistic projections with clear, standard disclaimers."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_1_1_1",
        type: "open_response",
        label: "Draft a 15-second consultant-style introduction that explains who you are and why you are in the neighborhood without promising savings.",
        placeholder: "Good afternoon, my name is... I am in the area verifying...",
        lines: 3
      },
      {
        id: "wb_core_1_1_2",
        type: "rating",
        label: "Rate your confidence in explaining the difference between selling and consulting (1 = confused, 5 = fully clear):",
        maxRating: 5
      }
    ],
    quiz: {
      title: "Module 1.1 Knowledge Check",
      questions: [
        {
          id: "q_core_1_1_1",
          question: "Which of the following best describes the consultant identity in direct sales?",
          options: [
            "Pitching the product features as fast as possible to overwhelm resistance.",
            "Diagnosing the homeowner's actual situation and needs before presenting a solution.",
            "Using emotional pressure to force an immediate agreement.",
            "Pretending to be a city inspector to gain access to the home."
          ],
          correctAnswerIndex: 1,
          explanation: "A consultant focuses on discovery and diagnosis first, ensuring the product fits the homeowner's actual situation before pitching."
        },
        {
          id: "q_core_1_1_2",
          question: "What is a major compliance violation when introducing yourself?",
          options: [
            "Giving your name and company name clearly.",
            "Saying you are from the utility company or city to get the customer to listen.",
            "Explaining the purpose of your visit in the first minute.",
            "Respecting a 'No Soliciting' sign."
          ],
          correctAnswerIndex: 1,
          explanation: "Falsely claiming association with a utility, municipality, or government entity is a severe compliance violation and is strictly prohibited."
        }
      ]
    }
  },
  core_1_2: {
    id: "core_1_2",
    title: "Module 1.2: The Field Rep Mindset",
    subtitle: "Overcome rejection, manage your emotions, and build long-term resilience in direct sales.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Develop the mental resilience necessary to handle rejection. Shift your perspective to see 'No' as a normal statistical part of the sales funnel rather than a personal rejection, allowing you to maintain energy and professionalism throughout the day.",
        narration: "In Module one point two, we focus on mindset. Your goal is to build emotional resilience and view rejection as a neutral metric rather than a personal attack."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Direct sales involves high rejection rates. If every 'No' drains your enthusiasm, you will suffer from energy depletion and burn out quickly. Reps with a resilient mindset realize that a certain number of rejections are mathematically required to reach a single 'Yes'.",
        narration: "Direct sales is governed by ratios. If you take rejection personally, your energy will drop, affecting subsequent doors. Resilient reps treat a 'no' as a statistical checkpoint on the way to a 'yes'."
      },
      {
        title: "Field Framework: The Law of Averages",
        type: "list",
        content: "Every top producer relies on the Law of Averages to govern their emotional state:",
        items: [
          "Understand the numbers: If your average is 1 close out of every 20 doors knocked, then every 'No' gets you closer to a 'Yes'.",
          "Focus on inputs: Control what you can control — your attitude, your work ethic, and the number of doors knocked. You cannot force a homeowner to buy, but you can control your effort.",
          "Emotional neutrality: Maintain the same polite, professional demeanor whether you get a door slammed or a friendly conversation.",
          "Keep moving: The door you are standing at has zero relationship to the previous door. Start fresh every time."
        ],
        narration: "The Law of Averages is your primary shield. Keep your inputs high and your emotions neutral. Remember, the house you are approaching right now has no memory of the rejection you received next door."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Homeowner: 'Not interested. Please leave.'\n\nResilient Response: 'No problem at all, I completely understand. Thanks for your time and have a great rest of your day!' (Walks away with a smile, maintaining positive energy for the next house).",
        narration: "Listen to the talk track. When faced with a blunt rejection, the pro responds with immediate courtesy, wishes the customer well, and walks away with their energy intact."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Taking rejection personally.",
        comparison: {
          rookie: "Takes a rude homeowner personally, gets discouraged, stops knocking for the day, or argues with the homeowner.",
          pro: "Recognizes the homeowner is rejecting the interruption or the category, not them personally. Wishes them well, logs the door, and moves to the next house."
        },
        narration: "Rookies argue or quit when rejected. Pros know the homeowner is rejecting the interruption, not the person. Wish them a good day, log the data, and step to the next turf."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Write down your personal 'Why' — the reason you want to succeed in sales. Read it out loud. When you face a tough rejection, remind yourself of your 'Why' to reset your emotional state.",
        narration: "Practice reset drills: write down your personal 'Why'. Read it before you start. When you hit a run of cold doors, take a deep breath, review your 'Why', and reboot your presence."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "If a homeowner asks you to leave their property, you must do so immediately and politely. Do not push back, do not debate, and do not linger. Respect their privacy.",
        narration: "Compliance is non-negotiable: if a customer asks you to leave, do so immediately and politely. Never linger or debate on private property."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_1_2_1",
        type: "open_response",
        label: "Define your personal 'Why' for entering direct sales. What specific goal keeps you motivated?",
        placeholder: "My motivation is...",
        lines: 3
      },
      {
        id: "wb_core_1_2_2",
        type: "checklist",
        label: "Mindset Commitment — confirm below:",
        items: [
          "I will not debate with hostile homeowners.",
          "I will keep my work input consistent regardless of rejection.",
          "I will remain professional and polite at all times."
        ]
      }
    ],
    quiz: {
      title: "Module 1.2 Knowledge Check",
      questions: [
        {
          id: "q_core_1_2_1",
          question: "How should a professional field representative view a homeowner saying 'No'?",
          options: [
            "As a sign that they are bad at sales and should look for a new job.",
            "As a normal statistical step closer to the next 'Yes'.",
            "As an invitation to argue and prove the homeowner wrong.",
            "As a personal insult that warrants a rude response."
          ],
          correctAnswerIndex: 1,
          explanation: "Viewing rejections as a normal statistical part of the sales funnel is key to maintaining emotional stability and long-term success."
        },
        {
          id: "q_core_1_2_2",
          question: "What is the correct action if a homeowner tells you to leave their property?",
          options: [
            "Stand your ground and explain the product benefits anyway.",
            "Politely wish them a good day and walk away immediately.",
            "Argue with them about local solicitation laws.",
            "Wait on the sidewalk until they go back inside, then knock again."
          ],
          correctAnswerIndex: 1,
          explanation: "You must always respect a homeowner's request to leave their property immediately and politely to maintain compliance and professionalism."
        }
      ]
    }
  },
  core_1_3: {
    id: "core_1_3",
    title: "Module 1.3: Territory, Timing, and Daily Preparation",
    subtitle: "Plan your day, organize your territory, and maximize your high-probability canvassing hours.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Master the logistics of direct sales. Learn how to map out a designated turf, plan preparation tasks, and ensure that 100% of 'golden hours' (peak homeowner presence) are spent actively canvassing in the field.",
        narration: "Module one point three covers logistics. We want to organize your territory and protect your golden hours, which are the peak times homeowners are available."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Many reps fail not because of poor script delivery, but because of poor time management. They spend prime canvassing hours (4:00 PM to 8:00 PM) driving, printing flyers, or doing administrative work. Maximizing face-to-face time during high-probability hours is the fastest way to increase sales volume.",
        narration: "Time management is everything. Many reps waste prime hours doing paperwork or driving. Keep your face-to-face time maximized during the late afternoon and evening blocks."
      },
      {
        title: "Field Framework: The Canvassing Calendar",
        type: "list",
        content: "An optimal direct sales day is structured into clear blocks:",
        items: [
          "Morning Block (9:00 AM - 11:30 AM): Mindset prep, script practice, territory tracking, administrative catch-up.",
          "Early Canvassing (1:00 PM - 4:00 PM): Targeting shift workers, retirees, and mapping out the street layout.",
          "Peak Golden Hours (4:00 PM - 8:00 PM): Non-negotiable door-knocking. The majority of homeowners are back from work. No administrative distractions allowed.",
          "End-of-Day Logging: Review and record metrics, update pipeline contacts, plan tomorrow's neighborhood map."
        ],
        narration: "The Canvassing Calendar splits your day. Morning is for planning and practice. Golden hours are from four PM to eight PM. This window is strictly for customer-facing activity. Keep admin work outside this block."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Canvassing Prep Checklist:\n- Neighborhood map loaded on territory app\n- Fully charged phone/tablet and backup battery pack\n- Business cards and official company badge visible\n- Professional, clean attire appropriate for the local climate",
        narration: "Review your pre-flight checklist: turf map loaded, tablet charged, official ID badge visible, and clothing clean and professional."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Wasting Peak Canvassing Hours.",
        comparison: {
          rookie: "Arrives in the territory at 5:30 PM, realizes their tablet is dead, returns home to charge it, and misses the entire golden window.",
          pro: "Arrives in the field early, completes admin tasks during off-peak hours, and knocks doors continuously throughout the peak evening block."
        },
        narration: "Rookies waste peak canvassing hours on prep or logistics. Pros complete all admin work in the morning so they can knock doors without interruptions when golden hours start."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Draft a mock daily schedule for a 6-day work week. Identify the exact block of 4 hours each day that you will protect for customer-facing activity.",
        narration: "For your drill: map out a six-day calendar. Block off the exact four hours each evening you will protect from phone calls, emails, and meetings."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Always respect local solicitation curfews. Canvassing too early in the morning or too late at night (generally after 8:00 PM or 8:30 PM local time) is unprofessional and often violates local city ordinances.",
        narration: "Respect curfews: do not canvas past local ordinance limits. Canvassing after eight or eight-thirty PM is unprofessional and can violate local guidelines."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_1_3_1",
        type: "open_response",
        label: "Specify the exact neighborhood coordinates or target zip code you are mapping for your field prep.",
        placeholder: "Zip code or community name...",
        lines: 2
      },
      {
        id: "wb_core_1_3_2",
        type: "checklist",
        label: "Logistics Checklist — confirm below:",
        items: [
          "I have my official ID card visible.",
          "I have checked local municipality soliciting curfews.",
          "I have scheduled my administrative logging outside Golden Hours."
        ]
      }
    ],
    quiz: {
      title: "Module 1.3 Knowledge Check",
      questions: [
        {
          id: "q_core_1_3_1",
          question: "When are the prime 'Golden Hours' for residential direct sales canvassing?",
          options: [
            "9:00 AM to 12:00 PM, when most people are drinking coffee.",
            "12:00 PM to 2:00 PM, during lunch breaks.",
            "4:00 PM to 8:00 PM, when most homeowners have returned from work.",
            "10:00 PM to midnight, when everyone is guaranteed to be home."
          ],
          correctAnswerIndex: 2,
          explanation: "Late afternoon and early evening (4:00 PM - 8:00 PM) represent the peak homeowner presence for residential canvassing."
        },
        {
          id: "q_core_1_3_2",
          question: "What is the consequence of doing admin work during peak canvassing hours?",
          options: [
            "It increases close rates because your records are neat.",
            "It reduces your customer face-time, leading to lower lead generation.",
            "It is highly recommended by top producers.",
            "It has no impact on performance."
          ],
          correctAnswerIndex: 1,
          explanation: "Admin work should be pushed to off-peak hours so you don't waste precious door-knocking opportunities during the evening golden window."
        }
      ]
    }
  },
  core_1_4: {
    id: "core_1_4",
    title: "Module 1.4: Professional Presence at the Door",
    subtitle: "Master body language, distance, tone, and eye contact to put homeowners at ease instantly.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Master the physical dynamics of the door approach. Learn how to stand, where to position yourself, and how to use voice tone and eye contact to look like an invited guest rather than an aggressive salesperson.",
        narration: "Module one point four teaches physical presence. How you stand, your distance, and your hands are evaluated instantly by the homeowner."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Homeowners make a safety and trust decision within 5 seconds of opening the door. If you stand too close, block their doorway, or look tense, their fight-or-flight response triggers, causing them to reject you immediately. Relaxed, respectful physical spacing lowers their guard.",
        narration: "Homeowners make safety checks within five seconds. If you crowd their doorway or look defensive, they will shut the door. Relaxed, distant spacing keeps them comfortable."
      },
      {
        title: "Field Framework: The Spacing and Stance Rules",
        type: "list",
        content: "Apply these physical presence rules at every door:",
        items: [
          "The 6-Foot Rule: Stand at least 6 feet back from the door after knocking. Give the homeowner their personal space.",
          "The 45-Degree Angle: Stand at a slight angle rather than squaring up directly. Facing them head-on can feel confrontational.",
          "Visible Hands: Keep your hands empty and visible. Do not hide them in your pockets or behind your back.",
          "Warm Smile & Eye Contact: Maintain steady, relaxed eye contact. Smile genuinely, acknowledging their presence.",
          "The Knock & Step Back: Knock firmly or ring the bell once, then take two full steps back. Avoid repeated, frantic knocking."
        ],
        narration: "Our presence rules are: stand six feet back, turn at a forty-five degree angle, keep hands visible, and knock or ring once. Never square up head-on, as it looks confrontational."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Rookie Approach: (Stands 2 feet from door, blocks screen, looks down at tablet, knocks aggressively 5 times)\n\nPro Approach: (Rings bell once, takes two steps back to stand 6 feet away at a 45-degree angle, holds tablet comfortably, looks up, smiles as door opens)",
        narration: "Notice the difference. The rookie crowds the screen and knocks frantically. The pro rings once, backs up, turns, and stands with open posture."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Crowding the Doorway.",
        comparison: {
          rookie: "Stands right up against the screen door, making the homeowner feel trapped and anxious as soon as they open the door.",
          pro: "Stands back at a comfortable distance, allowing the homeowner to open the door fully without feeling their personal space is violated."
        },
        narration: "Do not crowd the doorway. Rookies trap the customer by blocking the exit. Pros stand back, showing respect for personal space."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Find a door in your home. Practice walking up, knocking once, taking two steps back, turning at a 45-degree angle, and holding your hands in a relaxed, open position. Repeat 5 times.",
        narration: "Try this drill: approach a door, knock once, take two steps back, turn forty-five degrees, and keep your hands open. Practice it five times."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Never peer through windows, open screen doors without permission, or knock on back doors. Always stay on the front porch or public walkway.",
        narration: "Stay on the front porch. Peer through windows, opening screen doors, or walking to the back door are severe violations of privacy."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_1_4_1",
        type: "rating",
        label: "Assess your physical distance awareness: Rate how comfortable you are stepping back 6 feet immediately after knocking (1 = difficult, 5 = easy):",
        maxRating: 5
      },
      {
        id: "wb_core_1_4_2",
        type: "checklist",
        label: "Door Stance Commitments — confirm below:",
        items: [
          "I will stand back 6 feet.",
          "I will face a 45-degree angle.",
          "I will keep my hands visible."
        ]
      }
    ],
    quiz: {
      title: "Module 1.4 Knowledge Check",
      questions: [
        {
          id: "q_core_1_4_1",
          question: "Where should you stand immediately after knocking on a homeowner's door?",
          options: [
            "Right up against the screen door so you can speak softly.",
            "At least 6 feet back, at a slight 45-degree angle.",
            "Off to the side, hiding behind a porch pillar.",
            "Directly in front of the window next to the door."
          ],
          correctAnswerIndex: 1,
          explanation: "Standing 6 feet back at a 45-degree angle respects the homeowner's personal space and reduces initial defensiveness."
        },
        {
          id: "q_core_1_4_2",
          question: "What is the psychological effect of keeping your hands visible and empty?",
          options: [
            "It makes the homeowner think you forgot your brochure.",
            "It signals safety, honesty, and openness, lowering their guard.",
            "It has no impact on the homeowner's perception.",
            "It makes you look unprofessional."
          ],
          correctAnswerIndex: 1,
          explanation: "Visible, open hands subconsciously signal safety and transparency, helping to build rapid trust."
        }
      ]
    }
  },
  core_2_1: {
    id: "core_2_1",
    title: "Module 2.1: The First 10 Seconds",
    subtitle: "Lower homeowner defenses and capture positive attention within your opening statement.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Craft a compelling opening statement that lowers the homeowner's initial guard. Your goal is to avoid triggers that make you sound like a solicitor, positioning yourself as a local specialist investigating neighborhood updates.",
        narration: "Module two point one focuses on the first ten seconds. Your goal is to bypass the homeowner's reflex rejection by avoiding standard sales phrases."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Homeowners have a default response for salespeople: 'No thank you, we're busy.' If you start with generic sales phrases, you trigger this automatic rejection. Changing your opener prevents this reflex and keeps the conversation open.",
        narration: "If you sound like a salesperson, you get treated like one. A non-sales opener keeps the conversation open and gives you time to build rapport."
      },
      {
        title: "Field Framework: The Anti-Sales Opener",
        type: "list",
        content: "A successful 10-second opener contains three key parts:",
        items: [
          "1. Local context: Mention the neighborhood, street name, or a nearby landmark. This shows you are not lost.",
          "2. Low pressure: State immediately that you are not asking for a decision or selling something today. This disarms defenses.",
          "3. Curiosity hook: Reference a local project, rating change, or neighborhood assessment that is currently happening."
        ],
        narration: "The Anti-Sales Opener contains local context, low pressure, and a curiosity hook. Explain why you are in their neighborhood specifically, and tell them up front that there is no decision to make today."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Rookie Opener: 'Hi! I'm here to show you how you can save 50% on your home expenses if you sign up with our company today!'\n\nPro Opener: 'Good afternoon. I'm with SeptiVolt. We're completing a neighborhood assessment regarding the recent utility rate changes on this street. The goal isn't to sign anything today; it's simply to verify if your home qualifies for the updated baseline tier.'",
        narration: "Listen to the talk tracks. The rookie pitches savings and sign-ups immediately. The pro establishes identity, local focus, and sets expectations that no purchase is happening today."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Pitching too fast.",
        comparison: {
          rookie: "Begins listing product benefits, warranties, and pricing structures in the very first breath, causing the homeowner to close the door.",
          pro: "Focuses entirely on local context and rate adjustments to establish relevance before mentioning any solutions."
        },
        narration: "A major mistake is pitching too fast. Rookies dump benefits immediately. Pros focus on local context and relevance first."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Draft your own 10-second opener using your local area. Record yourself on your phone. Make sure your tone is relaxed, conversational, and has no sales pitch. Listen for speed; speak slowly.",
        narration: "Practice opener drills: write out your opener. Record it. Listen back. Focus on a slow, relaxed, conversational delivery pace."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Do not fabricate rate changes or neighbor names. Always speak with absolute truth. If you mention rate adjustments, refer to publicly documented local utility rate tiers.",
        narration: "Compliance check: always be honest about why you are out. Never invent neighbor stories or rate schedules. Use only public facts."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_2_1_1",
        type: "open_response",
        label: "Write your custom 10-second opener incorporating local neighborhood context.",
        placeholder: "Hi, I'm with... We're out here in [Neighborhood] because of...",
        lines: 3
      },
      {
        id: "wb_core_2_1_2",
        type: "checklist",
        label: "Opening Commitments — check to commit:",
        items: [
          "I will not promise immediate financial savings.",
          "I will clearly state my company name.",
          "I will use local neighborhood context in my opener."
        ]
      }
    ],
    quiz: {
      title: "Module 2.1 Knowledge Check",
      questions: [
        {
          id: "q_core_2_1_1",
          question: "What is the primary goal of the first 10 seconds of a direct sales interaction?",
          options: [
            "To close the sale immediately.",
            "To get inside the house at all costs.",
            "To lower the homeowner's guard and capture positive attention.",
            "To explain the technical specifications of your product."
          ],
          correctAnswerIndex: 2,
          explanation: "The first 10 seconds should focus on lowering homeowner defenses and earning interest to continue the conversation."
        },
        {
          id: "q_core_2_1_2",
          question: "Which of the following phrases is most likely to trigger a homeowner's automatic rejection?",
          options: [
            "I'm here to show you how you can save thousands of dollars today if you sign up.",
            "We're completing a neighborhood assessment regarding rate changes.",
            "The goal today isn't to make any decisions.",
            "I'm talking to a few homeowners on this street."
          ],
          correctAnswerIndex: 0,
          explanation: "High-pressure pitches and promises of immediate savings trigger automatic defensive reactions, ending the conversation."
        }
      ]
    }
  },
  core_2_2: {
    id: "core_2_2",
    title: "Module 2.2: Permission-Based Openers",
    subtitle: "Structure your opening to request micro-permissions, reducing customer friction.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Master permission-based communication. Learn how to structure your opener so you invite the homeowner to opt-in to the conversation, creating a collaborative discussion instead of a one-sided pitch.",
        narration: "Module two point two covers permission-based openers. By requesting micro-permissions, you reduce friction and give the customer a feeling of control."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Direct sales can feel invasive. By explicitly asking for permission to ask questions or share information, you give the homeowner a sense of control. This respect for their autonomy builds trust and lowers defensiveness.",
        narration: "Direct sales can feel pushy. By asking for permission to share info or ask questions, you respect their space, which immediately builds trust."
      },
      {
        title: "Field Framework: The Permission Loop",
        type: "list",
        content: "Apply these permission checkpoints during your conversation:",
        items: [
          "The Opening Permission: 'Do you mind if I ask a quick question about your rate tier?'",
          "The Informational Permission: 'Would it make sense if I showed you the public rate comparison chart?'",
          "The Qualification Permission: 'Would you be open to verifying if your home has the standard meter layout?'",
          "The Scheduling Permission: 'Would it be okay if we sat down for 5 minutes to review your specific numbers?'"
        ],
        narration: "Our permission loop uses soft checks: ask before starting, check before showing info, and confirm before scheduling a sit-down."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Rookie Approach: 'Let me tell you how this works. Listen to this...'\n\nPermission Approach: 'I have a quick question. We're looking at the tier structure on this street. Would you be open to checking if your utility bill has that tier-three surcharge? It only takes a second, and there's no decision to make today.'",
        narration: "Listen to the contrast. The rookie demands attention. The permission opener asks if they are open to checking a simple metric with no obligation."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Steamrolling the Customer.",
        comparison: {
          rookie: "Keeps talking without pausing, ignoring the homeowner's body language or attempts to speak, forcing information on them.",
          pro: "Asks small opt-in questions, pauses for answers, and adjusts the pace based on the homeowner's comfort level."
        },
        narration: "Avoid steamrolling. Rookies talk without pausing. Pros ask small questions, wait for answers, and let the customer dictate the pace."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Convert 3 direct statements (e.g. 'I need to see your bill', 'I want to schedule an appointment', 'Let me show you our panels') into permission-based questions. Practice saying them out loud.",
        narration: "For your practice drill: convert three pushy requests into polite, permission-based questions. Say them out loud."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "If a customer says 'No' to any permission request, respect their answer. Do not try to bypass their refusal with high pressure. Politely transition out of the conversation.",
        narration: "If they say no, accept it immediately. Never force the conversation or push past a clear opt-out request."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_2_2_1",
        type: "open_response",
        label: "Convert this direct statement: 'Give me your bill to look at' into a permission-based question.",
        placeholder: "Would you mind if we looked at...",
        lines: 3
      },
      {
        id: "wb_core_2_2_2",
        type: "checklist",
        label: "Permission Loop Commitments — confirm below:",
        items: [
          "I will request opt-in before pulling up data sheets.",
          "I will respect boundaries and stop if requested.",
          "I will use soft permission questions."
        ]
      }
    ],
    quiz: {
      title: "Module 2.2 Knowledge Check",
      questions: [
        {
          id: "q_core_2_2_1",
          question: "What is the primary benefit of using permission-based openers?",
          options: [
            "They make the conversation take longer.",
            "They give the homeowner control, reducing friction and building trust.",
            "They confuse the customer into saying yes.",
            "They guarantee a sale on the spot."
          ],
          correctAnswerIndex: 1,
          explanation: "Asking for permission respects homeowner autonomy, which helps lower their guard and establishes a collaborative tone."
        },
        {
          id: "q_core_2_2_2",
          question: "Which of the following is a permission-based question?",
          options: [
            "I need you to show me your utility bill right now.",
            "Would you be open to checking if your home has the standard meter layout?",
            "Let me tell you all about our 25-year warranty.",
            "You have to sign here to get the discount."
          ],
          correctAnswerIndex: 1,
          explanation: "'Would you be open to...' is a classic permission-based question that invites the customer to opt-in."
        }
      ]
    }
  },
  core_2_3: {
    id: "core_2_3",
    title: "Module 2.3: Building Trust Without Over-Talking",
    subtitle: "Speak less, listen more, and build credibility through strategic silence and short statements.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Master the art of brevity. Learn how to build credibility by keeping your explanations concise, asking calibrated questions, and using silence to let the homeowner express their thoughts.",
        narration: "Module two point three focuses on brevity. You build credibility by speaking less and asking calibrated questions, letting the customer explain their needs."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Rookies often suffer from 'verbal diarrhea' — talking constantly because of nervousness. This overwhelms the homeowner and makes you look desperate. Top performers speak less, ask high-value questions, and let the customer fill the silence.",
        narration: "Verbal diarrhea is a rookie trap. It shows desperation and overwhelms the customer. Pros use short explanations and let silence do the work."
      },
      {
        title: "Field Framework: The 80/20 Rule",
        type: "list",
        content: "Apply these guidelines to control your speaking time:",
        items: [
          "Listen 80%, Speak 20%: Your job is to gather diagnostic data, not to lecture the homeowner.",
          "Keep explanations simple: Avoid industry jargon. Explain concepts in plain, clear language.",
          "The 3-Second Pause: After the homeowner finishes speaking, wait 3 seconds before responding. This shows you are processing their words.",
          "Ask and Stop: When you ask a question, stop talking immediately. Do not answer your own question or explain it."
        ],
        narration: "Use the eighty-twenty rule: listen eighty percent, speak twenty percent. Keep details simple, use the three-second pause, and stop talking immediately after asking a question."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Rookie: 'We use premium high-efficiency monocrystalline panels with half-cut cell technology and bypass diodes that ensure optimal performance in partial shade... (talks for 3 minutes)'\n\nPro: 'We use high-efficiency panels that protect your home against rising rates. Have you noticed your bill jumping during the summer months?' (Pauses and waits for response).",
        narration: "Compare these tracks. The rookie dumps technical specs. The pro summarizes the value simply and immediately asks a question, then pauses."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Over-explaining.",
        comparison: {
          rookie: "Explains technical details or policy background in excessive depth, confusing the homeowner and losing their attention.",
          pro: "Delivers a clear, high-level summary and immediately asks a question to check understanding."
        },
        narration: "Do not over-explain. Rookies confuse the customer with deep technical details. Pros keep it simple and check for understanding."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Practice explaining your company's core solution in exactly three sentences or less. Use simple language. Read it out loud and time yourself.",
        narration: "For your drill: write a three-sentence pitch for your product using zero jargon. Time yourself to make sure it is under twenty seconds."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Do not hide important terms behind simple language. If a rate is variable or has an escalator, disclose it clearly. Do not use brevity to omit required contract disclosures.",
        narration: "Keep it simple but honest: never hide variable rates, escalators, or fees. Brief explanations must remain completely accurate."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_2_3_1",
        type: "open_response",
        label: "Write a three-sentence pitch for your solution using zero industry jargon.",
        placeholder: "We help local residents by... This works by...",
        lines: 3
      },
      {
        id: "wb_core_2_3_2",
        type: "rating",
        label: "Rate your comfort level with silence in a conversation (1 = must fill it immediately, 5 = fully comfortable waiting):",
        maxRating: 5
      }
    ],
    quiz: {
      title: "Module 2.3 Knowledge Check",
      questions: [
        {
          id: "q_core_2_3_1",
          question: "What is the recommended ratio of listening vs. speaking in discovery?",
          options: [
            "Speak 80% of the time, listen 20% of the time.",
            "Listen 80% of the time, speak 20% of the time.",
            "Speak 100% of the time to prevent objections.",
            "Listen 50% of the time, speak 50% of the time."
          ],
          correctAnswerIndex: 1,
          explanation: "Listening 80% of the time ensures you gather enough information to diagnose actual homeowner needs accurately."
        },
        {
          id: "q_core_2_3_2",
          question: "What should you do immediately after asking the homeowner a question?",
          options: [
            "Answer the question yourself to show your expertise.",
            "Stop talking and wait patiently for their response.",
            "Explain why you asked that question in detail.",
            "Ask another question immediately to stack them."
          ],
          correctAnswerIndex: 1,
          explanation: "You must stop talking and allow the customer time to process and answer your question."
        }
      ]
    }
  },
  core_2_4: {
    id: "core_2_4",
    title: "Module 2.4: Reading Homeowner Signals",
    subtitle: "Identify body language, micro-expressions, and verbal cues to gauge real interest.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Develop the ability to read homeowner signals. Learn how to interpret folded arms, eye contact changes, tone shifts, and key questions to understand their actual level of comfort and interest.",
        narration: "Module two point four covers reading signals. By noticing physical and verbal cues, you can adjust your strategy and address concerns early."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Homeowners often say 'yes' or nod out of politeness, even when they are completely disconnected or planning to cancel. Reading physical and verbal signals prevents you from wasting time on polite non-buyers and helps you address real concerns.",
        narration: "Do not get fooled by polite nodding. Many people nod simply to be nice, even if they aren't interested. Reading their actual signals saves you time."
      },
      {
        title: "Field Framework: The Red, Yellow, Green Signal System",
        type: "list",
        content: "Classify homeowner cues into three priority tiers:",
        items: [
          "Red (Blocked): Folded arms tightly pressed, body turned away, avoiding eye contact, short one-word answers. Action: Stop pitching, take a step back, and ask: 'It feels like you're a bit skeptical about this — is that fair?'",
          "Yellow (Neutral/Uncertain): Listening but quiet, arms relaxed, looking at materials, asking general questions. Action: Keep asking calibrated discovery questions to find their specific interest.",
          "Green (Open): Standing close, nodding, body angled toward you, asking specific questions ('How much does it cost?', 'How long does it take?'). Action: Transition to the formal scheduling or proposal stage."
        ],
        narration: "We use a traffic-light signal system. Red signals mean they are blocked—pause and address the block. Yellow means neutral—continue discovery. Green means open—transition to the presentation."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Addressing a Red Signal: 'I notice you're looking a bit skeptical, which makes total sense. We get a lot of people knocking on doors here. Would it be helpful if I showed you our local license details first, or would you rather we just wrap up here?' (Respects boundary, gives control).",
        narration: "If you see a red signal, name it. Ask the customer if they are feeling skeptical. This shows respect, disarms them, and gives them control of the visit."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Ignoring Red Signals.",
        comparison: {
          rookie: "Ignores the homeowner looking at their watch or crossing their arms, and keeps pushing the pitch until the homeowner slams the door.",
          pro: "Pauses immediately when a red signal appears, addresses it politely, and either resets the trust or wraps up the visit."
        },
        narration: "Never ignore a red signal. Rookies keep talking until they get shut down. Pros address the discomfort, reset the rapport, or politely exit."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Recall a recent conversation you had. Identify at least two physical or verbal cues the other person gave and what they signaled about their engagement level.",
        narration: "Practice drill: recall a conversation from yesterday. What signals did the other person give? Write them down and categorize them."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Never mistake a vulnerable homeowner's confusion or politeness for consent. If a customer seems confused, overwhelmed, or unable to follow the math, do not proceed with the transaction.",
        narration: "Vulnerability check: politeness is not consent. If a homeowner seems confused or cannot follow the numbers, end the interaction immediately."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_2_4_1",
        type: "open_response",
        label: "Describe how you will address a homeowner who shows a 'Red' signal (e.g. arms folded, looking at their watch).",
        placeholder: "I will pause and say...",
        lines: 3
      },
      {
        id: "wb_core_2_4_2",
        type: "checklist",
        label: "Signal Commitment Checklist — confirm below:",
        items: [
          "I will not ignore crossed arms or avoiding eye contact.",
          "I will pause my presentation if I detect defensiveness.",
          "I will prioritize transparency over pushing through."
        ]
      }
    ],
    quiz: {
      title: "Module 2.4 Knowledge Check",
      questions: [
        {
          id: "q_core_2_4_1",
          question: "Which of the following is a classic 'Green' signal of homeowner interest?",
          options: [
            "Looking at their watch repeatedly and taking a step back.",
            "Asking specific questions about pricing, warranty, or installation timeline.",
            "Folding their arms tightly and giving short, one-word answers.",
            "Looking around the yard and ignoring your presence."
          ],
          correctAnswerIndex: 1,
          explanation: "Asking specific details about implementation (cost, time, warranty) indicates active interest and a willingness to explore further."
        },
        {
          id: "q_core_2_4_2",
          question: "What should you do when you detect strong 'Red' body language (e.g. tightly folded arms, avoiding eye contact)?",
          options: [
            "Speak louder and faster to capture their attention.",
            "Pause, address their skepticism politely, and give them an easy way to end the conversation.",
            "Ignore it and proceed with the slide deck.",
            "Demand that they pay attention to your presentation."
          ],
          correctAnswerIndex: 1,
          explanation: "Addressing red body language directly and politely disarms defensiveness and shows respect for the customer's comfort."
        }
      ]
    }
  },
  core_3_1: {
    id: "core_3_1",
    title: "Module 3.1: Discovery Before Pitching",
    subtitle: "Diagnose before you prescribe. Structure your discovery to uncover actual household problems.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Adopt a diagnostic framework. Learn how to hold a structured discovery session to understand the homeowner's circumstances before recommending any product or service.",
        narration: "Module three point one teaches discovery. You must act like a doctor: diagnose the problem before prescribing any solution."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "If you pitch your product before understanding the customer's specific needs, you are guessing. This makes your presentation generic and ineffective. Diagnosing first allows you to tailor your solution directly to their pain points.",
        narration: "If you pitch without discovery, you are just guessing. This makes your presentation look generic. Diagnostics let you solve actual problems."
      },
      {
        title: "Field Framework: The SPIN Diagnostic Sequence",
        type: "list",
        content: "Structure your discovery questions in this order:",
        items: [
          "Situation: Establish current facts (e.g., 'Who is your current utility provider?').",
          "Problem: Uncover dissatisfaction (e.g., 'Have you experienced unexpected spikes in your monthly bills?').",
          "Implication: Highlight the cost of the problem (e.g., 'If this rate increases again next year, how will that affect your budget?').",
          "Need-Payoff: Let them state the value of a solution (e.g., 'If we could lock in a fixed rate, what would that save you over time?')."
        ],
        narration: "Use the SPIN sequence: situation, problem, implication, and need-payoff. Let the customer explain the cost of the problem in their own words."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Rookie: 'Our system has 22% efficiency and is made of premium grade components! Let me show you how it works...'\n\nPro: 'Before we look at any systems, I want to understand your current setup. How has your experience been with your utility rates over the last year? Have you seen any unexpected rate jumps?'",
        narration: "Listen to the tracks. The rookie starts talking about efficiency ratings. The pro asks about utility rate history to find the financial pain point."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "The Premature Presentation.",
        comparison: {
          rookie: "Opens their tablet and starts showing product slides within 2 minutes of meeting the homeowner, before asking a single question.",
          pro: "Spends the first 10-15 minutes asking questions and taking notes, ensuring they fully understand the household needs before opening their presentation."
        },
        narration: "Avoid premature presentations. Rookies open their tablets immediately. Pros spend the first fifteen minutes asking questions."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Write down 3 'Situation' questions and 3 'Problem' questions for your vertical. Practice asking them in a relaxed, conversational tone.",
        narration: "Practice drill: write down three situation questions and three problem questions. Practice asking them in a calm tone."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Never exaggerate problems or make false claims about a customer's current systems. Keep your discovery factual and based on verified information.",
        narration: "Discovery compliance: keep it factual. Never exaggerate problems or make false claims about their current systems."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_3_1_1",
        type: "open_response",
        label: "Write down two 'Problem' questions designed to uncover homeowner dissatisfaction with their current service providers.",
        placeholder: "1. What is the most frustrating part about... 2. How often do you experience...",
        lines: 3
      },
      {
        id: "wb_core_3_1_2",
        type: "checklist",
        label: "Discovery Commitments — confirm below:",
        items: [
          "I will not present slides before asking discovery questions.",
          "I will document the customer's answers.",
          "I will use open-ended diagnostic questions."
        ]
      }
    ],
    quiz: {
      title: "Module 3.1 Knowledge Check",
      questions: [
        {
          id: "q_core_3_1_1",
          question: "Why should you ask discovery questions before presenting your solution?",
          options: [
            "To make the meeting take longer.",
            "To understand the customer's specific needs so you can tailor your presentation.",
            "To exhaust the customer so they are too tired to object.",
            "To show off how many questions you know."
          ],
          correctAnswerIndex: 1,
          explanation: "Understanding customer needs allows you to present a targeted, relevant solution that directly addresses their pain points."
        },
        {
          id: "q_core_3_1_2",
          question: "Which of the following is a 'Problem' question in the SPIN framework?",
          options: [
            "Who is your current electric provider?",
            "Have you noticed any unexpected spikes in your monthly bills?",
            "What is your home's total square footage?",
            "Where is your electrical panel located?"
          ],
          correctAnswerIndex: 1,
          explanation: "Spikes in monthly bills represents a point of dissatisfaction or pain, making this a classic 'Problem' question."
        }
      ]
    }
  },
  core_3_2: {
    id: "core_3_2",
    title: "Module 3.2: Pain, Priority, Timing, and Authority",
    subtitle: "Qualify prospects on key dimensions before spending hours on custom proposals.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Learn how to qualify prospects across four critical dimensions: Pain (Is there a real problem?), Priority (Is solving it important to them?), Timing (Do they want it solved soon?), and Authority (Can they make the decision?).",
        narration: "Module three point two covers qualification. We use the P-P-T-A framework to check pain, priority, timing, and authority."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Reps often waste hours building proposals for homeowners who are polite but have no budget priority, no real pain, or no authority to sign. Qualifying early protects your time and focuses your efforts on high-probability opportunities.",
        narration: "Do not waste time building proposals for people who cannot sign or don't care. Qualifying early keeps you focused on real buyers."
      },
      {
        title: "Field Framework: PPTA Qualification",
        type: "list",
        content: "Verify these four dimensions before moving to a formal presentation:",
        items: [
          "Pain: The homeowner must have a clear problem they want to resolve (e.g. rising bills, leaking roof, unreliable speed).",
          "Priority: The problem must be important enough for them to allocate attention or budget to solve it.",
          "Timing: They must want to address this within a reasonable timeframe (e.g. now, next month), not years in the future.",
          "Authority: You must be speaking with the actual homeowner/decision-maker. Never pitch a non-owner or tenant."
        ],
        narration: "Check pain, priority, timing, and authority. Always ensure you are speaking with the legal homeowner. Never pitch to tenants."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Checking Authority and Timing: 'Just to make sure we're respecting everyone's time — are you the sole owner of the property, or is there anyone else whose name is on the deed who usually looks over these types of adjustments? And if the numbers looked perfect, is this something you were hoping to handle this season, or are you just gathering info for down the road?'",
        narration: "Listen to the talk track. It checks both timing and authority in a polite, professional, conversational way."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Pitching to Non-Decision Makers.",
        comparison: {
          rookie: "Spends 45 minutes presenting to a tenant or a family member who has no authority to sign contracts, then gets frustrated when they can't make a decision.",
          pro: "Confirms ownership and decision-maker presence in the first few minutes, and reschedules if the key decision-makers are not present."
        },
        narration: "Do not pitch to non-decision makers. Rookies spend an hour pitching to a tenant. Pros confirm ownership in the first few minutes."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Practice asking the PPTA qualification questions in a soft, polite, conversational tone. Make sure it sounds natural, not like an interrogation.",
        narration: "Practice saying the PPTA check out loud. Focus on a warm, casual tone so it doesn't sound like an interrogation."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Always verify identity and ownership through public property records or direct verification. Never allow a non-owner to sign documents. Protect elderly or vulnerable homeowners from signing without family support.",
        narration: "Protect consumers: verify ownership using property records. Never allow a non-owner to sign, and protect vulnerable homeowners."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_3_2_1",
        type: "open_response",
        label: "Write a polite question to confirm if you are speaking with the legal property owner.",
        placeholder: "Just to make sure I have the right records, are you the...",
        lines: 3
      },
      {
        id: "wb_core_3_2_2",
        type: "checklist",
        label: "Qualification Commitments — confirm below:",
        items: [
          "I will verify property ownership before showing final terms.",
          "I will confirm timing expectations early in the conversation.",
          "I will not present proposals to tenants or non-owners."
        ]
      }
    ],
    quiz: {
      title: "Module 3.2 Knowledge Check",
      questions: [
        {
          id: "q_core_3_2_1",
          question: "What does the 'Authority' dimension in qualification refer to?",
          options: [
            "Having the loudest voice in the conversation.",
            "Speaking with the actual legal property owner(s) who can sign contracts.",
            "Representing a government agency at the door.",
            "Being an expert in the technical specs of the product."
          ],
          correctAnswerIndex: 1,
          explanation: "Authority means ensuring you are presenting to the legal property owners who have the right to sign contract documents."
        },
        {
          id: "q_core_3_2_2",
          question: "Why is it critical to check a homeowner's 'Priority' level early?",
          options: [
            "To determine if they are worth your time or just gathering info with no intent to act.",
            "To pressure them into spending money they don't have.",
            "To decide how much to markup the pricing.",
            "To see if they will give you a glass of water."
          ],
          correctAnswerIndex: 0,
          explanation: "Verifying priority ensures the customer has a real desire to solve the problem, rather than just wasting your time with no intent to act."
        }
      ]
    }
  },
  core_3_3: {
    id: "core_3_3",
    title: "Module 3.3: Asking Better Questions",
    subtitle: "Ditch closed-ended questions and master calibrated questions that prompt deep answers.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Learn how to formulate calibrated, open-ended questions. Avoid binary yes/no questions that stall conversation, and use 'How' and 'What' questions to encourage the homeowner to share their real thoughts.",
        narration: "Module three point three teaches calibrated questions. We want to avoid simple yes or no traps and get the homeowner talking."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Closed-ended questions ('Are you happy with your bill?') result in short, unhelpful answers ('Yes' or 'No'). Calibrated questions ('How have you been handling the rising utility costs?') require the customer to explain their perspective, giving you valuable diagnostic data.",
        narration: "Yes or no questions lead to dead ends. Calibrated questions starting with what or how encourage descriptive answers."
      },
      {
        title: "Field Framework: Calibrated Question Starters",
        type: "list",
        content: "Use these open-ended starters to build your discovery questions:",
        items: [
          "What is your biggest concern with...?",
          "How has that affected your monthly planning?",
          "What would an ideal solution look like for your family?",
          "How did you handle the last rate adjustment?",
          "What led you to look into this originally?"
        ],
        narration: "Use starters like: what is your concern, how has that affected you, what would look ideal, and how did you handle adjustments."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Closed Question: 'Is your electric bill too high?'\n\nCalibrated Question: 'What have you noticed about your monthly expenses during the peak summer months, and how has that impacted your budget?' (Encourages a detailed answer).",
        narration: "Listen to the difference. The closed question gets a quick 'yes'. The calibrated question gets them explaining their budget."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Using 'Why' Questions.",
        comparison: {
          rookie: "Asks 'Why haven't you fixed this yet?', which sounds accusatory and makes the homeowner feel defensive and judged.",
          pro: "Asks 'What has stood in the way of addressing this so far?', which is open-ended and disarms defensiveness."
        },
        narration: "Avoid asking 'Why'. It sounds accusatory. Instead, ask 'What has stood in the way of addressing this?' to keep it neutral."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Convert these 3 closed questions into calibrated open-ended questions:\n1. 'Do you want to save money?'\n2. 'Are you the owner?'\n3. 'Do you like your current service?'\nPractice saying your new questions out loud.",
        narration: "Drill time: rewrite three closed questions to start with what or how. Practice saying them out loud."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Do not use leading questions that steer the customer toward false answers (e.g. 'You probably hate your utility provider, right?'). Keep your questions objective and neutral.",
        narration: "Keep questions neutral. Do not lead the customer or force them to agree with biased statements."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_3_3_1",
        type: "open_response",
        label: "Convert the question: 'Are you satisfied with your internet speed?' into a calibrated question using 'What' or 'How'.",
        placeholder: "How would you describe your current connection when...",
        lines: 3
      },
      {
        id: "wb_core_3_3_2",
        type: "rating",
        label: "Rate your confidence in asking calibrated questions without using 'Why' (1 = low, 5 = high):",
        maxRating: 5
      }
    ],
    quiz: {
      title: "Module 3.3 Knowledge Check",
      questions: [
        {
          id: "q_core_3_3_1",
          question: "Which of the following is a calibrated, open-ended question?",
          options: [
            "Are you ready to sign the contract today?",
            "What would a successful outcome look like for your home energy setup?",
            "Do you like your current utility company?",
            "Is your monthly bill over $200?"
          ],
          correctAnswerIndex: 1,
          explanation: "Questions starting with 'What' or 'How' that require a descriptive answer are calibrated and open-ended."
        },
        {
          id: "q_core_3_3_2",
          question: "Why should you generally avoid starting questions with the word 'Why'?",
          options: [
            "It makes the question too long.",
            "It can sound accusatory and trigger homeowner defensiveness.",
            "It is grammatically incorrect in sales scripts.",
            "It leads to immediate sales closures."
          ],
          correctAnswerIndex: 1,
          explanation: "'Why' questions often make people feel they need to defend their choices, causing them to close up."
        }
      ]
    }
  },
  core_3_4: {
    id: "core_3_4",
    title: "Module 3.4: When to Disqualify",
    subtitle: "Identify red flags early and politely walk away from poor-fit prospects.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Learn how to spot deal-breakers early in the conversation. Your goal is to recognize when a prospect is a poor fit for your solution and politely end the interaction, saving time for both parties.",
        narration: "Module three point four covers disqualification. Learning when to walk away keeps your pipeline clean and saves your energy."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Wasting hours on a deal that will eventually cancel or fail engineering check is a major drain on resources. Polishing your disqualification skills increases your average deal quality and protects your conversion metrics.",
        narration: "Forcing a bad fit leads to cancellations and audits later. Disqualify early to keep your calendar open for real opportunities."
      },
      {
        title: "Field Framework: Universal Deal-Breakers",
        type: "list",
        content: "Be ready to walk away if you encounter these red flags:",
        items: [
          "Structural/Technical: The property has severe issues (e.g. heavy shade, rotting roof, outdated panels) that make installation unsafe or unprofitable.",
          "Financial: The homeowner has severe credit issues or cannot afford the basic program requirements.",
          "Behavioral: The customer is hostile, repeatedly dishonest, or demands unviable modifications.",
          "Vulnerability: The homeowner is elderly, confused, or unable to understand the contract terms. (Do not proceed under any circumstances)."
        ],
        narration: "Our deal-breakers include: technical issues, severe credit problems, hostile behavior, and customer vulnerability."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Polite Disqualification: 'Based on what we've looked at today, it looks like your home wouldn't qualify for this specific program due to [Red Flag]. I'd rather tell you that now than waste your time. I appreciate you opening the door and chatting with me. Have a wonderful rest of your day!'",
        narration: "If they don't qualify, tell them directly and politely, wish them a great day, and move to the next house."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Forcing a Bad Deal.",
        comparison: {
          rookie: "Tries to hide structural issues, credit warnings, or customer hesitations to force a contract through, leading to a cancellation or audit failure later.",
          pro: "Flags issues immediately, confirms fit, and walks away with integrity if the deal doesn't make sense for the customer or the company."
        },
        narration: "Never force a bad deal. Rookies hide credit warnings. Pros flag them immediately and walk away with integrity."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Practice delivering the polite disqualification talk track out loud 3 times. Ensure your voice sounds warm, respectful, and firm.",
        narration: "Practice saying the disqualification script. Keep your tone respectful, friendly, and firm."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Protect vulnerable consumers. If you suspect a customer does not have the capacity to make a complex financial decision due to age, cognitive decline, or language barriers, politely end the visit immediately.",
        narration: "Protect the vulnerable. If a homeowner has language barriers or cognitive decline, stop the meeting immediately."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_3_4_1",
        type: "open_response",
        label: "Describe how you will politely walk away if a homeowner does not meet technical requirements.",
        placeholder: "Based on the shade readings, it looks like...",
        lines: 3
      },
      {
        id: "wb_core_3_4_2",
        type: "checklist",
        label: "Disqualification Checklist — confirm below:",
        items: [
          "I will not hide technical or structural problems.",
          "I will respect elderly or vulnerable homeowners and step back.",
          "I will end poor-fit visits politely."
        ]
      }
    ],
    quiz: {
      title: "Module 3.4 Knowledge Check",
      questions: [
        {
          id: "q_core_3_4_1",
          question: "What is the most compliant response if you suspect a homeowner does not have the capacity to understand a financial agreement?",
          options: [
            "Speak slowly and use simple words to get the contract signed anyway.",
            "Politely decline to proceed and end the conversation immediately.",
            "Ask them to call a neighbor to sign for them.",
            "Ignore it and hope the company audit doesn't catch it."
          ],
          correctAnswerIndex: 1,
          explanation: "Proceeding with a customer who lacks cognitive capacity is a severe compliance violation. You must politely decline to proceed and end the conversation immediately."
        },
        {
          id: "q_core_3_4_2",
          question: "Why is disqualification considered a skill of top-performing sales reps?",
          options: [
            "It allows them to work fewer hours and take more breaks.",
            "It saves time by filtering out unviable deals, allowing focus on high-probability buyers.",
            "It helps them avoid talking to homeowners.",
            "It makes them look intimidating to their teammates."
          ],
          correctAnswerIndex: 1,
          explanation: "Filtering out poor-fit deals early prevents wasted time and energy, allowing reps to focus on homeowners who are ready, willing, and able to buy."
        }
      ]
    }
  },
  core_4_1: {
    id: "core_4_1",
    title: "Module 4.1: Why Objections Happen",
    subtitle: "Understand objections as requests for more information, not personal rejections.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Deconstruct the psychology of customer objections. Shift your perspective to see objections as natural checkpoints indicating interest, rather than barriers designed to end the meeting.",
        narration: "Module four point one covers objections. We want to view objections as requests for clarity rather than personal attacks."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Rookies view objections as combative signals and get defensive. Pros understand that if a homeowner had zero interest, they wouldn't ask questions or object — they would just close the door. An objection is often a request for reassurance.",
        narration: "Defensiveness kills trust. If they didn't care at all, they would just close the door. An objection means they are processing the offer."
      },
      {
        title: "Field Framework: The Origin of Objections",
        type: "list",
        content: "Objections typically stem from one of three areas:",
        items: [
          "Lack of Information: The customer doesn't understand how the system works or how the math makes sense.",
          "Lack of Trust: The customer is skeptical of your promises, your company, or the industry reputation.",
          "Fear of Change: The customer prefers their current status quo and fears making a wrong decision."
        ],
        narration: "Objections come from: lack of info, lack of trust, or fear of change. Understand the root cause to respond correctly."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Disarming Defensiveness: 'I appreciate you bringing that up. It makes total sense to be cautious. If I were in your shoes, I'd want to make sure the numbers were solid too. Let's look at the rate comparisons together so you can see where that comes from.'",
        narration: "Listen to the disarming track. It validates the hesitation first, and then offers to review the data together."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Arguing with the Customer.",
        comparison: {
          rookie: "Corrects the homeowner defensively, saying 'No, you're wrong, that's not how it works,' which destroys trust instantly.",
          pro: "Validates the concern first ('That makes sense...'), then shares information to clarify ('What we actually find is...')."
        },
        narration: "Never argue. Rookies tell the customer they are wrong. Pros validate the concern first, then share facts."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Practice validating an objection without agreeing with it. Use phrases like 'I understand why you'd say that,' or 'That's a very common concern.' Practice saying them out loud.",
        narration: "Drill: practice validation statements out loud. Try saying 'I understand why you'd say that' with real empathy."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Never brush off legitimate customer concerns with false assurances. If they ask a difficult compliance question, answer honestly or promise to find the official answer. Never guess.",
        narration: "Never guess. If you don't know the answer, be honest, find out, and get back to them. Never make up details."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_4_1_1",
        type: "open_response",
        label: "Write down an objective, disarming statement you will use when a homeowner expresses skepticism about your company.",
        placeholder: "It makes total sense to verify details. We have our...",
        lines: 3
      },
      {
        id: "wb_core_4_1_2",
        type: "checklist",
        label: "Validation Commitments — confirm below:",
        items: [
          "I will validate concerns before providing data.",
          "I will not correct the customer in an argumentative tone.",
          "I will treat objections as requests for clarity."
        ]
      }
    ],
    quiz: {
      title: "Module 4.1 Knowledge Check",
      questions: [
        {
          id: "q_core_4_1_1",
          question: "What is the real meaning behind most customer objections?",
          options: [
            "They dislike you personally and want you to leave.",
            "They need more clear information or reassurance before making a decision.",
            "They are testing your patience to see if you will get angry.",
            "They have already decided to buy and are wasting time."
          ],
          correctAnswerIndex: 1,
          explanation: "Objections are usually signals that the customer is interested but needs more clear data or reassurance to feel comfortable."
        },
        {
          id: "q_core_4_1_2",
          question: "What is the danger of arguing with a homeowner's objection?",
          options: [
            "It makes the presentation too short.",
            "It destroys trust and triggers immediate defensive closure.",
            "It is highly recommended by veteran closer reps.",
            "It has no impact on close rates."
          ],
          correctAnswerIndex: 1,
          explanation: "Arguing triggers defensiveness and ruins the consultative relationship, shutting down the conversation."
        }
      ]
    }
  },
  core_4_2: {
    id: "core_4_2",
    title: "Module 4.2: Price, Trust, Timing, and Partner Objections",
    subtitle: "Identify and respond to the four most common field sales objections.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Master responses for the 'Big Four' objections: Price ('It's too expensive'), Trust ('I don't know your company'), Timing ('Let me think about it'), and Partner ('I need to talk to my spouse').",
        narration: "Module four point two covers the Big Four objections: price, trust, timing, and partner. We need structured, calm responses for each."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "If you don't have structured, polite responses ready for these four objections, you will hesitate or sound rehearsed. Preparing clear reframing sequences allows you to respond with calm confidence.",
        narration: "Preparation removes hesitation. If you aren't prepared, you'll sound robotic. Practice makes your responses fluid."
      },
      {
        title: "Field Framework: The Big Four Responses",
        type: "list",
        content: "Use these frameworks to handle the primary objections:",
        items: [
          "Price: Reframe from initial cost to long-term value and ROI. Show the math of the cost of inaction.",
          "Trust: Share local references, company credentials, and reviews to transfer credibility.",
          "Timing: Validate their hesitation, but explain the utility rate timeline or current program deadlines without fabricating urgency.",
          "Partner: Respect the relationship. Never try to bypass a spouse. Offer to schedule a quick joint review so everyone gets the same info."
        ],
        narration: "For price, show long-term value. For trust, share references. For timing, explain rate schedules. For partners, respect the relationship."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Partner Objection Response: 'I completely respect that. We never want to move forward unless everyone is on the same page. Rather than trying to explain all this math second-hand, would it make sense if I popped back for 10 minutes when you're both home tomorrow evening?'",
        narration: "Listen to the spouse objection response. It respects the relationship and offers a brief joint meeting."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Pressuring the 'Think About It'.",
        comparison: {
          rookie: "Pushes hard, saying 'What is there to think about? The savings are obvious!' which makes the customer feel cornered.",
          pro: "Validates the hesitation: 'That makes sense. It's a big decision. What specific part of the math are you most unsure about right now?'"
        },
        narration: "Do not pressure timing. Rookies push hard, causing defensiveness. Pros ask what specific part of the math is unclear."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Write down your customized response to the objection: 'We need to think about it.' Practice saying it in a calm, consultative voice. Time your delivery.",
        narration: "Practice drill: write down your response to 'let me think about it'. Practice it until you sound relaxed."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Do not fabricate fake deadlines or claim that a program is 'ending immediately' to force a timing decision. State the true rate escalation schedules and official program boundaries.",
        narration: "Compliance check: never claim a program is ending immediately unless it is documented. Explain rate schedules and program boundaries honestly."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_4_2_1",
        type: "open_response",
        label: "Write down a custom response to the price objection: 'This is too expensive'.",
        placeholder: "I understand. If we look at the monthly offsets...",
        lines: 3
      },
      {
        id: "wb_core_4_2_2",
        type: "checklist",
        label: "Objection Handling Commitments — confirm below:",
        items: [
          "I will not bypass spouses or other key decision-makers.",
          "I will explain pricing structures with absolute transparency.",
          "I will avoid high-pressure timeline threats."
        ]
      }
    ],
    quiz: {
      title: "Module 4.2 Knowledge Check",
      questions: [
        {
          id: "q_core_4_2_1",
          question: "What is the best way to handle a 'Partner' objection?",
          options: [
            "Tell the homeowner they should make their own decisions.",
            "Respect the partnership and offer to schedule a brief joint review.",
            "Rush them to sign before their partner returns.",
            "Ignore the objection and keep presenting."
          ],
          correctAnswerIndex: 1,
          explanation: "Respecting joint decision-making and offering a joint presentation builds trust and reduces post-sale cancellations."
        },
        {
          id: "q_core_4_2_2",
          question: "Which of the following is a compliant response to a timing objection?",
          options: [
            "This program ends in 5 minutes, so you must sign right now.",
            "I understand. What specific detail of the system are you most unsure about?",
            "If you don't sign today, I can't guarantee your utility won't shut off your power.",
            "You don't need to think, the math is simple."
          ],
          correctAnswerIndex: 1,
          explanation: "Asking a calibrated question to identify the root of their hesitation is effective and fully compliant."
        }
      ]
    }
  },
  core_4_3: {
    id: "core_4_3",
    title: "Module 4.3: Reframing Without Arguing",
    subtitle: "Use Feel-Felt-Found and negative reverse techniques to guide homeowner perspective.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Master perspective reframing. Learn how to use the 'Feel-Felt-Found' sequence and 'Negative Reverse' questions to guide the homeowner's perspective without triggering defensive arguments.",
        narration: "Module four point three covers reframing. We use Feel Felt Found and Negative Reverses to guide their view gently."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "When you tell a customer they are wrong, their brain registers a threat and shuts down. Reframing techniques allow you to introduce new information by validating their perspective first, maintaining a cooperative environment.",
        narration: "If you tell them they are wrong, they shut down. Reframing validates their feelings first, opening their minds to new data."
      },
      {
        title: "Field Framework: Two Key Reframing Techniques",
        type: "list",
        content: "Apply these two techniques when objections arise:",
        items: [
          "Feel-Felt-Found: 1. Validate: 'I understand how you feel.' 2. Normalize: 'Many of your neighbors felt the same way.' 3. Reframe: 'What they found was after checking the tier rates, this actually offset the cost.'",
          "Negative Reverse: Softly agree with the hesitation to prompt the customer to defend the solution. 'You're right, this program isn't a fit for every home. What specifically makes you feel it wouldn't work for yours?'"
        ],
        narration: "Feel Felt Found normalizes concerns. Negative Reverse softly agrees to get the customer explaining their specific doubt."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Using Feel-Felt-Found: 'I appreciate that, and I understand how you feel about contract commitments. Many of the families on this street felt the same way when we first talked. What they found was that by locking in their tier rate, they actually protected their budget from future increases.'",
        narration: "Listen to the Feel Felt Found sequence. It starts with validation, moves to social proof, and ends with the reframe."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Sounding Insincere.",
        comparison: {
          rookie: "Rushes through the 'feel-felt' part like a robotic script, sounding fake and manipulative.",
          pro: "Delivers the validation slowly, with real empathy and steady eye contact, before sharing the neighbor's experience."
        },
        narration: "Do not sound insincere. Rookies rush the script. Pros deliver validation slowly, with eye contact and empathy."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Write a custom Feel-Felt-Found response to: 'Your service sounds too good to be true.' Practice delivering it in a warm, friendly tone.",
        narration: "Practice drill: write a Feel Felt Found response to skepticism. Practice speaking it in a warm voice."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "When using 'Found' in Feel-Felt-Found, refer to actual customer experiences and documented program benefits. Do not invent fake success stories or exaggerated numbers.",
        narration: "Found safety: always use real customer cases. Never invent success stories or exaggerate numbers."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_4_3_1",
        type: "open_response",
        label: "Write a Feel-Felt-Found response to: 'I don't want to sign a long-term agreement.'",
        placeholder: "I understand how you feel... Many of your neighbors felt... What they found...",
        lines: 4
      },
      {
        id: "wb_core_4_3_2",
        type: "checklist",
        label: "Reframing Commitments — confirm below:",
        items: [
          "I will validate the customer's feeling before reframing.",
          "I will use real verified cases in my examples.",
          "I will not use argumentative statements."
        ]
      }
    ],
    quiz: {
      title: "Module 4.3 Knowledge Check",
      questions: [
        {
          id: "q_core_4_3_1",
          question: "What is the second step in the Feel-Felt-Found framework?",
          options: [
            "Tell the customer they are wrong.",
            "Explain what previous customers 'Felt' to normalize the concern.",
            "Close the deal immediately.",
            "Demand to see their tax records."
          ],
          correctAnswerIndex: 1,
          explanation: "The second step ('Felt') validates the concern by showing that other reasonable people had the exact same hesitation before."
        },
        {
          id: "q_core_4_3_1a",
          question: "Which of the following is a 'Negative Reverse' question?",
          options: [
            "Why haven't you signed this yet?",
            "You're right, this program isn't a fit for every home. What makes you feel it wouldn't work for yours?",
            "If you sign now, I can give you a discount.",
            "Do you want to save money or not?"
          ],
          correctAnswerIndex: 1,
          explanation: "This question validates the customer's doubt and invites them to explain their specific perspective in detail."
        }
      ]
    }
  },
  core_4_4: {
    id: "core_4_4",
    title: "Module 4.4: Turning Resistance Into Next Steps",
    subtitle: "Use soft close techniques and trial closes to test readiness and schedule proposals.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Master the transition from objection handling to scheduling next steps. Learn how to use trial closes to verify if the objection is resolved, and transition to scheduling a proposal session.",
        narration: "Module four point four covers transitions. After resolving an objection, you must verify their readiness with a trial close."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Reps often resolve an objection but then freeze, failing to transition back to the sales process. This allows the conversation to stall. Using trial closes helps you check readiness and advance the deal naturally.",
        narration: "Do not let the deal stall. Once an objection is handled, verify it and move back into the diagnostic timeline."
      },
      {
        title: "Field Framework: The Resolution Loop",
        type: "list",
        content: "Follow this loop to transition out of an objection:",
        items: [
          "1. Resolve: Address the specific objection using a reframing framework.",
          "2. Verify (Trial Close): Ask: 'Does that clear up the concern about the warranty?' or 'Does that math make sense?'",
          "3. Wait: Listen to confirm they are comfortable with the explanation.",
          "4. Advance: Transition back to the next step: 'Perfect. Based on that, let's look at the next stage...'"
        ],
        narration: "The Resolution Loop: resolve the concern, verify resolution, wait for confirmation, and advance the conversation."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "The Transition: '...so the program handles maintenance at zero extra cost. Does that address your concern about unexpected repairs? (Homeowner nods) Okay, great. The next step is simply to verify your baseline tiers. Let's see if we can pull that up.'",
        narration: "Listen to the transition. It resolves the repair concern, verifies fit, and slides back into discovery."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Leaving Objections Unverified.",
        comparison: {
          rookie: "Assumes the objection is resolved and keeps talking, without confirming if the homeowner actually agreed, leaving hidden doubts.",
          pro: "Asks a clear verification question, listens for a sincere 'yes', and resolves any remaining doubts before moving forward."
        },
        narration: "Do not assume resolution. Rookies keep talking. Pros check with a trial close to ensure the doubt is fully gone."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Practice the 4-step Resolution Loop out loud. Focus on transition speed; pause and wait for the customer's nod before moving to step 4.",
        narration: "Drill: run through the Resolution Loop. Make sure you pause to get a physical nod before advancing."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Never use trial closes to lock in commitments the customer is not ready to make. Ensure they understand they are agreeing to review options, not signing a final purchase agreement.",
        narration: "Transition compliance: make sure they know they are agreeing to check fit, not committing to a final contract."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_4_4_1",
        type: "open_response",
        label: "Write a trial close question to test if a pricing objection is resolved.",
        placeholder: "Does that outline make you feel more comfortable about the...",
        lines: 3
      },
      {
        id: "wb_core_4_4_2",
        type: "checklist",
        label: "Transition Commitments — confirm below:",
        items: [
          "I will verify concern resolution with a trial close.",
          "I will pause for a physical or verbal confirmation.",
          "I will keep the transition simple and clear."
        ]
      }
    ],
    quiz: {
      title: "Module 4.4 Knowledge Check",
      questions: [
        {
          id: "q_core_4_4_1",
          question: "What is the purpose of a 'Trial Close' after resolving an objection?",
          options: [
            "To force the customer to sign the final contract.",
            "To verify if the customer's concern is truly resolved before moving forward.",
            "To end the meeting and leave the house.",
            "To prove that you are smarter than the customer."
          ],
          correctAnswerIndex: 1,
          explanation: "A trial close verifies if the objection is resolved, preventing unresolved concerns from blocking the final decision."
        },
        {
          id: "q_core_4_4_2",
          question: "What is the correct action if a homeowner says 'No' to your trial close question?",
          options: [
            "Ignore them and move to the next slide.",
            "Ask further questions to clarify what doubt remains.",
            "Terminate the meeting immediately.",
            "Tell them they are wrong and present the math again."
          ],
          correctAnswerIndex: 1,
          explanation: "If they say no, doubts remain. You must pause and ask calibrated questions to understand and resolve the concern."
        }
      ]
    }
  },
  core_5_1: {
    id: "core_5_1",
    title: "Module 5.1: The Ethical Close",
    subtitle: "Confirm decisions without manipulation, pressure, or false promises.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Learn how to ask for the order with absolute integrity. Master the confirmation close, which summarizes agreed value points and asks a direct question, avoiding aggressive closing techniques.",
        narration: "Module five point one covers the close. We focus on the confirmation close, summarizing agreed facts to secure a natural decision."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "High-pressure closing tactics lead to buyer's remorse and high cancellation rates. An ethical close is built on the agreements made during discovery. It feels like a natural next step, protecting the relationship and preventing post-purchase cancellations.",
        narration: "High pressure leads directly to buyer's remorse and cancellations. A natural close built on agreements protects both you and the customer."
      },
      {
        title: "Field Framework: The Confirmation Close Sequence",
        type: "list",
        content: "Execute the confirmation close in four clear steps:",
        items: [
          "1. Summarize: Recapitulate their key problems (e.g. 'We agreed your bill is jumping into tier-three...').",
          "2. Align: Restate how the solution solves those problems (e.g. 'And this tier stabilizer eliminates that surcharge...').",
          "3. Check: Ask: 'Does everything we've looked at today make sense for your home?'",
          "4. Direct Question: 'Based on that, does it make sense to move forward with the application today?'"
        ],
        narration: "Steps for the close: summarize the pain points, align the solution features, check if it makes sense, and ask if they are ready to submit."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "The Close: 'To summarize what we've seen: we wanted to address the tier-three spikes, stabilize your rate, and ensure the warranty covered maintenance. This proposal does all three at [Price]. Based on everything we've reviewed, does it make sense to submit the paperwork today?'",
        narration: "Listen to the confirmation close. It focuses entirely on their priorities and asks a direct, professional question."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "The Bait and Switch.",
        comparison: {
          rookie: "Hides fees, financing terms, or escalator details until the very last page, hoping to slide them past the customer during signing.",
          pro: "Discloses all terms, escalators, and fees clearly throughout the presentation, ensuring the customer has full transparency before signing."
        },
        narration: "Never hide terms. Rookies slide escalators and fees onto the last page. Pros keep all terms fully transparent throughout."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Practice delivering the 4-step Confirmation Close out loud. Focus on keeping your voice calm, steady, and at a conversational volume.",
        narration: "Drill: practice the close sequence. Keep your voice quiet, calm, and conversational. Do not sound excited or pushy."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Always explain the 3-day right of rescission (cancellation window) clearly. Never rush a customer through documents, and never tell them to sign without reading.",
        narration: "Ethics warning: always explain their cancellation rights. Give them ample time to read everything before signing."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_5_1_1",
        type: "open_response",
        label: "Write your custom confirmation close script, summarizing agreed value points.",
        placeholder: "Based on our discussion, we wanted to address... and this system...",
        lines: 4
      },
      {
        id: "wb_core_5_1_2",
        type: "checklist",
        label: "Closing Commitments — confirm below:",
        items: [
          "I will disclose cancellation window rights explicitly.",
          "I will explain all terms, fees, and interest rates.",
          "I will not rush the contract review process."
        ]
      }
    ],
    quiz: {
      title: "Module 5.1 Knowledge Check",
      questions: [
        {
          id: "q_core_5_1_1",
          question: "Which of the following describes an ethical close?",
          options: [
            "Creating artificial urgency to force a decision.",
            "Summarizing agreed pain points and asking a direct, low-pressure question.",
            "Hiding the final price until the customer has agreed to sign.",
            "Refusing to leave the home until the contract is signed."
          ],
          correctAnswerIndex: 1,
          explanation: "An ethical close summarizes agreed facts and asks a direct question, respecting customer autonomy."
        },
        {
          id: "q_core_5_1_2",
          question: "What is the 'Right of Rescission' that must be disclosed?",
          options: [
            "The company's right to change prices at any time.",
            "The customer's legal right to cancel the agreement within a specific window (typically 3 business days).",
            "The rep's right to assign the contract to another technician.",
            "The utility company's right to audit the installation."
          ],
          correctAnswerIndex: 1,
          explanation: "The Right of Rescission is the consumer's legal protection to cancel a contract within a cooling-off window (usually 3 days)."
        }
      ]
    }
  },
  core_5_2: {
    id: "core_5_2",
    title: "Module 5.2: Setting the Next Step",
    subtitle: "Prevent buyer's remorse by setting clear expectations for installation and support.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Master the post-close conversation. Learn how to outline the exact timeline for site assessment, permit approval, and installation, lowering post-purchase anxiety and reducing cancellations.",
        narration: "Module five point two covers the post-close. Setting clear timeline expectations is the best way to prevent buyer's remorse."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Buyer's remorse happens when a customer signs a contract and then hears nothing for weeks. This silence causes anxiety and leads to cancellations. Setting clear expectations immediately after the close protects the transaction.",
        narration: "Customer silence breeds anxiety. If they don't know what is happening, they cancel. Walk them through the roadmap before you leave."
      },
      {
        title: "Field Framework: The Post-Close Walkthrough",
        type: "list",
        content: "Establish these milestones with the customer before leaving:",
        items: [
          "Site Check: Explain when the site auditor will arrive and what they will inspect.",
          "Permits: Outline the local municipal or utility approval process and expected wait times.",
          "Installation: Share a realistic range for the installation window.",
          "Point of Contact: Give them your business card and explain how they will receive status updates."
        ],
        narration: "Set clear milestones: the technical site check, municipal permit submittal, realistic install window, and contact info."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Setting Expectations: 'Congratulations! We've submitted the setup. Here is what happens next: First, our site check team will contact you within 48 hours to schedule a 30-minute property review. After that, we submit for municipal permits, which typically takes 2-3 weeks. I will call you every Friday with an update so you're never in the dark.'",
        narration: "Listen to the walkthrough talk track. It outlines timelines, details the technical steps, and promises weekly updates."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "The Ghost Run.",
        comparison: {
          rookie: "Grabs the signature, packs up their tablet as fast as possible, and runs out the door, leaving the customer feeling abandoned and anxious.",
          pro: "Spends an extra 10 minutes walking through the next steps, answering final questions, and ensuring the customer feels comfortable and supported."
        },
        narration: "Do not ghost. Rookies run out the door right after signing. Pros spend ten minutes checking comfort and explaining timelines."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Practice delivering the next-steps talk track out loud. Focus on keeping your pace slow and reassuring.",
        narration: "Practice drill: practice explaining the site check and permit steps slowly. Reassure the customer."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Do not promise unrealistic installation dates to make the close feel better. Always state the verified average timeline, including potential municipal or weather delays.",
        narration: "Timeline compliance: never promise fake dates. Share average timelines including potential permit or weather delays."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_5_2_1",
        type: "open_response",
        label: "Write down the timeline of milestones for your specific program, including disclaimers.",
        placeholder: "1. Agreement submission... 2. Site Check (approx 3 days)...",
        lines: 3
      },
      {
        id: "wb_core_5_2_2",
        type: "checklist",
        label: "Expectation Commitments — confirm below:",
        items: [
          "I will state standard timelines, not best-case scenarios.",
          "I will leave my card and explain the update schedule.",
          "I will answer post-close questions patiently."
        ]
      }
    ],
    quiz: {
      title: "Module 5.2 Knowledge Check",
      questions: [
        {
          id: "q_core_5_2_1",
          question: "When does buyer's remorse typically occur?",
          options: [
            "Before the presentation starts.",
            "Immediately after the close, when the rep leaves and there is no communication.",
            "During the diagnostic discovery phase.",
            "After the system has been running successfully for a year."
          ],
          correctAnswerIndex: 1,
          explanation: "Buyer's remorse happens post-close, especially if the representative vanishes and leaves the customer in the dark about next steps."
        },
        {
          id: "q_core_5_2_2",
          question: "What is a major mistake rookie reps make after securing a signature?",
          options: [
            "Leaving direct contact details with the customer.",
            "Hurrying out the door immediately without outlining next steps.",
            "Explaining municipal permit timelines.",
            "Answering final questions patiently."
          ],
          correctAnswerIndex: 1,
          explanation: "Rushing away makes you look transactional. Spending time to outline next steps is key to preventing cancellations."
        }
      ]
    }
  },
  core_5_3: {
    id: "core_5_3",
    title: "Module 5.3: Follow-Up Discipline",
    subtitle: "Manage your pipeline, organize callbacks, and build a consistent pipeline.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Establish follow-up habits. Learn how to categorize leads, set up a callback calendar, and nurture relationships with interested prospects who weren't ready to buy on the first visit.",
        narration: "Module five point three covers follow-up discipline. Consistent callbacks build a predictable sales pipeline."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Over 50% of direct sales deals require multiple touchpoints. If you only focus on 'one-stop closes' and neglect your follow-up pipeline, you leave half your potential income on the table. Consistent follow-up builds a predictable business.",
        narration: "Half of your deals will require multiple touchpoints. If you only chase immediate closes, you lose half your revenue. Nurture your pipeline."
      },
      {
        title: "Field Framework: The Follow-Up Schedule",
        type: "list",
        content: "Nurture your pipeline with these structured follow-ups:",
        items: [
          "The 24-Hour Follow-Up: Send a short text or email thanking them for their time and summarizing the key points discussed.",
          "The Weekly Check-in: For warm prospects, touch base once a week with a new piece of information (e.g. rate updates, local install photo).",
          "The Monthly Reset: For cold prospects, check in once a month to verify if their circumstances or utility costs have changed.",
          "The CRM Status: Keep your pipeline database updated daily. Never rely on memory for callback times."
        ],
        narration: "Our follow-up structure includes: a twenty-four hour thank-you text, a weekly check-in with new info, and daily CRM status updates."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "The Polite Follow-Up: 'Hi [Name], this is [Your Name] from SeptiVolt. I saw that the utility rate adjustment we discussed went into effect this week. Just wanted to see if you had any questions on that comparison sheet we put together. Let me know if you want to touch base for 5 minutes.'",
        narration: "Listen to the callback talk track. It shares a specific update and asks if they have questions, avoiding pressure."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Spamming the Customer.",
        comparison: {
          rookie: "Calls and texts multiple times a day without providing value, annoying the prospect and causing them to block the number.",
          pro: "Follows a structured, respectful calendar, always providing a specific reason or piece of information with each contact."
        },
        narration: "Do not spam. Rookies call every day without reason. Pros follow a respectful callback calendar with value-adds."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Draft a 3-touchpoint follow-up sequence (text message template, email template, phone call script) for a warm prospect. Keep it conversational.",
        narration: "Drill: write out a thank-you text and a weekly check-in text. Practice typing them cleanly."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Always respect 'Do Not Call' requests and opt-out preferences. If a customer requests to be removed from your contact list, update your CRM immediately and do not contact them again.",
        narration: "DNC list compliance: if a customer opts out, remove them from CRM immediately. Never message them again."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_5_3_1",
        type: "open_response",
        label: "Draft a brief thank-you text message template for homeowners who met with you but did not buy.",
        placeholder: "Hi [Name], thanks for the conversation today...",
        lines: 3
      },
      {
        id: "wb_core_5_3_2",
        type: "checklist",
        label: "Follow-Up Commitments — confirm below:",
        items: [
          "I will log all field leads in CRM daily.",
          "I will respect DNC lists and customer opt-outs.",
          "I will provide value in every callback."
        ]
      }
    ],
    quiz: {
      title: "Module 5.3 Knowledge Check",
      questions: [
        {
          id: "q_core_5_3_1",
          question: "What is a key rule of professional follow-up?",
          options: [
            "Call the prospect multiple times a day until they answer.",
            "Space out contact and always provide new value or information.",
            "Only contact them if they call you first.",
            "Use a different phone number each time to trick them."
          ],
          correctAnswerIndex: 1,
          explanation: "Nurturing a lead requires respectful intervals and providing relevant information to keep the conversation productive."
        },
        {
          id: "q_core_5_3_2",
          question: "What must you do if a prospect requests to be placed on the Do Not Call (DNC) list?",
          options: [
            "Wait a week and call them again anyway.",
            "Respect the request and update the CRM immediately to prevent further contact.",
            "Argue with them about their right to privacy.",
            "Send a colleague to knock on their door instead."
          ],
          correctAnswerIndex: 1,
          explanation: "Respecting DNC requests is a legal requirement. You must update your database immediately to halt all outbound outreach."
        }
      ]
    }
  },
  core_5_4: {
    id: "core_5_4",
    title: "Module 5.4: Personal Scorecard and Daily Improvement",
    subtitle: "Track your canvassing metrics and implement daily micro-refinements to build consistency.",
    sections: [
      {
        title: "Objective",
        type: "text",
        content: "Establish a system of metrics tracking. Learn how to log doors knocked, conversations started, proposals scheduled, and closed deals to identify and fix bottlenecks in your personal sales funnel.",
        narration: "Module five point three covers scorecards. By tracking knocks, conversations, and appointments, you find bottlenecks."
      },
      {
        title: "Why This Matters",
        type: "text",
        content: "Reps who don't track metrics are flying blind. They know they aren't making sales, but they don't know why. Tracking your numbers reveals the exact bottleneck (e.g. poor opener, weak discovery, low closing ratio), allowing you to focus your practice where it is needed.",
        narration: "Reps without metrics are flying blind. If you don't know your conversion rates, you can't improve your performance."
      },
      {
        title: "Field Framework: The Canvassing Funnel Metrics",
        type: "list",
        content: "Track these four core numbers every day:",
        items: [
          "1. Doors Knocked: The foundation of your input. (Target: 30-40 per shift).",
          "2. Conversations Started: How many homeowners opened the door and listened to your opener. (Target: 10-15).",
          "3. Presentations Scheduled/Held: How many went through discovery. (Target: 2-3).",
          "4. Closed Deals/Next Steps Confirmed: The final output. (Target: 1-2 per week minimum)."
        ],
        narration: "Track these numbers: doors knocked, conversations started, presentations scheduled, and finalized sales."
      },
      {
        title: "Example Talk Track",
        type: "quote",
        content: "Analyzing Funnel Bottlenecks:\n- High Knocks, Low Conversations → Work on your door approach, timing, and initial presence.\n- High Conversations, Low Presentations → Work on your permission openers and discovery questions.\n- High Presentations, Low Closes → Work on your qualification, objection handling, and confirmation close.",
        narration: "Look at your funnel: high knocks but low conversations means presence issues. High conversations but low bookings means discovery issues."
      },
      {
        title: "Common Mistake to Avoid",
        type: "comparison",
        content: "Relying on Feelings.",
        comparison: {
          rookie: "Says 'I had a terrible day, nobody wants to buy,' based on a few bad rejections, without knowing their actual knock-to-conversation ratio.",
          pro: "Says 'I knocked 40 doors, had 12 conversations, and booked 2 appointments. The data shows my average ratios are holding,' keeping a calm perspective."
        },
        narration: "Do not rely on feelings. Rookies complain that no one is buying. Pros look at the knock-to-appointment data calmly."
      },
      {
        title: "Practice Drill",
        type: "text",
        content: "Create a simple scorecard on paper or your phone: Columns for Knocks, Conversations, Presentations, and Closes. Log your mock numbers for the last week to practice calculations.",
        narration: "Practice scorecard setup: draw a simple matrix and log your numbers. Calculate your daily ratios."
      },
      {
        title: "Compliance & Integrity Reminder",
        type: "text",
        content: "Never log false metrics or claim to have knocked doors that you did not. Accurate reporting maintains trust with your team and helps managers provide useful coaching.",
        narration: "Log honestly: falsifying metrics prevents managers from giving accurate coaching and violates team integrity rules."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_core_5_4_1",
        type: "open_response",
        label: "Examine your funnel metrics: If you knock 120 doors, start 30 conversations, and book 3 presentations, what is your knock-to-conversation conversion percentage?",
        placeholder: "Knock-to-conversation conversion percentage is...",
        lines: 3
      },
      {
        id: "wb_core_5_4_2",
        type: "checklist",
        label: "Metrics Tracking Commitments — confirm below:",
        items: [
          "I will record my canvassing numbers every shift.",
          "I will analyze my pipeline ratios weekly.",
          "I will report metrics honestly to my sales manager."
        ]
      }
    ],
    quiz: {
      title: "Module 5.4 Knowledge Check",
      questions: [
        {
          id: "q_core_5_4_1",
          question: "If a rep has high doors knocked but very low conversations, what area should they focus on?",
          options: [
            "Their final closing contract scripts.",
            "Their physical door presence, spacing, stance, and initial opener.",
            "Their complex financial math presentations.",
            "Their follow-up email templates."
          ],
          correctAnswerIndex: 1,
          explanation: "Low conversation rates from a high number of knocks suggests issues with getting homeowners to listen, which is tied to presence and the initial opener."
        },
        {
          id: "q_core_5_4_2",
          question: "Why is tracking your sales funnel metrics critical?",
          options: [
            "It gives you something to do when you aren't knocking.",
            "It reveals the exact bottleneck in your sales process so you can make targeted improvements.",
            "It is required by municipal door-knocking laws.",
            "It automatically guarantees you will make a sale."
          ],
          correctAnswerIndex: 1,
          explanation: "Data reveals where you are losing prospects, allowing you to focus your practice and training on the specific bottleneck."
        }
      ]
    }
  }
}

/** Module → Scenario mapping for Core Sales (empty until simulations are built) */
export const CORE_SALES_MODULE_SCENARIOS: Record<string, string[]> = {}
