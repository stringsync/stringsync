import { ColorOp } from './types';

export class NoopColorOp implements ColorOp {
  perform() {}
  undo() {}
}
