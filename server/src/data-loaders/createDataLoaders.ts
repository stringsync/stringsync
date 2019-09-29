import DataLoader from 'dataloader';
import { NotationType, UserType } from '../resolvers/types';
import { Sequelize } from 'sequelize/types';
import { UserModel } from '../models/UserModel';
import { isDeepStrictEqual } from 'util';
import { asUserType } from '../casters/user/asUserType';

export interface DataLoaders {
  usersById: DataLoader<number, UserType>;
  notationsByUserId: DataLoader<number, NotationType[]>;
}

export type UniqueIndex<T> = { [key: string]: T | DuplicateKeyError };

export type OrderedValues<T> = Array<T | DuplicateKeyError | MissingKeyError>;

export interface KeyValue<V> {
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

export const indexUniquelyBy = <V>(
  keyName: string,
  objects: KeyValue<V>[]
): UniqueIndex<V> => {
  return objects.reduce<UniqueIndex<V>>((memo, object) => {
    const key = object.key;
    // If we have at least two objects that have the same keys but different values,
    // then we violate the 'uniquely' invariant of this function. It is valid for
    // more than one object to have the same key, as long as their values as equivalent,
    // based on util.isDeepStrictEqual.
    if (key in memo && !isDeepStrictEqual(object.value, memo[key])) {
      memo[key] = new DuplicateKeyError(keyName, key);
    } else {
      memo[key] = object.value;
    }
    return memo;
  }, {});
};

/**
 * This function enforces the invariant that the values array must be sorted the
 * same way as the keys array.
 */
export const getOrderedDataLoaderValues = <V>(
  keyName: string,
  keys: Array<number | string>,
  unorderedValues: Array<KeyValue<V>>
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

const createKeyValue = <V>(key: string | number, value: V): KeyValue<V> => ({
  key,
  value,
});

// TODO(jared) shard this into multiple files if this mapping becomes too big
export const createDataLoaders = (db: Sequelize): DataLoaders => ({
  usersById: new DataLoader(async (ids) => {
    const users = await UserModel.findAll({
      ...asUserType,
      where: { id: ids },
    });
    const userKeyValues = users.map((user) => createKeyValue(user.id, user));
    return getOrderedDataLoaderValues('id', ids, userKeyValues);
  }),
  notationsByUserId: new DataLoader(async (userIds) => {
    const notationKeyValues = userIds.map((userId) =>
      createKeyValue(userId, [{ id: userId }])
    );
    return getOrderedDataLoaderValues('userId', userIds, notationKeyValues);
  }),
});
