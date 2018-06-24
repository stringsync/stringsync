import { Note } from 'models/music';

export class Key {
  public note: Note;
  public type = 'KEY';

  constructor(note: Note) {
    this.note = note;
  }

  public toString(): string {
    return this.note.toString();
  }
}
