import { Note } from 'models';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';
import { zip } from 'lodash';

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
    this.validateHydration(staveNote, tabNote);

    this.vexAttrs = { staveNote, tabNote };
  }

  private validateHydration(staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote): void {
    if (!this.isHydratable) {
      throw new Error('cannot hydrate an object that is not hydratable');
    }

    const staveKeys = staveNote.getKeys();
    const tabPositions = tabNote.getPositions();
    const { notes } = this;

    // Validate length
    if (staveKeys.length !== notes.length) {
      throw new Error(`expected staveKeys to have ${notes.length} elements`);
    } else if (tabPositions.length !== notes.length) {
      throw new Error(`expected tabPositions to have ${notes.length} elements`)
    }

    // Normalize each key into a note object
    const staveNotes = staveKeys.map(Note.from);
    const tabNotes = tabPositions.map(({ fret, str }) => (
      Note.from(
        this.struct!.vextab.tuning.getNoteForFret(fret.toString(), str.toString())
      )
    ));

    // helper function
    const isEqual = (srcNotes: Note[], dstNotes: Note[]): boolean => {
      if (srcNotes.length !== dstNotes.length) {
        return false;
      }

      const src = Note.sort(srcNotes);
      const dst = Note.sort(dstNotes);

      return src.every((srcNote, ndx) => srcNote.isEquivalent(dst[ndx]));
    }

    const expected = notes.map(note => note.toString()).join(', ');
    let actual;
    // Validate literals using the wrapper as the source of truth
    if (!isEqual(notes, staveNotes)) {
      actual = Array.from(staveNotes).map(note => note.toString()).join(', ')
      throw new Error(`expected staveNote to have keys:\n\n\t${expected}\n\ngot:\n\n\t${actual}`);
    } else if (!isEqual(notes, tabNotes)) {
      actual = Array.from(tabNotes).map(note => note.toString()).join(', ')
      throw new Error(`expected tabNote to have keys:\n\n\t${expected}\n\ngot:\n\n\t${actual}`);
    }
  }
}
