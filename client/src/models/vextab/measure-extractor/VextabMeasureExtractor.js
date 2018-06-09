import {
  Measure, Line, Note,
  TimeSignature, Bar, Rhythm,
  Chord, Rest, VextabStruct
} from 'models';
import { Flow } from 'vexflow';
import { takeRight } from 'lodash';

class VextabMeasureExtractor {
  static extract(structs) {
    return new VextabMeasureExtractor(structs).extract();
  }
  
  constructor(structs, tuning = new Flow.Tuning()) {
    this.structs = structs;
    this.measures = [];

    this.slices = [];
    this.rhythm = new Rhythm(4, false);
    this.bar = undefined;
    this.timeSignature = undefined;
    this.tuning = tuning;
  }

  /**
   * Primary interface for the measure extractor.
   * 
   * @return {Measure[]}
   */
  extract() {
    this.structs.forEach(struct => {
      this.timeSignature = this._extractTimeSignature(struct);

      struct.notes.forEach((note, ndx) => {
        if (ndx === 0) {
          this._handleFirstNote(note);
          return;
        }

        this._handleNote(note);        

        if (ndx === struct.notes.length - 1) {
          this._handleLastNote();
        }
      });
    });
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

    this.bar = new Bar(note.type);
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
    this.slices = [];
  }

  /**
   * Takes a note struct and populates the slices, bar, and rhythm instance variables.
   * 
   * @param {VextabStruct} note 
   * @return {void}
   */
  _handleNote(note) {
    switch (VextabStruct.typeof(note)) {
      case 'BAR':
        this._pushMeasure();
        this.bar = new Bar(note.type);
        this.slices = [];
        break;
      case 'TIME':
        this.rhythm = new Rhythm(note.time, note.dot);
        break;
      case 'NOTE':
        this.slices.push(this._extractNote(note));
        break;
      case 'CHORD':
        this.slices.push(this._extractChord(note));
        break;
      case 'REST':
        this.slices.push(new Rest(note.params.position, this.rhythm.clone()));
        break;
      case 'TUPLET':
        const tuplet = parseInt(note.params.tuplet, 10);
        takeRight(this.slices, tuplet).forEach(note => note.rhythm.tuplet = tuplet);
        break;
      default:
        break;
    }
  }

  /**
   * Creates a measure and pushes it into the measures instance variable
   * 
   * @return {void}
   */
  _pushMeasure() {
    this.measures.push(new Measure(this.timeSignature, this.slices, this.bar));
  }

  /**
   * Creates a TimeSignature object from a struct
   * 
   * @param {VextabStruct} struct
   * @return {TimeSignature}
   */
  _extractTimeSignature(struct) {
    const timeStruct = struct.options.filter(option => VextabStruct.typeof(option) === 'TIME_SIGNATURE')[0];
    const [upper, lower] = timeStruct.value.split('/');
    return new TimeSignature(upper, lower);
  }

  /**
   * Creates a Note object from a struct
   * 
   * @param {VextabStruct} struct 
   * @return {Note}
   */
  _extractNote(struct) {
    const [literal, octave] = this.tuning.getNoteForFret(struct.fret, struct.string).split('/');
    return new Note(literal, parseInt(octave, 10), this.rhythm.clone());
  }

  /**
   * Creates a Chord object from a struct
   * 
   * @param {VextabStruct} struct 
   * @return {Chord}
   */
  _extractChord(struct) {
    const notes = struct.chord.map(note => this._extractNote(note));
    return new Chord(notes);
  }
}

export default VextabMeasureExtractor;
