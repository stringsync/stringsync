import { uniqBy } from 'lodash';
import { useMemo } from 'react';
import { Position } from '../../../lib/guitar/Position';
import { CursorSnapshot } from '../../../lib/MusicDisplay/locator';

export const useMeasurePositions = (cursorSnapshot: CursorSnapshot | null) => {
  return useMemo<Position[]>(() => {
    if (!cursorSnapshot) {
      return [];
    }
    const measureCursorSnapshots = cursorSnapshot.getMeasureCursorSnapshots();
    const positions = measureCursorSnapshots.flatMap((measureCursorSnapshot) => {
      return measureCursorSnapshot.getGuitarPositions();
    });
    return uniqBy(positions, (position) => position.toString());
  }, [cursorSnapshot]);
};
