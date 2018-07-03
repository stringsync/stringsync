import { AbstractValidator } from 'utilities';
import { Chord } from 'models/music';
import { Note } from '../note';

export class ChordHydrationValidator extends AbstractValidator<Chord> {
  public static isEqual(notes1: Note[], notes2: Note[]): boolean {
    if (notes1.length !== notes2.length) {
      return false;
    }

    const sortedNotes1 = Note.sort(notes1);
    const sortedNotes2 = Note.sort(notes2);

    return sortedNotes1.every((sortedNote1, ndx) => sortedNote1.isEquivalent(sortedNotes2[ndx]));
  }

  public readonly staveNote: Vex.Flow.StaveNote;
  public readonly tabNote: Vex.Flow.TabNote;

  constructor(chord: Chord, staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote) {
    super(chord);

    this.staveNote = staveNote;
    this.tabNote = tabNote;
  }

  protected doValidate(): void {
    this.validateHydratable();
    this.validateLengths();
    this.validateLiterals();
  }

  private get staveKeys(): string[] {
    return this.staveNote.getKeys();
  }

  private get tabPositions(): Array<{ fret: number, str: number}> {
    return this.tabNote.getPositions();
  }

  private get tuning(): Vex.Flow.Tuning {
    if (!this.target.struct) {
      throw new Error('expected note to have a struct');
    }

    return this.target.struct.vextab.tuning;
  }

  private get tabKeys(): string[] {
    return this.tabPositions.map(({ fret, str }) => (
      this.tuning.getNoteForFret(fret.toString(), str.toString())
    ));
  }

  private get wrappedStaveNotes(): Note[] {
    return this.staveKeys.map(Note.from);
  }

  private get wrappedTabNotes(): Note[] {
    return this.tabKeys.map(Note.from);
  }

  private validateHydratable(): void {
    if (!this.target.isHydratable) {
      this.error('cannot hydrate an object that is not hydratable');
    }
  }

  private validateLengths(): void {
    const { notes } = this.target;

    if (this.staveKeys.length !== notes.length) {
      this.error(`expected staveNote to have ${notes.length} keys`);
    } else if (this.tabPositions.length !== notes.length) {
      this.error(`expected tabNote to have ${notes.length} positions`);
    }
  }

  private validateLiterals(): void {
    const { notes } = this.target;
    const { wrappedStaveNotes, wrappedTabNotes } = this;

    if (!ChordHydrationValidator.isEqual(notes, wrappedStaveNotes)) {
      this.error('expected chord to have the same keys as staveNote');
    } else if (!ChordHydrationValidator.isEqual(notes, wrappedTabNotes)) {
      this.error('expected chord to have the same keys as tabNote');
    }
  }
}