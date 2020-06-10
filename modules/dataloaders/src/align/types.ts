export type KeyGetter<V> = (value: V) => number | string;

export type KeysGetter<V> = (value: V) => Array<number | string>;

export type UniqueIdentifierGetter<V> = (value: V) => number | string | symbol;

export type MissingValueGetter<M extends any> = (key: number | string) => M;

export class MissingValueError extends Error {
  constructor(key: string | number) {
    super(`missing value for key: ${key}`);
    Object.setPrototypeOf(this, MissingValueError.prototype);
  }
}
