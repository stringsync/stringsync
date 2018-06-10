import { hash } from 'utilities';

class VextabMeasureSpec {
  constructor(key, timeSignature, struct) {
    this.clef = 'none';
    this.notation = true;
    this.key = key;
    this.timeSignature = timeSignature;
    this.struct = struct;
    
    this.id = hash(
      `${this.clef}${this.notation}${this.key.toString()}${this.timeSignature.toString()}`
    )
  }
}

export default VextabMeasureSpec;
