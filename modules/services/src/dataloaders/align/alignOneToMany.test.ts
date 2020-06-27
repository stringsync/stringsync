import { alignOneToMany } from './alignOneToMany';
import { noop } from '@stringsync/common';

interface Value {
  id: number;
  key: string;
}

const KEY1 = 'KEY1';
const KEY2 = 'KEY2';

const VAL1 = { id: 1, key: KEY1 };
const VAL2 = { id: 2, key: KEY2 };
const VAL3 = { id: 3, key: KEY1 };

const getKey = (value: Value) => value.key;
const getId = (value: Value) => value.id;

it('aligns keys with values', () => {
  const keys = [KEY1, KEY2];
  const values = [VAL1, VAL2, VAL3];

  const actual = alignOneToMany(keys, values, {
    getKey,
    getUniqueIdentifier: getId,
    getMissingValue: noop,
  });

  expect(actual).toEqual([[VAL1, VAL3], [VAL2]]);
});

it('dedups values', () => {
  const keys = [KEY1, KEY2];
  const values = [VAL1, VAL2, VAL3, VAL1, VAL1, VAL3];

  const actual = alignOneToMany(keys, values, {
    getKey,
    getUniqueIdentifier: getId,
    getMissingValue: noop,
  });

  expect(actual).toEqual([[VAL1, VAL3], [VAL2]]);
});

it('handles missing values', () => {
  const keys = [KEY2];
  const values = [VAL1, VAL3];
  const getMissingValue = (key: any) => Symbol.for(key);

  const actual = alignOneToMany(keys, values, {
    getKey,
    getUniqueIdentifier: getId,
    getMissingValue,
  });

  expect(actual).toEqual([Symbol.for(KEY2)]);
});
