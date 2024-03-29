import { Duration } from '../../../util/Duration';
import { DurationRange } from '../../../util/DurationRange';
import { NumberRange } from '../../../util/NumberRange';
import { NoopCursor } from '../cursors/NoopCursor';
import { Loop } from './types';

export class NoopLoop implements Loop {
  isActive = false;
  timeMsRange = NumberRange.from(0).to(0);
  timeRange = DurationRange.from(Duration.zero()).to(Duration.zero());
  startCursor = new NoopCursor();
  endCursor = new NoopCursor();
  update() {}
  resetStyles() {}
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}
