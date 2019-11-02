import { alignOneToOne } from './alignOneToOne';

const KEY1 = 'KEY1';
const KEY2 = 'KEY2';
const KEY3 = 'KEY3';

const VAL1 = 'VAL1';
const VAL2 = 'VAL2';
const VAL3 = 'VAL3';

const identity = <T>(x: T) => x;
const noop: any = () => {};

test('aligns keys with values', (done) => {
  const keys = [KEY1, KEY2, KEY3];
  const values = [VAL3, VAL1, VAL2];

  const alignedValues = alignOneToOne(keys, values, {
    getKey: (value) => {
      switch (value) {
        case VAL1:
          return KEY1;
        case VAL2:
          return KEY2;
        case VAL3:
          return KEY3;
        default:
          return '';
      }
    },
    getUniqueIdentifier: identity,
    getMissingValue: noop,
  });

  expect(alignedValues).toEqual([VAL1, VAL2, VAL3]);
  done();
});
