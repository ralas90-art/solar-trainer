import { WHITE_LABEL } from "./white-label.config";
import { DayInfo, ModuleContent } from "./modules";

export const DAY_MODULES_ES: DayInfo[] = [
    {
        dayNumber: 1,
        dayId: "day_1",
        title: "Incorporación y Fundamentos",
        subtitle: "Elimina la fricción, construye identidad, enciende la emoción",
        objectives: [
            "Comprender la trayectoria realista de ingresos para los Meses 1, 3, 6 y el Año 2",
            "Completar toda la incorporación administrativa — papeleo, acceso a CRM, sistemas",
            `Explicar cómo funciona la energía ${WHITE_LABEL.industry.toLowerCase()} en 60 segundos sin notas`,
            "Leer una factura de servicios públicos y tomar una decisión de calificación de ir / no ir",
            "Adoptar la identidad de consultor y firmar el Compromiso de Integridad"
        ],
        modules: [
            { id: "mod_1_1", moduleNumber: "1.1", title: "Bienvenida y Visión", duration: "15 min", type: "content" },
            { id: "mod_1_2", moduleNumber: "1.2", title: "Incorporación Administrativa", duration: "45 min", type: "activity" },
            { id: "mod_1_3", moduleNumber: "1.3", title: "Cultura de la Empresa y Expectativas", duration: "20 min", type: "content" },
            { id: "mod_1_4", moduleNumber: "1.4", title: `Descripción General de la Industria ${WHITE_LABEL.industry}`, duration: "20 min", type: "quiz" },
            { id: "mod_1_5", moduleNumber: "1.5", title: `Fundamentos de la Tecnología ${WHITE_LABEL.industry}`, duration: "25 min", type: "quiz" },
            { id: "mod_1_5a", moduleNumber: "1.5a", title: `Física ${WHITE_LABEL.industry} Simplificada`, duration: "45 min", type: "content" },
            { id: "mod_1_5b", moduleNumber: "1.5b", title: "Fundamentos de Inversores y Baterías", duration: "40 min", type: "content" },
            { id: "mod_1_5c", moduleNumber: "1.5c", title: "Estructuras Financieras", duration: "40 min", type: "content" },
            { id: "mod_1_6", moduleNumber: "1.6", title: "Cambio de Identidad — Consultor vs Vendedor", duration: "20 min", type: "activity" },
            { id: "mod_1_7", moduleNumber: "1.7", title: "Dominio de la Factura de Servicios Públicos", duration: "25 min", type: "quiz" },
            { id: "mod_1_7a", moduleNumber: "1.7a", title: "Conciencia Básica de Ingeniería de Sitio", duration: "45 min", type: "content" },
            { id: "mod_1_8", moduleNumber: "1.8", title: "Resumen y Vista Previa del Día 1", duration: "15 min", type: "content" }
        ],
        deliverables: ["Acuerdo de compromiso firmado", "Todo el papeleo + login de CRM confirmado", "Documento de expectativas firmado", "Cuestionario de la industria 80%+", "Cuestionario de tecnología 80%+", "Compromiso de integridad firmado", "Cuestionario de lectura de facturas 80%+"],
        homework: ["Ver videos de medición neta", "Leer la guía de las mejores objeciones (5 páginas)", `Explicar la energía ${WHITE_LABEL.industry.toLowerCase()} a un familiar — grábate`]
    },
    {
        dayNumber: 2,
        dayId: "day_2",
        title: "Prospección y Dominio del Territorio",
        subtitle: "Genera un flujo constante de oportunidades a través de la prospección estratégica",
        objectives: [
            "Construir un plan de territorio con 3 vecindarios objetivo y una ruta diaria",
            "Tocar una puerta y entregar el opener de 30 segundos en 3 variaciones",
            "Manejar las 5 principales objeciones de puerta sin guión",
            "Agendar una cita telefónica usando el opener entrante y preguntas de descubrimiento",
            "Pasar la certificación de juego de roles del Día 2"
        ],
        modules: [
            { id: "mod_2_1", moduleNumber: "2.1", title: "Psicología del Propietario", duration: "20 min", type: "content" },
            { id: "mod_2_2", moduleNumber: "2.2", title: "Estrategia y Planificación de Territorio", duration: "25 min", type: "activity" },
            { id: "mod_2_3", moduleNumber: "2.3", title: "Matemáticas de Eficiencia Diaria", duration: "15 min", type: "content" },
            { id: "mod_2_4", moduleNumber: "2.4", title: `El Marco de Conversación ${WHITE_LABEL.industry}`, duration: "20 min", type: "content" },
            { id: "mod_2_5", moduleNumber: "2.5", title: "Dominio de la Venta Puerta a Puerta", duration: "30 min", type: "activity", hasSimulation: true },
            { id: "mod_2_6", moduleNumber: "2.6", title: "Manejo de Micro-Objeciones", duration: "25 min", type: "activity", hasSimulation: true },
            { id: "mod_2_7", moduleNumber: "2.7", title: "Agendamiento de Citas por Teléfono", duration: "25 min", type: "activity" },
            { id: "mod_2_8", moduleNumber: "2.8", title: "Encuadre Anti-Ventas y Confianza", duration: "20 min", type: "activity" }
        ],
        deliverables: [
            "Plan de territorio escrito — 3 vecindarios + rutas",
            "Compromiso de horario diario firmado",
            "Video del pitch de 30 segundos grabado",
            "Registro de 5 llamadas de práctica",
            "Guión personal anti-ventas",
            "Prueba de fuego de objeciones aprobada",
            "Certificación de juego de roles aprobada"
        ],
        homework: [
            "Tocar 20 puertas esta noche — solo práctica",
            "Grábate en 3 puertas — míralo antes de mañana",
            "Estudiar el guión de las 10 principales objeciones"
        ]
    },
    {
        dayNumber: 3,
        dayId: "day_3",
        title: "Descubrimiento, Psicología y Dominio en el Hogar",
        subtitle: "Descubre el dolor real, perfila personalidades y controla la cita",
        objectives: [
            "Controlar el entorno en el hogar — asientos, distracciones, encuadre inicial",
            "Identificar los 4 tipos de personalidad BOLT y adaptar tu comunicación",
            "Usar empatía táctica y espejeo para descubrir preocupaciones ocultas",
            "Hacer las 12 preguntas de descubrimiento en secuencia de memoria",
            "Saber cuándo descalificar y cómo hacerlo con integridad"
        ],
        modules: [
            { id: "mod_3_1", moduleNumber: "3.1", title: "Preparación Mental y Control del Entorno", duration: "15 min", type: "content" },
            { id: "mod_3_2", moduleNumber: "3.2", title: "La Apertura: Del Saludo al Control de la Mesa", duration: "20 min", type: "content" },
            { id: "mod_3_3", moduleNumber: "3.3", title: "La Psicología del Descubrimiento", duration: "15 min", type: "content" },
            { id: "mod_3_4", moduleNumber: "3.4", title: "Descubrimiento Emocional y el Método BOLT", duration: "25 min", type: "content" },
            { id: "mod_3_5", moduleNumber: "3.5", title: "Las 12 Preguntas Técnicas de Descubrimiento", duration: "20 min", type: "content" },
            { id: "mod_3_6", moduleNumber: "3.6", title: "Auditoría de Sitio y Evaluación del Techo", duration: "15 min", type: "content" },
            { id: "mod_3_7", moduleNumber: "3.7", title: "Dominio de la Descalificación: Cuándo Retirarse", duration: "15 min", type: "content" },
            { id: "mod_3_7a", moduleNumber: "3.7a", title: "Preguntas Técnicas de Descubrimiento", duration: "20 min", type: "content" },
            { id: "mod_3_7b", moduleNumber: "3.7b", title: "Preparación de la Encuesta", duration: "20 min", type: "content" },
            { id: "mod_3_8", moduleNumber: "3.8", title: "Simulación de Descubrimiento Completo del Día 3", duration: "45 min", type: "simulation" }
        ],
        deliverables: [
            "Diagrama de estrategia de asientos dibujado",
            "Hoja de trucos BOLT creada",
            "5 preguntas calibradas escritas",
            "Guión personal de descubrimiento de 12 preguntas",
            "Lista de verificación de dinámica de cónyuge",
            "Lista de verificación de calificación del sitio",
            "Criterios de descalificación escritos",
            "Formulario de feedback de simulación recibido"
        ],
        homework: [
            "Agendar 1 cita real — amigo, familiar o propietario",
            "Ejecutar descubrimiento completo usando el guión de 12 preguntas — grábate",
            "Estudiar la guía profunda de facturas de servicios públicos para el Día 4"
        ]
    },
    {
        dayNumber: 4,
        dayId: "day_4",
        title: "Dominio de la Presentación y Financiamiento",
        subtitle: "Entrega presentaciones convincentes y conformes que impulsen decisiones",
        objectives: [
            "Analizar una factura de servicios públicos en vivo usando la autopsia de 5 pasos",
            "Explicar las 3 estructuras de financiamiento y recomendar la correcta",
            "Entregar el stack de valor de 4 pilares en menos de 60 segundos",
            "Ejecutar las 6 fases de la presentación con micro-cierres",
            "Manejar las 5 principales objeciones financieras usando lenguaje de pago-no-costo"
        ],
        modules: [
            { id: "mod_4_1", moduleNumber: "4.1", title: "Análisis Profundo de la Factura de Servicios Públicos", duration: "20 min", type: "content" },
            { id: "mod_4_1a", moduleNumber: "4.1a", title: "Tarifas de Uso por Tiempo (TOU) y Estrategia", duration: "15 min", type: "content" },
            { id: "mod_4_2", moduleNumber: "4.2", title: "Análisis Profundo de Financiamiento", duration: "25 min", type: "content" },
            { id: "mod_4_2a", moduleNumber: "4.2a", title: "Estrategia de Incentivos y Cumplimiento", duration: "15 min", type: "content" },
            { id: "mod_4_2b", moduleNumber: "4.2b", title: "Economía de Estructuras de Pago", duration: "15 min", type: "content" },
            { id: "mod_4_3", moduleNumber: "4.3", title: "El Stack de Valor — Más Allá del Dinero", duration: "20 min", type: "content" },
            { id: "mod_4_4", moduleNumber: "4.4", title: "Medición Neta y Realidad de la Batería", duration: "25 min", type: "content" },
            { id: "mod_4_4a", moduleNumber: "4.4a", title: "NEM 3.0 y Lógica de Venta de Baterías", duration: "20 min", type: "content" },
            { id: "mod_4_5", moduleNumber: "4.5", title: "Diseño del Sistema y Estimaciones de Producción", duration: "20 min", type: "content" },
            { id: "mod_4_5a", moduleNumber: "4.5a", title: "Modelado Avanzado de ROI", duration: "15 min", type: "content" },
            { id: "mod_4_6", moduleNumber: "4.6", title: "El Flujo de Presentación de 6 Fases", duration: "30 min", type: "content" },
            { id: "mod_4_7", moduleNumber: "4.7", title: "Manejo de Objeciones Financieras", duration: "20 min", type: "content" },
            { id: "mod_4_8", moduleNumber: "4.8", title: "Simulación de Presentación Completa del Día 4", duration: "45 min", type: "simulation" }
        ],
        deliverables: [
            "Guión de autopsia de factura de 5 pasos",
            "Hoja de comparación de financiamiento",
            "Hoja de trucos del stack de valor — 4 pilares",
            "Hoja de preguntas frecuentes sobre NEM + batería",
            "Informe de diseño de muestra anotado",
            "Lista de verificación de presentación — 6 fases",
            "Tarjeta de bolsillo de objeciones financieras",
            "Formulario de feedback del gerente + plan de entrenamiento"
        ],
        homework: [
            "Realizar una presentación completa — amigo, familiar o lead real",
            "Grábate — míralo antes de dormir, anota una mejora",
            "Estudiar los guiones de las 15 principales objeciones para el Día 5"
        ]
    },
    {
        dayNumber: 5,
        dayId: "day_5",
        title: "Dominio de Objeciones y Cierre Ético",
        subtitle: "Maneja cualquier objeción con confianza y cierra tratos éticamente",
        objectives: [
            "Clasificar cualquier objeción como lógica, emocional o táctica",
            `Entregar respuestas guionadas a las 15 principales objeciones ${WHITE_LABEL.industry.toLowerCase()}es sin notas`,
            "Usar las técnicas del puercoespín, sentir-sentí-encontré y reversa negativa",
            "Aplicar el marco de cierre correcto al tipo de personalidad adecuado",
            "Explicar un contrato claramente y reforzar la decisión post-firma"
        ],
        modules: [
            { id: "mod_5_1", moduleNumber: "5.1", title: "Técnicas de Cierre Avanzadas", duration: "25 min", type: "content" },
            { id: "mod_5_2", moduleNumber: "5.2", title: "Manejo de Objeciones: El Marco de 4 Pasos", duration: "20 min", type: "content" },
            { id: "mod_5_3", moduleNumber: "5.3", title: "Cierre para Referidos y Revisiones", duration: "15 min", type: "content" },
            { id: "mod_5_4", moduleNumber: "5.4", title: "Gestión Post-Venta y Prevención de Cancelación", duration: "20 min", type: "content" },
            { id: "mod_5_5", moduleNumber: "5.5", title: "Construcción de Pipeline a Largo Plazo", duration: "20 min", type: "content" },
            { id: "mod_5_5a", moduleNumber: "5.5a", title: "El Ciclo de Vida del Proyecto Post-Venta", duration: "15 min", type: "content" },
            { id: "mod_5_5b", moduleNumber: "5.5b", title: "Problemas Comunes en el Pipeline", duration: "20 min", type: "content" },
            { id: "mod_5_5c", moduleNumber: "5.5c", title: "Solución de Problemas y Escalación", duration: "20 min", type: "content" },
            { id: "mod_5_5d", moduleNumber: "5.5d", title: "Comunicación para Salvar el Trato", duration: "20 min", type: "content" },
            { id: "mod_5_6", moduleNumber: "5.6", title: "Estrategias Avanzadas de Retención", duration: "20 min", type: "content" },
            { id: "mod_5_7", moduleNumber: "5.7", title: "Simulación de Cierre y Post-Venta", duration: "45 min", type: "simulation" },
            { id: "mod_5_8", moduleNumber: "5.8", title: "Cierre del Día 5 y Preparación para el Campo", duration: "15 min", type: "content" }
        ],
        deliverables: [
            "Tarjeta de bolsillo del marco de objeciones",
            "Libro de guiones de objeciones — las 15",
            "Hoja de trucos de técnicas avanzadas",
            "Hoja de trucos de marcos de cierre",
            "Lista de verificación de contrato — laminada",
            "Lista de verificación de prevención de cancelación + plantilla de correo",
            "Formulario de feedback de simulación"
        ],
        homework: [
            "Realizar 1 cita completa — desde el descubrimiento hasta el cierre",
            "Simulacro de objeciones: las 15 con un compañero — grábalo",
            "Enviar la grabación antes de las 9 PM"
        ]
    },
    {
        dayNumber: 6,
        dayId: "day_6",
        title: "Excelencia Post-Venta y Crecimiento Profesional",
        subtitle: "Construye una carrera sostenible y repetible a través de referidos, reputación y disciplina",
        objectives: [
            "Pedir referidos en los 3 momentos clave post-venta",
            "Construir un rastreador de KPI y diagnosticar tus propios cuellos de botella",
            "Comunicar proactivamente a través de las 7 fases del ciclo de vida de instalación",
            "Escribir tus metas de ingresos a 1, 3 y 5 años",
            "Pasar el examen de certificación del Día 6 (80%+ escrito + práctico)"
        ],
        modules: [
            { id: "mod_6_1", moduleNumber: "6.1", title: "El Motor de Referidos — Construyendo Pipeline Pasivo", duration: "25 min", type: "content", hasSimulation: true },
            { id: "mod_6_1a", moduleNumber: "6.1A", title: "Arquitectura del Sistema de Referidos", duration: "30 min", type: "content" },
            { id: "mod_6_2", moduleNumber: "6.2", title: "Estrategia de Reseñas y Prueba Social", duration: "20 min", type: "activity" },
            { id: "mod_6_2a", moduleNumber: "6.2A", title: "Sistemas de Generación de Reseñas", duration: "25 min", type: "content" },
            { id: "mod_6_3", moduleNumber: "6.3", title: "Estrategia de Propietario Huérfano", duration: "20 min", type: "activity" },
            { id: "mod_6_3a", moduleNumber: "6.3A", title: "Manual de Reactivación de Propietarios Huérfanos", duration: "25 min", type: "content" },
            { id: "mod_6_4", moduleNumber: "6.4", title: "Dashboard de Rendimiento y Disciplina de KPI", duration: "25 min", type: "activity" },
            { id: "mod_6_4a", moduleNumber: "6.4A", title: "Maestría en KPI y Sistema de Auto-Entrenamiento", duration: "25 min", type: "content" },
            { id: "mod_6_5", moduleNumber: "6.5", title: "Gestión del Ciclo de Vida del Proyecto", duration: "25 min", type: "content", hasSimulation: true },
            { id: "mod_6_6", moduleNumber: "6.6", title: "Reputación Profesional y Ética a Largo Plazo", duration: "20 min", type: "content" },
            { id: "mod_6_7", moduleNumber: "6.7", title: "Trayectoria Profesional y Escalamiento de Ingresos", duration: "20 min", type: "activity" },
            { id: "mod_6_8", moduleNumber: "6.8", title: "Examen de Certificación Final del Día 6", duration: "30 min", type: "certification" }
        ],
        deliverables: [
            "Guiones de solicitud de referido — 3 etapas",
            "Plantillas de solicitud de reseñas",
            "Guión de propietario huérfano + 5 nombres del CRM",
            "Rastreador de KPI construido y activo",
            "Folleto del ciclo de vida del proyecto",
            "Compromiso de integridad re-firmado",
            "Hoja de metas de ingresos firmada",
            "Insignia de certificación (si se aprueba)"
        ],
        homework: [
            "Revisar notas de los Días 1-6",
            "Estudiar las 4 tareas del examen práctico",
            "Dormir temprano — el Día 7 es en el campo"
        ]
    },
    {
        dayNumber: 7,
        dayId: "day_7",
        title: "Certificación de Campo y Lanzamiento",
        subtitle: "Valida tus habilidades en escenarios del mundo real y lánzate a las ventas independientes",
        objectives: [
            "Observar 3 citas en vivo y extraer lecciones específicas de cada una",
            "Realizar 1 cita completa con el gerente observando — desde el descubrimiento hasta el cierre",
            "Recibir feedback en vivo del campo y decisión de certificación",
            "Tocar 20 puertas solo y agendar tu primera cita como representante certificado"
        ],
        modules: [
            { id: "mod_7_1", moduleNumber: "7.1", title: "Sesión Informativa Previa al Campo", duration: "30 min", type: "content" },
            { id: "mod_7_2", moduleNumber: "7.2", title: "Cita de Acompañamiento #1 — Sombra y Observación", duration: "90 min", type: "field" },
            { id: "mod_7_3", moduleNumber: "7.3", title: "Cita de Acompañamiento #2 — Sombra y Observación", duration: "90 min", type: "field" },
            { id: "mod_7_4", moduleNumber: "7.4", title: "Cita de Acompañamiento #3 — Sombra y Observación", duration: "90 min", type: "field" },
            { id: "mod_7_5", moduleNumber: "7.5", title: "Preparación Pre-Cita", duration: "30 min", type: "activity" },
            { id: "mod_7_6", moduleNumber: "7.6", title: "El Rep Realiza una Cita Completa", duration: "120 min", type: "certification" },
            { id: "mod_7_7", moduleNumber: "7.7", title: "Debrief Post-Cita", duration: "45 min", type: "content" },
            { id: "mod_7_8", moduleNumber: "7.8", title: "Firma de Certificación", duration: "15 min", type: "activity" },
            { id: "mod_7_9", moduleNumber: "7.9", title: "Prospección en Solitario", duration: "120 min", type: "field" }
        ],
        deliverables: [
            "Notas de aprendizaje de 3 citas de acompañamiento",
            "Formulario de evaluación de cita dirigida por el representante",
            "Registro de 20 puertas tocadas solo",
            "Primera cita agendada de forma independiente",
            "Plan de acción de los primeros 30 días firmado",
            "Certificado de graduación del Acelerador"
        ],
        homework: [
            "Ejecutar tu plan de los primeros 30 días",
            "Llegar al primer cierre independiente esta semana",
            "Actualizar el CRM con todos los datos del campo"
        ]
    }
];

