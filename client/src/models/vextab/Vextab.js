import {
  vextabDecoder as VextabDecoder,
  VextabEncoder,
  VextabMeasureExtractor,
  VextabRenderer,
  VextabStruct
} from './';
import { chunk, merge, takeRight } from 'lodash';
import { Measure, Line, Note, TimeSignature, Bar, Rhythm, Chord, Rest } from 'models';
import { Flow } from 'vexflow';

/**
 * The Vextab is the encoding used to store instructions on how to draw, animate, and edit
 * a score in StringSync. It is based on VextabStructs, which is the caller's
 * responsibility to construct. Using traditional Vextab grammar, one can use
 * Vextab.decode to produce the VextabStructs. See http://www.vexflow.com/vextab/tutorial.html
 * for the traditional grammar.
 * 
 * The initial render lifecycle of a Vextab is as follows:
 *  1. Decode a vextabString into vextabStructs
 *  2. Create vextabMeasures from the vextabStructs
 *  3. Create vextabLines from the vextabMeasures
 *  4. Create canvases that each point to a vextabLine
 *  5. Create vextab Artists
 *  6. Hydrate vextab Artists
 *  7. Create notes, measures, and lines
 *  8. Can now call vextab.render
 * 
 * Renderers live at the line (not VextabLine) level.
 * 
 * Do not change the internal state of Vextab. Instead, clone the structs member, update the clone,
 * and create a new Vextab instance.
 */
class Vextab {
  /**
   * Decodes a VextabString into an array of VextabStructs. It is the inverse of
   * Vextab.prototype.toString.
   *
   * @param {string} vextabString
   * @return {VextabStruct[]}
   */
  static decode(vextabString) {
    return VextabDecoder.parse(vextabString);
  }

  /**
   * @param {VextabStruct[]} structs
   * @param {number} measuresPerLine
   */
  constructor(structs, measuresPerLine, tuning = new Flow.Tuning()) {
    this.tuning = tuning;

    this._structs = Object.freeze(structs);
    this._measuresPerLine = measuresPerLine;
    this._measures = undefined;
    this._lines = undefined;
  }

  /**
   * Returns a clone of structs instance variable.
   * 
   * @return {VextabStruct[][]}
   */
  get structs() {
    return merge([], this._structs); 
  }

  get measuresPerLine() {
    return this._measuresPerLine;
  }

  get measures() {
    if (this._measures) {
      return this._measures;
    }

    this._measures = [];

    this.structs.forEach(struct => {
      const timeStruct = struct.options.filter(option => VextabStruct.typeof(option) === 'TIME_SIGNATURE')[0];
      const [upper, lower] = timeStruct.value.split('/');
      const timeSignature = new TimeSignature(upper, lower);

      let slices = [];
      let bar;
      let rhythm = new Rhythm(4, false);
      struct.notes.forEach((note, ndx) => {
        if (ndx === 0) {
          if (VextabStruct.typeof(note) !== 'BAR') {
            throw new Error(`expected first note to be a typeof BAR: ${JSON.stringify(note)}`);
          }

          bar = new Bar(note.type);
          return;
        }

        switch (VextabStruct.typeof(note)) {
          case 'BAR':
            this._measures.push(new Measure(timeSignature, slices, bar));
            bar = new Bar(note.type);
            slices = [];
            break;
          case 'TIME':
            rhythm = new Rhythm(note.time, note.dot);
            break;
          case 'NOTE':
            const [literal, octave] = this.tuning.getNoteForFret(note.fret, note.string).split('/');
            slices.push(new Note(literal, parseInt(octave, 10), rhythm.clone()));
            break;
          case 'CHORD':
            const chordNotes = note.chord.map(chordNote => {
              const [literal, octave] = this.tuning.getNoteForFret(chordNote.fret, chordNote.string).split('/');
              return new Note(literal, parseInt(octave, 10), rhythm.clone());
            });
            slices.push(new Chord(chordNotes));
            break;
          case 'REST':
            slices.push(new Rest(note.params.position, rhythm.clone()));
            break;
          case 'TUPLET':
            const tuplet = parseInt(note.params.tuplet, 10);
            takeRight(slices, tuplet).forEach(note => note.rhythm.tuplet = tuplet);
            break;
          default:
            break;
        }
      });
    });

    return this._measures;
  }

  get lines() {
    if (this._lines) {
      return this._lines;
    }

    return this._lines = chunk(this.measures, this.measuresPerLine).map(measures => new Line(measures));
  }
  
  set measuresPerLine(measuresPerLine) {
    this._measuresPerLine = measuresPerLine;
    this.lines = undefined;
  }

  /**
   * Renders the vextab onto the canvas element.
   * 
   * @param {HTMLCanvasElement} canvas 
   */
  render(canvas) {

  }

  /**
   * Encodes a VextabStruct array into a vextab string. It is the inverse of Vextab.decode.
   *
   * @return {string}
   */
  toString() {
    return VextabEncoder.encode(this.structs);
  }
}

export default Vextab;
