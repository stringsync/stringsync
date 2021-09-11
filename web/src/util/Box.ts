import { NumberRange } from './NumberRange';

class PartialBox {
  readonly x0: number;
  readonly y0: number;

  constructor(x0: number, y0: number) {
    this.x0 = x0;
    this.y0 = y0;
  }

  to(x: number, y: number) {
    const xRange = NumberRange.from(this.x0).to(x);
    const yRange = NumberRange.from(this.y0).to(y);
    return new Box(xRange, yRange);
  }
}

export class Box {
  static from(x: number, y: number) {
    return new PartialBox(x, y);
  }

  readonly xRange: NumberRange;
  readonly yRange: NumberRange;

  constructor(xRange: NumberRange, yRange: NumberRange) {
    this.xRange = xRange;
    this.yRange = yRange;
  }

  width() {
    return this.xRange.size;
  }

  height() {
    return this.yRange.size;
  }

  contains(x: number, y: number) {
    return this.xRange.contains(x) && this.yRange.contains(y);
  }
}
