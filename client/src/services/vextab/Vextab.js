import { vextabDecoder as VextabDecoder, VextabEncoder } from './';

class Vextab {
  static decode(vextabString) {
    return VextabDecoder.parse(vextabString);
  }

  static encode(vextabStructs) {
    return VextabEncoder.encode(vextabStructs);
  }
}

export default Vextab;
