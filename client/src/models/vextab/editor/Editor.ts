import { get, last } from 'lodash';
import {
  Vextab, VextabElement,
  Measure, Line, Note, Bar,
  Rest, Rhythm, Key, TimeSignature,
  Annotations, Chord
} from 'models';

/**
 * The purpose of this class is to provide an interface for editing a vextab. It mainly knows
 * how to add and remove Lines, Measures, and Elements. It proxies the subrenderers to edit
 * the elements on a more grannular level.
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
    let measure = this.measure;

    if (!measure) {
      const bar = Editor.getDefaultBar();
      measure = this.addMeasure(Editor.getDefaultMeasure(bar));
    }

    if (typeof this.elementIndex !== 'number') {
      this.elementIndex = 0;
    }

    this.elementIndex++;

    measure.elements.splice(this.elementIndex, 0, element);

    return element;
  }

  public removeElement(): VextabElement | void {
    const { measure } = this;

    if (!measure) {
      return;
    }

    const { element } = this;

    if (!element) {
      return;
    }

    if (measure.elements.length === 1) {
      this.removeMeasure();
    } else {
      measure.elements = measure.elements.filter(measureElement => measureElement !== element);

      if (typeof this.elementIndex === 'number') {
        this.elementIndex--;
      }
    }

    return element;
  }

  public addMeasure(measure: Measure): Measure {
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
    line.measures.splice(measureNdx + 1, 0, measure);

    // focus the first element of the measure, if any
    const firstMeasureElement = measure.elements[0];

    if (firstMeasureElement) {
      this.elementIndex = this.vextab.elements.indexOf(firstMeasureElement);
    }

    return measure;
  }

  public removeMeasure(): Measure | void {
    const { measure } = this;

    if (!measure) {
      return;
    }

    const { line } = measure;

    if (!line) {
      return;
    }

    // compute the previous measure, and focus its last element
    const prevMeasure = measure.prev;
    const focusElement = last(get(prevMeasure, 'elements', []));
    const nextElementIndex = focusElement ? this.vextab.elements.indexOf(focusElement) : -1;

    line.measures = line.measures.filter(lineMeasure => lineMeasure !== measure);

    this.elementIndex = nextElementIndex;

    return measure;
  }

  public addLine(line: Line): Line {
    this.vextab.lines.push(line);
    return line;
  }

  public removeLine(): Line | void {
    const { line } = this;

    if (!line) {
      return;
    }

    this.vextab.lines = this.vextab.lines.filter(vextabLine => vextabLine !== line);

    return line;
  }

  // grannular editing

  public addAnnotation(texts: string[]): Annotations {
    let element = this.element;

    if (!element) {
      element = Editor.getDefaultRest();
      this.addElement(element);
    }

    const annotations = new Annotations(texts);

    element.annotations.push(annotations);

    return annotations;
  }

  public removeAnnotation(annotationsIndex: number): Annotations | void {
    const { element } = this;

    if (!element) {
      return;
    }

    const annotation = element.annotations[annotationsIndex];

    element.annotations.splice(annotationsIndex, 1);

    return annotation;
  }

  public updateBarKind(kind: Vextab.Parsed.IBarTypes): Vextab.Parsed.IBarTypes {
    const { measure } = this;

    if (!measure) {
      throw new Error('no measure selected');
    }

    measure.bar.kind = kind;

    return kind;
  }

  public updateMeasureKey(noteLiteral: string): Key {
    const { measure } = this;

    if (!measure) {
      throw new Error('no measure selected');
    }

    const note = new Note(noteLiteral, 0);
    const key = new Key(note);
    measure.bar.key = key;

    return key;
  }

  public updateTimeSignature(upper: number, lower: number): TimeSignature {
    const { measure } = this;

    if (!measure) {
      throw new Error('no measure selected');
    }

    const timeSignature = new TimeSignature(upper, lower);
    measure.bar.timeSignature = timeSignature;

    return timeSignature;
  }

  public addNotePosition(position: Guitar.IPosition): Guitar.IPosition {
    const { element } = this;

    if (!(element instanceof Note) && !(element instanceof Chord)) {
      throw new Error('can only update the position of a note or chord');
    }

    const positions = element.positions.filter(pos => pos.str !== position.str);
    positions.push(position);

    this.updateNotePositions(positions, element);

    return position;
  }

  public removeNotePosition(guitarStr: number): number {
    const { element } = this;

    if (!(element instanceof Note) && !(element instanceof Chord)) {
      throw new Error('can only update the position of a note or chord');
    }

    const positions = element.positions.filter(pos => pos.str !== guitarStr);

    this.updateNotePositions(positions, element);

    return guitarStr;
  }

  public updateNotePositions(positions: Guitar.IPosition[], srcElement: Note | Chord): Guitar.IPosition[] {
    // compute notes from the positions and srcElement arguments
    const notes = positions.map(({ fret, str}) => {
      const noteStr = this.vextab.tuning.getNoteForFret(fret.toString(), str.toString());
      const noteOpts = {
        articlation: srcElement.articulation,
        decorator: srcElement.decorator,
        positions: [{ fret, str }],
        rhythm: srcElement.rhythm.clone()
      };
      
      return Note.from(noteStr, noteOpts);
    });

    // create a note or chord based on the length of the computed notes
    let nextElement: Note | Chord;
    if (notes.length > 1) {
      const chordOpts = { 
        articulation: notes[0].articulation, 
        decorator: notes[0].decorator, 
        rhythm: notes[0].rhythm.clone()
      };
      nextElement = new Chord(notes, chordOpts)
    } else if (notes.length === 1) {
      nextElement = notes[0];
    } else {
      throw new Error('notes were not generated from the position');
    }

    // apply the changes to the vextab
    this.removeElement();
    this.addElement(nextElement);

    return positions;
  }

  public updateRhythmDot(dot: boolean): Rhythm {
    const { element } = this;

    if (!element) {
      throw new Error('no element selected');
    }

    element.rhythm = element.rhythm.clone();
    element.rhythm.dot = dot;

    return element.rhythm;
  }

  public updateRhythmValue(value: string): Rhythm {
    const { element } = this;

    if (!element) {
      throw new Error('no element selected');
    }

    element.rhythm = element.rhythm.clone();
    element.rhythm.value = value;

    return element.rhythm;
  }
}