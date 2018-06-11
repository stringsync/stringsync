class Annotations {
  /**
   * @param {string[]} texts 
   */
  constructor(texts, struct) {
    this.texts = texts;
    this.struct = struct;
    this.type = 'ANNOTATIONS';
  }
}

export default Annotations;
