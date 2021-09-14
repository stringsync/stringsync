import { Box } from '../../../util/Box';

export enum CursorStyleType {
  Default,
  Interacting,
}

export type CursorInfo = {
  currentMeasureIndex: number;
  currentMeasureNumber: number;
  numMeasures: number;
};

export interface CursorWrapper {
  element: HTMLElement;
  timeMs: number;
  update(timeMs: number): void;
  updateStyle(styleType: CursorStyleType): void;
  show(): void;
  clear(): void;
  getBox(): Box;
  scrollIntoView(): void;
}
