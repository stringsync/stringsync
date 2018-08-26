import { groupBy, get, flatMap, takeRight } from 'lodash';
import { Flow } from 'vexflow';
import { Struct as VextabStruct } from 'models/vextab';
import {
  Annotations, Bar, Chord, Key,Line,  Measure,
  Note, Rest, Rhythm, TimeSignature, Tuplet, 
  Vextab, VextabElement
} from 'models';

interface IMeasureGrouping {
  bar: Bar;
  elements: VextabElement[];
}

const { Tuning } = Flow;

/**
 * This class creates Vextab instances. It provides all the logic for creating the
 * StringSync data structures, namely: Vextab elements, measures, and lines.
 */
export class Factory {
  public static DEFAULT_KEY_NOTE_STR = 'C/0';
  public static DEFAULT_TIME_SIGNATURE_STR = '4/4';

  public staves: Vextab.Parsed.IStave[];
  public tuning: any;
  public measuresPerLine: number;
  public width: number; 

  constructor(staves: Vextab.Parsed.IStave[], tuning: typeof Tuning, measuresPerLine: number, width: number) {
    this.staves = staves;
    this.tuning = tuning;
    this.measuresPerLine = measuresPerLine;
    this.width = width;
  }

  public newInstance(): Vextab {
    return new Vextab(this.lines, this.measuresPerLine, this.width, this.tuning);
  }

  private get lines(): Line[] {
    // groups of VextabElements that will belong to the same measure
    const lines = this.measures.reduce((groups, measure, ndx) => {
      const group = groups[groups.length - 1];
      const prevMeasure = measure[ndx - 1];

      if (measure.specHash === get(prevMeasure, 'specHash')) {
        group.push(measure);
      } else {
        groups.push([measure]);
      }

      return groups;
    }, [] as Measure[][]);

    return lines.map(measures => new Line(measures));
  }

  private get measures(): Measure[] {
    // groups of VextabElements that will belong to the same measure
    const measures = this.elementsWithBars.reduce((groups, element) => {
      const group = groups[groups.length - 1];

      if (element instanceof Bar) {
        groups.push({ bar: element, elements: [] });
      } else {
        group.elements.push(element);
      }

      return groups;
    }, [] as IMeasureGrouping[]);

    return measures.map(measure => new Measure(measure.bar, measure.elements));
  }

  private get elementsWithBars(): Array<VextabElement | Bar> {
    return flatMap(this.staves, stave => {
      const staveOptions = groupBy(stave.options, VextabStruct.typeof);

      // key and timeSignature are used to construct Bar objects
      const keyNoteStr = get(staveOptions, 'KEY[0].value', Factory.DEFAULT_KEY_NOTE_STR) as string;
      const keyNote = Note.from(keyNoteStr);
      const key = new Key(keyNote);

      const timeSignatureStr = get(staveOptions, 'TIME_SIGNATURE[0].value', Factory.DEFAULT_TIME_SIGNATURE_STR) as string;
      const [upper, lower] = timeSignatureStr.split('/').map(str => parseInt(str, 10));
      const timeSignature = new TimeSignature(upper, lower);

      // handle the notes array of the stave
      // staveNote is a parsed Vextab struct, not a Vexflow data structure
      let rhythm = new Rhythm('4', false); // We will reassign this on TIME staveNotes
      return stave.notes.reduce((elements, staveNote, ndx) => {
        // This is the element we will push into the elements array
        let element: VextabElement | Bar | void;

        switch (VextabStruct.typeof(staveNote)) {
          case 'BAR':
            const bar = staveNote as Vextab.Parsed.IBar;
            element = new Bar(bar.type, key, timeSignature);
            break;

          case 'TIME':
            const time = staveNote as Vextab.Parsed.ITime;
            rhythm = new Rhythm(time.time, time.dot);
            break;

          case 'NOTE':
            const position = staveNote as Vextab.Parsed.IPosition;
            element = this.getNote(position, rhythm.clone());
            break;

          case 'CHORD':
            const positions = staveNote as Vextab.Parsed.IChord;
            element = this.getChord(positions, rhythm.clone());
            break;

          case 'REST':
            const rest = staveNote as Vextab.Parsed.IRest;
            element = new Rest(rest.params.position, rhythm.clone());
            break;

          case 'TUPLET':
            // In the case of a tuplet, we set a reference to the tuplet on each non bar element rhythm
            const tupletStruct = staveNote as Vextab.Parsed.ITuplet;
            const tuplet = new Tuplet(parseInt(tupletStruct.params.tuplet, 10));

            // get to the tuplet rhythms in a clear way
            const nonBarElements = elements.filter(el => el.type !== 'BAR') as Array<Note | Chord | Rest>;
            const tupletElements = takeRight(nonBarElements, tuplet.value);
            const rhythms = tupletElements.map(el => el.rhythm);

            if (rhythms.length !== tuplet.value) {
              throw new Error(`not enough elements to satisfy a tuplet of ${tuplet.value}`);
            }

            tupletElements.forEach(el => el.rhythm.tuplet = tuplet.clone());
            break;

          case 'ANNOTATIONS':
            const annotations = staveNote as Vextab.Parsed.IAnnotations;
            const prevElement = elements[ndx - 1];

            if (!prevElement) {
              throw new Error('expected an element to associate the annotations with');
            }

            prevElement.annotations.push(new Annotations(annotations.params));
            break;

          default:
            throw new Error(`unknown parsed struct: ${JSON.stringify(staveNote)}`);
        }

        if (element) {
          elements.push(element);
        }

        return elements;
      }, [] as Array<VextabElement | Bar>);
    });
  }

  private getNote(parsed: Vextab.Parsed.IPosition, rhythm: Rhythm): Note {
    // First, ensure that the fret and str are valid
    const fret = parseInt(parsed.fret, 10);
    const str = parseInt(parsed.string, 10);

    if (isNaN(fret) || isNaN(str)) {
      throw new Error(`expected fret and string values to be numbers: ${JSON.stringify(parsed)}`);
    }

    const [literal, octave] = this.tuning.getNoteForFret(fret.toString(), str.toString()).split('/');

    return new Note(literal, parseInt(octave, 10), {
      articulation: parsed.articulation,
      decorator: parsed.decorator,
      rhythm
    });
  }

  private getChord(parsed: Vextab.Parsed.IChord, rhythm: Rhythm): Chord {
    const notes = parsed.chord.map(note => this.getNote(note, rhythm));
    return new Chord(notes, {
      articulation: parsed.articulation,
      decorator: parsed.decorator,
      rhythm
    });
  }
}
