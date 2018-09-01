export class Struct {
  public static typeof(struct: any) {
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

    return null;
  }
}
