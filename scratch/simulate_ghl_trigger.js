const https = require('https');
const http = require('http');

const LOCAL_TRIGGER_URL = 'http://localhost:3000/api/manus-trigger';

const testPayload = JSON.stringify({
    firstName: 'Simulation',
    lastName: 'Tester',
    email: 'sim-test@septivolt.ai',
    phone: '+15551234567',
    company: 'Simulation Solar',
    septivolt_recommended_track: 'Bilingual Sales Team Track',
    septivolt_score: 88,
    septivolt_experience_level: '2-5 years',
    septivolt_team_size: '5-10 reps',
    septivolt_training_gap: 'Closing in Spanish'
});

console.log('--- MANUS TRIGGER SIMULATION ---');
console.log('Sending test data to:', LOCAL_TRIGGER_URL);

const url = new URL(LOCAL_TRIGGER_URL);
const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': testPayload.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Response Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(data);
            console.log('Response Body:', JSON.stringify(parsedData, null, 2));
            if (res.statusCode === 200) {
                console.log('\n✅ SUCCESS: Manus task initiated!');
                console.log('Task ID:', parsedData.manus_task_id);
                console.log('Progress URL:', parsedData.manus_task_url);
            } else {
                console.log('\n❌ FAILED: Check the response body above.');
            }
        } catch (e) {
            console.log('Raw Response:', data);
        }
    });
});

req.on('error', (error) => {
    if (error.code === 'ECONNREFUSED') {
        console.error('\n❌ ERROR: Connection refused. Is your local server running (npm run dev)?');
    } else {
        console.error('\n❌ ERROR:', error.message);
    }
});

req.write(testPayload);
req.end();
