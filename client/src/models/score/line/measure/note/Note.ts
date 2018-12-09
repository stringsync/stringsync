import { Measure } from '../Measure';
export class Note {
  public static isBar(noteNote: any): boolean {
    return noteNote.duration.toLowerCase() === 'b';
  }

  public readonly graphic: any;

  public measure: Measure | undefined;

  // Callers should not access the vexflow elements. Instead,
  // a method exposing and computing some aspect of the vexflow
  // element should be created.
  private readonly noteNote: any;
  private readonly tabNote: any;

  constructor(noteNote: any, tabNote: any, graphic: any) {
    this.noteNote = noteNote;
    this.tabNote = tabNote;
    this.graphic = graphic;
  }

  get durationTick(): number {
    return this.noteNote.getTicks().simplify().value();
  }
}
