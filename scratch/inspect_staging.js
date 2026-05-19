const { chromium } = require('playwright');

async function run() {
  console.log('Starting Playwright staging login inspection...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to all network requests
  page.on('request', request => {
    const url = request.url();
    console.log(`[Request] ${request.method()} ${url}`);
  });

  // Navigate to login URL with bypass
  const loginUrl = 'https://solar-trainer-66xxh0dzq-ralas90-arts-projects.vercel.app/login?x-vercel-protection-bypass=qQZ8QvU2KoKLQ3QBvm8s3oTTMBMLIwU5&x-vercel-set-bypass-cookie=true';
  try {
    console.log('Navigating to login page...');
    await page.goto(loginUrl, { waitUntil: 'networkidle' });
    console.log('Login page loaded.');

    // Wait for 2 seconds
    await page.waitForTimeout(2000);

    // Let's attempt a dummy login to trigger the API request
    console.log('Filling login form...');
    await page.fill('input[type="email"], input[placeholder*="email"], input[name="identifier"]', 'dummy@cresca.co');
    await page.fill('input[type="password"]', 'dummypassword');
    console.log('Submitting login form...');
    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")');

    // Wait for network response or redirect
    await page.waitForTimeout(3000);

  } catch (err) {
    console.error('Error during form submission:', err.message);
  } finally {
    await browser.close();
    console.log('Done.');
  }
}

run();
