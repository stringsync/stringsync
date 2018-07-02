import { VextabStruct } from 'models/vextab';

/**
 * Extending this class indicates that the child class has properties related to Vexflow\
 * and Vextab.
 */
export abstract class AbstractVexWrapper {
  public struct: VextabStruct | null;

  protected vexAttrs: any;

  constructor(struct: VextabStruct | null) {
    this.struct = struct;
  }

  /**
   * This function is called after the VextabGenerator creates Vexflow (not Vextab) elements.
   * Using any number of arbitrary arguments, it must set the vexAttrs variable.
   */
  public abstract hydrate(...args: any[]): void;

  public get isHydrated(): boolean {
    return typeof this.vexAttrs !== 'undefined' && this.vexAttrs !== null;
  }

  public get isHydratable(): boolean {
    return this.struct instanceof VextabStruct;
  }
}