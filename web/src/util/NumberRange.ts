interface Range<T> {
  start: T;
  end: T;
  contains(value: T): boolean;
}

class LeftBoundedRange implements Range<number> {
  public readonly start;

  constructor(start: number) {
    this.start = start;
  }

  to(end: number) {
    return new NumberRange(this.start, end);
  }

  get end() {
    return Number.POSITIVE_INFINITY;
  }

  contains(value: number) {
    return this.start <= value && value <= this.end;
  }
}

class RightBoundedRange implements Range<number> {
  public readonly end;

  constructor(end: number) {
    this.end = end;
  }

  from(start: number) {
    return new NumberRange(start, this.end);
  }

  get start() {
    return Number.NEGATIVE_INFINITY;
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

  public readonly start: number;
  public readonly end: number;

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
}
