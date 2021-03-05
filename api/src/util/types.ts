export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type OnlyKey<K extends string | number | symbol, V = any> = {
  [P in K]: V;
};

export type Replace<T extends object, K extends string | number | symbol, V extends any> = Omit<T, K> &
  {
    [P in K]: V;
  };
