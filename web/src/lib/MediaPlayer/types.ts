import { Duration } from '../../util/Duration';
import { EventBus } from '../EventBus';

export enum PlayState {
  Unknown,
  Paused,
  Playing,
}

export type MediaPlayerEventBus = EventBus<{
  init: {};
  timechange: { time: Duration };
  playstatechange: { playState: PlayState };
  suspend: {};
  unsuspend: {};
  volumechange: { volume: number };
  mutechange: { muted: boolean };
  playbackchange: { playback: number };
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
  getVolume(): number;
  setVolume(volume: number): void;
  isMuted(): boolean;
  mute(): void;
  unmute(): void;
  setPlayback(playback: number): void;
  getPlayback(): number;
}
