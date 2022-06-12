import { NumberRange } from './NumberRange';

export class AnchoredRange {
  static init(value: number) {
    return new AnchoredRange(value, value);
  }

  readonly anchor: number;
  readonly mover: number;

  constructor(anchor: number, mover: number) {
    this.anchor = anchor;
    this.mover = mover;
  }

  move(moving: number) {
    return new AnchoredRange(this.anchor, moving);
  }

  toNumberRange() {
    return NumberRange.unsorted(this.anchor, this.mover);
  }
}
