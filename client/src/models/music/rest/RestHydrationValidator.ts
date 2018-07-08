import { AbstractValidator } from 'utilities';
import { Rest } from 'models/music';

export class RestHydrationValidator extends AbstractValidator<Rest> {
  public readonly staveNote: Vex.Flow.StaveNote;
  public readonly tabNote: Vex.Flow.TabNote;

  constructor(rest: Rest, staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote) {
    super(rest);

    this.staveNote = staveNote;
    this.tabNote = tabNote;
  }

  protected doValidate(): void {
    this.validateNoteType();
    this.validateDuration();
  }

  private validateNoteType(): void {
    if (this.staveNote.getNoteType() !== 'r') {
      this.error(`expected staveNote type of r, got ${this.staveNote.getNoteType()}`)
    } else if (this.tabNote.getNoteType() !== 'n') {
      this.error(`expected tabNote type of n, got ${this.tabNote.getNoteType()}`)
    }
  }

  private validateDuration(): void {
    const duration = this.target.rhythm.value.toString();

    if (duration !== this.staveNote.getDuration()) {
      this.error('expected staveNote to have the same duration as the rest\'s rhythm');
    } else if (duration !== this.tabNote.getDuration()) {
      this.error('expected tabNote to have the same duration as the rest\'s rhythm');
    }
  }
}