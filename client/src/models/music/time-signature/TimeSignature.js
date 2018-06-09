class TimeSignature {
  constructor(upper, lower) {
    this.upper = upper;
    this.lower = lower;
    this.type = 'TIME_SIGNATURE';
  }

  /**
   * @return {string}
   */
  toString() {
    return `${this.upper}/${this.lower}`;
  }
}

export default TimeSignature;
