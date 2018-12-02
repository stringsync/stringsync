export class Note {
  public static isBar(noteNote: any): boolean {
    return noteNote.duration.toLowerCase() === 'b';
  }

  public readonly noteNote: any;
  public readonly tabNote: any;

  constructor(noteNote: any, tabNote: any) {
    this.noteNote = noteNote;
    this.tabNote = tabNote;
  }
}
