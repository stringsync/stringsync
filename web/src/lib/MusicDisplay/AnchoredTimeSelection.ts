import { NumberRange } from '../../util/NumberRange';

export class AnchoredTimeSelection {
  static init(initialTimeMs: number) {
    return new AnchoredTimeSelection(initialTimeMs, initialTimeMs);
  }

  readonly id = Symbol();

  readonly anchorTimeMs: number;
  readonly seekerTimeMs: number;

  constructor(anchorTimeMs: number, seekerTimeMs: number) {
    this.anchorTimeMs = anchorTimeMs;
    this.seekerTimeMs = seekerTimeMs;
  }

  update(timeMs: number) {
    return new AnchoredTimeSelection(this.anchorTimeMs, timeMs);
  }

  clone() {
    return new AnchoredTimeSelection(this.anchorTimeMs, this.seekerTimeMs);
  }

  anchorStart() {
    const range = this.toRange();
    return new AnchoredTimeSelection(range.start, range.end);
  }

  anchorEnd() {
    const range = this.toRange();
    return new AnchoredTimeSelection(range.end, range.start);
  }

  toRange() {
    return NumberRange.unsorted(this.anchorTimeMs, this.seekerTimeMs);
  }
}
