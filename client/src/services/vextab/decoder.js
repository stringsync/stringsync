import { vextabParser } from './';

class VextabDecoder {
  static get parser() {
    return vextabParser;
  }

  /**
   * Converts a vextabString to vextab instructions.
   *
   * @param {string} vextabString
   */
  static decode(vextabString) {
    return VextabDecoder.parser.parse(vextabString);
  }
};

export default VextabDecoder;
