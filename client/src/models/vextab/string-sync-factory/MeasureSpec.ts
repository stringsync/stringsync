import { hash } from 'utilities';
import { Key, TimeSignature } from 'models';

/**
 * Used for clustering measures.
 */
export class VextabMeasureSpec {
  public key: Key;
  public timeSignature: TimeSignature;
  public clef = 'none';
  public notation = true;

  // TODO: Add types for the struct member
  constructor(key: Key, timeSignature: TimeSignature) {
    this.key = key;
    this.timeSignature = timeSignature;
  }

  public get id() {
    return hash(
      `${this.clef}${this.notation}${this.key.note.literal}${this.timeSignature.toString()}`
    )
  }

  public get struct() {
    return [
      { key: 'clef',     value: 'none' },
      { key: 'notation', value: 'true' },
      { key: 'key',      value: this.key.note.literal },
      { key: 'time',     value: this.timeSignature.toString() }
    ]
  }

  public clone(): VextabMeasureSpec {
    return new VextabMeasureSpec(this.key.clone(), this.timeSignature.clone());
  }
}
