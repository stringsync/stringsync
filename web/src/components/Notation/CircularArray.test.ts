import { CircularArray } from './CircularArray';

describe('CircularArray', () => {
  describe('constructor', () => {
    it('allows positive integer capacities', () => {
      const circularArray = new CircularArray(1);
      expect(circularArray.capacity).toBe(1);
    });

    it('disallows zero capacities', () => {
      expect(() => new CircularArray(0)).toThrow();
    });

    it('disallows negative capacities', () => {
      expect(() => new CircularArray(-1)).toThrow();
    });

    it('disallows non-integer capacities', () => {
      expect(() => new CircularArray(1.2)).toThrow();
    });
  });

  describe('push', () => {
    it('adds a value to the array', () => {
      const circularArray = new CircularArray<number>(2);
      circularArray.push(1);
      expect(circularArray.getValues()).toContain(1);
    });

    it('adds a value to the array past the capacity', () => {
      const circularArray = new CircularArray<number>(2);

      circularArray.push(1);
      circularArray.push(2);
      circularArray.push(3);

      const values = circularArray.getValues();
      expect(values).toContain(2);
      expect(values).toContain(3);
    });
  });

  describe('getLength', () => {
    it('returns number of items pushed under the capacity', () => {
      const circularArray = new CircularArray<number>(2);
      circularArray.push(1);
      expect(circularArray.getLength()).toBe(1);
    });

    it('returns the correct number of items past the capacity', () => {
      const circularArray = new CircularArray<number>(2);

      circularArray.push(1);
      circularArray.push(2);
      circularArray.push(3);

      expect(circularArray.getLength()).toBe(2);
    });
  });

  describe('getValues', () => {
    it('returns the values pushed in the array', () => {
      const circularArray = new CircularArray<number>(3);

      circularArray.push(1);
      circularArray.push(2);
      circularArray.push(3);

      expect(circularArray.getValues()).toStrictEqual([3, 2, 1]);
    });

    it('orders the values by most recently used first', () => {
      const circularArray = new CircularArray<number>(3);

      circularArray.push(1);
      circularArray.push(2);
      circularArray.push(3);
      circularArray.push(4);
      circularArray.push(5);

      expect(circularArray.getValues()).toStrictEqual([5, 4, 3]);
    });
  });
});
