/**
 * modules.es.ts — AUTO-GENERATED Spanish Curriculum Override
 *
 * Generated: 2026-05-23T00:00:00.000Z
 * Source:    MASTER_CURRICULUM_PACK_V2_ES_*.md & ElevenLabs_Transcripts
 *
 * GUARDRAILS:
 * - Spanish structure matches English blueprint exactly 1:1
 * - Sections count, types, quiz options, and correctAnswerIndex are validated
 * - Accents (Español, evaluación, módulo, lección, etc.) are verified
 * - isTextFallback: false for all modules (except mod_6_8)
 *
 * Regenerate by running: python scratch/build_es_modules.py
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
  mod_1_1: {
    id: "mod_1_1",
    title: "Módulo 1.1: Bienvenida y Visión del Futuro",
    subtitle: "Establecer expectativas, mostrar el potencial de ingresos e introducir la misión de SeptiVolt.",
    sections: [
{
        title: "Welcome to the SeptiVolt Accelerator",
        type: "text",
        content: "Bienvenido al Acelerador de Ventas Solares SeptiVolt. Durante los próximos siete días, vas a construir las habilidades, la mentalidad y las herramientas para convertirte en un consultor solar profesional. Este no es un curso teórico — cada lección está construida alrededor de conversaciones reales, objeciones reales y cierres reales. Para el Día Siete, estarás certificado en campo y listo para generar ingresos. Empecemos."
      },
      {
        title: "Your Income Potential in Solar",
        type: "list",
        content: "Hablemos de lo que realmente es posible aquí. En tu primer mes, la mayoría de los nuevos representantes ganan entre tres y cinco mil dólares. Esa es la fase de curva de aprendizaje. Para el mes tres, los representantes que son consistentes están ganando entre ocho y doce mil dólares al mes. Para el mes seis y más allá, los mejores están llegando a entre quince y veinticinco mil dólares al mes. Estos son números reales de representantes reales. La clave es presentarte cada día, especialmente en las primeras semanas cuando se siente lento.",
        items: [
"Mes 1 (Curva de aprendizaje): $3,000 – $5,000",
          "Mes 3 (Fase de consistencia): $8,000 – $12,000",
          "Mes 6+ (Mejor representante): $15,000 – $25,000",
          "La consistencia diaria en las primeras semanas es la única variable que controlas"
        ]
      },
      {
        title: "The 7-Day Structure",
        type: "text",
        content: "Aquí está cómo están estructurados los próximos siete días. El Día Uno es incorporación y fundamentos — hoy. Los Días Dos al Seis son entrenamiento intensivo, cada día construyendo sobre el anterior. El Día Siete es tu certificación de campo — correrás una cita real con tu gerente observando. Cada día tiene juegos de roles integrados, porque la única manera de mejorar en esto es practicando. Las micro-evaluaciones diarias detectarán cualquier brecha antes del Día Siete."
      },
      {
        title: "The 4 Stages of Competence",
        type: "list",
        content: "Cada habilidad que aprendas sigue cuatro etapas. Tu trabajo en este programa es moverse a través de estas etapas lo más rápido posible. La caída es normal. Empújala.",
        items: [
"1. Incompetencia Inconsciente — no sabes lo que no sabes. Estás emocionado pero eres peligroso.",
          "2. Incompetencia Consciente — te das cuenta de cuánto hay que aprender. Se siente incómodo. Aquí es donde la mayoría de la gente renuncia. No lo hagas.",
          "3. Competencia Consciente — puedes hacerlo, pero tienes que pensar mucho en ello. Estás en la lucha.",
          "4. Competencia Inconsciente — automático. Estado de flujo. Esto es la maestría."
        ]
      },
      {
        title: "Your Signed Commitment",
        type: "quote",
        content: "Antes de continuar, vas a firmar un acuerdo de compromiso. Este no es un documento legal — es un contrato personal contigo mismo. Te estás comprometiendo a presentarte plenamente durante los próximos siete días, completar tus asignaciones diarias y responsabilizarte ante los estándares de un consultor solar profesional. Fírmalo y cúmplelo."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_1_1",
        type: "open_response",
        label: "¿Cuál es tu objetivo de ingresos para el Mes 3? ¿Qué nivel de actividad diaria necesitas para alcanzarlo?",
        placeholder: "Sé específico — ej. $10,000/mes = X puertas/día, X citas/semana",
        lines: 4
      },
      {
        id: "wb_1_1_2",
        type: "open_response",
        label: "¿En qué etapa de competencia te encuentras en este momento? ¿Cómo se sentirá cuando estés en la etapa 4?",
        placeholder: "Sé honesto, luego describe cómo se ve y se siente para ti la competencia inconsciente",
        lines: 3
      },
      {
        id: "wb_1_1_3",
        type: "checklist",
        label: "Acuerdo de Compromiso — firma con tus iniciales cada ítem:",
        items: [
"Me presentaré plenamente durante los 7 días",
          "Completaré cada asignación diaria",
          "Me mantendré bajo los estándares de un consultor solar profesional",
          "No me saltaré los juegos de rol, incluso cuando sean incómodos"
        ]
      }
    ],
    quiz: {
      title: "Module 1.1 Knowledge Check",
      questions: [
{
          id: "kc_1_1_a",
          question: "¿Qué etapa de la competencia se siente más incómoda y hace que la mayoría de los representantes renuncien?",
          options: [
"Incompetencia Inconsciente",
            "Incompetencia Consciente",
            "Competencia Consciente",
            "Competencia Inconsciente"
          ],
          correctAnswerIndex: 1,
          explanation: "La incompetencia consciente es 'La Caída' (The Dip) — te das cuenta de cuánto no sabes. Es incómodo, pero es la única manera de crecer. Los representantes que la superan se convierten en los mejores."
        },
        {
          id: "kc_1_1_b",
          question: "Para el mes 6, ¿cuál es un rango de ingresos mensuales realista para un representante solar que trabaja con consistencia?",
          options: [
"$1,000 – $3,000",
            "$3,000 – $5,000",
            "$15,000 – $25,000",
            "$50,000+"
          ],
          correctAnswerIndex: 2,
          explanation: "Los mejores representantes que se presentan diariamente y siguen el sistema alcanzan entre $15K y $25K al mes para el sexto mes. Esto es alcanzable, no garantizado. Requiere una actividad consistente desde el Día Uno."
        }
      ]
    }
  },
  mod_1_2: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_2_1",
        type: "open_response",
        label: "¿Qué herramienta o sistema es el que más te preocupa configurar correctamente? ¿Por qué?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_1_3: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_3_1",
        type: "open_response",
        label: "Escribe cómo planeas estructurar un día típico de trabajo usando los bloques de tiempo anteriores:\n\nMañana (8–10 am): ___________________________________________________________\n\nMedia mañana (10 am–12 pm): __________________________________________________\n\nTarde / Horas Doradas (2–7 pm): _________________________________________________\n\nNoche (después de 7 pm): _______________________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_1_4: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_4_1",
        type: "open_response",
        label: "Escribe en tus propias palabras cómo responderías a este mito: *\"No tengo sentido instalar solar ahora, la tecnología va a mejorar el año que viene.\"*",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 1.4 Knowledge Check",
      questions: [
{
          id: "kc_1_4_a",
          question: "¿Cuál fue el concepto principal cubierto en Panorama General de la Industria Solar?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 4."
        }
      ]
    }
  },
  mod_1_5: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_5_1",
        type: "open_response",
        label: "Practica explicar cómo funciona el solar como si le hablaras a un propietario que nunca ha escuchado el término. Escríbelo aquí primero:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 1.5 Knowledge Check",
      questions: [
{
          id: "kc_1_5_a",
          question: "¿Cuál fue el concepto principal cubierto en Fundamentos de Tecnología Solar?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 5."
        }
      ]
    }
  },
  mod_1_5a: {
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
        items: [
"Nivel base: La energía más barata (p. ej., los primeros 500 kWh)",
          "Nivel 2/3: Energía más cara (p. ej., 501+ kWh)"
        ]
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
        items: [
"Annual billing cycle vs. monthly billing cycle.",
          "The True-Up is the annual reconciliation of what was produced vs. what was consumed.",
          "Setting expectations: A solar bill doesn't usually look like zero every month. There are usually base connection fees ($10–$20/mo) that cannot be offset."
        ]
      },
      {
        title: "Net Energy Metering (NEM)",
        type: "slides",
        content: "Explica NEM usando la analogía de la \"cuenta bancaria\": créditos y débitos.",
        slides: [
{
            title: "Utility Bills & Net Metering: The Financial Foundation",
            content: "Bienvenido al Módulo 1.5A — Facturas de Energía y Medición Neta. Antes de poder explicar por qué la energía solar es una mejor decisión financiera, necesitas entender exactamente cómo se le está cobrando a un propietario en este momento — y cómo la energía solar cambia esa ecuación. La factura de energía es la imagen del \"antes\". Si no puedes leerla con fluidez, no puedes explicar el \"después\" de manera creíble. Este módulo es tu base. Al final, podrás tomar cualquier factura de energía, identificar los números clave en menos de dos minutos, y explicar la medición neta en un lenguaje que cualquier propietario pueda entender a la primera.",
            image: "/images/utility_bill_breakdown.png"
          },
          {
            title: "The Anatomy of a Utility Bill",
            content: "Toda factura de energía tiene cuatro componentes clave que debes identificar de inmediato. Primero, el consumo total en kilovatios-hora — esto te dice cuánta energía consumió el hogar ese mes. Segundo, el plan tarifario — ¿es una tarifa escalonada, una tarifa fija, o una estructura de uso en el tiempo? Tercero, el total a pagar — dividido entre lo que pagan por la distribución de energía y lo que pagan por el suministro de energía. Y cuarto, el historial de consumo de doce meses — la fila más importante de toda la factura. Nunca le pidas al propietario que interprete su propia factura. Tú la miras, encuentras estos cuatro elementos de inmediato, y narras lo que ves. Ese momento de fluidez genera credibilidad antes de que hayas mostrado un solo número solar."
          },
          {
            title: "Tiered vs. Time-of-Use (TOU)",
            content: "Hay dos estructuras tarifarias principales que vas a encontrar. La primera es la tarifa escalonada — mientras más electricidad consume el propietario, más caro se vuelve cada kilovatio-hora adicional. El primer bloque de consumo es barato. Cada bloque posterior cuesta más. Esto es en realidad una excelente noticia para la energía solar, porque el sistema solar elimina primero los niveles más caros. La segunda estructura es la tarifa según el horario de uso — las tarifas cambian dependiendo de la hora del día. La electricidad en la mañana y a altas horas de la noche es barata. La electricidad por la tarde y en la noche es cara. Con una tarifa por horario de uso, un sistema solar que produce durante las horas pico entrega el máximo ahorro, y el almacenamiento de baterías hace que esos ahorros sean aún mayores.",
            image: "/images/tou_rate_chart.png"
          },
          {
            title: "Net Energy Metering (NEM)",
            content: "La Medición Neta de Energía — NEM, por sus siglas en inglés — es el motor que hace que la energía solar conectada a la red sea financieramente viable. Aquí está la forma más sencilla de explicarlo. Piensa en la red eléctrica como una cuenta bancaria. Durante el día, tus paneles solares producen más electricidad de la que consume tu hogar. El exceso se envía a la red — eso es un depósito. Por la noche, cuando tus paneles no están produciendo, extraes energía de la red — eso es un retiro. Al final de cada mes, la empresa de servicios hace el balance. Si depositaste más de lo que retiraste, llevas un crédito hacia adelante. Si retiraste más, pagas la diferencia a tarifas de venta al público. La energía solar combinada con la medición neta esencialmente permite a los propietarios usar la red como una batería gratuita.",
            image: "/images/net_metering_flow.png"
          },
          {
            title: "1:1 vs. Partial Credit NEM",
            content: "No todas las políticas de medición neta son iguales — y esto importa en el campo. En los estados con medición neta uno a uno, cada kilovatio-hora que exporta un propietario le genera un crédito completo a tarifa de venta — dólar por dólar. En los estados que han cambiado a medición de crédito parcial — como la NEM 3.0 de California — el crédito de exportación es mucho menor, a veces apenas de tres a cinco centavos por kilovatio-hora, comparado con los veinticinco a cuarenta centavos que pagan al comprar. En esos mercados, el almacenamiento de baterías se vuelve significativamente más importante porque le permite al propietario usar su propia producción solar en lugar de exportarla a pérdida. Siempre conoce qué política aplica en tu mercado antes de construir una propuesta."
          },
          {
            title: "The True-Up Bill",
            content: "La factura de liquidación anual es el ajuste final entre el propietario y la empresa de servicios. A lo largo del año, los créditos solares se acumulan cuando el sistema sobreproduces y el propietario registra un superávit. Al final del ciclo anual, la empresa concilia el año completo de créditos y cargos. Si el propietario produjo en exceso, puede recibir un pequeño reembolso — aunque típicamente a tarifas mayoristas, no al precio de venta. Si produjeron menos de lo necesario, deben la diferencia. Es por eso que diseñamos los sistemas al ciento cinco o ciento diez por ciento del consumo anual — para incorporar un margen de tolerancia para la degradación y las variaciones estacionales. Y una expectativa importante más: incluso con energía solar, la mayoría de los propietarios aún tienen una pequeña tarifa de conexión mensual — típicamente entre diez y veinte dólares. Eso no es el cargo por energía. Es el costo base de mantenerse conectado a la red, y la energía solar no puede eliminarlo."
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_5a_1",
        type: "open_response",
        label: "*(Usa la factura de muestra proporcionada por tu entrenador)*\n\n1. ¿Cuál es el uso total de kWh del mes? _______________\n\n2. ¿Cuál es el plan tarifario? (Escalonado / Plano / TOU): _______________\n\n3. ¿Cuál es el cargo base de conexión mensual? _______________\n\n4. ¿Es este propietario un buen candidato para solar? ¿Por qué sí o por qué no?",
        placeholder: "kWh usage: __ | Rate Plan: __ | Base fee: __",
        lines: 2
      },
      {
        id: "wb_1_5a_2",
        type: "open_response",
        label: "Explica el net metering como si le hablaras a un propietario que nunca ha escuchado el término. Sin jerga técnica:",
        placeholder: "Think of the utility grid like...",
        lines: 4
      },
      {
        id: "wb_1_5a_3",
        type: "open_response",
        label: "Un propietario muestra una factura con tarifa escalonada: paga $0.15/kWh en el Nivel 1, $0.28/kWh en el Nivel 2, y $0.45/kWh en el Nivel 3. ¿Cómo le explicas el beneficio financiero del solar?",
        placeholder: "Your pitch...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 1.5A Knowledge Check",
      questions: [
{
          id: "kc_1_5a_1",
          question: "Si un propietario está en un plan de Tiempo de Uso (TOU), ¿cuándo suele ser más cara su energía?",
          options: [
"Durante la noche",
            "A mitad del día",
            "Tarde en la tarde / Noche (p. ej., de 4 PM a 9 PM)",
            "Temprano en la mañana"
          ],
          correctAnswerIndex: 2,
          explanation: "Las horas pico en los planes TOU suelen ser a última hora de la tarde y en la noche, cuando la demanda en la red es mayor."
        },
        {
          id: "kc_1_5a_2",
          question: "¿Qué es una factura de true-up (liquidación)?",
          options: [
"Un cargo mensual por estar conectado a la red.",
            "Un ciclo de facturación anual donde la empresa de servicios públicos concilia la producción solar total con el consumo de red total.",
            "Un cargo de penalización por producir demasiada energía solar.",
            "La factura recibida en el aniversario de la compra de la casa."
          ],
          correctAnswerIndex: 1,
          explanation: "El true-up es la conciliación anual — el cálculo matemático de todos tus créditos versus todo tu consumo del año."
        }
      ]
    }
  },
  mod_1_5b: {
    id: "mod_1_5b",
    title: "Módulo 1.5B: Estructuras Financieras del Solar",
    subtitle: "> **Contenido Completo V2 — SeptiVolt Solar Sales Rep Accelerator™**",
    sections: [
{
        title: "La Energía Solar No Es de Talla Única",
        type: "text",
        content: "Bienvenido al Módulo 1.5B — Estructuras Financieras Solares. La energía solar no es un producto financiero de talla única. Tu trabajo no es promocionar una sola opción de financiamiento. Tu trabajo es emparejar el vehículo financiero correcto con el propietario correcto según su situación y metas específicas. Al final de este módulo, podrás explicar las compras en efectivo, los préstamos solares, los arrendamientos y los contratos de compraventa de energía — con claridad y confianza — e identificar qué opción sirve mejor a cada propietario. Equivocarte aquí te cuesta tratos. Acertar genera confianza que cierra."
      },
      {
        title: "Objetivos de Aprendizaje",
        type: "list",
        content: "Al final de este módulo, podrás:",
        items: [
"Explicar la mecánica principal de una compra al contado, un préstamo solar, un arrendamiento solar y un contrato de compraventa de energía (PPA).",
          "Identificar el perfil de propietario ideal para cada producto financiero.",
          "Explicar el Crédito Fiscal Federal por Inversión Solar (ITC) de manera precisa, sin dar asesoría fiscal ilegal.",
          "Comprender la diferencia entre las tarifas del distribuidor (dealer fees) y el precio al contado de un sistema.",
          "Posicionar el concepto de 'Cambiar tu factura' de manera efectiva."
        ]
      },
      {
        title: "Sección 1: El Concepto de Cambiar tu Factura",
        type: "text",
        content: "El concepto central detrás de la mayoría de los financiamientos solares es lo que llamamos \"cambiar la factura\". El propietario ya está pagando a la empresa de servicios todos los meses — ese dinero se pierde para siempre. La energía solar reemplaza ese pago mensual a la empresa de servicios con un pago mensual fijo por un sistema que el propietario eventualmente poseerá. La pregunta clave nunca es \"¿puede pagar la energía solar?\" — es \"¿el pago solar cuesta menos de lo que ya está pagando?\" En la mayoría de los hogares que califican, la respuesta es sí desde el primer día. Ese es el cambio. Una factura de servicios eterna reemplazada por un pago estructurado por un activo."
      },
      {
        title: "Sección 2: El Crédito Fiscal Federal por Inversión (ITC)",
        type: "text",
        content: "Antes de continuar, hay un límite de cumplimiento que todo asesor debe entender. El Crédito Fiscal Federal de inversión del treinta por ciento es real y es significativo — en un sistema de treinta mil dólares, eso representa un crédito de nueve mil dólares. Pero tú no eres contador público. No puedes garantizar que un propietario lo recibirá, decirle cómo reclamarlo, ni asesorarlo sobre su situación fiscal específica. El lenguaje que uses debe siempre mantenerse dentro de estos límites. Di: \"La mayoría de los propietarios en esta situación califican para el crédito federal del treinta por ciento — pero siempre recomiendo confirmarlo con su contador antes de contarlo como seguro.\" Ese lenguaje es honesto, útil y está en cumplimiento."
      },
      {
        title: "Sección 3: Emparejamiento de Productos",
        type: "text",
        content: "Compra al Contado:\n- Ideal para: Propietarios con liquidez que buscan el máximo ROI a largo plazo. Conservan el ITC.\n\nPréstamo Solar:\n- Ideal para: Propietarios que desean la propiedad y el ITC, pero quieren aprovechar el financiamiento para lograr un pago mensual bajo desde el primer día.\n- A tener en cuenta: Las tarifas del distribuidor (dealer fees) significan que el precio financiado es mayor que el precio al contado.\n\nArrendamiento/PPA (Propiedad de Terceros):\n- Ideal para: Propietarios con ingresos fijos, jubilados sin obligación fiscal, o aquellos que solo desean la tarifa mensual más baja posible con cero responsabilidad de mantenimiento.\n- La empresa de financiamiento conserva el ITC y transfiere los ahorros a través de una tarifa mensual más baja."
      },
      {
        title: "Presentación de Estructuras Financieras Solares",
        type: "slides",
        content: "Presentación para Estructuras Financieras Solares",
        slides: [
{
            title: "Estructuras Financieras Solares: Opciones e Implicaciones",
            content: "Bienvenido al Módulo 1.5B — Estructuras Financieras Solares. La energía solar no es un producto financiero de talla única. Tu trabajo no es promocionar una sola opción de financiamiento. Tu trabajo es emparejar el vehículo financiero correcto con el propietario correcto según su situación y metas específicas. Al final de este módulo, podrás explicar las compras en efectivo, los préstamos solares, los arrendamientos y los contratos de compraventa de energía — con claridad y confianza — e identificar qué opción sirve mejor a cada propietario. Equivocarte aquí te cuesta tratos. Acertar genera confianza que cierra.",
            image: "/images/ownership_vs_lease.png"
          },
          {
            title: "El Concepto de Cambiar tu Factura",
            content: "El concepto central detrás de la mayoría de los financiamientos solares es lo que llamamos \"cambiar la factura\". El propietario ya está pagando a la empresa de servicios todos los meses — ese dinero se pierde para siempre. La energía solar reemplaza ese pago mensual a la empresa de servicios con un pago mensual fijo por un sistema que el propietario eventualmente poseerá. La pregunta clave nunca es \"¿puede pagar la energía solar?\" — es \"¿el pago solar cuesta menos de lo que ya está pagando?\" En la mayoría de los hogares que califican, la respuesta es sí desde el primer día. Ese es el cambio. Una factura de servicios eterna reemplazada por un pago estructurado por un activo."
          },
          {
            title: "Cumplimiento del ITC Federal",
            content: "Antes de continuar, hay un límite de cumplimiento que todo asesor debe entender. El Crédito Fiscal Federal de inversión del treinta por ciento es real y es significativo — en un sistema de treinta mil dólares, eso representa un crédito de nueve mil dólares. Pero tú no eres contador público. No puedes garantizar que un propietario lo recibirá, decirle cómo reclamarlo, ni asesorarlo sobre su situación fiscal específica. El lenguaje que uses debe siempre mantenerse dentro de estos límites. Di: \"La mayoría de los propietarios en esta situación califican para el crédito federal del treinta por ciento — pero siempre recomiendo confirmarlo con su contador antes de contarlo como seguro.\" Ese lenguaje es honesto, útil y está en cumplimiento.",
            image: "/images/solar_incentives.png"
          },
          {
            title: "Opción 1: Compra al Contado",
            content: "Una compra en efectivo es la opción de mayor retorno de inversión para propietarios que tienen liquidez. El propietario paga el sistema en su totalidad, lo posee de inmediato y recibe el crédito fiscal federal completo. No hay pagos de préstamo, ni cargos por intereses, ni cláusulas de escalada. A lo largo de veinticinco años, un comprador en efectivo ahorra más dinero en términos absolutos. La desventaja es obvia — requiere un capital inicial significativo. Esta opción es ideal para propietarios con ahorros sólidos que se enfocan en el máximo retorno a largo plazo y tienen una obligación fiscal clara contra la cual aplicar el crédito."
          },
          {
            title: "Opción 2: Préstamos Solares y Tarifas del Distribuidor",
            content: "El préstamo solar es la opción de financiamiento más común para propietarios calificados. El propietario pide prestado el precio de compra, es dueño del sistema y recibe el crédito fiscal federal. Los pagos mensuales del préstamo son típicamente más bajos que su factura de servicios actual desde el primer día — lo que hace que la matemática sea fácil de demostrar. La estrategia de los dieciocho meses sin intereses funciona así: algunos prestamistas ofrecen un pago más alto durante los primeros dieciocho meses; luego el propietario aplica su crédito fiscal federal como reducción de capital cuando declara impuestos. Eso reduce el pago significativamente para el resto de la vida del préstamo. Explica esta matemática claramente a los propietarios — responde la pregunta \"¿vale la pena?\" antes de que la hagan. Una comisión del financista está incorporada en el préstamo para reducir la tasa de interés — sé transparente sobre esto. El precio financiado es más alto que el precio en efectivo, y los propietarios merecen entender por qué."
          },
          {
            title: "Opción 3: Propiedad de Terceros (Arrendamiento / PPA)",
            content: "Los arrendamientos solares y los contratos de compraventa de energía — conocidos como APE — son ambas estructuras de propiedad de terceros. La empresa solar es dueña del sistema. El propietario recibe la electricidad que produce. Con un arrendamiento, el propietario paga un monto mensual fijo independientemente de cuánto produzca el sistema. Con un APE, paga por kilovatio-hora generado. Ambas opciones requieren cero pagos iniciales y cero responsabilidad de mantenimiento. La contrapartida: la empresa solar se queda con el crédito fiscal federal, y ambas estructuras incluyen una cláusula de escalada anual que aumenta los pagos del dos al tres por ciento por año. Esto siempre debe divulgarse. Estas opciones son las mejores para propietarios con puntajes de crédito más bajos, aquellos sin una obligación fiscal federal significativa, o quienes simplemente desean la tarifa mensual más baja posible sin las responsabilidades de la propiedad."
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_5b_1",
        type: "open_response",
        label: "Un propietario jubilado con pensión fija menciona que ya no paga impuestos sobre la renta. Quiere reducir sus facturas mensuales. ¿Cuál de las tres opciones financieras es la peor para él y por qué?",
        placeholder: "Worst fit: __ | Because...",
        lines: 3
      },
      {
        id: "wb_1_5b_2",
        type: "open_response",
        label: "Escribe la frase exacta que usarías para explicar el crédito fiscal federal a un propietario, manteniendo el cumplimiento estricto (sin actuar como CPA):",
        placeholder: "Depending on your tax situation...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 1.5B Knowledge Check",
      questions: [
{
          id: "kc_1_5b_1",
          question: "¿Por qué un préstamo solar a 25 años suele tener una fecha objetivo de 18 meses integrada?",
          options: [
"Ahí es cuando expira la garantía del equipo.",
            "Eso le da tiempo al propietario para recibir su devolución de impuestos y aplicar el Crédito Fiscal (ITC) al capital del préstamo para mantener el pago bajo.",
            "El préstamo debe pagarse por completo en 18 meses.",
            "Toma 18 meses para que los paneles solares se enciendan."
          ],
          correctAnswerIndex: 1,
          explanation: "La ventana de 18 meses está diseñada para que el propietario aplique su reembolso del ITC al capital, manteniendo bajo el pago mensual a largo plazo."
        },
        {
          id: "kc_1_5b_2",
          question: "¿Cuál de los siguientes escenarios es ideal para un producto de propiedad de terceros (arrendamiento o PPA)?",
          options: [
"Una persona con altos ingresos que busca el mejor ROI absoluto durante 25 años.",
            "Un propietario que desea agregar almacenamiento de baterías y reclamar todos los incentivos fiscales.",
            "Un propietario que paga cero impuestos federales y solo desea una factura de electricidad más baja con tranquilidad sobre el mantenimiento.",
            "Un propietario que busca aumentar el valor de reventa de su casa para venderla el próximo año."
          ],
          correctAnswerIndex: 2,
          explanation: "El arrendamiento/PPA es ideal cuando el propietario no puede usar el ITC — los jubilados con ingresos fijos son el ejemplo clásico."
        }
      ]
    }
  },
  mod_1_6: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_6_1",
        type: "open_response",
        label: "Completa esta oración con lo que resuena con tu propio estilo:\n\n*\"No soy un vendedor de solar. Soy un consultor que ayuda a los propietarios a _____________________ porque creo que _____________________.\"*",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_1_7: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_7_1",
        type: "open_response",
        label: "Para cada escenario, decide: ¿Califica? ¿Por qué sí o por qué no?\n\nEscenario A: Factura mensual de $85, uso de 550 kWh/mes, casa de 3 habitaciones.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 1.7 Knowledge Check",
      questions: [
{
          id: "kc_1_7_a",
          question: "¿Cuál fue el concepto principal cubierto en Dominio de la Factura de Servicios Públicos: Introducción?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 7."
        }
      ]
    }
  },
  mod_1_7a: {
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
        items: [
"Identify the optimal roof orientations (azimuth) for solar production and explain why it matters.",
          "Visually identify roof shading issues and understand how they impact production estimates.",
          "Distinguish visually between a 100A and 200A main electrical panel.",
          "Understand the Flag vs. Guess boundary: flagging potential issues for the survey team without diagnosing or quoting costs prematurely.",
          "Create a personal pre-survey field observation checklist."
        ]
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
        content: "Revisa los elementos que todo representante debe verificar antes de abandonar la propiedad.",
        slides: [
{
            title: "Basic Site Engineering Awareness",
            content: "Bienvenido al Módulo 1.7A — Conciencia Básica de Ingeniería del Sitio. Una de las fuentes más comunes de fricción después de la venta es una condición del sitio descubierta en la visita técnica profesional que el asesor debería haber identificado durante la visita de ventas. Este módulo te enseña a ver lo que importa — no cómo ser electricista o ingeniero estructural, sino cómo señalar las cosas correctas en el momento correcto. El principio es simple: ve más, promete menos, cierra mejor. Cuando detectas un problema potencial con anticipación y lo divulgas honestamente, proteges el trato, construyes confianza y evitas sorpresas que destruyen la confianza de los clientes en el proceso.",
            image: "/images/roof_assessment.png"
          },
          {
            title: "Reading the Roof",
            content: "Comienza con el techo. El factor más importante es la orientación — la dirección hacia la que da el techo. En el Hemisferio Norte, un techo orientado al sur recibe la mayor cantidad de luz solar directa durante el día y produce la mayor energía. Los techos orientados al este y al oeste siguen siendo viables pero producen menos. Los techos orientados al norte generalmente no se usan para energía solar en la mayoría de los mercados de los Estados Unidos. Más allá de la orientación, evalúa la inclinación — la pendiente del techo. Un techo muy plano o muy empinado puede requerir equipo de montaje especial y puede afectar el costo de instalación. Finalmente, busca sombreado. Los árboles, chimeneas, estructuras vecinas o unidades de climatización que proyectan sombra sobre la superficie del techo durante las horas pico de sol son tu principal variable de producción. La sombra que cubre más del cuarenta por ciento del área utilizable del techo es una señal de alerta seria."
          },
          {
            title: "Electrical Panel Awareness",
            content: "El tablero eléctrico es la segunda observación crítica. El número impreso en el interruptor principal te indica el tamaño del servicio. Un tablero de doscientos amperios es ideal para la mayoría de las instalaciones solares residenciales. Un tablero de cien amperios puede requerir lo que se llama una Actualización del Tablero Principal — un costo adicional que típicamente oscila entre dos mil y cinco mil dólares dependiendo del mercado. Esto debe divulgarse antes de construir la propuesta, nunca después. También verifica si el tablero tiene espacio disponible para interruptores. Incluso un tablero de doscientos amperios con todas las ranuras ocupadas puede requerir un subtablero o una derivación por el lado de la línea para acomodar la conexión solar. Mira el número del interruptor principal, cuenta las ranuras abiertas y señala lo que ves."
          },
          {
            title: "The Flag vs. Guess Boundary",
            content: "El límite entre señalar y adivinar es la disciplina profesional más importante de este módulo. Cuando notas algo — un tablero pequeño, un techo con sombra, un techo que necesita atención — tu trabajo es señalarlo honestamente, no diagnosticarlo ni cotizar un costo. Aquí está el lenguaje que te mantiene en el carril correcto: \"Noté que su tablero es un servicio de cien amperios. Es posible que requiera una actualización antes de la instalación — nuestro equipo de visita técnica lo confirmará y le dará un número exacto.\" Has hecho dos cosas. Has establecido una expectativa honesta. Y has posicionado al equipo de visita técnica como la autoridad técnica. Lo que nunca debes hacer es adivinar el costo, prometer que no será necesario, o decir \"probablemente estará bien\" cuando no estás seguro."
          },
          {
            title: "Field Observation Checklist",
            content: "Antes de salir de cada propiedad, realiza una verificación mental rápida. Orientación del techo — ¿la principal superficie utilizable del techo da al sur o al oeste? Sombreado — ¿hay árboles, estructuras u obstrucciones que proyecten sombra significativa sobre la superficie utilizable? Condición del techo — ¿hay señales visibles de envejecimiento, tejas faltantes, musgo o hundimientos que sugieran que se necesita una conversación sobre reparación del techo primero? Amperaje del tablero — ¿es un servicio de cien o doscientos amperios? Espacio en el tablero — ¿hay ranuras de interruptores abiertas? Esta verificación de cinco puntos toma menos de dos minutos. Protege tu trato de sorpresas después de la visita técnica, construye tu reputación como un consultor minucioso, y hace que tus envíos sean más limpios y rápidos de aprobar."
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_7a_1",
        type: "open_response",
        label: "Durante una visita de ventas, notas que el panel eléctrico en el garaje tiene el interruptor principal etiquetado como \"100A\". El panel tiene dos espacios de breaker disponibles de aproximadamente 20 en total. ¿Qué le dices al propietario sobre esta observación?",
        placeholder: "I noticed your main panel is...",
        lines: 3
      },
      {
        id: "wb_1_7a_2",
        type: "open_response",
        label: "El techo orientado al sur del propietario tiene un roble grande y maduro que proyecta sombra sobre el 40% del plano. No lo han mencionado. ¿Cómo manejas esta observación en la conversación?",
        placeholder: "I want to be upfront with you about something I noticed...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 1.7A Knowledge Check",
      questions: [
{
          id: "kc_1_7a_1",
          question: "¿Cuál es la orientación ideal para paneles solares en el hemisferio norte para maximizar la producción anual?",
          options: [
"Norte",
            "Sur",
            "Este",
            "Oeste"
          ],
          correctAnswerIndex: 3,
          explanation: "Los paneles orientados al sur reciben la mayor cantidad de luz solar directa durante todo el año en el hemisferio norte."
        },
        {
          id: "kc_1_7a_2",
          question: "¿Qué problema del techo puede impedir la instalación solar por completo?",
          options: [
"Daño estructural severo o un techo que necesita reemplazo completo.",
            "Tejas de asfalto de 5 años.",
            "Inclinación del techo menor a 15 grados.",
            "Paneles orientados al este."
          ],
          correctAnswerIndex: 2,
          explanation: "La solar requiere una base estructural segura. Si el techo está dañado estructuralmente o necesita reemplazo inminente, debe solucionarse primero."
        }
      ]
    }
  },
  mod_1_8: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_1_8_1",
        type: "open_response",
        label: "En una escala del 1–10, ¿qué tan cómodo te sientes explicando el solar a un propietario después de hoy? ¿Qué necesitas para llegar a un 10?\n\nNivel actual: _______ / 10\n\nPara llegar a 10, necesito: ___________________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_2_1: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_1_1",
        type: "open_response",
        label: "Escribe exactamente cómo dirías a un propietario que entiendes la reputación de los representantes de solar, y por qué eres diferente. Sé específico y auténtico:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.1 Knowledge Check",
      questions: [
{
          id: "kc_2_1_a",
          question: "¿Cuál fue el concepto principal cubierto en Psicología del Propietario: Por Qué la Gente Resiste el Solar?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 1."
        }
      ]
    }
  },
  mod_2_10: {
    id: "mod_2_10",
    title: "Módulo 2.10: Certificación de Juego de Roles del Día 2",
    subtitle: "Validar el aprendizaje mediante simulaciones en vivo y juegos de roles prácticos antes del campo.",
    sections: [
{
        title: "Certification Format",
        type: "text",
        content: "La certificación de juego de roles de hoy tiene cuatro rondas. Ronda uno: tocas una puerta y tu gerente juega al propietario escéptico que abre con no estoy interesado. Ronda dos: tomas una llamada telefónica de un prospecto apurado. Ronda tres: manejas tres micro-objeciones seguidas en fuego rápido. Ronda cuatro: corres el Marco de Conversación completo de siete pasos en la puerta de principio a fin. Necesitas demostrar las cuatro competencias antes de salir hoy. Este es tu primer examen real."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_10_1",
        type: "open_response",
        label: "Lista de Verificación de Certificación de Juego de Roles — firma con tus iniciales cada ronda al completarla:",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.10 Knowledge Check",
      questions: [
{
          id: "kc_2_10_a",
          question: "¿Cuál fue el concepto principal cubierto en Certificación de Juego de Roles del Día 2?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 10."
        }
      ]
    }
  },
  mod_2_11: {
    id: "mod_2_11",
    title: "Módulo 2.11: Cierre del Día 2 y Asignación de Campo",
    subtitle: "Tu primera asignación de campo para practicar toques de puerta en la vida real.",
    sections: [
{
        title: "Tonight's Field Assignment",
        type: "text",
        content: "Esta noche tienes una asignación de campo. Toca veinte puertas. Esto es práctica — sin presión de cerrar nada. Pero tócalas como si fueran reales, porque son reales. Grábate en tres de esas puertas con tu teléfono. Mira la reproducción esta noche y nota tu lenguaje corporal, tu apertura, tu energía. Luego revisa tu mapa de empatía del propietario de antes y nota qué tipos encontraste. Trae tus observaciones a la sesión de mañana. El Día Tres comienza donde terminó el Día Dos.# DÍA 3: Descubrimiento, Psicología y Dominio En Hogar"
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_11_1",
        type: "open_response",
        label: "Preparación de la Asignación de Campo — ¿cuál es tu plan para grabar tus toques de puerta esta noche?",
        placeholder: "Grabaré mi audio usando la app del teléfono y la revisaré antes de dormir...",
        lines: 2
      }
    ]
  },
  mod_2_2: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_2_1",
        type: "open_response",
        label: "Identifica 2–3 vecindarios en tu área de trabajo que cumplan los criterios de selección. Para cada uno, indica por qué califica:\n\nVecindario 1: ___________________________\nRazón: _____________________________________________________________________________\n\nVecindario 2: ___________________________\nRazón: _____________________________________________________________________________\n\nVecindario 3: ___________________________\nRazón: _____________________________________________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_2_3: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_3_1",
        type: "open_response",
        label: "Completa esta proyección con tus propios objetivos:\n\n| Métrica | Mi Meta Semanal |\n|---|---|\n| Puertas tocadas | _______ |\n| Conversaciones esperadas (÷3) | _______ |\n| Citas agendadas esperadas (÷5) | _______ |\n| Citas realizadas (estimado 80%) | _______ |\n| Cierres esperados (÷3) | _______ |\n| Ingresos estimados (× $3,500) | _______ |\n\n¿Qué número de puertas tocadas semanales necesitas para alcanzar tu meta de ingresos mensual?\n\nMeta de ingresos mensual: $_____________ → Meta de puertas semanales: _____________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_2_4: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_4_1",
        type: "open_response",
        label: "Escribe lo que dirías en cada paso en una visita de puerta a puerta típica:\n\nPaso 1 — Interrupción del Patrón:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.4 Knowledge Check",
      questions: [
{
          id: "kc_2_4_a",
          question: "¿Cuál fue el concepto principal cubierto en El Marco de Conversación Solar: Introducción?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 4."
        }
      ]
    }
  },
  mod_2_5: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_5_1",
        type: "open_response",
        label: "Escribe una versión personalizada de cada apertura. Hazlas tuyas — con tu voz y estilo natural:\n\nApertura 1 — Referencia de Vecino:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.5 Knowledge Check",
      questions: [
{
          id: "kc_2_5_a",
          question: "¿Cuál fue el concepto principal cubierto en Dominio de la Venta Puerta a Puerta?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 5."
        }
      ]
    }
  },
  mod_2_6: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_6_1",
        type: "open_response",
        label: "*(Con compañero o entrenador — alternar roles después de 5 rondas)*\n\nRonda 1: Tu compañero dice: *\"No me interesa.\"*\nTu respuesta: _____________________________________________________________________________\n\nRonda 2: *\"Estoy ocupado.\"*\nTu respuesta: _____________________________________________________________________________\n\nRonda 3: *\"Déjeme su tarjeta.\"*\nTu respuesta: _____________________________________________________________________________\n\nRonda 4: *\"Necesito hablar con mi esposa.\"*\nTu respuesta: _____________________________________________________________________________\n\nRonda 5: *\"Ya tuve una mala experiencia con una empresa de solar.\"*\nTu respuesta: _____________________________________________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.6 Knowledge Check",
      questions: [
{
          id: "kc_2_6_a",
          question: "¿Cuál fue el concepto principal cubierto en Manejo de Micro-Objeciones: Superando el Rechazo Automático?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 6."
        }
      ]
    }
  },
  mod_2_7: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_7_1",
        type: "open_response",
        label: "Escribe un script completo de 60–90 segundos para cuando un prospecto inbound responde el teléfono. Incluye apertura, preguntas de descubrimiento y cierre de cita:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 2.7 Knowledge Check",
      questions: [
{
          id: "kc_2_7_a",
          question: "¿Cuál fue el concepto principal cubierto en Agendamiento de Citas por Teléfono y Virtual?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 7."
        }
      ]
    }
  },
  mod_2_8: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_8_1",
        type: "open_response",
        label: "Personaliza la apertura anti-discurso con tu propio estilo y voz natural. Escríbela como realmente la dirías:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_2_9: {
    id: "mod_2_9",
    title: "Módulo 2.9: Flujo de Trabajo de Prospección Diaria y Responsabilidad",
    subtitle: "Estructurar tu día para la máxima eficiencia y registrar tus métricas de prospección diaria.",
    sections: [
{
        title: "The Daily Prospecting Rhythm",
        type: "text",
        content: "Tu día tiene cuatro bloques. La mañana de ocho a diez es para admin, actualizaciones de CRM y planificación de rutas. El mediodía de diez a dos es para entrenamiento, llamadas de equipo y preparación de propuestas. De dos a siete de la tarde — horas doradas — es solo para prospección. Y de siete a ocho de la tarde, registras tu actividad, completas seguimientos y planificas la ruta de mañana. Esta estructura elimina la fatiga de decisión sobre qué hacer a continuación. Siempre sabes qué hora es y cuál es tu trabajo."
      },
      {
        title: "KPI Tracking & Accountability",
        type: "text",
        content: "Cada noche, reporta cuatro números a tu gerente: puertas tocadas, conversaciones tenidas, citas agendadas y seguimientos completados. Estos números cuentan toda la historia. Si estás tocando puertas pero no teniendo conversaciones, la apertura necesita trabajo. Si estás teniendo conversaciones pero no agendando citas, la transición necesita trabajo. Si estás agendando citas pero no se presentan, el proceso de confirmación necesita trabajo. Rastrea tus números y siempre sabrás exactamente dónde mejorar."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_2_9_1",
        type: "open_response",
        label: "¿Cuáles son tus Horas Doradas? ¿Qué actividad está permitida durante este bloque y qué está estrictamente prohibido?",
        placeholder: "Permitido: __ | Prohibido: __",
        lines: 2
      }
    ]
  },
  mod_3_1: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_1_1",
        type: "open_response",
        label: "Escribe tu protocolo personal de los 15 minutos previos a cada cita:\n\nEn el carro (mientras llegas):",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_3_10: {
    id: "mod_3_10",
    title: "Módulo 3.10: Cierre del Día 3 y Tarea",
    subtitle: "Fijar tu primera cita real utilizando el marco de descubrimiento en el hogar.",
    sections: [
{
        title: "Day 3 Homework",
        type: "text",
        content: "Esta noche: agenda una cita real. Puede ser con un amigo o familiar si es necesario, pero corre el descubrimiento completo cuando llegues allí. Usa las doce preguntas. Grábate y envía la grabación antes de las nueve de la noche. Mañana es el Día Cuatro — dominio de la presentación. Aprenderás cómo mostrar los números de una manera que haga obvia la decisión, dominarás las tres estructuras de financiamiento y correrás un juego de roles de presentación completo de veinte minutos. Entra mañana con la grabación de tu descubrimiento revisada y notas tomadas.# DÍA 4: Dominio de la Presentación y Financiamiento"
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_10_1",
        type: "open_response",
        label: "Resumen del Día 3 — escribe una conclusión clave sobre la dinámica de cónyuge o los perfiles BOLT.",
        placeholder: "Mi aprendizaje clave hoy fue...",
        lines: 2
      }
    ]
  },
  mod_3_2: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_2_1",
        type: "open_response",
        label: "Para cada descripción, identifica el tipo BOLT e indica cómo adaptarías tu presentación:\n\nEscenario 1: El propietario interrumpe tu apertura y dice: *\"Mira, solo dime cuánto cuesta y si me ahorro dinero o no.\"*\nTipo BOLT: _______ | Cómo adapto: _____________________________________________\n\nEscenario 2: La propietaria dice: *\"Antes de continuar, necesito que me expliques exactamente cómo funciona la garantía del panel y qué pasa si la empresa cierra en 10 años.\"*\nTipo BOLT: _______ | Cómo adapto: _____________________________________________\n\nEscenario 3: El propietario te muestra fotos de sus hijos y dice: *\"Queremos dejarles algo mejor a nuestros hijos, ¿sabes?\"*\nTipo BOLT: _______ | Cómo adapto: _____________________________________________\n\nEscenario 4: La propietaria habla poco, asiente lentamente y dice: *\"No me gusta tomar decisiones apresuradas.\"*\nTipo BOLT: _______ | Cómo adapto: _____________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.2 Knowledge Check",
      questions: [
{
          id: "kc_3_2_a",
          question: "¿Cuál fue el concepto principal cubierto en Perfilado de Personalidad?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 2."
        }
      ]
    }
  },
  mod_3_3: {
    id: "mod_3_3",
    title: "Módulo 3.3: Biblioteca de Escenarios Reales de Propietarios",
    subtitle: "Aprender a identificar y manejar diferentes perfiles de personalidad y situaciones en el hogar.",
    sections: [
{
        title: "Scenario 1 ΓÇö The Burned Homeowner",
        type: "text",
        content: "El propietario quemado ha sido decepcionado por un contratista antes. Su confianza ha sido violada y están buscando evidencia de que eres igual. Tu trabajo es no defender la industria ni minimizar su experiencia. Valida completamente. Pregunta qué salió mal específicamente — eso muestra que genuinamente te importa. Muévete más despacio de lo que normalmente lo harías. Ofrece prueba social por escrito: reseñas, referencias, números de licencia, documentos de garantía. Nunca te apresures a cerrar con este propietario. Déjalo marcar el ritmo."
      },
      {
        title: "Scenario 2 ΓÇö The Researcher",
        type: "text",
        content: "Este propietario ha investigado extensamente y su ego está invertido en esa investigación. Te están poniendo a prueba. No los trates con condescendencia ni repitas conceptos básicos que ya saben. Pregunta qué han aprendido y qué preguntas quedan. Usa lenguaje técnico específico — NEM, curvas de degradación, relación DC-CA, tarifas de distribuidor. Si no sabes algo, dilo honestamente: buena pregunta — déjame obtener las cifras exactas de nuestro ingeniero. Luego pregúntales: basado en tu investigación, ¿cuál es la única cosa que todavía te detiene? Eso generalmente revela la objeción real."
      },
      {
        title: "Scenario 3 ΓÇö The Busy Homeowner",
        type: "text",
        content: "Este propietario tiene tiempo limitado, o usa la ocupación como escudo. Acepta la limitación de tiempo de inmediato — lo respeto, seré breve. Lidera de inmediato con el gancho más convincente: tu factura es más de X, ¿verdad? En quince minutos puedo mostrarte si estás dejando dinero sobre la mesa. Salta la construcción de rapport y llega a las preguntas de curiosidad rápidamente. Si realmente no pueden sentarse ahora, asegura una cita específica: ¿qué tal si vuelvo el jueves a las seis — veinte minutos, tendré todo preparado?"
      },
      {
        title: "Scenario 4 ΓÇö The Friendly Non-Committer",
        type: "text",
        content: "Este propietario te cae bien y disfruta la conversación — pero la simpatía no es disposición para decidir. Son aversos al conflicto. Estarán de acuerdo con todo y luego dirán déjame pensarlo al final. Disfruta el rapport, pero usa micro-cierres a lo largo: ¿tiene sentido hasta ahora? Si los números funcionan, ¿habría algo que te impediría seguir adelante? Cuando dicen que lo pensarán, pregunta específicamente qué quieren pensar. Luego usa lenguaje asuntivo para avanzar: agendemos."
      },
      {
        title: "Scenario 5 ΓÇö Already Has Solar / Trusts the Utility",
        type: "text",
        content: "Ya tiene solar — lidera con curiosidad genuina: ¿cómo está funcionando? Busca insatisfacción, oportunidades de actualización o necesidades de almacenamiento de baterías. Si están contentos, pivota a referidos. Confía en la empresa de servicios — no ataque a la empresa de servicios. En cambio, educa suavemente: ¿sabes cuánto han subido las tarifas en los últimos diez años? Muestra datos históricos como una conversación factual, no como una acusación. Reencuadra la solar como una cobertura: seguirías conectado a la empresa de servicios, solo serías menos dependiente de sus decisiones de precios."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_3_1",
        type: "open_response",
        label: "Identificación de Perfiles de Propietario — firma con tus iniciales cada escenario de juego de roles practicado:",
        placeholder: "Type your reflection here...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.3 Knowledge Check",
      questions: [
{
          id: "kc_3_3_a",
          question: "¿Cuál fue el concepto principal cubierto en Biblioteca de Escenarios Reales de Propietarios?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 3."
        }
      ]
    }
  },
  mod_3_4: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_4_1",
        type: "open_response",
        label: "Escribe la respuesta de espejo para cada declaración del propietario:\n\n1. *\"Realmente no confío en las empresas de solar.\"*\n   Espejo: _____________________________________________________________________________\n\n2. *\"Nuestras facturas han estado subiendo muchísimo.\"*\n   Espejo: _____________________________________________________________________________\n\n3. *\"No estoy seguro de que sea el momento correcto.\"*\n   Espejo: _____________________________________________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.4 Knowledge Check",
      questions: [
{
          id: "kc_3_4_a",
          question: "¿Cuál fue el concepto principal cubierto en Empatía Táctica y Espejeo?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 4."
        }
      ]
    }
  },
  mod_3_5: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_5_1",
        type: "open_response",
        label: "*(Conviértelas a tu voz natural — no memorices el texto, memoriza el concepto)*\n\n1. _____________________________________________________________________________\n2. _____________________________________________________________________________\n3. _____________________________________________________________________________\n4. _____________________________________________________________________________\n5. _____________________________________________________________________________\n6. _____________________________________________________________________________\n7. _____________________________________________________________________________\n8. _____________________________________________________________________________\n9. _____________________________________________________________________________\n10. _____________________________________________________________________________\n11. _____________________________________________________________________________\n12. _____________________________________________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.5 Knowledge Check",
      questions: [
{
          id: "kc_3_5_a",
          question: "¿Cuál fue el concepto principal cubierto en Arquitectura de Preguntas: La Secuencia de Descubrimiento?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 5."
        }
      ]
    }
  },
  mod_3_6: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_6_1",
        type: "open_response",
        label: "Llegas a la cita y solo está el esposo. La esposa está en el trabajo. El esposo dice: *\"Ella me dijo que siguiera adelante, que me cuenta después.\"*\n\n¿Qué haces? Escribe tu respuesta exacta:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.6 Knowledge Check",
      questions: [
{
          id: "kc_3_6_a",
          question: "¿Cuál fue el concepto principal cubierto en Dinámica del Cónyuge y el Tomador de Decisiones?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 6."
        }
      ]
    }
  },
  mod_3_7: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_7_1",
        type: "open_response",
        label: "Para cada escenario, indica si avanzas, banderas para el equipo de ingeniería, o descalificas:\n\nEscenario A: Techo de 8 años, orientado al sur, sin sombra, panel de 200A.\nAcción: _____________________________________________________________________________\n\nEscenario B: Techo de 22 años con algunas tejas rizadas, panel de 100A, árbol pequeño al lado.\nAcción: _____________________________________________________________________________\n\nEscenario C: Techo nuevo (2 años), panel de 200A, pero HOA y propietario no ha verificado las reglas.\nAcción: _____________________________________________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_3_7a: {
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
        items: [
"Ask natural, non-intrusive questions about roof age, electrical service, and site conditions that surface potential project risks before the survey.",
          "Identify homeowner signals that indicate HOA involvement, contractor history, or permitting sensitivities — and respond appropriately.",
          "Discover future load growth (EVs, pool equipment, additions) that may affect system sizing recommendations.",
          "Surface outage history and backup priorities in a way that opens the battery conversation naturally.",
          "Document technical discovery findings accurately so the survey team and operations have the context they need."
        ]
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
        items: [
"Roof Age & Condition: 'Do you know roughly how old your roof is?' Surfaces viability and ownership timeline.",
          "Electrical Panel: 'Do you know if your home has a 100-amp or 200-amp electrical panel?' Surfaces MPU risk.",
          "Outage History: 'How often do you lose power in your area?' Opens the battery conversation naturally.",
          "Future Load Growth: 'Are you planning to get an electric vehicle in the next few years?' Determines correct sizing.",
          "HOA & Permitting: 'Is your home part of an HOA?' Surfaces pipeline friction points.",
          "Detached Structures: 'Is that structure in the back a garage, a workshop — is that part of your property?' Surfaces scope complexity."
        ]
      },
      {
        title: "Section 3: The Documentation Habit",
        type: "text",
        content: "After every discovery conversation, reps should document:\n- Roof age/condition signals\n- Electrical panel type (if known)\n- Outage history and backup priority level\n- Future load plans (EV, additions, electrification)\n- HOA involvement\n- Competitive landscape\n- Any red flags for the survey team\n\nThis documentation is what makes the survey handoff effective."
      },
      {
        title: "Module 3.7A Slide Deck",
        type: "slides",
        content: "Slide deck for Technical Discovery Questions",
        slides: [
{
            title: "Technical Discovery Questions",
            content: "Bienvenido al Módulo 3.7A — Preguntas de Descubrimiento Técnico. El descubrimiento no es solo para descubrir motivación financiera. También se trata de identificar las condiciones técnicas que pueden descarrilar un trato en la visita técnica — antes de que pases cuarenta y cinco minutos diseñando un sistema y construyendo una propuesta. Este módulo te da las preguntas específicas que descubren el historial del techo, las preocupaciones estructurales, la carga eléctrica y los planes futuros — enmarcadas como debida diligencia experta, no como un interrogatorio. Un asesor que hace bien estas preguntas es un asesor que envía tratos limpios, evita órdenes de cambio y construye una reputación con el equipo de operaciones por calidad.",
            image: "/images/technical_discovery.png"
          },
          {
            title: "The Tone That Makes It Work",
            content: "La pregunta del ático es una de las herramientas de descubrimiento más valiosas y subutilizadas en ventas solares. Aquí está cómo formularla: \"¿Ha tenido alguna vez filtraciones en el techo, o alguien ha entrado recientemente a su ático para revisar la estructura?\" ¿Por qué es importante esto? El historial de filtraciones y la estructura débil de las vigas son dos de las razones más comunes por las que las visitas técnicas señalan una vivienda para revisión de ingeniería adicional o refuerzo estructural. Si lo descubres ahora, puedes establecer la expectativa o descalificar antes de la visita técnica — en lugar de perder el trato después de que el equipo de inspección regrese con malas noticias. Enmárcalo profesionalmente: \"Lo pregunto porque el equipo de instalación necesita sujetarse directamente a la estructura de su techo, y cualquier daño existente saldría en la visita técnica. Es mejor saberlo ahora.\""
          },
          {
            title: "Roof & Electrical Questions",
            content: "La factura de energía refleja lo que el propietario consume hoy — pero no lo que consumirá en el futuro. La pregunta de descubrimiento de carga eléctrica abre esa puerta: \"¿Está planeando adquirir un vehículo eléctrico en los próximos años? ¿O tiene una piscina, jacuzzi, o algo más que podría aumentar significativamente su consumo eléctrico?\" Si dicen que sí a cualquiera de estas, acabas de abrir una conversación sobre un sistema más grande. Más paneles, mejor producción, mayores ahorros — y una comisión más alta por un sistema que realmente sirve su vida real, no solo su factura actual. Posiciona esto como experiencia: \"Siempre lo pregunto porque muchos propietarios obtienen un sistema solar diseñado para hoy y luego se dan cuenta de que no es suficientemente grande después de que adquieren un vehículo eléctrico. Prefiero diseñarlo bien desde el principio.\""
          },
          {
            title: "Outage History & Future Loads",
            content: "El guión de prevención de SORPRESAS es cómo posicionas todas las preguntas de descubrimiento técnico como debida diligencia profesional en lugar de un guión de ventas. Antes de preguntar, establece el marco: \"Como parte de mi proceso estándar antes de construir una propuesta, siempre repaso algunas preguntas técnicas — solo para que nada sea una sorpresa durante la visita técnica. ¿Le parece si tomamos dos minutos?\" Esa única frase transforma lo que sigue. No los estás interrogando con preguntas. Estás haciendo lo que hace un consultor profesional — asegurándote de que los números que construyes estén basados en la realidad, no en suposiciones. Los propietarios casi siempre dicen que sí a este enfoque. Y cada respuesta honesta que te dan hace que tu propuesta sea más limpia, tu visita técnica más fluida y tu instalación más rápida."
          },
          {
            title: "HOA & Site Complexity",
            content: "Identifying pipeline friction (HOAs) and scope creep (detached structures)."
          },
          {
            title: "The Documentation Habit",
            content: "Why written notes protect deals; what specifically to capture."
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
          question: "¿Por qué es crucial preguntar sobre planes futuros para EVs o piscinas durante el descubrimiento técnico?",
          options: [
"Para aumentar el precio del contrato.",
            "Para dimensionar correctamente el sistema para necesidades futuras de energía, evitando un sistema subdimensionado después de la instalación.",
            "Porque la solar solo funciona con vehículos eléctricos.",
            "Es una regla de la empresa de servicios públicos."
          ],
          correctAnswerIndex: 2,
          explanation: "El consumo del propietario aumentará significativamente con un EV o piscina. Dimensionarlo correctamente ahora evita clientes insatisfechos después."
        },
        {
          id: "kc_3_7a_2",
          question: "¿Qué debes hacer si el panel eléctrico de un propietario tiene fusibles viejos en lugar de disyuntores modernos?",
          options: [
"Proceder con la instalación normalmente.",
            "Nota que se requerirá una actualización del panel principal (MPU) como parte del proyecto.",
            "Cancelar el acuerdo de inmediato.",
            "Decirle al propietario que lo reemplace él mismo."
          ],
          correctAnswerIndex: 2,
          explanation: "Los sistemas de fusibles antiguos no admiten sistemas solares modernos de manera segura y requieren una MPU (Main Panel Upgrade)."
        }
      ]
    }
  },
  mod_3_7b: {
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
        items: [
"1. El Panel Eléctrico Principal (con vista clara de la clasificación del Interruptor Principal).",
          "2. El Medidor de Servicios Públicos (incluyendo la pantalla digital o los marcadores).",
          "3. La Estructura del Ático (mostrando las vigas y el estado del entarimado).",
          "4. Los Alrededores del Hogar (mostrando árboles grandes u obstrucciones).",
          "5. La Vista de la Calle al Hogar (cómo ingresa el servicio eléctrico a la casa)."
        ]
      },
      {
        title: "Section 1: What the Site Survey Is Actually Validating",
        type: "list",
        content: "The survey team is confirming four things:",
        items: [
"Roof structural integrity and suitability.",
          "Shading analysis (quantifying exact production loss to finalize engineering).",
          "Electrical system compatibility (MPU check, inverter location).",
          "Site-specific installation planning (conduit routes, access constraints)."
        ]
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
        content: "Slide deck for Site Survey Prep for Reps",
        slides: [
{
            title: "Site Survey Prep for Reps",
            content: "Bienvenido al Módulo 3.7B — Preparación de Visita Técnica para Asesores. Un trato limpio es aquel que pasa por la visita técnica profesional sin órdenes de cambio, demoras ni rediseños. La calidad de tu documentación previa a la visita técnica afecta directamente qué tan rápido avanza el proyecto — y qué tan probable es que el propietario permanezca convencido durante el período de espera. Este módulo te enseña exactamente qué fotos e información recopilar antes de salir de cada cita. Los asesores que envían paquetes limpios obtienen instalaciones más rápidas, clientes más satisfechos y tasas de cancelación más bajas. Los asesores que envían paquetes descuidados crean demoras que frustran a los propietarios y generan contracargos.",
            image: "/images/site_survey_prep.png"
          },
          {
            title: "What the Survey Is Validating",
            content: "Hay cinco fotos críticas que todo asesor debe tomar antes de salir de la propiedad — sin excepciones. Foto uno: el tablero eléctrico principal, con la puerta abierta, con la calificación del interruptor principal claramente visible y todas las etiquetas de los interruptores legibles. Foto dos: la cara del medidor de la empresa de servicios — pantalla digital o diales — lo suficientemente cerca para leer el número del medidor. Foto tres: la estructura del ático si es accesible — mostrando el estado de las vigas y el tablero para el equipo de ingeniería. Foto cuatro: los alrededores de la vivienda — desde el patio trasero o la calle, capturando cualquier árbol, estructura o unidad de climatización que pueda causar sombra en el techo. Y foto cinco: la vista de la calle a la vivienda, mostrando cómo el cable de servicio de la empresa o el servicio subterráneo entra a la propiedad. Cinco fotos. Cada cita. Estas toman menos de tres minutos y evitan semanas de comunicación de ida y vuelta con el equipo de ingeniería."
          },
          {
            title: "The Pre-Survey Information Package",
            content: "Después de tomar las cinco fotos, tómate un momento para anotar los puntos de acceso al ático y la proximidad del tablero eléctrico al lugar donde probablemente se montará el inversor. El técnico de la visita necesita saber si el ático es accesible para la evaluación estructural, y si el tablero está en un lugar que hace que el trayecto del cableado solar sea sencillo o complejo. Si observaste un subtablero durante la visita, fotografíalo también. Cuanto más contexto le des al equipo de ingeniería antes de que llegue, más fluida y rápida será la visita — y menos sorpresas generarán órdenes de cambio."
          },
          {
            title: "Documenting Red Flags",
            content: "Antes de salir de cada cita, establece la expectativa del propietario sobre lo que viene a continuación. Aquí está el guión: \"El siguiente paso después de hoy es una visita técnica profesional. Un técnico capacitado vendrá a hacer una evaluación completa de su techo y sistema eléctrico. Esto generalmente ocurre dentro de siete a diez días hábiles. Necesitarán aproximadamente una hora, y necesitarán acceso a su tablero eléctrico y al ático si tiene uno. No necesita estar en casa durante toda la visita, pero sí necesitamos acceso. ¿Ese cronograma le funciona?\" Este guión de tres oraciones hace dos cosas: normaliza el siguiente paso para que el propietario no se sorprenda de que un desconocido llegue a su casa, y confirma su participación — lo que los mantiene involucrados en el proceso y mucho menos propensos a cancelar durante la espera."
          },
          {
            title: "How Poor Survey Prep Damages Deals",
            content: "Review scenarios: The MPU Surprise, The No-Show Survey, The Redesign."
          },
          {
            title: "The Pre-Survey SOP Checklist",
            content: "The complete rep workflow from close to post-survey follow-up."
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
          question: "¿Cuál es el propósito principal de una visita de encuesta del sitio técnico?",
          options: [
"Hacer la presentación de ventas nuevamente.",
            "Verificar el estado del techo, la estructura, el cableado eléctrico y la sombra para finalizar la ingeniería del sistema.",
            "Instalar los paneles solares.",
            "Inspeccionar los electrodomésticos del hogar."
          ],
          correctAnswerIndex: 1,
          explanation: "La encuesta del sitio recopila los datos físicos reales necesarios para que el equipo de ingeniería redacte los planes de construcción finales."
        },
        {
          id: "kc_3_7b_2",
          question: "¿Cómo debes preparar al propietario para la encuesta del sitio?",
          options: [
"Decirles que no necesitan estar allí.",
            "Asegurar que el topógrafo tenga acceso despejado al ático, al panel eléctrico y al techo, y que un adulto esté en casa.",
            "Decirles que tomará 5 minutos.",
            "Pedirles que limpien el techo ellos mismos."
          ],
          correctAnswerIndex: 2,
          explanation: "El acceso es clave. Si el topógrafo no puede ingresar al ático o al panel eléctrico, la visita fallará, retrasando el proyecto."
        }
      ]
    }
  },
  mod_3_8: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_8_1",
        type: "open_response",
        label: "Un propietario tiene una factura de $65/mes, uso de 380 kWh, y dice que está pensando en vender la casa en 18 meses. Escribe la conversación de descalificación completa:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.8 Knowledge Check",
      questions: [
{
          id: "kc_3_8_a",
          question: "¿Cuál fue el concepto principal cubierto en Módulo 3.8: Dominio de la Descalificación: Cuándo Retirarse?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 8."
        }
      ]
    }
  },
  mod_3_9: {
    id: "mod_3_9",
    title: "Módulo 3.9: Simulación Completa de Descubrimiento del Día 3",
    subtitle: "Correr una sesión de descubrimiento en el hogar completa y detallada con una pareja escéptica.",
    sections: [
{
        title: "Simulation Setup",
        type: "text",
        content: "En la simulación completa de descubrimiento de hoy, correrás un descubrimiento en hogar completo con un escenario desafiante. Una pareja casada: un tipo de personalidad que está entusiasmado y uno que es escéptico. Una factura eléctrica mensual de doscientos cuarenta dólares. Un techo recientemente reparado. Y una objeción oculta del cónyuge escéptico. Tu trabajo es controlar el ambiente, identificar ambos tipos de personalidad, hacer las doce preguntas de descubrimiento, usar espejeo y etiquetado para descubrir la objeción oculta, y calificar su disposición financiera — todo mientras mantienes energía tranquila de consultor."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_3_9_1",
        type: "open_response",
        label: "Debrief de la Simulación de Descubrimiento — ¿cuál era la objeción oculta? ¿Cómo la descubriste?",
        placeholder: "La objeción oculta era... La descubrí al preguntar...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 3.9 Knowledge Check",
      questions: [
{
          id: "kc_3_9_a",
          question: "¿Cuál fue el concepto principal cubierto en Simulación Completa de Descubrimiento del Día 3?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 9."
        }
      ]
    }
  },
  mod_4_1: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_1_1",
        type: "open_response",
        label: "Usa la factura de muestra de tu entrenador (o un escenario hipotético):\n\nFactura mensual actual: $____________\n\n| Año | Costo Mensual Proyectado (+6%/año) |\n|---|---|\n| Hoy | $____________ |\n| 5 años | $____________ |\n| 10 años | $____________ |\n| 15 años | $____________ |\n| 25 años | $____________ |\n| Total pagado en 25 años | $____________ |",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 4.1 Knowledge Check",
      questions: [
{
          id: "kc_4_1_a",
          question: "¿Cuál fue el concepto principal cubierto en ANÁLISIS PROFUNDO DE LA FACTURA DE SERVICIOS PÚBLICOS?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 1."
        }
      ]
    }
  },
  mod_4_1a: {
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
        items: [
"In flat-rate markets: excess solar may get credited at close to retail rate.",
          "In TOU markets with newer net metering programs: excess solar exported to the grid during off-peak hours may get credited at a lower rate than what the homeowner pays during evening peak.",
          "The rep should never assume what the homeowner's net metering credit rate is. Always verify with current program language."
        ]
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
        content: "Slide deck for Time-of-Use Rates & Utility Tariff Strategy",
        slides: [
{
            title: "Entendiendo las Tarifas de Uso por Tiempo (TOU)",
            content: "Bienvenido al Módulo 4.1A — Estructura y Flujo de la Presentación. Una presentación solar no es un volcado de datos. Es un viaje narrativo — y como cualquier viaje, necesita un camino claro de principio a fin. Cuando una presentación pierde estructura, los propietarios se pierden. Cuando se pierden, se sienten confundidos. Y los propietarios confundidos no firman. Este módulo te enseña el flujo de presentación de los cinco pilares que mantiene a los propietarios comprometidos, construye impulso lógico y lleva naturalmente a una decisión — sin presión, sin apresurarse y sin saltarse los pasos que construyen confianza.",
            image: "/images/utility_bill_autopsy.png"
          },
          {
            title: "La Factura Eléctrica No Es Simple",
            content: "Toda presentación solar sigue cinco pilares en secuencia. El pilar uno es la introducción personal y el re-descubrimiento — te reconectas con por qué el propietario está abierto a esta conversación y te reestableces como consultor. El pilar dos es el problema macro — las tarifas de energía, el monopolio corporativo, la inflación año tras año que el propietario no puede controlar. El pilar tres es la solución solar — cómo funciona, el equipo y el diseño personalizado para su hogar específico. El pilar cuatro es la historia de la empresa — por qué tu empresa, por qué ahora y por qué esto es una relación y no solo una transacción. Y el pilar cinco es la lógica financiera — pago mensual versus factura mensual, retorno de inversión y propiedad. Cada pilar se construye sobre el anterior. Omite uno y la base se agrieta.",
            image: "/images/utility_bill_autopsy.png"
          },
          {
            title: "Tarifa Plana vs. Tiempo de Uso (TOU)",
            content: "Las transiciones son el andamiaje invisible de una excelente presentación. Sin ellas, estás saltando de tema en tema y el propietario tiene que esforzarse para seguirte. Con ellas, cada sección fluye naturalmente hacia la siguiente. Una transición de poder es una frase específica que cierra un pilar y abre el siguiente — manteniendo el impulso. Un ejemplo: \"Ahora que puede ver exactamente lo que su techo es capaz de producir — déjeme mostrarle qué significa eso para su pago mensual.\" Esa única frase cierra la sección de diseño y abre la sección financiera sin pausa. Practica tus transiciones hasta que se sientan tan naturales como el contenido mismo. La presentación vive o muere en el tejido conectivo entre pilares.",
            image: "/images/tou_rate_chart.png"
          },
          {
            title: "Producción Solar vs. Picos de Costo de Servicios Públicos",
            content: "La gestión de la carga cognitiva consiste en saber cuánta información es demasiada. La mayoría de los asesores se equivocan en una dirección: sobre-explican. Se profundizan demasiado en las especificaciones cuando el propietario necesita un titular. Muestran demasiados números cuando una comparación clara cerraría el trato. La regla es esta — profundiza cuando el propietario señale que quiere profundidad, y mantente en un nivel alto cuando quieran claridad. Una personalidad de tipo Búho quiere la curva de degradación. Una personalidad de tipo Toro quiere el número del ahorro mensual. Una personalidad de tipo León quiere saber cómo reaccionaron sus vecinos cuando vieron el sistema. Lee el ambiente y adapta tu profundidad a tu audiencia.",
            image: "/images/production_demand_curve.png"
          },
          {
            title: "¿Qué Significa Esto Para Tus Ahorros?",
            content: "La transición asumida es el puente entre el diseño del sistema y la conversación de financiamiento. La mayoría de los asesores hace esta transición de manera torpe al pedir permiso: \"¿Estaría bien si habláramos de las opciones financieras?\" Esa pregunta pone al propietario en posición de decir que no. La transición asumida elimina esa opción. Después de haber confirmado que el diseño parece bien con un micro-cierre, avanza directamente: \"Bien — déjeme mostrarle los números y enseñarle exactamente cómo se ve esto en una base mensual.\" No estás pidiendo. Estás guiando. Ese cambio de pedir a guiar es lo que separa a los asesores que cierran de los que presentan y esperan.",
            image: "/images/savings_graph.png"
          },
          {
            title: "Realidad del Net Metering",
            content: "Qué es, qué no es, y por qué el encuadre correcto del lenguaje sobre el programa actual genera confianza.",
            image: "/images/ethics_shield.png"
          },
          {
            title: "La Conexión con la Batería",
            content: "Por qué el Tiempo de Uso hace que el almacenamiento sea financieramente relevante y cambie fundamentalmente el ROI.",
            image: "/images/solar_battery_setup.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_1a_1",
        type: "open_response",
        label: "Escribe una frase de transición entre cada par de pilares:\n\nPilar 1 → Pilar 2: _____________________________________________________________\n\nPilar 2 → Pilar 3: _____________________________________________________________\n\nPilar 3 → Pilar 4: _____________________________________________________________\n\nPilar 4 → Pilar 5: _____________________________________________________________",
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
          question: "¿Qué hace una batería en un mercado TOU (Tiempo de Uso)?",
          options: [
"Almacena energía cuando la electricidad es barata y alimenta la casa cuando es cara (pico).",
            "Produce más luz solar.",
            "Evita que los paneles se sobrecalienten.",
            "No tiene valor financiero."
          ],
          correctAnswerIndex: 1,
          explanation: "Esto es arbitraje de tarifas: almacenar energía barata o solar durante el día y usarla para evitar comprar energía de la red durante las horas pico caras."
        },
        {
          id: "kc_4_1a_2",
          question: "¿Cuál es la fase más importante del flujo de la presentación para generar confianza?",
          options: [
"El Cierre",
            "El Análisis de la Factura de Servicios Públicos",
            "La Propuesta Financiera",
            "La Comparación de Equipos"
          ],
          correctAnswerIndex: 1,
          explanation: "El análisis de la factura muestra que comprendes su situación y personalizas la solución a sus necesidades específicas."
        }
      ]
    }
  },
  mod_4_2: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_2_1",
        type: "open_response",
        label: "*(Usa los números de ejemplo de tu entrenador)*\n\nCosto del sistema: $______________\nMenos ITC (30%): - $______________\nMonto financiado neto: $______________\nPlazo del préstamo: ______ años\nPago mensual estimado: $______________\nFactura eléctrica actual del propietario: $______________\n¿El pago solar es menor que la factura actual? _______ Por: $______________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 4.2 Knowledge Check",
      questions: [
{
          id: "kc_4_2_a",
          question: "¿Cuál fue el concepto principal cubierto en ANÁLISIS PROFUNDO DEL FINANCIAMIENTO?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 2."
        }
      ]
    }
  },
  mod_4_2a: {
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
        items: [
"Federal incentives: Programs authorized at the national level. Verify current eligibility and terms.",
          "State incentives: Vary dramatically by state (e.g. tax credits, sales tax exemptions).",
          "Utility incentives: Rebates per watt installed, demand-response credits. Very time-sensitive.",
          "Local incentives: City or county programs. Highly variable."
        ]
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
        items: [
"CAN SAY: 'There are state, utility, and local incentive programs that may be available to you.'",
          "CAN SAY: 'A tax credit could reduce what you owe in taxes — your tax advisor would know how that applies.'",
          "CANNOT SAY: 'You'll get a big check back from the government.'",
          "CANNOT SAY: 'This basically pays for itself with the incentives.'"
        ]
      },
      {
        title: "Presentation Slides",
        type: "slides",
        content: "Slide deck for Incentive Strategy & Compliance",
        slides: [
{
            title: "Estrategia de Incentivos y Cumplimiento",
            content: "Bienvenido al Módulo 4.2A — Especificaciones Técnicas para No Técnicos. Los propietarios no compran especificaciones técnicas. Compran lo que esas especificaciones hacen por ellos. Nadie ha firmado nunca un contrato solar porque estaba impresionado por la frase \"silicio monocristalino de tipo N\". Firmaron porque entendieron qué hace ese panel por su hogar, su factura y su tranquilidad durante los próximos veinticinco años. Este módulo te enseña cómo traducir cada característica técnica en un beneficio para el propietario — en un lenguaje sencillo que llega al primer intento, no al tercero.",
            image: "/images/ethics_shield.png"
          },
          {
            title: "Cuatro Tipos de Incentivos",
            content: "La eficiencia del panel te indica cuánta electricidad produce un panel por pie cuadrado de espacio en el techo. Un panel de mayor eficiencia produce más energía usando menos área del techo. Aquí está cómo explicarlo: \"Estos paneles son más eficientes que la opción estándar — lo que significa que podemos ajustar el sistema correcto en su techo incluso si tiene espacio utilizable limitado.\" Has comunicado el beneficio sin mencionar un solo punto porcentual. Cuando un propietario tiene un techo más pequeño o parcialmente con sombra, la eficiencia se convierte en una ventaja tangible — y ahora entienden por qué. Siempre lidera con lo que hace, no con lo que es.",
            image: "/images/solar_incentives.png"
          },
          {
            title: "Crédito Fiscal vs. Reembolso: La Distinción",
            content: "El inversor es el equipo que convierte la electricidad de corriente directa de tu panel solar en la electricidad de corriente alterna que tu hogar realmente usa. Hay dos tipos principales. Los inversores de cadena convierten la producción de todos los paneles juntos como un grupo. Los microinversores convierten cada panel individualmente. Aquí está la analogía que lo hace claro para cada propietario: \"Piensa en los inversores de cadena como las luces de Navidad antiguas — si un bombillo se apaga, toda la cadena se oscurece. Los microinversores son como las luces LED más nuevas — cada bombillo es independiente. Si un panel recibe sombra, los demás siguen funcionando a máxima potencia.\" Esa analogía toma un concepto de ingeniería complejo y lo hace inmediatamente comprensible — y le da a los propietarios una razón para preocuparse por cuál tipo están obteniendo.",
            image: "/images/module_7_money_roadmap.png"
          },
          {
            title: "Lenguaje de Verificación Primero",
            content: "Cada panel solar tiene una garantía de rendimiento que garantiza cuánta energía seguirá produciendo después de veinticinco años. Esto se llama la tasa de degradación — el pequeño porcentaje de producción que pierde el panel cada año. Los paneles premium se degradan aproximadamente la mitad de un por ciento por año, lo que significa que después de veinticinco años todavía producen alrededor del ochenta y siete por ciento de su producción original. Aquí está cómo enmarcarlo: \"Este sistema viene con una garantía de rendimiento de veinticinco años. Incluso un cuarto de siglo desde ahora, estos paneles seguirán produciendo con alta eficiencia. Eso no es una afirmación de ventas — es una garantía escrita respaldada por el fabricante.\" La garantía es tu prueba. Úsala.",
            image: "/images/ethics_shield.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_2a_1",
        type: "open_response",
        label: "Escribe una explicación de beneficio para el propietario para cada característica técnica:\n\n\"Tecnología de celda de corte a la mitad (half-cut cell)\":",
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
          question: "¿Cuál es la diferencia entre kW (kilovatios) y kWh (kilovatios-hora)?",
          options: [
"kW es consumo total, kWh es potencia del panel.",
            "kW es capacidad/potencia (tamaño del sistema), kWh es la energía total producida o consumida con el tiempo.",
            "Son lo mismo.",
            "kW es para CA, kWh es para DC."
          ],
          correctAnswerIndex: 1,
          explanation: "Piensa en kW como la velocidad (velocímetro) y kWh como la distancia (odómetro)."
        },
        {
          id: "kc_4_2a_2",
          question: "¿Por qué es importante la tasa de degradación del panel solar al proyectar ahorros a 25 años?",
          options: [
"Los paneles producen más energía cada año.",
            "Los paneles pierden una pequeña cantidad de eficiencia cada año (p. ej., 0.5%), lo que reduce la producción futura.",
            "Determina el color del panel.",
            "Significa que los paneles deben reemplazarse en 10 años."
          ],
          correctAnswerIndex: 1,
          explanation: "La degradación significa que la producción del sistema disminuye ligeramente cada año. Las estimaciones precisas de ahorro deben tener esto en cuenta."
        }
      ]
    }
  },
  mod_4_2b: {
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
        content: "Slide deck for Financing Economics",
        slides: [
{
            title: "Efectivo, Préstamo, PPA, Arrendamiento",
            content: "Bienvenido al Módulo 4.2B — Comparación Competitiva de Equipos. En un mercado solar competitivo, los propietarios obtienen múltiples cotizaciones. Y a veces, la cotización de un competidor es más barata. Tu trabajo no es entrar en pánico, ni igualar el precio, ni hablar mal de la competencia. Tu trabajo es ayudar al propietario a hacer una comparación verdaderamente informada — una que vaya más allá del número inicial hacia el valor de veinticinco años que están comprando realmente. Este módulo te enseña cómo ganar frente a alternativas más baratas cambiando la conversación del precio al valor, usando un enfoque consultivo que te posiciona como el asesor en la sala.",
            image: "/images/module_7_money_roadmap.png"
          },
          {
            title: "Dos Categorías: Propiedad vs. Propiedad de Terceros",
            content: "No todos los paneles solares están construidos con el mismo estándar. El mercado tiene dos categorías amplias. El equipo de nivel básico típicamente tiene tasas de degradación más altas, garantías más cortas y un rendimiento de campo menos probado. El equipo de nivel premium — marcas como REC, Maxeon y Q-Cells — lleva garantías de rendimiento más largas, curvas de degradación más bajas y un respaldo del fabricante más sólido. La diferencia importa con el tiempo. Un sistema que se degrada dos por ciento más rápido por año produce significativamente menos electricidad durante veinticinco años — lo que se traduce directamente en menos ahorros. El propietario que eligió la cotización más barata puede descubrir que ahorró dinero al principio y perdió dinero durante la vida del sistema.",
            image: "/images/ownership_vs_lease.png"
          },
          {
            title: "El Camino de la Propiedad",
            content: "Cuando los propietarios mencionan marcas competidoras, conoce los diferenciadores clave. Los paneles REC tienen una sólida combinación de garantía de producto y rendimiento y son bien considerados por su eficiencia en entornos de sombra parcial. Maxeon — anteriormente SunPower — construye uno de los paneles más duraderos y eficientes del mercado, con una de las tasas de degradación más bajas disponibles. Q-Cells son una sólida opción de nivel medio con un sólido legado de ingeniería europea. Los paneles Tesla están integrados verticalmente y vienen con el ecosistema Tesla, pero son más adecuados para propietarios que ya están invertidos en esa plataforma. Cuando un propietario menciona un competidor, pregunta qué marca están cotizando — y luego ten lista una comparación específica y factual. Lo específico supera a lo genérico siempre.",
            image: "/images/solar_house.png"
          },
          {
            title: "El Camino de Terceros",
            content: "Cuando un propietario te dice que recibió una cotización de cinco u ocho mil dólares menos que la tuya, la transición consultiva suena así: \"Vale la pena revisar eso cuidadosamente — ¿puedo guiarlo a través de algunos puntos de comparación juntos?\" Luego repasa la lista de verificación: ¿Cuál es la marca y la calificación de eficiencia del panel? ¿Cuál es la garantía de degradación — ochenta o noventa por ciento a los veinticinco años? ¿Quién está haciendo realmente la instalación — la empresa directamente o un subcontratista? ¿Qué sistema de monitoreo está incluido? ¿Cuál es la política de cancelación y servicio si tienes un reclamo de garantía en el año doce? A menudo el propietario nunca ha recibido estas preguntas antes. Cuando los guías a través de la comparación honestamente, no estás atacando al competidor — estás demostrando tu experiencia. Y la experiencia es lo que gana el cierre.",
            image: "/images/module_4_objection_judo.png"
          },
          {
            title: "Guiando la Conversación",
            content: "Pregunta '¿Desea ser dueño del sistema?' y '¿Cuánto tiempo planea quedarse en esta casa?'",
            image: "/images/three_reasons_shield.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_2b_1",
        type: "open_response",
        label: "Un propietario dice: *\"Tesla me cotizó $5,000 menos con sus propios paneles.\"*\nEscribe tu respuesta completa usando el pivote consultivo:",
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
          question: "¿Cuál es el beneficio de un sistema de microinversores sobre un inversor de cadena central?",
          options: [
"Los microinversores son más baratos.",
            "Cada panel opera de forma independiente; si uno tiene sombra o falla, los demás siguen produciendo a máxima capacidad.",
            "Los microinversores no necesitan cableado.",
            "Hacen que los paneles se vean mejor."
          ],
          correctAnswerIndex: 1,
          explanation: "Los microinversores eliminan el punto único de falla y la pérdida por sombra de los sistemas de cadena."
        },
        {
          id: "kc_4_2b_2",
          question: "Si un cliente pregunta por qué recomiendas una marca específica de panel, la mejor respuesta se enfoca en:",
          options: [
"El precio más bajo.",
            "La garantía de rendimiento a 25 años, la confiabilidad del fabricante y la resistencia a la degradación.",
            "El diseño estético solamente.",
            "Decir que las demás marcas son malas."
          ],
          correctAnswerIndex: 1,
          explanation: "Enfócate en el valor a largo plazo, la estabilidad del fabricante y la garantía de producción real."
        }
      ]
    }
  },
  mod_4_3: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_3_1",
        type: "open_response",
        label: "Escribe una versión de la pila de valor enfocada en el pilar que más resuena con cada tipo:\n\nPara un Bull (Toro) — enfócate en el ROI financiero:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_4_4: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_4_1",
        type: "open_response",
        label: "Explica el net metering a un propietario que nunca ha escuchado el término. Sin diagramas, sin jerga:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_4_4a: {
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
        items: [
"NEM 3.0 entró en vigor en California el 14 de abril de 2023 para nuevas solicitudes de servicios eléctricos",
          "Los cambios clave:",
          "Los créditos de exportación cayeron de ~$0.25–0.35/kWh (NEM 2.0) a ~$0.04–0.08/kWh (NEM 3.0)",
          "Los créditos varían por hora del día y por servicio eléctrico",
          "El foco cambia de maximizar la producción total a maximizar el auto-consumo",
          "Lo que no cambió:",
          "El ITC federal todavía se aplica",
          "Los ahorros del auto-consumo todavía son robustos",
          "Los sistemas de NEM 2.0 existentes están protegidos por 20 años",
          "La implicación para las ventas: un sistema de solo solar en California bajo NEM 3.0 tiene ahorros significativamente reducidos vs. NEM 2.0 — la batería hace que vuelva a tener sentido"
        ]
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
        items: [
"El posicionamiento antiguo: \"La batería es para cuando el servicio eléctrico falla\"",
          "El posicionamiento nuevo: \"La batería es la herramienta de arbitraje tarifario que maximiza el ROI de tu inversión solar bajo NEM 3.0\"",
          "Cómo funciona el ciclo económico diario:",
          "Mediodía: el solar produce más de lo que el hogar necesita → almacena en la batería",
          "Tarde: el consumo del hogar sube, la producción solar cae → usa la batería en lugar de comprar a la red",
          "Noche: el hogar usa electricidad de la red, pero el precio pico ya pasó",
          "El resultado: el cliente maximiza el auto-consumo de energía solar de bajo costo, minimizando la compra de energía de alto costo de la red",
          "Beneficio secundario: sí, la batería también funciona como respaldo. Pero ese no es el argumento principal bajo NEM 3.0."
        ]
      },
      {
        title: "Sección 5: Criterios de Ajuste de la Batería (10 min)",
        type: "text",
        content: "Sección 5: Criterios de Ajuste de la Batería (10 min)"
      },
      {
        title: "Sección 6: Evitar la Sobre-Venta (5 min)",
        type: "slides",
        content: "Sección 6: Evitar la Sobre-Venta (5 min)",
        slides: [
{
            title: "Lógica de Ventas de Baterías y NEM 3.0",
            content: "Bienvenido al Módulo 4.4A — NEM 3.0 y Lógica de Ventas de Baterías. Las reglas de medición neta han cambiado significativamente en los principales mercados solares — y el asesor que entiende esos cambios construye credibilidad. El asesor que los ignora es quemado por un propietario que investigó en línea antes de la cita. En California y otros estados que han adoptado la NEM 3.0, la ecuación financiera para la energía solar ha cambiado. Este módulo te enseña exactamente qué cambió, por qué importa y cómo posicionar el almacenamiento de baterías como la solución — de manera natural, honesta y sin generar urgencia artificial que no existe.",
            image: "/images/net_metering_flow.png"
          },
          {
            title: "NEM 2.0 vs. NEM 3.0",
            content: "Bajo la estructura original de NEM 2.0, los propietarios recibían crédito por cada kilovatio-hora que exportaban a la red a tarifas cercanas al precio completo de venta. Un sistema solar únicamente podría cubrir casi todos los costos anuales de energía de un propietario a través de esos créditos. La NEM 3.0 cambió eso. En California, los créditos de exportación cayeron aproximadamente un setenta y cinco por ciento — de alrededor de treinta centavos por kilovatio-hora a tres o cinco centavos. Eso significa que un sistema solar sin baterías que exporta una gran parte de su producción durante el día gana mucho menos crédito de lo que solía. El modelo financiero no ha desaparecido — pero ha cambiado. Un asesor que entra a un mercado NEM 3.0 todavía presentando la matemática de NEM 2.0 perderá credibilidad en el momento en que el propietario revise sus números.",
            image: "/images/net_metering_flow.png"
          },
          {
            title: "Por Qué el Almacenamiento de Baterías es Ahora una Herramienta Financiera",
            content: "La solución a los bajos créditos de exportación es el almacenamiento de baterías. Una batería permite al propietario almacenar su producción solar excedente en lugar de exportarla a la red a pérdida. Usan esa energía almacenada por la noche — cuando de otro modo estarían tomando electricidad cara a tarifa de venta de la red. En un mercado NEM 3.0, esto no es un complemento de lujo. A menudo es el movimiento que vuelve a hacer viable el caso financiero para la energía solar. El argumento de venta es directo: \"Bajo la política actual de medición neta, exportar tu exceso de energía te da muy poco crédito. Una batería mantiene esa energía en tu hogar — así que en lugar de venderla barato y comprarla cara, estás usando tu propia energía durante todo el día.\"",
            image: "/images/solar_battery_setup.png"
          },
          {
            title: "Abriendo la Conversación sobre Baterías",
            content: "No todos los propietarios en un mercado NEM 3.0 necesitan una batería — y la honestidad aquí es lo que separa a un consultor de un vendedor. Un propietario con un perfil de carga muy desplazado en el tiempo — uno que usa la mayor parte de su energía por la tarde y por la noche — se beneficia más del almacenamiento de baterías. Un propietario que usa la mayor parte de su energía durante el día, mientras el sistema está produciendo activamente, tiene menos exportación y puede ver un beneficio más modesto. Tu trabajo es modelar ambos escenarios honestamente y mostrarle al propietario cómo se ven sus números específicos con y sin almacenamiento. Cuando los datos apoyan el almacenamiento de baterías, el propietario lo verá. Deja que los números hagan el trabajo.",
            image: "/images/savings_graph.png"
          },
          {
            title: "Manejo de Objeciones sobre Baterías",
            content: "¿Muy cara? ¿Momento inadecuado? ¿Respaldo de energía? Aborda cada una con el marco financiero.",
            image: "/images/module_4_objection_judo.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
      }
    ],
    quiz: {
      title: "Module 4.4A Knowledge Check",
      questions: [
{
          id: "kc_4_4a_1",
          question: "¿Cómo afecta NEM 3.0 al valor de la energía solar sin batería?",
          options: [
"Aumenta el valor de la solar sola.",
            "Reduce las tarifas de compensación por exportar energía solar a la red en aproximadamente un 70-80%, haciendo que la batería sea casi obligatoria para el ahorro.",
            "No tiene impacto.",
            "Elimina todos los cargos de conexión."
          ],
          correctAnswerIndex: 1,
          explanation: "Bajo NEM 3.0, exportar energía a la red se compensa a tarifas bajas. La batería te permite almacenar esa energía y usarla tú mismo."
        },
        {
          id: "kc_4_4a_2",
          question: "La mejor manera de abrir la conversación sobre baterías con un propietario bajo NEM 3.0 es:",
          options: [
"Enfocarse en la preparación para apagones.",
            "Liderar con la lógica económica: cómo la batería retiene el valor de la energía que producen para evitar tarifas de red caras.",
            "Decir que la batería es gratis.",
            "Ignorar el tema hasta el final."
          ],
          correctAnswerIndex: 1,
          explanation: "Liderar con economía muestra que entiendes la lógica de inversión bajo las nuevas reglas."
        }
      ]
    }
  },
  mod_4_5: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_5_1",
        type: "open_response",
        label: "Usando el software de diseño o una pantalla de ejemplo, practica narrar el diseño en voz alta. Escribe los puntos clave que cubrirás:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 4.5 Knowledge Check",
      questions: [
{
          id: "kc_4_5_a",
          question: "¿Cuál fue el concepto principal cubierto en DISEÑO DEL SISTEMA Y ESTIMACIONES DE PRODUCCIÓN?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 5."
        }
      ]
    }
  },
  mod_4_6: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_6_1",
        type: "open_response",
        label: "Practica una presentación completa de 60 minutos con un compañero. Grábala. Cronometra cada fase. ¿Qué fases tomaron demasiado tiempo?",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 4.6 Knowledge Check",
      questions: [
{
          id: "kc_4_6_a",
          question: "¿Cuál fue el concepto principal cubierto en EL FLUJO COMPLETO DE LA PRESENTACIÓN?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 6."
        }
      ]
    }
  },
  mod_4_7: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_4_7_1",
        type: "open_response",
        label: "Completa la hoja de reflexión del Día 4 antes de la sesión del Día 5.",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ]
  },
  mod_5_1: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_1_1",
        type: "open_response",
        label: "Aplica el sistema A.C.A. completo a cada objeción:\n\nObjeción: *\"No me interesa ahora mismo.\"*\n- Reconoce: _____________________________________________________________________________\n- Clarifica: _____________________________________________________________________________\n- Responde: _____________________________________________________________________________\n- Verifica: _____________________________________________________________________________\n\nObjeción: *\"Es demasiado dinero.\"*\n- Reconoce: _____________________________________________________________________________\n- Clarifica: _____________________________________________________________________________\n- Responde: _____________________________________________________________________________\n- Verifica: _____________________________________________________________________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 5.1 Knowledge Check",
      questions: [
{
          id: "kc_5_1_a",
          question: "¿Cuál fue el concepto principal cubierto en TÉCNICAS DE CIERRE AVANZADAS?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 1."
        }
      ]
    }
  },
  mod_5_2: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_2_1",
        type: "open_response",
        label: "*(Con compañero — el compañero elige 5 objeciones al azar de la lista. Tú respondes usando A.C.A.)*\n\nRonda 1 — Objeción elegida: _________________________ | ¿Cómo salió? _________________\n\nRonda 2 — Objeción elegida: _________________________ | ¿Cómo salió? _________________\n\nRonda 3 — Objeción elegida: _________________________ | ¿Cómo salió? _________________\n\nRonda 4 — Objeción elegida: _________________________ | ¿Cómo salió? _________________\n\nRonda 5 — Objeción elegida: _________________________ | ¿Cómo salió? _________________",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 5.2 Knowledge Check",
      questions: [
{
          id: "kc_5_2_a",
          question: "¿Cuál fue el concepto principal cubierto en MANEJO DE OBJECIONES?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 2."
        }
      ]
    }
  },
  mod_5_3: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_3_1",
        type: "open_response",
        label: "Escribe exactamente cómo harías la transición al cierre asertivo después de que el propietario diga: *\"Sí, todo esto tiene mucho sentido\"*:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 5.3 Knowledge Check",
      questions: [
{
          id: "kc_5_3_a",
          question: "¿Cuál fue el concepto principal cubierto en CIERRE PARA REFERIDOS Y REVISIONES?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 3."
        }
      ]
    }
  },
  mod_5_4: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_4_1",
        type: "open_response",
        label: "Escribe tu recorrido completo del contrato sección por sección, usando tus propias palabras:\n\nSección 1 — Descripción del sistema:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 5.4 Knowledge Check",
      questions: [
{
          id: "kc_5_4_a",
          question: "¿Cuál fue el concepto principal cubierto en GESTIÓN POST-VENTA?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 4."
        }
      ]
    }
  },
  mod_5_5: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_5_1",
        type: "open_response",
        label: "Escribe tu versión personal del script de inoculación post-cierre. Hazlo tuyo:",
        placeholder: "Escribe tu respuesta aquí...",
        lines: 2
      }
    ],
    quiz: {
      title: "Module 5.5 Knowledge Check",
      questions: [
{
          id: "kc_5_5_a",
          question: "¿Cuál fue el concepto principal cubierto en CONSTRUCCIÓN DE PIPELINE A LARGO PLAZO?",
          options: [
"El concepto enseñado en este módulo",
            "Un distractor incorrecto",
            "Otro concepto incorrecto",
            "Ninguno de los anteriores"
          ],
          correctAnswerIndex: 0,
          explanation: "Este es un marcador de posición autogenerado para la evaluación del módulo 5."
        }
      ]
    }
  },
  mod_5_5a: {
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
        items: [
"Domina la llamada de \"Inoculación de 48 Horas\"",
          "Entiende el protocolo de \"Actualización de Hitos\"",
          "Aprende cómo pedir una reseña de 5 estrellas antes de que comience la instalación",
          "Maneja el \"Gap del Silencio\" — mantén a los propietarios comprometidos durante el permitting",
          "Identifica los \"Momentos Emocionalmente Altos\" en el ciclo de vida del proyecto"
        ]
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
        items: [
"Moment 1 — The Silence After Signing: Anxiety builds if they hear nothing for weeks. Check in within 48 hours.",
          "Moment 2 — The Permit Surprise: No one warned them permits can take 6–10 weeks. Set this expectation explicitly at signing.",
          "Moment 3 — The PTO Confusion: The system is on the roof, but they can't turn it on. Explain PTO clearly before and after installation."
        ]
      },
      {
        title: "The Rep's Role After the Close",
        type: "list",
        content: "Understanding boundaries is essential. Reps who try to do too much create confusion; those who do too little lose deals.",
        items: [
"Rep Owns: Homeowner relationship, expectation management, early problem escalation, referral relationship cultivation.",
          "Operations Owns: Scheduling, design decisions, permit submission, installation scheduling, and inspection."
        ]
      },
      {
        title: "The 7-Touchpoint Model",
        type: "list",
        content: "Use the lifecycle as a proactive, offensive play to build referrals:",
        items: [
"1. Day of signing: Here's exactly what happens next.",
          "2. Site survey confirmation: Your site survey is confirmed.",
          "3. Post-site survey: Survey went well, design is being finalized.",
          "4. Permit submitted: Your permit is in.",
          "5. Install date confirmed: Great news — your install is scheduled!",
          "6. Day of/after install: Panels are up! Here's the last step.",
          "7. PTO received: You're officially live. Congratulations."
        ]
      },
      {
        title: "Module 5.5A Slide Deck",
        type: "slides",
        content: "",
        slides: [
{
            title: "El Ciclo de Vida del Proyecto Post-Venta",
            content: "Bienvenido al Módulo 5.5A — Guiones Avanzados de Cierre. El cierre no es una sola pregunta al final de una presentación. Es una serie de micro-compromisos que construyen impulso a lo largo de la conversación. Para el momento en que llegas a la decisión final, un propietario que ha estado diciendo sí a las cosas pequeñas tiene mucha más probabilidad de decir sí a la grande. Este módulo te da los marcos lingüísticos para mantener ese impulso — lenguaje que guía sin presionar y cierra sin forzar. El objetivo es un propietario que se sienta seguro, claro y en control — porque ese es el propietario que permanece convencido.",
            image: "/images/solar_project_pipeline.png"
          },
          {
            title: "Las Siete Etapas",
            content: "El cierre de elección es una de las herramientas más efectivas en los últimos diez minutos de una cita. En lugar de preguntar \"¿quiere seguir adelante?\" — que es una pregunta de sí o no que invita al no — le das al propietario una elección entre dos caminos que ambos llevan hacia adelante. \"Según lo que me ha dicho, recomendaría el préstamo a veinte años — pero algunos propietarios en su situación prefieren el plazo de diez años para un reembolso más rápido. ¿Cuál se alinea mejor con cómo le gusta manejar las decisiones financieras?\" No estás preguntando si quieren energía solar. Estás preguntando qué versión de la energía solar les queda mejor. Ese cambio de \"si\" a \"cuál\" es uno de los ajustes de lenguaje más valiosos que jamás harás.",
            image: "/images/solar_project_pipeline.png"
          },
          {
            title: "Dónde se Pierde Más Comúnmente la Confianza",
            content: "La urgencia debe ser real para ser efectiva. La urgencia fabricada — \"este trato termina el viernes\" o \"mi gerente solo aprobó este precio por hoy\" — destruye la confianza en el momento en que el propietario se da cuenta de que no es verdad. La urgencia real proviene de factores externos que puedes documentar. Reducciones escalonadas del crédito fiscal federal. Próximos aumentos de tarifas de energía que han sido anunciados públicamente. Acumulaciones estacionales de instalaciones que empujan los plazos. Cuando vinculas la urgencia a algo verificable, los propietarios responden a ello como información — no como presión. El guión suena así: \"El crédito federal está fijo al treinta por ciento hasta 2032, pero el tiempo de espera para instalaciones en esta área actualmente es de diez a doce semanas. Los propietarios que avanzan en las próximas semanas se adelantan a la prisa del verano.\"",
            image: "/images/trust_breaking_moments.png"
          },
          {
            title: "El Modelo de 7 Puntos de Contacto",
            content: "Las señales de compra son señales conductuales que te dicen que el propietario está listo para decidir — antes de que lo digan. Observa estas: inclinarse hacia adelante hacia la pantalla, hacer preguntas en tiempo futuro como \"¿cuándo comenzaría la instalación?\", mirar a su cónyuge con un asentimiento, preguntar sobre opciones de financiamiento sin que se les haya preguntado, o tomar tu tableta para ver el diseño más de cerca. Cuando ves tres o más de estas al mismo tiempo, reduce la velocidad. Deja de avanzar en tu presentación. Muévete directamente al cierre. El asesor que sigue presentando después de que el propietario ha decidido mentalmente es el asesor que los convence de regresar. Detecta la señal. Detén el discurso. Pide la decisión.",
            image: "/images/trust_breaking_moments.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_5a_1",
        type: "checklist",
        label: "Para cada situación, escribe un Cierre de Elección específico:\n\nSituación 1: Propietario indeciso entre pagar efectivo o financiamiento:",
        items: [
"1. Contract Signed",
          "2. Site Survey",
          "3. System Design",
          "4. Permitting",
          "5. Installation",
          "6. Inspection",
          "7. Permission to Operate (PTO)"
        ]
      },
      {
        id: "wb_5_5a_2",
        type: "open_response",
        label: "Escribe tu guion para establecer expectativas de cronograma en la mesa (en menos de 2 minutos):",
        placeholder: "El proceso tiene cuatro fases principales...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 5.5A Knowledge Check",
      questions: [
{
          id: "kc_5_5a_1",
          question: "¿Qué es un cierre de prueba?",
          options: [
"Un intento de forzar la firma del contrato.",
            "Una pregunta para verificar la temperatura de la venta y descubrir objeciones restantes antes de avanzar.",
            "Un descuento especial.",
            "Un período de prueba de 30 días."
          ],
          correctAnswerIndex: 1,
          explanation: "Las preguntas de cierre de prueba miden qué tan listo está el propietario para decidir."
        },
        {
          id: "kc_5_5a_2",
          question: "Cuando un propietario dice 'necesito pensarlo', la respuesta más efectiva es:",
          options: [
"Presionarlos para que firmen hoy de todos modos.",
            "Clarificar qué aspecto específico desean evaluar y abordar la duda de forma objetiva.",
            "Irse de inmediato.",
            "Ofrecer un descuento del 50%."
          ],
          correctAnswerIndex: 1,
          explanation: "Esta objeción suele ser una cortina de humo. Descubrir la duda real es el único camino."
        }
      ]
    }
  },
  mod_5_5b: {
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
        items: [
"Survey (Roof Condition): Roof has structural issues or lacks lifespan. (Repair/replace needed).",
          "Survey (Shade): Shade analysis reduces production potential. Set honest expectations.",
          "Design (Main Panel Upgrade - MPU): Electrical service panel cannot safely support solar. Significant surprise cost ($1,500–$5k).",
          "Permitting: Rejections require resubmission. HOAs may enforce separate aesthetic reviews.",
          "Financing: Lender stipulations like income verification must be cleared for funds.",
          "Installation & Inspection: Supply chain delays on panels/batteries. Inspection failures add weeks.",
          "PTO: Utility delays interconnect approval."
        ]
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
        items: [
"Normal: Permit corrections, HOA review, PTO wait, minor design adjustments.",
          "Escalation-Level: MPU discovered with no prior disclosure, failed inspection with no resolution path, explicit cancellation threats, competitor involvement."
        ]
      },
      {
        title: "Module 5.5B Slide Deck",
        type: "slides",
        content: "",
        slides: [
{
            title: "Problemas Comunes en la Línea de Instalación",
            content: "Bienvenido al Módulo 5.5B — Ciencia del Referido. El prospecto más caro que alguna vez trabajarás es el que compras o generas a través de prospección en frío. El prospecto más valioso que jamás recibirás es el que un cliente satisfecho te entrega. Los prospectos referidos cierran a dos o tres veces la tasa de los prospectos fríos porque la confianza ya está establecida antes de que digas una sola palabra. Este módulo te enseña la ciencia de construir referidos sistemáticamente — no preguntar cuando te acuerdas, sino construir un proceso repetible que genera cartera de clientes desde cada trato que cierras.",
            image: "/images/solar_pipeline_issues.png"
          },
          {
            title: "Actualización del Panel Principal (MPU)",
            content: "Hay tres ventanas mágicas para las solicitudes de referido — momentos específicos en la relación con el cliente cuando los propietarios están en máxima satisfacción y son más propensos a referir. La primera es inmediatamente después de que se firma el contrato — el momento de dopamina. \"Estoy muy emocionado por usted — esto marcará una verdadera diferencia. Si alguien que conoce ha estado quejándose de su factura eléctrica, me encantaría una presentación. ¿Puedo usar su nombre cuando me comunique?\" La segunda ventana es el día de instalación, cuando el equipo está en el techo y el proyecto es visualmente real. La tercera es el día de permiso de operación — cuando el sistema se activa por primera vez. Pide en las tres. Cada una produce diferentes referidos desde diferentes estados emocionales.",
            image: "/images/solar_pipeline_issues.png"
          },
          {
            title: "Reingreso del Competidor Durante Retrasos",
            content: "La solicitud de referido basada en confianza es diferente de una transaccional. Una solicitud transaccional suena así: \"¿Conoce a alguien que quiera energía solar?\" Una solicitud basada en confianza suena así: \"Tomó una decisión realmente inteligente hoy. No todos están en la situación correcta para la energía solar — pero usted era claramente el perfil adecuado. ¿Hay dos o tres personas en su vida que puedan estar en una situación similar? No les haré un discurso de ventas — solo tendré una conversación honesta de la misma manera que la tuve con usted.\" Ese enfoque hace tres cosas. Valida su decisión. Te posiciona como selectivo y confiable. Y hace que el referido se sienta como un favor a su amigo — no como un prospecto para un vendedor.",
            image: "/images/competitor_reentry.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_5b_1",
        type: "open_response",
        label: "Escribe el script exacto que usarás en cada una de las 3 ventanas:\n\nVentana 1 — Al Cierre:",
        placeholder: "Our team identified something that actually protects your home...",
        lines: 3
      },
      {
        id: "wb_5_5b_2",
        type: "open_response",
        label: "Describe un retraso común de permisos en tu mercado y cómo se lo explicarías a un propietario ansioso.",
        placeholder: "Hola [Nombre], la oficina de permisos de la ciudad está experimentando...",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 5.5B Knowledge Check",
      questions: [
{
          id: "kc_5_5b_1",
          question: "Si el panel de servicio eléctrico de un cliente de muestra es de 100 amperios, ¿por qué es importante?",
          options: [
"No tiene impacto.",
            "Es posible que deba actualizarse a 200 amperios para admitir el sistema de forma segura, agregando costo y tiempo.",
            "Siempre debe reemplazarse y el propietario ya lo sabía.",
            "Solo importa si agrega una batería."
          ],
          correctAnswerIndex: 1,
          explanation: "Una actualización del panel principal (MPU) es un costo sorpresa común en el embudo de ventas que los representantes deben aprender a encuadrar."
        },
        {
          id: "kc_5_5b_2",
          question: "Un competidor se acerca a un propietario cuyo proyecto ha estado retrasado 8 semanas. La respuesta más efectiva del representante es:",
          options: [
"Decirle al propietario que el competidor está mintiendo.",
            "Decirle al propietario que lo ignore.",
            "Ayudar al propietario a entender lo que realmente significa empezar de nuevo sin hablar mal del competidor.",
            "Ofrecer igualar el precio."
          ],
          correctAnswerIndex: 2,
          explanation: "Ayúdalos a entender el reinicio del cronograma sin sonar mezquino."
        }
      ]
    }
  },
  mod_5_5c: {
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
        items: [
"Homeowner name and deal/project ID",
          "Current project stage",
          "Specific factual issue description",
          "What the homeowner knows so far",
          "Homeowner's emotional state / cancellation risk",
          "What resolution the rep believes is needed",
          "Deadline constraint"
        ]
      },
      {
        title: "What to NOT Say",
        type: "list",
        content: "Reps who blame operations to homeowners create permanent trust damage.",
        items: [
"NOT: 'Operations is dropping the ball.' (Assigns blame internally)",
          "NOT: 'I'm not sure what's going on.' (Creates doubt)",
          "NOT: 'I'll see what I can do.' (Vague)",
          "SAY: 'I'm working on getting you a specific answer by [time].'",
          "SAY: 'I understand this isn't what you expected. I'm taking ownership of this right now.'"
        ]
      },
      {
        title: "The Four-Part Escalation Message",
        type: "text",
        content: "When escalating to a manager, give them a clear package:\n\n1. Who: Homeowner name, deal ID, stage\n2. What: Specific issue — factual\n3. State: Cancellation risk level\n4. Ask: Specific action required, by when"
      },
      {
        title: "Module 5.5C Slide Deck",
        type: "slides",
        content: "",
        slides: [
{
            title: "Resolución de Problemas y Rutas de Escalación",
            content: "Bienvenido al Módulo 5.5C — Comunicación Post-Venta y Reseñas. La firma del contrato no es el final de la venta. Es el comienzo de la experiencia del cliente. Entre el día en que un propietario firma y el día en que su sistema entra en funcionamiento, pueden pasar de sesenta a noventa días. Esos son sesenta a noventa días donde el silencio, la confusión o las expectativas no cumplidas pueden convertir un trato cerrado en una cancelación. Este módulo te enseña cómo gestionar esa ventana de manera proactiva — manteniendo a los propietarios comprometidos, previniendo el arrepentimiento del comprador y convirtiendo a clientes satisfechos en reseñas de cinco estrellas que generan tu próximo trato.",
            image: "/images/troubleshooting_escalation.png"
          },
          {
            title: "Lista de Verificación Pre-Escalación",
            content: "El arrepentimiento del comprador ocurre más a menudo en las primeras setenta y dos horas después de firmar un contrato. La emoción del propietario se desvanece, la duda se instala y si nadie se comunica para reforzar la decisión, esa duda crece hasta convertirse en una llamada de cancelación. La llamada de inoculación de cuarenta y ocho horas es tu herramienta de prevención. Dentro de las cuarenta y ocho horas de la firma, llama al propietario. Mantenlo breve y cálido: \"Hola, solo quería hacer seguimiento y asegurarme de que se siente bien con todo. ¿Tiene alguna pregunta que surgió desde que hablamos?\" Esta única llamada reduce las cancelaciones dramáticamente porque demuestra que todavía estás presente, que te importa y que vas a ser un socio confiable a lo largo del proceso.",
            image: "/images/troubleshooting_escalation.png"
          },
          {
            title: "El Mensaje de Escalación de Cuatro Partes",
            content: "A lo largo del proceso de instalación, hay varios momentos de hito donde una actualización proactiva de tu parte mantiene al propietario comprometido y confiado. Después de la visita técnica: infórmale que fue bien y cuál es el siguiente paso. Cuando se envíen los permisos: dile el cronograma. Cuando se aprueben los permisos: celébratelo con ellos — esto es progreso real. La semana antes de la instalación: confirma la fecha y recuérdales qué acceso necesitará el equipo. Después de la instalación: reconoce el hito y explica que la inspección es el siguiente paso. Después de la inspección y el permiso de operación: este es el mensaje de celebración. El sistema está activo. Envía el enlace de la aplicación de monitoreo. Pide la reseña. Cada mensaje de hito es un punto de contacto que construye lealtad y reduce el riesgo de cancelación.",
            image: "/images/troubleshooting_escalation.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_5c_1",
        type: "open_response",
        label: "Reescribe esto de manera profesional y responsable: \"Operaciones está muy retrasado en este momento. No es mi culpa.\"",
        placeholder: "Entiendo tu frustración por el retraso. Asumo la responsabilidad de...",
        lines: 3
      },
      {
        id: "wb_5_5c_2",
        type: "open_response",
        label: "Escribe un mensaje de escalación de cuatro partes para Maria Santos (espera de permiso en la Semana 9, frustrada):",
        placeholder: "1. Empatía: | 2. Hechos: | 3. Acción: | 4. Próxima actualización:",
        lines: 4
      }
    ],
    quiz: {
      title: "Module 5.5C Knowledge Check",
      questions: [
{
          id: "kc_5_5c_1",
          question: "El préstamo de un propietario ha sido marcado para verificación de ingresos adicional. ¿A qué equipo contactas?",
          options: [
"Ingeniería",
            "Permisos",
            "Finanzas / administración de contratos",
            "Instalación"
          ],
          correctAnswerIndex: 2,
          explanation: "Este es un problema financiero de Categoría C propiedad del departamento de finanzas."
        },
        {
          id: "kc_5_5c_2",
          question: "Un propietario está frustrado y el representante dice: 'No estoy seguro de qué está pasando, estoy tratando de averiguar'. Esta declaración:",
          options: [
"Es honesta y adecuada.",
            "Crea duda sin proporcionar tranquilidad.",
            "Genera confianza.",
            "Está bien si el propietario está tranquilo."
          ],
          correctAnswerIndex: 1,
          explanation: "Crea duda. Reemplázala con una acción específica y un plazo de devolución de llamada."
        }
      ]
    }
  },
  mod_5_5d: {
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
        items: [
"Step 1: Lead with acknowledgment, not defense.",
          "Step 2: State what happened factually.",
          "Step 3: Validate the impact.",
          "Step 4: Provide the next concrete step.",
          "Step 5: Reaffirm the relationship."
        ]
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
        items: [
"Bad: 'I'm trying to figure out why they haven't done this.'",
          "Good: 'We're working on this and I'm taking personal ownership of getting the answer.'"
        ]
      },
      {
        title: "Module 5.5D Slide Deck",
        type: "slides",
        content: "",
        slides: [
{
            title: "Comunicación para Salvar el Acuerdo",
            content: "Bienvenido al Módulo 5.5D — Gestión de Órdenes de Cambio. Los descubrimientos de ingeniería ocurren. Un técnico de visita encuentra que un techo puede soportar menos paneles de los planeados. Un requisito de actualización del tablero regresa de la inspección eléctrica. Una preocupación estructural cambia el diseño. Las órdenes de cambio son una parte normal del proceso de instalación solar — pero cómo entregues esa noticia determina si el propietario permanece convencido o cancela. Este módulo te enseña cómo comunicar malas noticias técnicas de una manera que preserve la relación, mantenga la confianza y le dé al propietario un camino claro hacia adelante.",
            image: "/images/ghosting_homeowner.png"
          },
          {
            title: "Manejo de la Pérdida de Contacto (Ghosting) del Propietario",
            content: "El sándwich de malas noticias y buenas noticias es tu estructura principal de entrega para las órdenes de cambio. Nunca lideres con el costo. Comienza reconociendo la situación honestamente, luego explica qué significa, luego gira hacia la solución. Aquí hay un ejemplo: \"Entonces recibí noticias de nuestro equipo de ingeniería después de la visita técnica — hay algo que quiero explicarle.\" Ese es el reconocimiento. Luego: \"Encontraron que la superficie del techo orientada al sur puede soportar diez paneles en lugar de doce — lo que reduce ligeramente la producción anual del sistema.\" Esa es la información honesta. Luego inmediatamente: \"La buena noticia es que el diseño actualizado aún cubre aproximadamente el noventa por ciento de su consumo — y su proyección de ahorro solo se ajusta en aproximadamente doce dólares al mes. Aquí está cómo se ve la propuesta actualizada.\" Eso es el camino hacia adelante. Malas noticias primero. Contexto segundo. Solución tercero.",
            image: "/images/ghosting_homeowner.png"
          },
          {
            title: "Resistencia del Cónyuge y de la Familia",
            content: "Si la orden de cambio implica un costo adicional — como una actualización del tablero principal o un refuerzo estructural — el enfoque se vuelve aún más importante. Nunca presentes el costo sin el contexto de por qué importa. \"El equipo de visita técnica identificó que su tablero es un servicio de cien amperios. Para conectar el sistema solar de manera segura, necesita actualizarse a doscientos amperios. Eso es un costo adicional, pero aquí está la parte importante — esa actualización es algo que probablemente su hogar necesita independientemente de la energía solar. Esencialmente está obteniendo la actualización eléctrica que su hogar necesita como parte del mismo proyecto, en lugar de lidiar con ello por separado más adelante.\" Estás reenmarcando un costo adicional como una mejora legítima para el hogar. Ese enfoque es honesto y ayuda al propietario a ver valor en lugar de solo un número.",
            image: "/images/trust_breaking_moments.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
        label: "Un técnico descubre que se requiere una actualización del panel principal (MPU), lo que agrega $2,500 al proyecto. Escribe tu guion para entregar esta orden de cambio.",
        placeholder: "Tengo una actualización del equipo de ingeniería...",
        lines: 3
      }
    ],
    quiz: {
      title: "Module 5.5D Knowledge Check",
      questions: [
{
          id: "kc_5_5d_1",
          question: "Un propietario no ha respondido a dos llamadas y un mensaje de texto en 10 días. ¿Mejor acción a seguir?",
          options: [
"Llamar todos los días.",
            "Enviar un tercer mensaje cálido y de baja presión reconociendo la falta de comunicación.",
            "Marcarlo como perdido.",
            "Escalar inmediatamente al gerente."
          ],
          correctAnswerIndex: 1,
          explanation: "El tercer contacto es el intento final, directo pero compasivo."
        },
        {
          id: "kc_5_5d_2",
          question: "El cónyuge de un propietario se muestra resistente después de la firma. El mejor enfoque es:",
          options: [
"Volver a presentar todo el discurso.",
            "Reducir el precio.",
            "Pedir comprender la preocupación específica y ofrecer una conversación enfocada de baja presión.",
            "Decirle al propietario firmado que lo resuelva él mismo."
          ],
          correctAnswerIndex: 2,
          explanation: "Nunca vuelvas a cerrar. Es abrumador. Simplemente aborda sus dudas persistentes específicas con objetividad."
        }
      ]
    }
  },
  mod_5_6: {
    id: "mod_5_6",
    title: "Módulo 5.6: Cierre del Día 5 y Tarea",
    subtitle: "Estudiar las diez respuestas de objeciones de cierre y practicar con simulaciones de citas completas.",
    sections: [
{
        title: "Study and Practice Tonight",
        type: "text",
        content: "Esta noche: estudia todas las diez respuestas de objeciones hasta que puedas entregar cada una con fluidez sin notas. Luego corre una simulación de cita completa — toca la puerta, descubrimiento, presentación, cierre — con un amigo o pareja jugando al propietario difícil. Finalmente, revisa la vista previa del Día Seis. Mañana construirás tu sistema de referidos, rastrearás tu desempeño como un profesional y tomarás tu examen de certificación. Para el final del Día Seis, estarás listo para el campo. Entra mañana completamente descansado y enfocado.# DÍA 6: Referidos, Desempeño y Éxito a Largo Plazo"
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_5_6_1",
        type: "open_response",
        label: "Lista de Verificación de Prevención de Cancelaciones — escribe el guion de la llamada de inoculación de 48 horas en tus propias palabras.",
        placeholder: "Hola [Nombre], te llamo para felicitarte y...",
        lines: 2
      }
    ]
  },
  mod_6_1: {
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
        items: [
"Paso uno: planta la semilla en el cierre. Antes de salir: el mayor agradecimiento es un referido. Si alguien que conoces ha estado quejándose de su factura eléctrica, me encantaría una introducción.",
          "Paso dos: activa post-instalación. Cuando su sistema entre en funcionamiento, envía un mensaje emocionado y pregunta: ¿a quién es la primera persona a la que le querrías contar esto?",
          "Paso tres: seguimiento personalizado. Contacta a cada referido por nombre, mencionando la conexión mutua. Un alcance de referido que dice \"tu vecino mencionó que has estado pensando en solar\" abre a un nivel completamente diferente que una llamada fría."
        ]
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
        items: [
"Log every referral name and contact in CRM within 24 hours",
          "Tag the source customer so you can report back ('Your neighbor John said yes!')",
          "Set a 3-day follow-up task for every referral received",
          "Send a handwritten thank-you to any customer whose referral closes"
        ]
      },
      {
        title: "Simulation: Referral Ask at Trigger 1",
        type: "simulation",
        scenarioId: "post_install_patricia",
        content: "Practice the post-signature referral conversation with post_install_patricia."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_6_1_1",
        type: "open_response",
        label: "Escribe los 3 scripts de referencias que usarás en cada paso. Hazlos completamente tuyos:\n\nPaso 1 — Al Cierre:",
        placeholder: "Start with: 'Most of my business...'",
        lines: 4
      },
      {
        id: "wb_6_1_2",
        type: "checklist",
        label: "Lista de Verificación de Preparación de Referidos — marca las tareas completadas:",
        items: [
"He redactado mi script de texto post-instalación",
          "He añadido recordatorios de solicitud de referidos en mi calendario",
          "He practicado la solicitud de referidos en 3 pasos",
          "Tengo lista mi hoja de beneficios de referidos para el cliente"
        ]
      }
    ]
  },
  mod_6_1a: {
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
        items: [
"Trigger 1 — At the Close: The homeowner is most excited and committed immediately after signing. Ask: 'Who in your neighborhood do you think would also benefit from this?' Keep it casual and unthreatening.",
          "Trigger 2 — Post-Install: Panels are on the roof. Neighbors can see them. Homeowner pride is at its peak. Call to celebrate — and ask who's been asking about the panels.",
          "Trigger 3 — First Bill: The homeowner sees their first reduced bill or credits. Emotion is real. This is the best time for a specific, name-based referral request."
        ]
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
        items: [
"At Close: 'Before I head out — is there anyone in your neighborhood or circle you think would appreciate knowing about this? I only work with people who are genuinely good fits, so I'd love a warm intro.'",
          "Post-Install: 'Your system looks great out there! I've had a few reps ask me about neighborhoods like yours — has anyone asked you about the panels yet? I'd love to connect with them.'",
          "First Bill: 'That's a real result — congratulations. You know what's funny? The people who benefit most from solar are usually the people around you who have similar bills. Is there anyone specific you'd want to pass my number to?'"
        ]
      },
      {
        title: "Sección 2 — Los Tres Momentos de Referido en el Ciclo de Vida del Proyecto",
        type: "text",
        content: "Más allá del Día 0, hay tres momentos naturales adicionales en el proceso donde las conversaciones de referido surgen orgánicamente — sin que el rep tenga que forzarlas."
      },
      {
        title: "Sección 3 — Momentos de Alta Compra Emocional: Leyendo el Ambiente",
        type: "slides",
        content: "Las solicitudes de referido solo funcionan cuando el clima emocional es el correcto. Los reps que preguntan durante la fricción del proceso — durante un retraso de permisos, después de una sorpresa de MPU, en medio de una queja del propietario — dañan tanto la relación de referido como la relación principal.",
        slides: [
{
            title: "Arquitectura del Sistema de Referidos",
            content: "Bienvenido al Módulo 6.1A — Arquitectura del Sistema de Referidos. La diferencia entre un asesor que obtiene un referido por diez tratos y un asesor que obtiene tres a cinco no es la personalidad — es la estructura. La mayoría de los asesores tratan los referidos como una reacción. Preguntan cuando se acuerdan o cuando el propietario parece particularmente satisfecho. Un asesor sistemático incorpora las solicitudes de referido en cada etapa de la relación con el cliente como un proceso estándar — no como algo adicional. Este módulo te da esa arquitectura: tres momentos de activación, guiones probados y un proceso de seguimiento que se multiplica con el tiempo.",
            image: "/images/referral_engine.png"
          },
          {
            title: "Los Tres Momentos de Activación",
            content: "Hay tres momentos de activación donde las solicitudes de referido son más naturales y más efectivas. El primero es inmediatamente después del cierre — el momento de dopamina, cuando el propietario está emocionado y seguro en su decisión. El segundo es el día de instalación, cuando el proyecto es físicamente real y visible para el vecindario. Los vecinos notan a un equipo en el techo. Hacen preguntas. Tu propietario se convierte en embajador de marca. El tercero es el día del permiso de operación — cuando el sistema se activa y el propietario ve la producción en tiempo real en su aplicación de monitoreo por primera vez. Ese momento de \"realmente está funcionando\" crea un entusiasmo máximo. Pide en los tres. Diferentes propietarios responderán en diferentes etapas.",
            image: "/images/referral_engine.png"
          },
          {
            title: "La Arquitectura de Referidos",
            content: "El protocolo de introducción de referido es cómo conviertes un nombre en un alcance cálido. Cuando un propietario te da un referido, siempre pide permiso para usar su nombre: \"¿Puedo mencionar que usted sugirió que me comunicara?\" Luego comunícate personalmente — no con una plantilla genérica de la empresa. \"Hola Sarah — acabo de ayudar a su vecino, los González en la Calle Maple — me mencionaron que usted podría estar en una situación similar con su factura de energía y me sugirieron que la llamara. No estoy aquí para hacer un discurso de ventas — solo para tener la misma conversación honesta que tuve con ellos.\" Ese mensaje se abre a un nivel completamente diferente que cualquier alcance en frío. La confianza se toma prestada de la relación que ya existe.",
            image: "/images/referral_engine.png"
          },
          {
            title: "Guiones de Solicitud de Referidos",
            content: "Con el tiempo, un proceso sistemático de referidos crea una cartera de clientes que se multiplica. El asesor que cierra diez tratos al mes con una tasa de referidos cero tiene que prospectar en frío para cada nuevo prospecto. El asesor que cierra diez tratos al mes y genera dos referidos por trato entra al mes dos con veinte prospectos cálidos ya en su cartera — antes de haber tocado una sola puerta. La matemática se multiplica: más referidos significan prospectos más cálidos, los prospectos más cálidos cierran más rápido y a tasas más altas, las tasas de cierre más altas generan más clientes, más clientes generan más referidos. Esta es la rueda que separa a los asesores que ganan cuarenta mil dólares al año de los asesores que ganan cuarenta mil dólares al mes. Construye el sistema desde el primer trato.",
            image: "/images/referral_engine.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
      }
    ],
    quiz: {
      title: "Module 6.1A Knowledge Check",
      questions: [
{
          id: "kc_6_1a_1",
          question: "¿Cuál de los tres momentos de activación de referidos suele convertir a la tasa más alta?",
          options: [
"En el cierre — el propietario está comprometido y emocionado.",
            "Post-instalación — los paneles son visibles y los vecinos preguntan.",
            "Primer recibo — el propietario ve resultados financieros reales y la emoción es máxima.",
            "Los tres convierten por igual."
          ],
          correctAnswerIndex: 2,
          explanation: "El momento del primer recibo produce la respuesta emocional más fuerte ligada a una prueba financiera real."
        },
        {
          id: "kc_6_1a_2",
          question: "¿Cuál es el paso más importante que los representantes omiten y que arruina la conversión de referidos?",
          options: [
"Pedir el referido.",
            "Hacer el seguimiento dentro de las 24 horas posteriores a recibir un nombre.",
            "Enviar una tarjeta de agradecimiento.",
            "Pedir una reseña de Google al mismo tiempo."
          ],
          correctAnswerIndex: 1,
          explanation: "La velocidad es conversión. Un nombre recibido y no contactado en 24 horas pierde más del 50% de su potencial de conversión."
        }
      ]
    }
  },
  mod_6_2: {
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
        items: [
"Best time: Within 48 hours of system installation — enthusiasm is highest",
          "Second best: Day of first low utility bill — proof triggers gratitude",
          "Method: Text with a direct link — never just verbal. Remove friction.",
          "Follow-up once if no review after 5 days — 'Just making sure the link worked'"
        ]
      },
      {
        title: "The Review Request Message",
        type: "quote",
        content: "\"Hey [Name], it was a pleasure working with you. If you have 2 minutes, your review would mean the world to me — it helps families in [City] find a trustworthy rep. Here's the direct link: [Google Review Link]. Thanks for trusting me with your home.\""
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_6_2_1",
        type: "open_response",
        label: "¿Cómo vas a pedir la reseña de Google a cada cliente? Escribe el mensaje de texto exacto que enviarás:\n\n*Asunto: Reseña de Google — [COMPANY_NAME]*",
        placeholder: "Hey [Name]...",
        lines: 3
      }
    ]
  },
  mod_6_2a: {
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
        items: [
"Best time: Within 48 hours of PTO — the homeowner is officially live, the emotional peak is real, and the experience is fresh.",
          "Good time: Post-install, when panels are visible and the homeowner is proud.",
          "Avoid: During pipeline issues, delays, or any moment of friction. A forced review during a bad experience creates a bad review."
        ]
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
        items: [
"Google Business Profile: Highest priority. Drives local search visibility and shows in Maps results.",
          "EnergySage: Industry-specific solar comparison site. High-intent prospects research here.",
          "Yelp: Secondary. Relevant in some markets.",
          "Facebook: Useful for local community groups where solar decisions are discussed."
        ]
      },
      {
        title: "Los seis hitos que cada rep debe rastrear para cada trato activo:",
        type: "list",
        content: "1. Encuesta completada — Fecha completada, cualquier hallazgo marcado por el equipo de encuesta 2. Diseño aprobado — Fecha finalizada, cualquier cambio de diseño de la propuesta original 3. Permiso presentado — Fecha presentada, jurisdicción, tiempo de procesamiento esperado 4. Permiso aprobado — Fecha aprobada, cualquier corrección requerida antes de la aprobación 5. Instalación programada — Fecha programada, propietario confirmado 6. PTO recibido — Fecha recibida, propietario notificado, check-in de 30 días programado",
        items: [
"Before/after bill photos (with homeowner permission) — real numbers convert skeptics.",
          "Video testimonials — 30 seconds at PTO asking 'what was the experience like?' is gold.",
          "Neighborhood installs map — showing homeowners that their neighbors have already gone solar accelerates decisions.",
          "Photo of install day — a crew on a roof is powerful visual proof."
        ]
      },
      {
        title: "La herramienta de seguimiento más simple:",
        type: "slides",
        content: "Un rep no necesita un sistema sofisticado. Una hoja de cálculo con una fila por trato activo y columnas para cada fecha de hito es suficiente. Lo que importa es que se actualice consistentemente — no que sea elaborada.",
        slides: [
{
            title: "Sistemas de Generación de Reseñas y Prueba Social",
            content: "Bienvenido al Módulo 6.2A — Generación de Reseñas y Sistemas de Prueba Social. El noventa por ciento de los propietarios revisa las reseñas de Google antes de devolver la llamada de un asesor solar. Un perfil con cuarenta y siete reseñas de cinco estrellas y un perfil con doce reseñas no son competidores cercanos — están en conversaciones completamente diferentes. Las reseñas no son un problema del equipo de marketing. Son responsabilidad del asesor. Cada propietario satisfecho que no deja una reseña es una oportunidad de generación de prospectos perdida. Este módulo te enseña cuándo pedir, cómo pedir y cómo usar la prueba social activamente en el campo para cerrar tratos que de otra manera no habrías cerrado.",
            image: "/images/social_proof.png"
          },
          {
            title: "Cuándo Pedir",
            content: "El mejor momento para pedir una reseña es en un punto emocional alto en el recorrido del cliente — no semanas después de la instalación cuando la novedad se ha desvanecido. Hay tres puntos altos. El primero es inmediatamente después de que se firma el contrato. El segundo es después de que se completa la instalación. El tercero es después del permiso de operación, cuando el sistema se activa. En cada momento, el propietario está experimentando satisfacción real. La solicitud debe ser sin fricción y personal: \"Si su experiencia conmigo hasta ahora ha sido buena, ¿estaría dispuesto a tomarse sesenta segundos para dejarnos una reseña? Le enviaré el enlace directo ahora mismo.\" Envía el enlace de inmediato — en la sala, antes de salir del camino de entrada. La solicitud tardía equivale a reseña perdida.",
            image: "/images/social_proof.png"
          },
          {
            title: "El Guion de Solicitud de Reseña",
            content: "Una vez que tengas reseñas, úsalas activamente en el campo. Captura pantalla de reseñas positivas — especialmente las de propietarios en tu territorio — y guárdalas en tu presentación en la tableta. Cuando estés en una puerta en un vecindario donde tienes una instalación, di: \"Aquí está lo que dijo Juan después de que instalamos su sistema dos calles más allá.\" Los testimonios son prueba social que ninguna especificación de producto ni cálculo de ahorros puede reemplazar. Responden la pregunta no dicha más profunda del propietario: \"¿Es esto real? ¿Funcionó para alguien como yo?\" El nombre de un vecino en una reseña responde esa pregunta de una manera en que nada de lo que digas sobre ti mismo puede. Construye tu biblioteca de reseñas intencionalmente y despliégala estratégicamente.",
            image: "/images/social_proof.png"
          },
          {
            title: "Construyendo la Pila de Prueba Social Completa",
            content: "Los carteles de patio son prueba social pasiva a escala. Un cartel de patio en una instalación completada le dice a cada auto que conduce por esa calle, a cada vecino que pasea a su perro, y a cada propietario que mira por su ventana — alguien en esta calle tomó una decisión. Crea prueba social sin que estés presente. Pide a cada propietario un cartel de patio de treinta días: \"¿Le importaría si dejamos un cartel en su jardín por aproximadamente un mes? Ayuda a sus vecinos a ver que alguien en el área se cambió a energía solar, y nos ayuda a nosotros — es una situación de beneficio mutuo.\" La mayoría de los propietarios dice que sí. Un cartel de patio típicamente genera de dos a cinco conversaciones adicionales de prospectos en el área circundante. Combinado con tus reseñas de Google, esto convierte una instalación en un impulso de momentum en el vecindario que no requiere prospección en frío adicional.",
            image: "/images/social_proof.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
      }
    ],
    quiz: {
      title: "Module 6.2A Knowledge Check",
      questions: [
{
          id: "kc_6_2a_1",
          question: "¿Cuál es la plataforma de reseñas de mayor prioridad para un representante solar?",
          options: [
"Yelp",
            "Facebook",
            "Perfil de Empresa en Google",
            "EnergySage"
          ],
          correctAnswerIndex: 2,
          explanation: "El Perfil de Empresa en Google impulsa la visibilidad en búsquedas locales y Google Maps."
        },
        {
          id: "kc_6_2a_2",
          question: "¿Cuál es el mayor error que cometen los representantes al pedir reseñas?",
          options: [
"Pedir demasiado temprano.",
            "No enviar un enlace directo, obligando al propietario a buscar la página él mismo.",
            "Pedir con demasiada frecuencia.",
            "Pedir en el PTO en lugar de en el cierre."
          ],
          correctAnswerIndex: 1,
          explanation: "La fricción mata la acción. Un enlace directo elimina las barreras."
        }
      ]
    }
  },
  mod_6_3: {
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
        items: [
"Schedule a free system performance review — build face time",
          "Identify any service needs and resolve them — prove your value",
          "Ask for referrals after resolving any issue — gratitude converts",
          "Add them to your review request sequence if they haven't left one"
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_6_3_1",
        type: "open_response",
        label: "*(Completa al final de cada semana de trabajo)*\n\nSemana del: _______________________________\n\n| Métrica | Meta | Real | Diferencia |\n|---|---|---|---|\n| Puertas tocadas | 100–150 | _____ | _____ |\n| Conversaciones | ~40 | _____ | _____ |\n| Citas agendadas | 10–15 | _____ | _____ |\n| Citas realizadas | 8–12 | _____ | _____ |\n| Propuestas presentadas | 5–8 | _____ | _____ |\n| Acuerdos cerrados | 1–3 | _____ | _____ |\n\n¿Dónde está la fuga principal en mi embudo esta semana?",
        placeholder: "1. [Name] ΓÇö Note: ...",
        lines: 6
      }
    ]
  },
  mod_6_3a: {
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
        items: [
"They already trust the company enough to have purchased.",
          "They are likely to refer neighbors if their experience has been positive.",
          "They are upgrade candidates (battery, EV charger, system expansion).",
          "They are cancellation risks if they feel ignored — especially during issues.",
          "Reactivating 5 orphan owners can generate 10–15 referral conversations."
        ]
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
        items: [
"Riesgoso: \"Ahorrarás $200 al mes con este sistema.\"",
          "Corregido: \"Basado en tu factura actual y estructura tarifaria, los ahorros mensuales estimados son alrededor de $200 — aunque los ahorros reales dependen de tu uso, cambios de tarifa y el diseño final del sistema.\"",
          "Riesgoso: \"Recibirás el 30% de vuelta del gobierno — eso es básicamente un tercio del sistema gratis.\"",
          "Corregido: \"Hay programas de incentivos que pueden aplicar a tu situación — el crédito fiscal federal es uno de los más significativos. Cuánto te beneficias depende de tu situación fiscal específica, y tu contador sería la persona correcta para confirmarlo.\"",
          "Riesgoso: \"Tu período de recuperación de inversión es exactamente 8.3 años.\"",
          "Corregido: \"Basado en los supuestos con los que estamos trabajando — tu tarifa actual, el diseño del sistema y los términos de financiamiento — el período de recuperación de inversión estimado está en el rango de 8 a 10 años. Si las tarifas del servicio eléctrico continúan la tendencia que hemos visto en esta área, podría ser más corto.\"",
          "Riesgoso: \"Tus paneles producen energía justo cuando el servicio eléctrico cobra tarifas pico, así que estás ahorrando a la tarifa más alta.\"",
          "Corregido: \"El solar produce la mayor parte de su energía alrededor del mediodía — que en realidad es antes de la ventana de tarifa pico en la mayoría de los planes TOU. Por eso una batería puede agregar valor financiero real en tu situación.\""
        ]
      },
      {
        title: "La rúbrica de cuatro preguntas:",
        type: "slides",
        content: "Puntuación propia: 0 (sí, hice afirmaciones no verificables) / 1 (usé lenguaje calificador apropiado) / 2 (me mantuve completamente dentro de datos verificados) Puntuación propia: 0 (sí, usé lenguaje desactualizado) / 1 (no estoy seguro — necesito verificar) / 2 (usé lenguaje actual y preciso en todo momento) Puntuación propia: 0 (sí, adiviné algo de lo que no estaba seguro) / 1 (me cubrí apropiadamente pero no estaba completamente seguro) / 2 (diferí correctamente al equipo de encuesta o dije \"déjame verificar eso\") Puntuación propia: 0 (sí, prometí demasiado) / 1 (califiqué pero podría haber sido más claro) / 2 (presenté con precisión con advertencias apropiadas)",
        slides: [
{
            title: "Manual de Reactivación de Propietarios Huérfanos",
            content: "Bienvenido al Módulo 6.3A — Manual de Reactivación de Propietarios Huérfanos. Un propietario huérfano es un propietario que compró energía solar a través de tu empresa pero cuyo asesor original ya no está en la organización. Tiene un sistema solar activo, está pagando su factura mensual o préstamo y no tiene una relación de asesor activa. Recibe alertas de monitoreo, preguntas de facturación y ocasionalmente tiene preocupaciones — sin un punto de contacto asignado. Esto es tanto una falla de servicio como una oportunidad de ingresos significativa. Este módulo te enseña cómo reactivar esas relaciones profesionalmente, construir valor genuino y convertir a propietarios huérfanos en fuentes de referidos, clientes de actualización y defensores leales.",
            image: "/images/orphan_owner.png"
          },
          {
            title: "Por Qué Importan los Propietarios Huérfanos",
            content: "¿Por qué importan los propietarios huérfanos? Primero, ya confían en la empresa — tomaron una decisión de compra importante y pasaron por todo el proceso de instalación. Segundo, han demostrado que están dispuestos a invertir en su hogar. Tercero, pueden ver los datos de rendimiento de su sistema todos los días — lo que significa que tienen preguntas continuas y puntos de compromiso en los que un buen asesor puede intervenir. Cuarto, sus vecinos pueden ver su sistema. Los propietarios huérfanos viven en vecindarios donde tu empresa ya tiene visibilidad. El asesor que reactiva una relación de propietario huérfano a menudo obtiene acceso a toda una calle de referidos cálidos de alguien que ha estado viviendo con un sistema solar y hablando de él durante años.",
            image: "/images/orphan_owner.png"
          },
          {
            title: "El Marco de la Llamada de Reactivación",
            content: "El alcance de reactivación no es una llamada de ventas. Es una llamada de servicio. El enfoque debe ser genuino: \"Hola, soy [tu nombre] con [nombre de la empresa]. Noté que tiene un sistema instalado con nosotros desde hace un par de años y quería comunicarme personalmente — soy el nuevo asesor que cubre su área, y solo quería asegurarme de que está obteniendo todo lo que necesita. ¿Cómo ha estado funcionando el sistema para usted?\" Escucha. Déjales hablar. Si hay preocupaciones, abórdalas o escálalas a operaciones. Si todo está bien, afírmalo: \"Qué bueno escuchar eso — los datos de monitoreo también se ven muy sólidos de su parte.\" Estás construyendo crédito de relación antes de pedir cualquier cosa.",
            image: "/images/orphan_owner.png"
          },
          {
            title: "Señales de Actualización a Escuchar",
            content: "Después de que la relación se restablece, hay tres conversaciones naturales de ventas adicionales. Almacenamiento de baterías — especialmente relevante en mercados NEM 3.0 o áreas con frecuentes interrupciones del servicio. Expansión de paneles — si su consumo ha aumentado debido a un vehículo eléctrico, una adición al hogar o una piscina. Y equipo de carga para vehículos eléctricos — si recientemente compró o está considerando un vehículo eléctrico. En cada caso, lidera con sus datos: \"Mirando su historial de monitoreo, noté que su consumo ha subido aproximadamente un veinte por ciento durante el último año. ¿Ha agregado algo significativo al hogar?\" Esa pregunta abre la conversación naturalmente. Y siempre: pide referidos. \"¿Alguno de sus vecinos le ha preguntado sobre el sistema? Me encantaría ayudarles — y usted obtendría el crédito del referido.\"",
            image: "/images/orphan_owner.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
      }
    ],
    quiz: {
      title: "Module 6.3A Knowledge Check",
      questions: [
{
          id: "kc_6_3a_1",
          question: "¿Cuál es la razón principal por la que los propietarios huérfanos son una oportunidad de alto ROI?",
          options: [
"Son fáciles de vender sin construir una relación.",
            "Ya confían en la empresa lo suficiente como para haber comprado — la relación solo necesita un representante.",
            "Siempre quieren almacenamiento de baterías.",
            "Es poco probable que cancelen, por lo que no necesitan atención."
          ],
          correctAnswerIndex: 1,
          explanation: "El umbral de confianza ya está cruzado. No estás vendiendo solar, estás reactivando una relación."
        },
        {
          id: "kc_6_3a_2",
          question: "Durante una llamada de reactivación, un propietario menciona que acaba de comprar un vehículo eléctrico. Esto es:",
          options: [
"Irrelevante para la conversación solar.",
            "Una señal de actualización de batería y cargador de EV — abre esa conversación.",
            "Una razón por la que el propietario querría cancelar la solar.",
            "Algo a notar pero no perseguir en esta llamada."
          ],
          correctAnswerIndex: 1,
          explanation: "Una compra de EV significa mayor consumo de energía y una sólida oportunidad de actualización de batería/cargador."
        }
      ]
    }
  },
  mod_6_4: {
    id: "mod_6_4",
    title: "Módulo 6.4: FORMATO ESTÁNDAR",
    subtitle: "Track what matters, diagnose bottlenecks, and self-coach like a top performer.",
    sections: [
{
        title: "El Efecto Compuesto de la Reputación",
        type: "list",
        content: "Cada interacción que tienes construye o erosiona tu reputación. Cada conversación honesta es un depósito. Cada exageración es un retiro. Los reps que piensan a corto plazo persiguen cualquier trato, sobre-prometen y queman puentes. Los reps que piensan a largo plazo califican agresivamente, construyen relaciones y generan referidos durante años. Veinticinco tratos cerrados significa veinticinco fuentes potenciales de referidos. Cien tratos cerrados significa suficiente negocio entrante para raramente tocar puertas frías. Trata a cada cliente como una relación de cinco años — porque los mejores se convierten exactamente en eso.",
        items: [
"Doors Knocked — your raw activity input",
          "Set Rate (Appointments Set / Doors Knocked) — door effectiveness",
          "Show Rate (Appointments Shown / Set) — follow-up and commitment quality",
          "Close Rate (Deals Closed / Appointments Shown) — presentation effectiveness",
          "Average Contract Value — deal quality and upsell skill"
        ]
      },
      {
        title: "Diagnosing Your Bottleneck",
        type: "comparison",
        comparison: {
          rookie: "Tracks nothing. Guesses at what's wrong. Blames market conditions.",
          pro: "Reviews KPIs every morning. Identifies the broken ratio. Adjusts that specific behavior that day."
        },
        content: "Find the ratio that breaks first — that's where you focus 80% of your coaching energy."
      },
      {
        title: "Your Daily KPI Review Ritual",
        type: "text",
        content: "Every morning before you leave for the field, spend 5 minutes with your numbers. Ask: 'What was my set rate yesterday? Is it trending up or down? What's one thing I'll do differently at the door today?' This 5-minute habit compounds over a 90-day career into elite performance."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_6_4_1",
        type: "checklist",
        label: "Completa estas oraciones:\n\n*\"En 12 meses, quiero haber cerrado _____ acuerdos y tener _____ clientes que me recomienden activamente.\"*\n\n*\"La forma en que voy a tratar a cada cliente para que me refieran a sus vecinos es:*",
        items: [
"Doors knocked column",
          "Set rate column",
          "Show rate column",
          "Close rate column",
          "ACV column",
          "Weekly trend row"
        ]
      },
      {
        id: "wb_6_4_2",
        type: "open_response",
        label: "Escribe tu plan de actividad personal de 90 días para alcanzar tus metas de carrera.",
        placeholder: "Mes 1: __ | Mes 2: __ | Mes 3: __",
        lines: 4
      }
    ]
  },
  mod_6_4a: {
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
        items: [
"Cómo la luz solar se convierte en electricidad; DC vs. AC; la cadena de producción",
          "Inversores de cadena vs. microinversores; qué hace cada uno y cuándo es apropiado cada uno",
          "Fundamentos de la batería; qué hace y no hace una batería; expectativas de respaldo",
          "Conciencia de ingeniería del sitio; techo, panel, eléctrico, sombra, conduit, estructuras separadas"
        ]
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
        items: [
"Evolución de la medición neta; NEM 3.0; valor de exportación vs. auto-consumo",
          "Posicionamiento de la batería centrado en la economía vs. basado en el miedo",
          "Criterios de ajuste de la batería; cuándo profundizar en el almacenamiento y cuándo ser honesto sobre el ROI limitado",
          "Qué no prometer sobre la capacidad de respaldo o los créditos de exportación"
        ]
      },
      {
        title: "Dominio 4 — Descubrimiento y Conciencia del Sitio",
        type: "slides",
        content: "Dominio 4 — Descubrimiento y Conciencia del Sitio",
        slides: [
{
            title: "Dominio de KPIs y Sistema de Auto-Entrenamiento",
            content: "Bienvenido al Módulo 6.4A — Dominio de KPIs y Sistema de Auto-Entrenamiento. Los asesores que construyen carreras a largo plazo en energía solar no siempre son los más talentosos — son los más conscientes de sí mismos. Saben exactamente dónde están muriendo sus tratos. Conocen su tasa de cierre, su tasa de asistencia, su tasa de establecimiento — y saben en cuál trabajar esta semana. Un asesor que no puede identificar su propio cuello de botella es un asesor que repetirá los mismos errores indefinidamente y se preguntará por qué los resultados no cambian. Este módulo te da los seis KPIs principales que debes rastrear y un marco semanal de auto-entrenamiento que convierte tus propios datos en tu herramienta de entrenamiento más valiosa.",
            image: "/images/kpi_dashboard.png"
          },
          {
            title: "Los Seis KPIs Solares Principales",
            content: "Hay seis KPIs principales que todo asesor solar debe rastrear semanalmente sin excepción. Puertas tocadas — la actividad que inicia todo. Conversaciones — cuántos propietarios se comprometieron realmente más allá de \"no me interesa\". Citas establecidas — cuántos acordaron una hora específica. Citas asistidas — cuántas realmente ocurrieron. Propuestas presentadas — cuántas presentaciones completas se entregaron. Y tratos cerrados — cuántos contratos fueron firmados. Cada proporción entre estas métricas revela una fuga específica en tu proceso. Pocas conversaciones por puerta significa que tu apertura necesita trabajo. Baja tasa de asistencia significa que tu proceso de confirmación está roto. Baja tasa de cierre significa que tu presentación o manejo de objeciones es el eslabón débil. Los números te dicen exactamente qué practicar.",
            image: "/images/kpi_dashboard.png"
          },
          {
            title: "Diagnosticando tu Cuello de Botella",
            content: "La sesión semanal de auto-entrenamiento es un ritual de quince minutos los viernes que vale más que la mayoría de los entrenamientos del equipo. Hazte cinco preguntas. ¿Toqué cien puertas esta semana — y si no, qué lo impidió específicamente? ¿Establecí ocho o más citas — y si no, dónde se rompió la conversación? ¿Asistí a cada cita programada — y si no, qué pasó con mi proceso de confirmación? ¿Cerré al menos un trato — y si no, exactamente dónde los perdí? Y: ¿tengo diez o más citas programadas para la próxima semana — y si no, estoy atrasado? Estas cinco preguntas fuerzan una autoevaluación honesta. Reemplazan la narrativa emocional de \"fue una semana difícil\" con datos específicos y accionables.",
            image: "/images/kpi_dashboard.png"
          },
          {
            title: "El Proceso Semanal de Auto-Revisión",
            content: "El ejercicio de proyección de ingresos es cómo conectas tus KPIs con tus metas financieras — y haces que la relación entre actividad e ingresos sea concreta y motivadora. Comienza con tu meta de ingresos. Divídela por tu comisión promedio por trato. Eso te da el número de tratos cerrados que necesitas por mes. Divide por tu tasa de cierre para obtener las citas que necesitas. Divide por tu tasa de asistencia para obtener las citas que necesitas establecer. Divide por tu tasa de establecimiento para obtener las conversaciones que necesitas. Divide por tu tasa de conversación para obtener las puertas que necesitas tocar. Cada número en esa cadena es conocible — y controlable. Cuando ves que tu meta de ingresos requiere noventa y siete puertas por semana y tocaste sesenta y dos la semana pasada, la brecha no es motivacional. Es matemática. Y la matemática tiene una solución.*Fin de las Transcripciones ElevenLabs de Módulos V2*\n*17 módulos completos — listos para generación en ElevenLabs*\n*Próximo paso: generar audio por módulo, crear estructura de carpetas en /public/audio/modules/mod_XXXX/*",
            image: "/images/kpi_dashboard.png"
          }
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
      }
    ],
    quiz: {
      title: "Module 6.4A Knowledge Check",
      questions: [
{
          id: "kc_6_4a_1",
          question: "La tasa de cierre de un representante es del 35%, pero su tasa de asistencia (show rate) es de solo el 45%. ¿Dónde deberían enfocarse primero?",
          options: [
"Mejorar su tasa de cierre.",
            "Mejorar su tasa de asistencia — si las citas no ocurren, los cierres son imposibles sin importar la habilidad.",
            "Tocar más puertas para compensar.",
            "Aumentar el valor promedio de su contrato."
          ],
          correctAnswerIndex: 1,
          explanation: "Corrige la fuga más grande primero. Si el 55% de tus citas nunca ocurren, ninguna tasa de cierre puede compensar eso."
        },
        {
          id: "kc_6_4a_2",
          question: "¿Qué indica más probablemente una tasa de agendamiento ('set rate') consistentemente baja?",
          options: [
"El representante está cerrando de manera demasiado agresiva.",
            "La presentación en el hogar necesita trabajo.",
            "El representante tiene un problema en la puerta — apertura, posicionamiento o selección de prospectos.",
            "El representante está trabajando en los vecindarios equivocados."
          ],
          correctAnswerIndex: 2,
          explanation: "La tasa de agendamiento es la conversión de puerta a cita. Una tasa baja indica un problema en el primer contacto."
        }
      ]
    }
  },
  mod_6_5: {
    id: "mod_6_5",
    title: "Módulo 6.5: PRÁCTICA DE ESCENARIOS AVANZADOS",
    subtitle: "Manage the post-sale process so customers trust you through every phase.",
    sections: [
{
        title: "Escenario A — El Investigador",
        type: "list",
        content: "Este propietario ha investigado NEM 3.0, cargos del distribuidor y curvas de degradación antes de que llegaras. Están probando tu experiencia. No repitas lo básico — pregunta qué ya han aprendido y dónde están sus brechas. Usa lenguaje técnico. Admite cuando necesitas confirmar cifras exactas en lugar de simular. Luego pregunta: basado en todo lo que has investigado, ¿cuál es la única cosa que todavía te está deteniendo? Esa pregunta casi siempre saca el obstáculo real — que usualmente no es técnico en absoluto.",
        items: [
"Phase 1 — Contract & Welcome: 24-hour confirmation call. Confirm documents, set expectations.",
          "Phase 2 — Site Survey: Notify 48 hours before. 'An engineer will visit to measure your roof.'",
          "Phase 3 — Permitting: 'This takes 3–8 weeks depending on your city. Normal and expected.'",
          "Phase 4 — Install Scheduled: Excitement call. 'Your install date is confirmed!'",
          "Phase 5 — Installation Day: Check-in morning of. Be reachable.",
          "Phase 6 — Inspection & Interconnection: 'Almost there — utility company approves the connection.'",
          "Phase 7 — PTO & Go-Live: Celebration call. 'Your system is live. Check your monitoring app!'"
        ]
      },
      {
        title: "Escenario B — El Enfrentamiento de la Pareja Casada",
        type: "simulation",
        scenarioId: "rodriguez_family",
        content: "El esposo quiere solar. La esposa es escéptica por una experiencia previa con un contratista. Y hay un problema oculto — están planeando vender en cuatro años. Tu trabajo es equilibrar el entusiasmo por el esposo con la construcción de confianza para la esposa, abordar el plazo de cuatro años honestamente — lo que puede significar una descalificación parcial o una conversación honesta sobre estructuras de recuperación de inversión más cortas — y nunca tomar partido. Valida ambas perspectivas. Haz que la esposa se sienta escuchada antes de sentirse vendida. Su confianza es la clave del trato."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_6_5_1",
        type: "open_response",
        label: "*(Con compañero o entrenador — 10 minutos por escenario)*\n\nEscenario A — El Investigador:\n¿Cómo salió? ¿Qué hiciste bien? ¿Qué cambiarías?",
        placeholder: "Hey [Name], quick update on your project...",
        lines: 3
      }
    ]
  },
  mod_6_6: {
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
        items: [
"Never misrepresent savings projections — use conservative, honest estimates",
          "Disclose all contract terms clearly — cancellation windows, escalators, and conditions",
          "Never pressure a decision — if they need 48 hours, respect it",
          "If a deal isn't right for the homeowner, walk away — referrals follow integrity",
          "Report any ethical concerns about team members to your manager immediately"
        ]
      },
      {
        title: "The Long-Term Perspective",
        type: "quote",
        content: "\"The rep who manipulates a customer into a bad deal closes one sale and loses a territory. The rep who earns trust closes one sale and gains twenty referrals. Your long-term income is built on reputation, not tricks.\""
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_6_6_1",
        type: "open_response",
        label: "Califica tu nivel de preparación en cada área (1–5):\n\n| Área | Mi Nivel (1–5) | Lo que Necesito Repasar |\n|---|---|---|\n| Tecnología solar y componentes | _____ | _________________________ |\n| Análisis de facturas y financiamiento | _____ | _________________________ |\n| Psicología del propietario y BOLT | _____ | _________________________ |\n| Manejo de objeciones y cierre | _____ | _________________________ |\n| Cumplimiento y ética | _____ | _________________________ |\n\nMi área más débil que debo repasar esta noche:",
        placeholder: "I would walk away if...",
        lines: 4
      }
    ]
  },
  mod_6_7: {
    id: "mod_6_7",
    title: "Módulo 6.7: CIERRE DEL DÍA 6 Y VISTA PREVIA DEL DÍA 7",
    subtitle: "Map your trajectory from rep to team leader and beyond.",
    sections: [
{
        title: "Estás Listo para el Día 7",
        type: "list",
        content: "Has aprendido más en seis días de lo que la mayoría de los reps de solar aprenden en tres meses. Mañana es diferente — no es un día de aula. Pasarás la mañana acompañando a tu gerente en tres citas en vivo, observando cómo cada habilidad de este programa se desarrolla en un hogar real con propietarios reales. Después del almuerzo, realizas una cita completa tú mismo, con tu gerente observando en silencio. Luego debrief, recibes tu evaluación de campo y te autorizas para vender de forma independiente. Duerme bien. Estás listo.",
        items: [
"Level 1 — Certified Rep (Month 1–3): Building fundamentals, $3K–$8K/mo",
          "Level 2 — Senior Rep (Month 4–12): Consistent 4+ deals/mo, $10K–$18K/mo",
          "Level 3 — Lead Rep / Trainer (Month 12–18): Mentoring new reps, override income",
          "Level 4 — Team Lead / Manager (Year 2+): Team of 5–15, override + personal production",
          "Level 5 — Regional Director: Multi-team leadership, equity and equity-style comp"
        ]
      },
      {
        title: "Writing Your Income Goals",
        type: "text",
        content: "Goal-setting without specifics is just wishful thinking. Your 1-year, 3-year, and 5-year income goals must be connected to specific activity levels — otherwise they're not goals, they're fantasies."
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_6_7_1",
        type: "open_response",
        label: "Reflexiona sobre el Cierre del Día 6 y la Vista Previa del Día 7: ¿Cómo lo aplicarás?",
        placeholder: "Year 1: $... | Role: ... | Skill: ...",
        lines: 6
      }
    ]
  },
  mod_6_8: {
    id: "mod_6_8",
    title: "Module 6.8: Day 6 Final Certification Exam",
    subtitle: "Demonstrate mastery across all six days of the accelerator.",
    sections: [
{
        title: "Certification Exam ΓÇö Written Component",
        type: "text",
        content: "This exam covers all material from Days 1 through 6. You must score 80% or higher to receive the SeptiVolt Sales Rep Certification. You have one retake opportunity if you score below 80% on your first attempt."
      }
    ],
    workbookPrompts: [],
    quiz: {
      title: "Day 6 Certification Exam",
      questions: [
{
          id: "cert_6_1",
          question: "What are the three referral trigger moments?",
          options: [
"Door knock, appointment set, contract signed",
            "Post-signature, install complete, first low bill",
            "Day 1, Day 3, Day 7",
            "CRM entry, survey, installation"
          ],
          correctAnswerIndex: 1,
          explanation: "The three trigger moments are post-signature euphoria, system install complete, and first low utility bill."
        },
        {
          id: "cert_6_2",
          question: "Which KPI diagnoses a problem specifically at the door?",
          options: [
"Close Rate",
            "Average Contract Value",
            "Set Rate",
            "Show Rate"
          ],
          correctAnswerIndex: 2,
          explanation: "Set rate (appointments set per door knocked) measures door effectiveness directly."
        },
        {
          id: "cert_6_3",
          question: "What is an 'orphan owner'?",
          options: [
"A prospect who has never heard of solar",
            "A customer who cancelled their contract",
            "A customer whose original rep left the company",
            "A homeowner with no utility bill history"
          ],
          correctAnswerIndex: 2,
          explanation: "Orphan owners are existing customers with no active rep ΓÇö they're warm and reachable."
        },
        {
          id: "cert_6_4",
          question: "When should you first ask for a review?",
          options: [
"During the sales presentation",
            "Within 48 hours of system installation",
            "After the first utility bill arrives",
            "At the 6-month check-in"
          ],
          correctAnswerIndex: 1,
          explanation: "Within 48 hours of install ΓÇö enthusiasm is at peak and the experience is fresh."
        },
        {
          id: "cert_6_5",
          question: "Which of these is an integrity violation?",
          options: [
"Disclosing all contract terms clearly",
            "Using conservative savings estimates",
            "Pressuring a customer to sign before 48 hours they requested",
            "Walking away from a bad-fit deal"
          ],
          correctAnswerIndex: 2,
          explanation: "Pressuring a customer who requested time to decide violates professional ethics standards."
        }
      ]
    },
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "en",
      isTextFallback: true,
      missingFields: [
"title",
        "subtitle",
        "sections"
      ]
    }
  },
  mod_7_1: {
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
        items: [
"Discovery script reviewed and internalized — no cue cards",
          "Top 10 objections practiced verbally this morning",
          "Presentation flow memorized — all 6 phases",
          "Referral ask scripted and ready",
          "Professional appearance — business casual, clean, prepared",
          "Phone charged, CRM access confirmed, manager contact saved"
        ]
      },
      {
        title: "The Mindset for Field Day",
        type: "quote",
        content: "\"You are not going to observe today — you are going to study. Watch every move your manager makes and ask yourself: why did they do that? What was the customer's reaction? What would I have done differently? Learning never stops, even after you're certified.\""
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_7_1_1",
        type: "checklist",
        label: "Antes de salir, responde estas preguntas en voz alta con tu gerente:\n\n¿Cuál es la habilidad específica que más quiero observar hoy?",
        items: [
"Scripts reviewed",
          "Objections drilled",
          "Appearance ready",
          "Phone charged",
          "CRM confirmed",
          "Mindset locked in"
        ]
      }
    ]
  },
  mod_7_2: {
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
        items: [
"Opening: How did they establish authority and likability in the first 2 minutes?",
          "Discovery: Which questions created the biggest emotional response?",
          "Presentation: Where did the customer lean in vs. check out?",
          "Objections: Which technique did they use and did it land?",
          "Close: What specifically triggered the decision?"
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_7_2_1",
        type: "open_response",
        label: "Reflexiona sobre la Cita #1 — Sombra y Observación: ¿Cómo lo aplicarás?",
        placeholder: "1. They did __ when __ and the customer responded by __...",
        lines: 5
      }
    ]
  },
  mod_7_3: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_7_3_1",
        type: "open_response",
        label: "Reflexiona sobre la Cita #2 — Sombra y Observación: ¿Cómo lo aplicarás?",
        placeholder: "Both times, the customer responded to...",
        lines: 4
      }
    ]
  },
  mod_7_4: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_7_4_1",
        type: "open_response",
        label: "Reflexiona sobre la Cita #3 — Sombra y Observación: ¿Cómo lo aplicarás?",
        placeholder: "In my appointment, I will...",
        lines: 3
      }
    ]
  },
  mod_7_5: {
    id: "mod_7_5",
    title: "Módulo 7.5: MÓDULO 7.5 — PREPARACIÓN PRE-CITA",
    subtitle: "The 10-minute ritual that separates prepared reps from reactive ones.",
    sections: [
{
        title: "Entrenamiento de Último Minuto",
        type: "list",
        content: "En los quince minutos antes de tu cita, tu gerente te hará cinco preguntas. ¿Qué sabes sobre este propietario? ¿Cuál es tu apertura? ¿Qué objeciones esperas? ¿A qué tipo de propietario se parece esto? ¿Y cómo cerrarás? Responde las cinco en voz alta. No adivines — apóyate en tu formación. Luego respira. Has practicado esto durante seis días. Conoces el marco. Conoces las objeciones. Sabes cómo leer el ambiente. Confía en tu preparación y ve a ejecutar.",
        items: [
"Review the customer's utility bill data and usage history",
          "Identify 2 likely objections based on what you know about them",
          "Rehearse your opening 60 seconds out loud — in the car, alone",
          "Set your intention: 'I am here to help this family make a great decision'",
          "Deep breath — walk in calm, confident, and present"
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_7_5_1",
        type: "open_response",
        label: "Reflexiona sobre la Preparación Pre-Cita: ¿Cómo lo aplicarás?",
        placeholder: "Today I will...",
        lines: 2
      }
    ]
  },
  mod_7_6: {
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
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
        label: "Identifica un área en la presentación donde te hayas sentido dudoso. ¿Cuál es tu plan para dominarla?",
        placeholder: "Me sentí dudoso en... Mi plan es...",
        lines: 3
      }
    ]
  },
  mod_7_7: {
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
        items: [
"Certified — You demonstrated readiness across all five assessment criteria. You are cleared for independent field work.",
          "Provisional Certification — Strong in most areas, one gap identified. Cleared for field with manager check-ins for 2 weeks.",
          "Extension Recommended — Specific gap requires additional training. A focused 2-day extension plan will be provided."
        ]
      },
      {
        title: "Regardless of Outcome",
        type: "quote",
        content: "\"Every rep who goes through this program — regardless of certification outcome on Day 7 — is more prepared than 90% of the reps currently working in the field. Your training doesn't end today. It begins.\""
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
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
        label: "Notas de observación de dinámica de cónyuge — ¿cómo cambió la interacción cuando ambos cónyuges se involucraron?",
        maxRating: 10
      }
    ]
  },
  mod_7_8: {
    id: "mod_7_8",
    title: "Módulo 7.8: MÓDULO 7.8 — FIRMA DE CERTIFICACIÓN",
    subtitle: "You are now a certified solar sales professional. Here is your launch plan.",
    sections: [
{
        title: "Estás Certificado",
        type: "list",
        content: "Si has aprobado, tu gerente firmará tu formulario de certificación de campo y lo enviará a operaciones. Lo que sucede a continuación: tu CRM se activa con tus asignaciones de territorio, los leads entrantes comienzan a enrutarse a ti, y recibes tus tarjetas de presentación, letreros de jardín y materiales de marketing. Ahora eres un consultor de solar activo. El certificado no es el final — es el comienzo. Cada cita a partir de aquí construye tu habilidad, tu pipeline y tu reputación. Ve a ganártelo.",
        items: [
"Week 1: 40 doors/day minimum — activity volume builds confidence",
          "Week 2: 3 appointments set and run — measure all 5 KPIs daily",
          "Week 3: 1 deal closed — first commission hits differently",
          "Week 4: Referral system activated — ask at every close",
          "30-day review with manager: KPI analysis and coaching plan for Month 2"
        ]
      },
      {
        title: "You Are Ready",
        type: "quote",
        content: "\"Seven days ago, you didn't know how to read a utility bill. Today, you can run a full appointment, handle any objection, close ethically, and build a referral pipeline. That is not a small thing. Go build your career.\""
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_7_8_1",
        type: "open_response",
        label: "Reflexiona sobre la Firma de Certificación: ¿Cómo lo aplicarás?",
        placeholder: "In my first 30 days I will...",
        lines: 4
      }
    ]
  },
  mod_7_9: {
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
        items: [
"Doors knocked: __/20",
          "Contacts made (someone answered): __",
          "Appointments set: __",
          "Objections handled: __",
          "One thing that surprised you: __"
        ]
      }
    ],
    _meta: {
      requestedLanguage: "es",
      resolvedLanguage: "es",
      isTextFallback: false,
      missingFields: []
    },
    workbookPrompts: [
{
        id: "wb_7_9_1",
        type: "open_response",
        label: "Escribiste tu \"Por Qué\" en el Día 6. Ahora que terminaste el entrenamiento y corriste tu primera cita real, ¿cambió algo en ese \"Por Qué\"? ¿Qué agregarías?",
        placeholder: "I learned that...",
        lines: 3
      },
      {
        id: "wb_7_9_2",
        type: "open_response",
        label: "Reflexiona sobre tu primera experiencia de campo en solitario. ¿Cuál es la brecha de habilidad más grande en la que necesitas trabajar mañana?",
        placeholder: "Mi mayor brecha de habilidad hoy fue... Mañana voy a...",
        lines: 2
      }
    ]
  }
}
