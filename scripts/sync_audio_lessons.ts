import fs from 'fs';
import path from 'path';
import { DAY_MODULES } from '@/lib/modules';
import { getTrainingModuleView } from '@/lib/training-module-view';
import { buildModuleAudioLesson } from '@/lib/training-audio';

const SCRATCH_DIR = path.join(process.cwd(), 'scratch');
const OUTPUT_FILE = path.join(SCRATCH_DIR, 'all_audio_lessons.json');
const BACKUP_FILE = path.join(SCRATCH_DIR, 'all_audio_lessons.json.bak');

function main() {
  console.log('--- Synchronizing Audio Lessons ---');
  
  // 1. Backup existing all_audio_lessons.json if it exists
  if (fs.existsSync(OUTPUT_FILE)) {
    console.log(`Backing up existing file to ${BACKUP_FILE}`);
    fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE);
  }

  const englishLessons: any[] = [];
  const spanishLessons: any[] = [];

  // Get all submodules
  const allSubModules = DAY_MODULES.flatMap(day => day.modules);
  console.log(`Found ${allSubModules.length} submodules in DAY_MODULES.`);

  for (const subMod of allSubModules) {
    const moduleId = subMod.id;

    // English
    const viewEn = getTrainingModuleView(moduleId, 'en');
    if (viewEn) {
      const lessonEn = buildModuleAudioLesson(viewEn, 'en');
      englishLessons.push({
        moduleId: lessonEn.moduleId,
        title: viewEn.title,
        dayLabel: viewEn.dayLabel,
        sections: lessonEn.sections.map(s => ({
          id: s.id,
          title: s.title,
          text: s.narrationText
        }))
      });
    } else {
      console.warn(`WARNING: Missing English module content for ${moduleId}`);
    }

    // Spanish
    const viewEs = getTrainingModuleView(moduleId, 'es');
    if (viewEs) {
      const lessonEs = buildModuleAudioLesson(viewEs, 'es');
      spanishLessons.push({
        moduleId: lessonEs.moduleId,
        title: viewEs.title,
        dayLabel: viewEs.dayLabel,
        sections: lessonEs.sections.map(s => ({
          id: s.id,
          title: s.title,
          text: s.narrationText
        }))
      });
    } else {
      console.warn(`WARNING: Missing Spanish module content for ${moduleId}`);
    }
  }

  const outputData = {
    english: englishLessons,
    spanish: spanishLessons
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`Successfully generated ${englishLessons.length} English lessons and ${spanishLessons.length} Spanish lessons.`);
  console.log(`Saved output to ${OUTPUT_FILE}`);
}

main();
