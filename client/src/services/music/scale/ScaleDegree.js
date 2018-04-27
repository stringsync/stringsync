import { Scale } from ".";

const LITERALS = Object.freeze([
  '1', '#1', 'b2', '2', '#2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', '#6', 'b7', '7'
]);
const LITERALS_SET = Object.freeze(new Set(LITERALS));
const MODIFIERS = Object.freeze(['b' , '#']);
const VALUES_BY_LITERAL = Object.freeze({
  '1': 0,
  '#1': 1,
  'b2': 1,
  '2': 2,
  '#2': 3,
  'b3': 3,
  '3': 4,
  '4': 5,
  '#4': 6,
  'b5': 6,
  '5': 7,
  '#5': 8,
  'b6': 8,
  '6': 9,
  '#6': 10,
  'b7': 10,
  '7': 11
});

class ScaleDegree {
  static get LITERALS() {
    return LITERALS;
  }

  static get LITERALS_SET() {
    return LITERALS_SET;
  };

  static get MODIFIERS() {
    return MODIFIERS;
  }

  static get VALUES_BY_LITERAL() {
    return VALUES_BY_LITERAL;
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

  isEquivalent(other) {
    return this.key === other.key && this.value === other.value;
  }

  modifier() {
    const char = this.literal[0];
    return ScaleDegree.MODIFIERS.includes(char) ? char : '';
  }

  distance(otherScaleDegree) {
    return otherScaleDegree.value - this.value;
  }
}

export default ScaleDegree;
