import { Note } from 'models';
import { AbstractVexWrapper, NoteRenderer, Directive, VextabElement } from 'models/vextab';
import { ChordHydrationValidator } from './ChordHydrationValidator';
import { Measure, Rhythm, Tuplet, Annotations } from 'models/music';
import { id, next, prev } from 'utilities';
import { get, flatMap } from 'lodash';

interface IChordOptions {
  articulation?: string | void;
  decorator?: string | void;
  rhythm?: Rhythm;
}

export class Chord extends AbstractVexWrapper {
  public readonly id: number;
  public readonly type = 'CHORD';
  
  public notes: Note[];
  public measure: Measure | void;
  public renderer: NoteRenderer;
  public directives: Directive[] = [];
  public annotations: Annotations[] = [];
  public rhythm: Rhythm;
  public tuplet: Tuplet | void;
  public articulation: string | void;
  public decorator: string | void;

  constructor(notes: Note[], options?: IChordOptions) {
    super();

    if (notes.length <= 1) {
      throw new Error('expected more than one note to construct a chord');
    }

    this.id = id();
    this.notes = notes;
    this.renderer = new NoteRenderer(this);

     // TODO validate the positions
     const base = { positions: [], rhythm: new Rhythm('4', false) };
     const opts = Object.assign(base, options || {});
     this.articulation = opts.articulation;
     this.decorator = opts.decorator;
     this.rhythm = opts.rhythm;
  }

  public get next(): VextabElement | null {
    return next(this, get(this.measure, 'elements', []));
  }

  public get prev(): VextabElement | null {
    return prev(this, get(this.measure, 'elements', []));
  }

  public get positions(): Guitar.IPosition[] {
    return flatMap(this.notes, note => note.positions);
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
    return {
      articulation: this.articulation,
      chord: flatMap(this.notes, note => note.struct),
      decorator: this.decorator
    };
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

  public clone(): Chord {
    const chord = new Chord(this.notes.map(note => note.clone()));

    const annotations = this.annotations.map(annotation => annotation.clone());
    const directives = this.directives.map(directive => directive.clone(chord));

    chord.annotations = annotations;
    chord.directives = directives;

    return chord;
  }
}
