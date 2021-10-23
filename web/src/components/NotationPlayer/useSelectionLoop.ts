import { useEffect } from 'react';
import { OpenSheetMusicDisplay } from '../../lib/MusicDisplay';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useSelectionLoop = (
  musicDisplay: OpenSheetMusicDisplay | null,
  currentTimeMs: number,
  isPlaying: boolean,
  videoPlayerControls: VideoPlayerControls
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    if (!musicDisplay.getLoop().isActive) {
      return;
    }
    if (!isPlaying) {
      return;
    }
    const { timeMsRange } = musicDisplay.getLoop();
    if (timeMsRange.contains(currentTimeMs)) {
      return;
    }
    videoPlayerControls.seek(timeMsRange.start);
  }, [currentTimeMs, isPlaying, musicDisplay, videoPlayerControls]);
};
