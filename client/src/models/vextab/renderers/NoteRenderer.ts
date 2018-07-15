import { Note } from 'models';

export class NoteRenderer {
  public static ACTIVE_COLOR = '#a33743';
  public static DEFAULT_COLOR = '#000000';

  public readonly note: Note;
  public fillStyle: string = NoteRenderer.DEFAULT_COLOR;
  public strokeStyle: string = NoteRenderer.DEFAULT_COLOR;

  constructor(note: Note) {
    this.note = note;
  }

  public activate(): void {
    this.validate();

    this.fillStyle = NoteRenderer.ACTIVE_COLOR;
    this.strokeStyle = NoteRenderer.ACTIVE_COLOR;

    this.redraw();
  }

  public deactivate(): void {
    this.validate();

    this.fillStyle = NoteRenderer.DEFAULT_COLOR;
    this.strokeStyle = NoteRenderer.DEFAULT_COLOR;

    this.redraw();
  }

  private validate(): void {
    if (!this.note.isHydrated) {
      throw new Error('must hydrate a note before rerendering it');
    }
  }

  private redraw(): void {
    // FIXME: Using private functions. Find a way to legitmately do this.
    const { tabNote, staveNote } = this.note.vexAttrs as any;

    const ctx = staveNote.context;
    ctx.save();

    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;

    staveNote.drawNoteHeads();
    staveNote.drawLedgerLines();

    if (typeof tabNote.drawPositions === 'function') {
      tabNote.drawPositions();
    }

    ctx.restore();
  }
}
