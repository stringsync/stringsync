import { uniqBy } from 'lodash';
import { useMemo } from 'react';
import { CursorSnapshot, PositionTransition } from '../../../lib/MusicDisplay/locator';

export const useMeasureSlideTransition = (cursorSnapshot: CursorSnapshot | null) => {
  return useMemo<PositionTransition[]>(() => {
    if (!cursorSnapshot) {
      return [];
    }
    const slideTransitions = cursorSnapshot
      .getMeasureCursorSnapshots()
      .flatMap((cursorSnapshot) => cursorSnapshot.getSlideTransitions());

    return uniqBy(slideTransitions, ({ from, to }) => `${from.toString()};${to.toString()}`);
  }, [cursorSnapshot]);
};
