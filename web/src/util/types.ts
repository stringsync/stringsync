export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Ctor<T> = {
  new (...args: any[]): T;
};

export type OnlyKey<K extends string | number | symbol, V = any> = {
  [P in K]: V;
};

export type Replace<T extends object, K extends string | number | symbol, V extends any> = Omit<T, K> &
  {
    [P in K]: V;
  };

export enum AuthRequirement {
  NONE,
  LOGGED_IN,
  LOGGED_OUT,
  LOGGED_IN_AS_STUDENT,
  LOGGED_IN_AS_TEACHER,
  LOGGED_IN_AS_ADMIN,
}
