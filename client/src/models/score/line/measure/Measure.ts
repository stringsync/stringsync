import { Note } from './note';

export class Measure {
  public notes: Note[] = [];

  constructor(notes: Note[]) {
    this.notes = notes;
  }
}
