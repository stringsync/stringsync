import {
  Measure, Note, TimeSignature, Bar,
  Rhythm, Chord, Rest, VextabStruct,
  Tuplet, Annotations, Key
} from 'models';
import { VextabMeasureSpec } from './';

class VextabMeasureExtractor {
  static extract(vextab, tuning) {
    return new VextabMeasureExtractor(vextab, tuning).extract();
  }
  
  constructor(vextab, tuning) {
    this.vextab = vextab;
    this.tuning = tuning;
    this.measures = [];

    // "Current" properties
    this.slices = [];
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
  extract() {
    this.vextab.structs.forEach((struct, staveNdx) => {

      this.path = `[${staveNdx}]`;
      this.measureSpec = this._extractMeasureSpec(struct);

      struct.notes.forEach((note, noteNdx) => {
        this.path = `[${staveNdx}].notes[${noteNdx}]`;

        if (noteNdx === 0) {
          this._handleFirstNote(note);
          return;
        }

        this._handleNote(note);        

        if (noteNdx === struct.notes.length - 1) {
          this._handleLastNote();
        }
      });
    });

    return this.measures;
  }

  /**
   * 
   * @param {VextabStruct} struct 
   * @returns {VextabMeasureSpec}
   */
  _extractMeasureSpec(struct) {
    const params = struct.options.reduce((spec, option, ndx) => {
      const path = this.path + `.options.[${ndx}]`;

      switch (VextabStruct.typeof(option)) {
        case 'KEY':
          const note = new Note(option.value, 0);
          spec['KEY'] = new Key(note, new VextabStruct(this.vextab, path));
          return spec;
        case 'TIME_SIGNATURE':
          const [upper, lower] = option.value.split('/');
          spec['TIME_SIGNATURE'] = new TimeSignature(upper, lower, new VextabStruct(this.vextab, path));
          return spec;
        default:
          return spec;
      }
    }, {});

    return new VextabMeasureSpec(params['KEY'], params['TIME_SIGNATURE']);
  }

  /**
   * Uses the path instance variable to create a new VextabStruct instance.
   * 
   * @returns {VextabStruct}
   */
  createVextabStruct() {
    return new VextabStruct(this.vextab, this.path);
  }

  /**
   * The first note in the notes array should be a bar. Sets the bar instance variable.
   * 
   * @param {VextabStruct} note 
   */
  _handleFirstNote(note) {
    if (VextabStruct.typeof(note) !== 'BAR') {
      throw new Error(`expected first note to be a typeof BAR: ${JSON.stringify(note)}`);
    }

    this.bar = new Bar(note.type, this.createVextabStruct());
  }

  /**
   * Push whatever is in the instance variables keeping track of the current note properties,
   * then unset them.
   * 
   * @param {VextabStruct} note 
   */
  _handleLastNote() {
    this._pushMeasure();
    this.bar = undefined;
    this.rhythm = undefined;
    this.measureSpec = undefined;
    this.slices = [];
    this.path = '';
  }

  /**
   * Takes a note struct and populates the slices, bar, and rhythm instance variables.
   * 
   * @param {VextabStruct} note 
   * @returns {void}
   */
  _handleNote(note) {
    switch (VextabStruct.typeof(note)) {
      case 'BAR':
        this._pushMeasure();
        this.bar = new Bar(note.type, this.createVextabStruct());
        this.slices = [];
        break;
      case 'TIME':
        this.rhythm = new Rhythm(note.time, note.dot, null, this.createVextabStruct());
        this.slices.push(this.rhythm);
        break;
      case 'NOTE':
        this.slices.push(this._extractNote(note));
        break;
      case 'CHORD':
        this.slices.push(this._extractChord(note));
        break;
      case 'REST':
        this.slices.push(
          new Rest(note.params.position, this.rhythm.clone(), this.createVextabStruct())
        );
        break;
      case 'TUPLET':
        this.slices.push(
          new Tuplet(parseInt(note.params.tuplet, 10), this.createVextabStruct())
        );
        break;
      case 'ANNOTATIONS':
        this.slices.push(
          new Annotations(note.params, this.createVextabStruct())
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
  _pushMeasure() {
    this.measures.push(
      new Measure(this.timeSignature, this.slices, this.bar, this.measureSpec)
    );
  }

  /**
   * Creates a Note object from a struct
   * 
   * @param {VextabStruct} struct 
   * @returns {Note}
   */
  _extractNote(struct) {
    const [literal, octave] = this.tuning.getNoteForFret(struct.fret, struct.string).split('/');
    return new Note(literal, parseInt(octave, 10), this.createVextabStruct());
  }

  /**
   * Creates a Chord object from a struct
   * 
   * @param {VextabStruct} struct 
   * @returns {Chord}
   */
  _extractChord(struct) {
    const notes = struct.chord.map(note => this._extractNote(note));
    return new Chord(notes, this.createVextabStruct());
  }
}

export default VextabMeasureExtractor;
