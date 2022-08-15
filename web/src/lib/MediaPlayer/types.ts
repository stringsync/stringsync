import { Duration } from '../../util/Duration';
import { EventBus } from '../EventBus';

export enum PlayState {
  Unknown,
  Paused,
  Playing,
}

export type QualityLevel = Readonly<{
  id: string;
  label: string;
  width: number;
  height: number;
  bitrate: number;
  enabled: boolean;
}>;

export enum QualitySelectionStrategy {
  Auto = 'auto',
  Highest = 'highest',
  Lowest = 'lowest',
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
  end: {};
  qualitylevelschange: {};
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
  isReady(): boolean;
  mute(): void;
  unmute(): void;
  setPlayback(playback: number): void;
  getPlayback(): number;
  getQualityLevels(): QualityLevel[];
  setQualityLevel(qualityLevelId: string): void;
  resetQualityLevels(): void;
}
