import { omit } from 'lodash';
import { getViewportState } from './getViewportState';
import { Breakpoint } from './types';

describe('getViewportState', () => {
  it.each(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as Breakpoint[])('creates a viewport object', (breakpoint) => {
    const viewport = getViewportState(breakpoint);

    expect(viewport.breakpoint).toBe(breakpoint);

    for (const [key, val] of Object.entries(omit(viewport, ['innerWidth', 'innerHeight']))) {
      if (key === 'breakpoint') {
        continue;
      }
      expect(val).toBe(key === breakpoint);
    }
  });
});
