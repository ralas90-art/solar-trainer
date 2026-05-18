export interface LocalizedString {
  en: string;
  es: string;
}

export interface ScenarioLockRule {
  scenarioId: string;
  requiredModuleId: string;
  requiredQuizThreshold: number; // default 80%, 100% for certification modules
  unlockLabel: LocalizedString;
  relatedSkill: LocalizedString;
  proTips: LocalizedString[];
}

export const SIMULATOR_UNLOCK_THRESHOLD_DEFAULT = 80;

export const SCENARIO_LOCK_RULES: Record<string, ScenarioLockRule> = {
  // Day 2
  "guarded_gloria": {
    scenarioId: "guarded_gloria",
    requiredModuleId: "mod_2_5",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 2 - Consultative Prospecting",
      es: "Día 2 - Prospección Consultiva"
    },
    relatedSkill: {
      en: "Gatekeeper Bypass & Intent Gaining",
      es: "Evadir el Guardián y Lograr Intención"
    },
    proTips: [
      {
        en: "💡 Use a neutral, authoritative tone. Do not sound like a standard salesperson trying to sell something.",
        es: "💡 Use un tono neutral y autoritario. No suene como el típico vendedor que intenta vender algo a la fuerza."
      },
      {
        en: "🎯 Cognitive Reframing: See the gatekeeper not as an obstacle, but as a collaborator protecting their time. Validate their concern before redirecting.",
        es: "🎯 Reencuadre Cognitivo: Vea al guardián no como un obstáculo, sino como un colaborador que protege el tiempo. Valide su preocupación antes de redireccionar."
      }
    ]
  },
  "busy_brian": {
    scenarioId: "busy_brian",
    requiredModuleId: "mod_2_3",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 2 - The Art of the Opener",
      es: "Día 2 - El Arte de la Apertura"
    },
    relatedSkill: {
      en: "Micro-Agreements & Setting Expectations",
      es: "Microacuerdos y Establecimiento de Expectativas"
    },
    proTips: [
      {
        en: "💡 Use downward inflection at the end of your opening questions to signal confidence and lower defenses.",
        es: "💡 Use una inflexión hacia abajo al final de sus preguntas de apertura para proyectar confianza y bajar las defensas."
      },
      {
        en: "⚡ Micro-Objection: 'I don't have time.' Response: 'I completely respect that. That is exactly why I will be brief—less than 2 minutes to show you the net difference, and we'll decide if a follow-up makes sense.'",
        es: "⚡ Microobjeción: 'No tengo tiempo.' Respuesta: 'Entiendo perfectamente. Por eso mismo seré breve; menos de 2 minutos para mostrarle la diferencia neta y decidimos si vale la pena hablar más.'"
      }
    ]
  },

  // Day 3
  "analytical_alan": {
    scenarioId: "analytical_alan",
    requiredModuleId: "mod_3_2",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 3 - BOLT Personality Profiles",
      es: "Día 3 - Perfiles de Personalidad BOLT"
    },
    relatedSkill: {
      en: "Technical Data Presentation & Detail Matching",
      es: "Presentación de Datos Técnicos y Ajuste de Detalles"
    },
    proTips: [
      {
        en: "📊 Analytical buyers value precision. Avoid vague claims like 'saves a lot of money.' Use exact numbers and structured visual data instead.",
        es: "📊 Los compradores analíticos valoran la precisión. Evite promesas vagas como 'ahorrará mucho dinero'. Use números exactos y datos visuales estructurados."
      },
      {
        en: "💡 Keep your vocal pacing measured, deliberate, and calm. Allow silences for them to process mathematical models.",
        es: "💡 Mantenga un ritmo de voz medido, deliberado y tranquilo. Permita silencios para que procesen los modelos matemáticos."
      }
    ]
  },
  "burned_beth": {
    scenarioId: "burned_beth",
    requiredModuleId: "mod_3_3",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 3 - Mirroring & Labeling",
      es: "Día 3 - Espejo y Etiquetado"
    },
    relatedSkill: {
      en: "Active Listening & Empathy Building",
      es: "Escucha Activa y Creación de Empatía"
    },
    proTips: [
      {
        en: "💡 Mirroring technique: Repeat the last 2-3 critical words they said with a curious, calm tone.",
        es: "💡 Técnica del Espejo: Repita las últimas 2 o 3 palabras clave que dijeron con un tono curioso y calmado."
      },
      {
        en: "🎯 Labeling objection: 'It sounds like you've had a really frustrating experience with solar companies in the past and want to make sure you aren't taken advantage of again.'",
        es: "🎯 Etiquetar objeción: 'Parece que ha tenido una experiencia muy frustrante con empresas solares en el pasado y quiere asegurarse de que no se aprovechen de usted otra vez.'"
      }
    ]
  },
  "busy_bob": {
    scenarioId: "busy_bob",
    requiredModuleId: "mod_3_4",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 3 - Discovery Framework",
      es: "Día 3 - Marco de Descubrimiento"
    },
    relatedSkill: {
      en: "Pain Point Extraction & Urgency Creation",
      es: "Extracción de Puntos de Dolor y Creación de Urgencia"
    },
    proTips: [
      {
        en: "💡 Always anchor the discovery to their utility bill frustration. Find out exactly what they would do if their bill doubled in the next 5 years.",
        es: "💡 Siempre ancle el descubrimiento a la frustración con su factura de luz. Averigüe qué harían exactamente si su recibo se duplicara en los próximos 5 años."
      },
      {
        en: "🎯 High Impact Line: 'If you keep doing what you are doing, what does your utility expenses look like over the next ten years?'",
        es: "🎯 Línea de Alto Impacto: 'Si sigue haciendo lo mismo que ahora, ¿cómo se verán sus gastos de electricidad en los próximos diez años?'"
      }
    ]
  },
  "friendly_frank": {
    scenarioId: "friendly_frank",
    requiredModuleId: "mod_3_2",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 3 - BOLT Personality Profiles",
      es: "Día 3 - Perfiles de Personalidad BOLT"
    },
    relatedSkill: {
      en: "Rapport Maintenance & Soft Redirecting",
      es: "Mantenimiento de Relación y Redirección Suave"
    },
    proTips: [
      {
        en: "💡 Friendly buyers love connection, but can easily derail the consultation. Validate their stories, then smoothly loop back to the numbers.",
        es: "💡 A los compradores amigables les encanta conectar, pero pueden descarrilar la consulta. Valide sus historias y luego vuelva suavemente a los números."
      },
      {
        en: "🎯 Soft Redirect: 'That sounds amazing! Speaking of family safety, one major reason homeowners switch is to lock in a predictable cost, keeping their families secure from utility spikes. Let me show you how...'",
        es: "🎯 Redirección Suave: '¡Eso suena increíble! Hablando de proteger a la familia, una de las razones principales para cambiar a solar es congelar una tarifa predecible, protegiéndolos de las alzas. Déjeme mostrarle cómo...'"
      }
    ]
  },
  "solar_sam": {
    scenarioId: "solar_sam",
    requiredModuleId: "mod_3_1",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 3 - Rapport Building",
      es: "Día 3 - Creación de Relación"
    },
    relatedSkill: {
      en: "Trust Engineering & Intent Alignment",
      es: "Ingeniería de Confianza y Alineación de Intención"
    },
    proTips: [
      {
        en: "💡 Focus on organic commonalities. Never fake interest; find genuine areas of mutual experience or appreciation.",
        es: "💡 Enfóquese en puntos en común orgánicos. Nunca finja interés; busque áreas genuinas de experiencia o aprecio mutuo."
      },
      {
        en: "🎯 Cognitive Reframing: Do not pitch solar in the first 10 minutes. Pitch YOURSELF as a trusted advisor researching a solution.",
        es: "🎯 Reencuadre Cognitivo: No venda energía solar en los primeros 10 minutos. Véndase USTED como un asesor de confianza que investiga una solución."
      }
    ]
  },
  "loyal_linda": {
    scenarioId: "loyal_linda",
    requiredModuleId: "mod_3_3",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 3 - Mirroring & Labeling",
      es: "Día 3 - Espejo y Etiquetado"
    },
    relatedSkill: {
      en: "Trust Maintenance & Value Validating",
      es: "Mantenimiento de Confianza y Validación de Valor"
    },
    proTips: [
      {
        en: "💡 Keep eye contact steady and warm. Use head nods and simple verbal affirmations ('Makes complete sense', 'Understood').",
        es: "💡 Mantenga el contacto visual constante y cálido. Use asentimientos de cabeza y afirmaciones verbales sencillas ('Tiene mucho sentido', 'Comprendo')."
      },
      {
        en: "🎯 Value Label: 'It sounds like integrity and long-term security for your family are the absolute priorities for you in this project.'",
        es: "🎯 Etiqueta de Valor: 'Parece que la integridad y la seguridad a largo plazo para su familia son las prioridades absolutas para usted en este proyecto.'"
      }
    ]
  },
  "reluctant_rosa": {
    scenarioId: "reluctant_rosa",
    requiredModuleId: "mod_3_3",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 3 - Mirroring & Labeling",
      es: "Día 3 - Espejo y Etiquetado"
    },
    relatedSkill: {
      en: "Defense De-escalation & Safe Discovery",
      es: "Desescalada de Defensas y Descubrimiento Seguro"
    },
    proTips: [
      {
        en: "💡 Use soft vocal tone and slow pacing. Give Reluctant Rosa total control: 'You don't have to make any decisions today.'",
        es: "💡 Use un tono de voz suave y un ritmo lento. Dele el control total a Rosa: 'No tiene que tomar ninguna decisión el día de hoy.'"
      },
      {
        en: "🎯 Safety Frame: 'My goal is just to lay out the math side-by-side with your utility bills, so you can see if it makes financial sense. If not, at least you know where you stand.'",
        es: "🎯 Marco de Seguridad: 'Mi objetivo es solo colocar las matemáticas al lado de sus facturas de luz, para ver si tiene sentido financiero. Si no, al menos sabrá exactamente dónde está parado.'"
      }
    ]
  },
  "garcia_household": {
    scenarioId: "garcia_household",
    requiredModuleId: "mod_3_4",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 3 - Discovery Framework",
      es: "Día 3 - Marco de Descubrimiento"
    },
    relatedSkill: {
      en: "Dual-Spouse Pain Point Alignment",
      es: "Alineación de Puntos de Dolor en Parejas"
    },
    proTips: [
      {
        en: "💡 Ensure both spouses are actively engaged. Direct open-ended questions to BOTH parties to capture individual concerns.",
        es: "💡 Asegúrese de que ambos cónyuges participen activamente. Dirija preguntas abiertas a AMBAS partes para capturar las inquietudes individuales."
      },
      {
        en: "🎯 Pain Alignment: Identify who is more budget-conscious and who is more safety/design-conscious, then tailor separate discovery anchors for both.",
        es: "🎯 Alineación de Dolor: Identifique quién es más consciente del presupuesto y quién de la seguridad/diseño, luego adapte anclas de descubrimiento distintas."
      }
    ]
  },

  // Day 4
  "skeptical_steve": {
    scenarioId: "skeptical_steve",
    requiredModuleId: "mod_4_1",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 4 - Bill Autopsy",
      es: "Día 4 - Autopsia de la Factura"
    },
    relatedSkill: {
      en: "Utility Cost Transparency & ROI Presentation",
      es: "Transparencia de Costos Públicos y Presentación de ROI"
    },
    proTips: [
      {
        en: "💡 Never debate. Use the 'Feel, Felt, Found' framework to disarm skepticism: 'I understand why you feel that way...'",
        es: "💡 Nunca debata. Use la estructura de 'Sentir, Sentido, Encontrado' para desarmar el escepticismo: 'Entiendo por qué se siente así...'"
      },
      {
        en: "🎯 Bill Autopsy Line: 'Most homeowners look at the total bill amount, but the utility company hides the delivery fees and tier escalators in the fine print. Let's expose what you are actually paying per kWh.'",
        es: "🎯 Línea de Autopsia: 'La mayoría de los propietarios miran el monto total, pero la compañía de luz esconde cargos de distribución y escaladores de tarifas. Expongamos lo que realmente paga por kWh.'"
      }
    ]
  },
  "numbers_nancy": {
    scenarioId: "numbers_nancy",
    requiredModuleId: "mod_4_2",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 4 - Financial Models",
      es: "Día 4 - Modelos Financieros"
    },
    relatedSkill: {
      en: "NPV & Offset Ratio Explanations",
      es: "Explicaciones de VPN y Ratio de Compensación"
    },
    proTips: [
      {
        en: "💡 Walk through the compounding effect of historical rate hikes. Contrast high-cost renting with structured owning.",
        es: "💡 Explique el efecto compuesto de las alzas históricas de tarifas. Contraste el alto costo de alquilar con la compra estructurada."
      },
      {
        en: "🎯 Financial Frame: 'Solar isn't an extra bill. It is an immediate utility swap that turns an escalating expense into a pre-determined wealth-building asset.'",
        es: "🎯 Marco Financiero: 'La energía solar no es una factura adicional. Es un intercambio de servicio público inmediato que convierte un gasto creciente en un activo predeterminado que genera riqueza.'"
      }
    ]
  },

  // Day 5
  "stalling_stan": {
    scenarioId: "stalling_stan",
    requiredModuleId: "mod_5_2",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 5 - Objection Mitigation",
      es: "Día 5 - Mitigación de Objeciones"
    },
    relatedSkill: {
      en: "Decision Timeline Locking & Close Anchoring",
      es: "Cierre del Cronograma de Decisión y Anclaje de Cierre"
    },
    proTips: [
      {
        en: "💡 When they stall ('I need to think about it'), label the underlying fear: 'It sounds like you want to make sure you're not rushing into a long-term commitment.'",
        es: "💡 Cuando posterguen ('Necesito pensarlo'), etiquete el miedo subyacente: 'Parece que quiere asegurarse de no apresurarse en un compromiso a largo plazo.'"
      },
      {
        en: "🎯 Deflation Line: 'Totally fair. But let me ask, what specific part of the math are you looking to sleep on? Is it the monthly savings, the installer, or is it me?'",
        es: "🎯 Línea de Deflación: 'Totalmente justo. Pero déjeme preguntar, ¿qué parte matemática específica desea madurar? ¿El ahorro mensual, el instalador, o soy yo?'"
      }
    ]
  },
  "hesitant_helen": {
    scenarioId: "hesitant_helen",
    requiredModuleId: "mod_5_2",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 5 - Objection Mitigation",
      es: "Día 5 - Mitigación de Objeciones"
    },
    relatedSkill: {
      en: "Risk Reassurance & Urgency Creation",
      es: "Tranquilización de Riesgos y Creación de Urgencia"
    },
    proTips: [
      {
        en: "💡 Helen is afraid of making a mistake. Emphasize the transferability, state-backed warranties, and the double guarantee structure.",
        es: "💡 Helen tiene miedo de cometer un error. Enfatice la transferibilidad, las garantías respaldadas por el estado y la estructura de doble garantía."
      },
      {
        en: "🎯 Reassurance Frame: 'You are protected by our full 25-year structural and performance double warranty. If anything fails, it is replaced at zero out-of-pocket cost to you.'",
        es: "🎯 Marco de Tranquilidad: 'Está protegida por nuestra doble garantía completa de 25 años en estructura y rendimiento. Si algo falla, se reemplaza con costo de bolsillo cero para usted.'"
      }
    ]
  },

  // Day 6
  "post_install_patricia": {
    scenarioId: "post_install_patricia",
    requiredModuleId: "mod_6_1",
    requiredQuizThreshold: 80,
    unlockLabel: {
      en: "Day 6 - Moments of Happiness",
      es: "Día 6 - Momentos de Felicidad"
    },
    relatedSkill: {
      en: "Referral Mining & Customer Advocacy",
      es: "Minería de Referidos y Defensoría del Cliente"
    },
    proTips: [
      {
        en: "💡 The moment of highest excitement is right at the final design sign-off or right after active inspection/turn on. Tap into this joy immediately.",
        es: "💡 El momento de mayor emoción es justo en la firma del diseño final o tras la inspección/encendido activo. Aproveche esta alegría de inmediato."
      },
      {
        en: "🎯 Referral Ask: 'Since you are locking in these rates, who are the first three neighbors you care about that deserve to stop throwing money away to the utility company?'",
        es: "🎯 Pedido de Referidos: 'Dado que está congelando estas tarifas, ¿quiénes son los primeros tres vecinos que le importan y que merecen dejar de tirar dinero a la compañía de luz?'"
      }
    ]
  },
  "rodriguez_family": {
    scenarioId: "rodriguez_family",
    requiredModuleId: "mod_6_8",
    requiredQuizThreshold: 100, // CRITICAL CERTIFICATION OVERRIDE
    unlockLabel: {
      en: "Day 6 - Complex Dual-Spouse Meeting (Certification)",
      es: "Día 6 - Reunión Compleja de Pareja (Certificación)"
    },
    relatedSkill: {
      en: "Master Class - Closing & Final Contract Signature",
      es: "Clase Maestra - Cierre y Firma Final del Contrato"
    },
    proTips: [
      {
        en: "⭐ CRITICAL CERTIFICATION: A perfect score (100%) on the Day 6 knowledge check is required to unlock this elite final assessment simulator.",
        es: "⭐ CERTIFICACIÓN CRÍTICA: Se requiere una calificación perfecta (100%) en la prueba del Día 6 para desbloquear este simulador de evaluación final de élite."
      },
      {
        en: "💡 Master Class Closing: Synchronize the closing sequence. Hand the digital pad directly to the primary decision maker with downward, calm inflection: 'Go ahead and authorize here to lock this in.'",
        es: "💡 Cierre de Clase Maestra: Sincronice la secuencia de cierre. Entregue la tableta directamente al tomador de decisiones principal con una inflexión hacia abajo y calmada: 'Proceda a autorizar aquí para congelar esto.'"
      }
    ]
  }
};

/**
 * Helper to fetch a lock rule by scenario ID.
 */
export function getScenarioLockRule(scenarioId: string): ScenarioLockRule | undefined {
  return SCENARIO_LOCK_RULES[scenarioId];
}
