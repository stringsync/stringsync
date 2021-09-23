import { useMemo } from 'react';
import { Position } from '../../../lib/guitar/Position';
import { CursorSnapshot } from '../../../lib/MusicDisplay/locator';

export const usePressedPositions = (cursorSnapshot: CursorSnapshot | null) => {
  return useMemo<Position[]>(() => (cursorSnapshot ? cursorSnapshot.guitarPositions : []), [cursorSnapshot]);
};
