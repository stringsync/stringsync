import { MusicSheet } from 'opensheetmusicdisplay';

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
