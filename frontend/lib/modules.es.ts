/**
 * modules.es.ts — AUTO-GENERATED Spanish Curriculum Override
 *
 * Generated: 2026-05-20T17:32:20.553Z
 * Source:    MASTER_CURRICULUM_PACK_V2_ES_*.md (official Spanish curriculum files only)
 *
 * GUARDRAILS:
 * - Spanish content comes exclusively from official master curriculum files
 * - Modules with no Spanish source are marked isTextFallback: true (English content used)
 * - Quiz correctAnswerIndex is preserved from English source and validated before output
 * - No machine translation is used for missing modules
 *
 * Regenerate by running: npx tsx scratch/build_es_modules.ts
 * DO NOT edit manually — changes will be overwritten on next regeneration.
 */

import type { ModuleContent } from "./modules"

export type ModuleContentES = ModuleContent & {
  _meta?: {
    requestedLanguage: string
    resolvedLanguage: "es" | "en"
    isTextFallback: boolean
    missingFields: string[]
  }
}

export const MODULES_ES: Record<string, ModuleContentES> = {
  "mod_1_1": {
    id: "mod_1_1",
    title: "Module 1.1: Welcome & Vision Casting",
    subtitle: "Set expectations, show earnings potential, introduce the solar mission.",
    sections: [
      {
        title: "Welcome to the SeptiVolt Accelerator",
        type: "text",
        content: "Welcome to the SeptiVolt Solar Sales Rep Accelerator. Over the next seven days, you are going to build the skills, mindset, and tools to become a professional solar consultant. This isn't a theory course — every lesson is built around real conversations, real objections, and real closings. By Day Seven, you will be field-certified and ready to generate income. Let's get started."
      },
      {
        title: "Your Income Potential in Solar",
        type: "list",
        content: "Let's talk about what's actually possible here. Most new reps earn $3K–$5K in month one. By month three, consistent reps earn $8K–$12K/month. Top performers hit $15K–$25K/month by month six. These are real numbers from real reps — the key is showing up every day, especially in the early weeks.",
        items: ["Month 1 (Learning Curve): $3,000 – $5,000", "Month 3 (Consistency Phase): $8,000 – $12,000", "Month 6+ (Top Performer): $15,000 – $25,000", "Daily consistency in the early weeks is the only variable you control"]
      },
      {
        title: "The 7-Day Structure",
        type: "text",
        content: "Day One is onboarding and foundation — today. Days Two through Six are intensive training, each day building on the last. Day Seven is your field certification — you'll run a real appointment with your manager observing. Every day has role-plays built in, because the only way to get good at this is to practice. Daily micro-assessments will catch any gaps before Day Seven."
      },
      {
        title: "The 4 Stages of Competence",
        type: "list",
        content: "Every skill you learn follows four stages. Your job in this program is to move through these stages as fast as possible. The dip is normal — push through it.",
        items: ["1. Unconscious Incompetence — you don't know what you don't know. You're excited but dangerous.", "2. Conscious Incompetence — you realize how much there is to learn. It feels uncomfortable. This is where most people quit. Don't.", "3. Conscious Competence — you can do it, but you have to think hard about it. You're in the grind.", "4. Unconscious Competence — automatic. Flow state. This is mastery."]
      },
      {
        title: "Your Signed Commitment",
        type: "quote",
        content: "\"Before we move on, you're going to sign a commitment agreement. This is not a legal document — it's a personal contract with yourself. You're committing to showing up fully for the next seven days, completing your daily assignments, and holding yourself accountable to the standards of a professional solar consultant. Sign it and mean it.\""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_1_1",
        type: "open_response",
        label: "What is your income goal for Month 3? What daily activity level do you need to hit it?",
        placeholder: "Be specific — e.g. $10,000/mo = X doors/day, X appointments/week",
        lines: 4
      },
      {
        id: "wb_1_1_2",
        type: "open_response",
        label: "Which stage of competence are you in right now? What will it feel like when you are in stage 4?",
        placeholder: "Be honest, then describe what unconscious competence looks and feels like for you",
        lines: 3
      },
      {
        id: "wb_1_1_3",
        type: "checklist",
        label: "Commitment Agreement — initial each item:",
        items: ["I will show up fully for all 7 days", "I will complete every daily assignment", "I will hold myself to professional solar consultant standards", "I will not skip role-plays, even when they're uncomfortable"]
      }
    ],
    quiz: {
      title: "Module 1.1 Knowledge Check",
      questions: [
        {
          id: "kc_1_1_a",
          question: "What stage of competence feels most uncomfortable and causes most reps to quit?",
          options: ["Unconscious Incompetence", "Conscious Incompetence", "Conscious Competence", "Unconscious Competence"],
          correctAnswerIndex: 1,
          explanation: "Conscious Incompetence is 'The Dip' — you now see how much you don't know. It's uncomfortable, but it's the only way to grow. Reps who push through it become top performers."
        },
        {
          id: "kc_1_1_b",
          question: "By Month 6, what is a realistic monthly income range for a consistently performing solar rep?",
          options: ["$1,000 – $3,000", "$3,000 – $5,000", "$15,000 – $25,000", "$50,000+"],
          correctAnswerIndex: 2,
          explanation: "Top performers who show up daily and follow the system hit $15K–$25K/month by month six. This is achievable — not guaranteed. It requires consistent activity from Day One."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections","workbookPrompts"],
    }
  },

  "mod_1_2": {
    id: "mod_1_2",
    title: "Módulo 1.2: Incorporación Administrativa",
    subtitle: "** Completar todo el papeleo eficientemente Configurar sistemas y herramientas Eliminar la confusión del primer día",
    sections: [
      {
        title: "Lista de Verificación de Incorporación",
        type: "text",
        content: "La incorporación administrativa puede sonar aburrida, pero hacerla mal te cuesta dinero. Si tu CRM no está configurado, no puedes registrar prospectos. Si tu software de diseño no funciona, no puedes generar propuestas. Vamos a recorrer la lista de verificación de manera rápida y completa. Tus documentos incluyen tu contrato de contratista, papeles de impuestos, formularios de cumplimiento y, si aplica, tu acuerdo de no competencia. Fírmalos y envíalos hoy."
      },
      {
        title: "Configuración de Herramientas y Sistemas",
        type: "text",
        content: "Después del papeleo, configurarás tus herramientas. Esto incluye tu cuenta de CRM — inicia sesión y confirma que funciona. Tu software de diseño como Aurora o HelioScope — instálalo y pruébalo. Las herramientas de comunicación de tu empresa, enlaces de calendario y aplicaciones móviles para planificación de rutas. No te vayas hoy sin probar cada inicio de sesión. Una credencial fallando en tu primera cita real te costará un trato."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_2_1",
        type: "open_response",
        label: "Reflexiona sobre la Incorporación Administrativa: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_1_3": {
    id: "mod_1_3",
    title: "Módulo 1.3: Cultura Empresarial y Expectativas",
    subtitle: "** Clarificar estándares de conducta Establecer referentes de desempeño Explicar los sistemas de apoyo",
    sections: [
      {
        title: "Expectativas de Horario Diario",
        type: "text",
        content: "Tu activo más valioso son tus horas doradas. Eso es de las dos de la tarde a las siete de la tarde — la ventana en que los propietarios están en casa y receptivos. Durante las horas doradas, tocas puertas o haces llamadas. Nada más. Lo administrativo sucede en la mañana entre las ocho y las diez. Las llamadas de equipo y el entrenamiento van de las diez al mediodía. Esta estructura existe porque funciona. Los mejores representantes protegen sus horas doradas como protegen sus ingresos — porque esas horas SON sus ingresos."
      },
      {
        title: "KPIs Semanales",
        type: "text",
        content: "Estos son los números a los que apuntas cada semana. De cien a ciento cincuenta puertas tocadas, o un número equivalente de llamadas salientes. De diez a quince citas agendadas. De cinco a ocho citas realizadas. Y para la tercera semana, de uno a tres tratos cerrados por semana. Estas no son metas arbitrarias — son los niveles de actividad que generan ingresos consistentes. Si tus números están por debajo, usaremos estos referentes para diagnosticar dónde está la fuga."
      },
      {
        title: "Estructura de Apoyo del Gerente",
        type: "text",
        content: "No estás haciendo esto solo. Tu gerente te dará seguimiento diariamente durante las primeras dos semanas. Los acompañamientos están disponibles cuando necesites un modelo en vivo que seguir. El canal del equipo está abierto para preguntas en tiempo real. Usa estos recursos de manera agresiva en tus primeras semanas. Los representantes que crecen más rápido son los que hacen más preguntas, no los que intentan resolverlo todo solos."
      },
      {
        title: "Análisis Detallado de la Compensación",
        type: "text",
        content: "Entender cómo te pagan elimina la ansiedad y la reemplaza con enfoque. La comisión generalmente se paga por kilovatio instalado, o como tarifa fija por trato — dependiendo de la estructura de tu empresa. Hay bonos y aceleradores por alcanzar volumen. También hay una política de devolución de cargos por cancelaciones, razón por la cual calificamos con rigor y prevenimos el remordimiento del comprador desde el primer día. Pídele a tu gerente los números exactos para tu mercado hoy."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_3_1",
        type: "open_response",
        label: "Reflexiona sobre Cultura Empresarial y Expectativas: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_1_4": {
    id: "mod_1_4",
    title: "Módulo 1.4: Panorama General de la Industria Solar",
    subtitle: "** Entender el panorama del mercado solar Conocer a tu competencia Comprender la urgencia (¿por qué ahora?)",
    sections: [
      {
        title: "Por Qué Solar, Por Qué Ahora",
        type: "text",
        content: "El mercado solar residencial en Estados Unidos es una de las industrias de más rápido crecimiento en el país. Las tres razones principales por las que los propietarios optan por solar son la inflación de las tarifas de servicios públicos, la independencia energética y el aumento en el valor de la vivienda. Las tarifas de servicios públicos han subido entre seis y ocho por ciento anualmente durante las últimas dos décadas sin señales de detenerse. Esa es la base de cada conversación que tendrás. Le estás ofreciendo a los propietarios una cobertura contra algo que está garantizado a seguir subiendo."
      },
      {
        title: "El Crédito Fiscal Federal",
        type: "text",
        content: "El Crédito Fiscal por Inversión federal — el ITC — le da a los propietarios un crédito del treinta por ciento sobre el costo total del sistema. En un sistema de treinta mil dólares, eso son nueve mil dólares de regreso en su primera declaración de impuestos. Este crédito está garantizado hasta 2032. Eso no es para siempre. Cada año que un propietario espera es un año pagando tarifas completas de servicios públicos Y un año más cerca de que el crédito potencialmente cambie. El ITC crea una urgencia real y legítima en tus conversaciones."
      },
      {
        title: "Mitos Comunes sobre el Solar",
        type: "text",
        content: "Escucharás estos tres mitos constantemente y debes estar listo. Primero — el solar no funciona en estados nublados. Falso. Alemania es uno de los países más nublados del mundo y lidera en adopción solar. Los paneles producen electricidad de la luz del día, no de la luz solar directa. Segundo — los paneles son demasiado costosos. Con financiamiento, la mayoría de los propietarios pagan menos por mes que su factura actual de servicios públicos desde el primer día. Tercero — la tecnología mejorará el próximo año. La tecnología ha mejorado cada año durante cuarenta años. Esperar siempre cuesta más de lo que ahorra."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_4_1",
        type: "open_response",
        label: "Reflexiona sobre el Panorama General de la Industria Solar: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 1.4 Knowledge Check",
      questions: [
        {
          id: "kc_1_4_a",
          question: "What was the main concept covered in Solar Industry Overview?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 1.4 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_1_5": {
    id: "mod_1_5",
    title: "Módulo 1.5: Fundamentos de Tecnología Solar",
    subtitle: "** Hablar con autoridad técnica Responder preguntas de propietarios con confianza Evitar sonar como un representante típico",
    sections: [
      {
        title: "Cómo Funciona el Solar — El Flujo Simple",
        type: "text",
        content: "Así es como funciona un sistema solar en lenguaje sencillo. La luz solar golpea los paneles. Los paneles generan electricidad DC — corriente directa. El inversor convierte esa energía DC en CA — corriente alterna — que es lo que tu hogar realmente utiliza. El exceso de energía que produces fluye de regreso a la red eléctrica, y recibes créditos por ella a través de un programa llamado net metering. Por la noche, o en días nublados, extraes de la red y usas esos créditos. Es un ciclo cerrado que funciona a tu favor."
      },
      {
        title: "Componentes del Sistema",
        type: "text",
        content: "Un sistema solar típico tiene cinco componentes principales. Los paneles mismos — los paneles monocristalinos son los más eficientes y los más comunes en instalaciones residenciales. El inversor, que convierte la energía — los inversores de cadena son estándar, los microinversores son premium y monitorean cada panel individualmente. El sistema de montaje que fija los paneles al techo. El sistema de monitoreo, que permite a los propietarios rastrear la producción a través de una aplicación. Y el medidor, que mide lo que consumes frente a lo que produces."
      },
      {
        title: "Garantías que Debes Conocer",
        type: "text",
        content: "Las garantías no son un detalle — son una herramienta de cierre. La garantía de rendimiento del panel garantiza un ochenta por ciento de producción durante veinticinco años. La garantía del inversor va de diez a veinticinco años dependiendo de la marca. La garantía de mano de obra cubre la instalación en sí durante diez años. Cuando un propietario pregunta qué pasa si algo se rompe, tu respuesta es inmediata y segura — esto es lo que está cubierto, esto es por cuánto tiempo, y esto es quién se encarga. Esa confianza genera confianza."
      },
      {
        title: "Lo que el Solar NO Hace",
        type: "text",
        content: "Ser honesto sobre las limitaciones es lo que separa a los consultores de los vendedores. El solar no eliminará tu factura de servicios públicos al cien por ciento — quedan tarifas de conexión y cargos locales, típicamente de diez a veinte dólares por mes. El solar no alimentará tu hogar durante un corte de energía a menos que tengas una batería. Y el solar no te paga dinero directamente, a menos que estés en un estado con programas SREC. Establecer estas expectativas desde el principio previene cancelaciones y genera confianza a largo plazo."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_5_1",
        type: "open_response",
        label: "Reflexiona sobre los Fundamentos de Tecnología Solar: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 1.5 Knowledge Check",
      questions: [
        {
          id: "kc_1_5_a",
          question: "What was the main concept covered in Solar Technology Fundamentals?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 1.5 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_1_6": {
    id: "mod_1_6",
    title: "Módulo 1.6: Cambio de Identidad: Consultor vs. Vendedor",
    subtitle: "** Replantear el rol Desarrollar una mentalidad basada en la integridad Prevenir el agotamiento por el rechazo",
    sections: [
      {
        title: "Vendedor vs. Consultor",
        type: "text",
        content: "Hay una diferencia fundamental entre un vendedor y un consultor. Un vendedor empuja un producto y persigue una comisión. Un consultor diagnostica un problema y prescribe la solución correcta — incluso si esa solución es retirarse. En solar, esta distinción importa porque los propietarios pueden sentir cuál de los dos eres en los primeros sesenta segundos de abrir la puerta. Tu trabajo es entrar a cada interacción como consultor. Estás reestructurando el gasto en servicios públicos de alguien y protegiendo a su familia de la inflación. Actúa en consecuencia."
      },
      {
        title: "El Credo de la Integridad",
        type: "text",
        content: "El credo de la integridad no es opcional — es el fundamento de una carrera sostenible. Nunca prometas ahorros que no puedas garantizar. Nunca exageres el retorno de la inversión. Descalifica agresivamente — una mala combinación hoy es una cancelación mañana, y las cancelaciones dañan tus ingresos. Y siempre recuerda que tu reputación a largo plazo vale más que cualquier cheque de comisión individual. Los representantes que construyen ingresos de seis cifras son los que los propietarios refieren a sus vecinos porque fueron tratados con respeto."
      },
      {
        title: "Replantear el Rechazo",
        type: "text",
        content: "En ventas de solar, escucharás la palabra no más que cualquier otra palabra. Cada uno de los mejores desempeñadores en esta industria escucha no más de cien veces por semana. El cambio que necesitas hacer es este — no no significa te rechazo. Significa ahora no, o esto no es adecuado. Ambas son información útil. Registra tus \"nos\" porque son el camino a tus \"síes\". Un representante que toca cuarenta y cinco puertas estadísticamente cierra un trato. Eso significa que cada puerta — incluyendo cada no — vale aproximadamente setenta y ocho dólares."
      },
      {
        title: "Gestión de Energía",
        type: "text",
        content: "Esta carrera requiere energía emocional, y debes gestionarla intencionalmente. No tomes el rechazo de manera personal — el propietario no te conoce, y no te está rechazando a ti. Está protegiendo su tiempo y su hogar. Celebra las pequeñas victorias: una cita agendada es una victoria, aunque no haya trato después. Una conversación significativa es una victoria. Reinicia entre cada puerta. El representante que trata la puerta cuarenta y cinco con la misma energía que la puerta uno se convierte en el representante que cierra a una tasa que cambia todo."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_6_1",
        type: "open_response",
        label: "Reflexiona sobre el Cambio de Identidad: Consultor vs. Vendedor: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_1_7": {
    id: "mod_1_7",
    title: "Módulo 1.7: Dominio de la Factura de Servicios Públicos: Introducción",
    subtitle: "** Leer e interpretar una factura de servicios públicos Identificar propietarios calificados al instante Entender los porcentajes de compensación",
    sections: [
      {
        title: "Anatomía de una Factura de Servicios Públicos",
        type: "text",
        content: "La factura de servicios públicos es tu herramienta de calificación más poderosa. Esto es lo que debes buscar. El uso total mensual de kilovatios-hora — esto te dice cuánta energía consume el hogar. Los cargos totales, desglosados en suministro, entrega y tarifas. La estructura tarifaria — ¿es escalonada, plana o time-of-use? Y el historial de uso de doce meses, que te dice si se trata de un hogar estacional o de un consumidor constante. Debes poder leer una factura de servicios públicos con fluidez en menos de dos minutos."
      },
      {
        title: "Umbrales de Calificación",
        type: "text",
        content: "No todo propietario es un candidato solar. Los umbrales mínimos que buscas son seiscientos kilovatios-hora de uso mensual, una factura mensual de al menos cien dólares y un uso anual superior a ocho mil kilovatios-hora. Por debajo de estos números, el tamaño del sistema se vuelve demasiado pequeño para justificar el costo y el financiamiento. Calificar con rigor desde temprano te ahorra horas de presentaciones desperdiciadas y protege tu tasa de cierre."
      },
      {
        title: "Señales de Alerta en una Factura",
        type: "text",
        content: "Algunas cosas en una factura de servicios públicos deben hacerte pausar. Un saldo vencido puede indicar problemas de crédito que afectarán el financiamiento. La facturación presupuestada oculta el uso real del propietario al promediarlo — siempre pide el desglose de uso real. Y si el uso parece muy bajo para el tamaño del hogar, profundiza más. Podría significar que alquilan parte del hogar, que planean mudarse, o que otra parte controla el uso. Busca estas señales antes de invertir dos horas en una presentación."
      },
      {
        title: "Entendiendo el Porcentaje de Compensación",
        type: "text",
        content: "El porcentaje de compensación es cuánto del consumo energético de un propietario producirá el sistema solar anualmente. Una compensación del cien por ciento significa que el sistema produce exactamente lo que el hogar usa en un año. La mayoría de los consultores recomiendan dimensionar al ciento cinco al ciento diez por ciento para tener en cuenta la degradación de los paneles y los aumentos futuros de uso. Si dimensionas al ochenta por ciento de compensación, el propietario todavía tiene una factura de servicios públicos significativa. Usarás el porcentaje de compensación en cada conversación de propuesta a partir del Día Cuatro."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_7_1",
        type: "open_response",
        label: "Reflexiona sobre el Dominio de la Factura de Servicios Públicos: Introducción: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 1.7 Knowledge Check",
      questions: [
        {
          id: "kc_1_7_a",
          question: "What was the main concept covered in Utility Bill Mastery: Introduction?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 1.7 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_1_8": {
    id: "mod_1_8",
    title: "Módulo 1.8: Resumen del Día 1 y Vista Previa",
    subtitle: "** missing_from_source",
    sections: [
      {
        title: "Conclusiones Clave del Día 1",
        type: "text",
        content: "Consolidemos lo que cubriste hoy. Estás incorporado administrativamente y listo en sistemas. Entiendes cómo funciona el solar a un nivel técnico que genera confianza. Puedes leer una factura de servicios públicos e identificar un prospecto calificado. Y has adoptado la mentalidad de un consultor, no de un vendedor. Estas no son cosas pequeñas. La mayoría de los representantes comienzan su primera semana sin esta base. Ya llevas ventaja."
      },
      {
        title: "Tarea de Esta Noche",
        type: "text",
        content: "Antes de mañana, completa tres asignaciones. Mira dos videos cortos sobre net metering — los enlaces están en tu portal de entrenamiento. Lee la guía de manejo de objeciones principales que tu empresa ha proporcionado — son cinco páginas, léelas completamente. Y practica explicar cómo funciona el solar a alguien en casa. Grábate en tu teléfono. Escucha de nuevo. Escucharás lo que necesita ajustarse. Este tipo de auto-revisión es una de las formas más rápidas de mejorar."
      },
      {
        title: "Vista Previa de Mañana",
        type: "text",
        content: "Mañana es uno de los días más importantes del programa. Aprenderás la psicología del propietario — por qué las personas se resisten al solar y qué hacer al respecto. Construirás tu estrategia de territorio. Aprenderás el Marco de Conversación Solar, que es la columna vertebral de cada interacción que tendrás. Y practicarás el manejo de micro-objeciones — la habilidad que separa a los representantes que consiguen citas de los que les cierran la puerta en la cara. Ven listo para trabajar."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_8_1",
        type: "open_response",
        label: "Reflexiona sobre el Resumen del Día 1 y Vista Previa: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_1": {
    id: "mod_2_1",
    title: "Módulo 2.1: Psicología del Propietario: Por Qué la Gente Resiste el Solar",
    subtitle: "** Comprende las barreras psicológicas que los propietarios traen a cada conversación solar. Reconoce la resistencia como una respuesta humana normal.",
    sections: [
      {
        title: "Por Qué Entender la Psicología es Fundamental",
        type: "text",
        content: "Antes de persuadir a alguien de cualquier cosa, necesitas entender cómo piensa. El error más común en las ventas de solar es tratar a cada propietario como si simplemente necesitara más información. No es así. Necesitan confianza, tiempo y el encuadre correcto. Este módulo cambiará la manera en que llegas a cada puerta. Los reps que entienden por qué los propietarios resisten cierran el doble de acuerdos que quienes solo saben qué decir."
      },
      {
        title: "Sesgo del Statu Quo",
        type: "text",
        content: "Los propietarios no están buscando activamente a un vendedor de solar. Cuando apareces en su puerta, el modo predeterminado del cerebro es preservar el statu quo. El cambio se siente arriesgado. La inacción se siente segura, incluso cuando la situación actual es objetivamente peor. Esto se llama sesgo del statu quo. Tu trabajo no es empujar a los propietarios hacia una decisión. Es guiarlos hacia la comprensión y dejar que la decisión emerja naturalmente de los números."
      },
      {
        title: "Barreras de Confianza hacia los Contratistas",
        type: "text",
        content: "La mayoría de los propietarios han sido decepcionados por un contratista antes. Un techero que desapareció tras recibir el depósito. Una empresa de HVAC que cobró de más. Una garantía de hogar que no cubrió nada. Esa historia vive en el trasfondo de cada conversación que tengas. El propietario no solo está evaluando el solar — te está evaluando a ti como persona y si serás diferente. Ve despacio. No presiones por información o compromiso antes de habérselo ganado. Cada momento genuino de rapport es un depósito en su cuenta de confianza."
      },
      {
        title: "Escepticismo hacia la Industria Solar",
        type: "text",
        content: "La industria solar se ha ganado parte de su mala reputación. Las tácticas agresivas de venta puerta a puerta, las promesas engañosas de ahorro, y las empresas que quebraron a mitad de la instalación han dejado a algunos propietarios profundamente escépticos de cualquier rep solar, sin importar cómo te presentes. La solución es reconocerlo de forma proactiva. Nombra al elefante en la habitación. Los reps que dicen — sé que los reps de solar tienen cierta reputación, y aquí está por qué yo hago las cosas diferente — generan confianza más rápido que quienes fingen que el escepticismo no existe."
      },
      {
        title: "Aversión a la Pérdida",
        type: "text",
        content: "Investigaciones ganadoras del Premio Nobel muestran que las personas sienten el dolor de una pérdida aproximadamente dos veces más intensamente que el placer de una ganancia equivalente. En la práctica esto significa: enmarcar el solar como la prevención de una pérdida es más poderoso que enmarcarlo como la obtención de un beneficio. Un propietario que podría ahorrar doscientos dólares al mes no se mueve por ganar doscientos dólares — se mueve por no perder doscientos dólares cada mes a una empresa eléctrica que no lo merece. Usa este encuadre. Funciona."
      },
      {
        title: "Fatiga de Decisión",
        type: "text",
        content: "Para cuando tocas una puerta a las cinco de la tarde, ese propietario puede haber tomado miles de decisiones ese día. La fatiga de decisión hace que la gente opte por el no — no porque no quieran el solar, sino porque decir no requiere menos esfuerzo mental que evaluar una propuesta. Tu respuesta a esto es hacer cada próximo paso fácil y de bajo riesgo. Mantén tu pitch de puerta en menos de sesenta segundos. No pidas una gran decisión en la puerta — pide una pequeña. Una cita. Eso es todo."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_1_1",
        type: "open_response",
        label: "Reflexiona sobre Psicología del Propietario: Por Qué la Gente Resiste el Solar: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.1 Knowledge Check",
      questions: [
        {
          id: "kc_2_1_a",
          question: "What was the main concept covered in Homeowner Psychology: Why People Resist Solar?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 2.1 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_2": {
    id: "mod_2_2",
    title: "Módulo 2.2: Estrategia y Planificación de Territorio",
    subtitle: "** Elige vecindarios de alta probabilidad. Aprovecha la proximidad de instalaciones. Construye autoridad en el vecindario.",
    sections: [
      {
        title: "La Estrategia del Trébol",
        type: "text",
        content: "La estrategia del trébol es simple y poderosa. Partes de una instalación solar reciente en un vecindario y trabajas hacia afuera en círculos concéntricos. Cuando llegas a la siguiente puerta y dices — tu vecino de la esquina acaba de instalar solar y estoy dando seguimiento en el área — tienes prueba social de inmediato. El primer pensamiento del propietario es: alguien que conozco ya lo hizo. Eso transforma la conversación de fría a tibia antes de que hayas dicho otra palabra."
      },
      {
        title: "Criterios de Selección de Territorio",
        type: "text",
        content: "No todos los vecindarios son iguales. El punto óptimo para el solar son hogares valuados en doscientos cincuenta mil dólares o más, con techos de entre cinco y quince años de antigüedad, servidos por una empresa eléctrica con políticas sólidas de medición neta (NEM), y en áreas favorables a los HOA. Evita las cooperativas eléctricas si tu área tiene acuerdos de NEM deficientes. Usa Zillow, registros del condado y la base de datos de instalaciones de tu empresa para pre-calificar vecindarios antes de gastar una sola hora dorada en ellos."
      },
      {
        title: "Construyendo Autoridad en el Vecindario",
        type: "text",
        content: "El objetivo es saturar un área antes de pasar a otra. Conviértete en el rep solar de ese código postal. Cuando múltiples vecinos te han visto, han hablado de ti, o han visto tus letreros en el jardín — la siguiente conversación abre con un nivel de confianza mucho mayor. Algunos reps avanzados organizan sesiones informativas en el vecindario una vez que tienen tres o más instalaciones en una cuadra. Ese tipo de autoridad vecinal es lo que elimina la necesidad de prospección en frío con el tiempo."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_2_1",
        type: "open_response",
        label: "Reflexiona sobre Estrategia y Planificación de Territorio: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_3": {
    id: "mod_2_3",
    title: "Módulo 2.3: Matemáticas de Eficiencia Diaria y Gestión del Tiempo",
    subtitle: "** Comprende el ingreso por hora. Maximiza las horas doradas. Elimina el desperdicio de tiempo.",
    sections: [
      {
        title: "Las Matemáticas detrás de la Puerta",
        type: "text",
        content: "Hagamos las matemáticas de un día típico tocando puertas. Los promedios de la industria muestran una conversación por cada tres puertas tocadas, una cita por cada cinco conversaciones, y un cierre por cada tres citas. Eso significa que cuarenta y cinco puertas equivalen a un cierre en promedio. Con una comisión promedio de tres mil quinientos dólares y cinco horas doradas por día, eso equivale a aproximadamente trescientos ochenta y nueve dólares por hora trabajada. Cada puerta que tocas — ya sea que abran o no — vale alrededor de setenta y ocho dólares. Ese reencuadre hace el rechazo mucho más fácil de procesar."
      },
      {
        title: "Las No-Negociables Diarias",
        type: "text",
        content: "Tus horas doradas — de las dos de la tarde a las siete — son para una sola cosa: prospectar. Sin administración. Sin mandados. Sin llamadas telefónicas largas. Durante estas cinco horas, tu único trabajo es tocar puertas o marcar números, agendar citas y avanzar conversaciones. Los reps que protegen esta ventana construyen ingresos. Los reps que dejan que se consuma por distracciones se preguntan por qué no están cerrando. Establece un mínimo de dos citas por sesión de horas doradas. Cualquier cosa menos y tu pipeline se secará en dos semanas."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_3_1",
        type: "open_response",
        label: "Reflexiona sobre Matemáticas de Eficiencia Diaria y Gestión del Tiempo: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_4": {
    id: "mod_2_4",
    title: "Módulo 2.4: El Marco de Conversación Solar: Introducción",
    subtitle: "** (información no disponible en la fuente)",
    sections: [
      {
        title: "Resumen del Marco de 7 Pasos",
        type: "text",
        content: "Cada conversación solar que tendrás — en la puerta, por teléfono, o dentro de una casa — sigue el mismo arco de siete pasos. Paso uno: Interrupción de Patrón. Paso dos: Rapport. Paso tres: Pregunta de Curiosidad. Paso cuatro: Conciencia del Problema. Paso cinco: Descubrimiento de la Factura. Paso seis: Calificación. Paso siete: Cita o próximo paso. Puedes moverte a través de algunos pasos más rápido que otros dependiendo del propietario, pero nunca omites un paso. Este marco es tu GPS. Úsalo cada vez."
      },
      {
        title: "El Marco en la Puerta — 60 Segundos",
        type: "text",
        content: "En la puerta, comprimes el marco completo en sesenta a noventa segundos. Rompe su piloto automático con una referencia al vecino o algo inesperado — esa es tu Interrupción de Patrón. Un momento humano antes del negocio — ese es el Rapport. Haz una pregunta simple de curiosidad sobre su situación energética. Ayúdales a ver un problema que han estado tolerando. Pregunta sobre su factura mensual de electricidad — ese es tu Descubrimiento. Confirma que son dueños de la casa y cuánto tiempo llevan viviendo ahí — esa es la Calificación. Luego cierra con una hora específica para la cita. Sesenta segundos. Siete pasos. Listo."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_4_1",
        type: "open_response",
        label: "Reflexiona sobre El Marco de Conversación Solar: Introducción: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.4 Knowledge Check",
      questions: [
        {
          id: "kc_2_4_a",
          question: "What was the main concept covered in The Solar Conversation Framework: Introduction?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 2.4 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_5": {
    id: "mod_2_5",
    title: "Módulo 2.5: Dominio de la Venta Puerta a Puerta",
    subtitle: "** Supera la ansiedad ante la puerta. Domina el pitch de 30 segundos. Agenda citas de manera eficiente.",
    sections: [
      {
        title: "Preparación Pre-Llamada",
        type: "text",
        content: "Lo que sucede antes de tocar importa tanto como lo que dices en la puerta. Apariencia: limpio, profesional, gafete visible. Materiales: tu tablet cargada, tarjetas de presentación en el bolsillo, y cualquier volante que uses. Y mentalidad: antes de levantar la mano para tocar, reinicia. Espera que la mayoría de las personas no estén interesadas. Celebra las conversaciones, no solo las citas. El rep que llega a cada puerta con calma y confianza cierra más que el rep que llega esperando un sí."
      },
      {
        title: "El Opener de 30 Segundos — 3 Variaciones",
        type: "text",
        content: "Tienes tres openers probados. El opener de Referencia al Vecino aprovecha una instalación cercana para crear prueba social de inmediato. El opener de Auditoría de Factura te posiciona como alguien que hace evaluaciones energéticas gratuitas en el área — baja amenaza, alta curiosidad. El opener de Proximidad de Instalación funciona cuando tienes sitios de trabajo activos cerca — te presentas como parte de un equipo ya trabajando en la calle. Memoriza los tres. Usa el que mejor se adapte al vecindario y al momento."
      },
      {
        title: "Cierre de Agendamiento de Cita",
        type: "text",
        content: "Cuando estés listo para cerrar la cita, no preguntes si la quieren. Dales a elegir entre dos horarios. Tengo el jueves a las seis o el sábado a las diez — ¿cuál te funciona mejor? Esto se llama cierre binario asuntivo. No estás preguntando si quieren una cita. Estás asumiendo que sí y preguntando qué horario les funciona. Este pequeño cambio de lenguaje aumenta dramáticamente la conversión de citas. Practica hasta que se sienta natural."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_5_1",
        type: "open_response",
        label: "Reflexiona sobre Dominio de la Venta Puerta a Puerta: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.5 Knowledge Check",
      questions: [
        {
          id: "kc_2_5_a",
          question: "What was the main concept covered in Door Knocking Mastery?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 2.5 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_6": {
    id: "mod_2_6",
    title: "Módulo 2.6: Manejo de Micro-Objeciones: Superando el Rechazo Automático",
    subtitle: "** (información no disponible en la fuente)",
    sections: [
      {
        title: "Qué Son Realmente las Micro-Objeciones",
        type: "text",
        content: "La mayoría de las objeciones en la puerta no son objeciones reales. Son respuestas automáticas y reflejas diseñadas para terminar la interacción lo más rápido posible. El propietario no está pensando profundamente en el solar — está intentando volver a su vida. Tu respuesta nunca debe ser argumentar o defenderte. La regla de oro de las micro-objeciones es esta: no argumentes, no te defiendas — haz una pregunta curiosa e invítalos de vuelta a la conversación."
      },
      {
        title: "No Me Interesa — La Respuesta",
        type: "text",
        content: "Cuando alguien dice no me interesa, responde con curiosidad, no con defensa. Prueba: Completamente válido — pregunta rápida, ¿ya investigaste el solar, o simplemente no has tenido tiempo todavía? Si no lo han investigado, eso abre la puerta para explicar por qué la mayoría de las personas en el área califican. Si ya lo investigaron, pregunta qué los detuvo. Esa única pregunta reabre toda la conversación. Nunca argumentes con no me interesa. Conviértelo en una pregunta."
      },
      {
        title: "Estoy Ocupado, Déjame Información, Ya Tengo Solar",
        type: "text",
        content: "Tres más comunes. Estoy ocupado ahora mismo — diles que no estás vendiendo hoy, solo agendando consultas gratuitas. Dos minutos para elegir una hora, y tú haces todo el trabajo previo. Solo déjame información — la información no significará nada sin sus números específicos. Redirige hacia agendar. Ya tengo solar — lidera con curiosidad, pregunta cómo está funcionando, y haz un pivot hacia actualizaciones de almacenamiento de batería o referencias. Cada rechazo tiene una respuesta. Conoce la tuya antes de tocar."
      },
      {
        title: "Cónyuge, Rentando, y Mala Experiencia",
        type: "text",
        content: "Necesito hablar con mi cónyuge — valídalo de inmediato y pregunta si el cónyuge está en casa ahora. Si no, encuentra un horario en que ambos estén disponibles. No me gusta presentar a un solo cónyuge porque simplemente no tiene sentido de otra manera. Estamos rentando — el solar es para propietarios, pero haz un pivot hacia referencias. ¿Conocen vecinos que sean dueños? Mala experiencia — lidera con empatía total. Pregunta qué pasó. Escucha completamente. Luego pregunta si estarían abiertos a quince minutos solo para ver si las cosas han cambiado."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_6_1",
        type: "open_response",
        label: "Reflexiona sobre Manejo de Micro-Objeciones: Superando el Rechazo Automático: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.6 Knowledge Check",
      questions: [
        {
          id: "kc_2_6_a",
          question: "What was the main concept covered in Micro Objection Handling: Getting Past the Brush-Off?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 2.6 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_7": {
    id: "mod_2_7",
    title: "Módulo 2.7: Agendamiento de Citas por Teléfono y Virtual",
    subtitle: "** Convierte leads entrantes en citas. Maneja llamadas en frío de manera profesional. Domina la tonalidad y el ritmo.",
    sections: [
      {
        title: "Velocidad de Respuesta al Lead",
        type: "text",
        content: "Cuando entra un lead entrante, tu tiempo de respuesta lo es todo. Llama dentro de los primeros cinco minutos. Si no contestan, deja un mensaje de voz y envía un texto simultáneamente — multi-toque. La investigación muestra que la conversión de leads cae dramáticamente después de los primeros treinta minutos. El propietario llenó un formulario mientras estaba curioso y motivado. Tu trabajo es comunicarte con ellos mientras esa energía todavía está ahí. Cada minuto que esperas, la ventana se cierra."
      },
      {
        title: "Descubrimiento Telefónico y Agendamiento de Cita",
        type: "text",
        content: "Cuando los alcanzas, abre con energía y menciona su consulta. Luego pasa a tres o cinco preguntas de descubrimiento: ¿Cuál es tu factura eléctrica promedio? ¿Cuánto tiempo llevas en la casa? ¿Has investigado el solar antes? ¿Tu cónyuge participa en las decisiones? Desde ahí, transiciona directamente a agendar. Diles que obtendrás sus datos de servicios públicos y el diseño del techo antes de que se reúnan, para que la llamada sea completamente personalizada. Luego da dos opciones de horario específicas y asegura la cita."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_7_1",
        type: "open_response",
        label: "Reflexiona sobre Agendamiento de Citas por Teléfono y Virtual: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.7 Knowledge Check",
      questions: [
        {
          id: "kc_2_7_a",
          question: "What was the main concept covered in Phone & Virtual Appointment Setting?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 2.7 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_8": {
    id: "mod_2_8",
    title: "Módulo 2.8: Encuadre Anti-Ventas y Construcción de Confianza",
    subtitle: "** Posiciónate como consultor, no como vendedor. Usa lenguaje que desarma. Construye rapport instantáneo.",
    sections: [
      {
        title: "El Opener Anti-Pitch",
        type: "text",
        content: "La forma más rápida de bajar la guardia de un propietario es decir algo que no esperaba de un rep de solar. Prueba: No estoy aquí para venderte nada hoy. Solo estoy aquí para ver si tiene sentido. Esa única oración elimina la presión para la que se estaban preparando. Cambia la dinámica de adversarial a colaborativa. Síguela inmediatamente con preguntas basadas en permiso: ¿Está bien si primero te hago algunas preguntas? ¿Te importa si reviso tu techo un momento? Estás construyendo micro-acuerdos antes de pedir algo significativo."
      },
      {
        title: "Encuadre de Descalificación",
        type: "text",
        content: "Una de las cosas más poderosas que puedes decir al inicio de una conversación es: Honestamente, el solar no tiene sentido para todos. Permíteme primero determinar si eres un candidato. Esto es el encuadre de descalificación, y funciona mediante la psicología inversa. Al sugerir que podrían no calificar, activas el deseo del propietario de calificar. Has creado un desafío que ahora quieren superar. También te has posicionado como selectivo — y los consultores selectivos generan más confianza que los vendedores desesperados."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_8_1",
        type: "open_response",
        label: "Reflexiona sobre Encuadre Anti-Ventas y Construcción de Confianza: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_2_9": {
    id: "mod_2_9",
    title: "Module 2.9: Daily Prospecting Workflow & Accountability",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "The Daily Prospecting Rhythm",
        type: "text",
        content: "Your day has four blocks. Morning from eight to ten is for admin, CRM updates, and route planning. Midday from ten to two is for training, team calls, and proposal prep. Two to seven pm — golden hours — is for prospecting only. And from seven to eight pm, you log your activity, complete follow-ups, and plan tomorrow's route. This structure removes decision fatigue about what to do next. You always know what time it is and what your job is."
      },
      {
        title: "KPI Tracking & Accountability",
        type: "text",
        content: "Every night, report four numbers to your manager: doors knocked, conversations had, appointments set, and follow-ups completed. These numbers tell the whole story. If you're knocking doors but not having conversations, the opener needs work. If you're having conversations but not setting appointments, the transition needs work. If you're setting appointments but they're not showing, the confirmation process needs work. Track your numbers and you always know exactly where to improve."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_9_1",
        type: "open_response",
        label: "Reflect on Daily Prospecting Workflow & Accountability: How will you apply this?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections","workbookPrompts"],
    }
  },

  "mod_2_10": {
    id: "mod_2_10",
    title: "Module 2.10: Day 2 Role-Play Certification",
    subtitle: "Validate learning through live simulation Build confidence before real field work Test all Day 2 skills end-to-end",
    sections: [
      {
        title: "Certification Format",
        type: "text",
        content: "Today's role-play certification has four rounds. Round one: you knock a door and your manager plays a skeptical homeowner who opens with not interested. Round two: you take a phone call from a rushed lead. Round three: you handle three micro objections back to back in rapid fire. Round four: you run the full seven-step Conversation Framework at the door from start to finish. You need to demonstrate all four competencies before leaving today. This is your first real test."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_10_1",
        type: "open_response",
        label: "Reflect on Day 2 Role-Play Certification: How will you apply this?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.10 Knowledge Check",
      questions: [
        {
          id: "kc_2_10_a",
          question: "What was the main concept covered in Day 2 Role-Play Certification?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 2.10 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections","workbookPrompts"],
    }
  },

  "mod_2_11": {
    id: "mod_2_11",
    title: "Module 2.11: Day 2 Wrap-Up & Field Assignment",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Tonight's Field Assignment",
        type: "text",
        content: "Tonight you have a field assignment. Knock twenty doors. This is practice — no pressure to close anything. But knock them like they're real, because they are real. Record yourself at three of those doors with your phone. Watch the playback tonight and notice your body language, your opener, your energy. Then review your homeowner empathy map from earlier and note which types you encountered. Bring your observations to tomorrow's session. Day Three starts where Day Two left off."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_2_11_1",
        type: "open_response",
        label: "Reflect on Day 2 Wrap-Up & Field Assignment: How will you apply this?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections","workbookPrompts"],
    }
  },

  "mod_3_1": {
    id: "mod_3_1",
    title: "Módulo 3.1: Posicionamiento en el Hogar y Control del Entorno",
    subtitle: "** Controla el entorno de la cita. Construye autoridad subconsciente. Elimina las distracciones.",
    sections: [
      {
        title: "Lista de Verificación Pre-Llegada",
        type: "text",
        content: "Antes de entrar, haz tres cosas. Confirma la cita dos horas antes por mensaje de texto y llamada. Llega cinco minutos antes y estaciona frente al hogar. Desde tu auto, evalúa el techo — busca sombra, inclinación y condición antes de tocar el timbre. Este reconocimiento te ahorra tiempo adentro y te permite hacer preguntas más inteligentes. Entrar preparado no es opcional — es el estándar de un consultor profesional."
      },
      {
        title: "La Estrategia del Asiento de Poder",
        type: "text",
        content: "Dónde te sientas en el hogar importa más de lo que la mayoría de los reps se dan cuenta. Tu objetivo es la cocina o el comedor — no el sofá. En la mesa, posiciónate en la cabecera o en la esquina. Los propietarios se sientan a tu lado, lo que crea una dinámica colaborativa en lugar de un enfrentamiento adversarial. Pídeles que queden de espaldas al televisor. Solicita que las mascotas estén tranquilas y los niños ocupados. Estas no son peticiones groseras — son profesionales. Tu encuadre de apertura debe ser: Voy a hacer muchas preguntas primero, luego les mostraré los números. Si tiene sentido, genial. Si no, se los diré."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_1_1",
        type: "open_response",
        label: "Reflexiona sobre Posicionamiento en el Hogar y Control del Entorno: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_2": {
    id: "mod_3_2",
    title: "Módulo 3.2: Perfilado de Personalidad",
    subtitle: "** Identifica el tipo de personalidad en 2 minutos. Adapta el estilo de comunicación. Evita desajustes que matan acuerdos.",
    sections: [
      {
        title: "Los Tipos de Personalidad BOLT",
        type: "text",
        content: "El marco BOLT te da cuatro tipos de personalidad para identificar y adaptarte rápidamente. Bull — dominante, directo, rápido. Quieren el resultado final de inmediato. Owl — analítico, orientado al detalle, escéptico. Quieren datos, garantías y especificaciones técnicas. Lion — entusiasta, social, emocional. Quieren conectar personalmente y sentirse bien con la decisión. Turtle — constante, aversión al riesgo, dubitativo. Necesitan prueba social, seguridad y cero presión. Generalmente sabrás qué tipo es alguien dentro de los primeros dos minutos de entrar a su hogar."
      },
      {
        title: "Adaptándose a Cada Tipo",
        type: "text",
        content: "Para el Bull — omite la charla casual, muestra el ROI rápidamente, ve al cierre. Para el Owl — trae datos, muestra la curva de degradación, cita garantías específicas e informes de ingeniería. Para el Lion — pregunta sobre su familia, personaliza la conversación, celebra el impacto ambiental y el legado. Para el Turtle — avanza despacio, enfatiza cuántos vecinos han hecho esto, elimina cualquier sensación de presión y déjalo sentir que controla el ritmo. La mayoría de las parejas son una mezcla — adáptate a ambos, comenzando por quien sea más resistente."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_2_1",
        type: "open_response",
        label: "Reflexiona sobre Perfilado de Personalidad: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.2 Knowledge Check",
      questions: [
        {
          id: "kc_3_2_a",
          question: "What was the main concept covered in Personality Profiling?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 3.2 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_3": {
    id: "mod_3_3",
    title: "Module 3.3: Real-World Homeowner Scenario Library",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Scenario 1 — The Burned Homeowner",
        type: "text",
        content: "The burned homeowner has been let down by a contractor before. Their trust has been violated and they are looking for evidence that you're the same. Your job is to not defend the industry or minimize their experience. Validate completely. Ask what specifically went wrong — that shows you genuinely care. Move slower than you normally would. Offer social proof in writing: reviews, references, license numbers, warranty documents. Never rush to close with this homeowner. Let them set the pace."
      },
      {
        title: "Scenario 2 — The Researcher",
        type: "text",
        content: "This homeowner has done extensive research and their ego is invested in that research. They are testing you. Don't talk down to them or repeat basics they already know. Ask what they've learned and what questions remain. Use specific technical language — NEM, degradation curves, DC-to-AC ratio, dealer fees. If you don't know something, say so honestly: great question — let me get you the exact figures from our engineer. Then ask them: based on your research, what's the one thing that's been holding you back? That usually reveals the real objection."
      },
      {
        title: "Scenario 3 — The Busy Homeowner",
        type: "text",
        content: "This homeowner is time-constrained, or uses busyness as a shield. Accept the time constraint immediately — I respect that, I'll be quick. Lead right away with the most compelling hook: your bill is over X, right? In fifteen minutes I can show you whether you're leaving money on the table. Skip rapport-building and get to curiosity questions fast. If they truly can't sit now, secure a specific appointment: what if I came back Thursday at six — twenty minutes, I'll have everything prepared."
      },
      {
        title: "Scenario 4 — The Friendly Non-Committer",
        type: "text",
        content: "This homeowner likes you and enjoys the conversation — but likability is not decision readiness. They're conflict-avoidant. They'll agree with everything and then say let me think about it at the end. Enjoy the rapport, but use micro-closes throughout: make sense so far? If the numbers worked, would anything stop you from moving forward? When they say they'll think about it, ask specifically what they want to think through. Then use assumptive language to advance: let's get you scheduled."
      },
      {
        title: "Scenario 5 — Already Has Solar / Trusts the Utility",
        type: "text",
        content: "Already has solar — lead with genuine curiosity: how's it working out? Look for dissatisfaction, upgrade opportunities, or battery storage needs. If they're happy, pivot to referrals. Trusts the utility — don't attack the utility company. Instead, educate gently: do you know how much they've raised rates over the last ten years? Show historical data as a factual conversation, not an accusation. Reframe solar as a hedge: you'd still be connected to the utility, you'd just be less dependent on their pricing decisions."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_3_1",
        type: "open_response",
        label: "Reflect on Real-World Homeowner Scenario Library: How will you apply this?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.3 Knowledge Check",
      questions: [
        {
          id: "kc_3_3_a",
          question: "What was the main concept covered in Real-World Homeowner Scenario Library?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 3.3 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections","workbookPrompts"],
    }
  },

  "mod_3_4": {
    id: "mod_3_4",
    title: "Módulo 3.4: Empatía Táctica y Espejeo",
    subtitle: "** Construye rapport profundo de inmediato. Haz que los propietarios se sientan escuchados. Descubre objeciones ocultas.",
    sections: [
      {
        title: "Espejeo — Repite las Últimas Tres Palabras",
        type: "text",
        content: "El espejeo es una de las herramientas de construcción de rapport más poderosas que existen. Cuando un propietario dice algo — preocupado por el costo — simplemente repites sus últimas dos o tres palabras como pregunta. ¿Preocupado por el costo? Naturalmente elaborarán más. No has dicho nada — solo has abierto una puerta. Esta técnica los obliga a decir más de lo que planeaban, y al hacerlo, a menudo revelan la preocupación real que subyace a la superficial."
      },
      {
        title: "Etiquetado y Preguntas Calibradas",
        type: "text",
        content: "Etiquetar significa nombrar la emoción que estás observando. Parece que estás frustrado con tu empresa eléctrica. Da la impresión de que te preocupa el compromiso. Cuando nombras las emociones con precisión, los propietarios se sienten escuchados — y cuando las personas se sienten escuchadas, confían. Combina el etiquetado con preguntas calibradas — preguntas abiertas que comienzan con qué o cómo. ¿Qué te permitiría ahorrar cien dólares al mes? ¿Qué te hace considerarlo ahora? Estas preguntas construyen motivación en lugar de poner a los propietarios a la defensiva."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_4_1",
        type: "open_response",
        label: "Reflexiona sobre Empatía Táctica y Espejeo: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.4 Knowledge Check",
      questions: [
        {
          id: "kc_3_4_a",
          question: "What was the main concept covered in Tactical Empathy & Mirroring?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 3.4 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_5": {
    id: "mod_3_5",
    title: "Módulo 3.5: Arquitectura de Preguntas: La Secuencia de Descubrimiento",
    subtitle: "** Descubre los puntos de dolor verdaderos. Construye urgencia. Califica la disposición financiera.",
    sections: [
      {
        title: "Preguntas Sobre el Estado Actual",
        type: "text",
        content: "Las primeras cuatro preguntas de descubrimiento se enfocan en la situación actual del propietario. ¿Cuál es tu factura eléctrica promedio? ¿Ha estado subiendo los últimos años? — casi siempre dicen que sí. ¿Cuánto es lo más que has pagado en un solo mes? — esto ancla un número alto en su mente. ¿Y qué es lo que más odias de tu empresa eléctrica? — este es un disparador emocional que saca a flote frustraciones que han acumulado durante años. Estas preguntas no solo califican el lead — construyen la base emocional para tu presentación."
      },
      {
        title: "Preguntas Sobre el Estado Futuro y la Toma de Decisiones",
        type: "text",
        content: "El siguiente conjunto de preguntas mira hacia adelante y califica la decisión. ¿Qué pasa si las tarifas suben otro seis por ciento el próximo año? ¿Cuánto tiempo planeas quedarte en esta casa? ¿Estás pensando en un vehículo eléctrico (EV)? Estas construyen urgencia y anticipan el futuro. Luego pasa a preguntas sobre la toma de decisiones. ¿Quién más necesita participar en esta decisión? — identifica bloqueadores desde temprano. Si los números tienen sentido, ¿hay alguna razón por la que no avanzarías? — saca objeciones ocultas antes de construir la propuesta. Y confirma el rango de crédito y el cronograma. Estas doce preguntas son toda tu lista de verificación pre-presentación."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_5_1",
        type: "open_response",
        label: "Reflexiona sobre Arquitectura de Preguntas: La Secuencia de Descubrimiento: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.5 Knowledge Check",
      questions: [
        {
          id: "kc_3_5_a",
          question: "What was the main concept covered in Question Architecture: The Discovery Sequence?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 3.5 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_6": {
    id: "mod_3_6",
    title: "Módulo 3.6: Dinámica del Cónyuge y el Tomador de Decisiones",
    subtitle: "** Previene las cancelaciones del día siguiente. Cierra con ambos tomadores de decisión presentes.",
    sections: [
      {
        title: "La Regla de Oro — Nunca Presentes a un Solo Cónyuge",
        type: "text",
        content: "Esta regla tiene una excepción: un tomador de decisiones soltero confirmado. Si un cónyuge no está en casa, no presentes. Reagenda. Presentar a un cónyuge y cerrar sin el otro es la causa número uno de cancelaciones al día siguiente. La lógica es simple: el cónyuge ausente escucha un resumen con información incompleta, se preocupa, y mata el acuerdo. El rep que insistió en presentar a un solo cónyuge causó esa cancelación. Ante la duda, di: No me gusta avanzar a menos que ambos estén presentes — ¿cuándo es un buen momento para los dos?"
      },
      {
        title: "Equilibrando a Ambos Cónyuges",
        type: "text",
        content: "Durante la presentación, mantén contacto visual con ambos propietarios por igual. Pide la opinión de ambos — y dirige preguntas específicamente al cónyuge más callado. ¿Tiene sentido? — mira a ambos. ¿Está bien hasta ahora? — espera que ambos asientan. ¿Alguna duda? — deja que ambos expresen objeciones. Si un cónyuge es claramente escéptico, dirígete a él directamente y desde temprano: Puedo ver que eres el cuidadoso — eso es bueno. ¿Cuál es tu mayor preocupación? Manejar el escepticismo de frente frente a su pareja construye credibilidad con ambos."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_6_1",
        type: "open_response",
        label: "Reflexiona sobre Dinámica del Cónyuge y el Tomador de Decisiones: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.6 Knowledge Check",
      questions: [
        {
          id: "kc_3_6_a",
          question: "What was the main concept covered in Spouse & Decision-Maker Dynamics?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 3.6 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_7": {
    id: "mod_3_7",
    title: "Módulo 3.7: Evaluación del Techo y el Sitio",
    subtitle: "** Detecta los factores que destruyen acuerdos desde temprano. Establece expectativas realistas. Evita encuestas costosas en hogares no calificados.",
    sections: [
      {
        title: "Fundamentos de la Inspección del Techo",
        type: "text",
        content: "Durante o antes de cada cita, camina por la propiedad y evalúa el techo. Las cuatro cosas que evalúas son sombra, condición, inclinación y material. La sombra intensa de los árboles es un asesino serio de producción — si cubre más del cuarenta por ciento del área útil del techo, es posible que el sistema no se justifique económicamente. Un techo que necesite reemplazo dentro de cinco años debe ser atendido antes de la instalación — los paneles deben retirarse durante un retechado y eso cuesta extra. Y el techo ideal está orientado al sur, con una inclinación de entre quince y cuarenta grados, sobre tejas asfálticas."
      },
      {
        title: "Panel Eléctrico y Consideraciones del HOA",
        type: "text",
        content: "Pide ver el panel eléctrico — generalmente en el garaje o el sótano. Un servicio de doscientos amperes es ideal. Cien amperes puede requerir una actualización del panel principal (MPU) que cuesta entre dos y cinco mil dólares — eso afecta tu propuesta. Las marcas problemáticas como Zinsco o Federal Pacific necesitan reemplazo antes del solar y deben ser reveladas. Para propiedades con HOA, confirma que el solar está permitido y pregunta sobre restricciones estéticas. La mayoría de los HOA legalmente no pueden negar el solar bajo las leyes estatales, pero pueden controlar la ubicación. Obtén esta información antes de finalizar el diseño."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_7_1",
        type: "open_response",
        label: "Reflexiona sobre Evaluación del Techo y el Sitio: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_8": {
    id: "mod_3_8",
    title: "Módulo 3.8: Módulo 3.8: Dominio de la Descalificación: Cuándo Retirarse",
    subtitle: "** Protege el tiempo y los recursos de la empresa. Construye confianza siendo honesto. Evita cancelaciones futuras.",
    sections: [
      {
        title: "Los Principales Escenarios de Descalificación",
        type: "text",
        content: "Retirarse de un mal acuerdo es uno de los movimientos de mayor integridad que puede hacer un consultor — y también es buen negocio. Los principales escenarios donde descalificas: el propietario se va a mudar en menos de tres años, el puntaje de crédito (FICO) está por debajo de seiscientos, el techo necesita reemplazo primero, la sombra intensa hace inviable la producción, el uso es inferior a cuatrocientos kWh por mes, o el propietario tiene expectativas poco realistas como eliminar su factura a cero. En cada caso, sé directo. Di la verdad. Recomienda el camino correcto. Luego pide dar seguimiento cuando las condiciones cambien."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_8_1",
        type: "open_response",
        label: "Reflexiona sobre Dominio de la Descalificación: Cuándo Retirarse: ¿Cómo aplicarás esto?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.8 Knowledge Check",
      questions: [
        {
          id: "kc_3_8_a",
          question: "What was the main concept covered in Disqualification Mastery: When to Walk Away?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 3.8 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_9": {
    id: "mod_3_9",
    title: "Module 3.9: Day 3 Full Discovery Simulation",
    subtitle: "Validate all Day 3 skills in one realistic scenario Receive manager feedback Build confidence for real appointments",
    sections: [
      {
        title: "Simulation Setup",
        type: "text",
        content: "In today's full discovery simulation you will run a complete in-home discovery with a challenging scenario. A married couple: one personality type who's eager and one who's skeptical. A monthly electric bill of two hundred forty dollars. A recently repaired roof. And a hidden objection from the skeptical spouse. Your job is to control the environment, identify both personality types, ask all twelve discovery questions, use mirroring and labeling to uncover the hidden objection, and qualify their financial readiness — all while maintaining calm consultant energy."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_9_1",
        type: "open_response",
        label: "Reflect on Day 3 Full Discovery Simulation: How will you apply this?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.9 Knowledge Check",
      questions: [
        {
          id: "kc_3_9_a",
          question: "What was the main concept covered in Day 3 Full Discovery Simulation?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 3.9 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections","workbookPrompts"],
    }
  },

  "mod_3_10": {
    id: "mod_3_10",
    title: "Module 3.10: Day 3 Wrap-Up & Homework",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Day 3 Homework",
        type: "text",
        content: "Tonight: set one real appointment. It can be a friend or family member if needed, but run the full discovery when you get there. Use all twelve questions. Record yourself and submit the recording by nine pm. Tomorrow is Day Four — presentation mastery. You'll learn how to show the numbers in a way that makes the decision obvious, master all three financing structures, and run a full twenty-minute presentation role-play. Come in tomorrow with your discovery recording reviewed and notes taken."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_10_1",
        type: "open_response",
        label: "Reflect on Day 3 Wrap-Up & Homework: How will you apply this?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections","workbookPrompts"],
    }
  },

  "mod_4_1": {
    id: "mod_4_1",
    title: "Módulo 4.1: ANÁLISIS PROFUNDO DE LA FACTURA DE SERVICIOS PÚBLICOS",
    subtitle: "Perform surgical bill analysis in front of homeowner Build credibility through technical mastery Identify hidden savings",
    sections: [
      {
        title: "Sección 1: Autopsia de la Factura",
        type: "text",
        content: "Sección 1: Autopsia de la Factura"
      },
      {
        title: "Sección 2: Identificación de la Estructura Tarifaria",
        type: "text",
        content: "Sección 2: Identificación de la Estructura Tarifaria"
      },
      {
        title: "Sección 3: Proyección de Inflación",
        type: "text",
        content: "Sección 3: Proyección de Inflación"
      },
      {
        title: "Sección 4: Lógica de Compensación y True-Up",
        type: "text",
        content: "Sección 4: Lógica de Compensación y True-Up"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_1_1",
        type: "open_response",
        label: "Toma una factura eléctrica de muestra e identifica cada línea de cargo. Calcula el costo total por kWh.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_4_1_es_2",
        type: "open_response",
        label: "Determina qué estructura tarifaria tiene el cliente de muestra. ¿Cómo cambia tu estrategia de venta?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_1_es_3",
        type: "open_response",
        label: "Completa la proyección de inflación a 25 años para el cliente de muestra.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_1_es_4",
        type: "open_response",
        label: "Practica explicar el true-up en 60 segundos o menos sin jerga técnica.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 4.1 Knowledge Check",
      questions: [
        {
          id: "kc_4_1_a",
          question: "What was the main concept covered in Utility Bill Deep Dive: Advanced Analysis?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 4.1 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_2": {
    id: "mod_4_2",
    title: "Módulo 4.2: ANÁLISIS PROFUNDO DEL FINANCIAMIENTO",
    subtitle: "Explain loan vs lease vs PPA clearly Match financing to homeowner's goals Calculate payments with confidence",
    sections: [
      {
        title: "Sección 1: Préstamo Solar",
        type: "text",
        content: "Sección 1: Préstamo Solar"
      },
      {
        title: "Sección 2: Estrategia de Crédito Fiscal a 18 Meses",
        type: "text",
        content: "Sección 2: Estrategia de Crédito Fiscal a 18 Meses"
      },
      {
        title: "Sección 3: Arrendamiento y PPA",
        type: "text",
        content: "Sección 3: Arrendamiento y PPA"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_2_1",
        type: "open_response",
        label: "Un cliente tiene un crédito de 680 y quiere cero costo inicial. ¿Qué opciones de financiamiento presentas y en qué orden?",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_4_2_es_2",
        type: "open_response",
        label: "Explica la estrategia del ITC a 18 meses en menos de 90 segundos. Practica con un compañero.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_2_es_3",
        type: "open_response",
        label: "¿Cuándo NO recomendarías un PPA a un cliente que inicialmente dice que lo quiere?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 4.2 Knowledge Check",
      questions: [
        {
          id: "kc_4_2_a",
          question: "What was the main concept covered in Financing Deep Dive?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 4.2 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_3": {
    id: "mod_4_3",
    title: "Módulo 4.3: LA PILA DE VALOR: MÁS ALLÁ DEL DINERO",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Pilar 1: Ahorros Económicos",
        type: "text",
        content: "— Reducción de la factura eléctrica, protección contra la inflación, ROI positivo a largo plazo"
      },
      {
        title: "Pilar 2: Resiliencia Energética",
        type: "text",
        content: "— Independencia del servicio eléctrico, respaldo para la familia y el hogar, protección contra apagones"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_3_1",
        type: "open_response",
        label: "Para un cliente de muestra que mencionó tener hijos pequeños: ¿qué pila de valor usas? Escribe el guión de 60 segundos.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_4_3_es_2",
        type: "open_response",
        label: "Para un cliente de muestra que mencionó que su vecino tuvo un apagón de 3 días el año pasado: ¿cuál pilar tiene prioridad? ¿Cómo construyes alrededor de eso?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_3_es_3",
        type: "open_response",
        label: "Practica la pila de valor de 60 segundos con tres pilares diferentes. Grábate y escúchate de vuelta.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_4": {
    id: "mod_4_4",
    title: "Módulo 4.4: MEDICIÓN NETA Y ALMACENAMIENTO DE BATERÍA",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Sección 1: NEM Explicado de Manera Sencilla",
        type: "text",
        content: "Sección 1: NEM Explicado de Manera Sencilla"
      },
      {
        title: "Sección 2: Cuándo Tienen Sentido las Baterías",
        type: "text",
        content: "Sección 2: Cuándo Tienen Sentido las Baterías"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_4_1",
        type: "open_response",
        label: "Para un cliente en California con NEM 3.0 y tarifa TOU: ¿buscas incluir batería? ¿Por qué?",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_4_4_es_2",
        type: "open_response",
        label: "Para un cliente en Arizona con tarifa plana y crédito NEM generoso: ¿cuál es tu razonamiento para la batería?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_4_es_3",
        type: "open_response",
        label: "Practica explicar la medición neta en 90 segundos o menos sin usar el término \"kWh.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_5": {
    id: "mod_4_5",
    title: "Módulo 4.5: DISEÑO DEL SISTEMA Y ESTIMACIONES DE PRODUCCIÓN",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Sección 1: Demostración de Diseño en Vivo",
        type: "text",
        content: "Sección 1: Demostración de Diseño en Vivo"
      },
      {
        title: "Sección 2: Lenguaje de Cumplimiento para Estimaciones",
        type: "text",
        content: "Sección 2: Lenguaje de Cumplimiento para Estimaciones"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_5_1",
        type: "open_response",
        label: "Usa la herramienta de diseño de [COMPANY_NAME] para crear un diseño completo para el cliente de muestra. Practica presentarlo en voz alta como si fuera una cita real.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_4_5_es_2",
        type: "open_response",
        label: "¿Cuáles son los tres factores principales que podrían reducir la producción real por debajo de la estimación? ¿Cómo mencionas esto proactivamente con el cliente?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 4.5 Knowledge Check",
      questions: [
        {
          id: "kc_4_5_a",
          question: "What was the main concept covered in System Design & Production Estimates?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 4.5 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_6": {
    id: "mod_4_6",
    title: "Módulo 4.6: EL FLUJO COMPLETO DE LA PRESENTACIÓN",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Fase 1 — Conexión y Descubrimiento (10–15 min):",
        type: "text",
        content: "Rompe el hielo, construye rapport, haz preguntas de descubrimiento (uso de energía, historia de facturas, situación de vida, valores)"
      },
      {
        title: "Fase 2 — Educación de la Factura (5–10 min):",
        type: "text",
        content: "Analiza la factura actual del cliente, identifica la estructura tarifaria, muestra la proyección de inflación"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_6_1",
        type: "open_response",
        label: "Practica una presentación completa de 60 minutos con un compañero. Grábala. Cronometra cada fase. ¿Qué fases tomaron demasiado tiempo?",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_4_6_es_2",
        type: "open_response",
        label: "Lista 5 señales de compra comunes que podrías escuchar durante una presentación solar. ¿Cómo respondes a cada una?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_6_es_3",
        type: "open_response",
        label: "El cliente interrumpe en la Fase 3 y pregunta: \"Bien, ¿cuánto va a costar esto?\" Escribe tu respuesta.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 4.6 Knowledge Check",
      questions: [
        {
          id: "kc_4_6_a",
          question: "What was the main concept covered in The Full Presentation Flow?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 4.6 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_7": {
    id: "mod_4_7",
    title: "Módulo 4.7: MÓDULO 4.7 — RESUMEN DEL DÍA 4 Y TAREA",
    subtitle: "Antes del Día 5, completa lo siguiente:",
    sections: [
      {
        title: "Sección: La Tarea de Esta Noche",
        type: "text",
        content: "Antes del Día 5, completa lo siguiente: 1."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_7_1",
        type: "open_response",
        label: "Completa la hoja de reflexión del Día 4 antes de la sesión del Día 5.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_4_7_es_2",
        type: "open_response",
        label: "Haz los 5 ejercicios de tarea y trae tu análisis de la factura terminado al Día 5.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_5_1": {
    id: "mod_5_1",
    title: "Módulo 5.1: TÉCNICAS DE CIERRE AVANZADAS",
    subtitle: "Reframe objections as requests for more information Respond calmly, not defensively Turn objections into closes",
    sections: [
      {
        title: "Cierre del Resumen:",
        type: "text",
        content: "Recapitula los puntos clave que resonaron con el cliente antes de solicitar la decisión — \"Entonces, basado en lo que hablamos: [resumen de 3 puntos]. ¿Tiene sentido seguir adelante hoy?\""
      },
      {
        title: "Cierre de la Pregunta de Prueba:",
        type: "text",
        content: "Usa preguntas de sondeo para probar el nivel de compromiso — \"Si pudiéramos resolver [objeción específica], ¿habría algo más que te detuviera?\""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_1_1",
        type: "open_response",
        label: "Practica el cierre del resumen usando el escenario del cliente de muestra. Cronométrate: debe quedar en menos de 60 segundos.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_5_1_es_2",
        type: "open_response",
        label: "Para cada uno de los 5 tipos de cierre, escribe una situación en la que sería la opción correcta vs. incorrecta.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_5_1_es_3",
        type: "open_response",
        label: "Juego de roles: practica el cierre del silencio. Haz la pregunta de cierre y espera. ¿Cuántos segundos puedes aguantar sin hablar?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 5.1 Knowledge Check",
      questions: [
        {
          id: "kc_5_1_a",
          question: "What was the main concept covered in Objection Handling Psychology?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 5.1 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_5_2": {
    id: "mod_5_2",
    title: "Módulo 5.2: MANEJO DE OBJECIONES",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Sección 1: El Marco de las Objeciones",
        type: "text",
        content: "Sección 1: El Marco de las Objeciones"
      },
      {
        title: "Sección 2: Las 7 Objeciones Más Comunes y Sus Respuestas",
        type: "text",
        content: "Sección 2: Las 7 Objeciones Más Comunes y Sus Respuestas"
      },
      {
        title: "Trust Issues, Home Sale, Roof Warranty, Technology",
        type: "text",
        content: "Don't trust solar companies — acknowledge the concern, ask what specifically they've heard, then show credentials: licenses, reviews, BBB rating, and warranty terms in writing. What if I sell my house — solar adds home value beyond the remaining loan balance; buyers often pay more for solar homes. Roof warranty — your workmanship warranty covers the installation for ten years; existing roof warranties can be reviewed before signing. Technology will be better next year — true, and it's been true for forty years. Every month you wait is a month you're paying the utility. What specifically are you hoping improves?"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_2_1",
        type: "open_response",
        label: "Para cada una de las 7 objeciones, escribe tu respuesta personalizada en tus propias palabras. Practica con un compañero.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_5_2_es_2",
        type: "open_response",
        label: "Juego de roles de objeción avanzada: el formador lanza una objeción diferente cada 30 segundos. El rep debe responder usando el proceso de 4 pasos sin saltarse pasos.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 5.2 Knowledge Check",
      questions: [
        {
          id: "kc_5_2_a",
          question: "What was the main concept covered in The Top 10 Closing Objections + Responses?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 5.2 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_5_3": {
    id: "mod_5_3",
    title: "Módulo 5.3: CIERRE PARA REFERIDOS Y REVISIONES",
    subtitle: "Ask for the sale confidently Use proven closing techniques without pressure Handle last-minute resistance",
    sections: [
      {
        title: "Sección 1: El Momento del Referido",
        type: "text",
        content: "Sección 1: El Momento del Referido"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_3_1",
        type: "open_response",
        label: "Escribe tu guión personal de referidos para usar en el día de la firma. Practica hasta que suene natural.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_5_3_es_2",
        type: "open_response",
        label: "Escribe tu guión de solicitud de reseña. ¿Qué plataforma usarás? ¿Cómo harás que sea fácil para el cliente ir directamente al enlace?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 5.3 Knowledge Check",
      questions: [
        {
          id: "kc_5_3_a",
          question: "What was the main concept covered in Closing Techniques?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 5.3 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_5_4": {
    id: "mod_5_4",
    title: "Módulo 5.4: GESTIÓN POST-VENTA",
    subtitle: "Walk through contract clearly and confidently Prevent buyer's remorse before it starts Meet all legal/compliance obligat",
    sections: [
      {
        title: "Sección 1: Los Primeros 72 Horas — Prevención del Remordimiento del Comprador",
        type: "text",
        content: "Sección 1: Los Primeros 72 Horas — Prevención del Remordimiento del Comprador"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_4_1",
        type: "open_response",
        label: "Escribe tu guión completo de la llamada de inoculación de 48 horas. Practica hasta que suene como una conversación genuina, no un guión.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_5_4_es_2",
        type: "open_response",
        label: "Diseña tu plantilla de mensaje de actualización de hitos para los 7 hitos principales del proyecto solar. Escríbelos en tu voz — no como una comunicación corporativa genérica.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 5.4 Knowledge Check",
      questions: [
        {
          id: "kc_5_4_a",
          question: "What was the main concept covered in Contract Walk-Through & Compliance?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 5.4 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_5_5": {
    id: "mod_5_5",
    title: "Módulo 5.5: CONSTRUCCIÓN DE PIPELINE A LARGO PLAZO",
    subtitle: "Understand why cancellations happen Prevent remorse before it sets in Lock in commitment post-close",
    sections: [
      {
        title: "Sección 1: Construyendo un Pipeline de Referidos Sostenible",
        type: "text",
        content: "Sección 1: Construyendo un Pipeline de Referidos Sostenible"
      },
      {
        title: "Clientes pasados:",
        type: "text",
        content: "Comunícate periódicamente — no solo cuando necesitas algo"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_5_1",
        type: "open_response",
        label: "Diseña tu sistema de seguimiento de clientes pasados. ¿Con qué frecuencia contactas? ¿Qué dices? Escribe las plantillas.",
        placeholder: "Type your reflection here...",
        lines: 2
      },
      {
        id: "wb_5_5_es_2",
        type: "open_response",
        label: "Audita tu uso actual del CRM. ¿Qué información crítica falta actualmente en tus registros de clientes?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 5.5 Knowledge Check",
      questions: [
        {
          id: "kc_5_5_a",
          question: "What was the main concept covered in Cancellation Prevention & Buyer's Remorse?",
          options: ["The concept taught in this module", "An incorrect distractor", "Another incorrect concept", "None of the above"],
          correctAnswerIndex: 0,
          explanation: "This is an autogenerated placeholder for the 5.5 quiz."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_5_6": {
    id: "mod_5_6",
    title: "Module 5.6: Day 5 Wrap-Up & Homework",
    subtitle: "missing_from_source",
    sections: [
      {
        title: "Study and Practice Tonight",
        type: "text",
        content: "Tonight: study all ten objection responses until you can deliver each one fluently without notes. Then run a full appointment simulation — door knock, discovery, presentation, close — with a friend or partner playing a difficult homeowner. Finally, review the Day Six preview. Tomorrow you'll build your referral system, track your performance like a pro, and take your certification exam. By the end of Day Six, you'll be ready for the field. Come in tomorrow fully rested and focused."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_6_1",
        type: "open_response",
        label: "Reflect on Day 5 Wrap-Up & Homework: How will you apply this?",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections","workbookPrompts"],
    }
  },

  "mod_1_5a": {
    id: "mod_1_5a",
    title: "Módulo 1.5A: Entendiendo las Facturas de Servicios Públicos y Net Metering",
    subtitle: "> **Contenido Completo V2 — SeptiVolt Solar Sales Rep Accelerator™**",
    sections: [
      {
        title: "Introducción",
        type: "text",
        content: "Entender cómo se factura actualmente a los propietarios — y exactamente cómo el solar cambia esa ecuación — es el fundamento financiero de todo discurso solar. El Módulo 1.5A entrena a los representantes para leer facturas de servicios públicos con fluidez y explicar el net metering (NEM) en lenguaje simple y accesible. Si un representante no puede explicar con confianza cómo funciona una factura de servicios públicos, no puede explicar de manera creíble por qué el solar es una mejor alternativa financiera."
      },
      {
        title: "Sección 2: Tarifas Escalonadas vs. Time-of-Use (TOU)",
        type: "list",
        content: "Precio Escalonado: Cuanto más usas, más pagas por unidad.",
        items: ["Nivel base: La energía más barata (p. ej., los primeros 500 kWh)", "Nivel 2/3: Energía más cara (p. ej., 501+ kWh)"]
      },
      {
        title: "Sección 3: Net Energy Metering (NEM) Explicado",
        type: "text",
        content: "NEM es el motor que hace que el solar sea financieramente viable para hogares conectados a la red."
      },
      {
        title: "Sección 4: La Factura de \"Liquidación Anual\" (True-Up)",
        type: "text",
        content: "Introduce la importancia de entender la imagen del \"antes\"."
      },
      {
        title: "La Anatomía de una Factura de Servicios Públicos",
        type: "text",
        content: "Resalta los 4 componentes clave: Uso, Plan de Tarifas, Total a Pagar, Entrega vs. Suministro."
      },
      {
        title: "Escalonado vs. Time-of-Use (TOU)",
        type: "list",
        content: "Compara las dos estructuras tarifarias principales. Analiza las horas pico vs. fuera de pico.",
        items: ["Annual billing cycle vs. monthly billing cycle.", "The True-Up is the annual reconciliation of what was produced vs. what was consumed.", "Setting expectations: A solar bill doesn't usually look like zero every month. There are usually base connection fees ($10–$20/mo) that cannot be offset."]
      },
      {
        title: "Net Energy Metering (NEM)",
        type: "slides",
        content: "Explica NEM usando la analogía de la \"cuenta bancaria\": créditos y débitos."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_5a_1",
        type: "open_response",
        label: "Revisa la factura de servicios públicos de muestra proporcionada por tu entrenador. Identifica el Uso Total de kWh del mes, el Plan de Tarifas (Escalonado o TOU) y la tarifa/cargo base de conexión total.",
        placeholder: "kWh usage: __ | Rate Plan: __ | Base fee: __",
        lines: 2
      },
      {
        id: "wb_1_5a_2",
        type: "open_response",
        label: "Con tus propias palabras, resume Net Energy Metering (NEM) como si lo estuvieras explicando a un propietario que nunca ha escuchado el término.",
        placeholder: "Think of the utility grid like...",
        lines: 4
      },
      {
        id: "wb_1_5a_3",
        type: "open_response",
        label: "Un propietario te muestra una factura altamente escalonada, donde paga 15¢ por el Nivel 1, 28¢ por el Nivel 2 y 45¢ por el Nivel 3. ¿Cómo les explicas el beneficio financiero del solar?",
        placeholder: "Your pitch...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 1.5A Knowledge Check",
      questions: [
        {
          id: "kc_1_5a_1",
          question: "If a homeowner is on a Time-of-Use (TOU) plan, when is their power generally the most expensive?",
          options: ["Overnight", "Mid-Day", "Late Afternoon / Evening (e.g., 4 PM to 9 PM)", "Early Morning"],
          correctAnswerIndex: 2,
          explanation: "Peak hours on TOU plans are typically late afternoon and evening when grid demand is highest."
        },
        {
          id: "kc_1_5a_2",
          question: "What is a True-Up bill?",
          options: ["A monthly fee for being connected to the grid.", "An annual billing cycle where the utility reconciles total solar production against total grid consumption.", "A penalty fee for producing too much solar energy.", "The bill received on the anniversary of the home purchase."],
          correctAnswerIndex: 1,
          explanation: "The True-Up is the annual reconciliation — the math of all your credits versus all your usage for the year."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_1_5b": {
    id: "mod_1_5b",
    title: "Módulo 1.5B: Estructuras Financieras del Solar",
    subtitle: "> **Contenido Completo V2 — SeptiVolt Solar Sales Rep Accelerator™**",
    sections: [
      {
        title: "Introducción",
        type: "text",
        content: "El solar no es un producto financiero de talla única. El Módulo 1.5B entrena a los representantes sobre las principales formas en que un propietario puede pagar por el solar: Contado, Préstamo y Propiedad por Terceros (Arrendamiento / PPA). El objetivo no es sesgar al representante hacia un producto específico, sino enseñarles a hacer coincidir el vehículo financiero correcto con la situación financiera y los objetivos específicos del propietario."
      },
      {
        title: "Sección 2: El Crédito Fiscal Federal por Inversión (ITC)",
        type: "list",
        content: "Qué es: Un crédito fiscal federal (actualmente 30% bajo la IRA) por un porcentaje del costo total del sistema solar. CUMPLIMIENTO CRÍTICO: Los representantes de ventas NO son CPAs. No puedes garantizar que un propietario recibirá el crédito ni decirles cómo declararlo. DEBES usar frases como: \"Según lo que entiendo sobre el crédito...\" (y siempre referirlos a su asesor fiscal)",
        items: ["Explain the core mechanics of a Cash purchase, Solar Loan, Solar Lease, and Power Purchase Agreement (PPA).", "Identify the ideal homeowner profile for each financial product.", "Explain the Federal Solar Investment Tax Credit (ITC) accurately, without giving illegal tax advice.", "Understand the difference between dealer fees and the cash price of a system.", "Position the 'Swap Your Bill' concept effectively."]
      },
      {
        title: "Sección 3: Emparejamiento de Productos",
        type: "text",
        content: "Compra en Contado: Préstamo Solar: Arrendamiento / PPA (Propiedad por Terceros):"
      },
      {
        title: "El Concepto de \"Cambia Tu Factura\"",
        type: "text",
        content: "Explica cómo reemplazar una factura de servicios públicos que siempre sube con un pago fijo."
      },
      {
        title: "Cumplimiento del ITC Federal",
        type: "text",
        content: "Límites críticos de cumplimiento: Nunca des asesoría fiscal."
      },
      {
        title: "Opción 1: Compra en Contado",
        type: "slides",
        content: "Máximo ROI, máximo costo inicial."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_5b_1",
        type: "open_response",
        label: "Un propietario jubilado con pensión fija menciona que ya no paga impuestos sobre la renta. Quiere solar para reducir sus facturas mensuales. ¿Cuál producto financiero (Contado, Préstamo o Arrendamiento/PPA) es probablemente el peor para él, y por qué?",
        placeholder: "Worst fit: __ | Because...",
        lines: 3
      },
      {
        id: "wb_1_5b_2",
        type: "open_response",
        label: "Escribe la frase exacta que usarías para explicar el Crédito Fiscal Federal a un propietario mientras mantienes estricto cumplimiento (sin actuar como CPA).",
        placeholder: "Depending on your tax situation...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 1.5B Knowledge Check",
      questions: [
        {
          id: "kc_1_5b_1",
          question: "Why does a 25-year solar loan often have an 18-month target date built into it?",
          options: ["That is when the equipment warranty expires.", "That gives the homeowner time to receive their tax return and apply the Tax Credit (ITC) to the loan principal to keep the payment low.", "The loan must be paid off entirely in 18 months.", "It takes 18 months for the solar panels to turn on."],
          correctAnswerIndex: 1,
          explanation: "The 18-month window is designed to let the homeowner apply their ITC refund to the principal, keeping the long-term monthly payment low."
        },
        {
          id: "kc_1_5b_2",
          question: "Which of the following scenarios is ideal for a Third-Party Ownership (Lease or PPA) product?",
          options: ["A high-income earner looking for the absolute best ROI over 25 years.", "A homeowner wanting to add battery storage and claim all tax incentives.", "A homeowner who pays zero federal taxes and just wants a lower electric bill with peace of mind regarding maintenance.", "A homeowner looking to increase the resale value of their home for a sale next year."],
          correctAnswerIndex: 2,
          explanation: "Lease/PPA is ideal when the homeowner cannot use the ITC — retirees on fixed income are the classic example."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_1_7a": {
    id: "mod_1_7a",
    title: "Módulo 1.7A: Conciencia Básica de Ingeniería del Sitio",
    subtitle: "> **Contenido Completo V2 — SeptiVolt Solar Sales Rep Accelerator™**",
    sections: [
      {
        title: "Introducción",
        type: "text",
        content: "La fuente más común de fricción post-cierre es una condición del sitio descubierta en el estudio que el representante debería haber visto en la visita de ventas. El Módulo 1.7A enseña a los representantes la \"Conciencia de Ingeniería del Sitio\" — no cómo ser electricista o ingeniero estructural, sino cómo observar indicadores clave en el techo y el panel eléctrico para detectar señales de alerta temprano."
      },
      {
        title: "Sección 2: El Panel Eléctrico",
        type: "quote",
        content: "Servicio de 100A vs. 200A: La observación más crítica. Un panel de 100 amperios a menudo requiere una Actualización del Panel Principal (MPU) para manejar la retroalimentación de un arreglo solar moderno. Qué buscar: El número estampado en el interruptor principal. Espacio para Breakers: Incluso un panel de 200A puede ser un problema si cada ranura está completamente llena (requiere un subpanel o derivación en el lado de línea)."
      },
      {
        title: "Sección 3: El Límite \"Señalar vs. Adivinar\"",
        type: "list",
        content: "El error de mayor riesgo que puede cometer un representante es adivinar cuánto costará una actualización o prometer que no será necesaria. Lenguaje Correcto de Señalización: \"Noté que tu panel puede ser de 100 amperios — quiero señalárselo a nuestro equipo de estudio del sitio porque, dependiendo del tamaño del sistema, puede necesitarse una actualización. Es algo que confirmarán durante el estudio, y prefiero que lo sepas ahora que después.\"",
        items: ["Identify the optimal roof orientations (azimuth) for solar production and explain why it matters.", "Visually identify roof shading issues and understand how they impact production estimates.", "Distinguish visually between a 100A and 200A main electrical panel.", "Understand the Flag vs. Guess boundary: flagging potential issues for the survey team without diagnosing or quoting costs prematurely.", "Create a personal pre-survey field observation checklist."]
      },
      {
        title: "Leyendo el Techo",
        type: "text",
        content: "Analiza el Azimut (Sur = Mejor), Inclinación y Sombra."
      },
      {
        title: "Conciencia del Panel Eléctrico",
        type: "text",
        content: "Enfócate en identificar el servicio de 100A vs. 200A."
      },
      {
        title: "El Límite Señalar vs. Adivinar",
        type: "text",
        content: "Enseña el guión exacto para señalar un problema sin cotizar un costo ni hacer una promesa."
      },
      {
        title: "Lista de Verificación de Observación de Campo",
        type: "slides",
        content: "Revisa los elementos que todo representante debe verificar antes de abandonar la propiedad."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_1_7a_1",
        type: "open_response",
        label: "Durante una visita de ventas, notas el panel eléctrico principal en el garaje. El interruptor principal está etiquetado como \"100A\". El panel tiene dos ranuras de breaker abiertas de aproximadamente 20 ranuras totales. ¿Qué le debes decir al propietario sobre esta observación?",
        placeholder: "I noticed your main panel is...",
        lines: 3
      },
      {
        id: "wb_1_7a_2",
        type: "open_response",
        label: "El techo orientado al sur principal de un propietario tiene un gran roble maduro proyectando sombra sobre el 40% del plano. No lo han mencionado. ¿Cómo manejas esta observación en la conversación?",
        placeholder: "I want to be upfront with you about something I noticed...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 1.7A Knowledge Check",
      questions: [
        {
          id: "kc_1_7a_1",
          question: "Which roof orientation produces the most annual solar energy in the northern hemisphere?",
          options: ["East-facing", "West-facing", "North-facing", "South-facing"],
          correctAnswerIndex: 3,
          explanation: "South-facing roofs receive the most direct sunlight throughout the day in the northern hemisphere."
        },
        {
          id: "kc_1_7a_2",
          question: "During a sales visit, a rep notices the main electrical panel's main breaker is labeled '100A.' What is the most appropriate next action?",
          options: ["Tell the homeowner the project cannot proceed without an upgrade.", "Ignore it — the site survey team will figure it out.", "Proactively flag it to the homeowner as something the site survey team will assess, explain it may affect project scope or cost, and note it in your visit summary.", "Quote a specific MPU cost range to the homeowner so they can budget accordingly."],
          correctAnswerIndex: 2,
          explanation: "Flag it professionally, set the expectation, but never guess the cost. That's the survey team's job."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_7a": {
    id: "mod_3_7a",
    title: "Módulo 3.7A: Preguntas Técnicas de Descubrimiento",
    subtitle: "> **Contenido Completo V2 — SeptiVolt Solar Sales Rep Accelerator™**",
    sections: [
      {
        title: "Introducción",
        type: "text",
        content: "El descubrimiento no se trata solo de encontrar la motivación financiera del propietario; también se trata de descubrir los \"factores que destruyen acuerdos\" técnicos antes de gastar tiempo en un diseño. El Módulo 3.7A entrena a los reps en las preguntas técnicas de alto valor que detectan problemas de techo, eléctricos y estructurales al inicio de la conversación."
      },
      {
        title: "Sección 3: Posicionamiento del Descubrimiento como \"Diligencia Debida del Experto\"",
        type: "list",
        content: "No bombardees al propietario con preguntas. Explica *por qué* preguntas.",
        items: ["Ask natural, non-intrusive questions about roof age, electrical service, and site conditions that surface potential project risks before the survey.", "Identify homeowner signals that indicate HOA involvement, contractor history, or permitting sensitivities — and respond appropriately.", "Discover future load growth (EVs, pool equipment, additions) that may affect system sizing recommendations.", "Surface outage history and backup priorities in a way that opens the battery conversation naturally.", "Document technical discovery findings accurately so the survey team and operations have the context they need."]
      },
      {
        title: "Section 1: The Tone That Makes It Work",
        type: "text",
        content: "Technical questions should feel like a rep taking genuine interest in the homeowner's home — not like a checklist being read from a clipboard. The rep who says 'Before I put together your proposal, I want to make sure I'm recommending the right system for your specific home — can I ask a few things about the house?' sounds like a professional."
      },
      {
        title: "Section 2: The Question Banks",
        type: "list",
        content: "Key technical discovery questions to weave naturally into conversation:",
        items: ["Roof Age & Condition: 'Do you know roughly how old your roof is?' Surfaces viability and ownership timeline.", "Electrical Panel: 'Do you know if your home has a 100-amp or 200-amp electrical panel?' Surfaces MPU risk.", "Outage History: 'How often do you lose power in your area?' Opens the battery conversation naturally.", "Future Load Growth: 'Are you planning to get an electric vehicle in the next few years?' Determines correct sizing.", "HOA & Permitting: 'Is your home part of an HOA?' Surfaces pipeline friction points.", "Detached Structures: 'Is that structure in the back a garage, a workshop — is that part of your property?' Surfaces scope complexity."]
      },
      {
        title: "Section 3: The Documentation Habit",
        type: "text",
        content: "After every discovery conversation, reps should document:\n- Roof age/condition signals\n- Electrical panel type (if known)\n- Outage history and backup priority level\n- Future load plans (EV, additions, electrification)\n- HOA involvement\n- Competitive landscape\n- Any red flags for the survey team\n\nThis documentation is what makes the survey handoff effective."
      },
      {
        title: "Module 3.7A Slide Deck",
        type: "slides",
        content: "Slide deck for Technical Discovery Questions"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_7a_1",
        type: "open_response",
        label: "Escribe exactamente cómo le preguntarías a un propietario sobre cargas eléctricas futuras (EVs, piscinas, etc.) sin sonar como si estuvieras intentando venderles más.",
        placeholder: "Before I put together your proposal, I want to make sure...",
        lines: 5
      },
      {
        id: "wb_3_7a_2",
        type: "open_response",
        label: "Un propietario dice que su techo está \"bien\" pero no ha estado en el ático en 10 años. ¿Cuál es tu pregunta de descubrimiento de seguimiento?",
        placeholder: "Good to know — a lot of states actually protect homeowners' rights to install solar...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 3.7A Knowledge Check",
      questions: [
        {
          id: "kc_3_7a_1",
          question: "A homeowner says their roof was 'put on when we moved in — that was 1996.' What is the most appropriate rep response?",
          options: ["That roof is too old for solar — we'll need to talk about a replacement first.", "That's fine — most roofs can support solar regardless of age.", "Good to know. Our site survey team does a roof assessment as part of the process — I'll make sure they take a close look so we don't run into anything unexpected.", "I can't move forward with a proposal until we know the roof condition."],
          correctAnswerIndex: 2,
          explanation: "Flag it professionally and let the survey team assess. Never unilaterally disqualify or guarantee without data."
        },
        {
          id: "kc_3_7a_2",
          question: "A homeowner says they're in an HOA that has 'been difficult before.' The best rep response is:",
          options: ["Don't worry — HOAs can't legally block solar in most states.", "That may be a problem — I'll need to check with our team before we can proceed.", "Good to know. Most states do protect homeowners' rights to install solar, but there's still an HOA review process our team manages. It usually adds a few weeks to the timeline, and I'll flag this for our operations team.", "HOA approval isn't part of our process — that's something you'd handle separately."],
          correctAnswerIndex: 2,
          explanation: "Acknowledge, inform, and take ownership. Never dismiss or scare them unnecessarily."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_3_7b": {
    id: "mod_3_7b",
    title: "Módulo 3.7B: Preparación de la Encuesta del Sitio para Reps",
    subtitle: "> **Contenido Completo V2 — SeptiVolt Solar Sales Rep Accelerator™**",
    sections: [
      {
        title: "Introducción",
        type: "text",
        content: "Un acuerdo \"limpio\" es aquel que pasa por la encuesta del sitio sin órdenes de cambio. El Módulo 3.7B enseña a los reps exactamente qué fotos e información recopilar durante la visita de ventas para asegurar que el equipo de ingeniería tenga todo lo que necesita. Esto reduce las \"bajas\" y construye una reputación de envíos de alta calidad."
      },
      {
        title: "Sección 1: Las 5 Fotos Críticas que Todo Rep Debe Tomar (Lista)",
        type: "list",
        content: "Sección 1: Las 5 Fotos Críticas que Todo Rep Debe Tomar (Lista)",
        items: ["1. El Panel Eléctrico Principal (con vista clara de la clasificación del Interruptor Principal).", "2. El Medidor de Servicios Públicos (incluyendo la pantalla digital o los marcadores).", "3. La Estructura del Ático (mostrando las vigas y el estado del entarimado).", "4. Los Alrededores del Hogar (mostrando árboles grandes u obstrucciones).", "5. La Vista de la Calle al Hogar (cómo ingresa el servicio eléctrico a la casa)."]
      },
      {
        title: "Section 1: What the Site Survey Is Actually Validating",
        type: "list",
        content: "The survey team is confirming four things:",
        items: ["Roof structural integrity and suitability.", "Shading analysis (quantifying exact production loss to finalize engineering).", "Electrical system compatibility (MPU check, inverter location).", "Site-specific installation planning (conduit routes, access constraints)."]
      },
      {
        title: "Section 2: Pre-Survey Homeowner Preparation",
        type: "text",
        content: "What to tell the homeowner before the survey:\n\nWhat it is: 'The site survey is when our technical team comes to your home to confirm all the details we'll need to finalize your system design.'\n\nWho comes: 'One of our site assessment technicians will come out.'\n\nWhat to have ready: Access to electrical panel, attic access, and secure any pets.\n\nWhat they'll find out: 'After the survey, our engineering team will finalize your design. If they find anything, I'll be your point of contact.'\n\nDO NOT say it's 'just a formality.'"
      },
      {
        title: "Section 3: Documenting Red Flags Correctly",
        type: "text",
        content: "The most common rep documentation failure is notes that are vague, incomplete, or filed in a place the survey team never sees.\n\nVague (Bad): 'Roof might be an issue.'\nSpecific (Good): 'Homeowner believes roof was installed around 1998. Original composition shingles. No known repairs but mentioned some curling near the north-facing section.'\n\nVague (Bad): 'Electrical panel could be an issue.'\nSpecific (Good): 'Homeowner confirmed main breaker is labeled 100A. Panel is in the garage, easily accessible. Rep flagged potential MPU requirement and homeowner is aware.'"
      },
      {
        title: "Module 3.7B Slide Deck",
        type: "slides",
        content: "Slide deck for Site Survey Prep for Reps"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_3_7b_1",
        type: "open_response",
        label: "Usando tu teléfono inteligente, practica tomar una foto clara y legible de un panel eléctrico de muestra. Asegúrate de que las etiquetas de los interruptores y el amperaje principal sean legibles.",
        placeholder: "Homeowner confirmed main breaker is labeled...",
        lines: 2
      },
      {
        id: "wb_3_7b_2",
        type: "open_response",
        label: "Escribe un guion de 3 oraciones que usarás para decirle al propietario qué esperar cuando llegue el técnico profesional de encuesta del sitio.",
        placeholder: "Hey [Name], this is [Your Name] from [Company]...",
        lines: 5
      }
    ],
    quiz: {
      title: "Module 3.7B Knowledge Check",
      questions: [
        {
          id: "kc_3_7b_1",
          question: "A rep closes a deal on Monday. The site survey is scheduled for the following Wednesday. What should the rep do within 24–48 hours of the close?",
          options: ["Nothing — the survey is operations' responsibility from here.", "Confirm the survey date with the homeowner, submit the pre-survey information package to the project coordinator, and document all red flags in the CRM.", "Call the homeowner to make sure they haven't changed their mind.", "Email the survey team the homeowner's contact information and nothing else."],
          correctAnswerIndex: 1,
          explanation: "The rep owns the relationship and the communication. Proactive handoff within 48 hours protects the deal."
        },
        {
          id: "kc_3_7b_2",
          question: "A rep tells the homeowner before the survey: 'The site survey is just a formality — it's really just someone coming to measure the roof and take a few photos.' This is:",
          options: ["Accurate — the survey is mostly visual documentation.", "A compliance violation.", "Problematic — it sets the homeowner up to feel misled if the survey reveals any significant findings that affect scope, cost, or design.", "Fine as long as the survey doesn't actually find anything."],
          correctAnswerIndex: 2,
          explanation: "Never undersell the survey. If it turns up an MPU requirement and you called it a 'formality,' trust is damaged immediately."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: [],
    }
  },

  "mod_4_1a": {
    id: "mod_4_1a",
    title: "Módulo 4.1A: FORMATO ESTÁNDAR",
    subtitle: "Understand TOU rates, explain peak hours, and integrate rate knowledge into savings story.",
    sections: [
      {
        title: "Sección: Fundamentos Básicos de TOU",
        type: "text",
        content: "Sección: Fundamentos Básicos de TOU"
      },
      {
        title: "Sección: Estrategia de Ventas Informada por Tarifas",
        type: "text",
        content: "Sección: Estrategia de Ventas Informada por Tarifas"
      },
      {
        title: "What Peak Hours Actually Mean",
        type: "text",
        content: "Peak hours are when demand on the utility grid is highest — typically 4 PM–9 PM in most markets. Electricity during peak hours costs significantly more than off-peak electricity. Solar panels produce power from roughly 8 AM–5 PM. There's a mismatch between peak production (noon) and peak cost (evening). This gap is the exact reason battery storage has become a stronger financial tool — not just an emergency backup play."
      },
      {
        title: "Net Metering and How Rate Structures Affect It",
        type: "list",
        content: "Net metering allows homeowners to send excess solar power back to the grid and receive a credit on their bill. The value of that credit depends entirely on the utility's program rules — and varies by market.",
        items: ["In flat-rate markets: excess solar may get credited at close to retail rate.", "In TOU markets with newer net metering programs: excess solar exported to the grid during off-peak hours may get credited at a lower rate than what the homeowner pays during evening peak.", "The rep should never assume what the homeowner's net metering credit rate is. Always verify with current program language."]
      },
      {
        title: "How to Use This in the Presentation",
        type: "text",
        content: "Reps do NOT need to recreate a utility rate schedule on the homeowner's kitchen table. The goal is to use rate awareness to deepen trust and explain the 'why' — not to teach a class.\n\nSimple rep language examples:\n'Your utility uses time-of-use rates, which means the electricity you use at night costs more than what solar produces during the day. That's actually part of why a battery can make a real financial difference for you.'\n'With a flat-rate utility like yours, every kilowatt-hour your panels produce offsets your bill at the same rate — which simplifies the math and keeps the payback cleaner.'"
      },
      {
        title: "Rate Structures Vary by Market",
        type: "text",
        content: "Every utility is different. Every state is different. Rate programs change. This module teaches the concept — your specific market training will cover the exact programs your homeowners are on. Key compliance note: Never quote a homeowner's specific rate per kWh unless you have verified their current bill. Utility rates change. Programs change. Always use their actual bill as the reference document."
      },
      {
        title: "Presentation Slides",
        type: "slides",
        content: "Slide deck for Time-of-Use Rates & Utility Tariff Strategy"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_1a_1",
        type: "open_response",
        label: "Identifica la tarifa de un cliente de muestra y determina la recomendación de batería.",
        placeholder: "Rate type & impact on pitch...",
        lines: 3
      },
      {
        id: "wb_4_1a_2",
        type: "open_response",
        label: "Escribe una explicación de 90 segundos de TOU para un propietario.",
        placeholder: "Your response...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 4.1A Knowledge Check",
      questions: [
        {
          id: "kc_4_1a_1",
          question: "A homeowner is on a TOU rate plan with peak hours from 4 PM to 9 PM. Their solar panels produce the most power from 10 AM to 2 PM. What is the primary financial implication of this mismatch?",
          options: ["The homeowner won't produce enough power for their needs", "The solar production occurs during lower-cost hours, meaning peak-hour usage may not be fully offset by solar credits", "Solar panels don't work well in TOU markets", "The homeowner's system is sized incorrectly"],
          correctAnswerIndex: 1,
          explanation: "Peak production is midday; peak cost is evening. When you produce cheap power and consume expensive power, offsets won't cancel dollar for dollar."
        },
        {
          id: "kc_4_1a_2",
          question: "When a homeowner asks you what their net metering credit rate is, the best response is:",
          options: ["It's the same as your retail rate — you get full credit", "It varies by program, and I want to verify the current terms for your utility before I tell you something inaccurate", "Net metering always pays you retail rate for everything you export", "I'm not sure — I'll have to check"],
          correctAnswerIndex: 1,
          explanation: "Confidence comes from knowing you need to verify, not making a guess that becomes a liability."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_2a": {
    id: "mod_4_2a",
    title: "Módulo 4.2A: FORMATO ESTÁNDAR",
    subtitle: "Navigate tax credits and rebates using verification-first language.",
    sections: [
      {
        title: "Sección: Especificaciones Técnicas para No Técnicos",
        type: "text",
        content: "Sección: Especificaciones Técnicas para No Técnicos"
      },
      {
        title: "Four Types of Solar Incentives",
        type: "list",
        content: "Know the difference between the 4 major incentive categories:",
        items: ["Federal incentives: Programs authorized at the national level. Verify current eligibility and terms.", "State incentives: Vary dramatically by state (e.g. tax credits, sales tax exemptions).", "Utility incentives: Rebates per watt installed, demand-response credits. Very time-sensitive.", "Local incentives: City or county programs. Highly variable."]
      },
      {
        title: "Tax Credit vs. Rebate",
        type: "text",
        content: "Tax credit: Reduces the amount of tax you owe to the government. Does not produce a refund if you don't have sufficient tax liability. Depends on individual tax situation.\n\nRebate: A direct payment or bill credit — does not depend on your tax liability. If the program offers $500, you get $500 off, period."
      },
      {
        title: "Verification-First Language",
        type: "text",
        content: "Verification-first language means the rep always acknowledges that incentive programs can change and that the homeowner should verify eligibility before making decisions based on them.\n\nExample: 'A tax credit reduces what you owe the IRS — but the amount you benefit depends on your specific tax situation, and I'd always encourage you to verify that with your tax advisor.'"
      },
      {
        title: "What Reps Can and Cannot Say",
        type: "list",
        content: "Compliance posture is non-negotiable.",
        items: ["CAN SAY: 'There are state, utility, and local incentive programs that may be available to you.'", "CAN SAY: 'A tax credit could reduce what you owe in taxes — your tax advisor would know how that applies.'", "CANNOT SAY: 'You'll get a big check back from the government.'", "CANNOT SAY: 'This basically pays for itself with the incentives.'"]
      },
      {
        title: "Presentation Slides",
        type: "slides",
        content: "Slide deck for Incentive Strategy & Compliance"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_2a_1",
        type: "open_response",
        label: "Explica kW vs. kWh al cliente de muestra. Mantente en menos de 60 segundos.",
        placeholder: "A tax credit is...",
        lines: 3
      },
      {
        id: "wb_4_2a_2",
        type: "open_response",
        label: "¿Cuál es la especificación de equipo más importante para mencionar en tu mercado y por qué?",
        placeholder: "Revised safe response...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 4.2A Knowledge Check",
      questions: [
        {
          id: "kc_4_2a_1",
          question: "A homeowner asks, 'Will I get money back from the government for this?' What is the most accurate response?",
          options: ["Yes — you'll get 30% back when you file your taxes.", "There's a federal tax credit that reduces what you owe in taxes — how much that benefits you depends on your specific tax situation, and your accountant would be the right person to confirm that.", "I'm not sure — I'll have to ask my manager.", "No, that program ended."],
          correctAnswerIndex: 1,
          explanation: "Using verification-first language puts the liability on their tax specialist and builds trust through transparency."
        },
        {
          id: "kc_4_2a_2",
          question: "A rep tells a homeowner, 'You'll definitely get the full federal tax credit — everyone does.' This is:",
          options: ["A strong close", "A compliance violation that creates legal and reputational risk", "Fine as long as the homeowner agrees", "Standard industry practice"],
          correctAnswerIndex: 1,
          explanation: "Not everyone has tax liability. Promising a tax outcome is a compliance violation."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_2b": {
    id: "mod_4_2b",
    title: "Módulo 4.2B: FORMATO ESTÁNDAR",
    subtitle: "Develop the financial intuition to guide homeowners toward the right fit.",
    sections: [
      {
        title: "Sección: Comparación Competitiva de Equipos",
        type: "text",
        content: "Sección: Comparación Competitiva de Equipos"
      },
      {
        title: "Cash Purchase and Solar Loan",
        type: "text",
        content: "Cash: Highest upfront cost but best long-term financial outcome. No interest, homeowner captures all incentives. Best for homeowners with capital.\n\nSolar Loan: Finance through a third-party lender. Little/no money down, monthly payment. Homeowner owns system and is eligible for incentives. Total cost is higher due to interest and dealer fees (fee lending companies charge the solar company)."
      },
      {
        title: "Power Purchase Agreement (PPA) and Solar Lease",
        type: "text",
        content: "PPA: A third-party company installs the system at no upfront cost. Homeowner buys the power at a contracted rate (often lower than utility rate). Usually has an annual escalation clause. No incentive eligibility.\n\nLease: Similar to PPA but homeowner pays a fixed monthly amount to 'rent' the equipment instead of paying per kWh produced. Also does not qualify for tax incentives directly."
      },
      {
        title: "How to Guide Without Overwhelming",
        type: "text",
        content: "Don't present all four options at once. Guide the homeowner using simple questions:\n- 'Do you want to own it?' → Ownership path\n- 'Do you have cash available, or would you prefer payments?' → Cash vs. loan\n- 'Is ownership important, or reducing your bill the main goal?' → Opens PPA/lease dialogue\n- 'Do you plan to be in this home long term?'"
      },
      {
        title: "Presentation Slides",
        type: "slides",
        content: "Slide deck for Financing Economics"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_2b_1",
        type: "open_response",
        label: "Compara dos marcas de paneles en las métricas más importantes. ¿Cuál recomiendas y por qué?",
        placeholder: "Best fit and why...",
        lines: 3
      },
      {
        id: "wb_4_2b_2",
        type: "open_response",
        label: "¿Cómo respondes a un cliente que dice \"mi vecino tiene Tesla Powerwall, ¿por qué me ofreces otra batería?\"",
        placeholder: "Your response...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 4.2B Knowledge Check",
      questions: [
        {
          id: "kc_4_2b_1",
          question: "Which of the following is a key difference between a PPA and a solar lease?",
          options: ["In a PPA, the homeowner owns the system; in a lease, they do not", "In a PPA, the homeowner pays per kilowatt-hour produced; in a lease, they pay a flat monthly amount for the equipment", "A lease always has a lower rate than a PPA", "There is no meaningful difference"],
          correctAnswerIndex: 1,
          explanation: "PPA is buying power, Lease is renting hardware."
        },
        {
          id: "kc_4_2b_2",
          question: "A dealer fee in solar financing refers to:",
          options: ["A fee the homeowner pays the dealer when buying the system", "A fee the lending company charges the solar company to offer their loan product — which is often built into the system price", "A government surcharge on financed solar systems", "A fee charged to the rep by their employer"],
          correctAnswerIndex: 1,
          explanation: "Dealer fees are the cost of borrowing built into the total financed cost. It's not a scam, just the economics of lending."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_4_4a": {
    id: "mod_4_4a",
    title: "Módulo 4.4A: NEM 3.0 Y LÓGICA DE VENTAS DE BATERÍA",
    subtitle: "Understand the NEM 3.0 shift and build the battery conversation correctly.",
    sections: [
      {
        title: "Sección 1: ¿Qué Es la Medición Neta? (10 min)",
        type: "text",
        content: "Sección 1: ¿Qué Es la Medición Neta? (10 min)"
      },
      {
        title: "Sección 2: Los Cambios de NEM 3.0 (15 min)",
        type: "list",
        content: "Sección 2: Los Cambios de NEM 3.0 (15 min)",
        items: ["NEM 3.0 entró en vigor en California el 14 de abril de 2023 para nuevas solicitudes de servicios eléctricos", "Los cambios clave:", "Los créditos de exportación cayeron de ~$0.25–0.35/kWh (NEM 2.0) a ~$0.04–0.08/kWh (NEM 3.0)", "Los créditos varían por hora del día y por servicio eléctrico", "El foco cambia de maximizar la producción total a maximizar el auto-consumo", "Lo que no cambió:", "El ITC federal todavía se aplica", "Los ahorros del auto-consumo todavía son robustos", "Los sistemas de NEM 2.0 existentes están protegidos por 20 años", "La implicación para las ventas: un sistema de solo solar en California bajo NEM 3.0 tiene ahorros significativamente reducidos vs. NEM 2.0 — la batería hace que vuelva a tener sentido"]
      },
      {
        title: "Sección 3: La Matemática de Exportación vs. Auto-Consumo (15 min)",
        type: "text",
        content: "Sección 3: La Matemática de Exportación vs. Auto-Consumo (15 min)"
      },
      {
        title: "Sección 4: La Batería como Herramienta Económica, No Solo Respaldo (10 min)",
        type: "list",
        content: "Sección 4: La Batería como Herramienta Económica, No Solo Respaldo (10 min)",
        items: ["El posicionamiento antiguo: \"La batería es para cuando el servicio eléctrico falla\"", "El posicionamiento nuevo: \"La batería es la herramienta de arbitraje tarifario que maximiza el ROI de tu inversión solar bajo NEM 3.0\"", "Cómo funciona el ciclo económico diario:", "Mediodía: el solar produce más de lo que el hogar necesita → almacena en la batería", "Tarde: el consumo del hogar sube, la producción solar cae → usa la batería en lugar de comprar a la red", "Noche: el hogar usa electricidad de la red, pero el precio pico ya pasó", "El resultado: el cliente maximiza el auto-consumo de energía solar de bajo costo, minimizando la compra de energía de alto costo de la red", "Beneficio secundario: sí, la batería también funciona como respaldo. Pero ese no es el argumento principal bajo NEM 3.0."]
      },
      {
        title: "Sección 5: Criterios de Ajuste de la Batería (10 min)",
        type: "text",
        content: "Sección 5: Criterios de Ajuste de la Batería (10 min)"
      },
      {
        title: "Sección 6: Evitar la Sobre-Venta (5 min)",
        type: "slides",
        content: "Sección 6: Evitar la Sobre-Venta (5 min)"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_4_4a_1",
        type: "open_response",
        label: "El Análisis de NEM 3.0",
        placeholder: "Under the older net metering program...",
        lines: 4
      },
      {
        id: "wb_4_4a_2",
        type: "open_response",
        label: "Calcula los créditos de exportación anuales bajo NEM 2.0 (@$0.30/kWh promedio)",
        placeholder: "With the way net metering works in your area...",
        lines: 4
      },
      {
        id: "wb_4_4a_es_3",
        type: "open_response",
        label: "Calcula los créditos de exportación anuales bajo NEM 3.0 (@$0.06/kWh promedio)",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_4a_es_4",
        type: "open_response",
        label: "Calcula el ahorro de auto-consumo con batería (@$0.35/kWh tarifas pico)",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_4a_es_5",
        type: "open_response",
        label: "¿Tiene sentido económico la batería? ¿Por qué?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_4a_es_6",
        type: "open_response",
        label: "Posicionamiento de la Batería",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_4a_es_7",
        type: "open_response",
        label: "Versión de respaldo (para el cliente cuya preocupación principal es la resiliencia ante apagones)",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_4a_es_8",
        type: "open_response",
        label: "Versión económica (para el cliente que solo le importa el ROI)",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_4a_es_9",
        type: "open_response",
        label: "Recomendación del Árbol de Decisión de Batería",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_4_4a_es_10",
        type: "open_response",
        label: "Explicación del Flujo de Energía",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 4.4A Knowledge Check",
      questions: [
        {
          id: "kc_4_4a_1",
          question: "Under NEM 3.0, what is the primary financial argument for adding battery storage to a solar system?",
          options: ["Batteries provide backup power during outages", "Storing excess solar production and using it during peak-cost evening hours is more financially beneficial than exporting it to the grid at reduced credit rates", "Batteries extend the life of the solar panels", "Batteries are required by law under NEM 3.0"],
          correctAnswerIndex: 1,
          explanation: "Under NEM 3.0, export credits drop significantly. Using stored power at home during peak hours delivers more financial value than exporting."
        },
        {
          id: "kc_4_4a_2",
          question: "A homeowner in a NEM 3.0 market says 'I don't need backup power, so I don't need a battery.' The best response is:",
          options: ["You're right — backup power is the only reason to add a battery.", "Backup is actually the secondary benefit. The primary reason most clients add storage is financial — to capture their own solar at full value instead of exporting it at a reduced credit rate.", "Let me check if your utility requires a battery.", "Batteries are optional and you'll save plenty without one."],
          correctAnswerIndex: 1,
          explanation: "Reframe battery from backup device to financial optimization tool. That's the NEM 3.0 conversation."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_5_5a": {
    id: "mod_5_5a",
    title: "Módulo 5.5A: FORMATO ESTÁNDAR",
    subtitle: "Navigate the journey from contract signature to Permission to Operate.",
    sections: [
      {
        title: "Introducción",
        type: "text",
        content: "La venta no termina cuando se firma el contrato; termina cuando el sistema recibe el PTO (Permiso para Operar). El Módulo 5.5C enseña a los reps cómo gestionar el largo ciclo de instalación para asegurar el \"Pull-through\" y generar reseñas positivas."
      },
      {
        title: "Lista de Introducción:",
        type: "list",
        content: "Lista de Introducción:",
        items: ["Domina la llamada de \"Inoculación de 48 Horas\"", "Entiende el protocolo de \"Actualización de Hitos\"", "Aprende cómo pedir una reseña de 5 estrellas antes de que comience la instalación", "Maneja el \"Gap del Silencio\" — mantén a los propietarios comprometidos durante el permitting", "Identifica los \"Momentos Emocionalmente Altos\" en el ciclo de vida del proyecto"]
      },
      {
        title: "Total Timeline Expectations",
        type: "text",
        content: "From contract signing to PTO, timeline is typically 3 to 6 months in most markets. Some markets are faster, some are significantly slower. Never promise a specific timeline you cannot guarantee. Use ranges and use localized data."
      },
      {
        title: "Where Trust Is Most Commonly Lost",
        type: "list",
        content: "Reps who proactively manage post-sale expectations preserve their deals. Trust is commonly lost in 3 moments:",
        items: ["Moment 1 — The Silence After Signing: Anxiety builds if they hear nothing for weeks. Check in within 48 hours.", "Moment 2 — The Permit Surprise: No one warned them permits can take 6–10 weeks. Set this expectation explicitly at signing.", "Moment 3 — The PTO Confusion: The system is on the roof, but they can't turn it on. Explain PTO clearly before and after installation."]
      },
      {
        title: "The Rep's Role After the Close",
        type: "list",
        content: "Understanding boundaries is essential. Reps who try to do too much create confusion; those who do too little lose deals.",
        items: ["Rep Owns: Homeowner relationship, expectation management, early problem escalation, referral relationship cultivation.", "Operations Owns: Scheduling, design decisions, permit submission, installation scheduling, and inspection."]
      },
      {
        title: "The 7-Touchpoint Model",
        type: "list",
        content: "Use the lifecycle as a proactive, offensive play to build referrals:",
        items: ["1. Day of signing: Here's exactly what happens next.", "2. Site survey confirmation: Your site survey is confirmed.", "3. Post-site survey: Survey went well, design is being finalized.", "4. Permit submitted: Your permit is in.", "5. Install date confirmed: Great news — your install is scheduled!", "6. Day of/after install: Panels are up! Here's the last step.", "7. PTO received: You're officially live. Congratulations."]
      },
      {
        title: "Module 5.5A Slide Deck",
        type: "slides",
        content: ""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_5a_1",
        type: "checklist",
        label: "Crea una plantilla de mensaje de texto de \"Actualización de Hito\" que puedas enviar a un propietario cuando sus permisos sean aprobados.",
        items: ["1. Contract Signed", "2. Site Survey", "3. System Design", "4. Permitting", "5. Installation", "6. Inspection", "7. Permission to Operate (PTO)"]
      },
      {
        id: "wb_5_5a_2",
        type: "open_response",
        label: "Write your at-the-table timeline setting script (under 2 minutes):",
        placeholder: "Before you sign, I want to walk you through exactly what happens next...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 5.5A Knowledge Check",
      questions: [
        {
          id: "kc_5_5a_1",
          question: "What does PTO stand for, and when does it occur in the project lifecycle?",
          options: ["Power Transfer Operation — it occurs at installation", "Permission to Operate — it occurs after inspection, when the utility authorizes turning on the system", "Project Timeline Optimization — it occurs during permitting", "Panel Transfer Order — it occurs when equipment ships"],
          correctAnswerIndex: 1,
          explanation: "PTO stands for Permission to Operate, meaning the utility company has formally granted you the right to connect to the grid."
        },
        {
          id: "kc_5_5a_2",
          question: "A rep closes a deal on a Tuesday. The best next action is:",
          options: ["Wait for the homeowner to contact them with questions", "Contact the homeowner within 48 hours to confirm the site survey is scheduled and review what comes next", "Send a generic thank you email and move on", "Call the homeowner only if there's a problem"],
          correctAnswerIndex: 1,
          explanation: "Avoiding the 'Silence After Signing' protects your deal and reassures the homeowner."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_5_5b": {
    id: "mod_5_5b",
    title: "Módulo 5.5B: FORMATO ESTÁNDAR",
    subtitle: "Issues are normal. Silence is not.",
    sections: [
      {
        title: "Introducción",
        type: "text",
        content: "Los descubrimientos de ingeniería (MPU, problemas estructurales) conducen a órdenes de cambio. El Módulo 5.5D enseña a los reps cómo entregar \"Malas Noticias Técnicas\" de una manera que preserve la venta y la relación."
      },
      {
        title: "Issues by Stage",
        type: "list",
        content: "Awareness of potential issues at each stage helps you communicate effectively:",
        items: ["Survey (Roof Condition): Roof has structural issues or lacks lifespan. (Repair/replace needed).", "Survey (Shade): Shade analysis reduces production potential. Set honest expectations.", "Design (Main Panel Upgrade - MPU): Electrical service panel cannot safely support solar. Significant surprise cost ($1,500–$5k).", "Permitting: Rejections require resubmission. HOAs may enforce separate aesthetic reviews.", "Financing: Lender stipulations like income verification must be cleared for funds.", "Installation & Inspection: Supply chain delays on panels/batteries. Inspection failures add weeks.", "PTO: Utility delays interconnect approval."]
      },
      {
        title: "Competitor Re-Entry",
        type: "quote",
        content: "\"While a homeowner's project is delayed, a competitor approaches them with promises of faster timelines or lower prices. Deal cancellation is high. Prevent this through consistent rep communication. A homeowner who trusts their rep is not a prospect for a competitor.\""
      },
      {
        title: "Escalation vs. Normal Issues",
        type: "list",
        content: "Develop a sense for what requires internal escalation versus what just needs communication.",
        items: ["Normal: Permit corrections, HOA review, PTO wait, minor design adjustments.", "Escalation-Level: MPU discovered with no prior disclosure, failed inspection with no resolution path, explicit cancellation threats, competitor involvement."]
      },
      {
        title: "Module 5.5B Slide Deck",
        type: "slides",
        content: ""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_5b_1",
        type: "open_response",
        label: "Un encuestador descubre que una cara del techo solo puede sostener 10 paneles en lugar de 12. Escribe un guión para explicar el redimensionamiento del sistema al propietario.",
        placeholder: "Our team identified something that actually protects your home...",
        lines: 3
      },
      {
        id: "wb_5_5b_2",
        type: "open_response",
        label: "A competitor offered $4,000 less and a 30-day timeline during your 3-month permit wait. Write your response:",
        placeholder: "Don't disparage. Help them think clearly about starting over...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 5.5B Knowledge Check",
      questions: [
        {
          id: "kc_5_5b_1",
          question: "A homeowner's site survey reveals their electrical panel is 100-amp service. Why does this matter?",
          options: ["It has no impact.", "It may need to be upgraded to 200-amp to safely support the solar system, adding cost and time.", "100-amp panels always need to be replaced, and the homeowner knew this.", "This only matters if the homeowner is adding a battery."],
          correctAnswerIndex: 1,
          explanation: "An MPU (Main Panel Upgrade) is a common pipeline surprise cost that reps must learn to frame properly."
        },
        {
          id: "kc_5_5b_2",
          question: "A competitor approaches a homeowner whose project has been delayed for 8 weeks. The most effective rep response is to:",
          options: ["Tell the homeowner the competitor is lying.", "Tell the homeowner to ignore them.", "Help the homeowner understand what starting over actually means without disparaging the competitor.", "Offer to reduce the price to match."],
          correctAnswerIndex: 2,
          explanation: "Help them understand the timeline reset without being petty."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_5_5c": {
    id: "mod_5_5c",
    title: "Módulo 5.5C: SOLUCIÓN DE PROBLEMAS Y RUTAS DE ESCALACIÓN",
    subtitle: "Structured approach to internal escalations when deals run into trouble.",
    sections: [
      {
        title: "Issue Identification: What Kind of Problem Is This?",
        type: "text",
        content: "Before escalating, correctly categorize what's happening.\n\nCategory A: Design/Technical (Engineering owns it).\nCategory B: Permit/Jurisdiction (Permitting team owns it).\nCategory C: Financing (Finance team owns it).\nCategory D: Install/Inspection (Operations owns it).\nCategory E: Customer Relationship/Cancellation Risk (Rep/Manager owns it)."
      },
      {
        title: "The Pre-Escalation Checklist",
        type: "list",
        content: "Before escalating, gather this info so you are taken seriously:",
        items: ["Homeowner name and deal/project ID", "Current project stage", "Specific factual issue description", "What the homeowner knows so far", "Homeowner's emotional state / cancellation risk", "What resolution the rep believes is needed", "Deadline constraint"]
      },
      {
        title: "What to NOT Say",
        type: "list",
        content: "Reps who blame operations to homeowners create permanent trust damage.",
        items: ["NOT: 'Operations is dropping the ball.' (Assigns blame internally)", "NOT: 'I'm not sure what's going on.' (Creates doubt)", "NOT: 'I'll see what I can do.' (Vague)", "SAY: 'I'm working on getting you a specific answer by [time].'", "SAY: 'I understand this isn't what you expected. I'm taking ownership of this right now.'"]
      },
      {
        title: "The Four-Part Escalation Message",
        type: "text",
        content: "When escalating to a manager, give them a clear package:\n\n1. Who: Homeowner name, deal ID, stage\n2. What: Specific issue — factual\n3. State: Cancellation risk level\n4. Ask: Specific action required, by when"
      },
      {
        title: "Module 5.5C Slide Deck",
        type: "slides",
        content: ""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_5c_1",
        type: "open_response",
        label: "Rewrite this: \"Operations is really behind right now. It's not my fault.\"",
        placeholder: "I want to make sure I get you the right information — let me loop in the right person...",
        lines: 3
      },
      {
        id: "wb_5_5c_2",
        type: "open_response",
        label: "Write a four-part escalation message for Maria Santos (Week 9 permit wait, frustrated):",
        placeholder: "I need to flag a cancellation risk — Maria Santos, Deal 4022. They're at week 9...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 5.5C Knowledge Check",
      questions: [
        {
          id: "kc_5_5c_1",
          question: "A homeowner's loan has been flagged for additional income verification. Which team do you contact?",
          options: ["Engineering", "Permitting", "Finance / contract administration", "Installation"],
          correctAnswerIndex: 2,
          explanation: "This is a Category C financial issue owned by the finance department."
        },
        {
          id: "kc_5_5c_2",
          question: "A homeowner is frustrated and the rep says: 'I'm not sure what's going on — I'm trying to find out.' This statement:",
          options: ["Is honest and appropriate", "Creates doubt without providing comfort", "Builds trust", "Is fine if the homeowner is calm"],
          correctAnswerIndex: 1,
          explanation: "It creates doubt. Replace with a specific action and a callback timeframe."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle","sections","workbookPrompts"],
    }
  },

  "mod_5_5d": {
    id: "mod_5_5d",
    title: "Módulo 5.5D: FORMATO ESTÁNDAR",
    subtitle: "Face the homeowner when friction strikes and bring the deal back.",
    sections: [
      {
        title: "Introducción",
        type: "text",
        content: "Los descubrimientos de ingeniería (MPU, problemas estructurales) conducen a órdenes de cambio. Este módulo enseña a los reps cómo entregar \"Malas Noticias Técnicas\" de una manera que preserve la venta y la relación."
      },
      {
        title: "Communicating Delays Clearly",
        type: "list",
        content: "The five-step proactive delay call framework:",
        items: ["Step 1: Lead with acknowledgment, not defense.", "Step 2: State what happened factually.", "Step 3: Validate the impact.", "Step 4: Provide the next concrete step.", "Step 5: Reaffirm the relationship."]
      },
      {
        title: "Handling Homeowner Ghosting",
        type: "text",
        content: "Ghosting is almost always emotional, not logistical. The 3-strike check-in system:\n\nAttempt 1: Warm, no-pressure check-in call.\nAttempt 2: Value-add project update 5 days later.\nAttempt 3: Honest, direct outreach 5 days later to address concerns directly."
      },
      {
        title: "Spouse or Family Pushback Post-Close",
        type: "text",
        content: "When a family member creates doubt: Do not get defensive. Do not attempt a full re-close re-presentation. Find out the specific concern, offer a focused direct conversation to answer questions, address it honestly, and give them space while keeping the door open."
      },
      {
        title: "Protecting Trust Without Blaming Operations",
        type: "list",
        content: "Blaming operations destroys confidence in the whole company.",
        items: ["Bad: 'I'm trying to figure out why they haven't done this.'", "Good: 'We're working on this and I'm taking personal ownership of getting the answer.'"]
      },
      {
        title: "Module 5.5D Slide Deck",
        type: "slides",
        content: ""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_5_5d_1",
        type: "open_response",
        label: "Un encuestador descubre que una cara del techo solo puede sostener 10 paneles en lugar de 12. Escribe un guión para explicar el redimensionamiento del sistema al propietario.",
        placeholder: "I'm calling because I have an update on your project...",
        lines: 2
      },
      {
        id: "wb_5_5d_2",
        type: "open_response",
        label: "Write the 3rd attempt (honest/direct) outreach for a ghosted lead:",
        placeholder: "I want to make sure I'm serving you well...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 5.5D Knowledge Check",
      questions: [
        {
          id: "kc_5_5d_1",
          question: "A homeowner hasn't responded to two calls and a text in 10 days. Best next action?",
          options: ["Call every day", "Send a warm, low-pressure 3rd outreach acknowledging the disconnect", "Mark as lost", "Escalate immediately to the manager"],
          correctAnswerIndex: 1,
          explanation: "The third outreach is the final, direct but compassionate attempt."
        },
        {
          id: "kc_5_5d_2",
          question: "A homeowner's spouse is resistant after signing. The best approach is:",
          options: ["Re-present the full pitch", "Reduce the price", "Ask to understand the specific concern and offer a focused low-pressure conversation", "Tell the signed homeowner to handle it"],
          correctAnswerIndex: 2,
          explanation: "Never 're-close'. It's overwhelming. Just address their exact lingering doubts objectively."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_1a": {
    id: "mod_6_1a",
    title: "Módulo 6.1A: REFERIDO DEL DÍA 0 Y PROTECCIÓN DE LA REPUTACIÓN",
    subtitle: "Build a systematic referral engine — not a one-time ask.",
    sections: [
      {
        title: "Sección 1 — Por Qué el Día 0 Es el Momento de Referido de Mayor Poder",
        type: "text",
        content: "El momento de la firma es el punto emocional más alto del viaje solar del propietario — al menos hasta su primera factura en vivo. En este momento: Este es el momento que la mayoría de los reps desperdicia recogiendo sus cosas y saliendo."
      },
      {
        title: "La solicitud de referido del Día 0 no es agresiva — es apropiada.",
        type: "list",
        content: "El propietario ya está en un estado emocional de dar. Una solicitud bien enmarcada simplemente da a ese impulso una dirección.",
        items: ["Trigger 1 — At the Close: The homeowner is most excited and committed immediately after signing. Ask: 'Who in your neighborhood do you think would also benefit from this?' Keep it casual and unthreatening.", "Trigger 2 — Post-Install: Panels are on the roof. Neighbors can see them. Homeowner pride is at its peak. Call to celebrate — and ask who's been asking about the panels.", "Trigger 3 — First Bill: The homeowner sees their first reduced bill or credits. Emotion is real. This is the best time for a specific, name-based referral request."]
      },
      {
        title: "Qué hace que funcione una solicitud de referido del Día 0:",
        type: "text",
        content: "Qué hace que funcione una solicitud de referido del Día 0:"
      },
      {
        title: "Lenguaje simple de referido del Día 0:",
        type: "list",
        content: "\"Antes de salir — ahora que has decidido seguir adelante, quiero asegurarme de que las personas que te importan tengan la misma oportunidad. ¿Hay algún vecino en la calle, o algún familiar, que creas que le gustaría tener esta conversación? No te pido que les vendas nada — solo que hagas una introducción si tiene sentido.\"",
        items: ["At Close: 'Before I head out — is there anyone in your neighborhood or circle you think would appreciate knowing about this? I only work with people who are genuinely good fits, so I'd love a warm intro.'", "Post-Install: 'Your system looks great out there! I've had a few reps ask me about neighborhoods like yours — has anyone asked you about the panels yet? I'd love to connect with them.'", "First Bill: 'That's a real result — congratulations. You know what's funny? The people who benefit most from solar are usually the people around you who have similar bills. Is there anyone specific you'd want to pass my number to?'"]
      },
      {
        title: "Sección 2 — Los Tres Momentos de Referido en el Ciclo de Vida del Proyecto",
        type: "text",
        content: "Más allá del Día 0, hay tres momentos naturales adicionales en el proceso donde las conversaciones de referido surgen orgánicamente — sin que el rep tenga que forzarlas."
      },
      {
        title: "Sección 3 — Momentos de Alta Compra Emocional: Leyendo el Ambiente",
        type: "slides",
        content: "Las solicitudes de referido solo funcionan cuando el clima emocional es el correcto. Los reps que preguntan durante la fricción del proceso — durante un retraso de permisos, después de una sorpresa de MPU, en medio de una queja del propietario — dañan tanto la relación de referido como la relación principal."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_1a_1",
        type: "open_response",
        label: "Práctica de la Solicitud de Referido del Día 0",
        placeholder: "Your panels look great out there...",
        lines: 3
      },
      {
        id: "wb_6_1a_2",
        type: "open_response",
        label: "Mapeo de Momentos del Proceso",
        placeholder: "After every signed deal, I will...",
        lines: 3
      },
      {
        id: "wb_6_1a_es_3",
        type: "open_response",
        label: "Evaluación de Luz Roja / Luz Verde",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_1a_es_4",
        type: "open_response",
        label: "Acabas de decirle al propietario que el permiso tardará dos semanas más. Se tomaron la noticia bien pero parecían decepcionados. → ¿Luz verde / Luz roja?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_1a_es_5",
        type: "open_response",
        label: "El equipo de instalación acaba de terminar. El propietario te envió un mensaje de texto con una foto de los paneles desde su patio trasero que decía \"¡Esto es tan emocionante!!\" → ¿Luz verde / Luz roja?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_1a_es_6",
        type: "open_response",
        label: "Estás haciendo seguimiento con un propietario que no ha respondido a tres mensajes en cuatro semanas. Finalmente contestaron. → ¿Luz verde / Luz roja?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_1a_es_7",
        type: "open_response",
        label: "El propietario te llamó porque acaba de recibir su primera factura post-solar y fue de $40 en lugar de los $180 habituales. → ¿Luz verde / Luz roja?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_1a_es_8",
        type: "open_response",
        label: "Acabas de darle la noticia del MPU a un propietario. Están frustrados pero no amenazan con cancelar. → ¿Luz verde / Luz roja?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_1a_es_9",
        type: "open_response",
        label: "Guión del Check-in Post-PTO de 30 Días",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 6.1A Knowledge Check",
      questions: [
        {
          id: "kc_6_1a_1",
          question: "Which of the three referral trigger moments typically converts at the highest rate?",
          options: ["At the close — homeowner is committed and excited", "Post-install — panels are visible and neighbors ask questions", "First bill — homeowner sees real financial results and emotion is highest", "All three convert equally"],
          correctAnswerIndex: 2,
          explanation: "The first bill moment produces the strongest emotional response tied to real financial proof — the highest-converting referral trigger."
        },
        {
          id: "kc_6_1a_2",
          question: "What is the most important step reps skip that kills referral conversion?",
          options: ["Asking for the referral", "Following through with outreach within 24 hours of getting a name", "Sending a thank you card", "Asking for a Google review at the same time"],
          correctAnswerIndex: 1,
          explanation: "Speed is conversion. A name given and not followed up within 24 hours loses more than 50% of its conversion potential."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_2a": {
    id: "mod_6_2a",
    title: "Módulo 6.2A: DISCIPLINA DEL CRM Y GESTIÓN DEL PIPELINE 7-7-7",
    subtitle: "Turn happy clients into a visible, searchable reputation that generates leads.",
    sections: [
      {
        title: "Sección 1 — El Marco de Gestión del Pipeline 7-7-7",
        type: "text",
        content: "El marco 7-7-7 está construido alrededor de un principio simple: la atención de un rep a un trato debe ser proporcional a cuánto tiempo hace que se movió. Los tratos que se movieron recientemente necesitan seguimiento ligero. Los tratos que no se han movido necesitan intervención."
      },
      {
        title: "El marco:",
        type: "list",
        content: "Cualquier trato que no haya tenido una actualización de estado significativa (del equipo de encuesta, operaciones, o el propietario) en siete días debe recibir un check-in iniciado por el rep con el coordinador del proyecto o el propietario. Siete días de silencio en el pipeline es la señal de advertencia temprana. Un trato atascado en la misma etapa del pipeline por más de siete semanas sin avance está en riesgo elevado de cancelación. Este es el umbral para la escalación al gerente según el marco del Módulo 5.5C. Márcalo, escálalo y documenta qué lo está bloqueando. El modelo de 7 contactos del Módulo 5.5A no es solo para prevenir cancelaciones — es la cadencia mínima viable de gestión del pipeline. Un rep que alcanza los siete contactos tiene una tasa de cancelación dramáticamente más baja que uno que solo hace check-in en momentos de crisis.",
        items: ["Best time: Within 48 hours of PTO — the homeowner is officially live, the emotional peak is real, and the experience is fresh.", "Good time: Post-install, when panels are visible and the homeowner is proud.", "Avoid: During pipeline issues, delays, or any moment of friction. A forced review during a bad experience creates a bad review."]
      },
      {
        title: "Punto de enseñanza:",
        type: "text",
        content: "El marco 7-7-7 no es una regla rígida — es un sistema de calibración. Los mercados con plazos de permitting más rápidos pueden usar una cadencia 5-5-5. Los mercados con retraso del servicio eléctrico pueden extender a 10-10-10. Los reps deben localizar los números a su mercado preservando el principio: rastrear la recencia, señalar el estancamiento, mantener los contactos."
      },
      {
        title: "Sección 2 — Seguimiento de Hitos: Qué Rastrear y Por Qué",
        type: "list",
        content: "Los reps que rastrean hitos no se llevan sorpresas. Los reps que no rastrean hitos dependen de operaciones para decirles cuando algo está mal — lo cual siempre es demasiado tarde.",
        items: ["Google Business Profile: Highest priority. Drives local search visibility and shows in Maps results.", "EnergySage: Industry-specific solar comparison site. High-intent prospects research here.", "Yelp: Secondary. Relevant in some markets.", "Facebook: Useful for local community groups where solar decisions are discussed."]
      },
      {
        title: "Los seis hitos que cada rep debe rastrear para cada trato activo:",
        type: "list",
        content: "1. Encuesta completada — Fecha completada, cualquier hallazgo marcado por el equipo de encuesta 2. Diseño aprobado — Fecha finalizada, cualquier cambio de diseño de la propuesta original 3. Permiso presentado — Fecha presentada, jurisdicción, tiempo de procesamiento esperado 4. Permiso aprobado — Fecha aprobada, cualquier corrección requerida antes de la aprobación 5. Instalación programada — Fecha programada, propietario confirmado 6. PTO recibido — Fecha recibida, propietario notificado, check-in de 30 días programado",
        items: ["Before/after bill photos (with homeowner permission) — real numbers convert skeptics.", "Video testimonials — 30 seconds at PTO asking 'what was the experience like?' is gold.", "Neighborhood installs map — showing homeowners that their neighbors have already gone solar accelerates decisions.", "Photo of install day — a crew on a roof is powerful visual proof."]
      },
      {
        title: "La herramienta de seguimiento más simple:",
        type: "slides",
        content: "Un rep no necesita un sistema sofisticado. Una hoja de cálculo con una fila por trato activo y columnas para cada fecha de hito es suficiente. Lo que importa es que se actualice consistentemente — no que sea elaborada."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_2a_1",
        type: "open_response",
        label: "Auditoría 7-7-7",
        placeholder: "Hey [Name], your system is officially live...",
        lines: 3
      },
      {
        id: "wb_6_2a_2",
        type: "open_response",
        label: "Reescritura de Notas del CRM",
        placeholder: "1. Before/after bill photos... 2... 3...",
        lines: 3
      },
      {
        id: "wb_6_2a_es_3",
        type: "open_response",
        label: "Deficiente: \"Hablé con el propietario. Están bien.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_2a_es_4",
        type: "open_response",
        label: "Deficiente: \"Actualización del permiso dada.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_2a_es_5",
        type: "open_response",
        label: "Deficiente: \"El propietario parecía preocupado. Haré seguimiento.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_2a_es_6",
        type: "open_response",
        label: "Deficiente: \"Instalación ocurrió. Se ve bien.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_2a_es_7",
        type: "open_response",
        label: "Configuración del Rastreador de Hitos",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_2a_es_8",
        type: "open_response",
        label: "Borrador de Reactivación",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 6.2A Knowledge Check",
      questions: [
        {
          id: "kc_6_2a_1",
          question: "What is the single highest-priority review platform for a solar rep to focus on?",
          options: ["Yelp", "Facebook", "Google Business Profile", "EnergySage"],
          correctAnswerIndex: 2,
          explanation: "Google Business Profile drives local search visibility and Maps results — the highest-traffic discovery point for local solar prospects."
        },
        {
          id: "kc_6_2a_2",
          question: "What is the biggest mistake reps make when asking for reviews?",
          options: ["Asking too early", "Not sending a direct link — making the homeowner search for it themselves", "Asking too often", "Asking at PTO instead of at the close"],
          correctAnswerIndex: 1,
          explanation: "Friction kills completion. A direct link removes every barrier between intent and action."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_3a": {
    id: "mod_6_3a",
    title: "Módulo 6.3A: AUTO-ENTRENAMIENTO A TRAVÉS DE LA REVISIÓN TÉCNICA Y FINANCIERA",
    subtitle: "Convert existing solar customers abandoned by previous reps into referrals, upgrades, and loyalty.",
    sections: [
      {
        title: "Sección 1 — Por Qué el Auto-Entrenamiento Funciona Mejor que Esperar Retroalimentación",
        type: "text",
        content: "El entrenamiento formal es episódico. El auto-entrenamiento es continuo. Un rep que espera la sesión de retroalimentación semanal de su gerente antes de corregir un error en el lenguaje de incentivos ha repetido ese error en cada cita desde la última sesión."
      },
      {
        title: "Las 4 preguntas del hábito de auto-entrenamiento (10 minutos después de cada cita):",
        type: "list",
        content: "1. ¿Qué pregunta técnica surgió y cómo la respondí? 2. ¿Qué afirmación financiera hice y era precisa y conforme? 3. ¿Usé algún lenguaje del que no estoy seguro? 4. Si pudiera hacer una cosa diferente, ¿qué sería?",
        items: ["They already trust the company enough to have purchased.", "They are likely to refer neighbors if their experience has been positive.", "They are upgrade candidates (battery, EV charger, system expansion).", "They are cancellation risks if they feel ignored — especially during issues.", "Reactivating 5 orphan owners can generate 10–15 referral conversations."]
      },
      {
        title: "Sección 2 — Revisión de Errores Técnicos: Errores Comunes en el Campo",
        type: "text",
        content: "Sección 2 — Revisión de Errores Técnicos: Errores Comunes en el Campo"
      },
      {
        title: "Sección 3 — Revisión de Explicaciones Financieras: Errores Comunes en el Campo",
        type: "list",
        content: "Sección 3 — Revisión de Explicaciones Financieras: Errores Comunes en el Campo",
        items: ["Riesgoso: \"Ahorrarás $200 al mes con este sistema.\"", "Corregido: \"Basado en tu factura actual y estructura tarifaria, los ahorros mensuales estimados son alrededor de $200 — aunque los ahorros reales dependen de tu uso, cambios de tarifa y el diseño final del sistema.\"", "Riesgoso: \"Recibirás el 30% de vuelta del gobierno — eso es básicamente un tercio del sistema gratis.\"", "Corregido: \"Hay programas de incentivos que pueden aplicar a tu situación — el crédito fiscal federal es uno de los más significativos. Cuánto te beneficias depende de tu situación fiscal específica, y tu contador sería la persona correcta para confirmarlo.\"", "Riesgoso: \"Tu período de recuperación de inversión es exactamente 8.3 años.\"", "Corregido: \"Basado en los supuestos con los que estamos trabajando — tu tarifa actual, el diseño del sistema y los términos de financiamiento — el período de recuperación de inversión estimado está en el rango de 8 a 10 años. Si las tarifas del servicio eléctrico continúan la tendencia que hemos visto en esta área, podría ser más corto.\"", "Riesgoso: \"Tus paneles producen energía justo cuando el servicio eléctrico cobra tarifas pico, así que estás ahorrando a la tarifa más alta.\"", "Corregido: \"El solar produce la mayor parte de su energía alrededor del mediodía — que en realidad es antes de la ventana de tarifa pico en la mayoría de los planes TOU. Por eso una batería puede agregar valor financiero real en tu situación.\""]
      },
      {
        title: "La rúbrica de cuatro preguntas:",
        type: "slides",
        content: "Puntuación propia: 0 (sí, hice afirmaciones no verificables) / 1 (usé lenguaje calificador apropiado) / 2 (me mantuve completamente dentro de datos verificados) Puntuación propia: 0 (sí, usé lenguaje desactualizado) / 1 (no estoy seguro — necesito verificar) / 2 (usé lenguaje actual y preciso en todo momento) Puntuación propia: 0 (sí, adiviné algo de lo que no estaba seguro) / 1 (me cubrí apropiadamente pero no estaba completamente seguro) / 2 (diferí correctamente al equipo de encuesta o dije \"déjame verificar eso\") Puntuación propia: 0 (sí, prometí demasiado) / 1 (califiqué pero podría haber sido más claro) / 2 (presenté con precisión con advertencias apropiadas)"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_3a_1",
        type: "open_response",
        label: "Reconocimiento de Tipos de Error",
        placeholder: "Hi [Name], this is [Your Name] from [Company]...",
        lines: 4
      },
      {
        id: "wb_6_3a_2",
        type: "open_response",
        label: "\"Con solar y una batería, tendrás energía sin importar lo que pase con la red.\"",
        placeholder: "1. EV interest... 2... 3...",
        lines: 3
      },
      {
        id: "wb_6_3a_es_3",
        type: "open_response",
        label: "\"Tu sistema producirá 14,500 kWh por año.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_3a_es_4",
        type: "open_response",
        label: "\"Obtendrás el crédito fiscal de vuelta — es básicamente un tercio del costo del sistema.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_3a_es_5",
        type: "open_response",
        label: "\"Esa sombra del árbol en tu patio trasero no importará realmente — solo lo cubre por un par de horas.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_3a_es_6",
        type: "open_response",
        label: "\"Tu período de recuperación de inversión es exactamente 9.2 años.\"",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_3a_es_7",
        type: "open_response",
        label: "Auto-Auditoría: Revisión de una Cita Real",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_3a_es_8",
        type: "open_response",
        label: "Banco de Compromisos de Mejora",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_3a_es_9",
        type: "open_response",
        label: "Práctica de Auditoría por Pares",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 6.3A Knowledge Check",
      questions: [
        {
          id: "kc_6_3a_1",
          question: "What is the primary reason orphan owners are a high-ROI opportunity?",
          options: ["They are easy to upsell without relationship building", "They already trust the company enough to have purchased — the relationship just needs a rep", "They always want battery storage", "They are unlikely to cancel so they don't need attention"],
          correctAnswerIndex: 1,
          explanation: "The trust threshold is already crossed. You're not selling solar — you're reactivating a relationship."
        },
        {
          id: "kc_6_3a_2",
          question: "During a reactivation call, a homeowner mentions they just bought an electric vehicle. This is:",
          options: ["Irrelevant to the solar conversation", "A battery and EV charger upgrade signal — open that conversation", "A reason the homeowner may want to cancel solar", "Something to note but not pursue on this call"],
          correctAnswerIndex: 1,
          explanation: "An EV purchase means increased energy load, grid dependence, and strong battery/EV charger upgrade opportunity."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_4a": {
    id: "mod_6_4a",
    title: "Módulo 6.4A: PREPARACIÓN PARA EL EXAMEN DE AUTORIDAD TÉCNICA",
    subtitle: "Track the numbers that drive income and diagnose your own performance bottlenecks.",
    sections: [
      {
        title: "Sección 1 — Los Cinco Dominios de Conocimiento del V2",
        type: "text",
        content: "La evaluación de Autoridad Técnica se basa en cinco dominios. Los reps deben saber qué módulos corresponden a qué dominio y dónde están sus brechas de preparación."
      },
      {
        title: "Dominio 1 — Fundamento Técnico Solar",
        type: "list",
        content: "Dominio 1 — Fundamento Técnico Solar",
        items: ["Cómo la luz solar se convierte en electricidad; DC vs. AC; la cadena de producción", "Inversores de cadena vs. microinversores; qué hace cada uno y cuándo es apropiado cada uno", "Fundamentos de la batería; qué hace y no hace una batería; expectativas de respaldo", "Conciencia de ingeniería del sitio; techo, panel, eléctrico, sombra, conduit, estructuras separadas"]
      },
      {
        title: "Dominio 2 — Fluidez Financiera",
        type: "text",
        content: "Dominio 2 — Fluidez Financiera"
      },
      {
        title: "Dominio 3 — Batería y NEM",
        type: "list",
        content: "Dominio 3 — Batería y NEM",
        items: ["Evolución de la medición neta; NEM 3.0; valor de exportación vs. auto-consumo", "Posicionamiento de la batería centrado en la economía vs. basado en el miedo", "Criterios de ajuste de la batería; cuándo profundizar en el almacenamiento y cuándo ser honesto sobre el ROI limitado", "Qué no prometer sobre la capacidad de respaldo o los créditos de exportación"]
      },
      {
        title: "Dominio 4 — Descubrimiento y Conciencia del Sitio",
        type: "slides",
        content: "Dominio 4 — Descubrimiento y Conciencia del Sitio"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_4a_1",
        type: "open_response",
        label: "Autoevaluación del Dominio",
        placeholder: "Set rate: __ | Show rate: __ | Close rate: __ | Biggest gap: ...",
        lines: 3
      },
      {
        id: "wb_6_4a_2",
        type: "open_response",
        label: "Sprint de Preguntas de Práctica",
        placeholder: "This week I will specifically...",
        lines: 2
      },
      {
        id: "wb_6_4a_es_3",
        type: "open_response",
        label: "La Difícil",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      },
      {
        id: "wb_6_4a_es_4",
        type: "open_response",
        label: "Lista de Verificación de Preparación para la Evaluación",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 6.4A Knowledge Check",
      questions: [
        {
          id: "kc_6_4a_1",
          question: "A rep's close rate is 35% but their show rate is only 45%. Where should they focus first?",
          options: ["Improving their close rate — it's below 40%", "Improving their show rate — appointments not happening means closes are impossible regardless of skill", "Knocking more doors to compensate", "Increasing their average contract value"],
          correctAnswerIndex: 1,
          explanation: "Fix the biggest leak first. A 45% show rate means more than half of set appointments never happen — no close rate fixes that."
        },
        {
          id: "kc_6_4a_2",
          question: "What does a consistently low 'set rate' (appointments set per door knocked) most likely indicate?",
          options: ["The rep is closing too aggressively", "The rep's in-home presentation needs work", "The rep has a problem at the door — opener, positioning, or targeting", "The rep is working the wrong neighborhoods"],
          correctAnswerIndex: 2,
          explanation: "Set rate is the door-to-appointment conversion. Low set rate = door script, opener, or trust-building problem at first contact."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_1": {
    id: "mod_6_1",
    title: "Módulo 6.1: FORMATO ESTÁNDAR",
    subtitle: "Turn every closed deal into three more through a disciplined referral system.",
    sections: [
      {
        title: "Por Qué los Referidos Valen Más",
        type: "text",
        content: "Los referidos cierran al cuarenta a sesenta por ciento — comparado con veinte a treinta por ciento para los leads fríos. La confianza ya está establecida antes de que digas una palabra. Y el costo de adquisición del cliente es cero. Un solo pipeline de referidos puede eventualmente reemplazar la prospección fría por completo. Los consultores que construyen ingresos de seis cifras tratan la generación de referidos como un sistema — no como una idea de último momento. Hoy saldrás con un proceso de referidos repetible de tres pasos que funciona cada vez que cierras un trato."
      },
      {
        title: "El Sistema de Referidos de 3 Pasos",
        type: "list",
        content: "El Sistema de Referidos de 3 Pasos",
        items: ["Paso uno: planta la semilla en el cierre. Antes de salir: el mayor agradecimiento es un referido. Si alguien que conoces ha estado quejándose de su factura eléctrica, me encantaría una introducción.", "Paso dos: activa post-instalación. Cuando su sistema entre en funcionamiento, envía un mensaje emocionado y pregunta: ¿a quién es la primera persona a la que le querrías contar esto?", "Paso tres: seguimiento personalizado. Contacta a cada referido por nombre, mencionando la conexión mutua. Un alcance de referido que dice \"tu vecino mencionó que has estado pensando en solar\" abre a un nivel completamente diferente que una llamada fría."]
      },
      {
        title: "The Referral Ask Script",
        type: "quote",
        content: "\"Most of my business comes from people just like you — homeowners who are glad they made the switch. Who's one person in your neighborhood or family who'd benefit from a conversation like we just had? I'm not asking you to sell them — just an introduction.\""
      },
      {
        title: "Building a Referral Tracking System",
        type: "list",
        content: "A referral not tracked is a referral lost. Your system must be simple enough to use in the field.",
        items: ["Log every referral name and contact in CRM within 24 hours", "Tag the source customer so you can report back ('Your neighbor John said yes!')", "Set a 3-day follow-up task for every referral received", "Send a handwritten thank-you to any customer whose referral closes"]
      },
      {
        title: "Simulation: Referral Ask at Trigger 1",
        type: "simulation",
        content: "Practice the post-signature referral conversation with post_install_patricia.",
        scenarioId: "post_install_patricia"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_1_1",
        type: "open_response",
        label: "Reflexiona sobre el Sistema de Referidos: ¿Cómo lo aplicarás?",
        placeholder: "Start with: 'Most of my business...'",
        lines: 4
      },
      {
        id: "wb_6_1_2",
        type: "checklist",
        label: "Referral system setup checklist",
        items: ["CRM referral field created", "3 trigger reminders set in calendar", "Thank-you card supply ready", "Referral script practiced 5× out loud"]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_2": {
    id: "mod_6_2",
    title: "Módulo 6.2: FORMATO ESTÁNDAR",
    subtitle: "Systematically generate 5-star reviews that become your 24/7 sales force.",
    sections: [
      {
        title: "Reseñas de Google y Autoridad en el Vecindario",
        type: "text",
        content: "Pide a cada cliente cerrado una reseña de Google y envía el enlace directo — hazlo lo más sin fricción posible. Las reseñas se acumulan con el tiempo. Cuando un propietario en tu territorio busca empresas de solar y ve cuarenta y siete reseñas de cinco estrellas incluyendo nombres que reconoce del vecindario, la confianza ya está establecida antes de que toques la puerta. Combina eso con letreros de jardín en instalaciones completas y habrás creado prueba social pasiva a escala. La autoridad del vecindario se construye rep por rep e instalación por instalación — es uno de los activos a largo plazo más poderosos que puedes construir en esta carrera."
      },
      {
        title: "The Review Request Timing",
        type: "list",
        content: "Timing determines whether a customer leaves a review. Ask at the wrong moment and you get nothing.",
        items: ["Best time: Within 48 hours of system installation — enthusiasm is highest", "Second best: Day of first low utility bill — proof triggers gratitude", "Method: Text with a direct link — never just verbal. Remove friction.", "Follow-up once if no review after 5 days — 'Just making sure the link worked'"]
      },
      {
        title: "The Review Request Message",
        type: "quote",
        content: "\"Hey [Name], it was a pleasure working with you. If you have 2 minutes, your review would mean the world to me — it helps families in [City] find a trustworthy rep. Here's the direct link: [Google Review Link]. Thanks for trusting me with your home.\""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_2_1",
        type: "open_response",
        label: "Reflexiona sobre Construcción de Reputación y Presencia en Línea: ¿Cómo lo aplicarás?",
        placeholder: "Hey [Name]...",
        lines: 3
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_3": {
    id: "mod_6_3",
    title: "Módulo 6.3: FORMATO ESTÁNDAR",
    subtitle: "Reactivate past customers whose reps left — a goldmine hiding in your company's CRM.",
    sections: [
      {
        title: "El Embudo de Rendimiento",
        type: "text",
        content: "Los resultados de cada rep comienzan con una métrica en la cima: puertas tocadas. Desde ahí el embudo fluye hacia abajo — conversaciones, citas agendadas, citas realizadas, propuestas presentadas, tratos cerrados. Tu trabajo es conocer tu tasa de conversión en cada paso. Si estás tocando cien puertas y solo teniendo cinco conversaciones, tu apertura necesita trabajo. Si las conversaciones convierten a citas a una tasa baja, tu transición necesita trabajo. Si las citas se muestran a tasas bajas, tu comunicación pre-cita necesita trabajo. Si tu tasa de cierre es baja, el manejo de objeciones necesita trabajo. Conoce tus números y siempre sabrás exactamente qué practicar."
      },
      {
        title: "The Orphan Owner Outreach Script",
        type: "quote",
        content: "\"Hi, is this [Name]? My name is [Your Name] — I'm with [Company] and I've been assigned as your new account manager. I wanted to introduce myself, confirm everything is running smoothly with your system, and let you know I'm your point of contact going forward. Do you have 2 minutes?\""
      },
      {
        title: "Converting Orphan Owners to Referral Sources",
        type: "list",
        content: "Once you've re-established trust, an orphan owner becomes one of your best referral assets.",
        items: ["Schedule a free system performance review — build face time", "Identify any service needs and resolve them — prove your value", "Ask for referrals after resolving any issue — gratitude converts", "Add them to your review request sequence if they haven't left one"]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_3_1",
        type: "open_response",
        label: "Reflexiona sobre el Seguimiento de KPI y Auto-Entrenamiento: ¿Cómo lo aplicarás?",
        placeholder: "1. [Name] — Note: ...",
        lines: 6
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_4": {
    id: "mod_6_4",
    title: "Módulo 6.4: FORMATO ESTÁNDAR",
    subtitle: "Track what matters, diagnose bottlenecks, and self-coach like a top performer.",
    sections: [
      {
        title: "El Efecto Compuesto de la Reputación",
        type: "list",
        content: "Cada interacción que tienes construye o erosiona tu reputación. Cada conversación honesta es un depósito. Cada exageración es un retiro. Los reps que piensan a corto plazo persiguen cualquier trato, sobre-prometen y queman puentes. Los reps que piensan a largo plazo califican agresivamente, construyen relaciones y generan referidos durante años. Veinticinco tratos cerrados significa veinticinco fuentes potenciales de referidos. Cien tratos cerrados significa suficiente negocio entrante para raramente tocar puertas frías. Trata a cada cliente como una relación de cinco años — porque los mejores se convierten exactamente en eso.",
        items: ["Doors Knocked — your raw activity input", "Set Rate (Appointments Set / Doors Knocked) — door effectiveness", "Show Rate (Appointments Shown / Set) — follow-up and commitment quality", "Close Rate (Deals Closed / Appointments Shown) — presentation effectiveness", "Average Contract Value — deal quality and upsell skill"]
      },
      {
        title: "Diagnosing Your Bottleneck",
        type: "comparison",
        content: "Find the ratio that breaks first — that's where you focus 80% of your coaching energy."
      },
      {
        title: "Your Daily KPI Review Ritual",
        type: "text",
        content: "Every morning before you leave for the field, spend 5 minutes with your numbers. Ask: 'What was my set rate yesterday? Is it trending up or down? What's one thing I'll do differently at the door today?' This 5-minute habit compounds over a 90-day career into elite performance."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_4_1",
        type: "checklist",
        label: "Reflexiona sobre la Mentalidad a Largo Plazo: Carrera vs. Trabajo: ¿Cómo lo aplicarás?",
        items: ["Doors knocked column", "Set rate column", "Show rate column", "Close rate column", "ACV column", "Weekly trend row"]
      },
      {
        id: "wb_6_4_2",
        type: "open_response",
        label: "Based on your last week of activity, which KPI is your biggest bottleneck? What's one specific change you'll make this week?",
        placeholder: "My bottleneck is... I'll fix it by...",
        lines: 4
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_5": {
    id: "mod_6_5",
    title: "Módulo 6.5: PRÁCTICA DE ESCENARIOS AVANZADOS",
    subtitle: "Manage the post-sale process so customers trust you through every phase.",
    sections: [
      {
        title: "Escenario A — El Investigador",
        type: "list",
        content: "Este propietario ha investigado NEM 3.0, cargos del distribuidor y curvas de degradación antes de que llegaras. Están probando tu experiencia. No repitas lo básico — pregunta qué ya han aprendido y dónde están sus brechas. Usa lenguaje técnico. Admite cuando necesitas confirmar cifras exactas en lugar de simular. Luego pregunta: basado en todo lo que has investigado, ¿cuál es la única cosa que todavía te está deteniendo? Esa pregunta casi siempre saca el obstáculo real — que usualmente no es técnico en absoluto.",
        items: ["Phase 1 — Contract & Welcome: 24-hour confirmation call. Confirm documents, set expectations.", "Phase 2 — Site Survey: Notify 48 hours before. 'An engineer will visit to measure your roof.'", "Phase 3 — Permitting: 'This takes 3–8 weeks depending on your city. Normal and expected.'", "Phase 4 — Install Scheduled: Excitement call. 'Your install date is confirmed!'", "Phase 5 — Installation Day: Check-in morning of. Be reachable.", "Phase 6 — Inspection & Interconnection: 'Almost there — utility company approves the connection.'", "Phase 7 — PTO & Go-Live: Celebration call. 'Your system is live. Check your monitoring app!'"]
      },
      {
        title: "Escenario B — El Enfrentamiento de la Pareja Casada",
        type: "simulation",
        content: "El esposo quiere solar. La esposa es escéptica por una experiencia previa con un contratista. Y hay un problema oculto — están planeando vender en cuatro años. Tu trabajo es equilibrar el entusiasmo por el esposo con la construcción de confianza para la esposa, abordar el plazo de cuatro años honestamente — lo que puede significar una descalificación parcial o una conversación honesta sobre estructuras de recuperación de inversión más cortas — y nunca tomar partido. Valida ambas perspectivas. Haz que la esposa se sienta escuchada antes de sentirse vendida. Su confianza es la clave del trato.",
        scenarioId: "rodriguez_family"
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_5_1",
        type: "open_response",
        label: "Reflexiona sobre la Práctica de Escenarios Avanzados: ¿Cómo lo aplicarás?",
        placeholder: "Hey [Name], quick update on your project...",
        lines: 3
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_6": {
    id: "mod_6_6",
    title: "Módulo 6.6: EXAMEN DE CERTIFICACIÓN",
    subtitle: "Build a career that lasts by treating every customer as a long-term relationship.",
    sections: [
      {
        title: "Visión General del Examen",
        type: "text",
        content: "El examen de certificación tiene cincuenta preguntas que cubren cinco áreas. Tecnología solar y componentes del sistema — veinte por ciento. Análisis de la factura de servicios públicos y financiamiento — veinte por ciento. Psicología del propietario y el marco BOLT — veinte por ciento. Manejo de objeciones y cierre — veinticinco por ciento. Cumplimiento y ética — quince por ciento. Necesitas un ochenta por ciento o más para pasar. Esta no es una prueba que pases estudiando mucho la noche anterior — es una prueba que pasas estando completamente presente durante los Días Uno al Seis. Si has hecho el trabajo, estás listo."
      },
      {
        title: "The Integrity Standards of a Certified SeptiVolt Rep",
        type: "list",
        content: "These aren't guidelines — they're the non-negotiables of the profession.",
        items: ["Never misrepresent savings projections — use conservative, honest estimates", "Disclose all contract terms clearly — cancellation windows, escalators, and conditions", "Never pressure a decision — if they need 48 hours, respect it", "If a deal isn't right for the homeowner, walk away — referrals follow integrity", "Report any ethical concerns about team members to your manager immediately"]
      },
      {
        title: "The Long-Term Perspective",
        type: "quote",
        content: "\"The rep who manipulates a customer into a bad deal closes one sale and loses a territory. The rep who earns trust closes one sale and gains twenty referrals. Your long-term income is built on reputation, not tricks.\""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_6_1",
        type: "open_response",
        label: "Reflexiona sobre el Examen de Certificación: ¿Cómo lo aplicarás?",
        placeholder: "I would walk away if...",
        lines: 4
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_7": {
    id: "mod_6_7",
    title: "Módulo 6.7: CIERRE DEL DÍA 6 Y VISTA PREVIA DEL DÍA 7",
    subtitle: "Map your trajectory from rep to team leader and beyond.",
    sections: [
      {
        title: "Estás Listo para el Día 7",
        type: "list",
        content: "Has aprendido más en seis días de lo que la mayoría de los reps de solar aprenden en tres meses. Mañana es diferente — no es un día de aula. Pasarás la mañana acompañando a tu gerente en tres citas en vivo, observando cómo cada habilidad de este programa se desarrolla en un hogar real con propietarios reales. Después del almuerzo, realizas una cita completa tú mismo, con tu gerente observando en silencio. Luego debrief, recibes tu evaluación de campo y te autorizas para vender de forma independiente. Duerme bien. Estás listo.",
        items: ["Level 1 — Certified Rep (Month 1–3): Building fundamentals, $3K–$8K/mo", "Level 2 — Senior Rep (Month 4–12): Consistent 4+ deals/mo, $10K–$18K/mo", "Level 3 — Lead Rep / Trainer (Month 12–18): Mentoring new reps, override income", "Level 4 — Team Lead / Manager (Year 2+): Team of 5–15, override + personal production", "Level 5 — Regional Director: Multi-team leadership, equity and equity-style comp"]
      },
      {
        title: "Writing Your Income Goals",
        type: "text",
        content: "Goal-setting without specifics is just wishful thinking. Your 1-year, 3-year, and 5-year income goals must be connected to specific activity levels — otherwise they're not goals, they're fantasies."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_6_7_1",
        type: "open_response",
        label: "Reflexiona sobre el Cierre del Día 6 y la Vista Previa del Día 7: ¿Cómo lo aplicarás?",
        placeholder: "Year 1: $... | Role: ... | Skill: ...",
        lines: 6
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_6_8": {
    id: "mod_6_8",
    title: "Module 6.8: Day 6 Final Certification Exam",
    subtitle: "Demonstrate mastery across all six days of the accelerator.",
    sections: [
      {
        title: "Certification Exam — Written Component",
        type: "text",
        content: "This exam covers all material from Days 1 through 6. You must score 80% or higher to receive the SeptiVolt Sales Rep Certification. You have one retake opportunity if you score below 80% on your first attempt."
      }
    ],
    quiz: {
      title: "Day 6 Certification Exam",
      questions: [
        {
          id: "cert_6_1",
          question: "What are the three referral trigger moments?",
          options: ["Door knock, appointment set, contract signed", "Post-signature, install complete, first low bill", "Day 1, Day 3, Day 7", "CRM entry, survey, installation"],
          correctAnswerIndex: 1,
          explanation: "The three trigger moments are post-signature euphoria, system install complete, and first low utility bill."
        },
        {
          id: "cert_6_2",
          question: "Which KPI diagnoses a problem specifically at the door?",
          options: ["Close Rate", "Average Contract Value", "Set Rate", "Show Rate"],
          correctAnswerIndex: 2,
          explanation: "Set rate (appointments set per door knocked) measures door effectiveness directly."
        },
        {
          id: "cert_6_3",
          question: "What is an 'orphan owner'?",
          options: ["A prospect who has never heard of solar", "A customer who cancelled their contract", "A customer whose original rep left the company", "A homeowner with no utility bill history"],
          correctAnswerIndex: 2,
          explanation: "Orphan owners are existing customers with no active rep — they're warm and reachable."
        },
        {
          id: "cert_6_4",
          question: "When should you first ask for a review?",
          options: ["During the sales presentation", "Within 48 hours of system installation", "After the first utility bill arrives", "At the 6-month check-in"],
          correctAnswerIndex: 1,
          explanation: "Within 48 hours of install — enthusiasm is at peak and the experience is fresh."
        },
        {
          id: "cert_6_5",
          question: "Which of these is an integrity violation?",
          options: ["Disclosing all contract terms clearly", "Using conservative savings estimates", "Pressuring a customer to sign before 48 hours they requested", "Walking away from a bad-fit deal"],
          correctAnswerIndex: 2,
          explanation: "Pressuring a customer who requested time to decide violates professional ethics standards."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["title","subtitle","sections"],
    }
  },

  "mod_7_1": {
    id: "mod_7_1",
    title: "Módulo 7.1: SESIÓN INFORMATIVA PRE-CAMPO",
    subtitle: "Mental and tactical preparation for your field certification day.",
    sections: [
      {
        title: "Modo Sombra — Qué Observar",
        type: "text",
        content: "Esta mañana estás en modo sombra. Tu trabajo es observar y tomar notas — no participar a menos que tu gerente te invite. Mientras observas cada cita, enfócate en cinco cosas: cómo se posiciona físicamente tu gerente en el hogar, cómo maneja las interrupciones inesperadas, cómo identifica y se adapta a los tipos de personalidad en tiempo real, cómo frasea las respuestas a las objeciones de manera diferente a cómo estaban escritas en el guión, y cuándo y cómo hace el cierre. Después de cada cita, harás un debrief en el auto. Haz cada pregunta que surgió."
      },
      {
        title: "Your Pre-Field Checklist",
        type: "list",
        content: "Before you leave for the field, confirm every item on this list.",
        items: ["Discovery script reviewed and internalized — no cue cards", "Top 10 objections practiced verbally this morning", "Presentation flow memorized — all 6 phases", "Referral ask scripted and ready", "Professional appearance — business casual, clean, prepared", "Phone charged, CRM access confirmed, manager contact saved"]
      },
      {
        title: "The Mindset for Field Day",
        type: "quote",
        content: "\"You are not going to observe today — you are going to study. Watch every move your manager makes and ask yourself: why did they do that? What was the customer's reaction? What would I have done differently? Learning never stops, even after you're certified.\""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_1_1",
        type: "checklist",
        label: "Reflexiona sobre la Sesión Informativa Pre-Campo: ¿Cómo lo aplicarás?",
        items: ["Scripts reviewed", "Objections drilled", "Appearance ready", "Phone charged", "CRM confirmed", "Mindset locked in"]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_7_2": {
    id: "mod_7_2",
    title: "Módulo 7.2: CITA #1 — SOMBRA Y OBSERVACIÓN",
    subtitle: "Observe a live appointment and extract specific, actionable lessons.",
    sections: [
      {
        title: "Debrief Después de la Cita 1",
        type: "text",
        content: "Después de cada cita sombra, el debrief en el auto es tan importante como la cita misma. Tu gerente preguntará qué notaste. Trae observaciones específicas — no pensamientos generales. Luego tu gerente te explicará qué estaban pensando en momentos clave. Por qué desaceleraron cuando la esposa se quedó callada. Por qué eligieron el cierre del resumen en lugar del cierre asuntivo. Por qué preguntaron sobre el vehículo eléctrico en ese punto específico del descubrimiento. Estos momentos de contexto convierten la observación en perspectiva."
      },
      {
        title: "Shadow Observation Framework",
        type: "list",
        content: "Use this framework for every appointment you shadow today.",
        items: ["Opening: How did they establish authority and likability in the first 2 minutes?", "Discovery: Which questions created the biggest emotional response?", "Presentation: Where did the customer lean in vs. check out?", "Objections: Which technique did they use and did it land?", "Close: What specifically triggered the decision?"]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_2_1",
        type: "open_response",
        label: "Reflexiona sobre la Cita #1 — Sombra y Observación: ¿Cómo lo aplicarás?",
        placeholder: "1. They did __ when __ and the customer responded by __...",
        lines: 5
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_7_3": {
    id: "mod_7_3",
    title: "Módulo 7.3: CITA #2 — SOMBRA Y OBSERVACIÓN",
    subtitle: "Deepen your observation skills and identify repeatable patterns.",
    sections: [
      {
        title: "Crítica Constructiva",
        type: "text",
        content: "Después de la segunda cita, tu gerente preguntará: ¿qué habrías hecho diferente? Esto no es una prueba — es un ejercicio de reflexión. Piensa en momentos donde la conversación podría haber tomado otra dirección. ¿Cuándo dio el propietario una señal de compra que no fue reconocida inmediatamente? ¿Qué objeción podría haberse manejado con una técnica diferente? Este tipo de crítica constructiva — ya sea en la cita de tu gerente o en la tuya — es cómo los reps de élite se desarrollan más rápido que los promedio."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_3_1",
        type: "open_response",
        label: "Reflexiona sobre la Cita #2 — Sombra y Observación: ¿Cómo lo aplicarás?",
        placeholder: "Both times, the customer responded to...",
        lines: 4
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_7_4": {
    id: "mod_7_4",
    title: "Módulo 7.4: CITA #3 — SOMBRA Y OBSERVACIÓN",
    subtitle: "Final observation before you run your own appointment.",
    sections: [
      {
        title: "Preparando Tu Plan de Juego",
        type: "text",
        content: "Después de la tercera cita sombra, antes del almuerzo, tu gerente preguntará: vas a continuación después del almuerzo — ¿cuál es tu plan de juego? Explica tu enfoque en voz alta. ¿Cómo abrirás? ¿Con qué preguntas de descubrimiento liderarás? ¿Qué tipo de personalidad esperas basado en la información del lead? ¿Qué objeciones podrían surgir? ¿Cómo planeas cerrar? Articular esto en voz alta es una forma de ensayo mental que mejora significativamente la ejecución. Tu gerente dará ajustes de entrenamiento antes de que entres."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_4_1",
        type: "open_response",
        label: "Reflexiona sobre la Cita #3 — Sombra y Observación: ¿Cómo lo aplicarás?",
        placeholder: "In my appointment, I will...",
        lines: 3
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_7_5": {
    id: "mod_7_5",
    title: "Módulo 7.5: MÓDULO 7.5 — PREPARACIÓN PRE-CITA",
    subtitle: "The 10-minute ritual that separates prepared reps from reactive ones.",
    sections: [
      {
        title: "Entrenamiento de Último Minuto",
        type: "list",
        content: "En los quince minutos antes de tu cita, tu gerente te hará cinco preguntas. ¿Qué sabes sobre este propietario? ¿Cuál es tu apertura? ¿Qué objeciones esperas? ¿A qué tipo de propietario se parece esto? ¿Y cómo cerrarás? Responde las cinco en voz alta. No adivines — apóyate en tu formación. Luego respira. Has practicado esto durante seis días. Conoces el marco. Conoces las objeciones. Sabes cómo leer el ambiente. Confía en tu preparación y ve a ejecutar.",
        items: ["Review the customer's utility bill data and usage history", "Identify 2 likely objections based on what you know about them", "Rehearse your opening 60 seconds out loud — in the car, alone", "Set your intention: 'I am here to help this family make a great decision'", "Deep breath — walk in calm, confident, and present"]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_5_1",
        type: "open_response",
        label: "Reflexiona sobre la Preparación Pre-Cita: ¿Cómo lo aplicarás?",
        placeholder: "Today I will...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_7_6": {
    id: "mod_7_6",
    title: "Módulo 7.6: MÓDULO 7.6 — EL REP REALIZA UNA CITA COMPLETA",
    subtitle: "Your live certification appointment — run the full process from discovery to close.",
    sections: [
      {
        title: "Realizando la Cita",
        type: "text",
        content: "Este es tu momento. Tu gerente se sentará silenciosamente y observará — no intervendrá a menos que te quedes paralizado o el propietario les haga una pregunta directa. Tu trabajo es realizar la cita completa desde el descubrimiento hasta el cierre como si nadie más estuviera en la habitación. Usa todo del Día Uno al Seis. Controla el entorno. Lee la personalidad. Haz las doce preguntas de descubrimiento. Entrega la pila de valor. Maneja cada objeción con A.C.A. Pide la venta. Y si cierran — pide un referido antes de salir. Esto es real. Haz tu trabajo."
      },
      {
        title: "Post-Appointment Self-Assessment",
        type: "text",
        content: "Immediately after the appointment, before your manager gives feedback, do your own honest assessment. What went well? Where did you hesitate? What would you change? Self-awareness is the foundation of improvement."
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_6_1",
        type: "open_response",
        label: "Reflexiona sobre el Rep Realizando una Cita Completa: ¿Cómo lo aplicarás?",
        placeholder: "I executed well on...",
        lines: 3
      },
      {
        id: "wb_7_6_2",
        type: "open_response",
        label: "Post-appointment self-assessment: What would you change?",
        placeholder: "Next time I'll...",
        lines: 3
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_7_7": {
    id: "mod_7_7",
    title: "Módulo 7.7: MÓDULO 7.7 — DEBRIEF POST-CITA",
    subtitle: "Receive your manager's feedback and certification outcome.",
    sections: [
      {
        title: "Marco de Retroalimentación del Gerente",
        type: "text",
        content: "Tu gerente hará el debrief usando una estructura de tres partes. Primero, qué salió bien — cosas específicas que hiciste bien, con ejemplos de la cita. Segundo, qué mejorar — uno o dos ajustes específicos y accionables para tu próxima cita. Tercero, tu evaluación general: listo para el campo significa que comienzas a programar citas inmediatamente. Casi listo significa un día más de sombra. Necesita más formación significa juego de roles continuo antes de vender de manera independiente. Independientemente del resultado — realizaste una cita real hoy. Eso te pone por delante de donde empezaste hace siete días."
      },
      {
        title: "Certification Outcomes",
        type: "list",
        content: "There are three possible outcomes from today's field certification.",
        items: ["Certified — You demonstrated readiness across all five assessment criteria. You are cleared for independent field work.", "Provisional Certification — Strong in most areas, one gap identified. Cleared for field with manager check-ins for 2 weeks.", "Extension Recommended — Specific gap requires additional training. A focused 2-day extension plan will be provided."]
      },
      {
        title: "Regardless of Outcome",
        type: "quote",
        content: "\"Every rep who goes through this program — regardless of certification outcome on Day 7 — is more prepared than 90% of the reps currently working in the field. Your training doesn't end today. It begins.\""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_7_1",
        type: "open_response",
        label: "Reflexiona sobre el Debrief Post-Cita: ¿Cómo lo aplicarás?",
        placeholder: "1. ...",
        lines: 5
      },
      {
        id: "wb_7_7_2",
        type: "rating",
        label: "How prepared do you feel to run independent appointments?"
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_7_8": {
    id: "mod_7_8",
    title: "Módulo 7.8: MÓDULO 7.8 — FIRMA DE CERTIFICACIÓN",
    subtitle: "You are now a certified solar sales professional. Here is your launch plan.",
    sections: [
      {
        title: "Estás Certificado",
        type: "list",
        content: "Si has aprobado, tu gerente firmará tu formulario de certificación de campo y lo enviará a operaciones. Lo que sucede a continuación: tu CRM se activa con tus asignaciones de territorio, los leads entrantes comienzan a enrutarse a ti, y recibes tus tarjetas de presentación, letreros de jardín y materiales de marketing. Ahora eres un consultor de solar activo. El certificado no es el final — es el comienzo. Cada cita a partir de aquí construye tu habilidad, tu pipeline y tu reputación. Ve a ganártelo.",
        items: ["Week 1: 40 doors/day minimum — activity volume builds confidence", "Week 2: 3 appointments set and run — measure all 5 KPIs daily", "Week 3: 1 deal closed — first commission hits differently", "Week 4: Referral system activated — ask at every close", "30-day review with manager: KPI analysis and coaching plan for Month 2"]
      },
      {
        title: "You Are Ready",
        type: "quote",
        content: "\"Seven days ago, you didn't know how to read a utility bill. Today, you can run a full appointment, handle any objection, close ethically, and build a referral pipeline. That is not a small thing. Go build your career.\""
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_8_1",
        type: "open_response",
        label: "Reflexiona sobre la Firma de Certificación: ¿Cómo lo aplicarás?",
        placeholder: "In my first 30 days I will...",
        lines: 4
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  },

  "mod_7_9": {
    id: "mod_7_9",
    title: "Módulo 7.9: MÓDULO 7.9 — PROSPECCIÓN EN SOLITARIO",
    subtitle: "Your first independent prospecting session as a certified SeptiVolt rep.",
    sections: [
      {
        title: "Tus Primeras Puertas en Solitario",
        type: "text",
        content: "Esta noche tocarás veinte puertas por tu cuenta. Usa tu apertura de treinta segundos, maneja cada rechazo con las técnicas de micro-objeción del Día Dos, e intenta programar al menos una cita para la próxima semana. Envía un mensaje de texto a tu gerente con tus resultados cuando termines — cuántas puertas, cuántas conversaciones, y cuántas citas programadas. Luego descansa. Mañana lo haces de nuevo. Y el día siguiente. Este es el trabajo que construye ingresos. Bienvenido a tu carrera en solar."
      },
      {
        title: "20-Door Tracker",
        type: "list",
        content: "Track each interaction. Data from your first solo session becomes your baseline for measuring improvement.",
        items: ["Doors knocked: __/20", "Contacts made (someone answered): __", "Appointments set: __", "Objections handled: __", "One thing that surprised you: __"]
      }
    ],
    workbookPrompts: [
      {
        id: "wb_7_9_1",
        type: "open_response",
        label: "Reflexiona sobre la Prospección en Solitario: ¿Cómo lo aplicarás?",
        placeholder: "I learned that...",
        lines: 3
      },
      {
        id: "wb_7_9_2",
        type: "open_response",
        label: "What will you do differently on door 21?",
        placeholder: "Starting with door 21...",
        lines: 2
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: ["subtitle"],
    }
  }
}
