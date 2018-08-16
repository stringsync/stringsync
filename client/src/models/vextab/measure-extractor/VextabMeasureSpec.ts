import { hash } from 'utilities';
import { Key, TimeSignature } from 'models';

/**
 * Used for clustering measures.
 */
export class VextabMeasureSpec {
  public key: Key;
  public timeSignature: TimeSignature;
  public struct: any;
  public clef = 'none';
  public notation = true;
  public readonly id: number;

  // TODO: Add types for the struct member
  constructor(key: Key, timeSignature: TimeSignature, struct: any) {
    this.key = key;
    this.timeSignature = timeSignature;
    this.struct = struct;

    this.id = hash(
      `${this.clef}${this.notation}${this.key.toString()}${this.timeSignature.toString()}`
    )
  }
}
