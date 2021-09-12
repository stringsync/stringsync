import { AnchoredSelection } from '../../../util/AnchoredSelection';
import { NoopCursor } from '../NoopCursor';
import { Loop } from './types';

export class NoopLoop implements Loop {
  isActive = false;
  selection = AnchoredSelection.init(0);
  startCursor = new NoopCursor();
  endCursor = new NoopCursor();
  get timeMsRange() {
    return this.selection.toRange();
  }
  anchor() {}
  update() {}
  resetStyles() {}
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}
