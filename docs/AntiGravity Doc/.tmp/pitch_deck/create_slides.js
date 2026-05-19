const fs = require('fs');
const path = require('path');

const slides = [
    {
        title: "ANTIGRAVITY",
        subtitle: "Solar Trainer App: The AI Coaching Platform for Revenue Teams",
        content: `
            <div style="margin-top: 40pt;">
                <p style="font-size: 24pt; color: #a0a0a0;">Sales training is broken.<br>Coaching doesn’t scale.</p>
                <div class="highlight-box">
                    <p style="font-size: 28pt; font-weight: bold; color: #ffffff;">Solar Trainer App turns training into daily, AI-powered practice — before reps ever touch real customers.</p>
                </div>
            </div>
        `,
        type: "title"
    },
    {
        title: "The Problem",
        content: `
            <p>Sales organizations face the same issues across industries:</p>
            <ul>
                <li>Reps learn on live customers</li>
                <li>Managers repeat the same coaching endlessly</li>
                <li>High rep churn and inconsistent performance</li>
                <li>Traditional LMS platforms are passive and ignored</li>
            </ul>
            <div class="box">
                <p style="font-weight: bold; color: #ff6b6b;">Core problem:</p>
                <p>Training exists, but skill readiness is never validated.</p>
            </div>
        `
    },
    {
        title: "The Insight",
        content: `
            <p>AI makes simulated conversations possible — but generic AI fails in real sales environments.</p>
            <p><strong>Effective sales coaching requires:</strong></p>
            <ul>
                <li>Industry-specific objections</li>
                <li>Realistic buyer behavior</li>
                <li>Habit formation through repetition</li>
                <li>Performance accountability</li>
            </ul>
            <div class="box" style="border-left-color: #4cc9f0;">
                <p><strong>Insight:</strong> Training only works when reps practice daily in realistic scenarios and are held accountable.</p>
            </div>
        `
    },
    {
        title: "The Solution",
        content: `
            <p style="font-size: 20pt; margin-bottom: 20pt;"><strong>Antigravity is an AI Sales Flight Simulator</strong></p>
            <ul>
                <li>AI roleplay with realistic buyers</li>
                <li>Scenario-based practice (discovery, objections, closing)</li>
                <li>Gamification (XP, streaks, leaderboards)</li>
                <li>Automated scoring and feedback</li>
                <li>Certification before live leads</li>
            </ul>
            <div style="margin-top: 20pt;">
                <p style="text-align: center; font-style: italic; color: #4cc9f0;">This is not a course.<br>This is sales readiness infrastructure.</p>
            </div>
        `
    },
    {
        title: "Why Solar First",
        content: `
            <p>Solar is the ideal wedge market:</p>
            <ul>
                <li>High-ticket transactions</li>
                <li>Complex financing and objections</li>
                <li>State-by-state regulation</li>
                <li>Massive rep churn</li>
                <li>Poor industry-wide training standards</li>
            </ul>
            <div class="highlight-box">
                <p style="text-align: center;">If Antigravity works in solar, it works anywhere.</p>
            </div>
        `
    },
    {
        title: "Product Walkthrough",
        content: `
            <ol>
                <li><strong>Rep logs in</strong></li>
                <li><strong>Selects a scenario</strong></li>
                <li><strong>AI roleplay begins</strong> (text → voice)</li>
                <li><strong>Rep receives coaching feedback</strong></li>
                <li><strong>XP, streaks, leaderboard update</strong></li>
                <li><strong>Certification or CRM unlock</strong></li>
            </ol>
        `
    },
    {
        title: "The AI Coaching Skeleton",
        subtitle: "(Platform Moat)",
        content: `
            <p>Antigravity is built as a vertical-agnostic coaching engine.</p>
            <div style="display: flex; gap: 20pt; margin-top: 10pt;">
                <div style="flex: 1;">
                    <p><strong>Core components:</strong></p>
                    <ul>
                        <li>Scenario engine</li>
                        <li>Objection trees</li>
                        <li>Scoring framework</li>
                    </ul>
                </div>
                <div style="flex: 1;">
                    <ul>
                        <li>Feedback model</li>
                        <li>Roleplay logic</li>
                        <li>Multi-tenant white-label system</li>
                    </ul>
                </div>
            </div>
            <div class="box">
                <p><strong>Key advantage:</strong> Once the skeleton exists, content becomes modular.</p>
            </div>
        `
    },
    {
        title: "Vertical Expansion Strategy",
        content: `
            <p>Same engine. Different industries.</p>
            <div style="display: flex; gap: 20pt; margin-top: 10pt;">
                <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 10pt; border-radius: 8pt;">
                    <p><strong>Markets</strong></p>
                    <ul>
                        <li>Solar (launch market)</li>
                        <li>Roofing</li>
                        <li>Pest Control</li>
                        <li>Life Insurance</li>
                        <li>HVAC</li>
                        <li>Med Spas</li>
                    </ul>
                </div>
                <div style="flex: 1; background: rgba(0,210,255,0.05); padding: 10pt; border-radius: 8pt;">
                    <p><strong>Each vertical swaps:</strong></p>
                    <ul>
                        <li>Scripts</li>
                        <li>Objections</li>
                        <li>Compliance logic</li>
                        <li>Buyer psychology</li>
                    </ul>
                </div>
            </div>
            <p style="text-align: center; margin-top: 20pt; color: #4cc9f0;">This is a platform, not a one-off SaaS.</p>
        `
    },
    {
        title: "Business Model",
        content: `
            <ul>
                <li>Per-seat SaaS subscriptions</li>
                <li>White-label enterprise licensing</li>
                <li>Premium voice & video simulations</li>
                <li>Manager analytics dashboards</li>
                <li>CRM gating (training → lead access)</li>
            </ul>
            <div class="highlight-box" style="margin-top: 30pt;">
                <p style="text-align: center; font-size: 24pt;">High margin. Low churn.<br>Expansion-driven revenue.</p>
            </div>
        `
    },
    {
        title: "Traction & Roadmap",
        content: `
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 15pt;"><span style="color: #4cc9f0; font-weight: bold;">✓</span> MVP+ complete</li>
                <li style="margin-bottom: 15pt;"><span style="color: #4cc9f0; font-weight: bold;">✓</span> Multi-tenant architecture live</li>
                <li style="margin-bottom: 15pt;"><span style="color: #4cc9f0; font-weight: bold;">✓</span> Gamification and certification working</li>
                <li style="margin-bottom: 15pt;"><span style="color: #f72585; font-weight: bold;">→</span> Voice roleplay and CRM gating next</li>
                <li style="margin-bottom: 15pt;"><span style="color: #f72585; font-weight: bold;">→</span> Enterprise pilots planned</li>
            </ul>
        `
    },
    {
        title: "The Ask",
        content: `
            <p>Seeking strategic capital or partnerships to accelerate:</p>
            <div style="display: flex; justify-content: space-around; margin-top: 30pt;">
                <div style="text-align: center; flex: 1;">
                    <div style="font-size: 40pt; margin-bottom: 10pt;">🎤</div>
                    <p><strong>Voice realism</strong></p>
                </div>
                <div style="text-align: center; flex: 1;">
                    <div style="font-size: 40pt; margin-bottom: 10pt;">🏢</div>
                    <p><strong>Enterprise integrations</strong></p>
                </div>
                <div style="text-align: center; flex: 1;">
                    <div style="font-size: 40pt; margin-bottom: 10pt;">🚀</div>
                    <p><strong>Multi-vertical rollout</strong></p>
                </div>
            </div>
        `
    }
];

