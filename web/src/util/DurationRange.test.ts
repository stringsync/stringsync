import { Duration } from './Duration';
import { DurationRange } from './DurationRange';

describe('DurationRange', () => {
  it('creates a range from durations', () => {
    const d1 = Duration.ms(0);
    const d2 = Duration.ms(1);
    expect(() => new DurationRange(d1, d2)).not.toThrow();
  });

  it('throws an error when the durations are not sorted', () => {
    const d1 = Duration.ms(0);
    const d2 = Duration.ms(1);
    expect(() => new DurationRange(d2, d1)).toThrow();
  });

  it('can create unsorted duration ranges', () => {
    const d1 = Duration.ms(0);
    const d2 = Duration.ms(1);
    expect(() => DurationRange.unsorted(d2, d1)).not.toThrow();
  });

  it('can create declare durations piecewise', () => {
    const d1 = Duration.ms(0);
    const d2 = Duration.ms(1);
    expect(() => DurationRange.from(d1).to(d2)).not.toThrow();
  });

  it('computes if it contains a duration inside range', () => {
    const d1 = Duration.ms(0);
    const d2 = Duration.ms(1);
    const d3 = Duration.ms(2);
    expect(
      DurationRange.from(d1)
        .to(d3)
        .contains(d2)
    ).toBeTrue();
  });

  it('computes if it contains a duration outside range', () => {
    const d1 = Duration.ms(0);
    const d2 = Duration.ms(1);
    const d3 = Duration.ms(2);
    expect(
      DurationRange.from(d1)
        .to(d2)
        .contains(d3)
    ).toBeFalse();
  });

  it('computes if it contains a duration on the edge of the range', () => {
    const d1 = Duration.ms(0);
    const d2 = Duration.ms(1);
    expect(
      DurationRange.from(d1)
        .to(d2)
        .contains(d2)
    ).toBeTrue();
  });
});
