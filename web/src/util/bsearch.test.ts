import { range } from 'lodash';
import { bsearch } from './bsearch';

describe('bsearch', () => {
  it('finds an element that matches the predicate', () => {
    const objs: Array<{ n: number }> = range(0, 100).map((n) => ({ n }));
    const target = objs[51];

    const result = bsearch(objs, (obj) => {
      if (obj.n > target.n) {
        return -1;
      }
      if (obj.n < target.n) {
        return 1;
      }
      return 0;
    });

    expect(result).toBe(target);
  });

  it('returns undefined if it cannot find the target', () => {
    const result = bsearch([], () => -1);
    expect(result).toBeUndefined();
  });
});
