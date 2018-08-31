import { get, last } from 'lodash';
import {
  Vextab, VextabElement,
  Measure, Line, Note, Bar,
  Rest, Rhythm, Key, TimeSignature
} from 'models';

/**
 * The purpose of this class is to provide an interface for editing a vextab.
 */
export class Editor {
  public static getDefaultNote(): Note {
    return new Note('C', 4, { positions: [{ str: 2, fret: 1 }] });
  }

  public static getDefaultRest(): Rest {
    const rhythm = new Rhythm('4', false);
    return new Rest(0, rhythm);
  }

  public static getDefaultBar(): Bar {
    const note = Editor.getDefaultNote();
    const key = new Key(note);
    const timeSignature = new TimeSignature(4, 4);
    return new Bar('single', key, timeSignature);
  }

  public static getDefaultMeasure(bar: Bar): Measure {
    const nextBar = bar.clone();
    const rest = Editor.getDefaultRest();
    return new Measure(nextBar, [rest]);
  }

  public readonly vextab: Vextab;
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

  public addElement(element: VextabElement): VextabElement {
    // TODO
    return element;
  }

  public removeElement(): VextabElement | null {
    return null;
  }

  public addMeasure(measure: Measure) {
    // find or create the line
    let line = this.line || last(this.vextab.lines);

    if (!line) {
      line = new Line([]);
      this.addLine(line);
    }

    // find the index for which to insert the measure at
    const probeMeasure = this.measure;
    const measureNdx = probeMeasure ? line.measures.indexOf(probeMeasure) : -1;

    // insert the measure
    line.measures.splice(measureNdx, 0, measure);

    // focus the first element of the measure, if any
    const firstMeasureElement = measure.elements[0];

    if (firstMeasureElement) {
      this.elementIndex = this.vextab.elements.indexOf(firstMeasureElement);
    }
  }

  public removeMeasure() {
    const { measure } = this;

    if (!measure) {
      throw new Error('no measure selected');
    }

    const { line } = measure;

    if (!line) {
      throw new Error('selected measure does not belong to a line');
    }

    line.measures = line.measures.filter(lineMeasure => lineMeasure !== measure);
  }

  public addLine(line: Line): Line {
    this.vextab.lines.push(line);
    return line;
  }

  public removeLine(): Line | null {
    const { line } = this;

    if (line) {
      this.vextab.lines = this.vextab.lines.filter(vextabLine => vextabLine !== line);
    }

    return line;
  }
}