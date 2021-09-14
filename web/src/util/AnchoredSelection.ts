import { NumberRange } from './NumberRange';

export class AnchoredSelection {
  static init(initialTimeMs: number) {
    return new AnchoredSelection(initialTimeMs, initialTimeMs);
  }

  readonly id = Symbol();

  readonly anchorValue: number;
  readonly movingValue: number;

  constructor(anchorTimeMs: number, seekerTimeMs: number) {
    this.anchorValue = anchorTimeMs;
    this.movingValue = seekerTimeMs;
  }

  update(timeMs: number) {
    return new AnchoredSelection(this.anchorValue, timeMs);
  }

  toRange() {
    return NumberRange.unsorted(this.anchorValue, this.movingValue);
  }
}
