import { Vextab } from 'models';

/**
 * The purpose of this class is to provide an interface for editing a vextab.
 */
export class Editor {
  public readonly vextab: Vextab;

  // Gets passed into lodash.at https://lodash.com/docs/4.17.10#at to find
  // the target element.
  public path: string | null = null;

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  public get vextabString(): string {
    return this.vextab.toString();
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