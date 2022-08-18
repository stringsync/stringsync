import { isEqual, uniqWith } from 'lodash';
import { useMemo } from 'react';
import { CursorSnapshot, Tie } from '../lib/MusicDisplay/locator';

export const useTies = (cursorSnapshot: CursorSnapshot | null) => {
  return useMemo<Tie[]>(() => {
    if (!cursorSnapshot) {
      return [];
    }
    const ties = cursorSnapshot.getMeasureCursorSnapshots().flatMap((cursorSnapshot) => cursorSnapshot.getTies());
    return uniqWith(ties, isEqual);
  }, [cursorSnapshot]);
};
