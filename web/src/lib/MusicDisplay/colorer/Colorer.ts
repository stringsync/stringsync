import { Cursor } from 'opensheetmusicdisplay';
import { NoopColorOp } from './NoopColorOp';
import { NoteColorOp } from './NoteColorOp';
import { ColorOp } from './types';

export class Colorer {
  private opsById: Record<symbol, ColorOp> = {};

  colorNotesUnderCursor(cursor: Cursor, color: string): symbol {
    const colorOp = NoteColorOp.init(cursor);
    colorOp.perform(color);
    return this.register(colorOp);
  }

  undo(id: symbol) {
    const colorOp = this.fetch(id);
    colorOp.undo();
    this.unregister(id);
  }

  private fetch(id: symbol): ColorOp {
    return this.opsById[id] || new NoopColorOp();
  }

  private register(op: ColorOp): symbol {
    const id = Symbol();
    this.opsById[id] = op;
    return id;
  }

  private unregister(id: symbol) {
    delete this.opsById[id];
  }
}