const css = `
    body {
        width: 720pt;
        height: 405pt;
        margin: 0;
        padding: 0;
        background-image: url('../background.png');
        background-size: cover;
        font-family: Arial, sans-serif;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .slide-container {
        flex: 1;
        padding: 40pt;
        display: flex;
        flex-direction: column;
    }
    h1 {
        font-size: 32pt;
        color: #00d2ff;
        margin: 0 0 10pt 0;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    h2 {
        font-size: 18pt;
        color: #b0b0b0;
        margin: 0 0 15pt 0;
        font-weight: normal;
    }
    p, li {
        font-size: 16pt;
        line-height: 1.3;
        color: #e0e0e0;
        margin-bottom: 8pt;
    }
    ul, ol {
        margin-top: 0;
        padding-left: 30pt;
    }
    li {
        margin-bottom: 10pt;
    }
    .box {
        background: rgba(255, 255, 255, 0.05);
        border-left: 5pt solid #f72585; /* Pink accent */
        padding: 15pt;
        margin-top: 15pt;
        border-radius: 0 4pt 4pt 0;
    }
    .highlight-box {
        background: rgba(67, 97, 238, 0.2);
        padding: 20pt;
        border-radius: 8pt;
        margin-top: 20pt;
        border: 1px solid rgba(76, 201, 240, 0.3);
    }
    strong {
        color: #ffffff;
    }
`;

slides.forEach((slide, index) => {
    const filename = `slides/slide${index + 1}.html`;
    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>${css}</style>
</head>
<body>
    <div class="slide-container">
        <h1>${slide.title}</h1>
        ${slide.subtitle ? `<h2>${slide.subtitle}</h2>` : ''}
        <div class="content">
            ${slide.content}
        </div>
        <div style="position: absolute; bottom: 20pt; right: 20pt; width: 30pt; height: 20pt;">
            <p style="font-size: 10pt; color: #555; text-align: right; margin: 0;">${index + 1}</p>
        </div>
    </div>
</body>
</html>
    `;
    fs.writeFileSync(path.join(__dirname, filename), html);
    console.log(`Created ${filename}`);
});
