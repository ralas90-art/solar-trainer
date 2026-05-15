import axios from 'axios';

const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/p5wbVxxtAqPqnOsCqaTt/webhook-trigger/Qsx8ubVQ8gVPtF8nHWJ2';

const testPayload = {
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
};

async function sendTest() {
    console.log('Sending test payload to GHL...');
    try {
        const response = await axios.post(GHL_WEBHOOK_URL, testPayload);
        console.log('Success!', response.status, response.data);
    } catch (error) {
        console.error('Error sending test:', error.response?.data || error.message);
    }
}

sendTest();
