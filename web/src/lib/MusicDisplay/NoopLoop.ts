import { NumberRange } from '../../util/NumberRange';
import { Loop } from './types';

export class NoopLoop implements Loop {
  activate() {}
  deactivate() {}
  update(timeMsRange: NumberRange) {}
}
