class VextabEncodingError extends Error {}

const error = struct => {
  new VextabEncodingError(`could not handle struct: ${JSON.stringify(struct)}`)
}

// Performs the reverse operation of the VextabDecoder. That is, from an array of VextabStructs,
// encode them into a 
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
      switch(struct.element) {
        case 'tabstave':
          return this._encodeTabstave(struct);
        default:
          throw error(struct);
      }
    });
  }

  /**
   * Encodes a tabstave. A tabstave is identified by a vextabStruct having a property called
   * element, and that property value is equal to 'tabstave'.
   * 
   * @param {VextabStruct} tabstave
   * @return {string[]}
   * @private
   */
  _encodeTabstave(tabstave) {
    return [
      'tabstave',
      this._encodeOptions(tabstave.options),
      this._encodeNotes(tabstave.notes),
      this._encodeText(tabstave.text)
    ]
  }

  /**
   * Encodes a tabstave's options. Options are identified by being the options key-value pair
   * in a tabstave struct. See VextabEncoder.prototype._encodeTabstave.
   * 
   * @param {VextabStruct} options 
   * @return {string[]}
   * @private
   */
  _encodeOptions(options) {
    return options.map(option => `${option.key}=${option.value}`);
  }

  /**
   * Encodes a tabstave's notes. Notes are identified by being the notes key-value pair in a
   * tabstave struct. See VextabEncoder.prototype._encodeTabstave.
   * 
   * @param {VextabStruct} notes 
   * @return {string[]}
   * @private
   */
  _encodeNotes(notes) {

  }

  /**
   * 
   * @param {VextabStruct} text
   * @return {string[]}
   */
  _encodeText(text) {

  }
}

export default VextabEncoder;
