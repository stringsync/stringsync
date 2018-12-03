export class Note {
  public static isBar(noteNote: any): boolean {
    return noteNote.duration.toLowerCase() === 'b';
  }

  public readonly noteNote: any;
  public readonly tabNote: any;
  public readonly graphic: Element;

  constructor(noteNote: any, tabNote: any, graphic: Element) {
    this.noteNote = noteNote;
    this.tabNote = tabNote;
    this.graphic = graphic;
  }
}
