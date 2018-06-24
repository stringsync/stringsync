import { hash } from 'utilities';
import { Key, TimeSignature, VextabStruct } from 'models';

/**
 * Used for clustering measures.
 */
export class VextabMeasureSpec {
  public key: Key;
  public timeSignature: TimeSignature;
  public struct: VextabStruct;
  public clef = 'none';
  public notation = true;
  public readonly id: number;

  constructor(key: Key, timeSignature: TimeSignature, struct: VextabStruct) {
    this.key = key;
    this.timeSignature = timeSignature;
    this.struct = struct;

    this.id = hash(
      `${this.clef}${this.notation}${this.key.toString()}${this.timeSignature.toString()}`
    )
  }
}
