import { merge, sortBy } from 'lodash';
import * as constants from './noteConstants';
import { AbstractVexWrapper, Directive } from 'models/vextab';
import { NoteHydrationValidator } from './NoteHydrationValidator';
import { id } from 'utilities';
import { Measure, Annotations, Rhythm, Tuplet } from 'models/music';
import { NoteRenderer } from 'models/vextab';

/**
 * The purpose of this class is to encapsulate the logic related to describing a note's inherent
 * state in different ways as well as functionality to step to other notes. It is the fundamental
 * unit of music.
 */
export class Note extends AbstractVexWrapper {
  public static ALL_LITERALS = constants.ALL_LITERALS;
  public static ALL_LITERALS_SET = constants.ALL_LITERALS_SET;
  public static SHARP_LITERALS = constants.SHARP_LITERALS;
  public static FLAT_LITERALS = constants.FLAT_LITERALS;
  public static NOTE_ALIASES = constants.NOTE_ALIASES;
  public static VALUES_BY_LITERAL = constants.VALUES_BY_LITERAL;

  /**
   * Sorts an array of notes by octave, value, then by literal.
   * When sorting by literal, the sort order is: naturals, sharps, then flats.
   * 
   * @param {Array<Note>} notes
   * @returns {Array<Note>}
   */
  public static sort(notes: Note[]): Note[] {
    return sortBy(notes, ['octave', 'value', 'isFlat']);
  }

  /**
   * Transforms a string that has literal and octave information in it to a Note object.
   * Validation is handled at note creation.
   * 
   * @param {string} str expected string format: `${note}${modifier?}/${octave}`
   * @returns {Note}
   */
  public static from(str: string): Note {
    const splitStr = str.split('/');
    return new Note(splitStr[0], parseInt(splitStr[1], 10));
  }

  /**
   * Makes a good attempt at normalizing the literal. Throws an error if it can't.
   * 
   * @param literal 
   */
  public static normalize(literal: string): string {
    const trimmed = literal.trim();

    if (trimmed.length === 1) {
      return trimmed.toUpperCase();
    } else if (trimmed.length === 2) {
      return `${literal[0].toUpperCase()}${literal[1].toLowerCase()}`;
    } else {
      throw new Error('literals must have 1 or 2 characters');
    }
  }

  public readonly literal: string;
  public readonly id: number;
  public readonly type = 'NOTE';

  public octave: number;
  public measure: Measure | void;
  public renderer: NoteRenderer;
  public directives: Directive[] = [];
  public annotations: Annotations[] = [];
  public rhythm: Rhythm | void;
  public tuplet: Tuplet | void;
  public positions: Guitar.IPosition[] = [];
  public articulation: string | void;
  public decorator: string | void;

  constructor(literal: string, octave: number, positions?: Guitar.IPosition[]) {
    super();

    const normalizedLiteral = Note.normalize(literal);

    if (!Note.ALL_LITERALS_SET.has(normalizedLiteral)) {
      throw new Error(`${normalizedLiteral} should be in ${Note.ALL_LITERALS.join(', ')}`);
    } else if (!Number.isInteger(octave)) {
      throw new Error('octave must be an integer')
    }

    this.id = id();
    this.literal = normalizedLiteral;
    this.octave = octave;
    this.renderer = new NoteRenderer(this);

    if (positions) {
      this.positions = positions; // TODO: Validate that the position returns the right note literal
    }
  }

  /**
   * Returns an alias note with a literal backed by Note.NOTE_ALIASES.
   * 
   * @returns {Note}
   */
  public get alias() {
    return new Note(Note.NOTE_ALIASES[this.literal], this.octave);
  }

  /**
   * Returns true if the note is flat.
   * 
   * @returns {boolean}
   */
  public get isFlat() {
    return this.literal.endsWith('b');
  }

  /**
   * Returns true if the note is natural.
   * 
   * @returns {boolean}
   */
  public get isNatural(): boolean {
    return !this.isFlat && !this.isSharp;
  }

  /**
   * Returns true if the note is sharp.
   * 
   * @returns {boolean}
   */
  public get isSharp(): boolean {
    return this.literal.endsWith('#');
  }

  /**
   * Returns the value of the note. Notes that have an alias with a different literal have
   * the same value.
   * 
   * @returns {number}
   */
  public get value(): boolean {
    return Note.VALUES_BY_LITERAL[this.literal];
  }

