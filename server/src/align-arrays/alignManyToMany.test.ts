import { alignManyToMany } from './alignManyToMany';
import { identity, noop } from '../util';

const KEY1 = 'KEY1';
const KEY2 = 'KEY2';
const KEY3 = 'KEY3';

const VAL1 = 'VAL1';
const VAL2 = 'VAL2';
const VAL3 = 'VAL3';

const getKeys = (value: string) => {
  switch (value) {
    case VAL1:
      return [KEY1, KEY2];
    case VAL2:
      return [KEY1, KEY3];
    case VAL3:
      return [KEY1, KEY2, KEY3];
    default:
      return [];
  }
};

it('aligns keys with values', () => {
  const keys = [KEY1, KEY2, KEY3];
  const values = [VAL1, VAL2, VAL3];

  const actual = alignManyToMany(keys, values, {
    getKeys,
    getUniqueIdentifier: identity,
    getMissingValue: noop,
  });

  expect(actual).toEqual([
    [VAL1, VAL2, VAL3],
    [VAL1, VAL3],
    [VAL2, VAL3],
  ]);
});

it('dedups values', () => {
  const keys = [KEY1, KEY2, KEY3];
  const values = [VAL1, VAL2, VAL3, VAL2, VAL3, VAL3];

  const actual = alignManyToMany(keys, values, {
    getKeys,
    getUniqueIdentifier: identity,
    getMissingValue: noop,
  });

  expect(actual).toEqual([
    [VAL1, VAL2, VAL3],
    [VAL1, VAL3],
    [VAL2, VAL3],
  ]);
});

it('excludes missing values', () => {
  const keys = [KEY1, KEY2, KEY3];
  const values = [VAL1, VAL3];

  const actual = alignManyToMany(keys, values, {
    getKeys,
    getUniqueIdentifier: identity,
    getMissingValue: (key: any) => Symbol.for(key),
  });

  expect(actual).toEqual([[VAL1, VAL3], [VAL1, VAL3], [VAL3]]);
});
