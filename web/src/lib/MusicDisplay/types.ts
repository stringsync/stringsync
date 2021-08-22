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
  scrollContainer: HTMLDivElement;
  onLoadStart: Callback;
  onLoadEnd: Callback;
  onResizeStart: Callback;
  onResizeEnd: Callback;
  onAutoScrollStart: Callback;
  onAutoScrollEnd: Callback;
};
