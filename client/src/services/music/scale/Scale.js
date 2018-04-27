import { Note } from 'services';
import { ScaleDegree, scales } from './';

/**
 * The purpose of this class is to transform a key and an array of ScaleDegree instances
 * to a collection of notes.
 */
class Scale {
  static for(key, scaleName) {
    const degrees = scales[scaleName];

    if (!degrees) {
      throw new Error(`${scaleName} scale was not found`);
    }

    return new Scale(key, ScaleDegree.for(degrees));
  }

  constructor(key, scaleDegrees) {
    if (!Note.ALL_LITERALS_SET.has(key)) {
      throw new Error(`${key} should be in ${Note.ALL_LITERALS.join(', ')}`);
    } else if (!scaleDegrees.every(scaleDegree => scaleDegree instanceof ScaleDegree)) {
      throw new Error('scaleDegrees must all be ScaleDegree instances');
    }

    this.key = key;
    this.scaleDegrees = scaleDegrees;
  }
}

export default Scale;
