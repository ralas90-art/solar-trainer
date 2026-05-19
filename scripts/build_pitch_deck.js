const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.title = 'Todo Directo – Pitch Deck de Ventas';
pptx.author = 'Todo Directo';

// ── Brand palette ─────────────────────────────────────────────────
const C = {
    navy: '1A1A2E', blue: '0F3460', blue2: '16213E',
    red: 'E94560', gold: 'F5A623', white: 'FFFFFF',
    light: 'F0F4FF', gray: 'D0D0D0', dkgray: '555555',
    green: '2ECC71', teal: '16A085',
};

// ── Helper: slide background  ──────────────────────────────────────
function bg(slide, color = C.navy) {
    slide.background = { color };
}

// ── Helper: full-bleed colored band ───────────────────────────────
function rect(slide, x, y, w, h, color, opts = {}) {
    slide.addShape(pptx.shapes.RECTANGLE, { x, y, w, h, fill: { color }, line: { color }, ...opts });
}

// ── Helper: add text ──────────────────────────────────────────────
function txt(slide, text, x, y, w, h, opts = {}) {
    slide.addText(text, { x, y, w, h, fontFace: 'Arial', fontSize: 18, color: C.white, ...opts });
}

// ── Helper: section label pill ────────────────────────────────────
function pill(slide, label, x, y) {
    rect(slide, x, y, 1.8, 0.28, C.red);
    txt(slide, label, x, y, 1.8, 0.28, { fontSize: 9, bold: true, align: 'center', color: C.white });
}

// ── Helper: accent line ───────────────────────────────────────────
function accentLine(slide, x, y, w = 1.2) {
    rect(slide, x, y, w, 0.06, C.red);
}

// ── Helper: card box ──────────────────────────────────────────────
function card(slide, x, y, w, h, title, body, titleColor = C.red, bodyColor = C.white, bodySize = 11) {
    rect(slide, x, y, w, h, C.blue);
    txt(slide, title, x + 0.1, y + 0.1, w - 0.2, 0.38, { fontSize: 13, bold: true, color: titleColor });
    rect(slide, x + 0.1, y + 0.5, w - 0.2, 0.04, C.red);
    txt(slide, body, x + 0.1, y + 0.62, w - 0.2, h - 0.72, { fontSize: bodySize, color: bodyColor, valign: 'top', autoFit: true });
}

