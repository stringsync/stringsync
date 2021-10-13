import { NumberRange } from './NumberRange';

export class AnchoredSelection {
  static init(initialValue: number) {
    return new AnchoredSelection(initialValue, initialValue);
  }

  readonly id = Symbol();

  readonly anchorValue: number;
  readonly movingValue: number;

  constructor(anchorValue: number, movingValue: number) {
    this.anchorValue = anchorValue;
    this.movingValue = movingValue;
  }

  update(movingValue: number) {
    return new AnchoredSelection(this.anchorValue, movingValue);
  }

  toRange() {
    return NumberRange.unsorted(this.anchorValue, this.movingValue);
  }
}
