import { Duration } from './Duration';
import { Range } from './NumberRange';

class LeftBoundedDurationRange implements Range<Duration> {
  start: Duration;
  end = Duration.ms(Number.POSITIVE_INFINITY);
  size = Duration.ms(Number.POSITIVE_INFINITY);
  midpoint = Duration.ms(Number.POSITIVE_INFINITY);

  constructor(start: Duration) {
    this.start = start;
  }

  to(end: Duration) {
    return new DurationRange(this.start, end);
  }

  contains(value: Duration) {
    return this.start.ms <= value.ms && value <= this.end;
  }

  eq(range: DurationRange) {
    return this.start.ms === range.start.ms && this.end.ms === range.end.ms;
  }
}

export class DurationRange implements Range<Duration> {
  static unsorted(d1: Duration, d2: Duration) {
    return d1.ms < d2.ms ? DurationRange.from(d1).to(d2) : DurationRange.from(d2).to(d1);
  }

  static from(start: Duration) {
    return new LeftBoundedDurationRange(start);
  }

  start: Duration;
  end: Duration;

  constructor(start: Duration, end: Duration) {
    if (start.ms > end.ms) {
      throw new RangeError('start must be <= end');
    }

    this.start = start;
    this.end = end;
  }

  get size() {
    return Duration.ms(this.end.ms - this.start.ms);
  }

  get midpoint() {
    return Duration.ms(this.start.ms + this.size.ms / 2);
  }

  contains(value: Duration) {
    return this.start.ms <= value.ms && value.ms <= this.end.ms;
  }

  eq(range: DurationRange) {
    return this.start.ms === range.start.ms && this.end.ms === range.end.ms;
  }
}
