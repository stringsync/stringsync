import { Note } from 'models';
import { AbstractVexWrapper, VextabStruct, NoteRenderer } from 'models/vextab';
import { ChordHydrationValidator } from './ChordHydrationValidator';
import { Measure } from 'models/music';
import { id } from 'utilities';
import { Flow } from 'vexflow';
import { Annotations } from '../annotations';
import { Rhythm } from '../rhythm';
import { Tuplet } from '../tuplet';

export class Chord extends AbstractVexWrapper {
  public readonly id: number;
  public readonly type = 'CHORD';
  
  public notes: Note[];
  public measure: Measure | void;
  public renderer: NoteRenderer;
  public directives: Directive.IDirective[] = [];
  public annotations: Annotations[] = [];
  public rhythm: Rhythm | void;
  public tuplet: Tuplet | void;

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

  /**
   * Returns a guitar position if the note is hydrated. If it is not hydrated,
   * throws an error.
   */
  public get positions(): Guitar.IPosition[] {
    if (!this.isHydrated) {
      throw new Error('cannot fetch the guitar position of an unhydrated chord');
    }

    const tabNote = this.vexAttrs!.tabNote as any;
    let positions: Array<{ fret: string, str: string }> = tabNote.positions;
    const modifiers = tabNote.modifiers as any[];

    modifiers.filter(mod => mod instanceof Flow.GraceNoteGroup).forEach(group => {
      group.grace_notes.forEach((graceTabNote: any) => {
        positions = positions.concat(graceTabNote.positions);
      });
    });

    return positions.map(({ fret, str }) => (
      { fret: parseInt(fret, 10), str: parseInt(str, 10 )}
    ));
  }
}
