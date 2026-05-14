
import { getTrainingModuleView } from './frontend/lib/training-module-view';

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

try {
  console.log('Checking mod_6_5...');
  const view = getTrainingModuleView('mod_6_5', 'en');
  checkSerializable(view, 'view');
  console.log('Done checking mod_6_5.');
} catch (e) {
  console.error(e);
}
