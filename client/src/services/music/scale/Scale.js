import { Note } from 'services';
import { ScaleDegree } from './';

/**
 * The purpose of this class is to transform a key and an array of ScaleDegree instances
 * to a collection of notes.
 */
class Scale {
  static chromatic(key) {
    return new Scale(
      key,
      ScaleDegree.for(['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'])
    );
  }

  static ionian(key) {
    return new Scale(key, ScaleDegree.for(['1', '2', '3', '4', '5', '6', '7']));
  }

  static dorian(key) {
    return new Scale(key, ScaleDegree.for(['1', '2', 'b3', '4', '5', '6', 'b7']));
  }

  static phrygian(key) {
    return new Scale(key, ScaleDegree.for(['1', 'b2', 'b3', '4', '5', 'b6', 'b7']));
  }

  static lydian(key) {
    return new Scale(key, ScaleDegree.for(['1', '2', '3', '#4', '5', '6', '7']));
  }

  static mixolydian(key) {
    return new Scale(key, ScaleDegree.for(['1', '2', '3', '4', '5', '6', 'b7']));
  }

  static aeolian(key) {
    return new Scale(key, ScaleDegree.for(['1', '2', 'b3', '4', '5', 'b6', 'b7']));
  }

  static locrian(key) {
    return new Scale(key, ScaleDegree.for(['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7']));
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
