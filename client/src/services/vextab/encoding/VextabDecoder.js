import { parser as vextabParser } from './parser';

class VextabDecoder {
  /**
   * Converts a vextabString to vextab instructions.
   *
   * @param {string} vextabString
   */
  static decode(vextabString) {
    return vextabParser.parse(vextabString);
  }
};

export default VextabDecoder;
