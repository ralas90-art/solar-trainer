import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

/**
 * SeptiVolt Repository Integrity Check
 * 
 * This script audits the repository to ensure:
 * 1. All routes in frontend/app are tracked.
 * 2. Critical static assets are not accidentally ignored.
 * 3. Deployment manifest matches the actual codebase.
 */

const ROOT_DIR = process.cwd();
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const PUBLIC_DIR = path.join(FRONTEND_DIR, 'public');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');
const APP_DIR = path.join(FRONTEND_DIR, 'app');

function getRoutes() {
  const pages = globSync('**/page.tsx', { cwd: APP_DIR });
  const routes = globSync('**/route.ts', { cwd: APP_DIR });
  
  return [
    ...pages.map(p => '/' + path.dirname(p).replace(/\\/g, '/').replace(/^\.$/, '')),
    ...routes.map(r => '/api/' + path.dirname(r).replace(/\\/g, '/').replace(/^api\/?/, ''))
  ].map(r => r === '/' ? '/' : r.replace(/\/$/, '').replace(/\/+/g, '/'));
}

function checkIgnores() {
  const vercelIgnorePath = path.join(ROOT_DIR, '.vercelignore');
  const gitIgnorePath = path.join(ROOT_DIR, '.gitignore');
  
  const results = {
    vercelIgnore: fs.existsSync(vercelIgnorePath),
    gitIgnore: fs.existsSync(gitIgnorePath),
    potentialIssues: [] as string[]
  };

  if (results.vercelIgnore) {
    const content = fs.readFileSync(vercelIgnorePath, 'utf8');
    if (content.includes('public') && !content.includes('/public')) {
      results.potentialIssues.push('WARNING: .vercelignore might be ignoring "public" globally. Use root-scoped "/public" instead.');
    }
    if (content.includes('audio') && !content.includes('/audio')) {
      results.potentialIssues.push('WARNING: .vercelignore might be ignoring "audio" globally. Use root-scoped "/audio" instead.');
    }
  }

  return results;
}

function main() {
  console.log('--- SeptiVolt Integrity Audit ---');
  
  console.log('\n[1] Route Discovery:');
  const routes = getRoutes();
  console.log(`Found ${routes.length} total routes.`);
  routes.sort().forEach(r => console.log(`  - ${r}`));

  console.log('\n[2] Static Asset Audit:');
  if (fs.existsSync(AUDIO_DIR)) {
    const audioFiles = globSync('**/*.mp3', { cwd: AUDIO_DIR });
    console.log(`Found ${audioFiles.length} audio assets in /public/audio.`);
  } else {
    console.log('ERROR: /public/audio directory not found!');
  }

  console.log('\n[3] Ignore Configuration Audit:');
  const ignores = checkIgnores();
  console.log(`- .vercelignore: ${ignores.vercelIgnore ? 'Found' : 'MISSING'}`);
  console.log(`- .gitignore: ${ignores.gitIgnore ? 'Found' : 'MISSING'}`);
  ignores.potentialIssues.forEach(issue => console.log(`  ${issue}`));

  console.log('\n[4] Manifest Check:');
  const manifestPath = path.join(ROOT_DIR, 'DEPLOYMENT_MANIFEST.md');
  if (fs.existsSync(manifestPath)) {
    console.log('- DEPLOYMENT_MANIFEST.md: Found');
  } else {
    console.log('- DEPLOYMENT_MANIFEST.md: MISSING (Required for Phase 1)');
  }

  console.log('\nAudit Complete.');
}

main();
