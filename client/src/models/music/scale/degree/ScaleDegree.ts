import * as constants from './scaleDegreeConstants';
import { Scale, Note } from 'models/music';

export class ScaleDegree {
  /**
   * Returns an array of all the possible Note literals
   * 
   * @returns {constants.LITERALS}
   */
  static get LITERALS() {
    return constants.LITERALS;
  }

  /**
   * Returns a set of the possible Note literals
   * 
   * @returns {constants.LITERALS_SET}
   */
  static get LITERALS_SET() {
    return constants.LITERALS_SET;
  };

  /**
   * Returns an array of the possible modifiers
   * 
   * @returns {constants.MODIFIERS}
   */
  static get MODIFIERS() {
    return constants.MODIFIERS;
  }

  /**
   * Returns a mapping of literals to values
   * 
   * @returns {constants.VALUES_BY_LITERAL}
   */
  static get VALUES_BY_LITERAL() {
    return constants.VALUES_BY_LITERAL;
  }

  public readonly literal: string;
  public readonly scale: Scale;

  constructor(literal: string, scale: Scale) {
    if (!ScaleDegree.LITERALS_SET.has(literal)) {
      throw new Error(`${literal} should be in ${ScaleDegree.LITERALS.join(', ')}`);
    }

    this.literal = literal;
  }

  /**
   * Returns the key of the scale AKA the root note.
   *
   * @returns {Note}
   */
  public get key(): Note {
    return this.scale.key;
  }

  /**
   * Looks up the number value from the VALUES_BY_LITERAL. Used to compare scale degrees.
   * 
   * @returns {number}
   */
  public get value(): number {
    return ScaleDegree.VALUES_BY_LITERAL[this.literal];
  }

  /**
   * If the literal is prefixed with a modifier in ScaleDegree.MODIFIERS, then it is returned here.
   * Otherwise, return an empty string.
   * 
   * @returns {string}
   */
  public get modifier(): string {
    const char = this.literal[0];
    return ScaleDegree.MODIFIERS.includes(char) ? char : '';
  }

  /**
   * Equivalency for ScaleDegrees means that they belong to the same key and have the same value.
   * 
   * @param {ScaleDegree} other 
   * @returns {boolean}
   */
  public isEquivalent(other: ScaleDegree): boolean {
    return this.key.isEquivalent(other.key) && this.value === other.value;
  }

  /**
   * Returns the number of half steps from the other scale degree in the same octave.
   * 
   * @param {ScaleDegree} other
   * @returns {number}
   */
  public distance(other: ScaleDegree): number {
    return other.value - this.value;
  }
}
