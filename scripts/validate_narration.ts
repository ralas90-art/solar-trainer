import fs from 'fs';
import path from 'path';
import { MODULES, DAY_MODULES } from '@/lib/modules';
import { MODULES_ES } from '@/lib/modules.es';

const SCRATCH_DIR = path.join(process.cwd(), 'scratch');
const INPUT_FILE = path.join(SCRATCH_DIR, 'all_audio_lessons.json');

const COMPLIANCE_PATTERNS = [
  { regex: /2032/, description: "Reference to year 2032" },
  { regex: /locked in through 2032/i, description: "locked in through 2032" },
  { regex: /guaranteed through 2032/i, description: "guaranteed through 2032" },
  { regex: /scheduled through 2032/i, description: "scheduled through 2032" },
  { regex: /guaranteed tax credit/i, description: "guaranteed tax credit" },
  { regex: /guaranteed refund/i, description: "guaranteed refund" },
  { regex: /guaranteed savings/i, description: "guaranteed savings" },
  { regex: /guaranteed utility-rate increases/i, description: "guaranteed utility-rate increases" },
  { regex: /ahorros que no puedas garantizar/i, description: "ahorros que no puedas garantizar" },
  { regex: /ahorro fiscal garantizado/i, description: "ahorro fiscal garantizado" },
  { regex: /ahorro garantizado/i, description: "ahorro garantizado" },
  { regex: /reembolso garantizado/i, description: "reembolso garantizado" },
  { regex: /ahorros garantizados/i, description: "ahorros garantizados" }
];

