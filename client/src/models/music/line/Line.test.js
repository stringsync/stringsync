import { VEXTAB_STRINGS } from 'test';
import { Vextab } from 'models';
import { last, isEqual, flatMap } from 'lodash';

const VEXTABS = VEXTAB_STRINGS.map(Vextab.decode).map(structs => new Vextab(structs, 1));

test('Line.prototype.structs is lossless in terms of notes', () => {
  VEXTABS.forEach(vextab => {
    const structs = flatMap(vextab.lines, line => line.struct.notes);
    const expected = flatMap(vextab.structs, struct => struct.notes);

    expect(structs).not.toBe(expected);
    expect(structs).toEqual(expected);
  });
});

test('Line.prototype.structs is lossless in terms of options', () => {
  VEXTABS.forEach(vextab => {
    const structs = vextab.lines.reduce((options, line) => {
      const prevOpts = last(options);

      const shouldPushOptions = (
        options.length === 0 ||
        (prevOpts && !isEqual(prevOpts, line.struct.options))
      )

      if (shouldPushOptions) {
        options.push(line.struct.options);
      }

      return options;
    }, []);

    const expected = vextab.structs.map(struct => struct.options);

    expect(structs).toEqual(expected);
  });
});
