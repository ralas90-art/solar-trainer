const pptxgen = require('pptxgenjs');
const path = require('path');

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity Agent';
    pptx.title = 'Antigravity Solar Trainer Pitch Deck';

    // Define brand colors
    const COLORS = {
        background: { path: path.join(__dirname, 'background.png') },
        title: "00d2ff",
        subtitle: "b0b0b0",
        text: "e0e0e0",
        strong: "ffffff",
        accentPink: "f72585", // #f72585
        accentBlue: "4cc9f0", // #4cc9f0
        boxBg: "2a2a40", // Approximate transparent bg
        highlightBg: "1a1a30"
    };

    // Helper: Add common slide elements
    const addSlide = (title, subtitle) => {
        const slide = pptx.addSlide();
        slide.background = COLORS.background;

        slide.addText(title, {
            x: 0.55, y: 0.55, w: 9, h: 0.8,
            fontSize: 32,
            color: COLORS.title,
            fontFace: "Arial",
            bold: true,
            charSpacing: 2
        });

        if (subtitle) {
            slide.addText(subtitle, {
                x: 0.55, y: 1.2, w: 9, h: 0.5,
                fontSize: 18,
                color: COLORS.subtitle,
                fontFace: "Arial"
            });
        }

        return slide;
    };

    // === Slide 1: Title ===
    const s1 = addSlide("ANTIGRAVITY", "Solar Trainer App: The AI Coaching Platform for Revenue Teams");
    s1.addText("Sales training is broken.\nCoaching doesn’t scale.", {
        x: 0.55, y: 2.0, w: 9, h: 1.0, fontSize: 24, color: "a0a0a0", fontFace: "Arial"
    });
    // Highlight box
    s1.addShape(pptx.shapes.RECTANGLE, { x: 0.55, y: 3.2, w: 9, h: 1.5, fill: { color: COLORS.highlightBg, transparency: 20 }, line: { color: COLORS.accentBlue, width: 1 } });
    s1.addText("Solar Trainer App turns training into daily, AI-powered practice — before reps ever touch real customers.", {
        x: 0.75, y: 3.3, w: 8.6, h: 1.3, fontSize: 24, color: COLORS.strong, bold: true, fontFace: "Arial"
    });


    // === Slide 2: The Problem ===
    const s2 = addSlide("THE PROBLEM");
    s2.addText("Sales organizations face the same issues across industries:", { x: 0.55, y: 1.5, w: 9, h: 0.5, fontSize: 18, color: COLORS.text, fontFace: "Arial" });
    s2.addText([
        { text: "Reps learn on live customers", options: { bullet: true } },
        { text: "Managers repeat the same coaching endlessly", options: { bullet: true } },
        { text: "High rep churn and inconsistent performance", options: { bullet: true } },
        { text: "Traditional LMS platforms are passive and ignored", options: { bullet: true } }
    ], { x: 0.55, y: 2.0, w: 9, h: 1.8, fontSize: 18, color: COLORS.text, fontFace: "Arial", lineSpacing: 24 });

    // Core problem box
    s2.addShape(pptx.shapes.RECTANGLE, { x: 0.55, y: 4.0, w: 9, h: 1.2, fill: { color: COLORS.boxBg }, line: { color: COLORS.accentPink, width: 0 } });
    s2.addShape(pptx.shapes.LINE, { x: 0.55, y: 4.0, w: 0, h: 1.2, line: { color: COLORS.accentPink, width: 5 } }); // Left border
    s2.addText([
        { text: "Core problem:", options: { bold: true, color: "ff6b6b" } },
        { text: "Training exists, but skill readiness is never validated." }
    ], { x: 0.7, y: 4.1, w: 8.7, h: 1.0, fontSize: 18, color: COLORS.text, fontFace: "Arial" });


    // === Slide 3: The Insight ===
    const s3 = addSlide("THE INSIGHT");
    s3.addText("AI makes simulated conversations possible — but generic AI fails in real sales environments.", {
        x: 0.55, y: 1.5, w: 9, h: 0.6, fontSize: 18, color: COLORS.text, fontFace: "Arial"
    });
    s3.addText("Effective sales coaching requires:", {
        x: 0.55, y: 2.2, w: 9, h: 0.4, fontSize: 18, color: COLORS.strong, bold: true, fontFace: "Arial"
    });
    s3.addText([
        { text: "Industry-specific objections", options: { bullet: true } },
        { text: "Realistic buyer behavior", options: { bullet: true } },
        { text: "Habit formation through repetition", options: { bullet: true } },
        { text: "Performance accountability", options: { bullet: true } }
    ], { x: 0.55, y: 2.6, w: 9, h: 1.5, fontSize: 18, color: COLORS.text, fontFace: "Arial", lineSpacing: 24 });

    // Insight box
    s3.addShape(pptx.shapes.RECTANGLE, { x: 0.55, y: 4.2, w: 9, h: 1.0, fill: { color: COLORS.boxBg } });
    s3.addShape(pptx.shapes.LINE, { x: 0.55, y: 4.2, w: 0, h: 1.0, line: { color: COLORS.accentBlue, width: 5 } });
    s3.addText([
        { text: "Insight: ", options: { bold: true } },
        { text: "Training only works when reps practice daily in realistic scenarios and are held accountable." }
    ], { x: 0.7, y: 4.2, w: 8.7, h: 1.0, fontSize: 18, color: COLORS.text, fontFace: "Arial" });


    // === Slide 4: The Solution ===
    const s4 = addSlide("THE SOLUTION");
    s4.addText("Antigravity is an AI Sales Flight Simulator", {
        x: 0.55, y: 1.5, w: 9, h: 0.5, fontSize: 20, color: COLORS.strong, bold: true, fontFace: "Arial"
    });
    s4.addText([
        { text: "AI roleplay with realistic buyers", options: { bullet: true } },
        { text: "Scenario-based practice (discovery, objections, closing)", options: { bullet: true } },
        { text: "Gamification (XP, streaks, leaderboards)", options: { bullet: true } },
        { text: "Automated scoring and feedback", options: { bullet: true } },
        { text: "Certification before live leads", options: { bullet: true } }
    ], { x: 0.55, y: 2.1, w: 9, h: 2.0, fontSize: 18, color: COLORS.text, fontFace: "Arial", lineSpacing: 24 });

    s4.addText([
        { text: "This is not a course.", options: { breakLine: true } },
        { text: "This is sales readiness infrastructure." }
    ], { x: 0.55, y: 4.3, w: 9, h: 0.8, fontSize: 18, color: COLORS.accentBlue, italic: true, align: "center", fontFace: "Arial" });


    // === Slide 5: Why Solar First ===
    const s5 = addSlide("WHY SOLAR FIRST");
    s5.addText("Solar is the ideal wedge market:", { x: 0.55, y: 1.5, w: 9, h: 0.5, fontSize: 18, color: COLORS.text, fontFace: "Arial" });
    s5.addText([
        { text: "High-ticket transactions", options: { bullet: true } },
        { text: "Complex financing and objections", options: { bullet: true } },
        { text: "State-by-state regulation", options: { bullet: true } },
        { text: "Massive rep churn", options: { bullet: true } },
        { text: "Poor industry-wide training standards", options: { bullet: true } }
    ], { x: 0.55, y: 2.0, w: 9, h: 2.0, fontSize: 18, color: COLORS.text, fontFace: "Arial", lineSpacing: 24 });
    s5.addShape(pptx.shapes.RECTANGLE, { x: 0.55, y: 4.2, w: 9, h: 0.8, fill: { color: COLORS.highlightBg, transparency: 20 }, line: { color: COLORS.accentBlue, width: 1 } });
    s5.addText("If Antigravity works in solar, it works anywhere.", {
        x: 0.55, y: 4.2, w: 9, h: 0.8, fontSize: 18, color: COLORS.text, align: "center", fontFace: "Arial"
    });


    // === Slide 6: Product Walkthrough ===
    const s6 = addSlide("PRODUCT WALKTHROUGH");
    s6.addText([
        { text: "Rep logs in", options: { bullet: { type: 'number' }, bold: true } },
        { text: "Selects a scenario", options: { bullet: { type: 'number' }, bold: true } },
        { text: "AI roleplay begins (text → voice)", options: { bullet: { type: 'number' }, bold: true } },
        { text: "Rep receives coaching feedback", options: { bullet: { type: 'number' }, bold: true } },
        { text: "XP, streaks, leaderboard update", options: { bullet: { type: 'number' }, bold: true } },
        { text: "Certification or CRM unlock", options: { bullet: { type: 'number' }, bold: true } }
    ], { x: 0.55, y: 1.5, w: 9, h: 3.5, fontSize: 18, color: COLORS.text, fontFace: "Arial", lineSpacing: 30 });


    // === Slide 7: The AI Coaching Skeleton ===
    const s7 = addSlide("THE AI COACHING SKELETON", "(Platform Moat)");
    s7.addText("Antigravity is built as a vertical-agnostic coaching engine.", { x: 0.55, y: 1.8, w: 9, h: 0.5, fontSize: 18, color: COLORS.text, fontFace: "Arial" });
    s7.addText("Core components:", { x: 0.55, y: 2.4, w: 4, h: 0.4, fontSize: 18, color: COLORS.strong, bold: true, fontFace: "Arial" });

    // Two columns
    s7.addText([
        { text: "Scenario engine", options: { bullet: true } },
        { text: "Objection trees", options: { bullet: true } },
        { text: "Scoring framework", options: { bullet: true } }
    ], { x: 0.55, y: 2.9, w: 4.2, h: 1.5, fontSize: 18, color: COLORS.text, fontFace: "Arial" });

    s7.addText([
        { text: "Feedback model", options: { bullet: true } },
        { text: "Roleplay logic", options: { bullet: true } },
        { text: "Multi-tenant white-label system", options: { bullet: true } }
    ], { x: 5.0, y: 2.9, w: 4.5, h: 1.5, fontSize: 18, color: COLORS.text, fontFace: "Arial" });

    s7.addShape(pptx.shapes.RECTANGLE, { x: 0.55, y: 4.5, w: 9, h: 0.8, fill: { color: COLORS.boxBg } });
    s7.addShape(pptx.shapes.LINE, { x: 0.55, y: 4.5, w: 0, h: 0.8, line: { color: COLORS.accentPink, width: 5 } });
    s7.addText([
        { text: "Key advantage: ", options: { bold: true } },
        { text: "Once the skeleton exists, content becomes modular." }
    ], { x: 0.7, y: 4.5, w: 8.7, h: 0.8, fontSize: 18, color: COLORS.text, fontFace: "Arial" });


    // === Slide 8: Vertical Expansion Strategy ===
    const s8 = addSlide("VERTICAL EXPANSION STRATEGY");
    s8.addText("Same engine. Different industries.", { x: 0.55, y: 1.5, w: 9, h: 0.5, fontSize: 18, color: COLORS.text, fontFace: "Arial" });

    // Left Box
    s8.addShape(pptx.shapes.RECTANGLE, { x: 0.55, y: 2.1, w: 4.2, h: 2.5, fill: { color: COLORS.boxBg } });
    s8.addText("Markets", { x: 0.7, y: 2.2, w: 3.9, h: 0.4, fontSize: 18, color: COLORS.strong, bold: true, fontFace: "Arial" });
    s8.addText([
        { text: "Solar (launch market)", options: { bullet: true } },
        { text: "Roofing", options: { bullet: true } },
        { text: "Pest Control", options: { bullet: true } },
        { text: "Life Insurance", options: { bullet: true } },
        { text: "HVAC", options: { bullet: true } },
        { text: "Med Spas", options: { bullet: true } }
    ], { x: 0.7, y: 2.6, w: 3.9, h: 1.9, fontSize: 16, color: COLORS.text, fontFace: "Arial" });

    // Right Box
    s8.addShape(pptx.shapes.RECTANGLE, { x: 5.0, y: 2.1, w: 4.5, h: 2.5, fill: { color: COLORS.highlightBg } });
    s8.addText("Each vertical swaps:", { x: 5.2, y: 2.2, w: 4.1, h: 0.4, fontSize: 18, color: COLORS.strong, bold: true, fontFace: "Arial" });
    s8.addText([
        { text: "Scripts", options: { bullet: true } },
        { text: "Objections", options: { bullet: true } },
        { text: "Compliance logic", options: { bullet: true } },
        { text: "Buyer psychology", options: { bullet: true } }
    ], { x: 5.2, y: 2.6, w: 4.1, h: 1.9, fontSize: 16, color: COLORS.text, fontFace: "Arial" });

    s8.addText("This is a platform, not a one-off SaaS.", { x: 0.55, y: 4.7, w: 9, h: 0.6, fontSize: 18, color: COLORS.accentBlue, align: "center", fontFace: "Arial" });


    // === Slide 9: Business Model ===
    const s9 = addSlide("BUSINESS MODEL");
    s9.addText([
        { text: "Per-seat SaaS subscriptions", options: { bullet: true } },
        { text: "White-label enterprise licensing", options: { bullet: true } },
        { text: "Premium voice & video simulations", options: { bullet: true } },
        { text: "Manager analytics dashboards", options: { bullet: true } },
        { text: "CRM gating (training → lead access)", options: { bullet: true } }
    ], { x: 0.55, y: 1.5, w: 9, h: 2.2, fontSize: 18, color: COLORS.text, fontFace: "Arial", lineSpacing: 24 });

    s9.addShape(pptx.shapes.RECTANGLE, { x: 0.55, y: 3.8, w: 9, h: 1.3, fill: { color: COLORS.highlightBg, transparency: 20 }, line: { color: COLORS.accentBlue, width: 1 } });
    s9.addText("High margin. Low churn.\nExpansion-driven revenue.", {
        x: 0.55, y: 3.8, w: 9, h: 1.3, fontSize: 24, color: COLORS.text, align: "center", fontFace: "Arial"
    });


    // === Slide 10: Traction & Roadmap ===
    const s10 = addSlide("TRACTION & ROADMAP");
    const checkColor = COLORS.accentBlue;
    const arrowColor = COLORS.accentPink;

    const roadmapItems = [
        { icon: "✓", color: checkColor, text: "MVP+ complete" },
        { icon: "✓", color: checkColor, text: "Multi-tenant architecture live" },
        { icon: "✓", color: checkColor, text: "Gamification and certification working" },
        { icon: "→", color: arrowColor, text: "Voice roleplay and CRM gating next" },
        { icon: "→", color: arrowColor, text: "Enterprise pilots planned" }
    ];

    roadmapItems.forEach((item, idx) => {
        const yPos = 1.5 + (idx * 0.6);
        s10.addText(item.icon, { x: 0.8, y: yPos, w: 0.5, h: 0.5, fontSize: 20, color: item.color, bold: true, fontFace: "Arial" });
        s10.addText(item.text, { x: 1.3, y: yPos, w: 8, h: 0.5, fontSize: 20, color: COLORS.text, fontFace: "Arial" });
    });


    // === Slide 11: The Ask ===
    const s11 = pptx.addSlide();
    s11.background = COLORS.background;
    s11.addText("THE ASK", {
        x: 0.55, y: 0.55, w: 9, h: 0.8,
        fontSize: 32, color: COLORS.title, fontFace: "Arial", bold: true, charSpacing: 2
    });
    s11.addText("Seeking strategic capital or partnerships to accelerate:", {
        x: 0.55, y: 1.5, w: 9, h: 0.5, fontSize: 18, color: COLORS.text, fontFace: "Arial"
    });

    // Icons (using emoji for simplicity as fallback was robust)
    const yPos = 3.0;
    const colW = 3.0;

    s11.addText("🎤", { x: 0.5, y: 2.3, w: colW, h: 0.6, fontSize: 40, align: "center" });
    s11.addText("Voice realism", { x: 0.5, y: 2.9, w: colW, h: 0.5, fontSize: 20, color: COLORS.strong, bold: true, align: "center", fontFace: "Arial" });

    s11.addText("🏢", { x: 3.5, y: 2.3, w: colW, h: 0.6, fontSize: 40, align: "center" });
    s11.addText("Enterprise integrations", { x: 3.5, y: 2.9, w: colW, h: 0.5, fontSize: 20, color: COLORS.strong, bold: true, align: "center", fontFace: "Arial" });

    s11.addText("🚀", { x: 6.5, y: 2.3, w: colW, h: 0.6, fontSize: 40, align: "center" });
    s11.addText("Multi-vertical rollout", { x: 6.5, y: 2.9, w: colW, h: 0.5, fontSize: 20, color: COLORS.strong, bold: true, align: "center", fontFace: "Arial" });


    const outputFile = path.join(__dirname, 'Antigravity_Pitch_Deck.pptx');
    await pptx.writeFile({ fileName: outputFile });
    console.log(`Native Presentation created successfully at ${outputFile}`);
}

createPresentation().catch(err => {
    console.error(err);
    process.exit(1);
});
