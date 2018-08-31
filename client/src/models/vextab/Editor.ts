import { Vextab, VextabElement, Measure, Line } from 'models';
import { at, get } from 'lodash';

/**
 * The purpose of this class is to provide an interface for editing a vextab.
 */
export class Editor {
  public readonly vextab: Vextab;

  // Gets passed into lodash.at https://lodash.com/docs/4.17.10#at to find
  // the target element.
  public elementIndex: number | null;

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  public get vextabString(): string {
    return this.vextab.toString();
  }

  public get element(): VextabElement | null {
    const index = this.elementIndex;
    return typeof index === 'number' ? this.vextab.elements[index] as any : null || null;
  }

  public get measure(): Measure | null {
    return get(this.element, 'measure', null) as Measure | null;
  }

  public get line(): Line | null {
    return get(this.measure, 'line', null) as Line | null;
  }

  public addElement(element: Measure | VextabElement) {
    if (element instanceof Measure && this.line) {
      this.line.measures.push(element);
    }
  }

  public removeElement() {
    // TODO
  }

  public addMeasure() {
    // TODO
  }

  public removeMeasure() {
    // TODO
  }
}