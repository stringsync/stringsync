import { NumberRange } from './NumberRange';

describe('NumberRange', () => {
  describe('contains', () => {
    let numberRange: NumberRange;

    beforeEach(() => {
      numberRange = NumberRange.from(0).to(10);
    });

    it.each([0, 1, 2, 3.2, 4, 10])('returns true when the number is in the range', (n) => {
      expect(numberRange.contains(n)).toBeTrue();
    });

    it.each([-1, -0.00001, 10 + Number.MIN_VALUE, 11, Number.POSITIVE_INFINITY])(
      'returns false when the number is outside of the range',
      () => {
        expect(numberRange.contains(11)).toBeFalse();
      }
    );
  });
});
