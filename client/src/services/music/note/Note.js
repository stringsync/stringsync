import { sortBy } from 'lodash';

const ALL_LITERALS = Object.freeze(['Ab', 'A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#']);
const ALL_LITERALS_SET = Object.freeze(new Set(ALL_LITERALS));
const SHARP_LITERALS = Object.freeze(['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']);
const FLAT_LITERALS = Object.freeze(['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']);
const NOTE_ALIASES = Object.freeze({
  'Ab': 'G#',
  'A': 'A',
  'A#': 'Bb',
  'Bb': 'A#',
  'B': 'B',
  'C': 'C',
  'C#': 'Db',
  'Db': 'C#',
  'D': 'D',
  'D#': 'Eb',
  'Eb': 'D#',
  'E': 'E',
  'F': 'F',
  'F#': 'Gb',
  'Gb': 'F#',
  'G': 'G',
  'G#': 'Ab'
});

/**
 * The purpose of this class is to encapsulate the logic related to describing a note's inherent
 * state in different ways as well as functionality to step to other notes.
 */
class Note {
  static get ALL_LITERALS() {
    return ALL_LITERALS;
  }

  static get ALL_LITERALS_SET() {
    return ALL_LITERALS_SET;
  }

  static get SHARP_LITERALS() {
    return SHARP_LITERALS;
  }

  static get FLAT_LITERALS() {
    return FLAT_LITERALS;
  }

  static get NOTE_ALIASES() {
    return NOTE_ALIASES;
  }

  // TODO: construct a chromatic Scale object, which describes the degree of the note literals,
  // and then sort by the octave, then the ScaleDegree
  static sort(notes) {
    return sortBy(notes, note => {
      return 1;
    });
  }

  /**
   * @param {string} literal
   * @param {number} octave
   */
  constructor(literal, octave) {
    if (!Note.ALL_LITERALS_SET.has(literal)) {
      throw new Error(`${literal} should be in ${Note.ALL_LITERALS.join(', ')}`);
    } else if (!Number.isInteger(octave)) {
      throw new Error('octave must be an integer')
    }

    this.literal = literal;
    this.octave = octave;
  }

  get alias() {
    return new Note(Note.NOTE_ALIASES[this.literal], this.octave);
  }

  get clone() {
    return new Note(this.literal, this.octave);
  }

  get isFlat() {
    return this.literal.endsWith('b');
  }

  get isNatural() {
    return !this.isFlat && !this.isSharp;
  }

  get isSharp() {
    return this.literal.endsWith('#');
  }

  isEquivalent(otherNote) {
    return (
      this.octave === otherNote.octave &&
      (
        this.literal === otherNote.literal ||
        Note.NOTE_ALIASES[this.literal] === otherNote.literal
      )
    );
  }

  toString() {
    return `${this.literal}/${this.octave}`;
  }

  toFlat() {
    return this.isSharp ? this.alias : this.clone;
  }

  toSharp() {
    return this.isFlat ? this.alias : this.clone;
  }

  /**
   * Returns a new note instance that corresponds to the number of half steps specified.
   * If this.isFlat returns true, a flat note may be returned. Otherwise, may return a sharp
   * note.
   * 
   * @param {number} numHalfSteps 
   * @return {Note}
   */
  step(numHalfSteps = 1) {
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
}

export default Note;
window.Note = Note;