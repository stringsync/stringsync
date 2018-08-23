import {
  Measure, Note, TimeSignature, Bar,
  Rhythm, Chord, Rest, VextabStruct,
  Tuplet, Annotations, Vextab, Key,
  MeasureElement
} from 'models';
import { VextabMeasureSpec } from './';
import { get, last, takeRight, compact } from 'lodash';

/**
 * This class is responsible for creating StringSync data structures from Vextab
 * structs. It does *not* link Vexflow data structures to the StringSync data structures.
 * See the hydrate instance method on the StringSync data structures.
 */
export class StringSyncFactory {
  public static extract(vextab: Vextab, tuning: any) {
    return new StringSyncFactory(vextab, tuning).extract();
  }

  public readonly vextab: Vextab;
  public readonly tuning: any;
  public readonly measures: Measure[];

  private elements: MeasureElement[];
  private rhythm: Rhythm;
  private bar: Bar | void;
  private measureSpec: VextabMeasureSpec | void;

  constructor(vextab: Vextab, tuning: any) {
    this.vextab = vextab;
    this.tuning = tuning;
    this.measures = [];

    // "Current" properties
    this.elements = [];
    this.rhythm = new Rhythm('4', false);
    this.bar = undefined;
    this.measureSpec = undefined;
  }

  /**
   * Primary interface for the measure extractor.
   * 
   * @returns {Measure[]}
   */
  public extract(): Measure[] {
    this.vextab.rawStructs.forEach((struct, staveNdx) => {
      this.measureSpec = this.extractMeasureSpec(struct);

      struct.notes.forEach((note: any, noteNdx: number) => {

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
      switch (VextabStruct.typeof(option)) {
        case 'KEY':
          const note = new Note(option.value, 0);
          spec.KEY = new Key(note);
          return spec;
        case 'TIME_SIGNATURE':
          const [upper, lower] = option.value.split('/');
          spec.TIME_SIGNATURE = new TimeSignature(upper, lower);
          return spec;
        default:
          return spec;
      }
    }, {});

    return new VextabMeasureSpec(params.KEY, params.TIME_SIGNATURE);
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
    
    this.bar = new Bar(note.type.toLowerCase() as Vextab.Parsed.IBarTypes);
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
    this.rhythm = new Rhythm('4', false);
    this.measureSpec = undefined;
    this.elements = [];
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
        this.rhythm = new Rhythm(note.time, note.dot);
        break;
      case 'NOTE':
        this.elements.push(this.extractNote(note));
        break;
      case 'CHORD':
        this.elements.push(this.extractChord(note));
        break;
      case 'REST':
        this.elements.push(new Rest(note.params.position, this.rhythm));
        break;
      case 'TUPLET':
        this.applyTuplet(parseInt(note.params.tuplet, 10));
        break;
      case 'ANNOTATIONS':
        const lastElement = last(this.elements) || this.bar;
        
        if (!lastElement) {
          throw new Error('expected an element to associate the annotation with');
        }

        lastElement.annotations.push(new Annotations(note.params));
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
    if (typeof this.measureSpec === 'undefined') {
      throw new Error('expected measureSpec not to be undefined')
    }
    
    if (!this.bar) {
      throw new Error('expected bar to be defined to push measure');
    }

    this.measures.push(
      new Measure([this.bar, ...this.elements], this.measures.length + 1,  this.measureSpec)
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
    const position = { fret: parseInt(struct.fret, 10), str: parseInt(struct.string, 10) }
    const note = new Note(literal, parseInt(octave, 10), [position]);
    
    note.articulation = struct.articulation;
    note.decorator = struct.decorator;

    note.rhythm = this.rhythm.clone();

    return note;
  }

  /**
   * Creates a Chord object from a struct
   * 
   * @param {VextabStruct} struct 
   * @returns {Chord}
   */
  private extractChord(struct: Vextab.Parsed.IChord) {
    const notes = struct.chord.map(note => this.extractNote(note));
    const chord = new Chord(notes);

    chord.articulation = struct.articulation;
    chord.decorator = struct.decorator;

    chord.rhythm = this.rhythm.clone();

    return chord;
  }

  /**
   * Since tuplets are specified after the notes they are connected to, we look at the
   * last n elements (n = tuplet's value) and attach the tuplet to each element's
   * rhythm.
   * 
   * @param value 
   */
  private applyTuplet(value: number) {
    const rhythms = takeRight(
      compact(this.elements.map(element => get(element, 'rhythm'))), value
    ) as Rhythm[];

    if (rhythms.length !== value) {
      throw new Error(`expected ${value} rhythms with rhythms, got ${rhythms.length}`);
    }

    rhythms.forEach(rhythm => rhythm.tuplet = new Tuplet(value));
  }
}
