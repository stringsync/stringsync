import { Vextab } from "models";

/**
 * The purpose of this class is to provide an interface for editing a vextab.
 */
export class VextabEditor {
  public readonly vextab: Vextab;

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }
}