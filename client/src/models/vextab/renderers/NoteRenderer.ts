import { Note, Chord } from 'models/music';

export class NoteRenderer {
  public static ACTIVE_COLOR = '#fc354c';
  public static DEFAULT_COLOR = '#000000';

  public readonly note: Note | Chord;
  public fillStyle: string = NoteRenderer.DEFAULT_COLOR;
  public strokeStyle: string = NoteRenderer.DEFAULT_COLOR;
  public isActive: boolean = false;

  constructor(note: Note | Chord) {
    this.note = note;
  }

  public activate(): void {
    if (this.isActive) {
      return;
    }

    this.validate();
    this.color = NoteRenderer.ACTIVE_COLOR;
    this.redraw();

    this.isActive = true;
  }

  public deactivate(): void {
    if (!this.isActive) {
      return;
    }

    this.validate();
    this.color = NoteRenderer.DEFAULT_COLOR;
    this.redraw();

    this.isActive = false;
  }

  private set color(color: string) {
    this.fillStyle = color;
    this.strokeStyle = color;

    const style = { fillStyle: color, strokeStyle: color };
    const staveNote = this.note.vexAttrs!.staveNote as any;
    staveNote.setStyle(style);
    staveNote.setLedgerLineStyle(style);
    staveNote.setFlagStyle(style);
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
