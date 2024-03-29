export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Ctor<T> = {
  new (...args: any[]): T;
};

export type OnlyKey<K extends string | number | symbol, V = any> = {
  [P in K]: V;
};

export type Replace<T extends object, K extends string | number | symbol, V extends any> = Omit<T, K> & {
  [P in K]: V;
};

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export enum AuthRequirement {
  NONE,
  LOGGED_IN,
  LOGGED_OUT,
  LOGGED_IN_AS_STUDENT,
  LOGGED_IN_AS_TEACHER,
  LOGGED_IN_AS_ADMIN,
}

export type Await<T> = T extends PromiseLike<infer U> ? U : T;

export type ukeyof<T> = T extends T ? keyof T : never;

export type ValuesOf<T> = T[keyof T];

export enum PromiseStatus {
  Idle = 'Idle',
  Pending = 'Pending',
  Resolved = 'Resolved',
  Rejected = 'Rejected',
}

export type PromiseState<T> = {
  result: T | undefined;
  error: Error | undefined;
  status: PromiseStatus;
};

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

export interface PromiseResolver<T> {
  resolve: (result: T) => void | PromiseLike<void>;
  reject: (error: Error) => void;
  cancel: () => void;
}

export type Dimensions = {
  width: number;
  height: number;
};

export type FlatSerializable = {
  [key: string]: string | number | boolean | null;
};
