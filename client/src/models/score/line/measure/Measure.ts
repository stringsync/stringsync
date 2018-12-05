import { Note } from './note';
import { Line } from '../Line';

export class Measure {
  public notes: Note[] = [];
  public line: Line | undefined;

  constructor(notes: Note[]) {
    this.notes = notes;
  }
}
