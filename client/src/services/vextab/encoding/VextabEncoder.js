class VextabEncoder {
  static encode(vextabStructs) {
    return new VextabEncoder(vextabStructs).toString();
  }

  constructor(structs) {
    this.structs = structs;
  }

  /**
   * Encodes the vextab structs into a vextab string.
   * 
   * @return {string}
   */
  toString() {
    this.structs.map(struct => {
      console.log(struct);
    });
  }
}

export default VextabEncoder;
