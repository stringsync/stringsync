import { NumberRange } from '../../util/NumberRange';
import { NoopCursor } from './NoopCursor';
import { Loop } from './types';

export class NoopLoop implements Loop {
  isActive = false;
  timeMsRange = NumberRange.from(0).to(0);
  startCursor = new NoopCursor();
  endCursor = new NoopCursor();

  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
  update(timeMsRange: NumberRange) {}
}
