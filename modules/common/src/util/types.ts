export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Ctor<T> = {
  new (...args: any[]): T;
};

export type OnlyKey<K extends string, V = any> = {
  [P in K]: V;
};
