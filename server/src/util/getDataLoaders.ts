import DataLoader from 'dataloader';
import { NotationType, UserType } from '../resolvers/schema';
import { Sequelize } from 'sequelize/types';
import { getUserType } from './getUserType';
import { UserModel } from '../models/UserModel';

export interface DataLoaders {
  usersById: DataLoader<number, UserType>;
  notationsByUserId: DataLoader<number, NotationType[]>;
}

type UniqueIndex<T> = { [key: string]: T | DuplicateKeyError };

type OrderedValues<T> = Array<T | DuplicateKeyError | MissingKeyError>;

interface KeyValue<V> {
  key: string | number;
  value: V;
}

export class DuplicateKeyError extends Error {
  constructor(keyName, key) {
    super(`duplicate key for ${keyName} = ${key}`);
  }
}

export class MissingKeyError extends Error {
  constructor(keyName, key) {
    super(`missing key for ${keyName} = ${key}`);
  }
}

const indexUniquelyBy = <V>(
  keyName: string,
  objects: KeyValue<V>[]
): UniqueIndex<V> => {
  return objects.reduce<UniqueIndex<V>>((memo, object) => {
    const key = object.key;
    if (key in memo) {
      memo[key] = new DuplicateKeyError(keyName, key);
    } else {
      memo[key] = object.value;
    }
    return memo;
  }, {});
};

const getOrderedDataLoaderValues = <K, V>(
  keyName: string,
  keys: Array<number | string>,
  unorderedValues: KeyValue<V>[]
): OrderedValues<V> => {
  const valuesByKey = indexUniquelyBy(keyName, unorderedValues);
  const len = keys.length;
  const orderedValues: OrderedValues<V> = new Array(len);
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
  usersById: new DataLoader(async (ids) => {
    const userRecords = await UserModel.findAll({ where: { id: ids } });
    const users = userRecords.map((userRecord) => {
      const user = getUserType(userRecord);
      return { key: user.id, value: user };
    });

    return getOrderedDataLoaderValues('id', ids, users);
  }),
  notationsByUserId: new DataLoader(async (userIds) => {
    const notations = userIds.map((userId) => {
      return {
        key: userId,
        value: [{ id: userId }, { id: userId }],
      };
    });
    return getOrderedDataLoaderValues('userId', userIds, notations);
  }),
});
