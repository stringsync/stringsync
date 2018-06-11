
import { at } from 'lodash';
import { Vextab } from 'models';

class VextabStruct {
  static typeof(struct) {
    const { element } = struct;
    
    if (element === 'tabstave') {
      return 'TABSTAVE';
    } else if (element === 'stave') {
      return 'STAVE';
    } 
    
    const { command } = struct;

    if (command === 'bar') {
      return 'BAR';
    } else if (command === 'tuplet') {
      return 'TUPLET';
    } else if (command === 'rest') {
      return 'REST';
    } else if (command === 'bar') {
      return 'BAR';
    } else if (command === 'annotations') {
      return 'ANNOTATIONS';
    }

    const { key } = struct;

    if (key === 'clef') {
      return 'CLEF';
    } else if (key === 'notation') {
      return 'NOTATION';
    } else if (key === 'key') {
      return 'KEY';
    } else if (key === 'time') {
      return 'TIME_SIGNATURE';
    }
    
    const keys = new Set(Object.keys(struct));

    if (keys.has('time')) {
      return 'TIME';
    } else if (keys.has('fret') && keys.has('string')) {
      return 'NOTE';
    } else if (keys.has('chord')) {
      return 'CHORD';
    }
  }

  /**
   * @param {Vextab} vextab 
   * @param {string} path 
   */
  constructor(vextab, path) {
    this.vextab = vextab;
    this.path = path;
  }

  /**
   * Returns the raw vextab struct.
   * 
   * @returns
   */
  get raw() {
    return at(this.vextab.structs, this.path)[0];
  }
}

export default VextabStruct;
