import { useEffect } from 'react';
import { MusicDisplay } from '../../../lib/MusicDisplay';

type SeekCallback = (currentTimeMs: number) => void;

export const useSelectionLoopingEffect = (
  musicDisplay: MusicDisplay | null,
  currentTimeMs: number,
  isPlaying: boolean,
  seek: SeekCallback
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    if (!musicDisplay.loop.isActive) {
      return;
    }
    if (!isPlaying) {
      return;
    }
    const { timeMsRange } = musicDisplay.loop;
    if (timeMsRange.contains(currentTimeMs)) {
      return;
    }
    seek(timeMsRange.start);
  }, [currentTimeMs, isPlaying, musicDisplay, seek]);
};
