export type UniqueIndex<T> = { [key: string]: T | DuplicateKeyError };

export type OrderedValues<T> = Array<T | DuplicateKeyError | MissingKeyError>;

export interface KeyValue<V> {
  key: string | number;
  value: V;
}

export class DuplicateKeyError extends Error {
  constructor(keyName: string, key: string) {
    super(`duplicate key for ${keyName} = ${key}`);
  }
}

export class MissingKeyError extends Error {
  constructor(keyName: string, key: string) {
    super(`missing key for ${keyName} = ${key}`);
  }
}
