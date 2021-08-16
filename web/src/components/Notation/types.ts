export enum CursorWrapperType {
  Null,
  True,
}

export interface CursorWrapper {
  readonly type: CursorWrapperType;
  update(timeMs: number): void;
}
