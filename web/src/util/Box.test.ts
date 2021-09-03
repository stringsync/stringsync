import { Box } from './Box';

describe('Box', () => {
  describe('contains', () => {
    it('returns true if in the x-range and y-range', () => {
      const box = Box.from(0, 0).to(10, 10);
      expect(box.contains(5, 5)).toBeTrue();
    });

    it('returns false if not in x-range', () => {
      const box = Box.from(0, 0).to(10, 10);
      expect(box.contains(-1, 5)).toBeFalse();
    });

    it('returns false if not in y-range', () => {
      const box = Box.from(0, 0).to(10, 10);
      expect(box.contains(5, -1)).toBeFalse();
    });

    it('returns false if not in x-range and y-range', () => {
      const box = Box.from(0, 0).to(10, 10);
      expect(box.contains(-1, -1)).toBeFalse();
    });
  });
});
