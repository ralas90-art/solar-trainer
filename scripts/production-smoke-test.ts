import http from 'http';
import https from 'https';

/**
 * SeptiVolt Production Smoke Test
 * 
 * Usage: npx tsx scripts/production-smoke-test.ts [BASE_URL]
 */

const CRITICAL_ROUTES = [
  '/',
  '/pricing',
  '/enterprise',
  '/solar-sales-training-assessment',
  '/login',
  '/signup',
  '/contact',
  '/curriculum-preview',
  '/my-training',
  '/manager',
  '/api/assessment-submit', // Check endpoint existence
  '/platform_mockup_showcase.png', // Verify static assets
  '/audio/modules/es/mod_1_1/section_1.mp3' // Verify deep audio assets
];

const BASE_URL = process.argv[2] || 'https://solar-trainer.vercel.app';

async function checkRoute(route: string): Promise<{ route: string; status: number; ok: boolean }> {
  const url = `${BASE_URL.replace(/\/$/, '')}${route}`;
  const client = url.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    client.request(url, { method: 'HEAD' }, (res) => {
      // 200-299 is OK, 405 is also OK for POST-only API routes if checking existence
      const isApi = route.startsWith('/api/');
      const ok = (res.statusCode! >= 200 && res.statusCode! < 400) || (isApi && res.statusCode === 405);
      resolve({ route, status: res.statusCode!, ok });
    }).on('error', () => {
      resolve({ route, status: 0, ok: false });
    }).end();
  });
}

async function runSmokeTest() {
  console.log(`--- SeptiVolt Production Smoke Test ---`);
  console.log(`Target: ${BASE_URL}\n`);

  let failCount = 0;
  
  for (const route of CRITICAL_ROUTES) {
    const result = await checkRoute(route);
    const indicator = result.ok ? '✅' : '❌';
    console.log(`${indicator} ${result.route.padEnd(40)} [Status: ${result.status}]`);
    if (!result.ok) failCount++;
  }

  console.log(`\nResults: ${CRITICAL_ROUTES.length - failCount} Passed, ${failCount} Failed.`);
  
  if (failCount > 0) {
    console.log('\nERROR: Critical routes are failing. Deployment integrity compromised.');
    process.exit(1);
  } else {
    console.log('\nSUCCESS: All critical routes are operational.');
    process.exit(0);
  }
}

runSmokeTest();