export const MODULES_ES: Record<string, ModuleContent> = {
    // ─── MÓDULO 1.1 — Bienvenida y Visión ───────────────────────────────
    "mod_1_1": {
        id: "mod_1_1",
        title: "Módulo 1.1: Bienvenida y Visión",
        subtitle: `Establece expectativas, muestra el potencial de ingresos, introduce la misión ${WHITE_LABEL.industry.toLowerCase()}.`,
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: `Bienvenido al Acelerador de Representantes de Ventas ${WHITE_LABEL.industry} ${WHITE_LABEL.companyName}. Durante los próximos siete días, construirás las habilidades, la mentalidad y las herramientas para convertirte en un consultor profesional. Este no es un curso de teoría — se basa en conversaciones y cierres reales. El potencial de ingresos es masivo: los nuevos representantes suelen ganar entre $3K y $5K el primer mes, escalando a $15K-$25K para el sexto mes si mantienen la consistencia diaria. Entenderás que cada habilidad sigue cuatro etapas: desde la incompetencia inconsciente hasta la maestría automática. Tu compromiso hoy es el primer paso hacia esa maestría.`
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Trayectoria de Ingresos Realista",
                        content: "Mes 1: $3K-$5K (Aprendizaje). Mes 3: $8K-$12K (Consistencia). Mes 6+: $15K-$25K (Maestría)."
                    },
                    {
                        title: "Las 4 Etapas de la Competencia",
                        content: "1. Incompetencia Inconsciente. 2. Incompetencia Consciente (La Caída). 3. Competencia Consciente. 4. Competencia Inconsciente (Maestría)."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Define tu meta de ingresos para el Mes 3 y sé honesto sobre tu etapa actual de competencia. ¿Qué acciones diarias tomarás para superar 'La Caída'?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre la trayectoria de ingresos y las etapas del aprendizaje profesional."
            }
        ],
    },

    // ─── MÓDULO 1.2 — Incorporación Administrativa ────────────────────────────────
    "mod_1_2": {
        id: "mod_1_2",
        title: "Módulo 1.2: Incorporación Administrativa",
        subtitle: "Completar todo el papeleo eficientemente Configurar sistemas y herramientas Eliminar la confusión del primer día",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La incorporación administrativa es el cimiento de tu negocio. Ignorar los detalles aquí te costará dinero. Debes completar tus contratos, formularios de impuestos y acuerdos de cumplimiento hoy mismo. Simultáneamente, configurarás tu CRM y software de diseño (como Aurora o HelioScope). No te retires sin validar cada acceso; una falla técnica en tu primera cita real es inaceptable y proyecta falta de profesionalismo."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Documentación Obligatoria",
                        content: "Contrato de contratista, W-9/Impuestos y Acuerdos de Privacidad."
                    },
                    {
                        title: "Ecosistema Tecnológico",
                        content: "Acceso a CRM, Software de Diseño y Herramientas de Comunicación."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Confirma que has probado todos tus inicios de sesión. ¿Qué herramienta consideras más crítica para tu éxito diario?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Verificación de completitud administrativa y técnica."
            }
        ],
    },

    // ─── MÓDULO 1.3 — Cultura Empresarial y Expectativas ────────────────────────────────
    "mod_1_3": {
        id: "mod_1_3",
        title: "Módulo 1.3: Cultura Empresarial y Expectativas",
        subtitle: "Clarificar estándares de conducta Establecer referentes de desempeño Explicar los sistemas de apoyo",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: `En ${WHITE_LABEL.companyName}, tu éxito depende de proteger tus 'horas doradas': de 2 PM a 7 PM. Este es el tiempo sagrado para prospectar y generar oportunidades. Lo administrativo ocurre por la mañana, y el entrenamiento al mediodía. Tus KPIs semanales son claros: 100-150 puertas tocadas para generar 10-15 citas y cerrar 1-3 tratos. Entender tu compensación y apoyarte en tu gerente para acompañamientos en el campo acelerará tu curva de aprendizaje. No estás solo; usa los recursos del equipo de manera agresiva.`
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Las Horas Doradas",
                        content: "2 PM - 7 PM: Prospectar es la única prioridad. Sin distracciones administrativas."
                    },
                    {
                        title: "KPIs del Éxito",
                        content: "150 Puertas -> 15 Citas -> 2 Tratos. La consistencia es el motor de tus ingresos."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "¿Cómo organizarás tu mañana para que nada interfiera con tus horas doradas? Escribe tu compromiso de actividad semanal."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Cuestionario sobre gestión del tiempo, KPIs y estructura de compensación."
            }
        ],
    },

    // ─── MÓDULO 1.4 — Panorama General de la Industria ${WHITE_LABEL.industry} ────────────────────────────────
    "mod_1_4": {
        id: "mod_1_4",
        title: `Módulo 1.4: Panorama General de la Industria ${WHITE_LABEL.industry}`,
        subtitle: `Entender el panorama del mercado ${WHITE_LABEL.industry.toLowerCase()} Conocer a tu competencia Comprender la urgencia (¿por qué ahora?)`,
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: `La industria ${WHITE_LABEL.industry.toLowerCase()} está en un punto de inflexión impulsado por la inflación energética y el Crédito Fiscal Federal (ITC) del 30%. Los propietarios buscan protección contra el aumento anual de tarifas (6-8%) y mayor independencia. Como consultor, tu labor es desmitificar el sistema: el solar funciona incluso en días nublados, es financieramente accesible mediante pagos mensuales menores a la factura actual, y esperar a que la 'tecnología mejore' suele costar más en facturas eléctricas de lo que se ahorra en innovación.`
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Incentivos Federales (ITC)",
                        content: "Crédito fiscal del 30% sobre el costo total del sistema. Válido hasta 2032."
                    },
                    {
                        title: "Realidad vs. Mitos",
                        content: "Producción con luz de día (no solo sol directo). Ahorro inmediato vs. Inflación de red."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Practica tu respuesta al mito: 'Voy a esperar a que los paneles sean más eficientes'. ¿Cómo usarías el costo de la inacción?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre beneficios del mercado, ITC y manejo de mitos industriales."
            }
        ],
    },

    // ─── MÓDULO 1.5 — Fundamentos de Tecnología ${WHITE_LABEL.industry} ────────────────────────────────
    "mod_1_5": {
        id: "mod_1_5",
        title: `Módulo 1.5: Fundamentos de Tecnología ${WHITE_LABEL.industry}`,
        subtitle: "Hablar con autoridad técnica Responder preguntas de propietarios con confianza Evitar sonar como un representante típico",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: `Hablar con autoridad técnica sin usar jerga confusa es lo que te separa del vendedor promedio. El flujo es simple: los paneles capturan luz y generan energía DC, el inversor la traduce a CA para el hogar, y el exceso se envía a la red mediante 'net metering'. Debes conocer tus garantías: 25 años en rendimiento, 10-25 en inversores y 10 en mano de obra. Ser honesto sobre lo que el sistema NO hace (como funcionar en apagones sin batería) es fundamental para construir integridad.`
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Ecosistema Tecnológico",
                        content: "Paneles (Generación) -> Inversor (Conversión) -> Medidor (Medición Neta)."
                    },
                    {
                        title: "Garantías de Clase Mundial",
                        content: "Rendimiento (25 años), Hardware (10-25 años) y Mano de Obra (10 años)."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Explica el proceso de medición neta (Net Metering) como si se lo contaras a un niño de 10 años. ¿Cómo simplificarías la conversión de energía?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba de conocimientos técnicos sobre componentes, flujo de energía y garantías."
            }
        ],
    },

    // ─── MÓDULO 1.5a — Física ${WHITE_LABEL.industry} Simplificada ────────────────────────────────
    "mod_1_5a": {
        id: "mod_1_5a",
        title: `Módulo 1.5a: Física ${WHITE_LABEL.industry} Simplificada`,
        subtitle: "Entiende cómo la luz se convierte en energía sin jerga técnica",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: `Entender la física del ${WHITE_LABEL.industry.toLowerCase()} no requiere un doctorado, sino la capacidad de explicarlo de forma sencilla. Los paneles capturan fotones que liberan electrones, creando corriente directa (DC). Como tu casa usa corriente alterna (CA), el inversor actúa como el traductor esencial. Es vital que el propietario entienda que la producción sigue una curva de campana: alcanza su pico al mediodía y varía según las estaciones, siendo más alta en verano debido a la mayor duración del día.`
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Inversor: Tu Traductor de Energía",
                        content: "Paneles (DC) -> Inversor -> Hogar/Red (CA). Sin inversor, la energía no es utilizable."
                    },
                    {
                        title: "La Curva de Campana",
                        content: "Pico de producción al mediodía. Variabilidad estacional según la luz solar disponible."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Describe cómo explicarías a un cliente por qué su sistema produce menos en diciembre que en junio sin que se sienta decepcionado."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre la conversión de energía DC/CA y patrones de producción diaria/estacional."
            }
        ],
    },

    // ─── MÓDULO 1.5b — Fundamentos de Inversores y Baterías ────────────────────────────────
    "mod_1_5b": {
        id: "mod_1_5b",
        title: "Módulo 1.5b: Fundamentos de Inversores y Baterías",
        subtitle: "Aprende a diferenciar el hardware y manejar expectativas de respaldo",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La tecnología solar no es igual para todos los techos. En este módulo, aprenderás la diferencia crucial entre inversores de cadena y microinversores. Mientras que un inversor de cadena centraliza el procesamiento de energía de todos los paneles —lo que significa que una pequeña sombra en un panel puede afectar a todo el sistema— los microinversores trabajan de forma independiente en cada panel, maximizando la eficiencia incluso en condiciones difíciles. Además, exploraremos el papel real de las baterías: no son solo para apagones, sino herramientas estratégicas para ahorrar dinero durante las horas de mayor costo de la red (TOU), permitiendo a los propietarios usar su propia energía guardada cuando la electricidad de la red es más cara."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Inversores de Cadena vs. Microinversores",
                        content: "Visualización de la diferencia entre sistemas centralizados y modulares."
                    },
                    {
                        title: "La Realidad de las Baterías",
                        content: "Circuitos críticos vs. Respaldo de toda la casa."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Reflexiona sobre cómo explicarías la diferencia entre un apagón total y el uso de circuitos críticos a un propietario que espera que su aire acondicionado funcione indefinidamente con una sola batería."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre tipos de inversores y la función principal de la batería en mercados TOU."
            }
        ],
    },

    "mod_1_5c": {
        id: "mod_1_5c",
        title: "Módulo 1.5c: Estructuras Financieras",
        subtitle: "Comprender Efectivo, Préstamo y PPA/Arrendamiento",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La energía solar no es un producto financiero único. Este módulo entrena a los representantes en las tres formas principales en que un propietario puede pagar por su sistema: Efectivo, Préstamo y Propiedad de Terceros (Arrendamiento o PPA). El objetivo es enseñar cómo emparejar el vehículo financiero adecuado con los objetivos específicos del propietario. Introduciremos el concepto de 'Cambiar su Factura', reemplazando un gasto impredecible por un pago fijo con fecha de finalización. También cubriremos el Crédito Fiscal por Inversión Federal (ITC) del 30%, enfatizando la importancia de la ética: nunca garantices el crédito ni des consejos fiscales, siempre recomienda consultar con un profesional."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Opciones de Financiamiento",
                        content: "Comparación de Efectivo vs. Préstamo vs. PPA."
                    },
                    {
                        title: "Cumplimiento del ITC",
                        content: "Cómo hablar del crédito fiscal sin riesgos legales."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe el guion exacto que usarías para explicar el concepto de 'Cambiar su Factura' a un propietario escéptico."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Cuestionario sobre los beneficios de cada estructura financiera y límites de asesoría fiscal."
            }
        ],
    },

    // ─── MÓDULO 1.6 — Cambio de Identidad: Consultor vs. Vendedor ────────────────────────────────
    "mod_1_6": {
        id: "mod_1_6",
        title: "Módulo 1.6: Cambio de Identidad: Consultor vs. Vendedor",
        subtitle: "Adopta una mentalidad de consultoría basada en la integridad y el servicio.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Para tener éxito en esta industria, debes dejar de ser un vendedor que empuja productos y convertirte en un consultor que diagnostica problemas y prescribe soluciones. Un consultor prioriza la integridad sobre la comisión, estando dispuesto incluso a retirarse si el sistema no es la mejor opción para el cliente. Esta mentalidad genera confianza instantánea y es la base de una carrera sostenible. Además, el dominio del rechazo es fundamental: cada 'no' no es un rechazo personal, sino un paso necesario en el camino estadístico hacia el 'sí'. Gestionar tu energía emocional y celebrar las pequeñas victorias en cada puerta es lo que separa a los profesionales de alto rendimiento del resto."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Vendedor vs. Consultor",
                        content: "Comparativa de comportamientos, objetivos y percepción del cliente."
                    },
                    {
                        title: "El Credo de la Integridad",
                        content: "Los pilares de la ética profesional y la descalificación agresiva."
                    },
                    {
                        title: "Psicología del Rechazo",
                        content: "Cómo replantear los 'no' como datos estadísticos y proteger tu energía."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Reflexiona sobre tu transición a consultor. ¿Qué cambio específico harás en tu próxima interacción para demostrar que estás diagnosticando y no solo vendiendo?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre los principios del Credo de la Integridad y la gestión emocional del rechazo."
            }
        ],
    },

    // ─── MÓDULO 1.7 — Dominio de la Factura de Servicios Públicos ────────────────────────────────
    "mod_1_7": {
        id: "mod_1_7",
        title: "Módulo 1.7: Dominio de la Factura de Servicios Públicos",
        subtitle: "Aprende a leer facturas y calificar hogares con precisión técnica.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La factura de servicios públicos es tu herramienta de calificación más poderosa. Debes ser capaz de identificar en segundos el uso mensual de kilovatios-hora (kWh), la estructura tarifaria y el historial de consumo de doce meses. Buscamos umbrales mínimos de 600 kWh mensuales o facturas de al menos $100 para asegurar que el sistema sea financieramente viable. Es crucial detectar señales de alerta como saldos vencidos o facturación presupuestada que oculte el uso real. Finalmente, entender el 'Porcentaje de Compensación' —cuánta energía produce el sistema frente a lo que el hogar consume— es vital para diseñar propuestas honestas y efectivas, generalmente apuntando a un 105% o 110% de cobertura."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Anatomía de la Factura",
                        content: "Identificación de kWh, tarifas fijas vs. variables y cargos de entrega."
                    },
                    {
                        title: "Umbrales de Calificación",
                        content: "Por qué 600 kWh es el punto de partida para una propuesta sólida."
                    },
                    {
                        title: "Banderas Rojas",
                        content: "Cómo manejar facturación promediada y consumos sospechosamente bajos."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Practica el cálculo del porcentaje de compensación ideal para una factura con historial de uso creciente."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen de lectura de facturas y criterios de calificación de prospectos."
            }
        ],
    },

    // ─── MÓDULO 1.7a — Conciencia Básica de Ingeniería del Sitio ────────────────────────────────
    "mod_1_7a": {
        id: "mod_1_7a",
        title: "Módulo 1.7a: Conciencia Básica de Ingeniería del Sitio",
        subtitle: "Ve más, promete menos, cierra mejor.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La 'Conciencia de Ingeniería del Sitio' es la capacidad de detectar señales de alerta técnica antes de que se conviertan en problemas post-venta. Lo más crítico es evaluar el panel eléctrico: un panel de 100 amperios a menudo requerirá una actualización (MPU) para soportar un sistema solar moderno, algo que debe comunicarse al cliente de inmediato. En el techo, debemos evaluar el 'Azimut' u orientación (preferiblemente al sur), la presencia de sombras persistentes y la condición estructural de las tejas. Detectar estas variables tempranamente genera confianza y evita cancelaciones costosas después de que el ingeniero visite el sitio."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Inspección del Panel Eléctrico",
                        content: "Cómo identificar amperaje y espacio para interruptores."
                    },
                    {
                        title: "Evaluación del Techo",
                        content: "Azimut, inclinación y detección de sombras críticas."
                    },
                    {
                        title: "Señales de Alerta Estructurales",
                        content: "Cuándo recomendar una inspección de techo antes de proceder."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Redacta una explicación profesional para un cliente cuyo techo está orientado al norte y tiene árboles altos, explicando por qué no es el mejor candidato."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre amperaje de paneles y factores de viabilidad del techo."
            }
        ],
    },

    // ─── MÓDULO 1.8 — Resumen y Vista Previa del Día 1 ────────────────────────────────
    "mod_1_8": {
        id: "mod_1_8",
        title: "Módulo 1.8: Resumen y Vista Previa del Día 1",
        subtitle: "Consolidación de fundamentos y preparación para el trabajo de campo.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Has completado el Día 1 de tu entrenamiento. Ahora tienes una comprensión técnica de la energía solar, conoces las estructuras financieras básicas y, lo más importante, has adoptado la identidad de un consultor profesional. Mañana nos enfocaremos en la psicología del propietario y el dominio del territorio. Tu tarea para esta noche es ver los videos sobre medición neta (Net Metering), leer la guía de manejo de objeciones y practicar tu explicación técnica del sistema con alguien de confianza. El éxito en esta industria se construye sobre la preparación constante y la capacidad de comunicar conceptos complejos de forma sencilla."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Repaso del Día 1",
                        content: "Hitos alcanzados: Tecnología, Finanzas y Mentalidad."
                    },
                    {
                        title: "Hoja de Ruta del Día 2",
                        content: "Psicología del cliente, Prospección y el Marco de Conversación."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "¿Cuál fue el concepto más desafiante de hoy y cómo planeas dominarlo antes de salir al campo?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Resumen final de conceptos clave del Día 1."
            }
        ],
    },

    // ─── MÓDULO 2.1 — Psicología del Propietario ───────────────────────────────
    "mod_2_1": {
        id: "mod_2_1",
        title: `Módulo 2.1: Psicología del Propietario: Por Qué la Gente Resiste el ${WHITE_LABEL.industry}`,
        subtitle: `Comprende las barreras psicológicas que los propietarios traen a cada conversación ${WHITE_LABEL.industry.toLowerCase()}.`,
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: `Vender ${WHITE_LABEL.industry.toLowerCase()} no es una batalla de información, sino de psicología. El mayor obstáculo es el 'Sesgo del Statu Quo', donde el cerebro prefiere la seguridad (aunque sea costosa) de seguir con la compañía eléctrica a la incertidumbre del cambio. Debes entender que las personas sufren más por lo que pierden que por lo que ganan; por eso, mostrar cómo están perdiendo dinero cada mes es más potente que prometer ahorros futuros. Tu éxito depende de tu capacidad para construir un puente de confianza sobre sus experiencias previas negativas con contratistas, moviéndote despacio y diagnosticando antes de prescribir.`
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Sesgo del Statu Quo",
                        content: "El cerebro prefiere lo familiar aunque sea malo. Tu trabajo es hacer que la inacción se sienta más arriesgada que el cambio."
                    },
                    {
                        title: "Aversión a la Pérdida",
                        content: "Enmarcar el ahorro como 'detener una pérdida' es 2 veces más efectivo que mostrar una ganancia."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Identifica una objeción común y replanteala usando el concepto de aversión a la pérdida. ¿Cómo harías que el cliente sienta el costo de no actuar?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre sesgos cognitivos y la importancia de la confianza en la venta consultiva."
            }
        ],
    },

    // ─── MÓDULO 2.2 — Estrategia y Planificación de Territorio ─────────────────
    "mod_2_2": {
        id: "mod_2_2",
        title: "Módulo 2.2: Estrategia y Planificación de Territorio",
        subtitle: "Elige vecindarios de alta probabilidad. Aprovecha la proximidad de instalaciones.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: `La planificación de territorio separa a los que 'trabajan duro' de los que 'trabajan inteligentemente'. No todos los vecindarios son iguales; buscamos áreas con hogares de valor estable ($250k+), techos en buen estado y, lo más importante, proximidad a instalaciones recientes. Usar la 'Estrategia del Trébol' —trabajar alrededor de una instalación activa— te da prueba social inmediata. El vecino no es un extraño, es un referente. Antes de tocar, usa herramientas como Zillow o registros públicos para asegurarte de que el área tiene políticas favorables de medición neta (NEM) y que no estás perdiendo el tiempo en cooperativas eléctricas con tarifas prohibitivas.`
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "La Estrategia del Trébol",
                        content: "Instalación central -> Referencia a vecinos inmediatos. La prueba social reduce la fricción en la puerta."
                    },
                    {
                        title: "Filtros de Calificación",
                        content: "Valor del hogar, edad del techo (5-15 años) y políticas de la empresa de servicios públicos."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Enumera tres vecindarios en tu área que cumplan con estos criterios y explica por qué los elegiste para tu próxima semana de trabajo."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Cuestionario sobre selección de territorio y el uso de la prueba social en la prospección."
            }
        ],
    },

    // ─── MÓDULO 2.3 — Matemáticas de Eficiencia Diaria ─────────────────────────
    "mod_2_3": {
        id: "mod_2_3",
        title: "Módulo 2.3: Matemáticas de Eficiencia Diaria y Gestión del Tiempo",
        subtitle: "Comprende el ingreso por hora. Maximiza las horas doradas.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El éxito en las ventas solares es un juego de números. En promedio, 45 puertas equivalen a un cierre. Con una comisión de $3,500, cada puerta que tocas vale $78, independientemente de si te abren o te rechazan. Entender esto transforma tu percepción del rechazo: ya no es una pérdida, sino un paso necesario hacia el cobro. Tu recurso más valioso son las 'Horas Doradas' (de 2 PM a 7 PM). Durante este tiempo, tu única función es prospectar. Nada de administración, nada de mandados. Si proteges estas horas con disciplina férrea, tu pipeline nunca se secará."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Valor de la Puerta",
                        content: "Calculando el ingreso por hora: $389/hr durante las horas doradas. Cada 'no' te acerca al 'sí' de $3,500."
                    },
                    {
                        title: "Disciplina de Horas Doradas",
                        content: "2 PM - 7 PM: Tiempo sagrado de prospección. Objetivo: Mínimo 2 citas por sesión."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe tu plan de acción para proteger tus Horas Doradas. ¿Qué distracciones eliminarás y cómo medirás tu éxito diario?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre métricas de eficiencia, valor de la actividad y gestión del tiempo."
            }
        ],
    },

    // ─── MÓDULO 2.4 — El Marco de Conversación ${WHITE_LABEL.industry} ────────────────────────────
    "mod_2_4": {
        id: "mod_2_4",
        title: `Módulo 2.4: El Marco de Conversación ${WHITE_LABEL.industry}: Introducción`,
        subtitle: `Aprende el arco de 7 pasos para cada conversación ${WHITE_LABEL.industry.toLowerCase()}.`,
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: `Cada conversación exitosa en la industria del ${WHITE_LABEL.industry.toLowerCase()} sigue un arco predecible de 7 pasos. Este 'GPS' conversacional te guía desde la interrupción del patrón inicial hasta el agendamiento de la cita. El error más común es saltar directamente a la venta. Debes dominar la secuencia: Interrupción, Rapport, Curiosidad, Conciencia del Problema, Descubrimiento de Factura, Calificación y Cierre. En la puerta, este marco se comprime en 60-90 segundos de alta intensidad donde tu objetivo no es vender el sistema, sino vender la curiosidad necesaria para una cita formal.`
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los 7 Pasos del Éxito",
                        content: "1. Interrupción, 2. Rapport, 3. Curiosidad, 4. Problema, 5. Factura, 6. Calificación, 7. Cita."
                    },
                    {
                        title: "El Pitch de 60 Segundos",
                        content: "Cómo ejecutar el marco completo en la puerta sin sonar como un vendedor desesperado."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Memoriza los 7 pasos. Escribe un guion breve para cada uno que se sienta natural para tu personalidad."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen sobre la secuencia lógica del marco de conversación y objetivos de cada fase."
            }
        ],
    },

    // ─── MÓDULO 2.5 — Dominio de la Venta Puerta a Puerta ──────────────────────
    "mod_2_5": {
        id: "mod_2_5",
        title: "Módulo 2.5: Dominio de la Venta Puerta a Puerta",
        subtitle: "Supera la ansiedad ante la puerta. Domina el pitch de 30 segundos.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El dominio en la puerta comienza antes de tocar. Tu apariencia, tu gafete visible y tu calma transmiten autoridad. Tienes tres herramientas principales para abrir la conversación: la Referencia al Vecino (prueba social), la Auditoría de Factura (baja presión) y la Proximidad de Instalación. No estás allí para convencer, sino para calificar. Al cerrar la cita, usa el 'Cierre Binario': ofrece dos horarios específicos en lugar de preguntar si quieren la cita. '¿Te queda mejor el jueves a las 6 o el sábado a las 10?'. Esta técnica asume el interés y simplifica la decisión para el propietario."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los 3 Openers Probados",
                        content: "1. Vecino de la esquina (Prueba Social), 2. Auditoría de Factura (Curiosidad), 3. Obras en curso (Urgencia)."
                    },
                    {
                        title: "El Cierre Binario Asuntivo",
                        content: "Nunca preguntes 'si'. Siempre ofrece 'cuándo'. Dos opciones de horario aumentan la conversión un 40%."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Elige uno de los 3 openers y adáptalo a tu voz. Escribe exactamente qué dirías en los primeros 15 segundos después de que se abra la puerta."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre openers tácticos y la psicología del cierre binario."
            }
        ],
    },

    // ─── MÓDULO 2.6 — Manejo de Micro-Objeciones ────────────────────────────────
    "mod_2_6": {
        id: "mod_2_6",
        title: "Módulo 2.6: Manejo de Micro-Objeciones: Superando el Rechazo Automático",
        subtitle: "Aprende a superar las respuestas automáticas en la puerta.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Las micro-objeciones no son un 'no' definitivo; son reflejos automáticos del cerebro para proteger el tiempo del propietario. Cuando alguien dice 'no me interesa' antes de que termines, no está rechazando el producto, sino la interrupción. La clave es neutralizar la tensión con curiosidad. Responde con: 'Totalmente válido, solo por curiosidad, ¿ya habías investigado esto antes o simplemente no has tenido tiempo?'. Esta pregunta desarma el reflejo defensivo y reabre la comunicación. Recuerda: nunca argumentes, siempre valida y redirige con una pregunta abierta."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El 'No Me Interesa' Reflejo",
                        content: "Cómo usar la validación y la curiosidad para pasar de un muro a una conversación abierta."
                    },
                    {
                        title: "Manejo del Cónyuge Ausente",
                        content: "La importancia de agendar cuando ambos tomadores de decisión estén presentes para evitar cancelaciones."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe una respuesta para la objeción 'estoy muy ocupado ahora' que no suene a vendedor agresivo pero que mantenga la puerta abierta para agendar."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Cuestionario sobre la psicología de las micro-objeciones y técnicas de redirección curiosa."
            }
        ],
    },

    // ─── MÓDULO 2.7 — Agendamiento de Citas por Teléfono ────────────────────────
    "mod_2_7": {
        id: "mod_2_7",
        title: "Módulo 2.7: Agendamiento de Citas por Teléfono y Virtual",
        subtitle: "Convierte leads entrantes en citas. Domina la tonalidad.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El agendamiento telefónico se gana o se pierde en los primeros cinco minutos. La 'Velocidad de Respuesta' es el factor más determinante: si llamas a un lead mientras su curiosidad está alta, tu probabilidad de agendar es 10 veces mayor que si esperas una hora. Tu tonalidad debe transmitir entusiasmo equilibrado con profesionalismo. No llames para vender, llama para confirmar los detalles de su solicitud y haz 3-5 preguntas clave de descubrimiento. Una vez que entiendas su motivación, transiciona suavemente a la cita ofreciendo dos opciones de horario, manteniendo el control de la conversación en todo momento."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "La Regla de Oro de los 5 Minutos",
                        content: "La conversión cae drásticamente después de 30 minutos. Responde rápido, gana el acuerdo."
                    },
                    {
                        title: "Descubrimiento y Agendamiento",
                        content: "Preguntas de calificación telefónica -> Transición al Cierre Binario."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe tu secuencia de contacto (llamada, texto, correo) para un lead que no responde al primer intento. ¿Cuántas veces insistirás antes de desistir?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen sobre métricas de velocidad de respuesta y estructura de llamadas de prospección."
            }
        ],
    },

    // ─── MÓDULO 2.8 — Encuadre Anti-Ventas y Confianza ──────────────────────────
    "mod_2_8": {
        id: "mod_2_8",
        title: "Módulo 2.8: Encuadre Anti-Ventas y Construcción de Confianza",
        subtitle: "Posiciónate como consultor, no como vendedor. Usa lenguaje que desarma.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La confianza no se pide, se construye mediante el encuadre correcto. El 'Encuadre Anti-Ventas' desactiva las defensas del propietario al declarar honestamente: 'No estoy aquí para venderte nada hoy, solo para ver si esto tiene sentido'. Esto te posiciona como un consultor selectivo. Lleva esto un paso más allá con la 'Descalificación': al mencionar que el sistema no es para todos y que primero debes verificar si su hogar califica, activas el deseo del cliente de ser elegido. Esta psicología inversa elimina la dinámica de persecución y te otorga la autoridad necesaria para liderar la conversación hacia un cierre exitoso."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Poder del Anti-Pitch",
                        content: "Bajar la guardia del cliente mediante la honestidad radical y la falta de presión."
                    },
                    {
                        title: "Dominando la Descalificación",
                        content: "Cómo posicionarte como el experto que elige con quién trabajar, no como el vendedor que ruega por un contrato."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Redacta tu propia declaración de 'Encuadre Anti-Ventas'. ¿Cómo te sientes al decir que tal vez no puedas ayudarlos?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Cuestionario final sobre principios de autoridad, descalificación y mentalidad consultiva."
            }
        ],
    },

    // ─── MÓDULO 3.1 — Preparación Mental y Control del Entorno ──────────────
    "mod_3_1": {
        id: "mod_3_1",
        title: "Módulo 3.1: Preparación Mental y Control del Entorno",
        subtitle: "Controla el entorno de la cita. Construye autoridad subconsciente.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El éxito de una cita se decide antes de entrar al hogar. La preparación comienza con una confirmación por texto dos horas antes, proyectando profesionalismo. Al llegar, estaciona frente a la casa para evaluar el techo desde el auto, buscando sombras o daños visibles. Una vez dentro, tu objetivo es el 'Asiento de Poder': evita el sofá y dirígete al comedor o la cocina, donde la dinámica es de trabajo y colaboración, no de relajación. Elimina distracciones como televisores o mascotas para asegurar que el propietario esté 100% presente durante el descubrimiento y la propuesta."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Lista de Verificación Pre-Llegada",
                        content: "Confirmación por texto, estacionamiento estratégico y evaluación externa del techo."
                    },
                    {
                        title: "La Estrategia del Asiento de Poder",
                        content: "Mesa de comedor vs. Sofá. Por qué el entorno físico determina tu autoridad como consultor."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "¿Cómo manejarás de forma cortés pero firme las distracciones comunes (TV, niños, mascotas) para mantener el control de la cita?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre protocolos de llegada y la psicología del posicionamiento físico en el hogar."
            }
        ]
    },

    // ─── MÓDULO 3.2 — La Apertura: Del Saludo al Control de la Mesa ───────────
    "mod_3_2": {
        id: "mod_3_2",
        title: "Módulo 3.2: La Apertura: Del Saludo al Control de la Mesa",
        subtitle: "Establece el tono de autoridad desde el primer segundo.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La apertura no es una charla trivial; es el momento en que estableces quién lidera la conversación. El objetivo es transicionar del saludo informal a un encuadre profesional donde el cliente te vea como el experto. Utiliza el 'Encuadre de la Agenda': explica exactamente qué va a pasar en la cita, cuánto durará y qué se espera de ellos. Esto elimina la ansiedad del cliente y te otorga permiso para hacer preguntas difíciles más adelante. Si pierdes el control en los primeros 5 minutos, pasarás el resto de la cita defendiéndote en lugar de asesorando."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Saludo de Poder",
                        content: "Contacto visual, postura firme y una sonrisa profesional. El lenguaje no verbal cierra tratos."
                    },
                    {
                        title: "Encuadre de la Agenda",
                        content: "1. Descubrimiento, 2. Diseño, 3. Financiamiento, 4. Próximos pasos. Sin sorpresas, sin miedos."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe tu guion de apertura de 30 segundos. Incluye el objetivo de la reunión y la agenda clara."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre técnicas de encuadre y control de la conversación inicial."
            }
        ]
    },

    // ─── MÓDULO 3.3 — La Psicología del Descubrimiento ────────────────────────
    "mod_3_3": {
        id: "mod_3_3",
        title: "Módulo 3.3: La Psicología del Descubrimiento",
        subtitle: "Entiende el 'por qué' antes del 'qué'.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Vender solar no es vender paneles; es vender una solución a un problema emocional o financiero. La psicología del descubrimiento se basa en la 'Empatía Táctica': reconocer el sentimiento del cliente sin juzgarlo. Al usar etiquetas como 'Parece que la incertidumbre de la red le preocupa', abres la puerta a que el cliente revele sus miedos reales. El objetivo es que ellos mismos descubran por qué el status quo es insostenible. Si tú lo dices, es una venta; si ellos lo dicen, es una verdad. Domina el silencio para permitir que el cliente procese y expanda sus respuestas."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Empatía Táctica",
                        content: "Identificar y nombrar la emoción para desactivar la resistencia."
                    },
                    {
                        title: "El Valor del 'No'",
                        content: "Da permiso al cliente para decir que no al principio. Esto baja sus defensas y permite una charla honesta."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Practica 3 etiquetas emocionales para responder a la duda del cliente sobre el ahorro."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre principios de psicología de ventas y escucha activa."
            }
        ]
    },

    // ─── MÓDULO 3.4 — Descubrimiento Emocional y el Método BOLT ───────────────
    "mod_3_4": {
        id: "mod_3_4",
        title: "Módulo 3.4: Descubrimiento Emocional y el Método BOLT",
        subtitle: "Adapta tu estilo a la personalidad del cliente.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "No todos los propietarios compran por las mismas razones. El marco BOLT divide las personalidades en: Bull (directo y orientado a resultados), Owl (analítico y amante de los datos), Lion (social y entusiasta) y Turtle (paciente y adverso al riesgo). Identificar el perfil en los primeros minutos te permite 'espejear' su ritmo y prioridades. Mientras que un Bull quiere ver el ROI de inmediato, un Owl querrá revisar las especificaciones de los paneles. Adaptar tu comunicación no es manipular, es hablar el idioma que el cliente entiende mejor para sentirse seguro en su decisión."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los 4 Tipos BOLT",
                        content: "Bull (Dominancia), Owl (Analítico), Lion (Influencia), Turtle (Estabilidad)."
                    },
                    {
                        title: "Espejeo y Etiquetado",
                        content: "Ajusta tu velocidad y tono según el perfil. Sé un espejo de sus prioridades."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Clasifica a tus últimos 3 prospectos según el marco BOLT. ¿Cómo cambiarías tu enfoque con ellos?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Cuestionario para identificar rasgos clave de cada personalidad BOLT."
            }
        ]
    },

    // ─── MÓDULO 3.5 — Las 12 Preguntas Técnicas de Descubrimiento ─────────────
    "mod_3_5": {
        id: "mod_3_5",
        title: "Módulo 3.5: Las 12 Preguntas Técnicas de Descubrimiento",
        subtitle: "Excava el dolor real y construye la urgencia financiera.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El descubrimiento técnico no es una lista de verificación, es una arquitectura de urgencia. Debes dominar la secuencia de las 12 preguntas que guían al cliente desde su frustración actual hasta la necesidad de una solución inmediata. Comienza con el diagnóstico de la factura, pasa por la relación con la utilidad y termina con las metas de independencia energética. Cada pregunta tiene un propósito: revelar un costo oculto o una vulnerabilidad. Si haces las preguntas correctas, el cliente llegará a la conclusión de que no irse a solar es la opción más cara y arriesgada."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "La Secuencia de Oro",
                        content: "Desde el '¿Cuánto paga hoy?' hasta el '¿Qué hará cuando la luz suba otro 10%?'."
                    },
                    {
                        title: "Creando el Abismo",
                        content: "Visualiza el costo de la inacción frente a los beneficios de la propiedad energética."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe las 5 preguntas que consideras más poderosas para generar una respuesta emocional del cliente."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre la lógica detrás de la secuencia de descubrimiento de 12 preguntas."
            }
        ]
    },

    // ─── MÓDULO 3.6 — Auditoría de Sitio y Evaluación del Techo ───────────────
    "mod_3_6": {
        id: "mod_3_6",
        title: "Módulo 3.6: Auditoría de Sitio y Evaluación del Techo",
        subtitle: "Detecta obstáculos técnicos antes de que se conviertan en problemas.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Tu credibilidad como consultor depende de tu capacidad para prever problemas técnicos. Durante la auditoría de sitio, debes evaluar el estado del techo (¿necesita reemplazo?), la capacidad del panel eléctrico (¿requiere MPU?) y las fuentes de sombreado (árboles o chimeneas). Una propuesta brillante sobre un techo podrido es una receta para el desastre. Sé honesto sobre lo que ves. Si detectas un problema, menciónalo de inmediato: 'Para que este sistema dure 25 años, primero debemos ocuparnos de esto'. Esta honestidad radical construye más confianza que cualquier promesa de ahorro."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Variables Críticas del Sitio",
                        content: "Edad del techo, material, azimut y sombreado. Los pilares de un buen diseño."
                    },
                    {
                        title: "El Panel Eléctrico",
                        content: "Cómo identificar un panel de 100A vs. 200A y por qué es vital para el cumplimiento."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Dibuja un diagrama de un techo real que hayas visitado y marca las zonas de sombreado críticas."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre materiales de techo y requisitos de infraestructura eléctrica."
            }
        ]
    },

    // ─── MÓDULO 3.7 — Dominio de la Descalificación ───────────────────────────
    "mod_3_7": {
        id: "mod_3_7",
        title: "Módulo 3.7: Dominio de la Descalificación: Cuándo Retirarse",
        subtitle: "Protege tu tiempo y tu reputación profesional.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La descalificación es la herramienta definitiva para construir autoridad. Al declarar honestamente que un cliente no califica debido a factores como un puntaje FICO bajo, un techo en mal estado o sombra excesiva, demuestras que tu prioridad es el éxito del proyecto, no tu comisión. Esto crea una paradoja: mientras más dispuesto estés a retirarte de un mal acuerdo, más confiarán los clientes en tus recomendaciones. Aprende a decir 'no' con respeto. Un mal proyecto hoy es una pesadilla de soporte mañana que destruirá tu reputación. Califica duro para cerrar fácil."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los 5 Criterios de Descalificación",
                        content: "Crédito, Estado del Techo, Sombreado, Consumo Bajo y Mudanza Inminente."
                    },
                    {
                        title: "La Psicología del Retiro",
                        content: "Cómo ganar el respeto del cliente siendo el primero en decir que la inversión no tiene sentido para ellos."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Describe una situación donde descalificaste un trato y qué efecto tuvo en tu credibilidad con ese cliente."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre criterios técnicos y financieros para descalificar proyectos de forma ética."
            }
        ]
    },

    // ─── MÓDULO 3.7a — Preguntas Técnicas de Descubrimiento ────────────────────
    "mod_3_7a": {
        id: "mod_3_7a",
        title: "Módulo 3.7a: Preguntas Técnicas de Descubrimiento",
        subtitle: "Detecta riesgos del proyecto antes de la encuesta.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El descubrimiento técnico no debe sentirse como una inspección aburrida, sino como una asesoría de ingeniería. Debes preguntar sobre la edad del techo, la capacidad del panel eléctrico (¿100A o 200A?) y planes futuros que afecten el consumo, como la compra de un vehículo eléctrico o la instalación de una piscina. Estas preguntas 'venden' tu experiencia y evitan que el equipo de instalación encuentre sorpresas costosas. Al recopilar estos datos, demuestras que te importa la viabilidad técnica tanto como el ahorro financiero."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Panel Eléctrico",
                        content: "Cómo identificar un panel antiguo y por qué es crítico para la seguridad del sistema."
                    },
                    {
                        title: "Variables del Techo",
                        content: "Azimut, inclinación y detección de sombras. La ingeniería empieza en la primera visita."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Haz una lista de las 3 señales de alerta técnica que más te preocuparían encontrar en un panel eléctrico."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre protocolos de auditoría de sitio y documentación fotográfica necesaria."
            }
        ]
    },

    // ─── MÓDULO 3.7b — Preparación de la Encuesta ─────────────────────────────
    "mod_3_7b": {
        id: "mod_3_7b",
        title: "Módulo 3.7b: Preparación de la Encuesta",
        subtitle: "Asegura una transición suave hacia la ingeniería del sitio.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La encuesta del sitio es el puente entre tu venta y la instalación real. Tu trabajo es preparar al cliente para que el ingeniero pueda hacer su trabajo sin fricciones. Debes asegurar el acceso al panel eléctrico, al ático y al inversor (si corresponde). Explicar al cliente que esto es un paso de seguridad para validar que su hogar es apto para el sistema solar refuerza tu profesionalismo. Una buena preparación reduce los tiempos de instalación y evita que el cliente se sienta invadido cuando llegue el equipo técnico."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Lista de Verificación de Acceso",
                        content: "Ático despejado, panel accesible, mascotas seguras. El tiempo del ingeniero es oro."
                    },
                    {
                        title: "Manejo de Expectativas",
                        content: "Cómo explicar qué sucederá durante la encuesta sin alarmar al propietario."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "¿Cómo explicarías la importancia del acceso al ático a un cliente que tiene el clóset lleno de cajas bloqueando la entrada?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre requisitos de acceso y comunicación post-venta inmediata."
            }
        ]
    },

    // ─── MÓDULO 3.8 — Simulación de Descubrimiento Completo ────────────────────
    "mod_3_8": {
        id: "mod_3_8",
        title: "Módulo 3.8: Simulación de Descubrimiento Completo del Día 3",
        subtitle: "Pon a prueba tus habilidades de descubrimiento con nuestra IA.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Es hora de poner en práctica todo el arsenal del Día 3. En esta simulación, te enfrentarás a un propietario virtual con una personalidad específica (BOLT). Deberás controlar el entorno, aplicar empatía táctica para desactivar resistencias iniciales y ejecutar la secuencia de 12 preguntas de descubrimiento técnico y emocional. El objetivo no es cerrar el trato hoy, sino calificar perfectamente el proyecto y construir la urgencia necesaria para que el cliente desee ver tu propuesta. Tu gerente recibirá un reporte de tu desempeño en tonalidad y precisión de datos."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Reto del Día 3",
                        content: "Integración total: BOLT + Empatía + 12 Preguntas + Calificación Técnica."
                    },
                    {
                        title: "Métricas de Éxito",
                        content: "Cómo evaluará la IA tu capacidad para descubrir el 'dolor' real del cliente."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Prepara tus notas. Ten a la mano la lista de las 12 preguntas y los criterios de descalificación antes de iniciar la simulación."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Autoevaluación sobre el flujo de la simulación y áreas de mejora identificadas."
            }
        ]
    },

    // ─── MÓDULO 4.1 — Análisis Profundo de la Factura de Servicios Públicos ────────
    "mod_4_1": {
        id: "mod_4_1",
        title: "Módulo 4.1: Análisis Profundo de la Factura de Servicios Públicos",
        subtitle: "La 'Autopsia' de la factura: Revelando el verdadero costo de la energía.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El análisis de la factura no es solo leer números; es realizar una 'autopsia' financiera que revela la ineficiencia del modelo actual del cliente. La mayoría de los propietarios no entienden qué están pagando realmente. Tu trabajo es desglosar la factura en sus componentes críticos: cargos de distribución, generación, impuestos y cargos fijos. Al calcular el costo real por kWh (Total de la factura / kWh totales), rompes la ilusión de 'electricidad barata'. Además, al proyectar la inflación histórica de las tarifas eléctricas (3-5% anual) a 25 años, transformas una molestia mensual en un pasivo financiero masivo de seis cifras. Tu meta es que el cliente vea que 'no hacer nada' es, de hecho, la opción más costosa y arriesgada."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Las 3 Estructuras Tarifarias",
                        content: "Plana (Flat), Escalonada (Tiered) y por Uso en el Tiempo (TOU). Cada una requiere una estrategia de diseño diferente."
                    },
                    {
                        title: "La Lógica del True-Up",
                        content: "Cómo funciona el 'banco de energía' anual: produces en exceso en verano para compensar el consumo de invierno."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Realiza el cálculo del costo real por kWh de una factura de $250 con 800 kWh de consumo. Explica cómo le presentarías la inflación al cliente."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre estructuras tarifarias, cálculo de costo unitario y conceptos de compensación neta."
            }
        ],
    },

    // ─── MÓDULO 4.1a — Tarifas de Uso por Tiempo ────────────────────────────────
    "mod_4_1a": {
        id: "mod_4_1a",
        title: "Módulo 4.1a: Tarifas de Uso por Tiempo (TOU) y Estrategia",
        subtitle: "Dominando los horarios pico y el arbitraje de energía.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "En los mercados modernos de energía, el 'cuándo' consumes es tan importante como el 'cuánto'. Las tarifas TOU castigan el consumo durante las horas pico (usualmente de 4 PM a 9 PM) con precios que pueden duplicar o triplicar la tarifa base. Entender este ciclo es vital para vender baterías. El almacenamiento no es solo para emergencias; es una herramienta de 'arbitraje financiero' que permite cargar con sol gratuito durante el día y descargar energía propia durante las horas más caras de la noche. Dominar esta explicación transforma la batería de un lujo costoso en una inversión de ahorro acelerado."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "La Anatomía de TOU",
                        content: "Diferencia entre Off-Peak, Mid-Peak y Peak. Cómo leer el calendario de la empresa eléctrica."
                    },
                    {
                        title: "Arbitraje de Energía",
                        content: "Uso estratégico de la batería para evitar la compra de energía en horarios de máxima tarifa."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Identifica las horas pico en tu mercado local. Escribe un guion breve para explicar el valor de una batería en un escenario TOU."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen sobre horarios pico, arbitraje y lógica de descarga de batería."
            }
        ],
    },

    // ─── MÓDULO 4.2 — Análisis Profundo de Financiamiento ───────────────────────
    "mod_4_2": {
        id: "mod_4_2",
        title: "Módulo 4.2: Análisis Profundo de Financiamiento",
        subtitle: "Efectivo, Préstamos, PPA y Arrendamientos.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Dominar las estructuras financieras es lo que separa a un vendedor de paneles de un consultor energético. Existen dos 'cubetas' principales: Propiedad (Efectivo y Préstamo) y Terceros (PPA y Arrendamiento). En la propiedad, el cliente es dueño del activo, captura los incentivos y maximiza el ROI a largo plazo. En los modelos de terceros, una empresa externa es dueña del sistema y el cliente simplemente compra la energía a un costo menor que la red. Tu trabajo no es empujar un producto, sino guiar al cliente hacia la opción que mejor se alinee con sus metas fiscales, liquidez y planes de permanencia en el hogar."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Las Dos Cubetas Financieras",
                        content: "Propiedad (Dueño del activo, incentivos para ti) vs. Terceros (Dueño externo, tú solo ahorras en la tarifa)."
                    },
                    {
                        title: "Compra en Efectivo",
                        content: "Sin intereses, sin pagos mensuales, máximo ROI y recuperación de inversión más rápida."
                    },
                    {
                        title: "Préstamos Solares",
                        content: "Cero pago inicial. El pago mensual reemplaza la factura de luz mientras construyes plusvalía."
                    },
                    {
                        title: "PPA y Arrendamiento",
                        content: "Ideal para quienes no pueden usar créditos fiscales o prefieren no tener la responsabilidad del equipo."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Analiza el perfil de tres clientes diferentes y determina si les conviene Propiedad o PPA. Practica la explicación de las 'comisiones de distribuidor' (dealer fees) de forma honesta."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre las diferencias clave entre PPA y Préstamo, y quién captura los beneficios fiscales en cada modelo."
            }
        ],
    },

    // ─── MÓDULO 4.2a — Estrategia de Incentivos ────────────────────────────────
    "mod_4_2a": {
        id: "mod_4_2a",
        title: "Módulo 4.2a: Estrategia de Incentivos y Cumplimiento",
        subtitle: "Créditos fiscales federales, estatales y locales.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El panorama de los incentivos solares ha evolucionado de promesas agresivas a una postura de cumplimiento y transparencia. Como consultor, tu responsabilidad es informar sin garantizar resultados fiscales personales. Debes distinguir claramente entre un Crédito Fiscal (que reduce lo que debes al IRS y depende de tu situación tributaria) y un Reembolso (pago directo o descuento que no depende de impuestos). El uso de lenguaje de 'Verificación Primero' protege tu credibilidad y la de la empresa: siempre invita al cliente a consultar con su contador y nunca prometas un 'cheque del gobierno' como una garantía absoluta."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Categorías de Incentivos",
                        content: "Federales (ITC), Estatales (exenciones), de Utilidad (reembolsos por vatio) y Locales (subvenciones de ciudad)."
                    },
                    {
                        title: "Crédito Fiscal vs. Reembolso",
                        content: "El crédito reduce la deuda tributaria; el reembolso es dinero directo. No todos califican para el crédito federal de la misma forma."
                    },
                    {
                        title: "Lenguaje de Cumplimiento",
                        content: "Lo que PUEDES decir: 'Existen programas que pueden aplicar'. Lo que NO puedes decir: 'Recibirás un cheque del 30% garantizado'."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Practica tu 'descargo de responsabilidad' (disclaimer) fiscal. Identifica los incentivos específicos activos en tu mercado local hoy mismo."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre la diferencia entre crédito y reembolso, y las frases prohibidas por cumplimiento legal."
            }
        ],
    },

    // ─── MÓDULO 4.2b — Economía de Estructuras de Pago ──────────────────────────
    "mod_4_2b": {
        id: "mod_4_2b",
        title: "Módulo 4.2b: Economía de Efectivo vs. Préstamo vs. PPA vs. Arrendamiento",
        subtitle: "Comparación financiera profunda.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Entender la diferencia entre la propiedad (efectivo y préstamo) y las estructuras de terceros (PPA y arrendamiento) es fundamental para asesorar correctamente al cliente. La propiedad ofrece el mayor beneficio financiero a largo plazo y la elegibilidad para incentivos fiscales, pero requiere capital o crédito. Por otro lado, los modelos de terceros eliminan la barrera del costo inicial y el mantenimiento, pero el beneficio total es menor ya que la empresa financiera captura los incentivos. Tu objetivo es identificar cuál de estos 'cubos' financieros se alinea mejor con las prioridades de ahorro, control y perfil fiscal del propietario."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Efectivo vs. Financiado",
                        content: "Efectivo = Sin deuda, máximo ahorro. Préstamo = Cero inicial, pago mensual reemplaza la luz."
                    },
                    {
                        title: "PPA vs. Propiedad",
                        content: "¿Quién se queda con el 30% del ITC? Propiedad = Tú. PPA = La empresa financiera."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Crea una tabla comparativa de 10 años para los cuatro modelos basada en una factura de $200. ¿Cuál tiene el ahorro neto más alto?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre la elegibilidad del ITC y el costo total de propiedad en cada modelo financiero."
            }
        ],
    },

    // ─── MÓDULO 4.3 — El Stack de Valor ───────────────────────────────────────
    "mod_4_3": {
        id: "mod_4_3",
        title: "Módulo 4.3: El Stack de Valor — Más Allá del Dinero",
        subtitle: "Vender control, independencia y el futuro.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Si limitas tu propuesta solo al ahorro mensual, te conviertes en un producto genérico fácil de ignorar. El 'Stack de Valor' consiste en apilar múltiples beneficios que justifican la inversión más allá del dinero: el control total sobre tu energía, la independencia frente a las subidas de las empresas eléctricas, la resiliencia ante apagones y el compromiso con un futuro más limpio. Aprende a presentar cada pilar como una solución a un miedo o deseo específico del cliente, elevando la conversación de una simple transacción a una mejora de estilo de vida."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los 4 Pilares del Valor",
                        content: "Ahorro Financiero, Control de Energía, Resiliencia y Administración Ambiental."
                    },
                    {
                        title: "Control vs. Alquiler",
                        content: "Hoy alquilas la energía; con solar, tú eres el dueño de tu planta eléctrica."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Desarrolla tu propio 'discurso de valor' de 60 segundos que incluya los cuatro pilares sin sonar como un guion."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre cómo identificar los puntos de dolor del cliente para aplicar el Stack de Valor correctamente."
            }
        ],
    },

    // ─── MÓDULO 4.4 — Medición Neta y Realidad de la Batería ──────────────────
    "mod_4_4": {
        id: "mod_4_4",
        title: "Módulo 4.4: Medición Neta y Realidad de la Batería",
        subtitle: "Entiende el pilar de la economía solar.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La medición neta (Net Metering) es el pilar de la economía solar, permitiendo que los propietarios 'almacenen' el exceso de energía en la red. Sin embargo, con la evolución de las regulaciones hacia NEM 3.0, la batería ha pasado de ser un lujo a una necesidad táctica. Entender cómo estas dos tecnologías trabajan juntas para maximizar el ahorro es vital. No vendemos solo paneles; vendemos independencia energética y protección contra la inflación de las tarifas eléctricas. Dominar este concepto te permite explicar por qué el sistema solar tiene sentido financiero incluso cuando el sol no brilla."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "¿Qué es la Medición Neta?",
                        content: "La red eléctrica como una 'cuenta de ahorros' para tus electrones sobrantes."
                    },
                    {
                        title: "El Nuevo Paradigma: NEM 3.0",
                        content: "Por qué el enfoque ha cambiado de 'vender a la red' a 'consumir tu propia energía'."
                    },
                    {
                        title: "Baterías: Respaldo y Ahorro",
                        content: "Más allá del apagón: cómo la batería optimiza el uso de energía durante las horas pico."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Explica la diferencia entre NEM 2.0 y NEM 3.0 en tus propias palabras y cómo afecta la recomendación de una batería."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre conceptos de medición neta, almacenamiento de energía y optimización de tarifas."
            }
        ]
    },

    // ─── MÓDULO 4.4a — Medición Neta y Batería ────────────────────────────────
    "mod_4_4a": {
        id: "mod_4_4a",
        title: "Módulo 4.4a: Lógica de Ventas de NEM 3.0 y Baterías",
        subtitle: "Posicionando el almacenamiento como una herramienta económica.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El panorama de la medición neta ha cambiado drásticamente con la llegada de programas como NEM 3.0, donde el valor de la energía exportada a la red se ha reducido significativamente. Como consultor moderno, tu enfoque debe alejarse de la simple exportación 1:1 y centrarse en el autoconsumo inteligente. La batería ya no es solo un respaldo para apagones; es una herramienta financiera esencial que permite capturar el exceso de energía solar durante el día y utilizarla durante las horas pico de la noche, evitando las tarifas más caras de la red y maximizando el retorno de inversión del cliente."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "La Realidad de NEM 3.0",
                        content: "Los valores de exportación han caído entre un 75% y 80%. Enviar energía a la red ya no es un buen negocio."
                    },
                    {
                        title: "El Pitch de la Batería",
                        content: "No es para 'por si se va la luz'. Es para que no le regales tu energía a la compañía eléctrica."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Practica explicarle a un cliente por qué necesita una batería incluso si nunca hay apagones en su zona."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre la diferencia entre NEM 2.0 y NEM 3.0 y la lógica del arbitraje energético."
            }
        ],
    },

    // ─── MÓDULO 4.5 — Diseño del Sistema y Estimaciones de Producción ──────────
    "mod_4_5": {
        id: "mod_4_5",
        title: "Módulo 4.5: Diseño del Sistema y Estimaciones de Producción",
        subtitle: "La ciencia detrás de una promesa de ahorro real.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Un diseño preciso es la base de una promesa cumplida. En este módulo, aprenderás a interpretar los informes de producción solar, considerando factores críticos como la inclinación del techo, el sombreado de árboles cercanos y la degradación natural de los paneles con el tiempo. El objetivo es proporcionar al cliente una estimación realista de cuánto cubrirá el sistema solar de su consumo anual (Solar Offset). Un diseño honesto y bien fundamentado evita sorpresas negativas post-instalación y construye una reputación de integridad que genera referidos."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Modelado de Producción",
                        content: "Cómo el software calcula la energía basada en datos meteorológicos históricos y ubicación."
                    },
                    {
                        title: "El Factor de Sombreado",
                        content: "Entendiendo por qué un solo árbol puede impactar significativamente la producción de todo un array."
                    },
                    {
                        title: "Calculando el Offset",
                        content: "Consumo anual vs. Producción estimada. El punto dulce para maximizar el ROI del cliente."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Calcula el solar offset para una casa que consume 10,000 kWh anuales y un sistema que produce 8,500 kWh. ¿Qué le dirías al cliente sobre el 15% restante?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre variables de producción solar, interpretación de diseños y cálculo de offset."
            }
        ]
    },

    // ─── MÓDULO 4.5a — Diseño y Estimaciones de Producción ────────────────────
    "mod_4_5a": {
        id: "mod_4_5a",
        title: "Módulo 4.5a: Modelado Avanzado de ROI",
        subtitle: "Construyendo una historia financiera que resista el escrutinio.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Moverse más allá de la simple comparación de facturas es lo que define a un experto en SeptiVolt. El modelado avanzado de ROI requiere dominar cinco conceptos clave: compensación (offset), ahorros reales, periodo de recuperación (payback), inflación energética y degradación del sistema. Al presentar estos factores con transparencia absoluta y apoyarte en el concepto del 'costo de la inacción' (do-nothing cost), construyes una credibilidad inquebrantable. Tu objetivo es ayudar al cliente a entender que el gasto en energía es inevitable; la única decisión real es si ese dinero se pierde en la utilidad o se invierte en un activo propio."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Costo de No Hacer Nada",
                        content: "Si esperas 2 años para irte a solar, habrás perdido $6,000 en facturas de luz que nunca volverán."
                    },
                    {
                        title: "Ahorros Reales",
                        content: "Factura Post-Solar + Pago del Préstamo vs. Factura Proyectada con Inflación. Esa es la ganancia."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Calcula el costo de 25 años de servicio eléctrico para una factura de $250 asumiendo un 4% de inflación anual."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre conceptos de inflación energética, degradación de paneles y cálculo de periodo de recuperación."
            }
        ],
    },

    // ─── MÓDULO 4.6 — El Flujo de Presentación de 6 Fases ───────────────────────
    "mod_4_6": {
        id: "mod_4_6",
        title: "Módulo 4.6: El Flujo de Presentación de 6 Fases",
        subtitle: "La arquitectura de una venta cerrada.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Una presentación exitosa no es una charla desordenada, sino un viaje estructurado en seis fases diseñadas para construir lógica y emoción. Comenzamos re-conectando con el problema del cliente, exponemos la realidad de la empresa eléctrica, presentamos tu diseño específico, apilamos el valor total, definimos la estructura de financiamiento y, finalmente, establecemos el próximo paso lógico. Dominar este flujo permite que el cierre no sea un evento tenso, sino una conclusión natural y bienvenida por el propietario."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Las 6 Fases del Cierre",
                        content: "1. Re-conectar, 2. El Problema, 3. La Solución, 4. El Valor, 5. Financiamiento, 6. Firma/Encuesta."
                    },
                    {
                        title: "Micro-Cierres",
                        content: "Aprende a obtener pequeños 'sí' en cada fase para eliminar sorpresas al final."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Dibuja tu flujo de presentación actual e identifica en qué fase sueles perder la atención del cliente."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre la secuencia lógica de la presentación y la importancia de la fase de 'Re-conectar'."
            }
        ],
    },

    // ─── MÓDULO 4.7 — Manejo de Objeciones Financieras ──────────────────────────
    "mod_4_7": {
        id: "mod_4_7",
        title: "Módulo 4.7: Manejo de Objeciones Financieras",
        subtitle: "No es un costo, es una transferencia de pago.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La objeción 'es demasiado dinero' suele ser un error de percepción. Tu trabajo es reencuadrar la inversión no como un gasto nuevo de miles de dólares, sino como una transferencia de presupuesto: dinero que el cliente ya está perdiendo mensualmente hacia la red eléctrica. Al convertir un costo variable y eterno en un pago fijo y con fecha de finalización, eliminas el miedo a la deuda y lo reemplazas con la lógica de la propiedad. Aprende a manejar las objeciones sobre tasas de interés y periodos de payback con datos claros y empatía profesional."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Costo vs. Pago",
                        content: "No cuesta $40k. Cuesta $150/mes que reemplaza un gasto de $250/mes que ya tienen."
                    },
                    {
                        title: "La Objeción del Payback",
                        content: "¿Cuál es el payback de su factura de luz actual? (Nunca termina). Solar sí tiene fin."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Practica tu respuesta a 'Quiero esperar a que bajen los precios'. Usa el concepto de 'Costo de la Espera'."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre el manejo de objeciones de inversión inicial y tasas de interés."
            }
        ],
    },

    // ─── MÓDULO 4.8 — Simulación de Presentación Completa ───────────────────────
    "mod_4_8": {
        id: "mod_4_8",
        title: "Módulo 4.8: Simulación de Presentación Completa del Día 4",
        subtitle: "Tu primera presentación completa con la IA.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Ha llegado el momento de integrar todo lo aprendido en el Día 4. En esta simulación, realizarás una presentación de punta a punta: desde la re-conexión inicial hasta el cierre final. Deberás navegar las preguntas sobre medición neta, explicar la estructura de pago elegida y manejar las objeciones financieras con la fluidez de un experto. La IA evaluará no solo tus palabras, sino tu capacidad para mantener el flujo de las 6 fases y tu seguridad al pedir el compromiso del cliente."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Checklist de la Simulación",
                        content: "Lógica de Batería, Explicación de Incentivos, Modelo de ROI y Cierre Directo."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Grábate realizando la presentación y escucha tus transiciones entre fases. ¿Dónde dudas?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación final del Día 4 sobre la integración de conceptos financieros en la narrativa de venta."
            }
        ],
    },

    // ─── MÓDULO 5.1 — Técnicas de Cierre Avanzadas ──────────────────────────────
    "mod_5_1": {
        id: "mod_5_1",
        title: "Módulo 5.1: Técnicas de Cierre Avanzadas",
        subtitle: "Los 5 cierres principales y cómo leer la sala.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El cierre no es un evento aislado ni una táctica de presión; es la conclusión lógica de una presentación bien ejecutada. Para dominar el cierre, debes aprender a 'leer la sala', identificando señales de compra como preguntas sobre cronogramas o detalles de instalación, y distinguiéndolas de las señales de resistencia. El éxito radica en aplicar la técnica adecuada en el momento justo: desde el 'Cierre del Resumen', que recapitula los problemas resueltos, hasta el 'Cierre del Silencio', donde permites que el cliente procese la decisión final sin interrupciones. Recuerda que cerrar demasiado pronto puede destruir la confianza, mientras que no pedir el compromiso en el momento de mayor entusiasmo es una oportunidad perdida."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los 5 Cierres Maestros",
                        content: "1. Resumen: Recapitula el valor. 2. Pregunta de Prueba: Filtra dudas. 3. Mapa de Ruta: Proyecta el futuro. 4. Escasez: Incentivos limitados. 5. Silencio: El poder de la pausa."
                    },
                    {
                        title: "Señales de Compra",
                        content: "Identifica cuándo el cliente deja de preguntar '¿cómo funciona?' y empieza a preguntar '¿cuándo lo instalan?'."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe tu propio cierre de resumen de 60 segundos basado en una factura de $200 reducida a $140."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre técnicas de cierre, lectura de lenguaje corporal y manejo del silencio en la mesa."
            }
        ],
    },

    // ─── MÓDULO 5.2 — Manejo de Objeciones ─────────────────────────────────────
    "mod_5_2": {
        id: "mod_5_2",
        title: "Módulo 5.2: Manejo de Objeciones",
        subtitle: "El marco de 4 pasos para cualquier resistencia.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Las objeciones no son rechazos, sino solicitudes de más información o señales de que el valor aún no supera la incertidumbre. Para manejarlas con maestría, aplicamos un marco de cuatro pasos: Escuchar activamente sin interrumpir, Reconocer la preocupación para validar al cliente, Aclarar para asegurarnos de que es el único obstáculo real, y finalmente Responder con una solución o un nuevo enfoque. Al dominar las 7 objeciones más comunes (como el precio, la necesidad de pensarlo o hablar con el cónyuge), dejas de ver la resistencia como una barrera y empiezas a verla como el puente hacia el compromiso final. Tu meta es transformar el 'No' en un 'No entiendo cómo esto me beneficia todavía'."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Marco de los 4 Pasos",
                        content: "1. Escuchar. 2. Reconocer. 3. Aclarar. 4. Responder. Nunca saltes directamente a la respuesta sin antes validar."
                    },
                    {
                        title: "Objeciones Clave",
                        content: "'Déjame pensarlo', 'El precio es alto', 'Hablar con mi esposo/a'. Aprende el guion para cada una."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Identifica tu objeción más difícil. Aplica el marco de 4 pasos para escribir una respuesta convincente."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre el marco de manejo de objeciones y reencuadre de preocupaciones comunes."
            }
        ],
    },

    // ─── MÓDULO 5.3 — Cierre para Referidos y Revisiones ───────────────────────
    "mod_5_3": {
        id: "mod_5_3",
        title: "Módulo 5.3: Cierre para Referidos y Revisiones",
        subtitle: "Multiplica tu éxito en el momento de la firma.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El momento de la firma es el punto de mayor entusiasmo emocional en el viaje del cliente. Es aquí, y no después de la instalación, donde debes capitalizar para generar referidos y reseñas. Un cliente que acaba de decidir proteger su hogar y ahorrar dinero está ansioso por validar su decisión compartiéndola con otros. Aprender a pedir referidos del 'Día 0' y solicitar una reseña de 5 estrellas en la mesa no solo acelera tu pipeline, sino que solidifica el compromiso del cliente con el proyecto. No salgas de la casa sin plantar la semilla de la comunidad: ¿A quién más conocen que merezca esta misma tranquilidad financiera?"
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Referido del Día 0",
                        content: "Pide referidos cuando la confianza es máxima. '¿Quién más en su familia debería estar ahorrando así?'"
                    },
                    {
                        title: "Reseñas en la Mesa",
                        content: "Una reseña inmediata bloquea el remordimiento del comprador y construye tu reputación online."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Practica tu guion para pedir referidos inmediatamente después de la firma digital."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen sobre el tiempo óptimo para referidos y técnicas de solicitud de reseñas."
            }
        ],
    },

    // ─── MÓDULO 5.4 — Gestión Post-Venta ──────────────────────────────────────
    "mod_5_4": {
        id: "mod_5_4",
        title: "Módulo 5.4: Gestión Post-Venta",
        subtitle: "Prevención del remordimiento y actualizaciones de hitos.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La venta no termina con la firma; comienza una relación de confianza que debe protegerse intensamente durante las primeras 72 horas. El remordimiento del comprador es un fenómeno psicológico real que ocurre cuando el entusiasmo de la venta se encuentra con la realidad del compromiso a largo plazo. Tu herramienta principal es la 'Llamada de Inoculación' a las 48 horas, diseñada para reafirmar la decisión del cliente, resolver dudas de último minuto que hayan surgido y establecer expectativas claras sobre los hitos operativos inmediatos. Una gestión post-venta proactiva es la mejor vacuna contra las cancelaciones prematuras."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Las Primeras 72 Horas",
                        content: "Periodo crítico de vulnerabilidad. Mantén el contacto para evitar que el silencio se convierta en duda."
                    },
                    {
                        title: "Llamada de Inoculación",
                        content: "Objetivo: Reafirmar el valor, explicar el siguiente paso (site survey) y cerrar la puerta a dudas externas."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Diseña un calendario de contacto para los primeros 7 días después de la firma."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre prevención de cancelaciones y manejo del remordimiento del comprador."
            }
        ],
    },

    // ─── MÓDULO 5.5 — Construcción de Pipeline a Largo Plazo ──────────────────
    "mod_5_5": {
        id: "mod_5_5",
        title: "Módulo 5.5: Construcción de Pipeline a Largo Plazo",
        subtitle: "Los 3 pilares de los referidos sostenibles.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Un consultor solar de élite no vive de leads comprados, sino de un pipeline sostenible alimentado por referidos y relaciones. Para construir este motor de crecimiento, debes enfocarte en tres pilares: Clientes Pasados, manteniendo un seguimiento que los convierta en embajadores; tu Red Personal, asegurándote de que todos sepan el valor que aportas; y la Vecindad de tus instalaciones, capitalizando el impacto visual de cada proyecto. Al dejar de ser un vendedor transaccional y convertirte en un asesor de confianza, transformas cada instalación en el centro de una nueva red de oportunidades."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los 3 Pilares del Pipeline",
                        content: "1. Clientes Pasados (Embajadores). 2. Red Personal (Influencia). 3. Vecindad (Círculo de impacto)."
                    },
                    {
                        title: "De Vendedor a Asesor",
                        content: "El cambio de mentalidad que duplica tus cierres a largo plazo."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Lista a 5 personas de tu red personal a las que contactarás esta semana para presentarles tu nuevo rol."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre estrategias de prospección orgánica y gestión de base de datos de clientes."
            }
        ],
    },

    // ─── MÓDULO 5.5a — Ciclo de Vida del Proyecto Post-Venta ────────────────────
    "mod_5_5a": {
        id: "mod_5_5a",
        title: "Módulo 5.5a: El Ciclo de Vida del Proyecto Post-Venta",
        subtitle: "Entiende el proceso de la firma al PTO.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La mayoría de los representantes son entrenados para cerrar tratos, pero muy pocos entienden qué sucede después. El ciclo de vida de un proyecto solar, desde la firma del contrato hasta el Permiso para Operar (PTO), es un mapa complejo que incluye encuestas de sitio, diseño de ingeniería, permisos municipales e inspecciones de la red. Entender estas etapas te permite establecer expectativas realistas y, lo más importante, mantener la confianza del propietario. El 90% de las cancelaciones no ocurren por remordimiento del comprador al firmar, sino por la falta de comunicación durante el proceso de instalación. Tu rol post-venta es ser el guía del cliente a través de este 'túnel' operativo, asegurándote de que nunca se sientan abandonados en la oscuridad."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Las 7 Etapas del Proyecto",
                        content: "1. Firma. 2. Encuesta de Sitio. 3. Diseño. 4. Permisos. 5. Instalación. 6. Inspección. 7. Permiso para Operar (PTO)."
                    },
                    {
                        title: "Momentos Críticos de Confianza",
                        content: "El Silencio post-firma, la sorpresa de los tiempos de permisos y la confusión del PTO son los tres puntos donde más se pierden tratos."
                    },
                    {
                        title: "La Verdadera Meta: PTO",
                        content: "La instalación no es el final. El sistema no puede encenderse hasta que la empresa de servicios públicos dé el Permiso para Operar."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Ordena las etapas del proyecto y escribe una frase sobre qué podría estar sintiendo el cliente en cada una."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen sobre las etapas del ciclo de vida y la gestión de expectativas de tiempo."
            }
        ],
    },

    // ─── MÓDULO 5.5b — Problemas Comunes en el Pipeline de Instalación ──────────
    "mod_5_5b": {
        id: "mod_5_5b",
        title: "Módulo 5.5b: Problemas Comunes en el Pipeline de Instalación",
        subtitle: "Identifica y anticipa los obstáculos técnicos.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Incluso con la mejor planificación, los proyectos solares se encuentran con obstáculos técnicos que pueden retrasar o descarrilar la instalación. Los problemas más comunes incluyen paneles eléctricos desactualizados que requieren una actualización (MPU), techos en mal estado que necesitan reparaciones antes de montar el sistema, y sombreado imprevisto detectado durante la encuesta de sitio. Entender que estos problemas son parte normal del proceso te permite desdramatizarlos ante el cliente. Tu objetivo no es evitar que ocurran problemas, sino asegurarte de que el cliente escuche sobre ellos primero de ti, con una solución clara ya preparada, en lugar de enterarse por un correo genérico de operaciones."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El MPU (Main Panel Upgrade)",
                        content: "Un panel de 100 amperios no suele soportar solar + baterías. Aprende a identificarlo antes de que el cliente reciba la mala noticia."
                    },
                    {
                        title: "Retrasos de Permisos y HOA",
                        content: "La burocracia municipal y las asociaciones de vecinos son variables externas. Aprende a 'vender' el retraso como un paso de calidad."
                    },
                    {
                        title: "El Problema del Techo",
                        content: "Si el techo tiene menos de 5-10 años de vida útil, recomendar un cambio ahora salva el trato en el futuro."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Haz una lista de las 3 señales visuales que indican que una casa necesitará un MPU."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre identificación de obstáculos técnicos y comunicación preventiva."
            }
        ],
    },

    // ─── MÓDULO 5.5c — Solución de Problemas y Rutas de Escalación ──────────────
    "mod_5_5c": {
        id: "mod_5_5c",
        title: "Módulo 5.5c: Solución de Problemas y Rutas de Escalación",
        subtitle: "Domina el arte de la resolución interna.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Cuando surge un problema en el pipeline, saber a quién contactar y cómo presentar la información es la diferencia entre una solución rápida y un cliente que cancela. Las escalaciones se dividen en categorías claras: desde problemas de diseño y permisos hasta verificaciones de financiamiento y logística de instalación. Para escalar con éxito, utilizamos el marco de las 4 Partes: Quién (el cliente), Qué (el problema exacto), Estado (qué se ha intentado) y Solicitud (qué necesitas específicamente). Al ser profesional y preciso en tus comunicaciones internas, te conviertes en un socio para el equipo de operaciones, asegurando que tus tratos reciban la prioridad que necesitan para llegar a la meta."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Categorías de Escalación",
                        content: "A. Diseño/Ingeniería. B. Permisos/HOA. C. Financiamiento. D. Instalación/Inspección. E. Post-PTO/Monitoreo."
                    },
                    {
                        title: "El Mensaje de 4 Partes",
                        content: "1. Quién es el cliente. 2. Cuál es el problema (sé específico). 3. Qué hemos hecho ya. 4. Qué acción necesito de ti."
                    },
                    {
                        title: "Etiqueta de Escalación",
                        content: "Sé la solución, no el problema. Respeta los canales y proporciona toda la información de una sola vez."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe un mensaje de escalación para un retraso en la verificación de crédito usando el marco de 4 partes."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen sobre rutas de escalación y comunicación efectiva con el equipo de operaciones."
            }
        ],
    },

    // ─── MÓDULO 5.5d — Comunicación para Salvar el Trato ────────────────────────
    "mod_5_5d": {
        id: "mod_5_5d",
        title: "Módulo 5.5d: Comunicación para Salvar el Trato",
        subtitle: "Protege tus tratos de las amenazas externas.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Incluso el trato mejor cerrado puede verse amenazado por el tiempo, la duda o la interferencia externa. Para salvar estos tratos, un consultor de élite debe dominar tres tipos de comunicación crítica: la Comunicación de Retrasos, donde posees la mala noticia antes de que el cliente la descubra; el Manejo de Ghosting, utilizando mensajes de bajo compromiso para restablecer el contacto; y el Manejo de Dudas Familiares, reenfocando la conversación en los beneficios a largo plazo para el hogar. Recuerda: tú eres el dueño de la comunicación. Si el cliente deja de escucharte, empezará a escuchar sus propios miedos o a la competencia. Mantener la presencia es mantener el trato vivo."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Marco de la Mala Noticia",
                        content: "1. Posee la noticia. 2. Explica el porqué (sin culpar). 3. Presenta la solución. 4. Confirma el siguiente paso. Nunca esperes a que pregunten."
                    },
                    {
                        title: "Rescatando al 'Ghosting'",
                        content: "Usa el mensaje de 'Cierre de Bucle': 'Sr. Cliente, asumo que sus prioridades han cambiado y que este proyecto ya no es de su interés. ¿Debo cerrar su archivo?'."
                    },
                    {
                        title: "El Cónyuge que se Arrepiente",
                        content: "No discutas. Re-vende el valor emocional: Seguridad, Independencia y Ahorro para la familia."
                    }
                ]
            }
        ]
    },

    // ─── MÓDULO 5.6 — Estrategias Avanzadas de Retención ───────────────────────
    "mod_5_6": {
        id: "mod_5_6",
        title: "Módulo 5.6: Estrategias Avanzadas de Retención",
        subtitle: "Blindando tus tratos contra la cancelación.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La retención de clientes comienza en el momento en que se firma el contrato. Las estrategias avanzadas incluyen la comunicación proactiva de hitos, la educación continua sobre el sistema y el manejo de expectativas realistas sobre los tiempos de instalación y permisos. Un cliente que se siente informado y cuidado es mucho menos propenso a cancelar por 'falta de noticias' o por dudas externas. Tu trabajo es mantener viva la emoción de la firma durante todo el proceso técnico, convirtiendo el tiempo de espera en una experiencia positiva de anticipación."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los Momentos de Peligro",
                        content: "Identifica cuándo es más probable que un cliente dude: 24 horas después de la firma y 15 días después si no hay noticias."
                    },
                    {
                        title: "Educación Proactiva",
                        content: "Envía videos o artículos sobre qué esperar. Conviértete en su guía, no solo en su vendedor."
                    },
                    {
                        title: "El Toque de Seguimiento",
                        content: "La regla de los 15 días: nunca dejes pasar más de dos semanas sin una actualización, incluso si no hay cambios."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Crea una lista de 3 'toques' de comunicación específicos que tendrías con un cliente entre la firma y el día de la instalación."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre psicología del comprador, estrategias de seguimiento y prevención de cancelaciones."
            }
        ]
    },

    // ─── MÓDULO 5.7 — Simulación de Cierre y Post-Venta ────────────────────────
    "mod_5_7": {
        id: "mod_5_7",
        title: "Módulo 5.7: Simulación de Cierre y Post-Venta",
        subtitle: "Practica el momento de la verdad.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Esta simulación pone a prueba tus habilidades para manejar el momento crítico del cierre y la transición fluida a la etapa de post-venta. Deberás navegar objeciones de último minuto, explicar los puntos clave del contrato de forma sencilla y establecer expectativas claras para los próximos pasos. Es el momento de demostrar que eres un asesor profesional que acompaña al cliente hasta el final. La forma en que cierras determina no solo si obtienes la firma, sino también qué tan dispuesto estará el cliente a darte referidos en el futuro."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Pase de Estafeta",
                        content: "Cómo pasar del 'quiero hacerlo' a 'aquí está el contrato' sin aumentar la presión."
                    },
                    {
                        title: "Lectura de Contrato de 2 Minutos",
                        content: "Enfócate en lo que le importa al cliente: Garantías, Pagos y Plazos. No leas cada cláusula legal."
                    },
                    {
                        title: "Cerrando con Referidos",
                        content: "Cómo sembrar la semilla de la recomendación justo después de que el cliente ha dicho que sí."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Describe cómo manejarías a un cliente que de repente dice 'necesito pensarlo más' justo cuando vas a presentar el contrato digital."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre etiqueta de cierre, manejo de documentación y transición a operaciones."
            }
        ]
    },

    // ─── MÓDULO 5.8 — Cierre del Día 5 y Preparación para el Campo ──────────────
    "mod_5_8": {
        id: "mod_5_8",
        title: "Módulo 5.8: Cierre del Día 5 y Preparación para el Campo",
        subtitle: "De la teoría a la acción real.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "¡Felicidades! Has completado la fase intensiva de entrenamiento teórico y práctico. El Día 5 marca el final de tu formación interna y el emocionante comienzo de tu carrera en el campo. En este módulo final, repasaremos los conceptos fundamentales, confirmaremos que todas tus herramientas digitales y físicas están listas, y estableceremos tus metas de actividad para tu primera semana. No estás solo; tienes el respaldo de todo un equipo y un proceso probado. Es hora de salir, ayudar a las familias a ahorrar y construir tu propio éxito en la industria solar."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Repaso de Fundamentos",
                        content: "Recuerda: El descubrimiento es el 80% de la venta. Si entiendes el dolor, la solución es obvia."
                    },
                    {
                        title: "Tu Kit de Campo",
                        content: "Verificación final: CRM activo, tableta cargada, medidor de techo, y tu mejor actitud."
                    },
                    {
                        title: "Metas de la Semana 1",
                        content: "Enfócate en la actividad, no solo en los resultados. Toca las puertas, haz los contactos, las ventas vendrán."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe tu meta personal de ingresos para tu primer mes completo y desglosa cuántas ventas necesitas para lograrlo."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen final comprensivo sobre los pilares del entrenamiento SeptiVolt (Días 1-5)."
            }
        ]
    },

    // ─── MÓDULO 6.1 — El Motor de Referidos ───────────────────────────────────
    "mod_6_1": {
        id: "mod_6_1",
        title: "Módulo 6.1: El Motor de Referidos",
        subtitle: "Construyendo un pipeline pasivo y sostenible.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Un consultor solar de élite no vive solo de leads fríos; vive de un motor de referidos que genera oportunidades de alta calidad de forma pasiva. El secreto de los referidos no es pedirlos 'al final', sino integrarlos como una parte natural del proceso desde el primer contacto. Cuando un cliente te refiere, no solo te está dando un nombre, te está transfiriendo su confianza. Aprender a capitalizar los momentos de mayor entusiasmo —como la firma, la instalación y el primer recibo de $0— es lo que diferencia a un vendedor de un profesional que construye un negocio real."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Valor de un Referido",
                        content: "Un lead de referido cierra 3 veces más rápido y con un margen mayor que cualquier lead de marketing."
                    },
                    {
                        title: "Los 3 Disparadores de Referidos",
                        content: "1. La Firma (Emoción). 2. La Instalación (Orgullo). 3. El PTO (Validación)."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Identifica a 3 clientes actuales (o conocidos) a los que podrías pedirles un referido hoy mismo y escribe por qué estarían dispuestos a ayudarte."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre los momentos clave para solicitar referidos y la psicología del referido."
            }
        ]
    },

    // ─── MÓDULO 6.1a — Arquitectura del Sistema de Referidos ──────────────────
    "mod_6_1a": {
        id: "mod_6_1a",
        title: "Módulo 6.1a: Arquitectura del Sistema de Referidos",
        subtitle: "Cómo estructurar tu programa de incentivos.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Para que un sistema de referidos funcione, debe ser predecible y fácil de entender tanto para ti como para el cliente. Esto requiere una 'arquitectura' clara: incentivos definidos, un proceso de seguimiento y una forma de agradecer. No se trata solo de dinero; se trata de hacer que el cliente se sienta parte de una misión de energía limpia. Debes ser capaz de explicar exactamente qué sucede cuando alguien refiere a un amigo, cuánto ganan (si aplica) y cómo te encargarás tú de que su amigo reciba un trato de guante blanco."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Incentivos que Funcionan",
                        content: "Desde pagos directos hasta donaciones a causas locales. Cómo elegir el incentivo adecuado para tu mercado."
                    },
                    {
                        title: "El Guion de la Recomendación",
                        content: "Cómo entrenar a tu cliente para que hable de ti correctamente. 'No digas que vendo paneles, di que ayudo a familias a ahorrar'."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Diseña tu propia 'Tarjeta de Referido' digital o física. ¿Qué diría para motivar a alguien a llamarte?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre diseño de programas de referidos y cumplimiento ético de incentivos."
            }
        ]
    },

    // ─── MÓDULO 6.2 — Estrategia de Reseñas y Prueba Social ────────────────────
    "mod_6_2": {
        id: "mod_6_2",
        title: "Módulo 6.2: Estrategia de Reseñas y Prueba Social",
        subtitle: "Construye tu reputación digital en tiempo real.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "En la era digital, tu reputación te precede. Antes de que abras la boca en una mesa de cocina, es muy probable que el cliente ya te haya buscado en Google o redes sociales. La prueba social (social proof) es el fenómeno donde las personas asumen que las acciones de los demás son correctas en una situación dada. Al acumular reseñas positivas y documentar tus instalaciones, estás reduciendo la fricción para futuras ventas. Una reseña de 5 estrellas no es solo una medalla; es una herramienta de cierre que puedes mostrar a un cliente escéptico para demostrar que cumples lo que prometes."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Poder de las 5 Estrellas",
                        content: "Por qué las reseñas son el factor #1 de confianza antes de la cita."
                    },
                    {
                        title: "Documentación Visual",
                        content: "Cómo tomar fotos de instalaciones y clientes felices (con permiso) para tus redes sociales."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Busca tu nombre en Google. ¿Qué vería un cliente? Escribe 3 acciones para mejorar esa primera impresión esta semana."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre el uso estratégico de testimonios y gestión de reputación online."
            }
        ]
    },

    // ─── MÓDULO 6.2a — Sistemas de Generación de Reseñas ───────────────────────
    "mod_6_2a": {
        id: "mod_6_2a",
        title: "Módulo 6.2a: Sistemas de Generación de Reseñas",
        subtitle: "Automatiza la recolección de testimonios.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "No puedes confiar solo en tu memoria para pedir reseñas; necesitas un sistema. Esto incluye el uso de códigos QR en tu tableta, enlaces directos enviados por SMS tras la firma, y correos electrónicos de seguimiento automático después de la instalación exitosa. La clave es facilitar el proceso al máximo para el cliente. Si les toma más de 30 segundos, no lo harán. Aprender a integrar la solicitud de reseña como un hito obligatorio en tu flujo de trabajo te asegurará un flujo constante de validación pública que alimentará tu crecimiento a largo plazo."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Herramientas de Reseña",
                        content: "Google Business, Facebook, y plataformas específicas de la industria. Dónde enfocar tus esfuerzos."
                    },
                    {
                        title: "El QR del Éxito",
                        content: "Cómo usar un código QR en la mesa para obtener una reseña antes de salir de la casa."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Crea un borrador de un mensaje de texto de 2 líneas que enviarías a un cliente el día de su instalación pidiendo una reseña."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre automatización de feedback y plataformas de reputación."
            }
        ]
    },

    // ─── MÓDULO 6.3 — Estrategia de Propietario Huérfano ───────────────────────
    "mod_6_3": {
        id: "mod_6_3",
        title: "Módulo 6.3: Estrategia de Propietario Huérfano",
        subtitle: "Rescata clientes abandonados y conviértelos en oro.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Un 'propietario huérfano' es alguien que ya tiene solar pero cuyo representante original ya no está en la industria o ha dejado de darles seguimiento. Estos clientes a menudo se sienten abandonados y tienen preguntas sobre su monitoreo, garantías o expansiones del sistema. Al posicionarte como el experto local que está dispuesto a ayudar (incluso si no les vendiste el sistema original), ganas acceso a su red de referidos de forma inmediata. Es una estrategia de bajo costo y alta recompensa que construye una buena voluntad inmensa en la comunidad y te posiciona como un consultor ético, no solo un vendedor."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "¿Quién es un Huérfano?",
                        content: "Cómo identificarlos en el CRM o caminando el vecindario. Busca paneles de empresas que ya no operan."
                    },
                    {
                        title: "El Enfoque de Servicio",
                        content: "No entres vendiendo. Entra preguntando: '¿Le está funcionando bien su monitoreo?'."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Redacta una breve apertura para tocar la puerta de una casa que ya tiene solar pero parece necesitar ayuda con su mantenimiento o monitoreo."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre prospección estratégica y ética de servicio al cliente."
            }
        ]
    },

    // ─── MÓDULO 6.3a — Manual de Reactivación de Propietarios Huérfanos ─────────
    "mod_6_3a": {
        id: "mod_6_3a",
        title: "Módulo 6.3a: Manual de Reactivación de Propietarios Huérfanos",
        subtitle: "Pasos tácticos para la conversión de huérfanos.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La reactivación de un propietario huérfano requiere un protocolo específico de 3 pasos: Auditoría de Satisfacción, Resolución de Problemas y Petición de Referidos. Primero, escuchas sus frustraciones; segundo, les ayudas a entender su recibo o a reactivar su aplicación de monitoreo; y tercero, una vez que han visto tu valor, les pides que te recomienden con sus vecinos que aún no tienen solar. Este proceso transforma un lead 'muerto' en un centro de influencia activo. Dominar este manual te permite ser productivo incluso en días donde los leads frescos escasean."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "La Auditoría de 5 Minutos",
                        content: "Cómo revisar rápidamente la salud de un sistema existente sin ser técnico de campo."
                    },
                    {
                        title: "Cerrando el Círculo de Confianza",
                        content: "Cómo pasar de 'gracias por la ayuda' a 'aquí están los 3 vecinos que me han estado preguntando'."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Lista 3 beneficios de ayudar a un cliente huérfano más allá de la comisión inmediata."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre protocolos de atención y estrategias de expansión de red."
            }
        ]
    },

    // ─── MÓDULO 6.4 — Dashboard de Rendimiento y Disciplina de KPI ──────────────
    "mod_6_4": {
        id: "mod_6_4",
        title: "Módulo 6.4: Dashboard de Rendimiento y Disciplina de KPI",
        subtitle: "Mide lo que importa para crecer.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Los números no mienten, pero a menudo los vendedores sí se mienten a sí mismos. La disciplina de KPI (Indicadores Clave de Desempeño) es lo que separa a un aficionado de un profesional de altos ingresos. Debes rastrear tu embudo completo: puertas tocadas, contactos realizados, citas agendadas, citas presentadas y contratos firmados. Si no mides estos números diariamente, no tienes un negocio, tienes un pasatiempo costoso. El dashboard de rendimiento te permite identificar exactamente dónde está fallando tu proceso para que puedas aplicar la corrección adecuada en lugar de simplemente 'esforzarte más'."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "El Embudo de Ventas Solar",
                        content: "Entiende tus ratios de conversión. ¿Cuántas puertas necesitas para un cierre?"
                    },
                    {
                        title: "La Regla de la Recencia",
                        content: "Por qué un trato que no se mueve en 7 días tiene un 50% menos de probabilidad de cerrar."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe tus números de la última semana (o estimados). ¿Cuál es el paso del embudo donde pierdes más gente?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre análisis de métricas y gestión de tiempo productivo."
            }
        ]
    },

    // ─── MÓDULO 6.4a — Maestría en KPI y Sistema de Auto-Entrenamiento ──────────
    "mod_6_4a": {
        id: "mod_6_4a",
        title: "Módulo 6.4a: Maestría en KPI y Sistema de Auto-Entrenamiento",
        subtitle: "Cómo ser tu propio mejor coach.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Una vez que tienes los datos, debes saber qué hacer con ellos. La maestría en KPI implica el uso de un sistema de auto-entrenamiento semanal. Si tu ratio de cita-a-presentación es bajo, necesitas mejorar tu pre-calificación o tu recordatorio post-puerta. Si tu ratio de presentación-a-cierre es bajo, necesitas pulir tu manejo de objeciones financieras. Aprender a diagnosticarte a ti mismo utilizando tus propios datos te da una autonomía total sobre tus ingresos. No esperas a que tu gerente te diga qué está mal; tú ya lo sabes y ya estás practicando la solución."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Diagnóstico de Embudo",
                        content: "Problema en Apertura vs. Problema en Cierre. Cómo saber la diferencia usando datos."
                    },
                    {
                        title: "El Plan de Práctica Semanal",
                        content: "Cómo dedicar 30 minutos a la semana a la debilidad específica identificada por tus KPI."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Diseña tu rutina de 'Auto-Coach' de los lunes por la mañana. ¿Qué 3 reportes revisarás?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre interpretación de datos y ciclos de mejora continua."
            }
        ]
    },

    // ─── MÓDULO 6.5 — Gestión del Ciclo de Vida del Proyecto ───────────────────
    "mod_6_5": {
        id: "mod_6_5",
        title: "Módulo 6.5: Gestión del Ciclo de Vida del Proyecto",
        subtitle: "Del contrato al encendido exitoso.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Muchos representantes cometen el error de desaparecer una vez que el contrato está firmado. Esto es una receta para las cancelaciones. La gestión del ciclo de vida implica mantener al cliente informado y entusiasmado durante las etapas 'oscuras' del proyecto: diseño de ingeniería, permisos municipales e inspecciones de la red. Tu trabajo es ser el puente de comunicación. Un mensaje de 30 segundos cada dos semanas diciendo 'estamos en la etapa de permisos, todo va según lo planeado' vale miles de dólares en comisiones protegidas. El cliente debe sentir que estás con ellos hasta que el sistema empiece a producir energía."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Los Hitos Post-Venta",
                        content: "1. Site Survey. 2. Engineering. 3. Permitting. 4. Installation. 5. Inspection. 6. PTO."
                    },
                    {
                        title: "Comunicación Proactiva",
                        content: "Por qué dar la noticia de un retraso antes de que el cliente pregunte salva el trato."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Crea una lista de contactos 'Hito' para tus clientes. ¿En qué momentos exactos les enviarás un mensaje?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre procesos operativos y mantenimiento de la confianza del cliente."
            }
        ]
    },

    // ─── MÓDULO 6.6 — Reputación Profesional y Ética a Largo Plazo ──────────────
    "mod_6_6": {
        id: "mod_6_6",
        title: "Módulo 6.6: Reputación Profesional y Ética a Largo Plazo",
        subtitle: "Construyendo un legado en la industria solar.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "En una industria a veces empañada por tácticas agresivas, la ética y la integridad son tus mayores ventajas competitivas. La reputación profesional se construye en años y se destruye en un segundo. Esto significa ser honesto sobre los ahorros reales, no prometer lo que la ingeniería no puede cumplir y tratar cada hogar como si fuera el tuyo. A largo plazo, los consultores más exitosos son aquellos en quienes la comunidad confía. Al priorizar el bienestar del cliente sobre la comisión inmediata, aseguras un flujo de trabajo que durará décadas, no solo meses."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Ética vs. Conveniencia",
                        content: "Cómo manejar situaciones donde la verdad técnica podría poner en riesgo la venta."
                    },
                    {
                        title: "El Valor de por Vida del Cliente",
                        content: "Un cliente feliz vale 5 ventas futuras. Un cliente engañado te quita 10."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe tu propia 'Declaración de Ética' de 3 puntos que compartirás con tus clientes en la mesa."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre estándares de cumplimiento y conducta profesional."
            }
        ]
    },

    // ─── MÓDULO 6.7 — Trayectoria Profesional y Escalamiento de Ingresos ─────────
    "mod_6_7": {
        id: "mod_6_7",
        title: "Módulo 6.7: Trayectoria Profesional y Escalamiento de Ingresos",
        subtitle: "Tu plan de 1 a 5 años en SeptiVolt.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Solar no es solo un trabajo; es una carrera con múltiples rutas de crecimiento. Puedes elegir convertirte en un Consultor de Élite centrado en ventas personales de alto volumen, un Mentor de Campo ayudando a nuevos reclutas, o moverte hacia el Liderazgo de Equipo y Gestión Regional. Cada nivel requiere nuevas habilidades: desde el dominio técnico avanzado hasta la inteligencia emocional y la gestión de personas. Entender estas rutas te permite establecer metas claras y no estancarte. Hoy defines si quieres ser un vendedor de paneles o un líder en la transición energética."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Rutas de Crecimiento",
                        content: "Ventas Individuales -> Mentoría -> Liderazgo -> Operaciones."
                    },
                    {
                        title: "Escalamiento Financiero",
                        content: "Cómo pasar de ingresos de supervivencia a la creación de riqueza real a través de la consistencia."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "¿Dónde te ves en 2 años dentro de esta empresa? ¿Qué habilidad necesitas desarrollar hoy para llegar ahí?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación sobre planificación de carrera y visión de liderazgo."
            }
        ]
    },

    // ─── MÓDULO 6.8 — Examen de Certificación Final del Día 6 ───────────────────
    "mod_6_8": {
        id: "mod_6_8",
        title: "Módulo 6.8: Examen de Certificación Final del Día 6",
        subtitle: "Valida tus conocimientos antes del campo.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Has llegado al final de la formación teórica intensiva. Este examen no es solo un requisito administrativo; es la validación de que estás listo para representar a SeptiVolt frente a propietarios reales. Cubriremos todo: desde los fundamentos de AC/DC y NEM 3.0 hasta el manejo de objeciones y la ética post-venta. El objetivo es asegurarnos de que tienes la confianza necesaria para manejar cualquier situación en el campo. Una puntuación del 80% o más te otorga el derecho a tu día de certificación de campo mañana. ¡Mucho éxito!"
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Instrucciones del Examen",
                        content: "50 preguntas. Tiempo limitado. Se requiere honestidad total y dominio de los conceptos V2."
                    },
                    {
                        title: "Qué esperar Mañana",
                        content: "Día 7: La prueba de fuego. Shadowing y tu primera cita dirigida."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Anota los 3 temas en los que te sientes más inseguro para darles un último repaso antes de empezar el examen."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Examen final integral del currículo SeptiVolt V2."
            }
        ]
    },

    // ─── MÓDULO 7.1 — Sesión Informativa Pre-Campo ────────────────────────────
    "mod_7_1": {
        id: "mod_7_1",
        title: "Módulo 7.1: Sesión Informativa Pre-Campo",
        subtitle: "Protocolos de seguridad y observación.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El día de campo es donde la teoría se encuentra con la realidad. Antes de salir, repasaremos los protocolos esenciales: vestimenta profesional, puntualidad, seguridad en la propiedad y, lo más importante, tu rol como observador. Durante las citas de shadowing, tu trabajo es ser una 'sombra': observar, aprender y notar los matices que no se pueden enseñar en una diapositiva. Aprenderás a leer la energía de la casa, a notar las señales visuales de los propietarios y a ver cómo tu gerente adapta el mensaje V2 a diferentes personalidades en tiempo real."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Etiqueta del Shadowing",
                        content: "No interrumpas. No contradigas. Toma notas en silencio. El gerente tiene el control."
                    },
                    {
                        title: "Qué Observar",
                        content: "Lenguaje corporal del cliente, manejo de interrupciones (perros, niños, teléfonos) y cierres de transición."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Lista 3 preguntas específicas que le harás a tu gerente en el auto después de la primera cita."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre protocolos de campo y objetivos de observación."
            }
        ]
    },

    // ─── MÓDULO 7.2 — Cita de Acompañamiento #1 — Sombra y Observación ─────────
    "mod_7_2": {
        id: "mod_7_2",
        title: "Módulo 7.2: Cita de Acompañamiento #1 — Sombra y Observación",
        subtitle: "Primera inmersión en una venta real.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "En esta primera cita, tu único objetivo es la observación pura. No sientas la presión de vender. Enfócate en el 'Día 1' del proceso: ¿Cómo rompe el hielo el gerente? ¿Cómo transiciona del saludo informal al descubrimiento técnico? Nota cómo se manejan las primeras resistencias leves. En el debrief posterior en el auto, analizaremos por qué se tomaron ciertas decisiones tácticas. Esta es la base de tu estilo personal de ventas; mira lo que funciona y empieza a imaginarte a ti mismo haciendo lo mismo."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Debrief de la Cita 1",
                        content: "¿Cuál fue el momento de mayor conexión? ¿Hubo alguna objeción inesperada? ¿Cómo se resolvió?"
                    },
                    {
                        title: "Análisis de Personalidad",
                        content: "¿Qué tipo de BOLT era el cliente? ¿Cómo adaptó el gerente su velocidad y tono?"
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Describe el momento más difícil de la cita y cómo lo manejó el gerente. ¿Qué habrías hecho tú?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación de aprendizaje sobre la primera interacción real con clientes."
            }
        ]
    },

    // ─── MÓDULO 7.3 — Cita de Acompañamiento #2 — Sombra y Observación ─────────
    "mod_7_3": {
        id: "mod_7_3",
        title: "Módulo 7.3: Cita de Acompañamiento #2 — Sombra y Observación",
        subtitle: "Profundizando en el manejo de objeciones.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Para la segunda cita, tu observación debe ser más analítica. Ya conoces el flujo básico, ahora mira los detalles. ¿Cómo maneja el gerente los datos financieros? ¿Cómo utiliza la tableta para mostrar el diseño? Presta especial atención al momento del cierre. Nota si hay 'señales de compra' que el cliente emite y cómo el gerente las captura. El objetivo es que empieces a ver los patrones: la venta solar no es un caos, es una serie de pasos lógicos que, cuando se ejecutan bien, llevan a un resultado predecible."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Debrief de la Cita 2",
                        content: "Comparación con la primera cita. ¿Qué fue diferente? ¿Por qué?"
                    },
                    {
                        title: "La Pila de Valor en Acción",
                        content: "Identifica los 4 pilares presentados. ¿Cuál resonó más con este cliente específico?"
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Anota 2 frases o técnicas que usó el gerente y que planeas 'robar' para tu propia presentación."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre identificación de señales de compra y técnicas de presentación."
            }
        ]
    },

    // ─── MÓDULO 7.4 — Cita de Acompañamiento #3 — Sombra y Observación ─────────
    "mod_7_4": {
        id: "mod_7_4",
        title: "Módulo 7.4: Cita de Acompañamiento #3 — Sombra y Observación",
        subtitle: "Preparación para el despegue.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Esta es tu última cita como observador puro. Úsala para resolver cualquier duda que aún tengas sobre el proceso. Mira cómo el gerente cierra los cabos sueltos y establece las expectativas post-venta. Después de esta cita, el rol cambiará: tú empezarás a tomar el control. Asegúrate de entender el flujo del contrato digital y cómo se toman las fotos necesarias para la ingeniería. Estás a solo minutos de entrar a tu propia cita de certificación. La confianza viene de la preparación; has visto tres ejemplos reales, ahora es tu turno."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Debrief Final de Shadowing",
                        content: "Repaso integral. ¿Qué falta para que te sientas listo para liderar?"
                    },
                    {
                        title: "El Plan de Juego de tu Cita",
                        content: "Define tu apertura y tu estrategia para la cita de certificación que viene."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe tu 'Plan de Batalla' para la próxima cita. ¿Cuál será tu primer paso al entrar a la casa?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación de preparación final antes de la ejecución individual."
            }
        ]
    },

    // ─── MÓDULO 7.5 — Preparación Pre-Cita ────────────────────────────────────
    "mod_7_5": {
        id: "mod_7_5",
        title: "Módulo 7.5: Preparación Pre-Cita",
        subtitle: "Enfoque mental y técnico en el auto.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Los 15 minutos antes de una cita son críticos. Aquí es donde revisas los datos del propietario en el CRM, verificas el diseño preliminar y haces tu ensayo mental. Debes entrar a la casa con una intención clara. No vas a 'ver qué pasa', vas a guiar a una familia hacia una decisión financiera inteligente. Repasa tus aperturas, asegúrate de que tu tableta esté cargada y respira profundo. Tu gerente estará allí para apoyarte si te bloqueas, pero hoy tú eres el capitán del barco. La preparación elimina el miedo."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Checklist Pre-Puerta",
                        content: "CRM revisado, Diseño listo, Tableta cargada, Mente clara, Imagen profesional."
                    },
                    {
                        title: "Visualización del Éxito",
                        content: "Imagina el cierre. Visualiza al cliente firmando y dándote las gracias por ayudarle."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Responde: ¿Cuál es el objetivo principal de esta cita específica más allá de la firma?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre rutinas de preparación y gestión del estado emocional."
            }
        ]
    },

    // ─── MÓDULO 7.6 — El Rep Realiza una Cita Completa ────────────────────────
    "mod_7_6": {
        id: "mod_7_6",
        title: "Módulo 7.6: El Rep Realiza una Cita Completa",
        subtitle: "Tu examen de certificación de campo.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "Este es el momento para el que te has estado preparando durante 7 días. Tomarás el liderazgo total de la cita, desde el toque de puerta hasta el intento de cierre. Tu gerente se mantendrá en silencio, interviniendo solo si es absolutamente necesario para salvar la relación con el cliente. No te preocupes por ser perfecto; preocúpate por ser auténtico, seguir el proceso V2 y, sobre todo, escuchar al cliente. El éxito hoy no se mide solo por la firma, sino por tu capacidad de mantener el control del proceso y manejar las objeciones con la elegancia que has practicado."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Ejecución del Proceso",
                        content: "Apertura -> Descubrimiento -> Diseño -> Valor -> Cierre -> Referidos."
                    },
                    {
                        title: "Criterios de Certificación",
                        content: "1. Control de la Cita. 2. Fluidez Técnica. 3. Manejo de Objeciones. 4. Ética y Claridad."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Inmediatamente después de salir: ¿Qué sentiste que fue tu mayor fortaleza en esta cita?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Autoevaluación post-ejecución sobre el desempeño en campo."
            }
        ]
    },

    // ─── MÓDULO 7.7 — Debrief Post-Cita ───────────────────────────────────────
    "mod_7_7": {
        id: "mod_7_7",
        title: "Módulo 7.7: Debrief Post-Cita",
        subtitle: "Análisis profundo de tu desempeño.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "El debrief es donde ocurre el crecimiento real. Tu gerente te dará retroalimentación honesta y constructiva sobre cada fase de tu cita. Analizaremos qué palabras funcionaron, dónde hubo dudas y cómo reaccionó el cliente a tu presencia. No tomes las críticas como algo personal; tómalas como las herramientas que te harán ganar decenas de miles de dólares en el futuro. Este es el momento de ajustar los últimos detalles antes de que te lancemos oficialmente como un consultor independiente certificado por SeptiVolt."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Fortalezas y Oportunidades",
                        content: "Identificación de los 3 puntos clave que dominas y los 2 que necesitan pulido inmediato."
                    },
                    {
                        title: "Ajuste de Guiones",
                        content: "Modificación de tus respuestas basadas en la reacción real del cliente hoy."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe los 2 consejos más valiosos que te dio tu gerente hoy en el auto."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Prueba sobre asimilación de feedback y planes de mejora continua."
            }
        ]
    },

    // ─── MÓDULO 7.8 — Firma de Certificación ──────────────────────────────────
    "mod_7_8": {
        id: "mod_7_8",
        title: "Módulo 7.8: Firma de Certificación",
        subtitle: "Bienvenido a la élite de SeptiVolt.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "¡Felicidades! Has completado el programa de aceleración SeptiVolt V2. Al firmar tu certificación, te comprometes a mantener los estándares de ética, profesionalismo y excelencia que hemos practicado. Ya no eres un aprendiz; eres un Consultor de Energía Solar certificado. Tienes las herramientas, tienes el conocimiento y ahora tienes la bendición de tu equipo para ir y construir la carrera que visualizaste el Día 1. El mundo necesita energía limpia y las familias necesitan ahorrar dinero — tú eres quien hará que eso suceda."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Compromiso de SeptiVolt",
                        content: "Apoyo total de operaciones, acceso a los mejores leads y una plataforma de crecimiento sin límites."
                    },
                    {
                        title: "Tu Próximo Paso",
                        content: "Activa tu CRM, prepara tu material y sal a tocar tus primeras puertas en solitario."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Escribe una breve carta a tu 'yo del futuro' para leer en 6 meses. ¿Qué quieres haber logrado para entonces?"
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación final de compromiso y visión profesional."
            }
        ]
    },

    // ─── MÓDULO 7.9 — Prospección en Solitario ────────────────────────────────
    "mod_7_9": {
        id: "mod_7_9",
        title: "Módulo 7.9: Prospección en Solitario",
        subtitle: "Tus primeras 20 puertas como consultor certificado.",
        sections: [
            {
                title: "CONTENIDO",
                type: "text",
                content: "La certificación no es el final del día, es el comienzo de tu independencia. Tu última tarea de entrenamiento es salir y tocar 20 puertas tú solo. Sin gerente, sin sombras. Aplica tu apertura, califica a los propietarios y busca agendar tu primera cita como rep certificado. Esta noche no se trata de los resultados perfectos, se trata de romper la barrera del miedo y demostrarte a ti mismo que puedes hacerlo. Al terminar, reportarás tus números y reflexiones. Mañana comienza oficialmente tu primer día como dueño de tu destino financiero."
            },
            {
                title: "PRESENTACIÓN",
                type: "slides",
                slides: [
                    {
                        title: "Objetivo de la Noche",
                        content: "20 puertas. 1 cita agendada. 100% de confianza en el proceso V2."
                    },
                    {
                        title: "Gestión del Rechazo",
                        content: "Cada 'no' es un paso más cerca del 'sí'. Mantén la energía alta y el proceso firme."
                    }
                ]
            },
            {
                title: "CUADERNO",
                type: "text",
                content: "Reporte de Campo: Puertas tocadas: __. Conversaciones: __. Citas agendadas: __. Lección más importante de la noche: __________."
            },
            {
                title: "QUIZ",
                type: "text",
                content: "Evaluación final de resiliencia y ejecución en solitario."
            }
        ]
    }

};

