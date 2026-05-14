
import { getTrainingModuleView } from './frontend/lib/training-module-view';

try {
  const view = getTrainingModuleView('mod_6_5', 'en');
  console.log(JSON.stringify(view.instructionalSegments, null, 2));
} catch (e) {
  console.error(e);
}