// ── Helper: data stat big number ─────────────────────────────────
function stat(slide, num, label, x, y, numColor = C.gold) {
    rect(slide, x, y, 2.6, 1.5, C.blue);
    txt(slide, num, x + 0.1, y + 0.1, 2.4, 0.75, { fontSize: 36, bold: true, color: numColor, align: 'center' });
    txt(slide, label, x + 0.1, y + 0.85, 2.4, 0.55, { fontSize: 10, color: C.gray, align: 'center', autoFit: true });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 1 – COVER
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);

    // Left accent block
    rect(s, 0, 0, 0.18, 7.5, C.red);

    // Company name
    txt(s, 'TODO DIRECTO', 0.4, 0.6, 9, 1.1,
        { fontSize: 56, bold: true, color: C.white, charSpacing: 8 });

    // Red underline
    accentLine(s, 0.4, 1.72, 6.5);

    // Tagline
    txt(s, 'Transformación Digital para Negocios en El Salvador',
        0.4, 1.9, 8.5, 0.55,
        { fontSize: 20, italic: true, color: C.gray });

    // Subtitle block
    rect(s, 0.4, 2.7, 7.5, 1.2, C.blue);
    txt(s,
        '"Empoderar la economía salvadoreña llevando herramientas de IA\naccesibles a negocios locales, propietarios y emprendedores."',
        0.6, 2.78, 7.1, 1.05,
        { fontSize: 13, italic: true, color: C.light, valign: 'middle' });

    // Bottom services strip
    rect(s, 0, 4.2, 10, 0.08, C.red);
    const svcs = ['AlToque App', 'Desarrollo Web', 'Vacation Rentals', 'Automatización IA', 'Chatbot Agents'];
    svcs.forEach((sv, i) => {
        txt(s, sv, 0.3 + i * 2, 4.35, 1.85, 0.35,
            { fontSize: 12, color: C.gold, bold: true, align: 'center' });
    });

    // Rep info area
    rect(s, 0.4, 4.95, 5.5, 0.6, C.blue2);
    txt(s, 'Presentado por: ________________     Fecha: _______________',
        0.6, 5.0, 5.1, 0.5,
        { fontSize: 11, color: C.gray });

    // Bottom bar
    rect(s, 0, 6.8, 10, 0.7, C.red);
    txt(s, 'www.tododirecto.com  |  info@tododirecto.com  |  El Salvador',
        0, 6.85, 10, 0.55,
        { fontSize: 12, color: C.white, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 2 – EL SALVADOR OPPORTUNITY
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    pill(s, 'LA OPORTUNIDAD', 0.4, 0.25);
    txt(s, 'El Salvador: Un Mercado Digital en Explosión',
        0.4, 0.62, 9, 0.75,
        { fontSize: 30, bold: true, color: C.white });
    accentLine(s, 0.4, 1.4);

    // Stats row
    stat(s, '3.9M', 'Turistas por año\ny en aumento', 0.4, 1.58, C.gold);
    stat(s, '85%', 'Negocios sin sistema\ndigital de pedidos', 3.2, 1.58, C.red);
    stat(s, '$000s', 'En ventas perdidas\ncada mes por negocio', 6.0, 1.58, C.green);

    // Context paragraph
    rect(s, 0.4, 3.25, 9.2, 1.1, C.blue);
    txt(s,
        'El turismo crece. Los turistas buscan en Google, reservan en línea y esperan respuestas inmediatas.\n' +
        'La mayoría de negocios salvadoreños siguen vendiendo solo por WhatsApp y Facebook.\n' +
        'Esa brecha digital es la oportunidad de Todo Directo.',
        0.6, 3.32, 8.8, 0.95,
        { fontSize: 12, color: C.light, valign: 'middle' });

    // Target businesses
    const targets = [
        ['🍽️', 'Restaurantes'],
        ['✂️', 'Barberías'],
        ['🏠', 'Propietarios'],
        ['🚗', 'Rentas de Carros'],
        ['🌺', 'Floristerías'],
        ['🏨', 'Hostels'],
    ];
    targets.forEach(([emoji, label], i) => {
        const col = i % 3, row = Math.floor(i / 3);
        rect(s, 0.4 + col * 3.1, 4.5 + row * 0.78, 2.85, 0.65, C.blue);
        txt(s, `${emoji}  ${label}`, 0.55 + col * 3.1, 4.55 + row * 0.78, 2.6, 0.55,
            { fontSize: 13, color: C.white, bold: false });
    });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 3 – THE PROBLEM
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    pill(s, 'EL PROBLEMA', 0.4, 0.25);
    txt(s, '¿Cuánto Dinero Está Perdiendo Su Negocio Hoy?',
        0.4, 0.62, 9, 0.7,
        { fontSize: 28, bold: true, color: C.white });
    accentLine(s, 0.4, 1.35);

    const problems = [
        ['❌', 'Pedidos perdidos en WhatsApp', 'Cuando está atendiendo a un cliente, otros 3 le escribieron y no respondió.'],
        ['❌', 'Invisible en Google', 'Los turistas buscan online. Si no tiene web, simplemente no existe para ellos.'],
        ['❌', 'Paga 15% de comisión a Airbnb', 'Por cada reserva, Airbnb se queda el 15%. Hay una alternativa local más rentable.'],
        ['❌', 'Sin respuesta fuera de horario', 'Clientes preguntan a las 10pm. Sin chatbot, pierden el cliente y usted pierde la venta.'],
        ['❌', 'Tareas repetitivas consumen tiempo', 'Su personal dedica horas a enviar los mismos mensajes y hacer los mismos reportes.'],
    ];

    problems.forEach(([icon, title, desc], i) => {
        rect(s, 0.4, 1.55 + i * 0.94, 9.2, 0.85, C.blue);
        txt(s, `${icon}  ${title}`, 0.6, 1.6 + i * 0.94, 3.8, 0.35,
            { fontSize: 13, bold: true, color: C.red });
        txt(s, desc, 4.6, 1.6 + i * 0.94, 5.0, 0.7,
            { fontSize: 11, color: C.light, valign: 'top' });
    });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 4 – 5 SOLUTIONS OVERVIEW
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    pill(s, 'NUESTRAS SOLUCIONES', 0.4, 0.25);
    txt(s, 'Cinco Servicios. Una Empresa. Resultados Reales.',
        0.4, 0.62, 9, 0.65,
        { fontSize: 28, bold: true, color: C.white });
    accentLine(s, 0.4, 1.3);

    const solutions = [
        { num: '01', name: 'AlToque App', sub: 'Catálogo digital + pedidos organizados', price: 'Desde $0/mes', color: C.teal },
        { num: '02', name: 'Desarrollo Web (WaaS)', sub: 'Presencia Google + sistema de reservas', price: 'Desde $99 inst.', color: C.blue },
        { num: '03', name: 'PR Vacation Rentals', sub: 'Plataforma de reservas directas', price: 'Desde $250', color: C.gold },
        { num: '04', name: 'Automatización IA', sub: 'Tareas repetitivas en piloto automático', price: 'Desde $200/mes', color: C.red },
        { num: '05', name: 'Chatbot Agent IA', sub: 'Atención al cliente 24/7 sin personal', price: 'Desde $150/mes', color: C.green },
    ];

    solutions.forEach((sol, i) => {
        const x = 0.4 + (i % 3) * 3.1;
        const y = i < 3 ? 1.5 : 3.6;
        if (i === 3) { } // handled by layout
        const rx = i < 3 ? 0.4 + i * 3.1 : 0.4 + (i - 3) * 3.1 + 1.55;
        rect(s, rx, y, 2.85, 1.85, C.blue2);
        rect(s, rx, y, 2.85, 0.3, sol.color);
        txt(s, sol.num, rx + 0.08, y + 0.03, 0.6, 0.25,
            { fontSize: 13, bold: true, color: C.white });
        txt(s, sol.name, rx + 0.1, y + 0.36, 2.6, 0.42,
            { fontSize: 13, bold: true, color: C.white });
        txt(s, sol.sub, rx + 0.1, y + 0.8, 2.65, 0.55,
            { fontSize: 10, color: C.gray, autoFit: true });
        rect(s, rx + 0.1, y + 1.42, 1.6, 0.28, sol.color);
        txt(s, sol.price, rx + 0.1, y + 1.43, 1.6, 0.26,
            { fontSize: 9, bold: true, color: C.white, align: 'center' });
    });

    // Unlimited capabilities note
    rect(s, 0.4, 5.6, 9.2, 0.65, C.red);
    txt(s, '⚡  En Todo Directo no limitamos nuestras capacidades. Si la tecnología de IA existe, lo construimos para tu negocio.',
        0.6, 5.65, 8.8, 0.55,
        { fontSize: 12, bold: true, color: C.white, valign: 'middle' });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 5 – ALTOQUE APP
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    // Number badge
    rect(s, 0.4, 0.2, 0.6, 0.6, C.teal);
    txt(s, '01', 0.4, 0.22, 0.6, 0.55, { fontSize: 22, bold: true, align: 'center', color: C.white });

    txt(s, 'AlToque App', 1.1, 0.22, 6, 0.55, { fontSize: 28, bold: true, color: C.white });
    txt(s, 'Para: Restaurantes, Tiendas, Vendedores de Facebook/WhatsApp',
        1.1, 0.82, 8.5, 0.38, { fontSize: 12, italic: true, color: C.gray });
    accentLine(s, 0.4, 1.28, 9.2);

    // Script quote
    rect(s, 0.4, 1.4, 9.2, 0.9, C.blue);
    rect(s, 0.4, 1.4, 0.08, 0.9, C.teal);
    txt(s,
        '"Sé que recibes pedidos por WhatsApp todo el día. Cuando atiendes a uno, pierdes 3 más. AlToque crea un catálogo donde\ntus clientes piden solos 24/7, y el pedido llega organizado a WhatsApp con nombre, dirección y todo listo."',
        0.6, 1.46, 8.8, 0.78,
        { fontSize: 11, italic: true, color: C.light });

    // Features
    rect(s, 0.4, 2.45, 4.5, 2.1, C.blue2);
    txt(s, '✅  Características Clave', 0.6, 2.52, 4.1, 0.38, { fontSize: 13, bold: true, color: C.teal });
    const feats = ['Catálogo digital siempre activo', 'Pedidos organizados a WhatsApp', 'Respuestas automáticas por IA', 'Analíticas: qué se vende más', 'Sugerencias de productos por IA'];
    feats.forEach((f, i) => txt(s, `→  ${f}`, 0.6, 2.98 + i * 0.32, 4.1, 0.3, { fontSize: 11, color: C.light }));

    // Pricing table
    rect(s, 5.1, 2.45, 4.5, 2.1, C.blue2);
    txt(s, '💰  Planes', 5.3, 2.52, 4.1, 0.38, { fontSize: 13, bold: true, color: C.gold });
    const plans = [
        ['Chivo', 'Gratis', '$0 comisión', C.gray],
        ['Pro', '$14.99/mes', '$22.49 comisión', C.gold],
        ['Premium', '$29.99/mes', '$44.98 comisión', C.red],
    ];
    plans.forEach(([plan, price, comm, col], i) => {
        rect(s, 5.1, 2.98 + i * 0.5, 4.5, 0.42, col === C.gray ? C.blue : C.navy);
        txt(s, plan, 5.2, 3.02 + i * 0.5, 1.1, 0.32, { fontSize: 11, bold: true, color: col });
        txt(s, price, 6.35, 3.02 + i * 0.5, 1.4, 0.32, { fontSize: 10, color: C.white });
        txt(s, comm, 7.8, 3.02 + i * 0.5, 1.7, 0.32, { fontSize: 10, color: C.green, bold: true });
    });

    // AI badge
    rect(s, 0.4, 4.7, 9.2, 0.55, C.red);
    txt(s, '🤖  IA: Catálogo Inteligente, Auto-respuestas, Analytics predictivo',
        0.6, 4.74, 8.8, 0.44, { fontSize: 12, color: C.white, bold: true });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 6 – WEB DEVELOPMENT
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    rect(s, 0.4, 0.2, 0.6, 0.6, C.blue);
    txt(s, '02', 0.4, 0.22, 0.6, 0.55, { fontSize: 22, bold: true, align: 'center', color: C.white });
    txt(s, 'Desarrollo Web / App (WaaS)', 1.1, 0.22, 7, 0.55, { fontSize: 28, bold: true, color: C.white });
    txt(s, 'Para: Barberías, Rentas de Carros, Clínicas, Negocios de Servicios',
        1.1, 0.82, 8.5, 0.38, { fontSize: 12, italic: true, color: C.gray });
    accentLine(s, 0.4, 1.28, 9.2);

    rect(s, 0.4, 1.4, 9.2, 0.9, C.blue);
    rect(s, 0.4, 1.4, 0.08, 0.9, C.blue);
    txt(s,
        '"Cuando alguien busca barbería en [tu ciudad] en Google, ¿apareces tú? Si no tienes web, no existes para el turista.\nTe creamos tu página profesional con reservas 24/7. Los clientes reservan solos, reciben recordatorio automático."',
        0.6, 1.46, 8.8, 0.78, { fontSize: 11, italic: true, color: C.light });

    rect(s, 0.4, 2.45, 4.5, 2.1, C.blue2);
    txt(s, '✅  Qué Incluye', 0.6, 2.52, 4.1, 0.38, { fontSize: 13, bold: true, color: C.blue });
    const wfeats = ['Sitio web profesional responsive', 'Sistema de reservas 24/7', 'Chatbot IA para preguntas', 'Posicionamiento en Google (SEO)', 'Recordatorios SMS automáticos', 'Panel de administración'];
    wfeats.forEach((f, i) => txt(s, `→  ${f}`, 0.6, 2.98 + i * 0.27, 4.1, 0.25, { fontSize: 10, color: C.light }));

    rect(s, 5.1, 2.45, 4.5, 2.1, C.blue2);
    txt(s, '💰  Planes', 5.3, 2.52, 4.1, 0.38, { fontSize: 13, bold: true, color: C.gold });

    const wplans = [
        ['Plan Chivo', '$99 inst.', '$25/mes', '$39.60', '$2.50/mes'],
        ['Plan Pro', '$149 inst.', '$49/mes', '$59.60', '$4.90/mes'],
        ['Plan Premium', '$299 inst.', '$89/mes', '$119.60', '$8.90/mes'],
    ];
    txt(s, 'Plan', 5.2, 2.95, 1.4, 0.3, { fontSize: 9, bold: true, color: C.gray });
    txt(s, 'Precio', 6.65, 2.95, 1.1, 0.3, { fontSize: 9, bold: true, color: C.gray });
    txt(s, 'Com. Inicial', 7.75, 2.95, 1.1, 0.3, { fontSize: 9, bold: true, color: C.gray });
    wplans.forEach(([plan, inst, mo, ui, ur], i) => {
        rect(s, 5.1, 3.3 + i * 0.42, 4.5, 0.38, i === 1 ? C.blue : C.navy);
        txt(s, plan, 5.2, 3.33 + i * 0.42, 1.4, 0.3, { fontSize: 10, bold: i === 1, color: C.white });
        txt(s, `${inst} / ${mo}`, 6.65, 3.33 + i * 0.42, 1.05, 0.3, { fontSize: 9, color: C.light });
        txt(s, ui, 7.75, 3.33 + i * 0.42, 1.1, 0.3, { fontSize: 10, bold: true, color: C.gold });
    });

    rect(s, 0.4, 4.7, 9.2, 0.55, C.blue);
    txt(s, '🤖  IA: Chatbot FAQ, Reservas Inteligentes (sin doble-booking), SEO automático, Analytics',
        0.6, 4.74, 8.8, 0.44, { fontSize: 11, color: C.white, bold: true });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 7 – VACATION RENTALS
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    rect(s, 0.4, 0.2, 0.6, 0.6, C.gold);
    txt(s, '03', 0.4, 0.22, 0.6, 0.55, { fontSize: 22, bold: true, align: 'center', color: C.navy });
    txt(s, 'PR Vacation Rentals', 1.1, 0.22, 7, 0.55, { fontSize: 28, bold: true, color: C.white });
    txt(s, 'Para: Propietarios de Casas de Playa, Condominios, Cabañas',
        1.1, 0.82, 8.5, 0.38, { fontSize: 12, italic: true, color: C.gray });
    accentLine(s, 0.4, 1.28, 9.2);

    rect(s, 0.4, 1.4, 9.2, 0.9, C.blue);
    rect(s, 0.4, 1.4, 0.08, 0.9, C.gold);
    txt(s,
        '"Airbnb te cobra 15% por cada reserva. Nosotros te creamos tu plataforma de reservas directas pagando solo 8-10%.\nNuestro marketing apunta 100% a El Salvador — atraemos turistas que buscan playas salvadoreñas específicamente."',
        0.6, 1.46, 8.8, 0.78, { fontSize: 11, italic: true, color: C.light });

    // Comparison
    rect(s, 0.4, 2.45, 4.5, 2.1, C.blue2);
    txt(s, '❌  Airbnb', 0.6, 2.52, 2, 0.38, { fontSize: 14, bold: true, color: C.red });
    const airbnb = ['15% comisión por reserva', 'Compite con todo el mundo', 'Sin marketing local ES', 'Sin soporte en español', 'Ellos ponen las reglas'];
    airbnb.forEach((f, i) => txt(s, `✗  ${f}`, 0.6, 2.98 + i * 0.32, 4.1, 0.3, { fontSize: 11, color: C.gray }));

    rect(s, 5.1, 2.45, 4.5, 2.1, C.blue2);
    txt(s, '✅  Todo Directo', 5.3, 2.52, 3.5, 0.38, { fontSize: 14, bold: true, color: C.gold });
    const td = ['Solo 8-10% comisión', 'Mercado enfocado en El Salvador', 'Marketing digital local', 'Soporte en español', 'Usted controla sus reservas'];
    td.forEach((f, i) => txt(s, `✓  ${f}`, 5.3, 2.98 + i * 0.32, 4.1, 0.3, { fontSize: 11, color: C.light }));

    rect(s, 0.4, 4.7, 4.5, 0.85, C.blue);
    txt(s, 'Modelo A – Direct Booking', 0.6, 4.75, 4.1, 0.35, { fontSize: 12, bold: true, color: C.gold });
    txt(s, '$250–350 instalación  |  8-10% comisión\nDueño vive cerca — control total', 0.6, 5.1, 4.1, 0.4, { fontSize: 10, color: C.light });

    rect(s, 5.1, 4.7, 4.5, 0.85, C.blue);
    txt(s, 'Modelo B – Full Management', 5.3, 4.75, 4.1, 0.35, { fontSize: 12, bold: true, color: C.red });
    txt(s, '$400–600 instalación  |  18-20% comisión\nDueño ausente — ingreso pasivo total', 5.3, 5.1, 4.1, 0.4, { fontSize: 10, color: C.light });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 8 – AUTOMATION + CHATBOT
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    txt(s, 'Automatización + Chatbot IA', 0.4, 0.22, 9, 0.6,
        { fontSize: 28, bold: true, color: C.white });
    txt(s, 'Para: Cualquier negocio que pierde tiempo — o clientes — fuera del horario',
        0.4, 0.85, 9.2, 0.38, { fontSize: 12, italic: true, color: C.gray });
    accentLine(s, 0.4, 1.28, 9.2);

    // Two columns side by side
    rect(s, 0.4, 1.42, 4.5, 3.55, C.blue2);
    rect(s, 0.4, 1.42, 4.5, 0.38, C.red);
    txt(s, '04  Automatización de Procesos', 0.55, 1.44, 4.2, 0.34, { fontSize: 12, bold: true, color: C.white });
    txt(s,
        '"¿Cuántas horas dedica su equipo a enviar los mismos\nmensajes todos los días? Nosotros automatizamos eso.\nFlujos que corren solos, 24/7, sin errores."',
        0.55, 1.88, 4.2, 0.72, { fontSize: 10, italic: true, color: C.light });
    const autos = ['Confirmaciones automáticas citas', 'Seguimiento post-venta auto', 'Reportes semanales automáticos', 'Integración WhatsApp + Email', 'Facturación automatizada'];
    autos.forEach((f, i) => txt(s, `→  ${f}`, 0.55, 2.68 + i * 0.27, 4.1, 0.25, { fontSize: 10, color: C.light }));
    txt(s, '$200/mes Básico  ·  $400/mes Pro', 0.55, 4.55, 4.1, 0.3, { fontSize: 11, bold: true, color: C.gold });

    rect(s, 5.1, 1.42, 4.5, 3.55, C.blue2);
    rect(s, 5.1, 1.42, 4.5, 0.38, C.green);
    txt(s, '05  Agente Chatbot con IA', 5.25, 1.44, 4.2, 0.34, { fontSize: 12, bold: true, color: C.navy });
    txt(s,
        '"¿Pierde clientes porque nadie responde a las 9pm\ndel domingo? Su chatbot responde en segundos,\nen español e inglés, a cualquier hora."',
        5.25, 1.88, 4.2, 0.72, { fontSize: 10, italic: true, color: C.light });
    const chats = ['Respuestas FAQ 24/7', 'Toma reservas por chat', 'Califica prospectos de venta', 'WhatsApp + Instagram + Web', 'Escala a humano si necesario'];
    chats.forEach((f, i) => txt(s, `→  ${f}`, 5.25, 2.68 + i * 0.27, 4.1, 0.25, { fontSize: 10, color: C.light }));
    txt(s, '$150/mes Básico  ·  $300/mes Pro', 5.25, 4.55, 4.1, 0.3, { fontSize: 11, bold: true, color: C.gold });

    // Key message
    rect(s, 0.4, 5.15, 9.2, 0.8, C.red);
    txt(s, '🤖  "La IA es como tener un empleado virtual 24/7, sin vacaciones y que aprende de cada interacción con sus clientes."',
        0.6, 5.2, 8.8, 0.7, { fontSize: 12, italic: true, color: C.white, valign: 'middle' });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 9 – STACK SELLING / PACKAGES
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    pill(s, 'PAQUETES ESPECIALES', 0.4, 0.25);
    txt(s, 'Más Servicios = Más Valor para el Cliente = Más Comisión para Ti',
        0.4, 0.62, 9.2, 0.65, { fontSize: 24, bold: true, color: C.white });
    accentLine(s, 0.4, 1.3, 9.2);

    const pkgs = [
        {
            icon: '🍽️', name: 'Paquete Restaurante Completo',
            includes: 'AlToque App  +  Web  +  Chatbot IA',
            why: 'Google + Pedidos + Atención 24/7',
            comm: '+$150/mes comisión',
            color: C.teal,
        },
        {
            icon: '🏠', name: 'Paquete Propietario de Inmueble',
            includes: 'Vacation Rentals  +  Web  +  Automatización',
            why: 'Vitrina + Reservas + Seguimiento auto',
            comm: '+$639 comisión inicial',
            color: C.gold,
        },
        {
            icon: '✂️', name: 'Paquete Negocio de Servicios',
            includes: 'Web Pro  +  Chatbot IA  +  Automatización',
            why: 'Reservas + Atención auto + Procesos sin fricciones',
            comm: '+$230/mes comisión',
            color: C.red,
        },
        {
            icon: '📱', name: 'Paquete Emprendedor Digital',
            includes: 'AlToque App  +  Chatbot IA',
            why: 'Catálogo + Respuesta instantánea',
            comm: '+$97 comisión inicial',
            color: C.green,
        },
    ];

    pkgs.forEach((pkg, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = 0.4 + col * 4.85;
        const y = 1.48 + row * 2.2;
        rect(s, x, y, 4.65, 2.0, C.blue2);
        rect(s, x, y, 4.65, 0.32, pkg.color);
        txt(s, `${pkg.icon}  ${pkg.name}`, x + 0.1, y + 0.04, 4.4, 0.26,
            { fontSize: 12, bold: true, color: C.navy });
        txt(s, pkg.includes, x + 0.1, y + 0.4, 4.4, 0.3,
            { fontSize: 11, bold: true, color: C.white });
        txt(s, pkg.why, x + 0.1, y + 0.72, 4.4, 0.3,
            { fontSize: 10, color: C.gray });
        rect(s, x + 0.1, y + 1.12, 2.5, 0.68, pkg.color);
        txt(s, '💰 ' + pkg.comm, x + 0.15, y + 1.17, 2.4, 0.55,
            { fontSize: 11, bold: true, color: C.white, align: 'center' });
    });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 10 – ROI & PRICING COMPARISON
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    pill(s, 'RETORNO DE INVERSIÓN', 0.4, 0.25);
    txt(s, '¿Cuánto Cuesta No Tener Esto?',
        0.4, 0.62, 9, 0.65, { fontSize: 28, bold: true, color: C.white });
    accentLine(s, 0.4, 1.3);

    // ROI examples
    const rois = [
        { biz: 'Restaurante pierde:', before: '5 pedidos/día por WhatsApp = $250/semana perdidos', after: 'AlToque Pro: $14.99/mes. Se paga con 1 hora de ventas.', color: C.teal },
        { biz: 'Propietario en Airbnb:', before: '15% de comisión en $1,000/mes = $150 pagado a Airbnb', after: 'Todo Directo: 8-10% = \$80-100/mes. Ahorra $50+/mes.', color: C.gold },
        { biz: 'Negocio sin web:', before: '0 clientes de Google. 0 reservas online. Solo WhatsApp.', after: 'Plan Pro: $149 + $49/mes. Primera reserva lo paga.', color: C.red },
        { biz: 'Sin Chatbot IA:', before: 'Pierde clientes a las 9pm. Personal saturado de preguntas.', after: 'Chatbot Básico: $150/mes. Atiende 100+ consultas/noche.', color: C.green },
    ];

    rois.forEach((r, i) => {
        rect(s, 0.4, 1.48 + i * 1.15, 9.2, 1.05, C.blue2);
        rect(s, 0.4, 1.48 + i * 1.15, 0.08, 1.05, r.color);
        txt(s, r.biz, 0.6, 1.52 + i * 1.15, 3.5, 0.36,
            { fontSize: 12, bold: true, color: r.color });
        txt(s, '❌  ' + r.before, 0.6, 1.9 + i * 1.15, 4.0, 0.52,
            { fontSize: 10, color: C.gray });
        txt(s, '✅  ' + r.after, 4.7, 1.9 + i * 1.15, 4.8, 0.52,
            { fontSize: 10, color: C.green });
    });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 11 – OBJECTION HANDLING
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    pill(s, 'MANEJO DE OBJECIONES', 0.4, 0.25);
    txt(s, 'Cada Objeción Tiene Una Respuesta',
        0.4, 0.62, 9, 0.65, { fontSize: 28, bold: true, color: C.white });
    accentLine(s, 0.4, 1.3);

    const objections = [
        ['"No tengo dinero"', '"Por eso necesita esto — para GANAR más. ¿Cuántos clientes pierde por semana? Este sistema se paga solo."'],
        ['"Necesito pensarlo"', '"Claro. ¿Qué parte exactamente? ¿El precio o la funcionalidad? Identifiquemos la duda y la resolvemos ahora."'],
        ['"Ya tengo web/Facebook"', '"¿Le trae clientes nuevos cada semana? El problema no es tener web — es tener un sistema que trabaja para usted."'],
        ['"Mis clientes no usan tecnología"', '"Sus hijos sí. Y los turistas definitivamente. Sin presencia digital, solo existe para el 20% del mercado."'],
        ['"No confío en la IA"', '"Siempre hay un humano de respaldo. El chatbot maneja lo repetitivo — usted siempre tiene el control."'],
        ['"Es muy caro"', '"¿Cuánto cuesta un empleado tiempo completo? Este sistema trabaja 24/7 por una fracción de ese costo."'],
    ];

    objections.forEach(([obj, res], i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = 0.4 + col * 4.85;
        const y = 1.48 + row * 1.55;
        rect(s, x, y, 4.65, 1.4, C.blue2);
        rect(s, x, y, 4.65, 0.32, col === 0 ? C.red : C.blue);
        txt(s, obj, x + 0.1, y + 0.04, 4.4, 0.26,
            { fontSize: 11, bold: true, color: C.white });
        txt(s, res, x + 0.1, y + 0.4, 4.4, 0.92,
            { fontSize: 10, italic: true, color: C.light, valign: 'top', autoFit: true });
    });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 12 – COMMISSION SUMMARY (Rep Confidence Slide)
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    pill(s, 'TUS GANANCIAS', 0.4, 0.25);
    txt(s, 'Estructura de Comisiones – Todo Directo',
        0.4, 0.62, 9, 0.65, { fontSize: 28, bold: true, color: C.white });
    accentLine(s, 0.4, 1.3, 9.2);

    // Commission table via addTable
    s.addTable([
        [
            { text: 'Servicio / Plan', options: { fill: { color: C.red }, color: C.white, bold: true } },
            { text: 'Tu Comisión Inicial', options: { fill: { color: C.red }, color: C.white, bold: true } },
            { text: 'Tu Residual Mensual', options: { fill: { color: C.red }, color: C.white, bold: true } },
        ],
        ['AlToque Pro', '$22.49', '$0'],
        ['AlToque Premium', '$44.98', '$0'],
        ['Web Plan Chivo', '$39.60', '$2.50/mes'],
        ['Web Plan Pro', '$59.60', '$4.90/mes'],
        ['Web Plan Premium', '$119.60', '$8.90/mes'],
        ['Vacation Rentals A', '$300.00', '$0'],
        ['Vacation Rentals B', '$600.00', '$0'],
        ['Automatización Básica', '$100.00', '$30/mes'],
        ['Chatbot IA Básico', '$75.00', '$22.50/mes'],
    ], {
        x: 0.4, y: 1.5, w: 9.2, h: 3.8,
        colW: [4.2, 2.5, 2.5],
        rowH: [0.38, 0.34, 0.34, 0.34, 0.34, 0.34, 0.34, 0.34, 0.34, 0.34],
        border: { pt: 1, color: '0F3460' },
        fill: { color: C.blue2 },
        align: 'center', valign: 'middle',
        fontSize: 12, color: C.white,
    });

    // Bonus strip
    rect(s, 0.4, 5.5, 9.2, 0.65, C.blue);
    txt(s, '🏆  BONOS:  5 cierres/semana = +$50   ·   20 cierres/mes = +$200   ·   60 cierres/trimestre = +$500',
        0.6, 5.55, 8.8, 0.55, { fontSize: 12, bold: true, color: C.gold, align: 'center' });

    // Potential earning
    rect(s, 0.4, 6.25, 9.2, 0.42, C.red);
    txt(s, '💰  20 cierres/mes con Web Pro = $1,192 inicial + $98/mes residual permanente',
        0.6, 6.28, 8.8, 0.36, { fontSize: 11, bold: true, color: C.white, align: 'center' });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  Pitch de Ventas', 0, 6.88, 10, 0.5,
        { fontSize: 10, color: C.gray, align: 'center' });
}

