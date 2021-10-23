import { DurationRange } from '../../../util/DurationRange';
import { NumberRange } from '../../../util/NumberRange';
import { CursorWrapper } from '../cursors';

export interface Loop {
  readonly isActive: boolean;
  readonly startCursor: CursorWrapper;
  readonly endCursor: CursorWrapper;
  readonly timeMsRange: NumberRange;
  readonly timeRange: DurationRange;
  activate(): void;
  deactivate(): void;
  resetStyles(): void;
  update(timeMsRange: NumberRange): void;
}
