import { useEffect } from 'react';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useSelectionLoopingEffect = (
  musicDisplay: MusicDisplay | null,
  currentTimeMs: number,
  isPlaying: boolean,
  videoPlayerControls: VideoPlayerControls
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
    videoPlayerControls.seek(timeMsRange.start);
  }, [currentTimeMs, isPlaying, musicDisplay, videoPlayerControls]);
};
