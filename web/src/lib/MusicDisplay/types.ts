import { IOSMDOptions, MusicSheet } from 'opensheetmusicdisplay';

export type SyncSettings = {
  deadTimeMs: number;
  durationMs: number;
};

export interface CursorWrapper {
  init(musicSheet: MusicSheet, syncSettings: SyncSettings): void;
  update(timeMs: number): void;
  clear(): void;
  disableAutoScroll(): void;
  enableAutoScroll(): void;
}

export type Callback = () => void;

export type MusicDisplayOptions = IOSMDOptions & {
  syncSettings: SyncSettings;
  onLoadStart: Callback;
  onLoadEnd: Callback;
  onResizeStart: Callback;
  onResizeEnd: Callback;
  onAutoScroll: Callback;
};
