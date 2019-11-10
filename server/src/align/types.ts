export type KeyGetter<V> = (value: V) => number | string;

export type KeysGetter<V> = (value: V) => Array<number | string>;

export type UniqueIdentifierGetter<V> = (value: V) => number | string | symbol;

export type MissingValueGetter = (key: number | string) => any;

export class MissingValueError extends Error {
  constructor(key: string | number) {
    super(`missing value for key: ${key}`);
  }
}
