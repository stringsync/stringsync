import { NumberRange } from './NumberRange';

export class AnchoredSelection {
  static init(initialTimeMs: number) {
    return new AnchoredSelection(initialTimeMs, initialTimeMs);
  }

  readonly id = Symbol();

  readonly anchorTimeMs: number;
  readonly seekerTimeMs: number;

  constructor(anchorTimeMs: number, seekerTimeMs: number) {
    this.anchorTimeMs = anchorTimeMs;
    this.seekerTimeMs = seekerTimeMs;
  }

  update(timeMs: number) {
    return new AnchoredSelection(this.anchorTimeMs, timeMs);
  }

  toRange() {
    return NumberRange.unsorted(this.anchorTimeMs, this.seekerTimeMs);
  }
}
