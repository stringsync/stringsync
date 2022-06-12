import { getInitialPageInfo } from './getInitialPageInfo';

describe('getInitialPageInfo', () => {
  it('returns page info that corresponds to the first page', () => {
    const pageInfo = getInitialPageInfo();
    expect(pageInfo.startCursor).toBeNull();
    expect(pageInfo.endCursor).toBeNull();
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns independent objects', () => {
    const pageInfo1 = getInitialPageInfo();
    const pageInfo2 = getInitialPageInfo();
    expect(pageInfo1).not.toBe(pageInfo2);
  });
});
