import { Note } from 'models/music';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';

export class Key extends AbstractVexWrapper {
  public note: Note;
  public type = 'KEY';

  constructor(note: Note, struct: VextabStruct | null = null) {
    super(struct);

    this.note = note;
  }

  public toString(): string {
    return this.note.toString();
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
