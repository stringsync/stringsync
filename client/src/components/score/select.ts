import { Vextab, Measure, MeasureElement } from 'models';

/**
 * The purpose of this function is to select a measure or measure element based off of the 
 * measureIndex and elementIndex.
 * 
 * @param {Vextab} vextab 
 * @param {number | null} measureIndex 
 * @param {number | null} elementIndex 
 */
export const select = (vextab: Vextab, measureIndex: number | null, elementIndex: number | null): Measure | MeasureElement | null => {
  let measure: Measure | null = null;
  let element: MeasureElement | null = null;

  if (typeof measureIndex === 'number') {
    measure = vextab.measures[measureIndex] || null;
  }

  if (measure && typeof elementIndex === 'number') {
    element = measure.elements[elementIndex] || null;
  }

  return element || measure;
};
