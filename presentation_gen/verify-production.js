const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const STAGING_URL = 'https://www.septivolt.com';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots_prod');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('=== STARTING PRODUCTION DEPLOYMENT VERIFICATION ===');
  console.log(`Target URL: ${STAGING_URL}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  // Helper to set admin session in localStorage
  async function setupAdminSession(demoActive = false, lang = 'en') {
    await page.goto(STAGING_URL + '?x-vercel-protection-bypass=qQZ8QvU2KoKLQ3QBvm8s3oTTMBMLIwU5&x-vercel-set-bypass-cookie=true');
    await page.evaluate(({ demoActive, lang }) => {
      localStorage.setItem('septivolt_user', JSON.stringify({
        username: 'admin',
        role: 'admin',
        planTier: 'enterprise',
        companyId: 'company_1'
      }));
      localStorage.setItem('septivolt_language', lang);
      if (demoActive) {
        localStorage.setItem('septivolt_demo_mode', 'true');
      } else {
        localStorage.removeItem('septivolt_demo_mode');
      }
    }, { demoActive, lang });
    await page.reload();
  }

  // Helper to check if elements are present
  async function checkElement(selector, name) {
    const isVisible = await page.isVisible(selector);
    console.log(`  - Checking ${name} (${selector}): ${isVisible ? 'FOUND' : 'NOT FOUND'}`);
    return isVisible;
  }

  try {
    // ----------------------------------------------------
    // PHASE 1: Verify Demo Mode OFF
    // ----------------------------------------------------
    console.log('\n--- PHASE 1: VERIFYING DEMO MODE OFF ---');
    await setupAdminSession(false, 'en');
    await page.goto(`${STAGING_URL}/dashboard`);
    
    // Check that we are on the dashboard and not redirected to login
    await page.waitForURL(`${STAGING_URL}/dashboard`);
    console.log('Logged in successfully, loaded /dashboard');
    
    // Confirm banner does NOT leak
    const bannerVisibleOff = await page.isVisible('div:has-text("Safe Demo Mode Active")');
    console.log(`Global Demo Mode Banner visible: ${bannerVisibleOff}`);
    if (bannerVisibleOff) {
      throw new Error('Leak detected! Demo Mode banner is visible when demo mode is OFF.');
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_dashboard_demo_off.png') });
    console.log('Captured: 01_dashboard_demo_off.png');

    const pathsToVerify = [
      '/dashboard',
      '/my-training',
      '/ai-simulator',
      '/analytics',
      '/analytics/debriefs',
      '/leaderboards',
      '/certifications',
      '/settings',
      '/team-hub',
      '/admin',
      '/dashboard/settings'
    ];

    for (const urlPath of pathsToVerify) {
      console.log(`Navigating to: ${urlPath}`);
      await page.goto(`${STAGING_URL}${urlPath}`);
      await page.waitForTimeout(1000); // Wait for animations/render
      
      // Verification logic per page to ensure no demo data is leaked
      if (urlPath === '/team-hub') {
        const hasDemoReps = await page.evaluate(() => {
          return document.body.innerText.includes('Marcus Vance') || document.body.innerText.includes('Chloe Bennett');
        });
        console.log(`  - Contains Demo-only reps (Marcus/Chloe): ${hasDemoReps}`);
        if (hasDemoReps) throw new Error('Data Leak! Demo-only representatives visible on /team-hub when demo mode is OFF.');
      } else if (urlPath === '/analytics/debriefs') {
        const hasDemoDebriefs = await page.evaluate(() => {
          return document.body.innerText.includes('High Energy Opener') || document.body.innerText.includes('NEM 3.0 Objections');
        });
        console.log(`  - Contains Demo debrief reports: ${hasDemoDebriefs}`);
        if (hasDemoDebriefs) throw new Error('Data Leak! Demo coaching reports visible on /analytics/debriefs when demo mode is OFF.');
      } else if (urlPath === '/leaderboards') {
        const hasDemoReps = await page.evaluate(() => {
          return document.body.innerText.includes('Sarah Connor') || document.body.innerText.includes('Ana Gutierrez');
        });
        console.log(`  - Contains Demo leaderboard rankings: ${hasDemoReps}`);
        if (hasDemoReps) throw new Error('Data Leak! Demo leaderboard rankings visible when demo mode is OFF.');
      } else if (urlPath === '/certifications') {
        const hasDemoCert = await page.evaluate(() => {
          return document.body.innerText.includes('Elite Closer') || document.body.innerText.includes('Technical Guru');
        });
        console.log(`  - Contains Demo certifications: ${hasDemoCert}`);
        if (hasDemoCert) throw new Error('Data Leak! Demo certifications visible when demo mode is OFF.');
      }
    }

    // ----------------------------------------------------
    // PHASE 2: Enable Safe Demo Mode
    // ----------------------------------------------------
    console.log('\n--- PHASE 2: ENABLING SAFE DEMO MODE ---');
    await page.goto(`${STAGING_URL}/admin`);
    await page.waitForTimeout(1000);
    
    // Toggle via localStorage directly or through UI. Let's do UI toggle first
    console.log('Toggling Demo Mode via Admin UI settings...');
    const toggleButton = page.locator('p:text-is("Safe Demo Mode")').locator('xpath=../..').locator('button');
    await toggleButton.click();
    await page.waitForTimeout(2000); // Wait for page reload

    // Confirm Demo Mode is active
    const isActive = await page.evaluate(() => localStorage.getItem('septivolt_demo_mode') === 'true');
    console.log(`localStorage septivolt_demo_mode is true: ${isActive}`);
    if (!isActive) {
      throw new Error('Failed to enable Demo Mode via UI toggle.');
    }

    // ----------------------------------------------------
    // PHASE 3: Verify Demo Mode ON
    // ----------------------------------------------------
    console.log('\n--- PHASE 3: VERIFYING DEMO MODE ON ---');
    
    // Verify global banner is visible
    const bannerText = await page.locator('div:has-text("Safe Demo Mode Active")').first().innerText();
    console.log(`Global Banner text: "${bannerText.replace(/\n/g, ' ')}"`);
    if (!bannerText.includes('Safe Demo Mode Active')) {
      throw new Error('Global Demo Mode Banner not found or incorrect text.');
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_admin_demo_on.png') });
    console.log('Captured: 02_admin_demo_on.png');

    // 3a. Verify /team-hub shows 8 demo reps
    console.log('Checking /team-hub...');
    await page.goto(`${STAGING_URL}/team-hub`);
    await page.waitForTimeout(1000);
    const repCount = await page.evaluate(() => {
      // Look for Sarah Connor, John Doe, Maria Rodriguez etc.
      const reps = ['Sarah Connor', 'John Doe', 'Maria Rodriguez', 'Derek Burns', 'Ana Gutierrez', 'Marcus Vance', 'Chloe Bennett', 'Hector Espinoza'];
      return reps.filter(name => document.body.innerText.includes(name)).length;
    });
    console.log(`  - Number of demo reps found on /team-hub: ${repCount}`);
    if (repCount !== 8) {
      throw new Error(`Expected 8 demo reps, but found ${repCount}`);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_team_hub_demo_on.png') });
    console.log('Captured: 03_team_hub_demo_on.png');

    // 3b. Verify /analytics shows populated demo KPIs
    console.log('Checking /analytics...');
    await page.goto(`${STAGING_URL}/analytics`);
    await page.waitForTimeout(1500);
    const analyticsText = await page.evaluate(() => document.body.innerText);
    const hasKPICounts = analyticsText.includes('142') || analyticsText.includes('Lease vs Buy Friction') || analyticsText.includes('West Mavericks');
    console.log(`  - Analytics data loaded: ${hasKPICounts}`);
    if (!hasKPICounts) {
      throw new Error('Demo analytics metrics (142 completions or West Mavericks) not found on /analytics page.');
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_analytics_demo_on.png') });
    console.log('Captured: 04_analytics_demo_on.png');

    // 3c. Verify /analytics/debriefs shows 5 sample AI Coaching Reports
    console.log('Checking /analytics/debriefs...');
    await page.goto(`${STAGING_URL}/analytics/debriefs`);
    await page.waitForTimeout(1000);
    const debriefCount = await page.evaluate(() => {
      const reports = [
        'Lease vs Purchase Rebuttal',
        'Discovery Framework',
        'Manejo de Objeciones',
        'Graduation Simulator',
        'Urgency & Commitment Close'
      ];
      return reports.filter(name => document.body.innerText.includes(name)).length;
    });
    console.log(`  - Number of demo debrief records found: ${debriefCount}`);
    if (debriefCount !== 5) {
      throw new Error(`Expected 5 demo debrief records, but found ${debriefCount}`);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_debriefs_demo_on.png') });
    console.log('Captured: 05_debriefs_demo_on.png');

    // 3d. Verify /leaderboards shows populated rankings
    console.log('Checking /leaderboards...');
    await page.goto(`${STAGING_URL}/leaderboards`);
    await page.waitForTimeout(1000);
    const lbCount = await page.evaluate(() => {
      const leaders = ['Ana Gutierrez', 'Hector Espinoza', 'Sarah Connor', 'Maria Rodriguez', 'Marcus Vance'];
      return leaders.filter(name => document.body.innerText.includes(name)).length;
    });
    console.log(`  - Number of demo leaders found on leaderboard: ${lbCount}`);
    if (lbCount < 3) {
      throw new Error(`Expected at least 3 demo leaders on leaderboard, but found ${lbCount}`);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_leaderboards_demo_on.png') });
    console.log('Captured: 06_leaderboards_demo_on.png');

    // 3e. Verify /certifications shows progress
    console.log('Checking /certifications...');
    await page.goto(`${STAGING_URL}/certifications`);
    await page.waitForTimeout(1000);
    const certText = await page.evaluate(() => document.body.innerText);
    const hasCerts = certText.includes('SV-DM-2026-0511-014') || certText.includes('May 11, 2026');
    console.log(`  - Certifications loaded: ${hasCerts}`);
    if (!hasCerts) {
      throw new Error('Demo certifications (SV-DM-2026-0511-014) not found on /certifications page.');
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_certifications_demo_on.png') });
    console.log('Captured: 07_certifications_demo_on.png');

    // 3f. Verify bilingual banner/content switching
    console.log('Testing Spanish localization of global banner...');
    await page.evaluate(() => {
      localStorage.setItem('septivolt_language', 'es');
    });
    await page.reload();
    await page.waitForTimeout(1000);
    const spanishBannerText = await page.locator('div:has-text("Modo de Demostración Seguro Activo")').first().innerText();
    console.log(`Spanish Banner text: "${spanishBannerText.replace(/\n/g, ' ')}"`);
    if (!spanishBannerText.includes('Modo de Demostración Seguro Activo')) {
      throw new Error('Spanish Demo Mode Banner not found or incorrect localization.');
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_spanish_banner.png') });
    console.log('Captured: 08_spanish_banner.png');

    // Restore language to english
    await page.evaluate(() => {
      localStorage.setItem('septivolt_language', 'en');
    });
    await page.reload();
    await page.waitForTimeout(1000);

    // ----------------------------------------------------
    // PHASE 4: Disable Demo Mode & Revert
    // ----------------------------------------------------
    console.log('\n--- PHASE 4: DISABLING DEMO MODE ---');
    await page.goto(`${STAGING_URL}/admin`);
    await page.waitForTimeout(1000);
    
    // Toggle OFF via UI
    console.log('Toggling Demo Mode OFF via Admin UI...');
    const toggleButtonOff = page.locator('p:text-is("Safe Demo Mode")').locator('xpath=../..').locator('button');
    await toggleButtonOff.click();
    await page.waitForTimeout(2000); // Wait for page reload

    const isStillActive = await page.evaluate(() => localStorage.getItem('septivolt_demo_mode') === 'true');
    console.log(`localStorage septivolt_demo_mode is still true: ${isStillActive}`);
    if (isStillActive) {
      throw new Error('Failed to disable Demo Mode via UI toggle.');
    }

    // Verify banner is gone on dashboard
    await page.goto(`${STAGING_URL}/dashboard`);
    await page.waitForTimeout(1000);
    const bannerVisibleEnd = await page.isVisible('div:has-text("Safe Demo Mode Active")');
    console.log(`Global Demo Mode Banner visible: ${bannerVisibleEnd}`);
    if (bannerVisibleEnd) {
      throw new Error('Banner is still visible after disabling Demo Mode.');
    }

    // Verify team-hub is clean
    await page.goto(`${STAGING_URL}/team-hub`);
    await page.waitForTimeout(1000);
    const repCountEnd = await page.evaluate(() => {
      const reps = ['Marcus Vance', 'Chloe Bennett'];
      return reps.filter(name => document.body.innerText.includes(name)).length;
    });
    console.log(`Demo-only reps present after disable: ${repCountEnd}`);
    if (repCountEnd > 0) {
      throw new Error('Demo-only reps are still present on /team-hub after disabling demo mode.');
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_dashboard_reverted.png') });
    console.log('Captured: 09_dashboard_reverted.png');

    console.log('\n=== ALL STAGING DEPLOYMENT VERIFICATIONS PASSED SUCCESSFULLY ===');
  } catch (err) {
    console.error('\n❌ VERIFICATION FAILURE:');
    console.error(err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
