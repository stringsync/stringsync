import { CursorWrapper } from '..';
import { NumberRange } from '../../../util/NumberRange';

export interface Loop {
  readonly isActive: boolean;
  readonly timeMsRange: NumberRange;
  readonly startCursor: CursorWrapper;
  readonly endCursor: CursorWrapper;
  activate(): void;
  deactivate(): void;
  anchor(timeMs: number): void;
  update(timeMs: number): void;
}
