import { sortBy } from 'lodash';
import * as constants from './noteConstants';
import { AbstractVexWrapper, VextabStruct } from 'models/vextab';

/**
 * The purpose of this class is to encapsulate the logic related to describing a note's inherent
 * state in different ways as well as functionality to step to other notes. It is the fundamental
 * unit of music.
 */
export class Note extends AbstractVexWrapper {
  /**
   * An array of all the possible Note literals
   * 
   * @returns {constants.ALL_LITERALS;}
   */
  static get ALL_LITERALS() {
    return constants.ALL_LITERALS;
  }

  /**
   * A set of all the possible Note literals
   * 
   * @returns {constants.ALL_LITERALS_SET}
   */
  static get ALL_LITERALS_SET() {
    return constants.ALL_LITERALS_SET;
  }

  /**
   * An array of all the possible Note literals as sharps
   * 
   * @returns {constants.SHARP_LITERALS;}
   */
  static get SHARP_LITERALS() {
    return constants.SHARP_LITERALS;
  }

  /**
   * An array of all the possible Note literals as flats
   * 
   * @returns {constants.FLAT_LITERALS}
   */
  static get FLAT_LITERALS() {
    return constants.FLAT_LITERALS;
  }

  /**
   * Maps note literal to its alias. For example, 'D#' maps to 'Eb' since they are the same
   * note. If a note has no alias, the same literal is mapped.
   * 
   * @returns {constants.NOTE_ALIASES}
   */
  static get NOTE_ALIASES() {
    return constants.NOTE_ALIASES;
  }

  /**
   * Used to back the value getter
   * 
   * @returns {constants.VALUES_BY_LITERAL}
   */
  static get VALUES_BY_LITERAL() {
    return constants.VALUES_BY_LITERAL;
  }

  /**
   * Sorts an array of notes by octvae, value, then by literal.
   * When sorting by literal, the sort order is: naturals, sharps, then flats.
   * 
   * @param {Array<Note>} notes
   * @returns {Array<Note>}
   */
  public static sort(notes: Note[]): Note[] {
    return sortBy(notes, ['octave', 'value', 'isFlat']);
  }

  public readonly literal: string;
  public octave: number;
  public readonly type = 'NOTE';

  constructor(literal: string, octave: number, struct: VextabStruct | null = null) {
    super(struct);

    if (!Note.ALL_LITERALS_SET.has(literal)) {
      throw new Error(`${literal} should be in ${Note.ALL_LITERALS.join(', ')}`);
    } else if (!Number.isInteger(octave)) {
      throw new Error('octave must be an integer')
    }

    this.literal = literal;
    this.octave = octave;
    this.type = 'NOTE';
  }

  /**
   * Returns an alias note with a literal backed by Note.NOTE_ALIASES.
   * 
   * @returns {Note}
   */
  public get alias() {
    return new Note(Note.NOTE_ALIASES[this.literal], this.octave);
  }

  public get clone(): Note {
    return new Note(this.literal, this.octave);
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
    return this.isSharp ? this.alias : this.clone;
  }

  /**
   * Returns the sharp version of the note if the note isFlat. Otherwise, returns a clone.
   * 
   * @returnss {Note}
   */
  public toSharp(): Note {
    return this.isFlat ? this.alias : this.clone;
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

    return new Note(literal, octave);
  }

  public hydrate(staveNote: Vex.Flow.StaveNote, tabNote: Vex.Flow.TabNote): void {
    this.vexAttrs = { staveNote, tabNote };
  }
}
