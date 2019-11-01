export type KeyGetter<V> = (value: V) => number | string;

export type KeysGetter<V> = (value: V) => Array<number | string>;

export type UniqueIdentifierGetter<V> = (value: V) => number | string | symbol;
