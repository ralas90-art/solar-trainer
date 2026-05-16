export const en = {
  funnel: {
    title: "Solar Sales Training Assessment",
    module: "Module",
    
    cta: {
      previous: "PREVIOUS STEP",
      next: "CONTINUE",
      generate: "GENERATE RESULTS",
      individual_access: "GET INDIVIDUAL ACCESS",
      learn_more: "LEARN MORE",
      book_demo: "BOOK TEAM DEMO",
      team_license: "REQUEST TEAM LICENSE",
      strategy_call: "BOOK STRATEGY CALL",
      spanish_interest: "SPANISH TRAINING INTEREST",
      custom_quote: "REQUEST CUSTOM QUOTE"
    },

    resume: {
      title: "Welcome Back",
      description: "We found your previous assessment progress. Would you like to resume where you left off?",
      cta_resume: "RESUME ASSESSMENT",
      cta_fresh: "START FRESH"
    },

    final_step: {
      title: "Final Step: Lead Activation",
      subtitle: "Who should we send the results to?",
      description: "Enter your details to generate your performance score and custom training path."
    },

    form: {
      first_name: "First Name",
      first_name_placeholder: "Enter your first name",
      last_name: "Last Name",
      last_name_placeholder: "Enter your last name",
      email: "Email Address",
      email_placeholder: "name@company.com",
      phone: "Phone Number",
      phone_placeholder: "(555) 000-0000",
      company: "Company Name (Optional)",
      company_placeholder: "Your Company"
    },

    already_submitted: "You have already submitted this assessment. Redirecting to your results...",
    error_generic: "Something went wrong. Please check your connection and try again.",
    
    // Questions
    questions: {
      lead_type: {
        text: "How would you describe your current role?",
        options: {
          rep: "Individual Solar Rep",
          manager: "Sales Manager",
          owner: "Dealer / EPC Owner",
          recruiter: "Recruiting / Onboarding Team"
        }
      },
      team_size: {
        text: "What is the size of your team?",
        options: {
          "1": "Just me",
          "2-5": "2–5 reps",
          "6-15": "6–15 reps",
          "16-50": "16–50 reps",
          "50+": "50+ reps"
        }
      },
      experience: {
        text: "What is your team's average experience level?",
        options: {
          new: "Brand new",
          "0-3": "0–3 months",
          "3-12": "3–12 months",
          "1y+": "1+ year",
          mixed: "Mixed team"
        }
      },
      gap: {
        text: "What is your biggest training gap right now?",
        options: {
          prospecting: "Door knocking / Prospecting",
          objections: "Handling objections",
          bills: "Explaining utility bills",
          finance: "Explaining financing",
          closing: "Closing deals",
          "post-sale": "Post-sale communication",
          onboarding: "Recruiting and onboarding"
        }
      },
      language: {
        text: "What are your primary language needs?",
        options: {
          en: "English",
          es: "Spanish",
          both: "Both (English & Spanish)"
        }
      },
      process: {
        text: "Describe your current training process.",
        options: {
          none: "No formal training",
          shadowing: "Shadowing only",
          pdfs: "Zoom calls / PDFs",
          internal: "Internal training system",
          need_better: "We need a better system"
        }
      },
      urgency: {
        text: "When are you looking to start training?",
        options: {
          now: "Immediately",
          month: "This month",
          "60d": "Next 30–60 days",
          research: "Just researching"
        }
      },
      interest: {
        text: "What interests you most about SeptiVolt?",
        options: {
          individual: "Individual access",
          team: "Team license",
          demo: "Demo",
          spanish: "Spanish training",
          "white-label": "White-label / company version"
        }
      },
      business_intel: {
        text: "Help us refine your results (Optional)",
        options: {
          crm: "Which CRM do you use?",
          volume: "Monthly install volume?",
          structure: "Team structure (Setters/Closers)?"
        }
      }
    },

    // Results
    results: {
      complete: "Readiness Assessment Complete",
      your_path: "Your Optimal Path",
      maturity_label: "Maturity",
      confidence_label: "Confidence",
      gaps_label: "Gaps Identified",
      insights_label: "Insights & Opportunities",
      status_label: "Status",
      verified: "VERIFIED",
      detected: "DETECTED",
      no_weaknesses: "No critical gaps detected. Excellent foundation!",
      no_insights: "Keep optimizing to maintain your competitive edge.",
      tracks: {
        individual: {
          title: "Individual Performance Track",
          desc: "Optimized for {maturity}s seeking elite closing mastery and objection handling precision."
        },
        team: {
          title: "Strategic Team Accelerator",
          desc: "Designed for {maturity}s requiring structural training deployment and high-fidelity analytics."
        },
        bilingual: {
          title: "Bilingual Growth Track",
          desc: "Full Spanish-enabled curriculum mapping for {maturity}s operating in high-growth markets."
        },
        enterprise: {
          title: "Enterprise Ecosystem",
          desc: "Custom white-label infrastructure for {maturity}s managing multi-state organizations."
        }
      },
      maturity_levels: {
        BEGINNER: "Beginner Rep",
        DEVELOPING: "Developing Closer",
        SCALING: "Scaling Team",
        ENTERPRISE: "Enterprise Organization",
        BILINGUAL: "Bilingual Expansion Team"
      },
      maturity_explanations: {
        BEGINNER: "Initial focus on prospecting and solar sales fundamentals.",
        DEVELOPING: "Transitioning towards technical closing and advanced objection handling.",
        SCALING: "Implementing team systems and volume optimization.",
        ENTERPRISE: "Full enterprise infrastructure with automated processes.",
        BILINGUAL: "Strategic expansion into high-ROI Hispanic markets."
      },
      weaknesses: {
        infrastructure: "Lack of formal training infrastructure",
        onboarding: "Inefficient recruiting/onboarding pipeline",
        scaling: "Enterprise scaling without systemic automation"
      },
      insights: {
        white_label: "You are ready for a full white-label ecosystem deployment.",
        roi: "Expanding into the Spanish market is your highest ROI move.",
        closing: "Focus on closing mastery before scaling your lead volume."
      }
    }
  }
};
