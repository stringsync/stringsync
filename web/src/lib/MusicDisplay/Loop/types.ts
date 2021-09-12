import { CursorWrapper, UpdateCause } from '..';
import { NumberRange } from '../../../util/NumberRange';
import { AnchoredTimeSelection } from '../AnchoredTimeSelection';

export interface Loop {
  readonly isActive: boolean;
  readonly timeMsRange: NumberRange;
  readonly startCursor: CursorWrapper;
  readonly endCursor: CursorWrapper;
  readonly selection: AnchoredTimeSelection;
  activate(): void;
  deactivate(): void;
  anchor(timeMs: number): void;
  update(timeMs: number, cause?: UpdateCause): void;
}
