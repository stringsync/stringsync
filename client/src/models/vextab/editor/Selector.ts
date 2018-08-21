import { Vextab, Measure, MeasureElement } from 'models';

/**
 * The purpose of the Selector is to maintain a position within a Vextab.
 */
export class Selector {
  public vextab: Vextab;

  public measureNdx: number | null;
  public elementNdx: number | null;

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  /**
   * Returns the selected element or measure. If the elementNdx is null and the
   * measureNdx is not null, then this method will return a Measure. If the 
   * elementNdx and measureNdx are not null, then this method will return a
   * MeasureElement. If the elementNdx and measureNdx are both null, this
   * method will return null.
   */
  public get selected(): Measure | MeasureElement | null {
    let measure: Measure | null = null;
    let element: MeasureElement | null = null;

    if (typeof this.measureNdx === 'number') {
      measure = this.vextab.measures[this.measureNdx] || null;
    }

    if (measure && typeof this.elementNdx === 'number') {
      element = measure.elements[this.elementNdx] || null;
    }

    return element || measure;
  }
}
