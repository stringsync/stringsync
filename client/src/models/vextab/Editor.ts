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

  public addMeasure(measure: Measure) {
    // add the measure
    let line = this.line;

    if (!line) {
      line = new Line([]);
      this.vextab.lines.push(line);
    }

    line.measures.push(measure);

    // focus the first element of the measure, if any
    const firstMeasureElement = measure.elements[0];

    if (firstMeasureElement) {
      this.elementIndex = this.vextab.elements.indexOf(firstMeasureElement);
    }
  }

  public removeMeasure() {
    const { measure } = this;

    if (!measure) {
      return;
    }

    const { line } = measure;

    if (!line) {
      return;
    }

    line.measures.filter(lineMeasure => lineMeasure !== measure);
  }

  public addElement(element: VextabElement) {
    // TODO
  }

  public removeElement() {
    // TODO
  }
}