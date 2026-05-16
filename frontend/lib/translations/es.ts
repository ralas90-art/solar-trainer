export const es = {
  funnel: {
    title: "Evaluación de Capacitación en Ventas Solares",
    module: "Módulo",
    
    cta: {
      previous: "PASO ANTERIOR",
      next: "CONTINUAR",
      generate: "GENERAR RESULTADOS",
      individual_access: "OBTENER ACCESO INDIVIDUAL",
      learn_more: "MÁS INFORMACIÓN",
      book_demo: "SOLICITAR DEMO PARA EQUIPO",
      team_license: "SOLICITAR LICENCIA DE EQUIPO",
      strategy_call: "RESERVAR LLAMADA ESTRATÉGICA",
      spanish_interest: "INTERÉS EN CAPACITACIÓN EN ESPAÑOL",
      custom_quote: "SOLICITAR COTIZACIÓN PERSONALIZADA"
    },

    resume: {
      title: "Bienvenido de Nuevo",
      description: "Encontramos tu progreso previo. ¿Te gustaría continuar donde lo dejaste?",
      cta_resume: "CONTINUAR EVALUACIÓN",
      cta_fresh: "EMPEZAR DE NUEVO"
    },

    final_step: {
      title: "Paso Final: Activación de Lead",
      subtitle: "¿A quién debemos enviar los resultados?",
      description: "Ingresa tus datos para generar tu puntaje de rendimiento y camino de capacitación personalizado."
    },

    form: {
      first_name: "Nombre",
      first_name_placeholder: "Ingresa tu nombre",
      last_name: "Apellido",
      last_name_placeholder: "Ingresa tu apellido",
      email: "Correo Electrónico",
      email_placeholder: "nombre@empresa.com",
      phone: "Número de Teléfono",
      phone_placeholder: "(555) 000-0000",
      company: "Nombre de la Empresa (Opcional)",
      company_placeholder: "Tu Empresa"
    },

    already_submitted: "Ya has enviado esta evaluación. Redirigiendo a tus resultados...",
    error_generic: "Algo salió mal. Por favor revisa tu conexión e intenta de nuevo.",
    
    // Preguntas
    questions: {
      lead_type: {
        text: "¿Cómo describirías tu rol actual?",
        options: {
          rep: "Representante Solar Individual",
          manager: "Gerente de Ventas",
          owner: "Dueño de Dealer / EPC",
          recruiter: "Equipo de Reclutamiento / Onboarding"
        }
      },
      team_size: {
        text: "¿Cuál es el tamaño de tu equipo?",
        options: {
          "1": "Solo yo",
          "2-5": "2–5 representantes",
          "6-15": "6–15 representantes",
          "16-50": "16–50 representantes",
          "50+": "50+ representantes"
        }
      },
      experience: {
        text: "¿Cuál es el nivel promedio de experiencia de tu equipo?",
        options: {
          new: "Totalmente nuevo",
          "0-3": "0–3 meses",
          "3-12": "3–12 meses",
          "1y+": "1+ año",
          mixed: "Equipo mixto"
        }
      },
      gap: {
        text: "¿Cuál es tu mayor brecha de capacitación ahora?",
        options: {
          prospecting: "Prospección / Cambaceo",
          objections: "Manejo de objeciones",
          bills: "Explicación de recibos de luz",
          finance: "Explicación de financiamiento",
          closing: "Cierre de tratos",
          "post-sale": "Comunicación post-venta",
          onboarding: "Reclutamiento y onboarding"
        }
      },
      language: {
        text: "¿Cuáles son tus necesidades principales de idioma?",
        options: {
          en: "Inglés",
          es: "Español",
          both: "Ambos (Inglés y Español)"
        }
      },
      process: {
        text: "Describe tu proceso actual de capacitación.",
        options: {
          none: "Sin capacitación formal",
          shadowing: "Solo acompañamiento (Shadowing)",
          pdfs: "Llamadas Zoom / PDFs",
          internal: "Sistema de capacitación interno",
          need_better: "Necesitamos un sistema mejor"
        }
      },
      urgency: {
        text: "¿Cuándo buscas comenzar la capacitación?",
        options: {
          now: "Inmediatamente",
          month: "Este mes",
          "60d": "Próximos 30–60 días",
          research: "Solo investigando"
        }
      },
      interest: {
        text: "¿Qué es lo que más te interesa de SeptiVolt?",
        options: {
          individual: "Acceso individual",
          team: "Licencia de equipo",
          demo: "Demo",
          spanish: "Capacitación en español",
          "white-label": "Versión de marca blanca / empresa"
        }
      },
      business_intel: {
        text: "Ayúdanos a refinar tus resultados (Opcional)",
        options: {
          crm: "¿Qué CRM utilizas?",
          volume: "¿Volumen mensual de instalaciones?",
          structure: "¿Estructura de equipo (Setters/Closers)?"
        }
      }
    },

    // Resultados
    results: {
      complete: "Evaluación de Preparación Completa",
      your_path: "Tu Ruta Óptima",
      maturity_label: "Madurez",
      confidence_label: "Confianza",
      gaps_label: "Brechas Identificadas",
      insights_label: "Insights y Oportunidades",
      status_label: "Estado",
      verified: "VERIFICADO",
      detected: "DETECTADO",
      no_weaknesses: "No se detectaron brechas críticas. ¡Excelente base!",
      no_insights: "Sigue optimizando para mantener tu ventaja competitiva.",
      tracks: {
        individual: {
          title: "Camino de Rendimiento Individual",
          desc: "Optimizado para {maturity}s que buscan maestría en cierres de élite y manejo de objeciones."
        },
        team: {
          title: "Acelerador Estratégico de Equipo",
          desc: "Diseñado para {maturity}s que requieren despliegue estructural y análisis de alta fidelidad."
        },
        bilingual: {
          title: "Camino de Crecimiento Bilingüe",
          desc: "Mapeo curricular completo en español para {maturity}s que operan en mercados de alto crecimiento."
        },
        enterprise: {
          title: "Ecosistema Empresarial",
          desc: "Infraestructura personalizada de marca blanca para {maturity}s que gestionan organizaciones nacionales."
        }
      },
      maturity_levels: {
        BEGINNER: "Representante Principiante",
        DEVELOPING: "Closer en Desarrollo",
        SCALING: "Equipo en Crecimiento",
        ENTERPRISE: "Organización Empresarial",
        BILINGUAL: "Equipo de Expansión Bilingüe"
      },
      maturity_explanations: {
        BEGINNER: "Enfoque inicial en prospección y fundamentos de ventas solares.",
        DEVELOPING: "Transición hacia el cierre técnico y manejo avanzado de objeciones.",
        SCALING: "Implementación de sistemas de equipo y optimización de volumen.",
        ENTERPRISE: "Infraestructura empresarial completa con procesos automatizados.",
        BILINGUAL: "Expansión estratégica hacia mercados hispanos con alta rentabilidad."
      },
      weaknesses: {
        infrastructure: "Falta de infraestructura de capacitación formal",
        onboarding: "Proceso de reclutamiento/onboarding ineficiente",
        scaling: "Escalado empresarial sin automatización sistémica"
      },
      insights: {
        white_label: "Estás listo para un despliegue de ecosistema de marca blanca completo.",
        roi: "Expandirte al mercado hispano es tu movimiento de mayor ROI.",
        closing: "Enfócate en la maestría de cierres antes de escalar tu volumen de leads."
      }
    }
  }
};
