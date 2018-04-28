import { Note } from 'services';
import { ScaleDegree, scales } from './';

/**
 * The purpose of this class is to transform a key and an array of ScaleDegree instances
 * to a collection of notes.
 */
class Scale {
  /**
   * Fetches the degreeLiterals from './scales.js', then constructs a scale using those
   * literals.
   *
   * @param {string} key
   * @param {keyof scales} scaleName
   */
  static for(key, scaleName) {
    const degreeLiterals = scales[scaleName];

    if (!degreeLiterals) {
      throw new Error(`${scaleName} scale was not found`);
    }

    return new Scale(key, degreeLiterals);
  }

  /**
   * @param {string} key
   * @param {string} degreeLiterals
   */
  constructor(key, degreeLiterals) {
    if (!Note.ALL_LITERALS_SET.has(key)) {
      throw new Error(`${key} should be in ${Note.ALL_LITERALS.join(', ')}`);
    }

    this.key = new Note(key, 4);
    this.degrees = degreeLiterals.map(literal => new ScaleDegree(literal, this));
  }

  /**
   * The primary purpose of the Scale service.
   * Returns an array of note objects that correspond to the key, degrees, and octaves.
   * The notes will be in the same order as the degrees.
   * 
   * @param {Array<number>}
   * @return {Note[]}
   */
  notes(octaves = [4]) {
    const root = new ScaleDegree('1', this);
    const notes = [];

    // Used for the break condition in the while loop to construct the return value.
    const targetOctaves = octaves.sort();

    while (targetOctaves.length > 0) {
      const octave = targetOctaves.shift();
      
    }

    return this.degrees.map(degree => {
      const numHalfSteps = root.distance(degree);
      return this.key.step(numHalfSteps);
    });
  }
}

export default Scale;
