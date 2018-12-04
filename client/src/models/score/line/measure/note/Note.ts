export class Note {
  public static isBar(noteNote: any): boolean {
    return noteNote.duration.toLowerCase() === 'b';
  }

  public readonly graphic: Element;

  private readonly noteNote: any;
  private readonly tabNote: any;

  constructor(noteNote: any, tabNote: any, graphic: Element) {
    this.noteNote = noteNote;
    this.tabNote = tabNote;
    this.graphic = graphic;
  }

  get durationTick(): number {
    return this.noteNote.getTicks().simplify().value();
  }
}
