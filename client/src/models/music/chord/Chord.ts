import { Note } from 'models';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';

export class Chord extends AbstractVexWrapper {
  public notes: Note[];
  public readonly type = 'CHORD';

  constructor(notes: Note[], struct: VextabStruct | null = null) {
    super(struct);

    this.notes = notes;
    this.type = 'CHORD';
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
