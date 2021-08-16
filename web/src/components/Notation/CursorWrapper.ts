export enum CursorWrapperType {
  Null,
  True,
}

export interface CursorWrapper {
  readonly type: CursorWrapperType;
  init(): void;
  update(timeMs: number): void;
  clear(): void;
}
