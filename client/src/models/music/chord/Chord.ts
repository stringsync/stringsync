import { Note } from 'models';

export class Chord {
  public notes: Note[];
  public struct: Vextab.Parsed.IChord;
  public readonly type = 'CHORD';

  constructor(notes: Note[], struct: Vextab.Parsed.IChord) {
    this.notes = notes;
    this.struct = struct;
    this.type = 'CHORD';
  }
}
