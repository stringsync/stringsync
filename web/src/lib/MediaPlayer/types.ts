import { Duration } from '../../util/Duration';
import { EventBus } from '../EventBus';

export enum PlayState {
  Paused,
  Playing,
}

export type MediaPlayerEventBus = EventBus<{
  timechange: { time: Duration };
}>;

export interface MediaPlayer {
  eventBus: MediaPlayerEventBus;
  play(): void;
  pause(): void;
  seek(time: Duration): void;
  dispose(): void;
  suspend(): void;
  unsuspend(): void;
  getPlayState(): PlayState;
  getCurrentTime(): Duration;
}
