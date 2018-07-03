import { Note } from './Note';
import { AbstractValidator } from 'utilities';

export class NoteHydrationValidator extends AbstractValidator<Note> {
  public readonly staveNote: Vex.Flow.StaveNote;
  public readonly tabNote: Vex.Flow.TabNote;

  constructor(target: Note, staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote) {
    super(target);

    this.staveNote = staveNote;
    this.tabNote = tabNote;
  }

  public validate(): boolean {
    this.validateHydratable();
    this.validateLengths();
    this.validateLiterals();

    return true;
  }

  private get staveKeys(): string[] {
    return this.staveNote.getKeys();
  }

  private get tabPositions(): Array<{ fret: number, str: number }> {
    return this.tabNote.getPositions();
  }

  private get staveNoteStr(): string {
    return this.staveKeys[0];
  }

  private get tuning(): Vex.Flow.Tuning {
    if (!this.target.struct) {
      this.error('expected note to have a struct');
    }

    return this.target.struct!.vextab.tuning;
  }

  private get tabNoteStr(): string {
    const { fret, str } = this.tabPositions[0];
    return this.tuning.getNoteForFret(fret.toString(), str.toString());
  }

  private validateHydratable(): void {
    if (!this.target.isHydratable) {
      this.error('cannot hydrate an object that is not hydratable');
    }
  }

  private validateLengths(): void {
    if (this.staveKeys.length !== 1) {
      this.error('expected staveNote to only have 1 key');
    } else if (this.tabPositions.length !== 1) {
      this.error('expected tabNote to only have 1 position');
    }
  }

  private validateLiterals(): void {
    const note = this.target;

    if (!note.isEquivalent(Note.from(this.staveNoteStr))) {
      this.error('expected note to be equivalent to the staveNote note');
    } else if (!note.isEquivalent(Note.from(this.tabNoteStr))) {
      this.error('expected note to be equivalent to the tabNote note')
    }
    
  }
}
