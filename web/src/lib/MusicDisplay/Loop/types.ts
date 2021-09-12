import { NumberRange } from '../../../util/NumberRange';
import { AnchoredTimeSelection } from '../AnchoredTimeSelection';
import { CursorWrapper } from '../types';

export interface Loop {
  readonly isActive: boolean;
  readonly timeMsRange: NumberRange;
  readonly startCursor: CursorWrapper;
  readonly endCursor: CursorWrapper;
  readonly selection: AnchoredTimeSelection;
  activate(): void;
  deactivate(): void;
  anchor(timeMs: number): void;
  update(timeMs: number): void;
  resetStyles(): void;
}