function main() {
  console.log('--- Validating Curriculum Narration & Compliance ---');

  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`ERROR: File not found at ${INPUT_FILE}. Run the sync script first.`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  const englishLessons = data.english || [];
  const spanishLessons = data.spanish || [];

  console.log(`Loaded ${englishLessons.length} English and ${spanishLessons.length} Spanish lessons from JSON.`);

  // 1. Audit explicit vs fallback counts from TS source
  let explicitCountEn = 0;
  let fallbackCountEn = 0;
  let explicitCountEs = 0;
  let fallbackCountEs = 0;

  const allSubModIds = DAY_MODULES.flatMap(day => day.modules.map(m => m.id));

  for (const id of allSubModIds) {
    const modEn = MODULES[id];
    if (modEn) {
      for (const sec of modEn.sections) {
        if (sec.type === 'simulation') continue;
        if (sec.narration) {
          explicitCountEn++;
        } else {
          fallbackCountEn++;
        }
      }
    }

    const modEs = MODULES_ES[id];
    if (modEs) {
      for (const sec of modEs.sections) {
        if (sec.type === 'simulation') continue;
        if (sec.narration) {
          explicitCountEs++;
        } else {
          fallbackCountEs++;
        }
      }
    }
  }

  console.log('\n[Section Narration Sources (TS Source Audit)]');
  console.log(`English Sections:`);
  console.log(`  - Explicit Narration: ${explicitCountEn}`);
  console.log(`  - Fallback from Content: ${fallbackCountEn}`);
  console.log(`Spanish Sections:`);
  console.log(`  - Explicit Narration: ${explicitCountEs}`);
  console.log(`  - Fallback from Content: ${fallbackCountEs}`);

  // 2. Scan for compliance violations in generated JSON
  let complianceViolations = 0;
  console.log('\n[Compliance Scanning (JSON Audit)]');

  const COMPLIANT_EN_BLOCK = "Under current federal guidance, the Residential Clean Energy Credit applied to qualifying residential solar property installed through December 31, 2025. Never promise a refund, check, or guaranteed tax savings. Eligibility depends on the law in effect, installation timing, ownership structure, and the homeowner’s individual tax situation. Always recommend that the homeowner confirm eligibility with a qualified tax professional.";

  const COMPLIANT_ES_BLOCK = "Según la guía federal actual, el crédito residencial de energía limpia aplicaba a propiedades solares residenciales calificadas instaladas hasta el 31 de diciembre de 2025. Nunca prometas un reembolso, cheque o ahorro fiscal garantizado. La elegibilidad depende de la ley vigente, la fecha de instalación, la estructura de propiedad y la situación fiscal individual del propietario. Siempre recomienda que el propietario confirme su elegibilidad con un contador o profesional de impuestos calificado.";

  const scanSections = (lessons: any[], lang: string) => {
    for (const lesson of lessons) {
      for (const sec of lesson.sections) {
        // Strip the compliant blocks so they don't trigger false positives
        let cleanedText = sec.text;
        // Normalize spaces/punctuation in clean text for matching
        const norm = (t: string) => t.replace(/[\u2019]/g, "'").replace(/\s+/g, " ").trim();
        cleanedText = norm(cleanedText);
        const normEnBlock = norm(COMPLIANT_EN_BLOCK);
        const normEsBlock = norm(COMPLIANT_ES_BLOCK);

        cleanedText = cleanedText.replace(normEnBlock, "[COMPLIANT_EN_BLOCK]");
        cleanedText = cleanedText.replace(normEsBlock, "[COMPLIANT_ES_BLOCK]");

        for (const pattern of COMPLIANCE_PATTERNS) {
          let match;
          const regexG = new RegExp(pattern.regex, 'gi');
          while ((match = regexG.exec(cleanedText)) !== null) {
            const matchIndex = match.index;
            const preceding = cleanedText.substring(Math.max(0, matchIndex - 80), matchIndex);
            
            // Check if this match is preceded by a compliant warning prefix
            const isPrecededByWarning = /never\s+promise/i.test(preceding) || 
                                        /nunca\s+prometas/i.test(preceding) ||
                                        /nunca\s+prometa/i.test(preceding) ||
                                        /nunca\s+garantice/i.test(preceding) ||
                                        /never\s+guarantee/i.test(preceding);
            
            if (!isPrecededByWarning) {
              console.error(`❌ VIOLATION [${lang.toUpperCase()}] in Module ${lesson.moduleId} section "${sec.title}":`);
              console.error(`   Found: "${pattern.description}"`);
              console.error(`   Snippet: "...${cleanedText.substring(Math.max(0, matchIndex - 40), Math.min(cleanedText.length, matchIndex + 40))}..."`);
              complianceViolations++;
            }
          }
        }
      }
    }
  };

  scanSections(englishLessons, 'en');
  scanSections(spanishLessons, 'es');

  if (complianceViolations === 0) {
    console.log('✅ Compliance Scan: PASSED (No blocked or risky compliance phrases found).');
  } else {
    console.error(`❌ Compliance Scan: FAILED with ${complianceViolations} violations.`);
  }

  // 3. Check for any remaining modules in DAY_MODULES missing from MODULES_ES
  const missingSpanishModules: string[] = [];
  for (const id of allSubModIds) {
    if (!MODULES_ES[id]) {
      missingSpanishModules.push(id);
    }
  }
  console.log('\n[Localization Coverage]');
  if (missingSpanishModules.length === 0) {
    console.log('✅ Spanish localization: 100% complete.');
  } else {
    console.warn(`⚠️ Warning: ${missingSpanishModules.length} modules are missing in MODULES_ES:`, missingSpanishModules);
  }

  // 4. Character counts & ElevenLabs usage estimation
  let charCountEn = 0;
  let charCountEs = 0;

  for (const lesson of englishLessons) {
    for (const sec of lesson.sections) {
      charCountEn += sec.text.length;
    }
  }

  for (const lesson of spanishLessons) {
    for (const sec of lesson.sections) {
      charCountEs += sec.text.length;
    }
  }

  const totalChars = charCountEn + charCountEs;
  const estimatedCostUsd = (totalChars / 1000) * 0.15; // ElevenLabs typical API pricing baseline reference ($0.15 per 1k characters)

  console.log('\n[Character and Usage Estimates]');
  console.log(`- English character count: ${charCountEn.toLocaleString()}`);
  console.log(`- Spanish character count: ${charCountEs.toLocaleString()}`);
  console.log(`- Total characters: ${totalChars.toLocaleString()}`);
  console.log(`- Estimated ElevenLabs cost (reference rate $0.15/1k): ~$${estimatedCostUsd.toFixed(2)} USD`);

  // Final validation status
  console.log('\n[Readiness for Phase 1C]');
  const isReady = complianceViolations === 0 && missingSpanishModules.length === 0;
  if (isReady) {
    console.log('🚀 READY: Narration script validation passed. Curriculum is ready for audio generation (Phase 1C).');
  } else {
    console.log('⚠️ NOT READY: Please resolve validation errors/warnings before moving to Phase 1C.');
  }

  if (complianceViolations > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
