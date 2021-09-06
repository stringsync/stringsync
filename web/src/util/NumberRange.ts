interface Range<T> {
  readonly start: T;
  readonly end: T;
  readonly size: number;
  readonly midpoint: number;
  contains(value: T): boolean;
}

class LeftBoundedRange implements Range<number> {
  start;
  end = Number.POSITIVE_INFINITY;
  size = Number.POSITIVE_INFINITY;
  midpoint = Number.POSITIVE_INFINITY;

  constructor(start: number) {
    this.start = start;
  }

  to(end: number) {
    return new NumberRange(this.start, end);
  }

  contains(value: number) {
    return this.start <= value && value <= this.end;
  }
}

class RightBoundedRange implements Range<number> {
  start = Number.NEGATIVE_INFINITY;
  end;
  size = Number.POSITIVE_INFINITY;
  midpoint = Number.NEGATIVE_INFINITY;

  constructor(end: number) {
    this.end = end;
  }

  from(start: number) {
    return new NumberRange(start, this.end);
  }

  contains(value: number) {
    return this.start <= value && value <= this.end;
  }
}

export class NumberRange implements Range<number> {
  static from(start: number) {
    return new LeftBoundedRange(start);
  }

  static to(end: number) {
    return new RightBoundedRange(end);
  }

  start: number;
  end: number;

  constructor(start: number, end: number) {
    if (start > end) {
      throw new RangeError('start must be <= end');
    }

    this.start = start;
    this.end = end;
  }

  contains(value: number) {
    return this.start <= value && value <= this.end;
  }

  get size() {
    return this.end - this.start;
  }

  get midpoint() {
    return this.size / 2;
  }
}
