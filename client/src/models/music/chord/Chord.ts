import { Note } from 'models';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';

export class Chord extends AbstractVexWrapper {
  public notes: Note[];
  public readonly type = 'CHORD';

  constructor(notes: Note[], struct: VextabStruct | null = null) {
    super(struct);

    if (notes.length <= 1) {
      throw new Error('expected more than one note to construct a chord');
    }

    this.notes = notes;
  }

  public hydrate(staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote): void {
    this.vexAttrs = { staveNote, tabNote };
  }
}
