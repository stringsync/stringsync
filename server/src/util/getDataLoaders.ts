import DataLoader from 'dataloader';
import { NotationType, UserType } from '../resolvers/schema';
import { Sequelize } from 'sequelize/types';
import { getUserType } from './getUserType';

export interface DataLoaders {
  usersDataLoader: DataLoader<number, UserType>;
  notationsDataLoader: DataLoader<number, NotationType>;
}

export class DuplicateKeyError extends Error {
  constructor(keyName, key) {
    super(`duplicate key for ${keyName}: ${key}`);
  }
}

export class MissingKeyError extends Error {
  constructor(keyName, key) {
    super(`missing key for ${keyName}: ${key}`);
  }
}

type UniqueIndex<T> = { [key: string]: T | DuplicateKeyError };

const indexUniquelyBy = <T>(keyName: string, objects: T[]): UniqueIndex<T> => {
  return objects.reduce<UniqueIndex<T>>((memo, object) => {
    const key = objects[keyName];
    if (key in memo) {
      memo[key] = new DuplicateKeyError(keyName, key);
    } else {
      memo[key] = object;
    }
    return memo;
  }, {});
};

type OrderedValues<T> = Array<T | DuplicateKeyError | MissingKeyError>;

const getOrderedDataLoaderValues = <T, K>(
  keyName: string,
  keys: Array<number | string>,
  unorderedValues: T[]
): OrderedValues<T> => {
  const valuesByKey = indexUniquelyBy(keyName, unorderedValues);
  const len = keys.length;
  const orderedValues: OrderedValues<T> = new Array(len);
  for (let ndx = 0; ndx < len; ndx++) {
    const key = keys[ndx];
    if (key in valuesByKey) {
      const value = valuesByKey[key];
      orderedValues[ndx] = value;
    } else {
      orderedValues[ndx] = new MissingKeyError(keyName, key);
    }
  }
  return orderedValues;
};

export const getDataLoaders = (db: Sequelize): DataLoaders => ({
  usersDataLoader: new DataLoader(async (ids) => {
    const userRecords = await db.models['User'].findAll({ where: { id: ids } });
    const users = userRecords.map(getUserType);
    return getOrderedDataLoaderValues('id', ids, users);
  }),
  notationsDataLoader: new DataLoader(async (ids) => {
    const notations = ids.map((id) => ({ id }));
    return getOrderedDataLoaderValues('id', ids, notations);
  }),
});
