
import { SCENARIOS } from './frontend/lib/scenarios';

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

console.log('Checking SCENARIOS...');
checkSerializable(SCENARIOS, 'SCENARIOS');
