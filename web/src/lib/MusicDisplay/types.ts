import { IOSMDOptions, MusicSheet } from 'opensheetmusicdisplay';

export type SyncSettings = {
  deadTimeMs: number;
  durationMs: number;
};

export enum CursorWrapperType {
  Null,
  True,
}

export interface CursorWrapper {
  readonly type: CursorWrapperType;
  init(musicSheet: MusicSheet, syncSettings: SyncSettings): void;
  update(timeMs: number): void;
  clear(): void;
}

export type Callback = () => void;

export type MusicDisplayOptions = IOSMDOptions & {
  syncSettings: SyncSettings;
  onLoadStart?: Callback;
  onLoadEnd?: Callback;
  onResizeStart?: Callback;
  onResizeEnd?: Callback;
};
