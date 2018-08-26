import { AbstractValidator } from 'utilities';
import { Chord } from 'models/music';
import { Note } from '../note';
import { Flow } from 'vexflow';

const TUNING = new (Flow as any).Tuning() as Vex.Flow.Tuning;

export class ChordHydrationValidator extends AbstractValidator<Chord> {
  public readonly staveNote: Vex.Flow.StaveNote;
  public readonly tabNote: Vex.Flow.TabNote;

  constructor(chord: Chord, staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote) {
    super(chord);

    this.staveNote = staveNote;
    this.tabNote = tabNote;
  }

  protected doValidate(): void {
    this.validateChords();
  }

  private get staveKeys(): string[] {
    return this.staveNote.getKeys();
  }

  private get tabPositions(): Array<{ fret: number, str: number}> {
    return this.tabNote.getPositions();
  }

  // TODO: Allow the validator to take the correct tuning
  private get tuning(): Vex.Flow.Tuning {
    return TUNING;
  }

  private get tabKeys(): string[] {
    return this.tabPositions.map(({ fret, str }) => (
      this.tuning.getNoteForFret(fret.toString(), str.toString())
    ));
  }

  private get staveChord(): Chord {
    return new Chord(this.staveKeys.map(key => Note.from(key)));
  }

  private get tabChord(): Chord {
    return new Chord(this.tabKeys.map(key => Note.from(key)));
  }

  private validateChords(): void {
    if (!this.target.isEquivalent(this.staveChord)) {
      this.error('expected chord to be equivalent to the staveNote chord');
    } else if (!this.target.isEquivalent(this.tabChord)) {
      this.error('expected chord to be equivalent to the tabNote chord');
    }
  }
}