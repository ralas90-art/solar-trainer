const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const html2pptx = require('./AntiGravity Doc/.agent/skills/pptx/scripts/html2pptx.js');

const COLORS = {
    dark: '#141413',
    light: '#faf9f5',
    midGray: '#b0aea5',
    lightGray: '#e8e6dc',
    orange: '#d97757',
    blue: '#6a9bcc',
    green: '#788c5d'
};

const HTML_BASE = (content) => `
<!DOCTYPE html>
<html>
<head>
<style>
* { box-sizing: border-box; }
html { background: ${COLORS.light}; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background: ${COLORS.light}; font-family: Georgia, serif;
  display: flex; color: ${COLORS.dark}; flex-direction: column;
}
.slide-container {
    width: 100%; height: 100%; display: flex; flex-direction: column;
}
.title-bar {
    background: ${COLORS.orange}; color: ${COLORS.light}; padding: 15pt 40pt;
}
.title-bar-blue {
    background: ${COLORS.blue}; color: ${COLORS.light}; padding: 15pt 40pt;
}
.title-bar-green {
    background: ${COLORS.green}; color: ${COLORS.light}; padding: 15pt 40pt;
}
h1 { font-family: Arial, sans-serif; font-size: 30pt; margin: 0; color: inherit; }
h2 { font-family: Arial, sans-serif; font-size: 22pt; margin: 0 0 5pt 0; color: ${COLORS.blue}; }
h3 { font-family: Arial, sans-serif; font-size: 18pt; color: ${COLORS.green}; margin: 0 0 5pt 0; }
.content-area {
    padding: 10pt 40pt; flex: 1; display: flex; flex-direction: column; justify-content: flex-start;
}
p { font-size: 18pt; line-height: 1.3; margin: 3pt 0; }
ul, ol { font-size: 18pt; line-height: 1.3; margin: 3pt 0 3pt 20pt; }
li { margin-bottom: 3pt; }
.two-col {
    display: flex; flex-direction: row; gap: 30pt; flex: 1;
}
.col { flex: 1; display: flex; flex-direction: column; }
.box-highlight {
    background: ${COLORS.lightGray}; padding: 10pt 15pt; border-left: 8pt solid ${COLORS.orange}; border-radius: 8pt; margin-top: 10pt;
}
.box-blue {
    background: ${COLORS.lightGray}; padding: 10pt 15pt; border-left: 8pt solid ${COLORS.blue}; border-radius: 8pt; margin-top: 10pt;
}
.box-green {
    background: ${COLORS.lightGray}; padding: 10pt 15pt; border-left: 8pt solid ${COLORS.green}; border-radius: 8pt; margin-top: 10pt;
}
.image-placeholder {
    background: ${COLORS.midGray}; border-radius: 12pt; display: flex; align-items: center; justify-content: center;
    color: ${COLORS.dark}; font-family: Arial, sans-serif; height: 140pt; flex: 1; margin-top: 10pt; overflow: hidden;
}
.image-placeholder img {
    width: 100%; height: 100%; object-fit: cover;
}
.title-slide {
    background: ${COLORS.dark}; color: ${COLORS.light}; align-items: center; justify-content: center; text-align: center;
    width: 100%; height: 100%; display: flex; flex-direction: column; padding: 40pt;
}
.title-slide h1 { color: ${COLORS.orange}; font-size: 40pt; margin-bottom: 15pt; }
.title-slide h2 { color: ${COLORS.lightGray}; font-size: 26pt; }
.bottom-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 10pt; background: ${COLORS.green};
}
.center { text-align: center; align-items: center; }
.large-text { font-size: 22pt; line-height: 1.4; }
.xl-text { font-size: 28pt; line-height: 1.4; color: ${COLORS.orange}; font-weight: bold; }
</style>
</head>
<body>
${content}
</body>
</html>
`;

