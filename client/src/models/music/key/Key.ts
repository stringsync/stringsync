import { Note } from 'models/music';
import { AbstractVexWrapper } from 'models/vextab';

export class Key extends AbstractVexWrapper {
  public note: Note;
  public type = 'KEY';

  constructor(note: Note) {
    super();

    this.note = note;
  }

  public get struct(): Vextab.Parsed.IKey {
    return { key: 'key', value: this.note.toString() };
  }

  public toString(): string {
    return this.note.toString();
  }

  public hydrate(): void {
    this.vexAttrs = null;
  }
}
