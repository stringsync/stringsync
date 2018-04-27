import { Note } from 'services';
import { ScaleDegree, scales } from './';
import { sortBy } from 'lodash';

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

  constructor(key, degreeLiterals) {
    if (!Note.ALL_LITERALS_SET.has(key)) {
      throw new Error(`${key} should be in ${Note.ALL_LITERALS.join(', ')}`);
    }

    this.key = key;
    this.degrees = sortBy(degreeLiterals.map(literal => new ScaleDegree(literal, this)), ['value']);
  }
}

export default Scale;
