import { VextabStruct } from 'models/vextab';

export class Tuplet {
  public readonly value: number;
  public readonly type = 'TUPLET';

  constructor(value: number) {
    this.value = value;
  }
}
