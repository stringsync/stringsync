import { Vextab } from 'models';

/**
 * The purpose of this class is to provide an interface for editing a vextab.
 */
export class Editor {
  public readonly vextab: Vextab;

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  public addElement(element: any, index: number) {
    // TODO
  }

  public removeElement(index: number) {
    // TODO
  }

  public addMeasure(index: number) {
    // TODO
  }

  public removeMeasure(index: number) {
    // TODO
  }
}