
import { isObject } from 'lodash';

class VextabStruct {
  static typeof(struct) {
    const { command, element } = struct;
    const keys = new Set(Object.keys(struct));
    
    if (element === 'tabstave') {
      return 'TABSTAVE';
    } else if (element === 'stave') {
      return 'STAVE';
    } else if (command === 'bar') {
      return 'BAR';
    } else if (command === 'tuplet') {
      return 'TUPLET';
    } else if (command === 'rest') {
      return 'REST';
    } else if (command === 'bar') {
      return 'BAR';
    } else if (command === 'annotations') {
      return 'ANNOTATIONS';
    } else if (keys.has('time')) {
      return 'TIME';
    } else if (keys.has('fret') && keys.has('string')) {
      return 'NOTE';
    } else if (keys.has('chord')) {
      return 'CHORD'
    } else {
      return null;
    }
  }
}

export default VextabStruct;
