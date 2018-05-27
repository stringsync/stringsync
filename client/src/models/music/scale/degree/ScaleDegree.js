import * as constants from './scaleDegreeConstants';

class ScaleDegree {
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

  /**
   * @param {string} literal 
   * @param {Scale} scale 
   */
  constructor(literal, scale) {
    if (!ScaleDegree.LITERALS_SET.has(literal)) {
      throw new Error(`${literal} should be in ${ScaleDegree.LITERALS.join(', ')}`);
    }

    this.literal = literal;
    Object.defineProperty(this, 'scale', { value: scale, configurable: false, writable: false });
  }

  /**
   * Returns the key of the scale AKA the root note.
   *
   * @return {string}
   */
  get key() {
    return this.scale.key;
  }

  /**
   * Looks up the number value from the VALUES_BY_LITERAL. Used to compare scale degrees.
   * 
   * @return {number}
   */
  get value() {
    return ScaleDegree.VALUES_BY_LITERAL[this.literal];
  }

  /**
   * If the literal is prefixed with a modifier in ScaleDegree.MODIFIERS, then it is returned here.
   * Otherwise, return an empty string.
   * 
   * @return {string}
   */
  get modifier() {
    const char = this.literal[0];
    return ScaleDegree.MODIFIERS.includes(char) ? char : '';
  }

  /**
   * Equivalency for ScaleDegrees means that they belong to the same key and have the same value.
   * 
   * @param {ScaleDegree} other 
   */
  isEquivalent(other) {
    return this.key.isEquivalent(other.key) && this.value === other.value;
  }

  /**
   * Returns the number of half steps from the other scale degree in the same octave.
   * 
   * @param {ScaleDegree} other 
   */
  distance(other) {
    return other.value - this.value;
  }
}

export default ScaleDegree;
