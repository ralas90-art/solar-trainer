const pptxgen = require('pptxgenjs');
const path = require('path');
const html2pptx = require('./html2pptx');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity Agent';
    pptx.title = 'Antigravity Solar Trainer Pitch Deck';

    // Process slides 1-10
    for (let i = 1; i <= 10; i++) {
        const slidePath = path.join(__dirname, `slides/slide${i}.html`);
        console.log(`Processing ${slidePath}...`);
        try {
            await html2pptx(slidePath, pptx);
            await sleep(500);
        } catch (err) {
            console.error(`Error processing slide ${i}:`, err);
        }
    }

    // Manual Slide 11 (The Ask) to avoid browser crash
    console.log("Creating Slide 11 manually...");
    const slide11 = pptx.addSlide();
    slide11.background = { path: path.join(__dirname, 'background.png') };

    // Title (Approx. 40pt margin = 0.55 inch)
    slide11.addText("THE ASK", {
        x: 0.55, y: 0.55, w: '90%', h: 0.8,
        fontSize: 36, color: "00d2ff", fontFace: "Arial",
        shadow: { type: 'outer', color: '000000', opacity: 0.5, blur: 4, offset: 2, angle: 90 }
    });

    // Subtext
    slide11.addText("Seeking strategic capital or partnerships to accelerate:", {
        x: 0.55, y: 1.5, w: '90%', h: 0.5,
        fontSize: 18, color: "e0e0e0", fontFace: "Arial"
    });

    // Columns
    const yPos = 2.5;
    const colW = 3.0;

    // Center items roughly
    slide11.addText("🎤 Voice realism", { x: 0.5, y: yPos, w: colW, h: 1, fontSize: 24, color: "ffffff", bold: true, align: "center", fontFace: "Arial" });
    slide11.addText("🏢 Enterprise integrations", { x: 3.5, y: yPos, w: colW, h: 1, fontSize: 24, color: "ffffff", bold: true, align: "center", fontFace: "Arial" });
    slide11.addText("🚀 Multi-vertical rollout", { x: 6.5, y: yPos, w: colW, h: 1, fontSize: 24, color: "ffffff", bold: true, align: "center", fontFace: "Arial" });


    const outputFile = path.join(__dirname, 'Antigravity_Pitch_Deck.pptx');
    await pptx.writeFile({ fileName: outputFile });
    console.log(`Presentation created successfully at ${outputFile}`);
}

createPresentation().catch(console.error);
