import { Duration } from '../../util/Duration';
import { EventBus } from '../EventBus';
import { MediaPlayer, MediaPlayerEventBus, PlayState } from './types';

export class NoopMediaPlayer implements MediaPlayer {
  eventBus: MediaPlayerEventBus = new EventBus();
  dispose() {}
  play() {}
  pause() {}
  getCurrentTime() {
    return Duration.zero();
  }
  getPlayState() {
    return PlayState.Paused;
  }
  seek(time: Duration) {}
  suspend() {}
  unsuspend() {}
}