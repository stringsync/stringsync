import { Note } from 'models';
import { AbstractVexWrapper, VextabStruct, NoteRenderer } from 'models/vextab';
import { ChordHydrationValidator } from './ChordHydrationValidator';
import { Measure } from 'models/music';
import { id } from 'utilities';

export class Chord extends AbstractVexWrapper {
  public readonly id: number;
  public readonly type = 'CHORD';
  
  public notes: Note[];
  public measure: Measure | void;
  public renderer: NoteRenderer;

  constructor(notes: Note[], struct: VextabStruct | null = null) {
    super(struct);

    if (notes.length <= 1) {
      throw new Error('expected more than one note to construct a chord');
    }

    this.id = id();
    this.notes = notes;
    this.renderer = new NoteRenderer(this);
  }

  /**
   * Equivalency is based on the equivalency of the notes that constitute each Chord object.
   * 
   * @param other 
   */
  public isEquivalent(other: Chord): boolean {
    if (this.notes.length !== other.notes.length) {
      return false;
    }

    const src = Note.sort(this.notes);
    const dst = Note.sort(other.notes);

    return src.every((note, ndx) => note.isEquivalent(dst[ndx]));
  }

  /**
   * Sets postprocessing vexflow attributes to the instance
   * 
   * @param staveNote 
   * @param tabNote 
   */
  public hydrate(staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote): void {
    const validator = new ChordHydrationValidator(this, staveNote, tabNote);

    validator.validate();

    if (validator.isValid) {
      this.vexAttrs = { staveNote, tabNote };
    } else {
      throw validator.errors;
    }
  }
}
