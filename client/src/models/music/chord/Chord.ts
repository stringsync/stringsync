import { Note } from 'models';
import { AbstractVexWrapper, NoteRenderer } from 'models/vextab';
import { ChordHydrationValidator } from './ChordHydrationValidator';
import { Measure } from 'models/music';
import { id } from 'utilities';
import { Annotations } from '../annotations';
import { Rhythm } from '../rhythm';
import { Tuplet } from '../tuplet';
import { flatMap } from 'lodash';

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

  constructor(notes: Note[]) {
    super();

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

  public get struct(): Vextab.Parsed.IChord {
    return { chord: flatMap(this.notes, note => note.struct) };
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
   * Returns a guitar position if the note is hydrated. If any note does not have a position,
   * throws an error.
   */
  public get positions(): Guitar.IPosition[] {
    return flatMap(this.notes, note => note.positions);
  }
}