  /**
   * @returns {Vextab.Parsed.IPosition}
   */
  public get struct(): Vextab.Parsed.IPosition {
    return {
      articulation: this.articulation,
      decorator: this.decorator,
      fret: this.positions[0].fret.toString(),
      string: this.positions[0].str.toString()
    }
  }

  public clone(): Note {
    const note = new Note(this.literal, this.octave, merge([], this.positions));

    const annotations = this.annotations.map(annotation => annotation.clone());
    const directives = this.directives.map(directive => directive.clone(note));

    note.annotations = annotations;
    note.directives = directives;

    return note;
  }

  /**
   * A note is considered equivalent to another note when the octaves are the same and the
   * values are the same.
   * 
   * @param {Note} other 
   * @returns {boolean}
   */
  public isEquivalent(other: Note): boolean {
    return this.isSameOctave(other) && this.isSameNote(other);
  }

  /**
   * Compares +this+ with the other note. Similar to the spaceship operator in Ruby.
   * 
   * @param {Note} other 
   * @returns {number} -1 if less than, 0 if equal to, 1 if greater than
   */
  public compare(other: Note): -1 | 0 | 1 {
    if (this.octave < other.octave) {
      return -1;
    } else if (this.octave > other.octave) {
      return 1;
    } else {
      if (this.value < other.value) {
        return -1;
      } else if (this.value > other.value) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  /**
   * Compares the equality of the octaves.
   * 
   * @param {Note} other 
   * @returns {boolean}
   */
  public isSameOctave(other: Note): boolean {
    return this.octave === other.octave;
  }

  /**
   * Compares the values of the notes.
   * 
   * @param {Note} other 
   * @returns {boolean}
   */
  public isSameNote(other: Note): boolean {
    return this.value === other.value;
  }

  /**
   * Returns the string representation of the note. Mainly used for Vexflow.
   * 
   * @returns {string}
   */
  public toString(): string {
    return `${this.literal}/${this.octave}`;
  }

  /**
   * Returns the flat version of the note if the note isSharp. Otherwise, returns a clone.
   * 
   * @returns {Note}
   */
  public toFlat(): Note {
    return this.isSharp ? this.alias : this.clone();
  }

  /**
   * Returns the sharp version of the note if the note isFlat. Otherwise, returns a clone.
   * 
   * @returns {Note}
   */
  public toSharp(): Note {
    return this.isFlat ? this.alias : this.clone();
  }

  /**
   * Returns a new note instance that corresponds to the number of half steps specified.
   * If this.isFlat returns true, a flat note may be returned. Otherwise, maybe return a sharp
   * note.
   * 
   * @param {number} numHalfSteps 
   * @returns {Note}
   */
  public step(numHalfSteps: number = 1): Note {
    if (!Number.isInteger(numHalfSteps)) {
      throw new Error('numHalfSteps must be an integer')
    }

    // Compute the stepped literal using modulus computations
    const notes = this.isFlat ? Note.FLAT_LITERALS : Note.SHARP_LITERALS;
    const ndx = notes.indexOf(this.literal);
    const steppedNdx = (ndx + numHalfSteps) % notes.length;
    const literal = notes[steppedNdx];

    // Compute the stepped octave by determining how many half steps (equivalent to 1 array index),
    // it takes to get to the end of the array. Next, we can figure out how many more octaves were
    // traversed by taking the remaining half steps and performing integer division of it with the
    // notes length.
    let numOctavesTraversed = 0;
    const firstOctaveHalfSteps = (notes.length - 1) - ndx;
    const remainingHalfSteps = numHalfSteps - firstOctaveHalfSteps;
    numOctavesTraversed += remainingHalfSteps > 0 ? 1 : 0;
    numOctavesTraversed += Math.max(Math.floor(remainingHalfSteps / notes.length), 0);
    const octave = this.octave + numOctavesTraversed;

    return new Note(literal, octave, merge([], this.positions));
  }

  /**
   * Sets postprocessing vexflow attributes to the instance
   * 
   * @param staveNote 
   * @param tabNote 
   */
  public hydrate(staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote): void {
    const validator = new NoteHydrationValidator(this, staveNote, tabNote);

    validator.validate();

    if (validator.isValid) {
      this.vexAttrs = { staveNote, tabNote };
    } else {
      throw validator.errors;
    }
  }
}
