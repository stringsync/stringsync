import { VextabStruct } from 'models';

class TimeSignature {
  /**
   * @param {number | string} upper 
   * @param {number | string} lower 
   * @param {VextabStruct} struct 
   */
  constructor(upper, lower, struct) {
    this.upper = parseInt(upper, 10);
    this.lower = parseInt(lower, 10);
    this.struct = struct;
    this.type = 'TIME_SIGNATURE';
  }

  /**
   * @returns {string}
   */
  toString() {
    return `${this.upper}/${this.lower}`;
  }
}

export default TimeSignature;
