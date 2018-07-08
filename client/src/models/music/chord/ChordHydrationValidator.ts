import { AbstractValidator } from 'utilities';
import { Chord } from 'models/music';
import { Note } from '../note';

export class ChordHydrationValidator extends AbstractValidator<Chord> {
  public readonly staveNote: Vex.Flow.StaveNote;
  public readonly tabNote: Vex.Flow.TabNote;

  constructor(chord: Chord, staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote) {
    super(chord);

    this.staveNote = staveNote;
    this.tabNote = tabNote;
  }

  protected doValidate(): void {
    this.validateHydratable();
    this.validateChords();
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

  private get staveChord(): Chord {
    return new Chord(this.staveKeys.map(Note.from));
  }

  private get tabChord(): Chord {
    return new Chord(this.tabKeys.map(Note.from));
  }

  private validateHydratable(): void {
    if (!this.target.isHydratable) {
      this.error('cannot hydrate an object that is not hydratable');
    }
  }

  private validateChords(): void {
    if (!this.target.isEquivalent(this.staveChord)) {
      this.error('expected chord to be equivalent to the staveNote chord');
    } else if (!this.target.isEquivalent(this.tabChord)) {
      this.error('expected chord to be equivalent to the tabNote chord');
    }
  }
}