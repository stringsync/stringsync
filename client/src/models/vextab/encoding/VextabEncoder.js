import { compact } from 'lodash';
import { VextabStruct } from 'models';

class VextabEncodingError extends Error {}

const error = struct => {
  new VextabEncodingError(`could not handle struct: ${JSON.stringify(struct)}`)
}

// Performs the reverse operation of the VextabDecoder. That is, from an array of VextabStructs,
// encode them into a Vextab string.
class VextabEncoder {
  static encode(vextabStructs) {
    return new VextabEncoder(vextabStructs).toString();
  }

  constructor(structs) {
    this.structs = structs;
  }

  /**
   * Encodes the vextab structs into a vextab string.
   * 
   * @return {string}
   */
  toString() {
    const vextabStringGroups = this.structs.map(struct => {
      switch (VextabStruct.typeof(struct)) {
        case 'TABSTAVE':
          return this._encodeTabstave(struct);
        default:
          throw error(struct);
      }
    });

    const deepJoin = array => array.reduce((str, element) => {
      if (Array.isArray(element)) {
        return `${str}\n${deepJoin(element)}`;
      } else {
        return `${str}\n${element}`;
      }
    }, '');

    return deepJoin(vextabStringGroups);
  }

  /**
   * Encodes a tabstave. A tabstave is identified by a vextabStruct having a property called
   * element, and that property value is equal to 'tabstave'.
   * 
   * @param {VextabStruct} tabstave
   * @return {string[]}
   * @private
   */
  _encodeTabstave(tabstave) {
    return compact([
      'tabstave',
      this._encodeOptions(tabstave.options),
      this._encodeNotes(tabstave.notes),
      this._encodeText(tabstave.text)
    ]);
  }

  /**
   * Encodes a tabstave's options. Options are identified by being the options key-value pair
   * in a tabstave struct. See VextabEncoder.prototype._encodeTabstave.
   * 
   * @param {VextabStruct} options 
   * @return {string[]}
   * @private
   */
  _encodeOptions(options) {
    return options.length > 0
      ? options.map(option => `${option.key}=${option.value}`)
      : null;
  }

  /**
   * 
   * @param {VextabStruct} text
   * @return {string[]}
   */
  _encodeText(texts) {
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
   * @param {VextabStruct} notes 
   * @return {string[]}
   * @private
   */
  _encodeNotes(notes) {
    // create the measure groups
    let ndx = -1;
    const measures = [];
    notes.forEach(note => {
      if (VextabStruct.typeof(note) === 'BAR') {
        ndx++;
      }
      measures[ndx] = measures[ndx] || [];
      measures[ndx].push(note);
    });

    // transform the measure groups into vextab strings
    return measures.map(measure => {
      const vextabStrings = measure.map(struct => {
        switch (VextabStruct.typeof(struct)) {
          case 'BAR':
            return this._encodeBar(struct);
          case 'ANNOTATIONS':
            return this._encodeAnnotations(struct);
          case 'TUPLET':
            return this._encodeTuplet(struct);
          case 'REST':
            return this._encodeRest(struct);
          case 'TIME':
            return this._encodeTime(struct);
          case 'NOTE':
            return this._encodeNote(struct);
          case 'CHORD':
            return this._encodeChord(struct);
          default:
            error(struct);
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
   * @param {VextabStruct} bar 
   * @return {string}
   * @private
   */
  _encodeBar(bar) {
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
   * @param {VextabStruct} annotations 
   * @return {string}
   * @private
   */
  _encodeAnnotations(annotations) {
    // FIXME: Copy the logic from https://github.com/0xfe/vextab/blob/master/src/artist.coffee#L544
    // Right now, it only supports 'simple' annotations.
    return `$${annotations.params.join(' ')}$`;
  }

  /**
   * Encodes a tuplet.
   * 
   * @param {VextabStruct} tuplet 
   * @return {string}
   * @private
   */
  _encodeTuplet(tuplet) {
    return `^${tuplet.params.tuplet}^`;
  }

  /**
   * Encodes a rest.
   * 
   * @param {VextabStruct} rest 
   * @return {string}
   * @private
   */
  _encodeRest(rest) {
    const { position } = rest.params;
    return `#${position !== 0 ? position : ''}#`;
  }

  /**
   * Encodes a time note.
   * 
   * @param {VextabStruct} time
   * @return {string}
   * @private
   */
  _encodeTime(time) {
    return `:${time.time}${time.dot ? 'd' : ''}`;
  }

  /**
   * Encodes a guitar position.
   * 
   * @param {VextabStruct} note 
   * @return {string}
   * @private
   */
  _encodeNote(note) {
    const { articulation, decorator } = note;
    return `${articulation || ''}${note.fret}${decorator || ''}/${note.string}`;
  }

  /**
   * Encodes a guitar chord.
   * 
   * @param {VextabStrict} chord 
   * @return {string}
   * @private
   */
  _encodeChord(chord) {
    const { articulation, decorator } = chord;
    return `${articulation || ''}(${chord.chord.map(note => this._encodeNote(note)).join('.')})${decorator || ''}`;
  }  
}

export default VextabEncoder;
