import { Note } from 'models';

export class Chord {
  public notes: Note[];
  public readonly type = 'CHORD';

  constructor(notes: Note[]) {
    this.notes = notes;
    this.type = 'CHORD';
  }
}
