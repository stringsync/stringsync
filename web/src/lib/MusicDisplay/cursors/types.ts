import { Box } from '../../../util/Box';
import { CursorSnapshot } from '../locator';

export enum CursorStyleType {
  Default,
  Interacting,
}

export interface CursorWrapper {
  element: HTMLElement;
  timeMs: number;
  cursorSnapshot: CursorSnapshot | null;
  update(timeMs: number): void;
  updateStyle(styleType: CursorStyleType): void;
  show(): void;
  clear(): void;
  getBox(): Box;
  scrollIntoView(): void;
}
