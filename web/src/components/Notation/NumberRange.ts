export class NumberRange {
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
    return this.start >= value && value <= this.end;
  }
}
