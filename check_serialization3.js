
import { buildModuleAudioLesson } from './frontend/lib/training-module-view';

function checkSerializable(obj, path = '') {
  if (obj === null || typeof obj === 'undefined') return;
  if (typeof obj === 'function') {
    console.log(`FOUND FUNCTION at ${path}`);
    return;
  }
  if (typeof obj !== 'object') return;
  
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => checkSerializable(item, `${path}[${i}]`));
  } else {
    Object.entries(obj).forEach(([key, value]) => {
      checkSerializable(value, `${path}.${key}`);
    });
  }
}

console.log('Checking buildModuleAudioLesson("mod_1_1")...');
const lesson = buildModuleAudioLesson("mod_1_1");
checkSerializable(lesson, 'lesson');

