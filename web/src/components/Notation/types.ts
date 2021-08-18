import { VoiceEntry } from 'opensheetmusicdisplay';

export type SyncOptions = {
  deadTimeMs: number;
};

export enum CursorWrapperType {
  Null,
  True,
}

export interface CursorWrapper {
  readonly type: CursorWrapperType;
  init(voiceEntries: VoiceEntry[]): void;
  update(timeMs: number): void;
  clear(): void;
}