async function createSlide(htmlContent, pptx, notes) {
    const tmpFile = path.join(__dirname, `tmp_slide_${Date.now()}_${Math.floor(Math.random() * 1000)}.html`);
    fs.writeFileSync(tmpFile, HTML_BASE(htmlContent));
    const { slide } = await html2pptx(tmpFile, pptx);
    if (notes) {
        slide.addNotes(notes.replace(/'/g, "\\'"));
    }
    fs.unlinkSync(tmpFile);
    return slide;
}

async function buildPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity Training';
    pptx.title = 'Module 2.1: Homeowner Psychology';

    console.log("Creating Slide 1...");
    // Slide 1
    await createSlide(`
        <div class="title-slide">
            <h1>Module 2.1 – Homeowner Psychology</h1>
            <h2>Why People Resist Solar</h2>
            <div class="box-highlight" style="margin-top: 20pt; background: ${COLORS.light}; color: ${COLORS.dark}; border-left-color: ${COLORS.blue}">
                <p style="margin: 0;"><b>Learning Objectives:</b> Identify psychological barriers and leverage persuasion triggers.</p>
            </div>
            <div class="bottom-bar"></div>
        </div>
    `, pptx, "Today we stop being 'salespeople' and start being 'behavioral psychologists.' If you don't understand why they say 'No,' you'll never hear 'Yes.'");

    console.log("Creating Slide 2...");
    // Slide 2
    await createSlide(`
        <div class="title-bar">
            <h1>Reality Check: You Are an Interruption</h1>
        </div>
        <div class="content-area two-col">
            <div class="col">
                <p>Most homeowners are <b>NOT</b> looking for solar today.</p>
                <div class="box-blue">
                    <p style="margin: 0;">The brain defaults to "Protection Mode."</p>
                </div>
                <div class="box-highlight">
                    <p style="margin: 0;">Status Quo = Safety.</p>
                </div>
            </div>
            <div class="col">
                <div class="image-placeholder">
                    <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/homeowner_door_guarded_1772977189989.png" />
                </div>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx, "You are interrupting dinner, a movie, or a nap. Their brain is wired to get rid of you as fast as possible to return to the status quo. Don't take it personally—it's biology.");

    console.log("Creating Slide 3...");
    // Slide 3
    await createSlide(`
        <div class="title-bar">
            <h1>The Status Quo Bias</h1>
        </div>
        <div class="content-area two-col">
            <div class="col">
                <h2>The Bias</h2>
                <p>Preference for the current state.</p>
                <h2 style="margin-top:10pt; color:${COLORS.orange}">The Perception</h2>
                <p>Change = Risk.</p>
                <h2 style="margin-top:10pt; color:${COLORS.green}">The Reality</h2>
                <p>Doing nothing feels free, but it's actually the most expensive option.</p>
            </div>
            <div class="col">
                <div class="image-placeholder">
                    <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/status_quo_island_1772977258558.png" />
                </div>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx, "Your job isn't to sell panels; it's to show them that their 'safe' island is actually sinking due to utility rate hikes.");

    console.log("Creating Slide 4...");
    // Slide 4
    await createSlide(`
        <div class="title-bar">
            <h1>Decision Avoidance & Loss Aversion</h1>
        </div>
        <div class="content-area">
            <ul>
                <li>Decisions create "Cognitive Load" (Anxiety).</li>
                <li>"I'll think about it" is a survival mechanism.</li>
            </ul>
            <div class="box-highlight" style="margin-top: 15pt; padding: 20pt;">
                <p class="xl-text" style="margin:0; text-align:center;">Loss Aversion</p>
                <p class="large-text" style="text-align:center; margin-top: 10pt;">We hate losing $100 more than we love gaining $100.</p>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx, "Instead of saying 'You'll save $2,000,' try 'You are currently losing $2,000 to the utility company.' It hits differently.");

    console.log("Creating Slide 5...");
    // Slide 5
    await createSlide(`
        <div class="title-bar">
            <h1>The Trust Barrier (Contractor PTSD)</h1>
        </div>
        <div class="content-area two-col">
            <div class="col">
                <p class="large-text">Homeowners have been burned before.</p>
                <div class="box-blue">
                    <p style="margin: 0; font-weight: bold;">They evaluate YOU before the PRODUCT.</p>
                </div>
                <h3 style="margin-top: 10pt; color: ${COLORS.orange}">Physical Signs of Distrust:</h3>
                <ul>
                    <li>Crossed arms</li>
                    <li>Short answers</li>
                    <li>Angled body (ready to close door)</li>
                </ul>
            </div>
            <div class="col">
                <div class="image-placeholder">
                    <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/homeowner_arms_crossed_1772977202428.png" />
                </div>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx);

    console.log("Creating Slide 6...");
    // Slide 6
    await createSlide(`
        <div class="title-bar">
            <h1>Addressing Skepticism Directly</h1>
        </div>
        <div class="content-area">
            <h2 style="color: ${COLORS.dark}">The Script:</h2>
            <div class="box-highlight" style="background: ${COLORS.dark}; color: ${COLORS.light}; border-left-color: ${COLORS.green}; padding: 20pt;">
                <p class="large-text" style="margin: 0; font-style: italic;">"I know solar reps have a certain reputation, and I get it. That's why I start with the numbers first. If it doesn't make sense, I'll tell you."</p>
            </div>
            <div class="box-blue" style="margin-top: 15pt;">
                <p class="large-text" style="margin: 0; text-align: center;">Naming the "Elephant in the room" builds instant rapport.</p>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx, "When you admit that some people in this industry are pushy, you instantly separate yourself from them.");

    console.log("Creating Slide 7...");
    // Slide 7
    await createSlide(`
        <div class="title-slide" style="position: relative; padding: 0;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -2;">
                <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/aerial_suburb_1772977219342.png" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${COLORS.blue}; opacity: 0.8; z-index: -1;"></div>
            <div style="position: relative; z-index: 10; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%;">
                <h1 style="color: ${COLORS.light};">Module 2.2 – Territory Strategy & Planning</h1>
            </div>
            <div class="bottom-bar" style="background: ${COLORS.dark}; position: absolute; z-index: 10;"></div>
        </div>
    `, pptx, "");

    console.log("Creating Slide 8...");
    // Slide 8
    await createSlide(`
        <div class="title-bar-blue">
            <h1>The Cloverleaf Strategy</h1>
        </div>
        <div class="content-area two-col">
            <div class="col">
                <ol>
                    <li>Start with a recent install/customer.</li>
                    <li>Knock the 4 houses to the left, 4 to the right, and 8 across the street.</li>
                </ol>
                <div class="box-green" style="margin-top: 10pt;">
                    <p style="margin: 0;">Social proof is higher within 500 feet of an install.</p>
                </div>
            </div>
            <div class="col">
                <div class="image-placeholder" style="background: ${COLORS.lightGray}">
                    <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/cloverleaf_diagram_1772977272073.png" />
                </div>
            </div>
        </div>
        <div class="bottom-bar" style="background: ${COLORS.blue}"></div>
    `, pptx, "Neighbors don't want to be the first to go solar, but they definitely don't want to be the last.");

    console.log("Creating Slide 9...");
    // Slide 9
    await createSlide(`
        <div class="title-bar-blue">
            <h1>Identifying High-Probability Pockets</h1>
        </div>
        <div class="content-area two-col">
            <div class="col">
                <h2 style="color: ${COLORS.dark}">Look For:</h2>
                <ul style="font-size: 18pt; line-height: 1.4;">
                    <li>Home values $250k+</li>
                    <li>Roofs 5-15 years old<br><span style="font-size: 14pt; color: ${COLORS.midGray}">(not brand new, not failing)</span></li>
                    <li>South-facing roof planes</li>
                    <li>Electric vehicles in the driveway</li>
                </ul>
            </div>
            <div class="col">
                <div class="image-placeholder" style="height: 65pt; margin-top: 0; border-radius: 6pt;">
                    <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/perfect_roof_1772977286513.png" />
                </div>
                <div class="image-placeholder" style="height: 65pt; margin-top: 10pt; border-radius: 6pt; background: ${COLORS.orange}">
                    <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/heavy_shade_roof_1772977302936.png" />
                </div>
                <div class="image-placeholder" style="height: 65pt; margin-top: 10pt; border-radius: 6pt; background: ${COLORS.green}">
                    <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/ev_charger_1772977316994.png" />
                </div>
            </div>
        </div>
        <div class="bottom-bar" style="background: ${COLORS.blue}"></div>
    `, pptx, "");

    console.log("Creating Slide 10...");
    // Slide 10
    await createSlide(`
        <div class="title-slide" style="background: ${COLORS.green}; justify-content: flex-start; padding-top: 40pt;">
            <h1 style="color: ${COLORS.light}">The $78 Door: Reframing Rejection</h1>
            <div class="box-highlight" style="background: ${COLORS.light}; color: ${COLORS.dark}; width: 80%; max-width: 600pt; margin-top: 20pt; align-self: center; border-left-color: ${COLORS.dark}; padding: 20pt;">
                <p class="large-text" style="text-align: center; margin: 0">45 Knocks = 1 Sale<br><br>1 Sale = $3,500 Commission</p>
                <div style="border-top: 2px solid ${COLORS.midGray}; margin: 15pt 0;"></div>
                <p class="xl-text" style="text-align: center; color: ${COLORS.green} !important; margin: 0">Value of 1 Knock = $77.77</p>
            </div>
            <div class="bottom-bar" style="background: ${COLORS.dark}"></div>
        </div>
    `, pptx, "When someone slams a door on you, say 'Thank you for the $78!' It takes the sting out of 'No.'");

    console.log("Creating Slide 11...");
    // Slide 11
    await createSlide(`
        <div class="title-bar">
            <h1>The 7-Step Door Framework</h1>
        </div>
        <div class="content-area two-col">
            <div class="col" style="flex: 1.5">
                <ol style="font-size: 18pt; line-height: 1.4;">
                    <li><b>Pattern Interrupt</b></li>
                    <li>Rapport</li>
                    <li>Curiosity Question</li>
                    <li>Problem Awareness</li>
                    <li>Bill Discovery</li>
                    <li>Qualification</li>
                    <li><b>The Close</b> (Appointment)</li>
                </ol>
            </div>
            <div class="col" style="flex: 1">
                <div class="image-placeholder" style="height: 100%; min-height: 200pt; background: ${COLORS.lightGray}; border: 4px solid ${COLORS.blue}; margin-top: 0;">
                    <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/seven_step_stairs_1772977329342.png" />
                </div>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx, "Do not skip steps. If you try to see the bill (Step 5) before you build rapport (Step 2), they will kick you off the porch.");

    console.log("Creating Slide 12...");
    // Slide 12
    await createSlide(`
        <div class="title-bar">
            <h1>Step 1: The Pattern Interrupt</h1>
        </div>
        <div class="content-area">
            <div class="box-highlight" style="border-left-color: ${COLORS.orange}; margin-top: 0;">
                <h3 style="color:${COLORS.orange}">Standard:</h3>
                <p style="font-style: italic; margin-bottom: 0;">"Hi, how are you today?"</p>
                <p style="font-size: 14pt; color: ${COLORS.midGray}; margin-top: 5pt;">(Homeowner thinks: Salesman!)</p>
            </div>
            <div class="box-blue" style="margin-top: 15pt; border-left-color: ${COLORS.blue}">
                <h3 style="color:${COLORS.blue}">Pattern Interrupt:</h3>
                <p style="font-style: italic;">"Hey, sorry to bother you, I was just looking at your neighbor John's roof..."</p>
            </div>
            <div class="box-green" style="margin-top: 15pt; border-left-color: ${COLORS.dark}; background: ${COLORS.dark}; color: ${COLORS.light}">
                <p style="margin: 0; text-align: center;" class="large-text"><b>Goal:</b> Stop the "Auto-pilot" rejection.</p>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx);

    console.log("Creating Slide 13...");
    // Slide 13
    await createSlide(`
        <div class="title-bar" style="background: ${COLORS.dark}; color: ${COLORS.light}">
            <h1>The Golden Rule: Don't Argue, Get Curious</h1>
        </div>
        <div class="content-area">
            <div class="box-highlight" style="margin-top: 0">
                <p class="large-text" style="text-align: center; margin: 0;">Resistance is a request for more information.</p>
            </div>
            <h2 style="text-align: center; margin: 20pt 0;">Agree + Distract + Ask.</h2>
            <div class="box-blue" style="border-left-color: ${COLORS.green}; background: ${COLORS.green}; color: ${COLORS.light}">
                <p class="large-text" style="margin: 0; font-style: italic; text-align: center;">"That makes sense, most people feel that way until they see the data..."</p>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx, "If you push, they push back. If you pull, they fall toward you. Use their energy.");

    console.log("Creating Slide 14...");
    // Slide 14
    await createSlide(`
        <div class="title-bar" style="background: ${COLORS.dark}; color: ${COLORS.light}">
            <h1>Brush-Off: "I'm Busy"</h1>
        </div>
        <div class="content-area two-col">
            <div class="col" style="background: ${COLORS.lightGray}; padding: 15pt; border-radius: 8pt; border: 2px solid ${COLORS.orange}">
                <h2 style="color: ${COLORS.orange}; text-align: center; margin-bottom: 10pt;">What they mean:</h2>
                <p class="large-text" style="font-style: italic; text-align: center;">"I don't value this enough to stop what I'm doing."</p>
            </div>
            <div class="col" style="background: ${COLORS.blue}; padding: 15pt; border-radius: 8pt; color: ${COLORS.light}">
                <h2 style="color: ${COLORS.light}; text-align: center; margin-bottom: 10pt;">The Response:</h2>
                <p class="large-text" style="font-style: italic; color: ${COLORS.light}">"I completely understand, I'm actually on my way to another neighbor's house. I'm not here to pitch you now—just seeing if you're even eligible for the state program."</p>
            </div>
        </div>
        <div class="bottom-bar"></div>
    `, pptx, "");

    console.log("Creating Slide 15...");
    // Slide 15
    await createSlide(`
        <div class="title-slide" style="background: ${COLORS.green};">
            <h1 style="color: ${COLORS.light}">Homework: The "20/20" Challenge</h1>
            <div style="background: ${COLORS.dark}; padding: 30pt; border-radius: 12pt; margin-top: 30pt; width: 80%; text-align: left;">
                <ul style="color: ${COLORS.light}; font-size: 20pt; line-height: 1.6; padding-left: 20pt;">
                    <li style="margin-bottom: 12pt">Knock 20 practice doors (no pressure).</li>
                    <li style="margin-bottom: 12pt">Record your 30-second "Pattern Interrupt" on your phone.</li>
                    <li>Review the Psychology of Loss Aversion.</li>
                </ul>
            </div>
            <div class="bottom-bar" style="background: ${COLORS.dark}"></div>
        </div>
    `, pptx, "Knowledge without action is just trivia. Go out there and get comfortable being uncomfortable.");

    console.log("Creating Slide 16...");
    // Slide 16
    await createSlide(`
        <div class="title-slide" style="background: ${COLORS.dark};">
            <h1 style="color: ${COLORS.orange}">Day 3 Preview: In-Home Mastery</h1>
            <div class="two-col" style="width: 100%; margin-top: 30pt;">
                <div class="col" style="justify-content: center; flex: 1.5; padding-right: 20pt;">
                    <div style="background: ${COLORS.lightGray}; padding: 20pt 30pt; border-radius: 12pt;">
                        <ul style="font-size: 20pt; line-height: 1.5; text-align: left; color: ${COLORS.dark}; margin: 0;">
                            <li>The "Kitchen Table" workflow</li>
                            <li>Designing the system in real-time</li>
                            <li>The Closing Roadmap</li>
                        </ul>
                    </div>
                </div>
                <div class="col" style="flex: 1">
                    <div class="image-placeholder" style="height: 100%; min-height: 180pt; background: ${COLORS.midGray}; border: 4px solid ${COLORS.orange}; margin-top: 0">
                        <img src="C:/Users/12132/.gemini/antigravity/brain/d409138a-18b3-4f28-a396-07f832f2e8ca/family_kitchen_table_1772977234761.png" />
                    </div>
                </div>
            </div>
            <div class="bottom-bar" style="background: ${COLORS.green}"></div>
        </div>
    `, pptx);

    const outPath = path.join('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/training_materials', 'Day_2_Presentation.pptx');
    await pptx.writeFile({ fileName: outPath });
    console.log('Presentation created at', outPath);
}

buildPresentation().catch(err => {
    console.error("Error creating presentation:", err);
    process.exit(1);
});
