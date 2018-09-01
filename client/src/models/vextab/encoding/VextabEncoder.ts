import { compact } from 'lodash';
import { Struct } from 'models';

const error = (struct: any) => {
  return new Error(`could not handle struct: ${JSON.stringify(struct)}`)
}

// Performs the reverse operation of the VextabDecoder. That is, from an array of Structs,
// encode them into a Vextab string.
export class VextabEncoder {
  public static encode(Structs: Vextab.Parsed.Struct[]) {
    return new VextabEncoder(Structs).toString();
  }

  public readonly structs: Vextab.Parsed.Struct[];

  constructor(structs: Vextab.Parsed.Struct[]) {
    this.structs = structs;
  }

  /**
   * Encodes the vextab structs into a vextab string.
   * 
   * @returns {string}
   */
  public toString(): string {
    const vextabStringGroups = this.structs.map(struct => {
      switch (Struct.typeof(struct)) {
        case 'TABSTAVE':
          return this.encodeTabstave(struct as Vextab.Parsed.ITabstave);
        default:
          throw error(struct);
      }
    });

    const deepJoin = (array: any[]): string => array.reduce((str: string, element: any) => {
      if (Array.isArray(element)) {
        return `${str}\n${deepJoin(element)}`;
      } else {
        return `${str}\n${element}`;
      }
    }, '');

    return deepJoin(vextabStringGroups);
  }

  /**
   * Encodes a tabstave. A tabstave is identified by a Struct having a property called
   * element, and that property value is equal to 'tabstave'.
   * 
   * @param {Struct} tabstave
   * @returns {string[]}
   * @private
   */
  private encodeTabstave(tabstave: Vextab.Parsed.ITabstave) {
    return compact([
      'tabstave',
      this.encodeOptions(tabstave.options || []),
      this.encodeNotes(tabstave.notes || []),
      this.encodeText(tabstave.text || [])
    ]);
  }

  /**
   * Encodes a tabstave's options. Options are identified by being the options key-value pair
   * in a tabstave struct. See VextabEncoder.prototype._encodeTabstave.
   * 
   * @param {Struct} options 
   * @returns {string[]}
   * @private
   */
  private encodeOptions(options: Vextab.Parsed.IOption[]) {
    return options.length > 0
      ? options.map(option => `${option.key}=${option.value}`)
      : null;
  }

  /**
   * 
   * @param {Struct} text
   * @returns {string[]}
   */
  private encodeText(texts: Vextab.Parsed.IText[]) {
    return texts.length > 0
      ? `text ${texts.map(text => text.text.repeat(1))}`
      : null;
  }

  /**
   * Encodes a tabstave's notes. Notes are identified by being the notes key-value pair in a
   * tabstave struct. See VextabEncoder.prototype._encodeTabstave.
   * 
   * StringSync expects a bar to contain a bunch of notes, representing the measure. In order
   * to improve encoding consistency, notes are grouped by bars, then encoded as groups. The
   * return value is essentially an array of measures encoded as vextab strings.
   * 
   * @param {Struct} notes 
   * @returns {string[]}
   * @private
   */
  private encodeNotes(notes: Vextab.Parsed.Note[]) {
    // create the measure groups
    let ndx = -1;
    const measures: Vextab.Parsed.Note[][] = [];
    notes.forEach(note => {
      if (Struct.typeof(note) === 'BAR') {
        ndx++;
      }
      measures[ndx] = measures[ndx] || [];
      measures[ndx].push(note);
    });

    // transform the measure groups into vextab strings
    return measures.map(measure => {
      const vextabStrings = measure.map(struct => {
        switch (Struct.typeof(struct)) {
          case 'BAR':
            return this.encodeBar(struct as Vextab.Parsed.IBar);
          case 'ANNOTATIONS':
            return this.encodeAnnotations(struct as Vextab.Parsed.IAnnotations);
          case 'TUPLET':
            return this.encodeTuplet(struct as Vextab.Parsed.ITuplet);
          case 'REST':
            return this.encodeRest(struct as Vextab.Parsed.IRest);
          case 'TIME':
            return this.encodeTime(struct as Vextab.Parsed.ITime);
          case 'NOTE':
            return this.encodeNote(struct as Vextab.Parsed.IPosition);
          case 'CHORD':
            return this.encodeChord(struct as Vextab.Parsed.IChord);
          default:
            return error(struct);
        }
      });

      return vextabStrings.length > 0
        ? `notes ${vextabStrings.join(' ')}`
        : null;
    });
  }

  /**
   * Encodes a bar note.
   * 
   * @param {Struct} bar 
   * @returns {string}
   * @private
   */
  private encodeBar(bar: Vextab.Parsed.IBar) {
    switch (bar.type) {
      case 'single':
        return '|';
      case 'double':
        return '=||';
      case 'end':
        return '=|=';
      case 'repeat-end':
        return '=:|';
      case 'repeat-begin':
        return '=|:';
      case 'repeat-both':
        return '=::';
      default:
        return error(bar);
    }
  }

  /**
   * Encodes an array of annotations.
   * 
   * @param {Struct} annotations 
   * @returns {string}
   * @private
   */
  private encodeAnnotations(annotations: Vextab.Parsed.IAnnotations) {
    // FIXME: Copy the logic from https://github.com/0xfe/vextab/blob/master/src/artist.coffee#L544
    // Right now, it only supports 'simple' annotations.
    return `$${annotations.params.join(' ')}$`;
  }

  /**
   * Encodes a tuplet.
   * 
   * @param {Struct} tuplet 
   * @returns {string}
   * @private
   */
  private encodeTuplet(tuplet: Vextab.Parsed.ITuplet) {
    return `^${tuplet.params.tuplet}^`;
  }

  /**
   * Encodes a rest.
   * 
   * @param {Struct} rest 
   * @returns {string}
   * @private
   */
  private encodeRest(rest: Vextab.Parsed.IRest) {
    const { position } = rest.params;
    return `#${position !== 0 ? position : ''}#`;
  }

  /**
   * Encodes a time note.
   * 
   * @param {Struct} time
   * @returns {string}
   * @private
   */
  private encodeTime(time: Vextab.Parsed.ITime) {
    return `:${time.time}${time.dot ? 'd' : ''}`;
  }

  /**
   * Encodes a guitar position.
   * 
   * @param {Struct} note 
   * @returns {string}
   * @private
   */
  private encodeNote(note: Vextab.Parsed.IPosition) {
    const { articulation, decorator } = note;
    return `${articulation || ''}${note.fret}${decorator || ''}/${note.string}`;
  }

  /**
   * Encodes a guitar chord.
   * 
   * @param {VextabStrict} chord 
   * @returns {string}
   * @private
   */
  private encodeChord(chord: Vextab.Parsed.IChord) {
    const { articulation, decorator } = chord;
    return `${articulation || ''}(${chord.chord.map(note => this.encodeNote(note)).join('.')})${decorator || ''}`;
  }
}

export default VextabEncoder;
