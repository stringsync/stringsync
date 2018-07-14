import { Line, Measure, MeasureElement } from 'models/music';
import { flatMap } from 'lodash';

export type VextabElementLinkTypes = Line | Measure | MeasureElement;

export interface IList<T> {
  self: T;
  prev: T | null;
  next: T | null; 
}

// The purpose of this class is to compute the next and prev element of
// lines, measures, measure elements, and tickable measure elements in
// O(1) time without polluting the corresponding classes.
export class VextabLinkedList {
  public readonly lines: Line[];
  public readonly measures: Measure[];
  public readonly elements: MeasureElement[];
  public readonly tickables: MeasureElement[];
  
  public readonly linesList:     { [lineId: string]:    IList<Line>           };
  public readonly measuresList:  { [measureId: string]: IList<Measure>        };
  public readonly elementsList:  { [elementId: string]: IList<MeasureElement> };
  public readonly tickablesList: { [elementId: string]: IList<MeasureElement> };

  constructor(lines: Line[], measures: Measure[]) {
    this.lines = lines;
    this.measures = measures;
    this.elements = flatMap(this.measures, measure => measure.elements);
    this.tickables = flatMap(this.measures, measure => measure.tickables);
  }

  public next(obj: VextabElementLinkTypes, tickable?: boolean = false): VextabElementLinkTypes {
    
  }

  public prev(obj: VextabElementLinkTypes, tickable?: boolean = false): VextabElementLinkTypes {

  }
}
