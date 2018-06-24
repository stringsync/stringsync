import {
  Measure, Note, TimeSignature, Bar,
  Rhythm, Chord, Rest, VextabStruct,
  Tuplet, Annotations, Key, Vextab
} from 'models';
import { VextabMeasureSpec } from './';

export class VextabMeasureExtractor {
  public static extract(vextab: Vextab, tuning: any) {
    return new VextabMeasureExtractor(vextab, tuning).extract();
  }

  public readonly vextab: Vextab;
  public readonly tuning: any;
  public readonly measures: Measure[];

  private elements: any[];
  private rhythm: Rhythm;
  private bar: Bar | void;
  private measureSpec: VextabMeasureSpec | void;
  private path: string;
  private timeSignature: TimeSignature;

  constructor(vextab: Vextab, tuning: any) {
    this.vextab = vextab;
    this.tuning = tuning;
    this.measures = [];

    // "Current" properties
    this.elements = [];
    this.rhythm = new Rhythm(4, false, null);
    this.bar = undefined;
    this.measureSpec = undefined;
    this.path = '';
  }

  /**
   * Primary interface for the measure extractor.
   * 
   * @returns {Measure[]}
   */
  public extract(): Measure[] {
    this.vextab.structs.forEach((struct, staveNdx) => {

      this.path = `[${staveNdx}]`;
      this.measureSpec = this.extractMeasureSpec(struct);

      struct.notes.forEach((note: any, noteNdx: number) => {
        this.path = `[${staveNdx}].notes[${noteNdx}]`;

        if (noteNdx === 0) {
          this.handleFirstNote(note);
          return;
        }

        this.handleNote(note);

        if (noteNdx === struct.notes.length - 1) {
          this.handleLastNote();
        }
      });
    });

    return this.measures;
  }

  private extractMeasureSpec(struct: Vextab.ParsedStruct): VextabMeasureSpec {
    const params = struct.options.reduce((spec: any, option: any, ndx: number) => {
      const path = this.path + `.options.[${ndx}]`;

      switch (VextabStruct.typeof(option)) {
        case 'KEY':
          const note = new Note(option.value, 0);
          spec.KEY = new Key(note);
          return spec;
        case 'TIME_SIGNATURE':
          const [upper, lower] = option.value.split('/');
          spec.TIME_SIGNATURE = new TimeSignature(upper, lower, new VextabStruct(this.vextab, path));
          return spec;
        default:
          return spec;
      }
    }, {});

    const measurePath = this.path + 'options';
    const measureSpecStruct = new VextabStruct(this.vextab, measurePath);
    return new VextabMeasureSpec(params.KEY, params.TIME_SIGNATURE, measureSpecStruct);
  }

  /**
   * The first note in the notes array should be a bar. Sets the bar instance variable.
   * 
   * @param {VextabStruct} note 
   */
  private handleFirstNote(note: Vextab.Parsed.IBar) {
    if (VextabStruct.typeof(note) !== 'BAR') {
      throw new Error(`expected first note to be a typeof BAR: ${JSON.stringify(note)}`);
    }

    this.bar = new Bar(note.type);
  }

  /**
   * Push whatever is in the instance variables keeping track of the current note properties,
   * then unset them.
   * 
   * @param {VextabStruct} note 
   */
  private handleLastNote(): void {
    this.pushMeasure();
    this.bar = undefined;
    this.rhythm = new Rhythm(4, false, null);
    this.measureSpec = undefined;
    this.elements = [];
    this.path = '';
  }

  /**
   * Takes a note struct and populates the slices, bar, and rhythm instance variables.
   * 
   * @param {VextabStruct} note 
   * @returns {void}
   */
  private handleNote(note: Vextab.ParsedStruct): void {
    switch (VextabStruct.typeof(note)) {
      case 'BAR':
        this.pushMeasure();
        this.bar = new Bar(note.type);
        this.elements = [];
        break;
      case 'TIME':
        this.rhythm = new Rhythm(note.time, note.dot, null);
        this.elements.push(this.rhythm);
        break;
      case 'NOTE':
        this.elements.push(this.extractNote(note));
        break;
      case 'CHORD':
        this.elements.push(this.extractChord(note));
        break;
      case 'REST':
        this.elements.push(
          new Rest(note.params.position, this.rhythm.clone())
        );
        break;
      case 'TUPLET':
        this.elements.push(
          new Tuplet(parseInt(note.params.tuplet, 10))
        );
        break;
      case 'ANNOTATIONS':
        this.elements.push(
          new Annotations(note.params)
        )
        break;
      default:
        break;
    }
  }

  /**
   * Creates a measure and pushes it into the measures instance variable
   * 
   * @returns {void}
   */
  private pushMeasure(): void {
    this.measures.push(
      new Measure(this.timeSignature, this.elements, this.bar as Bar, this.measureSpec)
    );
  }

  /**
   * Creates a Note object from a struct
   * 
   * @param {VextabStruct} struct 
   * @returns {Note}
   */
  private extractNote(struct: Vextab.Parsed.IPosition) {
    const [literal, octave] = this.tuning.getNoteForFret(struct.fret, struct.string).split('/');
    return new Note(literal, parseInt(octave, 10));
  }

  /**
   * Creates a Chord object from a struct
   * 
   * @param {VextabStruct} struct 
   * @returns {Chord}
   */
  private extractChord(struct: Vextab.Parsed.IChord) {
    const notes = struct.chord.map(note => this.extractNote(note));
    return new Chord(notes);
  }
}
