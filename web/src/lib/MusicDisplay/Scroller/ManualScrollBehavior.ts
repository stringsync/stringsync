import { IntentScrollRequest } from '.';
import { ScrollBehavior } from './types';

export class ManualScrollBehavior implements ScrollBehavior {
  start() {}

  stop() {}

  call(request: IntentScrollRequest) {}
}
