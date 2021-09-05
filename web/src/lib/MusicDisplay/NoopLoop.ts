import { NumberRange } from '../../util/NumberRange';
import { Loop } from './types';

export class NoopLoop implements Loop {
  isActive = false;

  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
  update(timeMsRange: NumberRange) {}
}
