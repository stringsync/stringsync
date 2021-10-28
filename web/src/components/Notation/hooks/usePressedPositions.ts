import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { Position } from '../../../lib/guitar/Position';
import { MediaPlayer, PlayState } from '../../../lib/MediaPlayer';
import { CursorSnapshot } from '../../../lib/MusicDisplay/locator';
import { Duration } from '../../../util/Duration';
import { NumberRange } from '../../../util/NumberRange';

const FLASH_REGION_FRACTION = 0.125;
const MAX_FLASH_DURATION = Duration.ms(50);

const computeIsInFlashRegion = (time: Duration, cursorSnapshot: CursorSnapshot | null): boolean => {
  if (!cursorSnapshot) {
    return false;
  }
  const size = Math.min(MAX_FLASH_DURATION.ms, cursorSnapshot.getTimeMsRange().size * FLASH_REGION_FRACTION);
  const start = cursorSnapshot.getTimeMsRange().start;
  const end = start + size;
  const range = NumberRange.from(start).to(end);
  return range.contains(time.ms);
};

/**
 * Returns an array of positions that are considered pressed based on a cursor snapshot.
 *
 * When two adjacent cursor snapshots have overlapping notes, it may be difficult for the
 * user to see a transition that corresponds to the notes. As a remedy, this hook will
 * take care of "flashing" adjecent positions, so that it's obvious that a position is being
 * re-pressed.
 *
 * However, when the video player is not playing, we don't want the positions to flash. So,
 * when the video player is not playing, the positions will not be filtered.
 */
export const usePressedPositions = (cursorSnapshot: CursorSnapshot | null, mediaPlayer: MediaPlayer) => {
  const [isInFlashRegion, setIsInFlashRegion] = useState(false);
  const [pressedPositions, setPressedPositions] = useState(() => (cursorSnapshot ? cursorSnapshot.getPositions() : []));
  const [playState, setPlayState] = useState(() => mediaPlayer.getPlayState());

  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('playstatechange', (payload) => {
        setPlayState(payload.playState);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);

  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('timechange', (payload) => {
        const nextIsInFlashRegion = computeIsInFlashRegion(payload.time, cursorSnapshot);
        setIsInFlashRegion(nextIsInFlashRegion);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer, cursorSnapshot]);

  useEffect(() => {
    let nextPressedPositions = cursorSnapshot ? cursorSnapshot.getPositions() : [];

    if (playState === PlayState.Playing && isInFlashRegion && cursorSnapshot && cursorSnapshot.prev) {
      const prevPositionLookup = cursorSnapshot.prev
        .getPositions()
        .reduce<Record<number, Record<number, true>>>((memo, position) => {
          memo[position.fret] = memo[position.fret] || {};
          memo[position.fret][position.string] = true;
          return memo;
        }, {});

      const wasPreviouslyPressed = (position: Position): boolean => {
        return !!(prevPositionLookup[position.fret] && prevPositionLookup[position.fret][position.string]);
      };

      nextPressedPositions = nextPressedPositions.filter((position) => !wasPreviouslyPressed(position));
    }

    setPressedPositions((currentPressedPositions) => {
      return isEqual(currentPressedPositions, nextPressedPositions) ? currentPressedPositions : nextPressedPositions;
    });
  }, [cursorSnapshot, isInFlashRegion, playState]);

  return pressedPositions;
};
