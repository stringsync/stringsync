import { VEXTAB_STRINGS } from 'test';
import { Vextab } from 'models';
import { flatMap } from 'lodash';

const VEXTABS = VEXTAB_STRINGS.map(Vextab.decode).map(structs => new Vextab(structs, 1));

test('Line.prototype.structs is lossless', () => {
  VEXTABS.forEach(vextab => {
    const structs = flatMap(vextab.lines, line => line.struct.notes);
    const expected = flatMap(vextab.structs, struct => struct.notes);

    expect(structs).not.toBe(expected);
    expect(structs).toEqual(expected);
  });
});
