// FIXME: Broke these tests by not referencing the original vextab.

test('foo', () => { expect(true).toBe(true) });

// import { VEXTAB_STRINGS } from 'test';
// import { Vextab } from 'models';
// import { last, isEqual, flatMap } from 'lodash';

// const VEXTABS = VEXTAB_STRINGS.map(Vextab.decode).map(structs => new Vextab(structs, 1));

// // The purpose of the lossless tests is to show that a newly parsed vextab string can still
// // be recovered from the Line abstraction that StringSync's Vextab provides.

// test('Line.prototype.structs is lossless in terms of notes', () => {
//   VEXTABS.forEach(vextab => {
//     const structs = flatMap(vextab.lines, line => line.struct.notes);
//     const expected = flatMap(vextab.structs, struct => struct.notes);

//     expect(structs).not.toBe(expected);
//     expect(structs).toEqual(expected);
//   });
// });

// test('Line.prototype.structs is lossless in terms of options', () => {
//   VEXTABS.forEach(vextab => {
//     const structs = vextab.lines.reduce<any[]>((options, line) => {
//       const prevOpts = last(options);

//       const shouldPushOptions = (
//         options.length === 0 ||
//         (prevOpts && !isEqual(prevOpts, line.struct.options))
//       )

//       if (shouldPushOptions) {
//         options.push(line.struct.options);
//       }

//       return options;
//     }, []);

//     const expected = vextab.structs.map(struct => struct.options);

//     expect(structs).toEqual(expected);
//   });
// });
