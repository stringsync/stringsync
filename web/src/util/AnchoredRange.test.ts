import { AnchoredRange } from './AnchoredRange';

describe('AnchoredRange', () => {
  it('can be initialized with a single value', () => {
    const range = AnchoredRange.init(42);
    expect(range.anchor).toBe(42);
    expect(range.mover).toBe(42);
  });

  it('can be initialized with multiple values', () => {
    const range = new AnchoredRange(41, 42);
    expect(range.anchor).toBe(41);
    expect(range.mover).toBe(42);
  });

  it('updates the mover', () => {
    const range1 = AnchoredRange.init(42);

    const range2 = range1.move(43);

    expect(range1.anchor).toBe(42);
    expect(range2.anchor).toBe(42);
    expect(range2.anchor).toBe(42);
    expect(range2.mover).toBe(43);
  });
});