// ═══════════════════════════════════════════════════════════════════
//  SLIDE 13 – NEXT STEPS / CTA
// ═══════════════════════════════════════════════════════════════════
{
    const s = pptx.addSlide();
    bg(s, C.navy);
    rect(s, 0, 0, 0.18, 7.5, C.red);

    // Big close
    txt(s, '¿Listo Para Empezar?',
        0.5, 0.35, 9, 0.85, { fontSize: 40, bold: true, color: C.white });
    txt(s, 'Tres preguntas simples para cerrar hoy:',
        0.5, 1.25, 9, 0.45, { fontSize: 18, color: C.gold, italic: true });
    accentLine(s, 0.5, 1.75, 9);

    const steps = [
        ['1', '¿Cuándo quiere estar en Google o tener su sistema funcionando?',
            '"Puedo tenerlo listo para usted la próxima semana."'],
        ['2', '¿Prefiere pago mensual o prefiere pagar el año y llevarse 2 meses gratis?',
            '"Si paga anual, le ahorramos 2 meses de costo."'],
        ['3', '¿Le pago con efectivo, transferencia o Chivo Wallet?',
            '"Solo necesito la información de su negocio y empezamos hoy."'],
    ];

    steps.forEach(([num, q, close], i) => {
        rect(s, 0.5, 2.0 + i * 1.32, 0.52, 0.52, C.red);
        txt(s, num, 0.5, 2.02 + i * 1.32, 0.52, 0.48, { fontSize: 22, bold: true, color: C.white, align: 'center' });
        rect(s, 1.1, 2.0 + i * 1.32, 8.5, 0.56, C.blue);
        txt(s, q, 1.2, 2.04 + i * 1.32, 8.2, 0.48, { fontSize: 13, bold: true, color: C.white });
        txt(s, close, 1.2, 2.58 + i * 1.32, 8.2, 0.62, { fontSize: 11, italic: true, color: C.gold });
    });

    rect(s, 0.5, 6.0, 9.1, 0.65, C.red);
    txt(s, '"Si recupera solo 3 ventas perdidas por semana, esto se paga solo."',
        0.7, 6.05, 8.8, 0.55, { fontSize: 14, italic: true, bold: true, color: C.white, align: 'center' });

    rect(s, 0, 6.8, 10, 0.7, C.blue2);
    txt(s, 'TODO DIRECTO  |  www.tododirecto.com  |  info@tododirecto.com',
        0, 6.88, 10, 0.5, { fontSize: 11, color: C.gold, align: 'center', bold: true });
}

// ── Save ──────────────────────────────────────────────────────────
const path = require('path');
const OUT = path.join(__dirname, '..', 'Todo_Directo_Pitch_Deck.pptx');
pptx.writeFile({ fileName: OUT }).then(() => {
    console.log(`✅  Saved: ${OUT}`);
}).catch(err => {
    console.error('Error:', err);
});
