const LITERALS = Object.freeze([
  '1', '#1', 'b2', '2', '#2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', '#6', 'b7', '7'
]);
const LITERALS_SET = Object.freeze(new Set(LITERALS));
const MODIFIERS = Object.freeze(['b' , '#']);

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

  static for(degreeLiterals) {
    return degreeLiterals.map(literal => new ScaleDegree(literal));
  }

  constructor(literal) {
    if (!ScaleDegree.LITERALS_SET.has(literal)) {
      throw new Error( `${literal} should be in ${ScaleDegree.LITERALS.join(', ')}`);
    }

    this.literal = literal;
  }

  modifier() {
    const firstChar = this.literal[0];
    return ScaleDegree.MODIFIERS.includes(firstChar) ? firstChr : '';
  }
}

export default ScaleDegree;
