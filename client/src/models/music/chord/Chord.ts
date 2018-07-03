import { Note } from 'models';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';
import { zip } from 'lodash';
import { ChordHydrationValidator } from './ChordHydrationValidator';

export class Chord extends AbstractVexWrapper {
  public notes: Note[];
  public readonly type = 'CHORD';

  constructor(notes: Note[], struct: VextabStruct | null = null) {
    super(struct);

    if (notes.length <= 1) {
      throw new Error('expected more than one note to construct a chord');
    }

    this.notes = notes;
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
