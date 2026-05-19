const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = process.argv[2] || 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots_issues');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('=== STARTING ISSUE REPORTER VERIFICATION ===');
  console.log(`Target URL: ${TARGET_URL}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();
  
  // Helper to set admin session in localStorage
  async function setupAdminSession(lang = 'en') {
    // Add Vercel protection bypass query params
    await page.goto(TARGET_URL + '?x-vercel-protection-bypass=qQZ8QvU2KoKLQ3QBvm8s3oTTMBMLIwU5&x-vercel-set-bypass-cookie=true');
    await page.evaluate((lang) => {
      localStorage.setItem('septivolt_user', JSON.stringify({
        username: 'admin',
        role: 'admin',
        planTier: 'enterprise',
        companyId: 'company_1'
      }));
      localStorage.setItem('septivolt_language', lang);
    }, lang);
    await page.reload();
  }

  try {
    // ----------------------------------------------------
    // PHASE 1: Verify Button Presence & Modal Open/Cancel
    // ----------------------------------------------------
    console.log('\n--- PHASE 1: VERIFYING BUTTON PRESENCE ---');
    await setupAdminSession('en');
    await page.goto(`${TARGET_URL}/dashboard`);
    await page.waitForURL(`${TARGET_URL}/dashboard`);
    
    // Check if the Report an Issue button is visible
    const buttonSelector = 'button:has-text("Report an Issue")';
    const isButtonVisible = await page.isVisible(buttonSelector);
    console.log(`Floating "Report an Issue" button visible: ${isButtonVisible}`);
    if (!isButtonVisible) {
      throw new Error('Global "Report an Issue" floating button not found on /dashboard');
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_dashboard_with_button.png') });
    console.log('Captured: 01_dashboard_with_button.png');

    console.log('Opening modal...');
    await page.click(buttonSelector);
    await page.waitForTimeout(500); // Wait for animation
    
    const isModalVisible = await page.isVisible('h3:has-text("Report an Issue")');
    console.log(`Modal header "Report an Issue" visible: ${isModalVisible}`);
    if (!isModalVisible) {
      throw new Error('Modal failed to open after clicking trigger button.');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_modal_open_english.png') });
    console.log('Captured: 02_modal_open_english.png');

    console.log('Testing modal Cancel button...');
    await page.click('button:text-is("Cancel")');
    await page.waitForSelector('h3:has-text("Report an Issue")', { state: 'detached', timeout: 5000 });
    
    const isModalVisibleAfterCancel = await page.isVisible('h3:has-text("Report an Issue")');
    console.log(`Modal header visible after cancel: ${isModalVisibleAfterCancel}`);
    if (isModalVisibleAfterCancel) {
      throw new Error('Modal remained visible after clicking Cancel.');
    }

    // ----------------------------------------------------
    // PHASE 2: Verify Spanish Translation
    // ----------------------------------------------------
    console.log('\n--- PHASE 2: VERIFYING BILINGUAL SUPPORT (ESPANOL) ---');
    await setupAdminSession('es');
    await page.goto(`${TARGET_URL}/dashboard`);
    await page.waitForTimeout(1000);
    
    const spanishButtonSelector = 'button:has-text("Reportar un Problema")';
    const isSpanishButtonVisible = await page.isVisible(spanishButtonSelector);
    console.log(`Floating button localized in Spanish visible: ${isSpanishButtonVisible}`);
    if (!isSpanishButtonVisible) {
      throw new Error('Spanish button "Reportar un Problema" not found.');
    }

    console.log('Opening Spanish modal...');
    await page.click(spanishButtonSelector);
    await page.waitForTimeout(500);

    const isSpanishModalVisible = await page.isVisible('h3:has-text("Reportar un Problema")');
    console.log(`Spanish modal header "Reportar un Problema" visible: ${isSpanishModalVisible}`);
    if (!isSpanishModalVisible) {
      throw new Error('Spanish modal failed to display.');
    }
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_modal_open_spanish.png') });
    console.log('Captured: 03_modal_open_spanish.png');

    // Close spanish modal
    await page.click('button:text-is("Cancelar")');
    await page.waitForSelector('h3:has-text("Reportar un Problema")', { state: 'detached', timeout: 5000 });

    // ----------------------------------------------------
    // PHASE 3: Form Input Validation & Submission
    // ----------------------------------------------------
    console.log('\n--- PHASE 3: TESTING FORM SUBMISSION ---');
    // Restore English session for standard submission verification
    await setupAdminSession('en');
    await page.goto(`${TARGET_URL}/dashboard`);
    await page.waitForTimeout(1000);
    
    await page.click(buttonSelector);
    await page.waitForTimeout(500);

    // Fill form fields
    console.log('Selecting Issue Type: "Translation Issue"');
    await page.selectOption('select:has-text("Bug/Error")', { label: 'Translation Issue' });
    
    console.log('Selecting Severity: "High"');
    await page.selectOption('select:has-text("Medium")', { label: 'High' });
    
    console.log('Typing description...');
    const descriptionText = 'Smoke test bug report: Spanish translation in leaderboards has spelling typo.';
    await page.fill('textarea[placeholder*="Describe"]', descriptionText);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_modal_filled.png') });
    console.log('Captured: 04_modal_filled.png');

    console.log('Clicking Submit...');
    await page.click('button:text-is("Submit Report")');
    
    // Wait for success screen
    await page.waitForSelector('h4:has-text("Report Submitted!")');
    console.log('Success screen displayed: "Report Submitted!"');
    
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_modal_success.png') });
    console.log('Captured: 05_modal_success.png');

    // ----------------------------------------------------
    // PHASE 4: Local Storage Logging & Metadata Verification
    // ----------------------------------------------------
    console.log('\n--- PHASE 4: VERIFYING LOCAL STORAGE LOGS ---');
    const localLogs = await page.evaluate(() => {
      const logs = localStorage.getItem('septivolt_local_issue_log');
      return logs ? JSON.parse(logs) : null;
    });

    console.log(`Local storage logs retrieved: ${localLogs ? 'FOUND' : 'NOT FOUND'}`);
    if (!localLogs || localLogs.length === 0) {
      throw new Error('Submission not logged in localStorage (septivolt_local_issue_log).');
    }

    const lastLog = localLogs[0];
    console.log('Inspecting last logged report:');
    console.log(`  - Issue Type: ${lastLog.issueType}`);
    console.log(`  - Severity: ${lastLog.severity}`);
    console.log(`  - Description: "${lastLog.description}"`);
    console.log(`  - Current Route: ${lastLog.currentRoute}`);
    console.log(`  - Viewport Width: ${lastLog.viewportWidth}px`);
    console.log(`  - Viewport Height: ${lastLog.viewportHeight}px`);
    console.log(`  - Demo Mode: ${lastLog.demoModeState}`);
    console.log(`  - User Role: ${lastLog.userRole}`);
    console.log(`  - Username: ${lastLog.username}`);
    console.log(`  - Language Mode: ${lastLog.languageMode}`);

    if (lastLog.issueType !== 'Translation Issue') throw new Error('Incorrect issue type logged.');
    if (lastLog.severity !== 'High') throw new Error('Incorrect severity logged.');
    if (lastLog.description !== descriptionText) throw new Error('Incorrect description logged.');
    if (!lastLog.currentRoute.includes('/dashboard')) throw new Error('Incorrect URL captured.');
    if (lastLog.languageMode !== 'en') throw new Error('Incorrect language preference captured.');
    
    console.log('Dismissing success screen...');
    await page.click('button:text-is("Close")');
    await page.waitForSelector('h3:has-text("Report an Issue")', { state: 'detached', timeout: 5000 });

    const isModalVisibleEnd = await page.isVisible('h3:has-text("Report an Issue")');
    console.log(`Modal visible at end: ${isModalVisibleEnd}`);
    if (isModalVisibleEnd) {
      throw new Error('Modal still visible after closing success screen.');
    }

    console.log('\n=== ALL ISSUE REPORTER SMOKE TESTS PASSED SUCCESSFULLY ===');
  } catch (err) {
    console.error('\n❌ VERIFICATION FAILURE:');
    console.error(err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
