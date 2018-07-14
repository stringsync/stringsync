import { Line, Measure, MeasureElement } from 'models/music';
import { flatMap, get } from 'lodash';

export type VextabElementLinkTypes = Line | Measure | MeasureElement;

export interface IListElement<T> {
  self: T;
  prev: T | void;
  next: T | void; 
}

// The purpose of this class is to compute the next and prev element of
// lines, measures, measure elements, and tickable measure elements in
// O(1) time without polluting the corresponding classes.
export class VextabLinkedList {
  public static link<T extends VextabElementLinkTypes>(objs: T[]): { [id: string]: IListElement<T>} {
    return objs.reduce((list, self, ndx) => {
      const next = objs[ndx + 1];
      const prev = objs[ndx - 1];
      
      list[self.id] = { next, prev, self };

      return list;
    }, {});
  }

  public readonly lines: Line[];
  public readonly measures: Measure[];
  public readonly elements: MeasureElement[];
  public readonly tickables: MeasureElement[];
  
  public readonly linesList:     { [lineId: string]:    IListElement<Line>           };
  public readonly measuresList:  { [measureId: string]: IListElement<Measure>        };
  public readonly elementsList:  { [elementId: string]: IListElement<MeasureElement> };
  public readonly tickablesList: { [elementId: string]: IListElement<MeasureElement> };

  constructor(lines: Line[], measures: Measure[]) {
    this.lines     = lines;
    this.measures  = measures;
    this.elements  = flatMap(this.measures, measure => measure.elements);
    this.tickables = flatMap(this.measures, measure => measure.tickables);

    const { link } = VextabLinkedList;
    this.linesList     = link(this.lines);
    this.measuresList  = link(this.measures);
    this.elementsList  = link(this.elements);
    this.tickablesList = link(this.tickables);
  }

  public next(obj: VextabElementLinkTypes, tickable: boolean = false): VextabElementLinkTypes | void {
    return get(this.get(obj, tickable), 'next');
  }

  public prev(obj: VextabElementLinkTypes, tickable: boolean = false): VextabElementLinkTypes {
    return get(this.get(obj, tickable), 'prev');
  }

  private get(obj: VextabElementLinkTypes, tickable: boolean = false): IListElement<VextabElementLinkTypes> | void {
    switch (obj.type) {
      case 'LINE':
        return this.linesList[obj.id];
      case 'MEASURE':
        return this.measuresList[obj.id];
      default:
        return tickable ? this.tickablesList[obj.id] : this.elementsList[obj.id];
    }
  }
}
