import { NumberRange } from '../../util/NumberRange';
import { Loop } from './types';

export class NoopLoop implements Loop {
  isActive = false;
  timeMsRange = NumberRange.from(0).to(0);

  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
  update(timeMsRange: NumberRange) {}
}
