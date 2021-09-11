import { AnchoredTimeSelection } from '../AnchoredTimeSelection';
import { NoopCursor } from '../NoopCursor';
import { Loop } from './types';

export class NoopLoop implements Loop {
  isActive = false;
  selection = AnchoredTimeSelection.init(0);
  startCursor = new NoopCursor();
  endCursor = new NoopCursor();

  get timeMsRange() {
    return this.selection.toRange();
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  anchor(timeMs: number) {}

  update(timeMs: number) {}
}
