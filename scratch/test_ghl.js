const https = require('https');

const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/p5wbVxxtAqPqnOsCqaTt/webhook-trigger/Qsx8ubVQ8gVPtF8nHWJ2';

const testPayload = JSON.stringify({
    firstName: 'Antigravity',
    lastName: 'Test',
    email: 'test@septivolt.ai',
    phone: '+15550000000',
    company: 'SeptiVolt AI',
    septivolt_lead_type: 'Solar Dealer Owner',
    septivolt_team_size: '16-50 reps',
    septivolt_training_gap: 'Inconsistent closing rates',
    septivolt_language_need: 'Bilingual (English & Spanish)',
    septivolt_experience_level: 'Mixed experience',
    septivolt_training_urgency: 'Immediately',
    septivolt_recommended_track: 'Enterprise / White-Label Track',
    septivolt_score: 95,
    septivolt_funnel_completed: true,
    septivolt_company_name: 'SeptiVolt AI',
    septivolt_source: 'Solar Sales Training Readiness Assessment',
    tags: [
        'SeptiVolt - Funnel Lead',
        'SeptiVolt - Assessment Completed',
        'SeptiVolt - Enterprise'
    ]
});

const url = new URL(GHL_WEBHOOK_URL);
const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': testPayload.length
    }
};

const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(testPayload);
req.end();
